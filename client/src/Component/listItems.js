import React from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

const handleSignOut = () => {
  document.cookie.split(';').forEach((c) => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
  localStorage.removeItem('userId');
  localStorage.removeItem('name');
  window.location.href = '/';
};

export const MainListItems = ({
  onUserIncomeFormClick,
  onUserExpensesFormClick,
  onUserSavingsFormClick,
  onUserReportClick,
}) => {
  return (
    <div>
      <ListItem button onClick={onUserReportClick}>
        <ListItemText primary="ข้อมูลทางการเงินของคุณ" />
      </ListItem>
      <ListItem button onClick={onUserIncomeFormClick}>
        <ListItemText primary="บันทึกรายรับ" />
      </ListItem>
      <ListItem button onClick={onUserExpensesFormClick}>
        <ListItemText primary="บันทึกรายจ่าย" />
      </ListItem>
      <ListItem button onClick={onUserSavingsFormClick}>
        <ListItemText primary="บันทึกเงินออม" />
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
