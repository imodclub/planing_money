const mongoose = require('mongoose');

const savingsRatioSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  savingsItems: [
    {
      label: String,
      description: String,
      percentage: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SavingsRatio = mongoose.model('SavingsRatio', savingsRatioSchema);

module.exports = SavingsRatio;
