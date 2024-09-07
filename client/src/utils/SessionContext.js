import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiURL from '../config/Config';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [name, setName] = useState(''); // กำหนด state สำหรับ name
  const [userId, setUserId] = useState(''); // กำหนด state สำหรับ userId

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${apiURL}/session`, {
          method: 'GET',
          headers: {
            'Contene-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
          setName(data.name || ''); // ตรวจสอบว่ามีค่า name หรือไม่
          setUserId(data.userId || '');
          localStorage.setItem('session', data.sessionId || '');
        } 
      } catch (error) {
        console.error('Error fetching session:', error);
      }
    };

    fetchSession();
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
};
