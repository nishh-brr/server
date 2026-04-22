const mongoose = require('mongoose');

const LoginEventSchema = new mongoose.Schema({
  email:        { type: String, required: true },
  ip:           { type: String },
  deviceType:   { type: String },
  browser:      { type: String },
  os:           { type: String },
  success:      { type: Boolean, required: true },
  attemptCount: { type: Number, default: 1 },
  reason:       { type: String },
  timestamp:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('LoginEvent', LoginEventSchema);