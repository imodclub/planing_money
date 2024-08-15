// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/user.model'); // นำเข้า User model

require('dotenv').config();
const connectDB = require('./config/connectDB');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

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

//Route สำหรับเข้าใช้งานระบบ
app.post('api/signin', async (req,res)=>{
  const {username, password} = req.body;
  try{
    
  }catch(error){

  }
});

// server/app.js
app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ name: username }); // ค้นหาผู้ใช้ในฐานข้อมูล
    if (!user) {
      return res.status(400).json({ message: 'ไม่พบผู้ใช้' });
    }

    // ตรวจสอบรหัสผ่าน (ควรใช้ bcrypt ในการเข้ารหัสรหัสผ่าน)
    if (user.password !== password) {
      return res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    res.status(200).json({ message: 'ลงชื่อใช้งานสำเร็จ' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงชื่อใช้งาน' });
    console.error(error);
  }
});




app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});