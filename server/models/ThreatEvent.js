const mongoose = require('mongoose');

const ThreatEventSchema = new mongoose.Schema({
  ip:          { type: String },
  email:       { type: String },
  reason:      { type: String },
  deviceType:  { type: String },
  browser:     { type: String },
  os:          { type: String },
  blocked:     { type: Boolean, default: false },
  threatLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  timestamp:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('ThreatEvent', ThreatEventSchema);
