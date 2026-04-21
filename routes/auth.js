const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const User       = require('../models/User');
const { saveHybridEvent } = require('../middleware/hybridMiddleware');
const { trackAttempt, resetAttempts } = require('../middleware/authMiddleware');
const { checkIP } = require('../middleware/ipMiddleware');

// Register
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });
    res.json({ message: 'User created', user: { email: user.email } });
  } catch (err) {
    res.status(400).json({ message: 'User already exists or bad data' });
  }
});

// Login
router.post('/login', checkIP, async (req, res) => {
  const { email, password } = req.body;
  const ip           = req.clientIP;
  const source       = req.ipSource;
  const { deviceType, browser, os } = req.deviceInfo;
  const attemptCount = trackAttempt(ip);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found', source });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password', source });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    resetAttempts(ip);
    await saveHybridEvent({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success', source });

    res.json({
      message: 'Login successful',
      user: { email: user.email, role: user.role },
      source
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simulate cloud login (for testing without console)
router.post('/cloud-login', async (req, res) => {
  const { email, password } = req.body;
  const ip = '99.99.99.99'; // simulated cloud IP
  const deviceType = 'desktop';
  const browser = 'Chrome 120';
  const os = 'Unknown';
  const attemptCount = trackAttempt(ip);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found', source: 'cloud' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password', source: 'cloud' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    resetAttempts(ip);
    await saveHybridEvent({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success', source: 'cloud' });

    res.json({
      message: 'Cloud login successful',
      user: { email: user.email, role: user.role },
      source: 'cloud'
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;