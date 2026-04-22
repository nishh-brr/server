const mongoose = require('mongoose');

const ThreatEventSchema = new mongoose.Schema({
  ip:        { type: String, required: true },
  reason:    { type: String },
  email:     { type: String },
  deviceType: { type: String },
  browser:   { type: String },
  os:        { type: String },
  blocked:   { type: Boolean, default: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ThreatEvent', ThreatEventSchema);