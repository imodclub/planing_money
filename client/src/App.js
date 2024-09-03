// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Home from './Home';
import UserDashboard from './UserDashboard';
import ForgotPassword from './ForgotPassword';

const App = () => {
  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} /> 
        </Routes>
      </LocalizationProvider>
    </Router>
  );
};

export default App;
