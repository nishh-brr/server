const mongoose = require('mongoose');

const OnPremEventSchema = new mongoose.Schema({
  email:        { type: String },
  ip:           { type: String },
  deviceType:   { type: String },
  browser:      { type: String },
  os:           { type: String },
  success:      { type: Boolean },
  attemptCount: { type: Number, default: 1 },
  reason:       { type: String },
  source:       { type: String, default: 'on-prem' },
  timestamp:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('OnPremEvent', OnPremEventSchema);
