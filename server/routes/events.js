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
// Hybrid summary
router.get('/hybrid-summary', async (req, res) => {
  try {
    const db = require('../config/firebase');

    const onPremTotal  = await OnPremEvent.countDocuments();
    const onPremFailed = await OnPremEvent.countDocuments({ success: false });

    // Get cloud count from Firebase
    const cloudSnapshot       = await db.collection('cloudevents').get();
    const cloudFailedSnapshot = await db.collection('cloudevents')
      .where('success', '==', false).get();

    res.json({
      onPrem: { total: onPremTotal,            failed: onPremFailed },
      cloud:  { total: cloudSnapshot.size,     failed: cloudFailedSnapshot.size }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Hybrid events
router.get('/hybrid-events', async (req, res) => {
  try {
    const db = require('../config/firebase');

    const onPremEvents = await OnPremEvent.find().sort({ timestamp: -1 }).limit(50);

    // Get cloud events from Firebase
    const cloudSnapshot = await db.collection('cloudevents')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const cloudEvents = cloudSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ onPrem: onPremEvents, cloud: cloudEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Full dashboard summary (single endpoint for frontend)
// Hybrid summary
router.get('/hybrid-summary', async (req, res) => {
  try {
    const db = require('../config/firebase');

    const onPremTotal  = await OnPremEvent.countDocuments();
    const onPremFailed = await OnPremEvent.countDocuments({ success: false });

    // Get cloud count from Firebase
    const cloudSnapshot       = await db.collection('cloudevents').get();
    const cloudFailedSnapshot = await db.collection('cloudevents')
      .where('success', '==', false).get();

    res.json({
      onPrem: { total: onPremTotal,            failed: onPremFailed },
      cloud:  { total: cloudSnapshot.size,     failed: cloudFailedSnapshot.size }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Hybrid events
router.get('/hybrid-events', async (req, res) => {
  try {
    const db = require('../config/firebase');

    const onPremEvents = await OnPremEvent.find().sort({ timestamp: -1 }).limit(50);

    // Get cloud events from Firebase
    const cloudSnapshot = await db.collection('cloudevents')
      .orderBy('timestamp', 'desc')
      .limit(50)
      .get();

    const cloudEvents = cloudSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json({ onPrem: onPremEvents, cloud: cloudEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;