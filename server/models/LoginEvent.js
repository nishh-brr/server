const mongoose = require('mongoose');

const LoginEventSchema = new mongoose.Schema({
  email:        { type: String },
  ip:           { type: String },
  deviceType:   { type: String },
  browser:      { type: String },
  os:           { type: String },
  success:      { type: Boolean },
  attemptCount: { type: Number, default: 1 },
  reason:       { type: String },
  source:       { type: String, enum: ['on-prem', 'cloud'], default: 'on-prem' },
  timestamp:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('LoginEvent', LoginEventSchema);
