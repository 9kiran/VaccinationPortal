import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Card, CardContent } from '@mui/material';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    vaccinatedStudents: 0,
    percentageVaccinated: 0,
    upcomingDrives: []
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/summary')
      .then(res => setMetrics(res.data))
      .catch(err => console.error(err));
  }, []);

  // Data for Pie Chart
  const pieData = [
    { name: 'Vaccinated', value: metrics.vaccinatedStudents },
    { name: 'Not Vaccinated', value: metrics.totalStudents - metrics.vaccinatedStudents },
  ];

  // Pie chart colors
  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Dashboard Overview</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Total Students</Typography>
            <Typography variant="h4">{metrics.totalStudents}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Vaccinated Students</Typography>
            <Typography variant="h4">{metrics.vaccinatedStudents}</Typography>
            <Typography variant="subtitle1">({metrics.percentageVaccinated}% vaccinated)</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Upcoming Drives</Typography>
            {metrics.upcomingDrives.length > 0 ? (
              metrics.upcomingDrives.map((d, i) => (
                <Typography key={i}>
                  {d.vaccine} — {new Date(d.eventDate).toLocaleDateString()}
                </Typography>
              ))
            ) : (
              <Typography color="text.secondary">No upcoming drives</Typography>
            )}
          </Paper>
        </Grid>
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
