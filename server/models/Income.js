// models/Income.js
const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  items: [
    {
      label: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        default: '',
      },
    },
  ],
});

const Income = mongoose.model('Income', incomeSchema);

module.exports = Income;