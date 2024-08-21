import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Typography } from '@mui/material';
import apiURL from '../config/Config';

const SavingsRatioReport = () => {
 
  const [savingsRatio, setSavingsRatio] = useState([]);
  const [totalSavings, setTotalSavings] = useState(0);

  useEffect(() => {
  
    const fetchSavingsRatio = async () => {
      
      const userId = localStorage.getItem('userId');

      try {
        // Fetch ข้อมูล savings ratio ที่มี createdAt ล่าสุดของ userId
        const response = await fetch(`${apiURL}/savings-ratio/${userId}`);

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data && data.savingsItems) {
          setSavingsRatio(data.savingsItems);
        } else {
          console.log('No savings ratio found in the response');
        }
      } catch (error) {
        console.error('Error fetching savings ratio:', error);
      }
    };

    const fetchTotalSavings = async () => {
      const userId = localStorage.getItem('userId');
      try {

        const response = await fetch(`${apiURL}/savings/${userId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const total = data.reduce(
          (sum, saving) =>
            sum +
            saving.items.reduce((itemSum, item) => itemSum + item.amount, 0),
          0
        );
        setTotalSavings(total);
      } catch (error) {
        console.error('Error fetching total savings:', error);
      }
    };

    fetchSavingsRatio();
    fetchTotalSavings();
  }, []);

  const calculateSavingsAmount = (percentage) => {
    const amount = (totalSavings * percentage) / 100;
    return amount;
  };

  const data = savingsRatio.map((item) => ({
    name: item.label,
    value: calculateSavingsAmount(parseFloat(item.percentage)),
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div>
      <Typography variant="h6">รายงานสัดส่วนการออม</Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={150}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Typography>ไม่มีข้อมูลสำหรับสร้างแผนภูมิ</Typography>
      )}
      <Typography variant="body1">
        เงินออมทั้งหมด: {totalSavings.toFixed(2)} บาท
      </Typography>
      {data.map((item, index) => (
        <Typography key={index} variant="body2">
          {item.name}: {item.value.toFixed(2)} บาท
        </Typography>
      ))}
    </div>
  );
};

export default SavingsRatioReport;
