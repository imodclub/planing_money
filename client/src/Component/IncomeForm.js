// components/IncomeForm.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

const IncomeForm = () => {
  const [date, setDate] = useState(dayjs());
  const [incomeItems, setIncomeItems] = useState([
    { label: 'เงินเดือน', amount: '', comment: '' },
    { label: 'รายได้จากขายสินค้า', amount: '', comment: '' },
    { label: 'รายได้จากค่าเช่า', amount: '', comment: '' },
    { label: 'ดอกเบี้ยและเงินปันผล', amount: '', comment: '' },
  ]);
  
  const [newItem, setNewItem] = useState({ label: '', amount: '', comment: '' });

  const handleAmountChange = (index, value) => {
    const updatedItems = [...incomeItems];
    updatedItems[index].amount = value.replace(/,/g, ''); // Remove commas for processing
    setIncomeItems(updatedItems);
  };

  const handleCommentChange = (index, value) => {
    const updatedItems = [...incomeItems];
    updatedItems[index].comment = value;
    setIncomeItems(updatedItems);
  };

  const handleAddItem = () => {
    if (newItem.label && newItem.amount) {
      setIncomeItems([...incomeItems, newItem]);
      setNewItem({ label: '', amount: '', comment: '' });
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = incomeItems.filter((_, i) => i !== index);
    setIncomeItems(updatedItems);
  };

  const handleSave = async () => {
    // บันทึกรายการทั้งหมดไปยัง save-income
    const response = await fetch('http://localhost:5002/api/save-income', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, incomeItems }),
    });

    if (response.ok) {
      // เคลียร์ฟอร์มและรีโหลดฟอร์ม
      setDate(new Date());
      setIncomeItems([
        { label: 'เงินเดือน', amount: '', comment: '' },
        { label: 'รายได้จากขายสินค้า', amount: '', comment: '' },
        { label: 'รายได้จากค่าเช่า', amount: '', comment: '' },
        { label: 'ดอกเบี้ยและเงินปันผล', amount: '', comment: '' },
      ]);
    }
  };

  useEffect(() => {
    // ดึงข้อมูลจากฐานข้อมูลเมื่อผู้ใช้งาน Sign In
    const fetchIncomeData = async () => {
      const response = await fetch('http://localhost:5002/api/income-data');
      const data = await response.json();
      // ตรวจสอบและรวมข้อมูลที่มีอยู่
      const combinedItems = incomeItems.map(item => {
        const found = data.find(d => d.label === item.label);
        return found ? { ...item, amount: found.amount, comment: found.comment } : item;
      });
      setIncomeItems(combinedItems);
    };

    fetchIncomeData();
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        บันทึกรายได้
      </Typography>

      <DateTimePicker
        label="เลือกวันที่"
        value={date}
        onChange={(newValue) => setDate(newValue)}
        renderInput={(params) => <TextField {...params} fullWidth />}
      />

      {incomeItems.map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
          <Grid item xs={6}>
            <TextField
              label={item.label}
              value={item.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} // Format amount with commas
              onChange={(e) => handleAmountChange(index, e.target.value)}
              fullWidth
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="จำนวนเงิน"
              value={item.amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={8}>
            <TextField
              label="หมายเหตุ"
              value={item.comment}
              onChange={(e) => handleCommentChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={() => handleDeleteItem(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="รายการใหม่"
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="จำนวนเงิน"
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="หมายเหตุ"
            value={newItem.comment}
            onChange={(e) =>
              setNewItem({ ...newItem, comment: e.target.value })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" onClick={handleAddItem} fullWidth>
            เพิ่มรายการ
          </Button>
        </Grid>
      </Grid>

      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        sx={{ marginTop: 2 }}
      >
        บันทึกรายการ
      </Button>
    </Box>
  );
};

export default IncomeForm;