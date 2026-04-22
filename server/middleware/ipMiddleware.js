const ThreatEvent = require('../models/ThreatEvent');
const DangerousIP = require('../models/DangerousIP');
const { parseDevice } = require('./authMiddleware');

const allowedIPs = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(',').map(ip => ip.trim())
  : ['127.0.0.1', '::1'];

async function checkIP(req, res, next) {
  const raw = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  // Normalise: x-forwarded-for can be "a, b, c" — take the first
  const ip = raw.split(',')[0].trim();

  const { deviceType, browser, os } = parseDevice(req.headers['user-agent']);
  const email = req.body?.email || 'unknown';

  // Check dangerous IP list from DB
  const isDangerous = await DangerousIP.findOne({ ip });

  if (isDangerous) {
    await ThreatEvent.create({
      ip,
      reason: `DANGEROUS IP — ${isDangerous.reason}`,
      email, deviceType, browser, os,
      blocked:     true,
      threatLevel: 'high',
    });
    return res.status(403).json({
      message: 'Access denied — your IP has been flagged as dangerous',
      reason:  isDangerous.reason,
      ip,
    });
  }

  req.clientIP   = ip;
  req.ipSource   = allowedIPs.includes(ip) ? 'on-prem' : 'cloud';
  req.deviceInfo = { deviceType, browser, os };
  next();
}

module.exports = { checkIP };
