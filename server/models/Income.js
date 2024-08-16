const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId เพื่อเก็บ userId
    required: true, // ต้องการค่า (required)
    ref: 'users', // ชี้ไปที่โมเดล User
  },
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