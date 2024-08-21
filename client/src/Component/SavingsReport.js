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
  Grid,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const SavingsReport = () => {
  const apiURL = process.env.NODE_ENV === 'production' 
  ? 'https://planing-money.vercel.app/api' 
  : 'http://localhost:5002/api';
  const [totalSavings, setTotalSavings] = useState(0);
  const [showMonthlySavings, setShowMonthlySavings] = useState(false);
  const [monthlySavings, setMonthlySavings] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredSavings, setFilteredSavings] = useState([]);

  useEffect(() => {
    const fetchTotalSavings = async () => {
      const userId = localStorage.getItem('userId');
      const response = await fetch(
        `${apiURL}/total-savings/${userId}`
      );
      const data = await response.json();
      setTotalSavings(data.totalSavings);
    };

    fetchTotalSavings();
  }, []);

  const fetchMonthlySavings = async () => {
    const userId = localStorage.getItem('userId');
    const response = await fetch(
      `http://localhost:5002/api/monthly-savings/${userId}`
    );
    const data = await response.json();
    setMonthlySavings(data);
    setShowMonthlySavings(true);
  };

  const fetchFilteredSavings = async () => {
    const userId = localStorage.getItem('userId');
    const formattedStartDate = startDate
      ? dayjs(startDate).format('YYYY-MM-DD')
      : '';
    const formattedEndDate = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
    const response = await fetch(
      `http://localhost:5002/api/filtered-savings/${userId}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
    );
    const data = await response.json();
    setFilteredSavings(data);
  };

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-US');
  };

  const getThaiMonth = (month) => {
    const thaiMonths = [
      'มกราคม',
      'กุมภาพันธ์',
      'มีนาคม',
      'เมษายน',
      'พฤษภาคม',
      'มิถุนายน',
      'กรกฎาคม',
      'สิงหาคม',
      'กันยายน',
      'ตุลาคม',
      'พฤศจิกายน',
      'ธันวาคม',
    ];
    return thaiMonths[month - 1];
  };

  return (
    <Box>
      <Typography variant="h4">รายงานเงินออม</Typography>

      {!showMonthlySavings && (
        <Box>
          <Typography variant="h5">เงินออมรวมทั้งหมดตลอดปี</Typography>
          <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>รายการ</TableCell>
                  <TableCell align="right">จำนวนเงิน</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(totalSavings)
                  .filter(([_, amount]) => amount > 0)
                  .map(([label, amount]) => (
                    <TableRow key={label}>
                      <TableCell>{label}</TableCell>
                      <TableCell align="right">
                        {formatAmount(amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow>
                  <TableCell>
                    <strong>รวมทั้งหมด</strong>
                  </TableCell>
                  <TableCell align="right">
                    <strong>
                      {formatAmount(
                        Object.values(totalSavings).reduce((a, b) => a + b, 0)
                      )}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" onClick={fetchMonthlySavings}>
            แสดงเงินออมรายเดือน
          </Button>
        </Box>
      )}

      {showMonthlySavings && (
        <Box>
          <Typography variant="h5">เงินออมรายเดือน</Typography>
          <Grid container spacing={2}>
            {monthlySavings.map((monthData, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Paper sx={{ p: 2, mb: 2 }}>
                  <Typography variant="h6">
                    {getThaiMonth(monthData.month)}
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>รายการ</TableCell>
                          <TableCell align="right">จำนวนเงิน</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {monthData.items.map((item, itemIndex) => (
                          <TableRow key={itemIndex}>
                            <TableCell>{item.label}</TableCell>
                            <TableCell align="right">
                              {formatAmount(item.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell>
                            <strong>รวมทั้งหมด</strong>
                          </TableCell>
                          <TableCell align="right">
                            <strong>
                              {formatAmount(monthData.totalAmount)}
                            </strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={() => setShowMonthlySavings(false)}
            sx={{ mt: 2 }}
          >
            กลับหน้าแรก
          </Button>
        </Box>
      )}

      <Box mt={4}>
        <Typography variant="h5" mb={2}>
          ค้นหาเงินออมตามช่วงเวลา
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" alignItems="center" mb={2}>
            <DatePicker
              label="วันที่เริ่มต้น"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              sx={{ mr: 2 }}
            />
            <DatePicker
              label="วันที่สิ้นสุด"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={fetchFilteredSavings}>
              ค้นหา
            </Button>
          </Box>
        </LocalizationProvider>
      </Box>

      {filteredSavings.length > 0 && (
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>รายการ</TableCell>
                <TableCell align="right">จำนวนเงิน</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSavings
                .filter((item) => item.amount > 0)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell align="right">
                      {formatAmount(item.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell>
                  <strong>รวมทั้งหมด</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {formatAmount(
                      filteredSavings.reduce(
                        (sum, item) => sum + item.amount,
                        0
                      )
                    )}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default SavingsReport;
