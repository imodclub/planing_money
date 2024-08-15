// src/listItems.js
import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate

const handleSignOut = () => {
  // ลบ Cookie และ session
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
  localStorage.removeItem('userId'); // ลบ userId จาก LocalStorage
  localStorage.removeItem('name'); // ลบ name จาก LocalStorage

  // เปลี่ยนเส้นทางไปยังหน้าลงชื่อเข้าใช้งาน
  window.location.href = '/';
};

export const MainListItems = ({ onUserIncomeFormClick }) => {
  const navigate = useNavigate(); // ใช้ useNavigate

  return (
    <div>
      <ListItem button onClick={onUserIncomeFormClick}>
        <ListItemText primary="บันทึกรายรับ" />
      </ListItem>
      <ListItem button onClick={() => navigate('/profile')}>
        <ListItemText primary="Profile" />
      </ListItem>
      <ListItem button onClick={() => navigate('/income')}>
        <ListItemText primary="Income" />
      </ListItem>
      <ListItem button onClick={() => navigate('/settings')}>
        <ListItemText primary="Settings" />
      </ListItem>
    </div>
  );
};

export const SecondaryListItems = () => (
  <div>
    <ListItem button onClick={handleSignOut}>
      <ListItemText primary="ออกจากระบบ" />
    </ListItem>
    <ListItem button>
      <ListItemText primary="Contact Us" />
    </ListItem>
  </div>
);
