const ThreatEvent = require('../models/ThreatEvent');
const { parseDevice } = require('./authMiddleware');

const allowedIPs = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(',').map(ip => ip.trim())
  : ['127.0.0.1', '::1'];

async function checkIP(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const { deviceType, browser, os } = parseDevice(req.headers['user-agent']);
  const email = req.body?.email || 'unknown';

  if (!allowedIPs.includes(ip)) {
    await ThreatEvent.create({
      ip, reason: 'ip_not_allowed',
      email, deviceType, browser, os,
      blocked: true
    });

    return res.status(403).json({
      message: 'Access denied — your IP is not authorized',
      ip
    });
  }

  next();
}

module.exports = { checkIP };