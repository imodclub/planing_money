import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import Signup from './Component/SignUp';
import SignIn from './Component/SignIn';
import SignInButton from './SignUpWithGoogle';

const Home = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSignIn, setIsSignIn] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSignupSuccess = (message) => {
    setSuccessMessage(message);
    setDialogOpen(true); // เปิด dialog หลังจากลงทะเบียนสำเร็จ
  };

  const handleSignInSuccess = (message) => {
    alert(message); // แสดงข้อความเมื่อการลงชื่อใช้งานสำเร็จ
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setIsSignIn(true); // กลับไปที่ Card เข้าสู่ระบบ
  };

  return (
    
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Card sx={{ width: 300, padding: 1 }}>
          <CardHeader title="ลงทะเบียนผู้ใช้ใหม่" />
          <CardContent>
            <SignInButton />
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mt={1}
            >
            </Typography>
          </CardContent>
        </Card>
        {/*
      {isSignIn ? (
        <Card sx={{ width: 300, padding: 2 }}>
          <CardHeader title="เข้าสู่ระบบ" />
          <CardContent>
            <SignIn onSuccess={handleSignInSuccess} />
            <Box mt={2}>
              <Typography
                variant="body2"
                color="textSecondary"
                align="center"
                mt={2}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={() => setIsSignIn(false)} // เมื่อคลิกปุ่มจะไปหน้าลงทะเบียน
                >
                  ลงทะเบียนผู้ใช้ใหม่
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ width: 300, padding: 2 }}>
          <CardHeader title="ลงทะเบียนผู้ใช้ใหม่" />
          <CardContent>
            <Signup onSuccess={handleSignupSuccess} />
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mt={2}
            >
              <Button color="secondary" onClick={() => setIsSignIn(true)}>
                กลับไปหน้าหลัก
              </Button>
            </Typography>
          </CardContent>
          <SignInButton
          variant="body2"
          color="textSecondary"
          align="center"
          mt={2}
          />
        </Card>
      )}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>ลงทะเบียนสำเร็จ</DialogTitle>
        <DialogContent>
          <Typography>คุณได้ลงทะเบียนสำเร็จแล้ว</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            ตกลง
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container
      justifyContent="center"
      alignItems="center"
      >     
        </Grid>
        */}
    </Grid>
  );
};

export default Home;
