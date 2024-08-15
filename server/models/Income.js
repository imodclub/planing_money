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
        type: String, // เปลี่ยนเป็น String แทนที่จะเป็น Number
        required: false, // ไม่ต้องการค่า (optional)
        default: '', // กำหนดค่าเริ่มต้นเป็น string ว่าง
      },
      comment: {
        type: String,
        required: false,
      },
    },
  ],
});

const Income = mongoose.model('Income', incomeSchema);
module.exports = Income;
