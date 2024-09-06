// models/session.model.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now, expires: '3d' } // Session จะหมดอายุหลังจาก 3 วัน
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;