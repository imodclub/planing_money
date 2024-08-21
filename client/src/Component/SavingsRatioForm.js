import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import apiURL from '../config/Config';

const SavingsRatioForm = () => {
  const [savingsItems, setSavingsItems] = useState([
    { label: 'เป้าหมายเพื่อการเกษียณ', description: 'เงินเก็บเพื่อการเกษียณ ไม่มีการใช้จ่ายจนครบอายุ 60 ปี', percentage: '' },
    { label: 'เป้าหมายเพื่อสุขภาพ', description: 'กลุ่มประกันชีวิต และประกันสุขภาพ', percentage: '' },
    { label: 'เป้าหมายเพื่อสนองความต้องการ', description: 'เป้าหมายทางการเงินกับสิ่งที่ต้องการซื้อ', percentage: '' },
  ]);

  const [newItem, setNewItem] = useState({
    label: '',
    description: '',
    percentage: '',
  });

  const [openDialog, setOpenDialog] = useState(false);

  const handlePercentageChange = (index, value) => {
    const updatedItems = [...savingsItems];
    updatedItems[index].percentage = value;
    setSavingsItems(updatedItems);
  };

  const handleAddItem = () => {
    if (newItem.label && newItem.percentage) {
      setSavingsItems([...savingsItems, newItem]);
      setNewItem({ label: '', description: '', percentage: '' });
    }
  };

  const handleDeleteItem = (index) => {
    const updatedItems = savingsItems.filter((_, i) => i !== index);
    setSavingsItems(updatedItems);
  };

  const calculateRemainingPercentage = (index) => {
    const totalPercentage = savingsItems.reduce((sum, item, i) => {
      if (i < index) {
        return sum + (item.percentage ? parseFloat(item.percentage) : 0);
      }
      return sum;
    }, 0);

    return Math.max(100 - totalPercentage, 0);
  };

    const handleSave = async () => {
    const totalPercentage = savingsItems.reduce((sum, item) => sum + (item.percentage ? parseFloat(item.percentage) : 0), 0);

    if (totalPercentage > 100) {
      setOpenDialog(true);
      return;
    }

    const userId = localStorage.getItem('userId');
    
    const response = await fetch(`${apiURL}/save-savings-ratio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        savingsItems,
        userId,
        createdAt: new Date().toISOString(),
      }),
    });

    if (response.ok) {
        alert('บันทึกสัดส่วนเงินออมสำเร็จ!');
        setSavingsItems([
          {
            label: 'เป้าหมายเพื่อการเกษียณ',
            description:
              'เงินเก็บเพื่อการเกษียณ ไม่มีการใช้จ่ายจนครบอายุ 60 ปี',
            percentage: '',
          },
          {
            label: 'เป้าหมายเพื่อสุขภาพ',
            description: 'กลุ่มประกันชีวิต และประกันสุขภาพ',
            percentage: '',
          },
          {
            label: 'เป้าหมายเพื่อสนองความต้องการ',
            description: 'เป้าหมายทางการเงินกับสิ่งที่ต้องการซื้อ',
            percentage: '',
          },
        ]);
        setNewItem({ label: '', description: '', percentage: '' });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      <Typography variant="h6">สัดส่วนเงินออม</Typography>
      
      {savingsItems.map((item, index) => (
        <Grid container key={index} alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Typography>{item.label}</Typography>
            <Typography variant="body2">{item.description}</Typography>
          </Grid>
          <Grid item xs={10} sm={7}>
            <TextField
              type="number"
              value={item.percentage}
              onChange={(e) => handlePercentageChange(index, e.target.value)}
              InputProps={{
                endAdornment: <Typography>{calculateRemainingPercentage(index)}%</Typography>,
                inputProps: { min: 0, max: calculateRemainingPercentage(index) },
              }}
              fullWidth
            />
          </Grid>
          <Grid item xs={2} sm={1}>
            <IconButton onClick={() => handleDeleteItem(index)} color="error">
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <TextField
            label="เป้าหมายการออม"
            value={newItem.label}
            onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="คำอธิบาย"  
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            fullWidth
          />
        </Grid>
        <Grid item xs={10} sm={3}>
          <TextField
            type="number"
            value={newItem.percentage}
            onChange={(e) => setNewItem({ ...newItem, percentage: e.target.value })}
            InputProps={{
              endAdornment: <Typography>{calculateRemainingPercentage(savingsItems.length)}%</Typography>,
              inputProps: { min: 0, max: calculateRemainingPercentage(savingsItems.length) },
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={2} sm={1}>
          <IconButton onClick={handleAddItem} color="primary">
            <AddCircleIcon />
          </IconButton>
        </Grid>
      </Grid>

      <Button variant="contained" onClick={handleSave} sx={{ mt: 2 }}>
        บันทึกสัดส่วนเงินออม
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>คำเตือน</DialogTitle>
        <DialogContent>
          <Typography>ไม่ควรระบุค่าเกินค่าที่เหลือ</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavingsRatioForm;
