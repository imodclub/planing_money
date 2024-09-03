// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Home from './Home';
import UserDashboard from './UserDashboard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignUpWithGoogle from './SignUpWithGoogle';
import OldSignin from './OldSignin';

const App = () => {
  return (
    <GoogleOAuthProvider clientId='744798245558-bt7nsjoigdetib55o9ra0ghddbigkp1a.apps.googleusercontent.com'>
    <Router>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
            <Route path="/signupwithgoogle" element={<SignUpWithGoogle />} />
            <Route path='/oldsignin' element={<OldSignin />} />
        </Routes>
      </LocalizationProvider>
    </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
