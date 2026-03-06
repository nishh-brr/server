const BlockedIP = require('../models/BlockedIP');

const MAX_ATTEMPTS = 3;

// ── Your own machines — NEVER blocked ─────────────────────────────────────────
const WHITELIST = ['127.0.0.1', '::1', '::ffff:127.0.0.1', 'localhost'];

function getIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function isWhitelisted(ip) {
  return WHITELIST.some(w => ip === w || ip.includes(w));
}

// Block incoming request if IP is locked
async function ipBlockMiddleware(req, res, next) {
  const ip = getIP(req);
  if (isWhitelisted(ip)) return next(); // always let localhost through

  try {
    const record = await BlockedIP.findOne({ ip, isBlocked: true });
    if (record) {
      return res.status(403).json({
        success: false,
        blocked: true,
        message: `Access denied. Your IP has been blocked after ${MAX_ATTEMPTS} failed attempts. Contact your administrator.`
      });
    }
    next();
  } catch {
    next();
  }
}

// Record a failed login attempt — auto-blocks after MAX_ATTEMPTS
async function recordFailedAttempt(ip, attemptedUsername) {
  if (isWhitelisted(ip)) return { attempts: 0, blocked: false, attemptsLeft: MAX_ATTEMPTS };

  let record = await BlockedIP.findOne({ ip });

  if (!record) {
    record = await BlockedIP.create({ ip, attempts: 1, attemptedUsername, lastAttempt: new Date() });
  } else {
    record.attempts      += 1;
    record.lastAttempt    = new Date();
    record.attemptedUsername = attemptedUsername;
    if (record.attempts >= MAX_ATTEMPTS) {
      record.isBlocked = true;
      record.blockedAt = new Date();
    }
    await record.save();
  }

  return {
    attempts:     record.attempts,
    blocked:      record.isBlocked,
    attemptsLeft: Math.max(0, MAX_ATTEMPTS - record.attempts)
  };
}

// Clear failed attempts on successful login
async function clearAttempts(ip) {
  if (!isWhitelisted(ip)) await BlockedIP.deleteOne({ ip });
}

module.exports = { ipBlockMiddleware, recordFailedAttempt, clearAttempts, getIP };
