import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import apiURL from '../config/Config';

const months = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
  'ลบข้อมูลทั้งหมด',
];

const DeleteData = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleDeleteData = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('ไม่พบ userId');
      return;
    }

    try {
      const endpoint = `${apiURL}/delete-data/${userId}`;
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month:
            selectedMonth === 'ลบข้อมูลทั้งหมด'
              ? 'all'
              : months.indexOf(selectedMonth) + 1,
        }),
      });

      if (response.ok) {
        console.log('ลบข้อมูลสำเร็จ');
        // อาจจะเพิ่มการอัปเดต UI หรือแจ้งเตือนผู้ใช้ที่นี่
      } else {
        console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', response.status);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    }

    setOpenDialog(false);
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>เลือกเดือนที่ต้องการลบข้อมูล</InputLabel>
        <Select value={selectedMonth} onChange={handleMonthChange}>
          {months.map((month) => (
            <MenuItem key={month} value={month}>
              {month}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="error"
        onClick={handleDeleteData}
        disabled={!selectedMonth}
      >
        ลบข้อมูล
      </Button>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" style={{ color: 'red' }}>
          {'ยืนยันการลบข้อมูล'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ {selectedMonth}?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ยกเลิก</Button>
          <Button onClick={handleConfirmDelete} autoFocus>
            ยืนยัน
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteData;
