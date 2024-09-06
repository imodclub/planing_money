import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import apiURL from '../config/Config';

const SignIn = ({ onSuccess }) => {
   
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // เรียกใช้ useNavigate()

 
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiURL}/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Sign in successful, cookies set:', document.cookie);
        setMessage(data.message);
        onSuccess(data.message); // ส่งข้อความสำเร็จไปยัง Home

       /*--------- ทดสอบการใช้งาน session บน MongoDb
        // บันทึกข้อมูลลง LocalStorage
        const userId = data.userId; // สมมติว่าเซิร์ฟเวอร์ส่งกลับ userId
        const name = data.name;
        localStorage.setItem('userId', userId); 
        localStorage.setItem('name', name);
       ---------------ปิด ทดสอบการใช้งาน session บน MongoDb */

        // เปลี่ยนเส้นทางไปยัง UserDashboard
        navigate('/userdashboard'); 

        setUsername(''); // เคลียร์ฟอร์ม
        setPassword('');
        setOpen(true); // เปิด Dialog
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
        setOpen(true); // เปิด Dialog
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('เกิดข้อผิดพลาดในการลงชื่อเข้าใช้');
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

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ maxWidth: { xs: 345, sm: 452, md: 568 }, mt: 2 }}
      >
        Sign In
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

export default SignIn;
