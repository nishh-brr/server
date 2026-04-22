const mongoose = require('mongoose');

const DangerousIPSchema = new mongoose.Schema({
  ip:        { type: String, required: true, unique: true },
  reason:    { type: String },
  addedAt:   { type: Date, default: Date.now },
});

module.exports = mongoose.model('DangerousIP', DangerousIPSchema);
