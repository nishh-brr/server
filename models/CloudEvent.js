const mongoose = require('mongoose');

const CloudEventSchema = new mongoose.Schema({
  email:        { type: String, required: true },
  ip:           { type: String },
  deviceType:   { type: String },
  browser:      { type: String },
  os:           { type: String },
  success:      { type: Boolean },
  attemptCount: { type: Number, default: 0 },
  reason:       { type: String },
  source:       { type: String, default: 'cloud' },
  timestamp:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('CloudEvent', CloudEventSchema);