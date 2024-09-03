import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
 
} from '@mui/material';

import SignInButton from './SignUpWithGoogle';

const Home = () => {
 

  

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
    </Grid>
  );
};

export default Home;
