import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

const ExpensesForm = () => {
  const [date, setDate] = useState(dayjs());
  const [expenseItems, setExpenseItems] = useState([
    { label: 'ค่าผ่อนบ้าน', amount: '', comment: '' },
    { label: 'ค่าผ่อนรถ', amount: '', comment: '' },
    { label: 'ค่าผ่อนสหกรณ์', amount: '', comment: '' },
    { label: 'ค่าบัตรเครดิตสินเชื่อเงินสด', amount: '', comment: '' },
    { label: 'ค่าผ่อนสินค้า', amount: '', comment: '' },
    { label: 'ค่าไฟฟ้า', amount: '', comment: '' },
    { label: 'ค่าอินเตอร์เน็ตบ้าน', amount: '', comment: '' },
    { label: 'ค่าโทรศัพท์มือถือ', amount: '', comment: '' },
    { label: 'จ่ายลูกไปโรงเรียน', amount: '', comment: '' },
    { label: 'ค่าน้ำมัน', amount: '', comment: '' },
  ]);

  const [newItem, setNewItem] = useState({
    label: '',
    amount: '',
    comment: '',
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);

  const handleAmountChange = (index, value) => {
    const updatedItems = [...expenseItems];
    updatedItems[index].amount = value.replace(/,/g, '');
    setExpenseItems(updatedItems);
  };

  const formatAmount = (amount) => {
    return amount ? amount.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '';
  };

  const handleCommentChange = (index, value) => {
    const updatedItems = [...expenseItems];
    updatedItems[index].comment = value;
    setExpenseItems(updatedItems);
  };

  const handleAddItem = () => {
    if (newItem.label && newItem.amount) {
      setExpenseItems([...expenseItems, newItem]);
      setNewItem({ label: '', amount: '', comment: '' });
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = expenseItems.filter((_, i) => i !== index);
    setExpenseItems(updatedItems);
  };

  const handleSave = async () => {
    const apiURL = process.env.NODE_ENV === 'production' 
  ? 'https://planing-money.vercel.app/api' 
  : 'http://localhost:5002/api';
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setDialogOpen(true);
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];
    const timestamp = new Date().toISOString();

    const response = await fetch(`${apiURL}/save-expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: formattedDate,
        expenseItems,
        userId,
        timestamp,
      }),
    });

    if (response.ok) {
      setSuccessDialogOpen(true);
      setExpenseItems([
        { label: 'ค่าผ่อนบ้าน', amount: '', comment: '' },
        { label: 'ค่าผ่อนรถ', amount: '', comment: '' },
        { label: 'ค่าผ่อนสหกรณ์', amount: '', comment: '' },
        { label: 'ค่าบัตรเครดิตสินเชื่อเงินสด', amount: '', comment: '' },
        { label: 'ค่าผ่อนสินค้า', amount: '', comment: '' },
        { label: 'ค่าไฟฟ้า', amount: '', comment: '' },
        { label: 'ค่าอินเตอร์เน็ตบ้าน', amount: '', comment: '' },
        { label: 'ค่าโทรศัพท์มือถือ', amount: '', comment: '' },
        { label: 'จ่ายลูกไปโรงเรียน', amount: '', comment: '' },
        { label: 'ค่าน้ำมัน', amount: '', comment: '' },
      ]);
    }
  };

  useEffect(() => {
    const fetchExpenseData = async () => {
      const apiURL = process.env.NODE_ENV === 'production' 
  ? 'https://planing-money.vercel.app/api' 
  : 'http://localhost:5002/api';
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('No userId found in LocalStorage');
        return;
      }

      try {
        const response = await fetch(
          `${apiURL}/expense-data/${userId}`
        );
        if (response.ok) {
          const data = await response.json();

          if (data.length > 0) {
            const latestDocument = data[data.length - 1];
            console.log(
              'Latest document labels:',
              latestDocument.items.map((item) => item.label)
            );

            const newExpenseItems = latestDocument.items.map((item) => ({
              label: item.label,
              amount: '',
              comment: '',
            }));

            const existingLabels = expenseItems.map((item) => item.label);
            const uniqueItems = newExpenseItems.filter(
              (item) => !existingLabels.includes(item.label)
            );

            setExpenseItems([...expenseItems, ...uniqueItems]);
          } else {
            console.log('No documents found for this userId.');
          }
        } else {
          console.error('Error fetching expense data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching expense data:', error);
      }
    };

    fetchExpenseData();
  }, [expenseItems]);

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleCloseSuccessDialog = () => {
    setSuccessDialogOpen(false);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        บันทึกรายจ่าย
      </Typography>
      <Grid container spacing={2} sx={{ marginTop: 2 }}>
        <Grid item xs={3}>
          <Typography variant="body1" color="black">
            วันที่บันทึก
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              value={date}
              onChange={(newValue) => setDate(newValue)}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
      {expenseItems.map((item, index) => (
        <Grid container spacing={2} key={index} sx={{ marginTop: 2 }}>
          <Grid item xs={3}>
            <Typography variant="body1" color="black">
              {item.label}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="จำนวนเงิน"
              value={formatAmount(item.amount)}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              label="รายละเอียดเพิ่มเติม"
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
        <Grid item xs={3}>
          <TextField
            label="รายการใหม่"
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            label="จำนวนเงิน"
            value={newItem.amount}
            onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="รายละเอียดเพิ่มเติม"
            value={newItem.comment}
            onChange={(e) =>
              setNewItem({ ...newItem, comment: e.target.value })
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={2}>
          <Button
            variant="contained"
            onClick={handleAddItem}
            color="success"
            startIcon={<AddCircleIcon />}
            fullWidth
          >
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

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>ข้อผิดพลาด</DialogTitle>
        <DialogContent>
          <Typography>ไม่พบ userId กรุณาลงชื่อเข้าใช้ใหม่</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={successDialogOpen} onClose={handleCloseSuccessDialog}>
        <DialogTitle>บันทึกสำเร็จ</DialogTitle>
        <DialogContent>
          <Typography>บันทึกข้อมูลรายจ่ายสำเร็จ!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSuccessDialog} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExpensesForm;
