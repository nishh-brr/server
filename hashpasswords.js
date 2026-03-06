/**
 * HASH PASSWORDS — run this once after adding users in Compass
 *
 * Usage: node hashpasswords.js
 *
 * - Finds every user in loginapp → users whose password is NOT yet bcrypt hashed
 * - Hashes them with bcrypt and saves back to MongoDB
 * - Safe to run multiple times — already-hashed passwords are skipped
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

// 🔧 Same URI as server.js
const MONGO_URI = 'mongodb+srv://nishigandhi_db:password@cluster7.e7gijkh.mongodb.net/loginapp';

async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅  Connected to MongoDB\n');

    const col   = mongoose.connection.db.collection('users');
    const users = await col.find({}).toArray();

    if (!users.length) {
      console.log('⚠️   No users found in loginapp → users');
      console.log('     Add users in Compass first, then run this script.');
      return process.exit(0);
    }

    console.log(`Found ${users.length} user(s):\n`);

    let hashed = 0, skipped = 0;

    for (const u of users) {
      const isAlreadyHashed =
        typeof u.password === 'string' &&
        (u.password.startsWith('$2a$') || u.password.startsWith('$2b$'));

      if (isAlreadyHashed) {
        console.log(`⏭️   Skipped   ${u.name || u.username} — already encrypted`);
        skipped++;
        continue;
      }

      if (!u.password) {
        console.log(`⚠️   Skipped   ${u.name || u.username} — no password field`);
        skipped++;
        continue;
      }

      const hash = await bcrypt.hash(u.password, 12);
      await col.updateOne({ _id: u._id }, { $set: { password: hash } });
      console.log(`🔐  Encrypted  ${u.name || u.username} (@${u.username})`);
      hashed++;
    }

    console.log(`\n${'─'.repeat(48)}`);
    console.log(`✅  Done — ${hashed} encrypted, ${skipped} skipped`);
    console.log(`\n    Open Compass → loginapp → users`);
    console.log(`    Passwords now look like: $2a$12$...`);
    console.log(`\n🚀  You can now run: npm start`);
    process.exit(0);

  } catch (err) {
    console.error('❌  Error:', err.message);
    process.exit(1);
  }
}

run();
