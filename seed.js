const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
dotenv.config();

const User        = require('./models/User');
const DangerousIP = require('./models/DangerousIP');
const OnPremEvent = require('./models/OnPremEvent');
const ThreatEvent = require('./models/ThreatEvent');
const db          = require('./config/firebase');

const users = [
  { email: 'admin@zerotrust.com',   password: 'admin123',   role: 'admin' },
  { email: 'nishi@zerotrust.com',   password: 'nishi123',   role: 'user'  },
  { email: 'analyst@zerotrust.com', password: 'analyst123', role: 'user'  },
];

const dangerousIPs = [
  { ip: '192.168.1.100', reason: 'Known attacker'         },
  { ip: '10.0.0.55',     reason: 'Brute force source'     },
  { ip: '203.0.113.42',  reason: 'Blacklisted region'     },
  { ip: '45.33.32.156',  reason: 'Tor exit node'          },
  { ip: '198.51.100.23', reason: 'Repeated failed logins' },
];

// Pre-defined on-prem events for MongoDB
const onPremEvents = [
  { email: 'admin@zerotrust.com',   ip: '14.97.1.1',   deviceType: 'desktop', browser: 'Chrome 120', os: 'Windows 11', success: true,  attemptCount: 1, reason: 'success',        source: 'on-prem' },
  { email: 'nishi@zerotrust.com',   ip: '14.97.1.2',   deviceType: 'desktop', browser: 'Chrome 120', os: 'Windows 11', success: true,  attemptCount: 1, reason: 'success',        source: 'on-prem' },
  { email: 'analyst@zerotrust.com', ip: '14.97.1.3',   deviceType: 'desktop', browser: 'Firefox 121', os: 'Windows 10', success: false, attemptCount: 3, reason: 'wrong_password', source: 'on-prem' },
  { email: 'admin@zerotrust.com',   ip: '14.97.1.1',   deviceType: 'mobile',  browser: 'Safari 17',  os: 'iOS 17',     success: true,  attemptCount: 1, reason: 'success',        source: 'on-prem' },
  { email: 'unknown@hacker.com',    ip: '14.97.1.99',  deviceType: 'desktop', browser: 'Chrome 119', os: 'Linux',      success: false, attemptCount: 5, reason: 'user_not_found', source: 'on-prem' },
];

// Pre-defined cloud events for Firebase
const cloudEvents = [
  { email: 'admin@zerotrust.com',   ip: '99.99.99.10', deviceType: 'desktop', browser: 'Chrome 120',  os: 'MacOS 14',   success: true,  attemptCount: 1, reason: 'success',        source: 'cloud' },
  { email: 'nishi@zerotrust.com',   ip: '72.14.192.1', deviceType: 'mobile',  browser: 'Safari 17',   os: 'iOS 17',     success: true,  attemptCount: 1, reason: 'success',        source: 'cloud' },
  { email: 'analyst@zerotrust.com', ip: '54.239.28.1', deviceType: 'tablet',  browser: 'Chrome 120',  os: 'Android 14', success: false, attemptCount: 2, reason: 'wrong_password', source: 'cloud' },
  { email: 'unknown@remote.com',    ip: '185.220.101.1', deviceType: 'desktop', browser: 'Firefox 121', os: 'Linux',    success: false, attemptCount: 4, reason: 'user_not_found', source: 'cloud' },
  { email: 'admin@zerotrust.com',   ip: '13.229.188.1', deviceType: 'desktop', browser: 'Edge 120',   os: 'Windows 11', success: true,  attemptCount: 1, reason: 'success',        source: 'cloud' },
];

// Pre-defined threat events
const threatEvents = [
  { ip: '203.0.113.42',  email: 'admin@zerotrust.com',   reason: 'DANGEROUS IP - Blacklisted region',     deviceType: 'desktop', browser: 'Chrome 120', os: 'Windows', blocked: true, threatLevel: 'high'   },
  { ip: '45.33.32.156',  email: 'nishi@zerotrust.com',   reason: 'DANGEROUS IP - Tor exit node',          deviceType: 'desktop', browser: 'Firefox 121', os: 'Linux',  blocked: true, threatLevel: 'high'   },
  { ip: '192.168.1.100', email: 'analyst@zerotrust.com', reason: 'DANGEROUS IP - Known attacker',         deviceType: 'mobile',  browser: 'Safari 17',  os: 'iOS',    blocked: true, threatLevel: 'high'   },
  { ip: '10.0.0.55',     email: 'unknown@hack.com',      reason: 'DANGEROUS IP - Brute force source',     deviceType: 'desktop', browser: 'Chrome 119', os: 'Linux',  blocked: true, threatLevel: 'high'   },
  { ip: '198.51.100.23', email: 'admin@zerotrust.com',   reason: 'DANGEROUS IP - Repeated failed logins', deviceType: 'desktop', browser: 'Edge 120',   os: 'Windows',blocked: true, threatLevel: 'medium' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  // Clear MongoDB
  await User.deleteMany({});
  await DangerousIP.deleteMany({});
  await OnPremEvent.deleteMany({});
  await ThreatEvent.deleteMany({});

  // Seed users
  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ email: u.email, password: hashed, role: u.role });
  }
  console.log('Users seeded');

  // Seed dangerous IPs
  await DangerousIP.insertMany(dangerousIPs);
  console.log('Dangerous IPs seeded');

  // Seed on-prem events
  await OnPremEvent.insertMany(onPremEvents);
  console.log('OnPrem events seeded in MongoDB');

  // Seed threat events
  await ThreatEvent.insertMany(threatEvents);
  console.log('Threat events seeded in MongoDB');

  // Clear Firebase cloud events
  const existing = await db.collection('cloudevents').get();
  const deletePromises = existing.docs.map(doc => doc.ref.delete());
  await Promise.all(deletePromises);

  // Seed cloud events in Firebase
  for (const event of cloudEvents) {
    await db.collection('cloudevents').add({
      ...event,
      timestamp: new Date().toISOString()
    });
  }
  console.log('Cloud events seeded in Firebase');

  await mongoose.disconnect();
  console.log('All done!');
}

seed().catch(console.error);