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
import apiURL from '../config/Config';

const MonthlyReportChart = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const sessionResponse = await fetch(`${apiURL}/session`, {
          method: 'GET',
          credentials: 'include', // เพื่อให้ cookies ถูกส่งไปด้วย
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          const userId = sessionData.userId; // ดึง userId จาก session

          if (!userId) {
            console.error('User ID not found in session');
            return;
          }

          const response = await fetch(`${apiURL}/monthly-report/${userId}`);

          if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data)) {
              setReportData(data);
            } else {
              console.error('Unexpected data format. Expected an array.');
            }
          } else {
            console.error('Error fetching report data. Status:', response.status);
          }
        } else {
          console.error('Session not found');
        }
      } catch (error) {
        console.error('Error fetching report data', error);
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