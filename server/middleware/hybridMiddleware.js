const OnPremEvent = require('../models/OnPremEvent');
const db = require('../config/firebase');

const allowedIPs = process.env.ALLOWED_IPS
  ? process.env.ALLOWED_IPS.split(',').map(ip => ip.trim())
  : ['127.0.0.1', '::1'];

function getSource(ip) {
  return allowedIPs.includes(ip) ? 'on-prem' : 'cloud';
}

async function saveHybridEvent(eventData) {
  const source = getSource(eventData.ip);

  if (source === 'on-prem') {
    // Save to MongoDB
    await OnPremEvent.create({ ...eventData, source: 'on-prem' });
    console.log('Saved to MongoDB (on-prem):', eventData.email);
  } else {
    // Save to Firebase Firestore
    await db.collection('cloudevents').add({
      ...eventData,
      source: 'cloud',
      timestamp: new Date().toISOString()
    });
    console.log('Saved to Firebase (cloud):', eventData.email);
  }

  return source;
}

module.exports = { getSource, saveHybridEvent };