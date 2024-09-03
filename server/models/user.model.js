// models/user.model.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
<<<<<<< HEAD
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
=======
  { collection: 'users' }
);
>>>>>>> development

const User = mongoose.model('User', userSchema);

module.exports = User;