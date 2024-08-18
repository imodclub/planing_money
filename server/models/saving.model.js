const mongoose = require('mongoose');

const savingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // ใช้ ObjectId เพื่อเก็บ userId
    required: true, // ต้องการค่า (required)
    ref: 'User', // ชี้ไปที่โมเดล User
  },
  date: {
    type: Date,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now, // กำหนดค่าเริ่มต้นเป็นเวลาปัจจุบัน
  },
  items: [
    {
      label: {
        type: String,
        required: true, // ต้องการค่า (required)
      },
      amount: {
        type: Number, // ใช้ String สำหรับจำนวนเงิน
        required: false,
        default: 0, // กำหนดค่าเริ่มต้นเป็นสตริงว่าง
      },
      comment: {
        type: String,
        required: false,
        default: '', // กำหนดค่าเริ่มต้นเป็นสตริงว่าง
      },
    },
  ],
});

const Saving = mongoose.model('Saving', savingSchema);
module.exports = Saving;
