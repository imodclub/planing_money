// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    require:true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},{ collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = User;