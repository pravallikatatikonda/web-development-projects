const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  resumeText: { type: String, required: true },
  suggestions: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
