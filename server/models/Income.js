const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  date: {
    type: Date,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  items: [
    {
      label: {
        type: String,
        required: true,
        default: '', // กำหนดค่าเริ่มต้นเป็นสตริงว่าง
      },
      amount: {
        type: String,
        required: false,
        default: '',
      },
      comment: {
        type: String,
        required: false,
        default: '',
      },
    },
  ],
});

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;