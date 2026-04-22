const express     = require('express');
const router      = express.Router();
const LoginEvent  = require('../models/LoginEvent');
const ThreatEvent = require('../models/ThreatEvent');
const OnPremEvent = require('../models/OnPremEvent');
const CloudEvent  = require('../models/CloudEvent');

// ─── Helper: try Firebase, fall back to MongoDB CloudEvent ────────────────────
async function getCloudEvents(limitN = 50) {
  try {
    const db = require('../config/firebase');
    const snap = await db.collection('cloudevents').orderBy('timestamp', 'desc').limit(limitN).get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch {
    return await CloudEvent.find().sort({ timestamp: -1 }).limit(limitN).lean();
  }
}

async function countCloudEvents(filter = {}) {
  try {
    const db = require('../config/firebase');
    let ref = db.collection('cloudevents');
    if (filter.success === false) ref = ref.where('success', '==', false);
    const snap = await ref.get();
    return snap.size;
  } catch {
    return await CloudEvent.countDocuments(filter);
  }
}

// ─── Login Events ─────────────────────────────────────────────────────────────
router.get('/login-events', async (req, res) => {
  try {
    const events = await LoginEvent.find().sort({ timestamp: -1 }).limit(100);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/login-summary', async (req, res) => {
  try {
    const total      = await LoginEvent.countDocuments();
    const failed     = await LoginEvent.countDocuments({ success: false });
    const today      = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = await LoginEvent.countDocuments({ timestamp: { $gte: today } });
    const devices    = await LoginEvent.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
    ]);
    res.json({ total, failed, todayCount, devices });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Threat Events ────────────────────────────────────────────────────────────
router.get('/threat-events', async (req, res) => {
  try {
    const events = await ThreatEvent.find().sort({ timestamp: -1 }).limit(100);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

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

// ─── Hybrid Events ────────────────────────────────────────────────────────────
router.get('/hybrid-events', async (req, res) => {
  try {
    const onPremEvents = await OnPremEvent.find().sort({ timestamp: -1 }).limit(50);
    const cloudEvents  = await getCloudEvents(50);
    res.json({ onPrem: onPremEvents, cloud: cloudEvents });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/hybrid-summary', async (req, res) => {
  try {
    const onPremTotal  = await OnPremEvent.countDocuments();
    const onPremFailed = await OnPremEvent.countDocuments({ success: false });
    const cloudTotal   = await countCloudEvents();
    const cloudFailed  = await countCloudEvents({ success: false });
    res.json({
      onPrem: { total: onPremTotal, failed: onPremFailed },
      cloud:  { total: cloudTotal,  failed: cloudFailed  },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Dashboard summary (single call for frontend) ─────────────────────────────
router.get('/dashboard-summary', async (req, res) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const [
      totalLogins, failedLogins, todayLogins,
      totalThreats, blockedThreats, highThreats,
      onPremTotal, onPremFailed,
      cloudTotal, cloudFailed,
    ] = await Promise.all([
      LoginEvent.countDocuments(),
      LoginEvent.countDocuments({ success: false }),
      LoginEvent.countDocuments({ timestamp: { $gte: today } }),
      ThreatEvent.countDocuments(),
      ThreatEvent.countDocuments({ blocked: true }),
      ThreatEvent.countDocuments({ threatLevel: 'high' }),
      OnPremEvent.countDocuments(),
      OnPremEvent.countDocuments({ success: false }),
      countCloudEvents(),
      countCloudEvents({ success: false }),
    ]);

    res.json({
      logins:  { total: totalLogins, failed: failedLogins, today: todayLogins },
      threats: { total: totalThreats, blocked: blockedThreats, high: highThreats },
      hybrid:  {
        onPrem: { total: onPremTotal, failed: onPremFailed },
        cloud:  { total: cloudTotal,  failed: cloudFailed  },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
