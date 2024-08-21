import React, { useState, useEffect } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  ResponsiveContainer,
} from 'recharts';

const MonthlyReportChart = () => {
  
     const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
     
      const userId = localStorage.getItem('userId');

      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      try {
        
        const response = await fetch(
          `https://planing-money.vercel.app/api/monthly-report/${userId}`
        );

        if (response.ok) {
          const data = await response.json();

          if (Array.isArray(data)) {
            setReportData(data);
          } else {
            console.error('Unexpected data format. Expected an array.');
          }
        } else {
          console.error('Error fetching report data. Status:', response.status);
          // แสดง error message ให้ผู้ใช้ทราบ
        }
      } catch (error) {
        console.error('Error fetching report data', error);
        // แสดง error message ให้ผู้ใช้ทราบ
      }
    };

    fetchReportData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={reportData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="income" fill="#8884d8" name="รายรับ" />
        <Bar dataKey="expense" fill="#82ca9d" name="รายจ่าย" />
        <Bar dataKey="saving" fill="#ffc658" name="เงินออม" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyReportChart;
