import React, { createContext, useState, useEffect } from 'react';
import apiURL from '../config/Config';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${apiURL}/session`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setSession(data);
         
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
