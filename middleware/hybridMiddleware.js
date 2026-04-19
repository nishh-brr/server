const OnPremEvent = require('../models/OnPremEvent');
const CloudEvent  = require('../models/CloudEvent');

const allowedIPs = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(',').map(ip => ip.trim())
  : ['127.0.0.1', '::1'];

function getSource(ip) {
  return allowedIPs.includes(ip) ? 'on-prem' : 'cloud';
}

async function saveHybridEvent(eventData) {
  const source = getSource(eventData.ip);
  if (source === 'on-prem') {
    await OnPremEvent.create({ ...eventData, source: 'on-prem' });
  } else {
    await CloudEvent.create({ ...eventData, source: 'cloud' });
  }
  return source;
}

module.exports = { getSource, saveHybridEvent };