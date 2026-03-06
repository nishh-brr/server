const express = require('express');
const router  = express.Router();
const User    = require('../models/User');
const { ipBlockMiddleware, recordFailedAttempt, clearAttempts, getIP } = require('../middleware/ipBlock');

// Apply IP block check to every login attempt
router.use(ipBlockMiddleware);

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const ip = getIP(req);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Please enter both username and password.' });
  }

  try {
    // Look up by username OR email — whichever the user typed
    const user = await User.findOne({
      $or: [
        { username: username.trim().toLowerCase() },
        { email:    username.trim().toLowerCase() }
      ]
    });

    // No user found
    if (!user) {
      const result = await recordFailedAttempt(ip, username);
      return res.status(401).json({
        success:     false,
        blocked:     result.blocked,
        attemptsLeft: result.attemptsLeft,
        message:     result.blocked
          ? 'Your IP has been blocked after too many failed attempts. Contact your administrator.'
          : `Invalid username or password. ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? '' : 's'} remaining.`
      });
    }

    // Account disabled
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Contact your administrator.'
      });
    }

    // Wrong password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const result = await recordFailedAttempt(ip, username);
      return res.status(401).json({
        success:     false,
        blocked:     result.blocked,
        attemptsLeft: result.attemptsLeft,
        message:     result.blocked
          ? 'Your IP has been blocked after too many failed attempts. Contact your administrator.'
          : `Invalid username or password. ${result.attemptsLeft} attempt${result.attemptsLeft === 1 ? '' : 's'} remaining.`
      });
    }

    // ✅ Login successful
    await clearAttempts(ip);
    user.lastLogin = new Date();
    await user.save();

    req.session.userId     = user._id;
    req.session.username   = user.username;
    req.session.name       = user.name;
    req.session.role       = user.role;
    req.session.department = user.department;

    return res.json({
      success:  true,
      redirect: '/dashboard',
      user: {
        name:       user.name,
        role:       user.role,
        department: user.department
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  if (!req.session.userId) return res.json({ loggedIn: false });
  res.json({
    loggedIn:   true,
    name:       req.session.name,
    username:   req.session.username,
    role:       req.session.role,
    department: req.session.department
  });
});

module.exports = router;
