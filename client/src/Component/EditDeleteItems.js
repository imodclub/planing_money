// components/EditDeleteItems.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import apiURL from '../config/Config';

const EditDeleteItems = () => {
  const [type, setType] = useState('income');
  const [date, setDate] = useState(dayjs());
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [type, date]);

  const fetchItems = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('ไม่พบ userId');
      return;
    }

    try {
      const formattedDate = date.format('YYYY-MM-DD');
      let endpoint = '';
      switch (type) {
        case 'income':
          endpoint = `${apiURL}/income-data/${userId}`;
          break;
        case 'expenses':
          endpoint = `${apiURL}/expense-data/${userId}`;
          break;
        case 'savings':
          endpoint = `${apiURL}/savings/${userId}`;
          break;
        default:
          console.error('ประเภทรายการไม่ถูกต้อง');
          return;
      }
      console.log('Fetching from:', endpoint);

      const response = await fetch(`${endpoint}?date=${formattedDate}`);
      if (response.ok) {
        const data = await response.json();
        console.log('API response:', data);

        // ค้นหาข้อมูลสำหรับวันที่เลือก
        const selectedDateData = data.find(
          (item) =>
            new Date(item.date).toDateString() ===
            new Date(formattedDate).toDateString()
        );

        if (selectedDateData && Array.isArray(selectedDateData.items)) {
          console.log(
            `Found ${type} items for selected date:`,
            selectedDateData.items
          );
          setItems(selectedDateData.items);
        } else {
          console.log(`No ${type} items found for selected date`);
          setItems([]);
        }
      } else {
        console.error('Error fetching data:', response.status);
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      setItems([]);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setDialogOpen(true);
  };

  const handleDelete = async (itemId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('ไม่พบ userId');
      return;
    }

    try {
      const endpoint = `${apiURL}/update-${type}-item/${userId}/${itemId}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: null }), // ส่งค่า null เพื่อตั้งจำนวนเงินเป็นค่าว่าง
      });
      if (response.ok) {
        fetchItems();
      } else {
        console.error('เกิดข้อผิดพลาดในการอัปเดตรายการ:', response.status);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตรายการ:', error);
    }
  };

  const handleSaveEdit = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId || !editItem) return;

    try {
      const endpoint = `${apiURL}/update-${type}-item/${userId}`;
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: date.format('YYYY-MM-DD'),
          itemId: editItem._id,
          label: editItem.label,
          amount: editItem.amount,
          comment: editItem.comment,
        }),
      });
      if (response.ok) {
        setDialogOpen(false);
        fetchItems();
      } else {
        console.error('เกิดข้อผิดพลาดในการแก้ไขรายการ:', response.status);
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขรายการ:', error);
    }
  };

  return (
    <Box>
      <FormControl fullWidth margin="normal">
        <InputLabel>ประเภทรายการ</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="income">รายรับ</MenuItem>
          <MenuItem value="expenses">รายจ่าย</MenuItem>
          <MenuItem value="savings">เงินออม</MenuItem>
        </Select>
      </FormControl>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="เลือกวันที่"
          value={date}
          onChange={(newValue) => setDate(newValue)}
          renderInput={(params) => (
            <TextField {...params} fullWidth margin="normal" />
          )}
        />
      </LocalizationProvider>

      <List>
        {console.log('Rendering items:', items)}
        {items.map((item) => (
          <ListItem key={item._id}>
            <ListItemText
              primary={item.label}
              secondary={
                <>
                  <Typography variant="body2">
                    จำนวนเงิน: {item.amount}
                  </Typography>
                  {item.comment && (
                    <Typography variant="body2">
                      หมายเหตุ: {item.comment}
                    </Typography>
                  )}
                </>
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={() => handleEdit(item)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(item._id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>แก้ไขรายการ</DialogTitle>
        <DialogContent>
          {editItem && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="รายการ"
                fullWidth
                value={editItem.label}
                onChange={(e) =>
                  setEditItem({ ...editItem, label: e.target.value })
                }
              />
              <TextField
                margin="dense"
                label="จำนวนเงิน"
                fullWidth
                type="number"
                value={editItem.amount}
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    amount: parseFloat(e.target.value),
                  })
                }
              />
              <TextField
                margin="dense"
                label="หมายเหตุ"
                fullWidth
                value={editItem.comment}
                onChange={(e) =>
                  setEditItem({ ...editItem, comment: e.target.value })
                }
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
          <Button onClick={handleSaveEdit}>บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditDeleteItems;
