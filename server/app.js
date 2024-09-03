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
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
require('dotenv').config();


require('dotenv').config();

const connectDB = require('./config/connectDB');

const app = express();
const PORT = process.env.PORT || 5002;

connectDB();

app.use(
  cors({
    origin: '*', // หรือ URL ของ client ของคุณ
    credentials: true,
  })
);
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());

// Route สำหรับการลงทะเบียน
app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name: username, password : hashedPassword, email:email });
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

    const isPasswordValid = await bcrypt.compare(password, user.password);
     if (!isPasswordValid) {
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
      createdAt: new Date(),
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

    const savingsRatio = await SavingsRatio.findOne({ userId })
      .sort({ createdAt: -1 }) // เรียงตาม createdAt จากล่าสุดไปเก่าสุด
      .exec();

    if (!savingsRatio) {
      return res.status(404).json({ error: 'Savings ratio not found' });
    }

    res.status(200).json(savingsRatio);
  } catch (error) {
    console.error('Error retrieving savings ratio:', error);
    res.status(500).json({ error: 'An error occurred while retrieving savings ratio' });
  }
});


app.get('/api/total-income/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const incomes = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.label',
          totalAmount: { $sum: '$items.amount' }
        }
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          amount: '$totalAmount'
        }
      }
    ]);
    
    const totalIncome = incomes.reduce((acc, item) => {
      acc[item.label] = item.amount;
      return acc;
    }, {});

    res.json({ totalIncome });
  } catch (error) {
    console.error('Error fetching total income:', error);
    res.status(500).json({ message: 'Error fetching total income' });
  }
});


app.get('/api/monthly-income/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const incomes = await Income.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: { month: { $month: '$date' }, label: '$items.label' },
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          items: {
            $push: {
              label: '$_id.label',
              amount: '$totalAmount',
            },
          },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          items: 1,
          totalAmount: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // สร้างอาร์เรย์ที่มี 12 เดือน
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      items: [],
      totalAmount: 0,
    }));

    // อัปเดตข้อมูลจาก MongoDB
    incomes.forEach((income) => {
      const monthIndex = income.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        allMonths[monthIndex] = income;
      }
    });

    res.json(allMonths);
  } catch (error) {
    console.error('Error fetching monthly income:', error);
    res.status(500).json({ message: 'Error fetching monthly income' });
  }
});

app.get('/api/filtered-income/:userId', async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // แปลงวันที่เป็น Date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ดึงข้อมูลรายรับตามช่วงเวลาที่กำหนด
    const filteredIncome = await Income.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.label',
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          amount: '$totalAmount',
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.json(filteredExpenses);
  } catch (error) {
    console.error('Error fetching filtered income:', error);
    res.status(500).json({ message: 'Error fetching filtered income' });
  }
});

// Endpoint สำหรับดึงข้อมูลรายจ่ายทั้งหมด
app.get('/api/total-expenses/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const expense = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.label',
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          amount: '$totalAmount',
        },
      },
    ]);

    const totalExpense = expense.reduce((acc, item) => {
      acc[item.label] = item.amount;
      return acc;
    }, {});

    res.json({ totalExpense });
  } catch (error) {
    console.error('Error fetching total income:', error);
    res.status(500).json({ message: 'Error fetching total income' });
  }
});

// Endpoint สำหรับดึงข้อมูลรายจ่ายรายเดือน
app.get('/api/monthly-expenses/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const expenses = await Expense.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: { month: { $month: '$date' }, label: '$items.label' },
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          items: {
            $push: {
              label: '$_id.label',
              amount: '$totalAmount',
            },
          },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          items: 1,
          totalAmount: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // สร้างอาร์เรย์ที่มี 12 เดือน
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      items: [],
      totalAmount: 0,
    }));

    // อัปเดตข้อมูลจาก MongoDB
    expenses.forEach((expenses) => {
      const monthIndex = expenses.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        allMonths[monthIndex] = expenses;
      }
    });

    res.json(allMonths);
  } catch (error) {
    console.error('Error fetching monthly expenses:', error);
    res.status(500).json({ message: 'Error fetching monthly expenses' });
  }
});

app.get('/api/filtered-expenses/:userId', async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // แปลงวันที่เป็น Date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ดึงข้อมูลรายรับตามช่วงเวลาที่กำหนด
    const filteredExpenses = await Expense.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.label',
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          amount: '$totalAmount',
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.json(filteredExpenses);
  } catch (error) {
    console.error('Error fetching filtered expenses:', error);
    res.status(500).json({ message: 'Error fetching filtered expenses' });
  }
});

// Endpoint สำหรับดึงข้อมูลเงินออม
app.get('/api/total-savings/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const savings = await Saving.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.label',
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          amount: '$totalAmount',
        },
      },
    ]);

    const totalSavings = savings.reduce((acc, item) => {
      acc[item.label] = item.amount;
      return acc;
    }, {});

    res.json({ totalSavings });
  } catch (error) {
    console.error('Error fetching total income:', error);
    res.status(500).json({ message: 'Error fetching total income' });
  }
});

// Endpoint สำหรับดึงข้อมูลเงินออมรายเดือน
app.get('/api/monthly-savings/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const savings = await Saving.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { $unwind: '$items' },
      {
        $group: {
          _id: { month: { $month: '$date' }, label: '$items.label' },
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $group: {
          _id: '$_id.month',
          items: {
            $push: {
              label: '$_id.label',
              amount: '$totalAmount',
            },
          },
          totalAmount: { $sum: '$totalAmount' },
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id',
          items: 1,
          totalAmount: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    // สร้างอาร์เรย์ที่มี 12 เดือน
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      items: [],
      totalAmount: 0,
    }));

    // อัปเดตข้อมูลจาก MongoDB
    savings.forEach((savings) => {
      const monthIndex = savings.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        allMonths[monthIndex] = savings;
      }
    });

    res.json(allMonths);
  } catch (error) {
    console.error('Error fetching monthly savings:', error);
    res.status(500).json({ message: 'Error fetching monthly savings' });
  }
});

app.get('/api/filtered-savings/:userId', async (req, res) => {
  const { userId } = req.params;
  const { startDate, endDate } = req.query;

  try {
    // แปลงวันที่เป็น Date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // ดึงข้อมูลรายรับตามช่วงเวลาที่กำหนด
    const filteredSaving = await Saving.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.label',
          totalAmount: { $sum: '$items.amount' },
        },
      },
      {
        $project: {
          _id: 0,
          label: '$_id',
          amount: '$totalAmount',
        },
      },
      { $sort: { amount: -1 } },
    ]);

    res.json(filteredSaving);
  } catch (error) {
    console.error('Error fetching filtered savings:', error);
    res.status(500).json({ message: 'Error fetching filtered savings' });
  }
});

//ดึงข้อมูลที่มีอยู่ในฐานข้อมูลออกมาแก้ไข
app.get('/api/income-data/:userId/:date', async (req, res) => {
  const { userId, date } = req.params;
  try {
    const income = await Income.findOne({
      userId: userId,
      date: new Date(date),
    });
    res.json(income || { items: [] });
  } catch (error) {
    console.error('Error fetching income data:', error);
    res.status(500).json({ message: 'Error fetching income data' });
  }
});

//ช่วงแก้ไขและลบข้อมูล
app.put('/api/update-income-item/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, itemId, label, amount, comment } = req.body;

    const result = await Income.findOneAndUpdate(
      { userId, date, 'items._id': itemId },
      {
        $set: {
          'items.$.label': label,
          'items.$.amount': amount,
          'items.$.comment': comment,
        },
      },
      { new: true }
    );

    if (result) {
      res.json({ success: true, message: 'รายการรายรับถูกอัปเดตแล้ว' });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'ไม่พบรายการที่ต้องการอัปเดต' });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตรายการรายรับ:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัปเดตรายการรายรับ',
      });
  }
});

// อัปเดตรายการรายจ่าย
app.put('/api/update-expenses-item/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, itemId, label, amount, comment } = req.body;

    const result = await Expense.findOneAndUpdate(
      { userId, date, 'items._id': itemId },
      {
        $set: {
          'items.$.label': label,
          'items.$.amount': amount,
          'items.$.comment': comment,
        },
      },
      { new: true }
    );

    if (result) {
      res.json({ success: true, message: 'รายการรายจ่ายถูกอัปเดตแล้ว' });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'ไม่พบรายการที่ต้องการอัปเดต' });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตรายการรายจ่าย:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัปเดตรายการรายจ่าย',
      });
  }
});

// อัปเดตรายการเงินออม
app.put('/api/update-savings-item/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date, itemId, label, amount, comment } = req.body;

    const result = await Saving.findOneAndUpdate(
      { userId, date, 'items._id': itemId },
      {
        $set: {
          'items.$.label': label,
          'items.$.amount': amount,
          'items.$.comment': comment,
        },
      },
      { new: true }
    );

    if (result) {
      res.json({ success: true, message: 'รายการเงินออมถูกอัปเดตแล้ว' });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'ไม่พบรายการที่ต้องการอัปเดต' });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตรายการเงินออม:', error);
    res
      .status(500)
      .json({
        success: false,
        message: 'เกิดข้อผิดพลาดในการอัปเดตรายการเงินออม',
      });
  }
});

app.put('/api/update-income-item/:userId/:itemId', async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    const { amount } = req.body;
    const result = await Income.findOneAndUpdate(
      { userId, 'items._id': itemId },
      { $set: { 'items.$.amount': amount } },
      { new: true }
    );
    if (result) {
      res.json({ success: true, message: 'รายการถูกอัปเดตแล้ว' });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'ไม่พบรายการที่ต้องการอัปเดต' });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตรายการ:', error);
    res
      .status(500)
      .json({ success: false, message: 'เกิดข้อผิดพลาดในการอัปเดตรายการ' });
  }
});


app.delete('/api/delete-data/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { month } = req.body;

    let query = { userId };
    if (month !== 'all') {
      const startDate = new Date(new Date().getFullYear(), month - 1, 1);
      const endDate = new Date(new Date().getFullYear(), month, 0);
      query.date = { $gte: startDate, $lte: endDate };
    }

    await Income.deleteMany(query);
    await Expense.deleteMany(query);
    await Saving.deleteMany(query);

    res.json({ success: true, message: 'ลบข้อมูลสำเร็จ' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    res
      .status(500)
      .json({ success: false, message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
  }
});

app.post('/api/google-signin', async (req, res) => {
  const { email, name } = req.body;
  console.log("Received data from client:", req.body);

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ userId: user._id, message: null });
    } else {
      const newUser = new User({
        name,
        email,
        userId: new mongoose.Types.ObjectId(),
      }); // สร้าง ObjectId ใหม่
      await newUser.save();
      return res
        .status(201)
        .json({
          userId: newUser._id,
          message:
            'คุณได้สร้าง user ใหม่ในระบบ ระบบจะทำการจัดเก็บ ชื่อ และ email ของคุณเพื่อใช้ในการเข้าใช้งานครั้งต่อไป',
        });
    }
  } catch (error) {
    console.error('Error during Google sign-in:', error);
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงชื่อใช้งานด้วย Google' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});