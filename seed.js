const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
dotenv.config();

const User        = require('./models/User');
const DangerousIP = require('./models/DangerousIP');

const users = [
  { email: 'admin@zerotrust.com',   password: 'admin123',   role: 'admin' },
  { email: 'nishi@zerotrust.com',   password: 'nishi123',   role: 'user'  },
  { email: 'analyst@zerotrust.com', password: 'analyst123', role: 'user'  },
];

const dangerousIPs = [
  { ip: '192.168.1.100', reason: 'Known attacker'        },
  { ip: '10.0.0.55',     reason: 'Brute force source'    },
  { ip: '203.0.113.42',  reason: 'Blacklisted region'    },
  { ip: '45.33.32.156',  reason: 'Tor exit node'         },
  { ip: '198.51.100.23', reason: 'Repeated failed logins'},
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await User.deleteMany({});
  await DangerousIP.deleteMany({});

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 10);
    await User.create({ email: u.email, password: hashed, role: u.role });
  }
  console.log('Users seeded:', users.map(u => u.email));

  await DangerousIP.insertMany(dangerousIPs);
  console.log('Dangerous IPs seeded:', dangerousIPs.map(d => d.ip));

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(console.error);