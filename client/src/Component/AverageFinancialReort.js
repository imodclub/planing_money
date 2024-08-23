import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { Typography, Box } from '@mui/material';
import apiURL from '../config/Config';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AverageFinancialReport = () => {
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const userId = localStorage.getItem('userId');
      try {
        const response = await fetch(
          `${apiURL}/average-financial-data/${userId}`
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result.items);
        setTotalAmount(result.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
    const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Box>
      <Typography variant="h6">
        รายงานค่าเฉลี่ยรายรับ รายจ่าย และเงินออม
      </Typography>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
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
        ยอดรวมทั้งหมด:{' '}
        {totalAmount.toLocaleString('th-TH', {
          style: 'currency',
          currency: 'THB',
        })}
      </Typography>
      {data.map((item, index) => (
        <Typography key={index} variant="body2">
          {item.name}:{' '}
          {item.value.toLocaleString('th-TH', {
            style: 'currency',
            currency: 'THB',
          })}
          ({((item.value / totalAmount) * 100).toFixed(2)}%)
        </Typography>
      ))}
    </Box>
  );
};

export default AverageFinancialReport;
