import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

export default function Events() {
  const [drives, setDrives] = useState([]);
  const [form, setForm] = useState({
    vaccine: '', eventDate: '', doseCount: '', targetGrades: ''
  });
  const [editDrive, setEditDrive] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    const res = await axios.get('http://localhost:5000/api/events');
    setDrives(res.data);
  };

  const isEditable = (date) => new Date(date) >= new Date();

  const handleAddDrive = async () => {
    try {
      await axios.post('http://localhost:5000/api/events', {
        vaccine: form.vaccine,
        eventDate: form.eventDate,
        doseCount: Number(form.doseCount),
        targetGrades: form.targetGrades.split(',').map(g => g.trim())
      });
      setAlert({ open: true, message: 'Drive added!', severity: 'success' });
      setForm({ vaccine: '', eventDate: '', doseCount: '', targetGrades: '' });
      fetchDrives();
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.error || 'Error adding drive.',
        severity: 'error'
      });
    }
  };

  const handleEditClick = (drive) => {
    setEditDrive(drive);
    setEditForm({
      eventDate: drive.eventDate?.slice(0, 10),
      doseCount: drive.doseCount
    });
  };

  const handleUpdateDrive = async () => {
    try {
      await axios.put(`http://localhost:5000/api/events/${editDrive._id}`, editForm);
      fetchDrives();
      setAlert({ open: true, message: 'Drive updated!', severity: 'success' });
      setEditDrive(null);
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.error || 'Error updating drive.',
        severity: 'error'
      });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Vaccination Drives</Typography>
      <Box mb={4}>
        <Typography variant="h6">Add New Vaccination Drive</Typography>
        <Box display="flex" gap={2} flexWrap="wrap" mt={1}>
          <TextField
            label="Vaccine Name"
            value={form.vaccine}
            onChange={(e) => setForm({ ...form, vaccine: e.target.value })}
          />
          <TextField
            type="date"
            label="Event Date"
            InputLabelProps={{ shrink: true }}
            value={form.eventDate}
            onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
          />
          <TextField
            label="Doses Available"
            type="number"
            value={form.doseCount}
            onChange={(e) => setForm({ ...form, doseCount: e.target.value })}
          />
          <TextField
            label="Applicable Grades (comma separated)"
            value={form.targetGrades}
            onChange={(e) => setForm({ ...form, targetGrades: e.target.value })}
          />
          <Button variant="contained" onClick={handleAddDrive}>Add Drive</Button>
        </Box>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Vaccine</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Doses</TableCell>
            <TableCell>Grades</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drives.map((d) => (
            <TableRow key={d._id}>
              <TableCell>{d.vaccine}</TableCell>
              <TableCell>{new Date(d.eventDate).toLocaleDateString()}</TableCell>
              <TableCell>{d.doseCount}</TableCell>
              <TableCell>{d.targetGrades.join(', ')}</TableCell>
              <TableCell>
                {isEditable(d.eventDate) ? (
                  <Button variant="outlined" size="small" onClick={() => handleEditClick(d)}>Edit</Button>
                ) : (
                  <Typography color="text.secondary" fontSize="small">Locked</Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={!!editDrive} onClose={() => setEditDrive(null)}>
        <DialogTitle>Edit Drive</DialogTitle>
        <DialogContent>
          <TextField
            type="date"
            label="Event Date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            margin="normal"
            value={editForm.eventDate}
            onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
          />
          <TextField
            label="Doses Available"
            type="number"
            fullWidth
            margin="normal"
            value={editForm.doseCount}
            onChange={(e) => setEditForm({ ...editForm, doseCount: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDrive(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateDrive}>Save</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity}>{alert.message}</Alert>
      </Snackbar>
    </Box>
  );
}
