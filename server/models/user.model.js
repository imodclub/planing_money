// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  email:{
  type:String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
},{ collection: 'users' });

const User = mongoose.model('User', userSchema);

module.exports = User;