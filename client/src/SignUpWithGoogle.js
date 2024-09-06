import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { Button } from '@mui/material';
import { jwtDecode } from 'jwt-decode'
import apiURL from './config/Config';
import { useNavigate } from 'react-router-dom';

const SignInButton = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  const onSuccess = async (credentialResponse) => {

    // Decode the JWT token to get user information
    const decoded = jwtDecode(credentialResponse.credential);

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
        credentials:'include',
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const { userId, message } = data;

      if (userId) {

        if (message) {
          alert(message);
        }

        navigate('/userdashboard');
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