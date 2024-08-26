import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import apiURL from '../config/Config';

const FinancialSummary = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      const incomeResponse = await fetch(`${apiURL}/total-income/${userId}`);
      const expenseResponse = await fetch(`${apiURL}/total-expenses/${userId}`);
      const savingsResponse = await fetch(`${apiURL}/total-savings/${userId}`);

      const incomeData = await incomeResponse.json();
      const expenseData = await expenseResponse.json();
      const savingsData = await savingsResponse.json();

      const totalInc = Object.values(incomeData.totalIncome).reduce(
        (a, b) => a + b,
        0
      );
      const totalExp = Object.values(expenseData.totalExpense).reduce(
        (a, b) => a + b,
        0
      );
      const totalSav = Object.values(savingsData.totalSavings).reduce(
        (a, b) => a + b,
        0
      );

      setTotalIncome(totalInc);
      setTotalExpense(totalExp);
      setTotalSavings(totalSav);
      setBalance(totalInc - totalExp - totalSav);
    };

    fetchData();
  }, []);

  const formatAmount = (amount) => {
    return amount.toLocaleString('th-TH', {
      style: 'currency',
      currency: 'THB',
    });
  };

  const chartData = [
    { id: 0, value: totalIncome, label: 'รายรับ', color: '#4caf50' },
    { id: 1, value: totalExpense, label: 'รายจ่าย', color: '#f44336' },
    { id: 2, value: totalSavings, label: 'เงินออม', color: '#2196f3' },
    { id: 3, value: balance, label: 'คงเหลือ', color: '#ff9800' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        สรุปการเงิน
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              ยอดรวม
            </Typography>
            <Typography>รายรับทั้งหมด: {formatAmount(totalIncome)}</Typography>
            <Typography>
              รายจ่ายทั้งหมด: {formatAmount(totalExpense)}
            </Typography>
            <Typography>
              เงินออมทั้งหมด: {formatAmount(totalSavings)}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>
              ยอดเงินคงเหลือ: {formatAmount(balance)}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              แผนภูมิสรุปการเงิน
            </Typography>
            <PieChart
              series={[
                {
                  data: chartData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30 },
                },
              ]}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FinancialSummary;
