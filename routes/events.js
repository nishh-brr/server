const express    = require('express');
const router     = express.Router();
const LoginEvent = require('../models/LoginEvent');

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
    const total   = await LoginEvent.countDocuments();
    const failed  = await LoginEvent.countDocuments({ success: false });
    const today   = new Date(); today.setHours(0, 0, 0, 0);
    const todayCount = await LoginEvent.countDocuments({ timestamp: { $gte: today } });
    const devices = await LoginEvent.aggregate([
      { $group: { _id: '$deviceType', count: { $sum: 1 } } }
    ]);
    res.json({ total, failed, todayCount, devices });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;