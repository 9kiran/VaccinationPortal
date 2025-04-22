import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import axios from 'axios';

export default function Events() {
  const [form, setForm] = useState({ vaccine: '', eventDate: '', doseCount: '', targetGrades: '' });
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const res = await axios.get('http://localhost:5000/api/events');
    setEvents(res.data);
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      targetGrades: form.targetGrades.split(',').map(g => g.trim())
    };
    await axios.post('http://localhost:5000/api/events', payload);
    fetchEvents();
    setForm({ vaccine: '', eventDate: '', doseCount: '', targetGrades: '' });
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Plan New Vaccination Drive</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
        <TextField label="Vaccine" value={form.vaccine} onChange={e => setForm({ ...form, vaccine: e.target.value })} required />
        <TextField type="date" value={form.eventDate} onChange={e => setForm({ ...form, eventDate: e.target.value })} required />
        <TextField label="Doses" type="number" value={form.doseCount} onChange={e => setForm({ ...form, doseCount: e.target.value })} required />
        <TextField label="Applicable Grades (comma separated)" value={form.targetGrades} onChange={e => setForm({ ...form, targetGrades: e.target.value })} required />
        <Button variant="contained" type="submit">Schedule</Button>
      </form>

      <Typography variant="h6" gutterBottom>Scheduled Drives</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Vaccine</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Doses</TableCell>
              <TableCell>Grades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map(event => (
              <TableRow key={event._id}>
                <TableCell>{event.vaccine}</TableCell>
                <TableCell>{new Date(event.eventDate).toLocaleDateString()}</TableCell>
                <TableCell>{event.doseCount}</TableCell>
                <TableCell>{event.targetGrades.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
