// src/listItems.js
import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const handleSignOut = () => {
  // ลบ Cookie และ session
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
  localStorage.removeItem('userId'); // ลบ userId จาก LocalStorage
  localStorage.removeItem('name'); // ลบ name จาก LocalStorage

  // คุณสามารถเพิ่มการนำทางไปยังหน้าลงชื่อเข้าใช้งานที่นี่
  window.location.href = '/'; // เปลี่ยนเส้นทางไปยังหน้าลงชื่อเข้าใช้งาน
};

export const mainListItems = (
  <div>
    <ListItem button>
      <ListItemText primary="Dashboard" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Profile" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Income" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Settings" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListItem button onClick={handleSignOut}>
      <ListItemText primary="ออกจากระบบ" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Contact Us" />
    </ListItem>
  </div>
);
