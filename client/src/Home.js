import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
 
} from '@mui/material';
import { Link } from 'react-router-dom';
import SignInButton from './SignUpWithGoogle';

const Home = () => {
 

  

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '50vh' }}
    >
      <Card sx={{ width: 300, padding: 1 }}>
        <CardHeader title="" />
        <CardContent>
          <SignInButton
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '50vh' }}
          />
        </CardContent>
      </Card>
      <Grid container justifyContent="center" alignItems="center">
        <Card sx={{ width: 300, padding: 1 }}>
          <CardHeader title="สำหรับผู้ใช้งานใหม่และเก่า สามารถ Sign In ด้วย Google ได้เลย" />
          <CardContent>
<<<<<<< HEAD
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
            {successMessage && (
              <Typography variant="body2" color="success">
                {successMessage}
              </Typography>
            )}
=======
>>>>>>> development
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mt={1}
            >
              ระบบจัดเก็บข้อมูล Email และ ชื่อ ไว้เพื่อการเข้าใช้งานระบบเท่านั้น
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              mt={1}
            >
              ลิงค์สำหรับเข้าระบบบัญชีแบบเดิม{' '}
              <nav>
                <Link to="/oldsignin">เข้าระบบแบบเดิม</Link>
              </nav>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Home;
