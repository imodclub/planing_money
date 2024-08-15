// components/Home.js
import React, { useState } from 'react';
import { Grid, Card, CardContent, CardHeader, Typography, Button, Box } from '@mui/material';
import Signup from './Component/SignUp';
import SignIn from './Component/SignIn'; // นำเข้า SignIn Component

const Home = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [isSignIn, setIsSignIn] = useState(true); // ใช้เพื่อควบคุมการแสดงฟอร์ม

  const handleSignupSuccess = (message) => {
    setSuccessMessage(message);
    setIsSignIn(true); // สลับกลับไปที่ Sign In หลังจากลงทะเบียนสำเร็จ
  };

  const handleSignInSuccess = (message) => {
    alert(message); // แสดงข้อความเมื่อการลงชื่อใช้งานสำเร็จ
  };

  return (
    <Box sx={{ minHeight: '120vh', padding: 10 }}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={8}>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => setIsSignIn(true)} 
            sx={{ width: '50%', mb: 2 }}
          >
            เข้าใช้งาน
          </Button>
        
          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => setIsSignIn(false)} 
            sx={{ width: '50%', mb: 2 }}
          >
            ลงทะเบียน
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={8}>
          <Card sx={{ maxWidth: { xs: 345, sm: 452, md: 568 } }}>
            <CardHeader title={isSignIn ? "ลงชื่อใช้งาน" : "สร้าง User ใช้งาน"} />
            <CardContent>
              {successMessage && (
                <Typography variant="body2" color="success.main" gutterBottom>
                  {successMessage}
                </Typography>
              )}
              {isSignIn ? (
                <SignIn onSuccess={handleSignInSuccess} />
              ) : (
                <Signup onSuccess={handleSignupSuccess} />
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;