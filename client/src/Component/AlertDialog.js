// components/AlertDialog.js
import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const AlertDialog = ({ open, handleClose, message }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>แจ้งเตือน</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          ตกลง
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;