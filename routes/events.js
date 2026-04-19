const express      = require('express');
const router       = express.Router();
const LoginEvent   = require('../models/LoginEvent');
const ThreatEvent  = require('../models/ThreatEvent');
const OnPremEvent  = require('../models/OnPremEvent');
const CloudEvent   = require('../models/CloudEvent');

// Login events
router.get('/login-events', async (req, res) => {
  try {
    const events = await LoginEvent.find().sort({ timestamp: -1 }).limit(100);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login summary
router.get('/login-summary', async (req, res) => {
  try {
    const total      = await LoginEvent.countDocuments();
    const failed     = await LoginEvent.countDocuments({ success: false });
    const today      = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = await LoginEvent.countDocuments({ timestamp: { $gte: today } });
    const devices    = await LoginEvent.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);
    res.json({ total, failed, todayCount, devices });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Threat events
router.get('/threat-events', async (req, res) => {
  try {
    const events = await ThreatEvent.find().sort({ timestamp: -1 }).limit(100);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Threat summary
router.get('/threat-summary', async (req, res) => {
  try {
    const total      = await ThreatEvent.countDocuments();
    const blocked    = await ThreatEvent.countDocuments({ blocked: true });
    const high       = await ThreatEvent.countDocuments({ threatLevel: 'high' });
    const today      = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = await ThreatEvent.countDocuments({ timestamp: { $gte: today } });
    res.json({ total, blocked, high, todayCount });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Hybrid summary
router.get('/hybrid-summary', async (req, res) => {
  try {
    const onPremTotal  = await OnPremEvent.countDocuments();
    const onPremFailed = await OnPremEvent.countDocuments({ success: false });
    const cloudTotal   = await CloudEvent.countDocuments();
    const cloudFailed  = await CloudEvent.countDocuments({ success: false });
    res.json({
      onPrem: { total: onPremTotal,  failed: onPremFailed },
      cloud:  { total: cloudTotal,   failed: cloudFailed  }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Hybrid events
router.get('/hybrid-events', async (req, res) => {
  try {
    const onPremEvents = await OnPremEvent.find().sort({ timestamp: -1 }).limit(50);
    const cloudEvents  = await CloudEvent.find().sort({ timestamp: -1 }).limit(50);
    res.json({ onPrem: onPremEvents, cloud: cloudEvents });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Full dashboard summary (single endpoint for frontend)
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const [
      totalLogins, failedLogins, todayLogins,
      totalThreats, blockedThreats, highThreats,
      onPremTotal, cloudTotal,
      recentEvents, recentThreats
    ] = await Promise.all([
      OnPremEvent.countDocuments() + CloudEvent.countDocuments(),
      OnPremEvent.countDocuments({ success: false }),
      OnPremEvent.countDocuments({ timestamp: { $gte: today } }),
      ThreatEvent.countDocuments(),
      ThreatEvent.countDocuments({ blocked: true }),
      ThreatEvent.countDocuments({ threatLevel: 'high' }),
      OnPremEvent.countDocuments(),
      CloudEvent.countDocuments(),
      [...await OnPremEvent.find().sort({ timestamp: -1 }).limit(5),
       ...await CloudEvent.find().sort({ timestamp: -1 }).limit(5)],
      ThreatEvent.find().sort({ timestamp: -1 }).limit(5)
    ]);

    res.json({
      logins:  { total: totalLogins, failed: failedLogins, today: todayLogins },
      threats: { total: totalThreats, blocked: blockedThreats, high: highThreats },
      hybrid:  { onPrem: onPremTotal, cloud: cloudTotal },
      recentEvents,
      recentThreats
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;