import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Paper,
 
} from '@mui/material';
import { Link } from 'react-router-dom';
import SignInButton from './SignUpWithGoogle';
import MyAd from './Component/MyAd';


const Home = () => {
 

  

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '50vh' }}
    >
      <Grid container justifyContent="center" alignItems="center">
        <Card sx={{ width: 300, padding: 1 }}>
          <CardHeader title="สำหรับผู้ใช้งานใหม่และเก่า สามารถ Sign In ด้วย Google ได้เลย" />
          <CardContent>
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
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '50vh' }}
      >
        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
          <SignInButton
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: '50vh' }}
          />
        </Paper>
      </Grid>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <MyAd />
      </Paper>
    </Grid>
  );
};

export default Home;
