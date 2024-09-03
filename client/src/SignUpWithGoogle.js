import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode'
import apiURL from './config/Config';

const SignInButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const onSuccess = async (credentialResponse) => {
    console.log('Login Success:', credentialResponse);

    // Decode the JWT token to get user information
    const decoded = jwtDecode(credentialResponse.credential);
    console.log('Decoded User Info:', decoded);

    // Set user profile state
    setUserProfile({
      id: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture,
    });

    setIsLoggedIn(true);

    try {
      const userData = {
        "email": decoded.email,
        "name": decoded.name,
      };

      const response = await fetch(`${apiURL}/google-signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const { userId, message } = data;

      // ตรวจสอบว่ามี userId ก่อนบันทึกลง localStorage
      if (userId) {
        localStorage.setItem("userId", userId);
        localStorage.setItem("name", decoded.name);
        sessionStorage.setItem('name', decoded.name);

        if (message) {
          alert(message);
        }

        window.location.href = '/userdashboard';
      } else {
        console.error("No userId returned from server");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

const onError = () => {
  console.log("Login Failed");
};

const handleSignOut = () => {
  googleLogout(); // Use googleLogout to clear the session
  setIsLoggedIn(false);
  setUserProfile(null);
  console.log("User signed out.");
};

return (

  <div>
    {!isLoggedIn ? (
      <GoogleLogin onSuccess={onSuccess} onError={onError} />
    ) : (
      <div>
        <p>Welcome, {userProfile.name}</p>
        <img src={userProfile.picture} alt="Profile" />
        <p>Email: {userProfile.email}</p>
        <p>name: {userProfile.name}</p>
        <Button variant="contained" color="secondary" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    )}
  </div>

);
};

export default SignInButton;