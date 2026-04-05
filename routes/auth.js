const express    = require('express');
const router     = express.Router();
const bcrypt     = require('bcryptjs');
const User       = require('../models/User');
const LoginEvent = require('../models/LoginEvent');
const { parseDevice, trackAttempt, resetAttempts } = require('../middleware/authMiddleware');

// Register (only for testing — so you can create a user to log in with)
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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const { deviceType, browser, os } = parseDevice(req.headers['user-agent']);
  const attemptCount = trackAttempt(ip);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      await LoginEvent.create({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await LoginEvent.create({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    resetAttempts(ip);
    await LoginEvent.create({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success' });
    res.json({ message: 'Login successful' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;