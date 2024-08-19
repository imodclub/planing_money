import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const IncomeReport = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [showMonthlyIncome, setShowMonthlyIncome] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredIncome, setFilteredIncome] = useState([]);

  useEffect(() => {
    const fetchTotalIncome = async () => {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5002/api/total-income/${userId}`);
      const data = await response.json();
      setTotalIncome(data.totalIncome);
    };

    fetchTotalIncome();
  }, []);

const fetchMonthlyIncome = async () => {
  const userId = localStorage.getItem('userId');
  const response = await fetch(`http://localhost:5002/api/monthly-income/${userId}`);
  const data = await response.json();
  
  // สร้างอาร์เรย์ที่มี 12 เดือน
  const allMonths = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    amount: 0
  }));
  
  // อัปเดตข้อมูลจาก API
  data.forEach(item => {
    const monthIndex = item.month - 1;
    if (monthIndex >= 0 && monthIndex < 12) {
      allMonths[monthIndex].amount = item.amount;
    }
  });
  
  setMonthlyIncome(allMonths);
  setShowMonthlyIncome(true);
};


  const fetchFilteredIncome = async () => {
    const userId = localStorage.getItem('userId');
    const response = await fetch(`http://localhost:5002/api/filtered-income/${userId}?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    setFilteredIncome(data);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US');
  };

  return (
    <Box>
      <Typography variant="h4">รายงานรายรับ</Typography>

      {!showMonthlyIncome && (
  <Box>
    <Typography variant="h5">รายรับรวมทั้งหมดตลอดปี</Typography>
    <TableContainer component={Paper} sx={{ mt: 2, mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>รายการ</TableCell>
            <TableCell align="right">จำนวนเงิน</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(totalIncome)
            .filter(([_, amount]) => amount > 0)
            .map(([label, amount]) => (
              <TableRow key={label}>
                <TableCell>{label}</TableCell>
                <TableCell align="right">{formatAmount(amount)}</TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell><strong>รวมทั้งหมด</strong></TableCell>
            <TableCell align="right"><strong>{formatAmount(Object.values(totalIncome).reduce((a, b) => a + b, 0))}</strong></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    <Button variant="contained" onClick={fetchMonthlyIncome}>
      แสดงรายรับรายเดือน
    </Button>
  </Box>
)}


      <Box mt={4}>
        <Typography variant="h5">ค้นหารายรับตามช่วงเวลา</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="วันที่เริ่มต้น"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
          />
          <DatePicker
            label="วันที่สิ้นสุด"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
          />
        </LocalizationProvider>
        <Button variant="contained" onClick={fetchFilteredIncome}>
          ค้นหา
        </Button>
      </Box>

      {filteredIncome.length > 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>วันที่</TableCell>
                <TableCell>รายการ</TableCell>
                <TableCell align="right">จำนวนเงิน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncome.map((item) => (
                <TableRow key={item._id}>
                  <TableCell component="th" scope="row">
                    {item.date}
                  </TableCell>
                  <TableCell>{item.label}</TableCell>
                  <TableCell align="right">{formatAmount(item.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default IncomeReport;