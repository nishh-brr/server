const mongoose = require('mongoose');

const blockedIPSchema = new mongoose.Schema({
  ip:               { type: String, required: true, unique: true },
  attempts:         { type: Number, default: 1 },
  isBlocked:        { type: Boolean, default: false },
  blockedAt:        { type: Date, default: null },
  lastAttempt:      { type: Date, default: Date.now },
  attemptedUsername:{ type: String, default: '' }
}, { collection: 'blockedips' });

module.exports = mongoose.model('BlockedIP', blockedIPSchema);
