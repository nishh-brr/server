const UAParser = require('ua-parser-js');

// ─── In-memory brute-force tracker ───────────────────────────────────────────
const attemptStore = {};

function parseDevice(userAgent) {
  const parser = new UAParser(userAgent || '');
  const result = parser.getResult();
  return {
    deviceType: result.device.type || 'desktop',
    browser:    `${result.browser.name || 'Unknown'} ${result.browser.version || ''}`.trim(),
    os:         `${result.os.name    || 'Unknown'} ${result.os.version    || ''}`.trim(),
  };
}

function trackAttempt(ip) {
  if (!attemptStore[ip]) attemptStore[ip] = { count: 0 };
  attemptStore[ip].count += 1;
  return attemptStore[ip].count;
}

function resetAttempts(ip) {
  delete attemptStore[ip];
}

// ─── JWT verify middleware (protect routes) ───────────────────────────────────
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ message: 'Malformed token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { parseDevice, trackAttempt, resetAttempts, verifyToken };
