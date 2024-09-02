import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import apiURL from '../config/Config';

const Signup = ({ onSuccess }) => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [open, setOpen] = useState(false); // State สำหรับเปิด/ปิด Dialog
  const [message, setMessage] = useState(''); // State สำหรับข้อความใน Dialog

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${apiURL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message); // ตั้งค่าข้อความสำเร็จ
        onSuccess(data.message); // ส่งข้อความสำเร็จไปยัง Home
        setUsername(''); // เคลียร์ฟอร์ม
        setPassword('');
        setOpen(true); // เปิด Dialog
      } else {
        const errorData = await response.json();
        setMessage(errorData.message); // ตั้งค่าข้อความผิดพลาด
        setOpen(true); // เปิด Dialog
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('เกิดข้อผิดพลาดในการลงทะเบียน');
      setOpen(true); // เปิด Dialog
    }
  };

  const handleClose = () => {
    setOpen(false); // ปิด Dialog
  };

  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoFocus
        sx={{ maxWidth: { xs: 345, sm: 452, md: 568 } }}
      />

      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ maxWidth: { xs: 345, sm: 452, md: 568 } }}
      />
      <TextField
        margin="normal"
        fullWidth
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ maxWidth: { xs: 345, sm: 452, md: 568 } }}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ maxWidth: { xs: 345, sm: 452, md: 568 } }}
      >
        Sign Up
      </Button>

      {/* Dialog สำหรับข้อความแจ้งเตือน */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Notification</DialogTitle>
        <DialogContent>
          <Typography>{message}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Signup;