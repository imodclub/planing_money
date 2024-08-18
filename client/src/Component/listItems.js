import React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AssessmentIcon from '@mui/icons-material/Assessment';

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
    <React.Fragment>
      <ListItemButton onClick={onUserReportClick}>
        <ListItemIcon>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="รายงานทางการเงินของคุณ" />
      </ListItemButton>
      <ListItemButton onClick={onUserIncomeFormClick}>
        <ListItemIcon>
          <AttachMoneyIcon />
        </ListItemIcon>
        <ListItemText primary="บันทึกรายรับ" />
      </ListItemButton>
      <ListItemButton onClick={onUserExpensesFormClick}>
        <ListItemIcon>
          <MoneyOffIcon />
        </ListItemIcon>
        <ListItemText primary="บันทึกรายจ่าย" />
      </ListItemButton>
      <ListItemButton onClick={onUserSavingsFormClick}>
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText primary="บันทึกเงินออม" />
      </ListItemButton>
    </React.Fragment>
  );
};

export const SecondaryListItems = () => {
  return (
    <React.Fragment>
      <ListItemButton onClick={handleSignOut}>
        <ListItemIcon>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary="ออกจากระบบ" />
      </ListItemButton>
    </React.Fragment>
  );
};
