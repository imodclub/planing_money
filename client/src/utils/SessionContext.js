import React, { createContext, useState, useEffect } from 'react';
import apiURL from '../config/Config';

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
    const [session, setSession] = useState(null);
    const [localUserId, setLocalUserId] = useState('');
    const [localName, setLocalName] = useState('');

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
            localStorage.getItem('userId', localUserId);
            localStorage.getItem('name', localName);
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
