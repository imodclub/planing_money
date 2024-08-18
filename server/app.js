// server/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('./models/user.model'); // นำเข้า User model
const Income = require('./models/Income');
const Expense = require('./models/expenses.model');
const Saving = require('./models/saving.model');
const SavingsRatio = require('./models/savingsRatio.model');
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
  const { date, incomeItems, userId, timestamp } = req.body;

  try {
    const items = incomeItems.map((item) => {
      const amount = item.amount; // ไม่ต้องแปลงเป็นจำนวน

      return {
        label: item.label,
        amount: amount === undefined || amount === null ? '' : amount, // ถ้า amount เป็น undefined หรือ null ให้ใช้ string ว่าง
        comment: item.comment,
      };
    });

    const newIncome = new Income({
      userId,
      date,
      timestamp,
      items,
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

//สำหรับ Fetch user data income
app.get('/api/income-data/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const incomes = await Income.find({ userId: userId }); // ค้นหาข้อมูลตาม userId
    res.json(incomes);
  } catch (error) {
    console.error('Error fetching income data:', error);
    res.status(500).json({ message: 'Error fetching income data' });
  }
});

//สำหรับ Fetch user data expenses
app.get('/api/expense-data/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const expense = await Expense.find({ userId: userId }); // ค้นหาข้อมูลตาม userId
    res.json(expense);
  } catch (error) {
    console.error('Error fetching income data:', error);
    res.status(500).json({ message: 'Error fetching income data' });
  }
});

//API สำหรับรายจ่าย
// Endpoint สำหรับบันทึกรายจ่าย
app.post('/api/save-expenses', async (req, res) => {
  const { date, expenseItems, userId, timestamp } = req.body;

  if (!expenseItems || !Array.isArray(expenseItems)) {
    return res.status(400).json({ message: 'Invalid expense items' });
  }

  try {
    const newExpense = new Expense({
      userId,
      date,
      timestamp,
      items: expenseItems.map((item) => ({
        label: item.label,
        amount: item.amount,
        comment: item.comment,
      })),
    });

    await newExpense.save();
    res.status(201).json({ message: 'บันทึกรายการสำเร็จ' });
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกรายการ' });
  }
});

//API สำหรับฟอร์มเงินออม
app.post('/api/save-savings', async (req, res) => {
  const { date, savingsItems, userId, timestamp } = req.body;

  if (!savingsItems || !Array.isArray(savingsItems)) {
    return res.status(400).json({ message: 'Invalid savings items' });
  }

  try {
    const newSaving = new Saving({
      userId,
      date,
      timestamp,
      items: savingsItems.map((item) => ({
        label: item.label,
        amount: item.amount,
        comment: item.comment,
      })),
    });

    await newSaving.save();
    res.status(201).json({ message: 'บันทึกรายการสำเร็จ' });
  } catch (error) {
    console.error('Error saving savings:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกรายการ' });
  }
});


//API Fetch Data เงินออม
app.get('/api/savings/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const savings = await Saving.find({ userId: userId }).sort({ date: -1 }); // ค้นหาข้อมูลตาม userId และเรียงลำดับตามวันที่
    res.json(savings);
  } catch (error) {
    console.error('Error fetching savings data:', error);
    res.status(500).json({ message: 'Error fetching savings data' });
  }
});

//Report หรือ รายงาน
//api/monthly-report ดึงข้อมูลผลรวมของแต่ละเดือน
app.get('/api/monthly-report/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const report = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m',
              date: '$date',
            },
          },
          totalIncome: { $sum: '$items.amount' },
        },
      },
      {
        $lookup: {
          from: 'expenses',
          let: { userId: new mongoose.Types.ObjectId(userId), month: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: '%Y-%m',
                            date: '$date',
                          },
                        },
                        '$$month',
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalExpense: { $sum: '$items.amount' },
              },
            },
          ],
          as: 'expenseData',
        },
      },
      {
        $lookup: {
          from: 'savings',
          let: { userId: new mongoose.Types.ObjectId(userId), month: '$_id' },
          pipeline: [
            { $unwind: '$items' },
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$userId', '$$userId'] },
                    {
                      $eq: [
                        {
                          $dateToString: {
                            format: '%Y-%m',
                            date: '$date',
                          },
                        },
                        '$$month',
                      ],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSaving: { $sum: '$items.amount' },
              },
            },
          ],
          as: 'savingData',
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          income: '$totalIncome',
          expense: {
            $ifNull: [{ $arrayElemAt: ['$expenseData.totalExpense', 0] }, 0],
          },
          saving: {
            $ifNull: [{ $arrayElemAt: ['$savingData.totalSaving', 0] }, 0],
          },
        },
      },
      { $sort: { month: 1 } },
    ]);

    if (report.length === 0) {
      return res.status(404).json({ message: 'No report data found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Error fetching monthly report:', error);
    res.status(500).json({ message: 'Error fetching monthly report' });
  }
});

// Save savings ratio
app.post('/api/save-savings-ratio', async (req, res) => {
  try {
    const { savingsItems, userId } = req.body;

    const newSavingsRatio = new SavingsRatio({
      userId,
      savingsItems,
    });

    await newSavingsRatio.save();

    res.status(200).json({ message: 'Savings ratio saved successfully' });
  } catch (error) {
    console.error('Error saving savings ratio:', error);
    res.status(500).json({ error: 'An error occurred while saving savings ratio' });
  }
});

// Get savings ratio by user ID
app.get('/api/savings-ratio/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const savingsRatio = await SavingsRatio.findOne({ userId });

    if (!savingsRatio) {
      return res.status(404).json({ error: 'Savings ratio not found' });
    }

    res.status(200).json(savingsRatio);
  } catch (error) {
    console.error('Error retrieving savings ratio:', error);
    res.status(500).json({ error: 'An error occurred while retrieving savings ratio' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});