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
    // ── Save to MongoDB ──────────────────────────────────────────────────────
    await OnPremEvent.create({ ...eventData, source: 'on-prem' });
    console.log('💾 Saved to MongoDB (on-prem):', eventData.email);
  } else {
    // ── Try Firebase first, fall back to MongoDB CloudEvent ──────────────────
    try {
      const db = require('../config/firebase');
      await db.collection('cloudevents').add({
        ...eventData,
        source:    'cloud',
        timestamp: new Date().toISOString(),
      });
      console.log('☁️  Saved to Firebase (cloud):', eventData.email);
    } catch (firebaseErr) {
      console.warn('⚠️  Firebase unavailable, saving cloud event to MongoDB:', firebaseErr.message);
      await CloudEvent.create({ ...eventData, source: 'cloud' });
      console.log('💾 Saved cloud event to MongoDB (fallback):', eventData.email);
    }
  }

  return source;
}

module.exports = { getSource, saveHybridEvent };
