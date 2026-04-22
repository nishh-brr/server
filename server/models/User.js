const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['admin', 'user', 'viewer'], default: 'user' },
  name:      { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

module.exports = mongoose.model('User', UserSchema);
