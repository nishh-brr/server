const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const LoginEvent = require('../models/LoginEvent');
const { saveHybridEvent }            = require('../middleware/hybridMiddleware');
const { trackAttempt, resetAttempts } = require('../middleware/authMiddleware');
const { checkIP }                    = require('../middleware/ipMiddleware');

// ─── Helper: sign JWT ─────────────────────────────────────────────────────────
function signToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );
}

// ─── Register ─────────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  try {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ email: email.toLowerCase(), password: hashed, name: name || '' });

    const token = signToken(user);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post('/login', checkIP, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const ip           = req.clientIP;
  const source       = req.ipSource;
  const { deviceType, browser, os } = req.deviceInfo;
  const attemptCount = trackAttempt(ip);

  try {
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found', source });
      await LoginEvent.create({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found', source });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password', source });
      await LoginEvent.create({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password', source });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // ── Success ───────────────────────────────────────────────────────────────
    resetAttempts(ip);

    await user.updateOne({ lastLogin: new Date() });
    await saveHybridEvent({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success', source });
    await LoginEvent.create({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success', source });

    const token = signToken(user);

    res.json({
      message: 'Login successful',
      token,
      source,
      user: { email: user.email, role: user.role, name: user.name },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ─── Cloud-login (simulate cloud IP for demo/testing) ─────────────────────────
router.post('/cloud-login', async (req, res) => {
  const { email, password } = req.body;
  const ip          = '99.99.99.99'; // simulated cloud IP
  const deviceType  = 'desktop';
  const browser     = 'Chrome 120';
  const os          = 'Unknown';
  const attemptCount = trackAttempt(ip);

  try {
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found', source: 'cloud' });
      await LoginEvent.create({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'user_not_found', source: 'cloud' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await saveHybridEvent({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password', source: 'cloud' });
      await LoginEvent.create({ email, ip, deviceType, browser, os, success: false, attemptCount, reason: 'wrong_password', source: 'cloud' });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    resetAttempts(ip);
    await saveHybridEvent({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success', source: 'cloud' });
    await LoginEvent.create({ email, ip, deviceType, browser, os, success: true, attemptCount: 0, reason: 'success', source: 'cloud' });

    const token = signToken(user);
    res.json({ message: 'Cloud login successful', token, source: 'cloud', user: { email: user.email, role: user.role } });
  } catch (err) {
    console.error('Cloud-login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── Get current user (protected) ────────────────────────────────────────────
const { verifyToken } = require('../middleware/authMiddleware');
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
