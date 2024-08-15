// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/user.model'); // นำเข้า User model
const Income = require('./models/Income');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const connectDB = require('./config/connectDB');

const app = express();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Route สำหรับการลงทะเบียน
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = new User({ name: username, password });
    await newUser.save();
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ' });
  } catch (error) {
    res.status(400).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน ทางฝั่ง server ครับ' });
  }
});


// server/app.js
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ name: username });
    if (!user) {
      return res.status(400).json({ message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน (ควรใช้ bcrypt ในการเข้ารหัสรหัสผ่าน)
    if (user.password !== password) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง Session Cookie
    const userId = user._id.toString();
    res.cookie('session', userId, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    }); // สร้าง Cookie ที่หมดอายุใน 7 วัน และตั้งค่า httpOnly
    res.status(200).json({
      message: 'ลงชื่อใช้งานสำเร็จ',
      userId, //ส่งค่า userID กลับไปยัง Client
      name: user.name, // ส่งค่า name กลับไปด้วย
    });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงชื่อใช้งาน' });
    console.error(error);
  }
});

// Endpoint สำหรับบันทึกรายการรายได้
app.post('/api/save-income', async (req, res) => {
  const { date, incomeItems } = req.body;

  try {
    const newIncome = new Income({
      date,
      items: incomeItems.map(item => ({
        label: item.label,
        amount: parseFloat(item.amount), // แปลงเป็นจำนวน
        comment: item.comment,
      })),
    });

    await newIncome.save();
    res.status(201).json({ message: 'บันทึกรายการสำเร็จ' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกรายการ' });
  }
});

// Endpoint สำหรับดึงข้อมูลรายได้
app.get('/api/income-data', async (req, res) => {
  try {
    const incomes = await Income.find({});
    res.status(200).json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});