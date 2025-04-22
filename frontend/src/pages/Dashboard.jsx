import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      const pupilsData = await axios.get('http://localhost:5000/api/pupils');
      const driveData = await axios.get('http://localhost:5000/api/events/upcoming');

      const total = pupilsData.data.length;
      const vaccinated = pupilsData.data.filter(p => p.vaccines.length > 0).length;
      const upcoming = driveData.data.length;

      setMetrics({ total, vaccinated, upcoming });
    };

    loadMetrics();
  }, []);

  if (!metrics) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>;

  const percent = metrics.total > 0 ? ((metrics.vaccinated / metrics.total) * 100).toFixed(1) : '0';

  // Data for Pie Chart
  const pieData = [
    { name: 'Vaccinated', value: metrics.vaccinated },
    { name: 'Not Vaccinated', value: metrics.total - metrics.vaccinated },
  ];

  // Pie chart colors
  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>System Overview</Typography>
      <Grid container spacing={3}>
        {/* Total Pupils Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body2">Total Pupils</Typography>
              <Typography variant="h5">{metrics.total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Vaccinated Pupils Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body2">Vaccinated Pupils</Typography>
              <Typography variant="h5">{metrics.vaccinated} ({percent}%)</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Drives Card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body2">Upcoming Drives</Typography>
              <Typography variant="h5">{metrics.upcoming > 0 ? metrics.upcoming : 'None'}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} sm={12} md={6}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="body2" sx={{ marginBottom: 2 }}>Vaccination Overview</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
