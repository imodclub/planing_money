import React, { useState, useEffect } from 'react';
import { BarChart } from '@mui/x-charts';
import { Box, Typography } from '@mui/material';

const ReportVersion1 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      console.error('No userId found in LocalStorage');
      return;
    }

    const fetchData = async () => {
      try {
        const incomeResponse = await fetch(
          `http://localhost:5002/api/income-data/${userId}`
        );
        const expenseResponse = await fetch(
          `http://localhost:5002/api/expense-data/${userId}`
        );
        const savingsResponse = await fetch(
          `http://localhost:5002/api/savings/${userId}`
        );

        if (!incomeResponse.ok || !expenseResponse.ok || !savingsResponse.ok) {
          throw new Error('Error in fetching data');
        }

        const incomeData = await incomeResponse.json();
        const expenseData = await expenseResponse.json();
        const savingsData = await savingsResponse.json();

        const monthlyData = {};

        const processItems = (items, type) => {
          items.forEach(({ date, items }) => {
            const month = new Date(date).toLocaleString('default', {
              month: 'long',
            });
            if (!monthlyData[month]) {
              monthlyData[month] = { income: 0, expenses: 0, savings: 0 };
            }
            const totalAmount = items.reduce(
              (sum, item) => sum + parseFloat(item.amount || 0),
              0
            );
            monthlyData[month][type] += totalAmount;
          });
        };

        processItems(incomeData, 'income');
        processItems(expenseData, 'expenses');
        processItems(savingsData, 'savings');

        const chartData = Object.keys(monthlyData).map((month) => ({
          month,
          ...monthlyData[month],
        }));

        console.log('Fetched Data:', chartData);

        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        รายงานการเงินรายเดือน
      </Typography>
      {loading ? (
        <Typography variant="body1">กำลังโหลดข้อมูล...</Typography>
      ) : data.length > 0 ? (
        // ตรวจสอบข้อมูลก่อนส่งไปยัง BarChart
        <>
          <pre>{JSON.stringify(data, null, 2)}</pre>
          <BarChart
            data={data}
            xAxisKey="month"
            series={[
              { dataKey: 'income', label: 'รายรับ' },
              { dataKey: 'expenses', label: 'รายจ่าย' },
              { dataKey: 'savings', label: 'เงินออม' },
            ]}
            height={400}
          />
        </>
      ) : (
        <Typography variant="body1">ไม่มีข้อมูลที่จะแสดง</Typography>
      )}
    </Box>
  );
};

export default ReportVersion1;
