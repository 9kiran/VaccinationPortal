import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper,
  TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

export default function Pupils() {
  const [pupils, setPupils] = useState([]);
  const [form, setForm] = useState({ fullName: '', grade: '', rollNumber: '' });
  const [csvFile, setCsvFile] = useState(null);

  const [selectedPupil, setSelectedPupil] = useState(null);
  const [vaccinationForm, setVaccinationForm] = useState({ vaccine: '', administeredOn: '' });
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchPupils(); }, []);

  const fetchPupils = () => {
    axios.get('http://localhost:5000/api/pupils')
      .then(res => setPupils(res.data))
      .catch(err => console.log(err));
  };

  const handleAddStudent = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/pupils', form)
      .then(() => {
        fetchPupils();
        setForm({ fullName: '', grade: '', rollNumber: '' });
      });
  };

  const handleCsvUpload = () => {
    const fd = new FormData();
    fd.append('file', csvFile);
    axios.post('http://localhost:5000/api/pupils/upload', fd)
      .then(() => {
        fetchPupils();
        setCsvFile(null);
      });
  };

  const handleVaccinate = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/pupils/${selectedPupil._id}/vaccinate`, vaccinationForm);
      setAlert({ open: true, message: 'Vaccinated successfully!', severity: 'success' });
      setSelectedPupil(null);
      fetchPupils();
    } catch (err) {
      setAlert({
        open: true,
        message: err.response?.data?.error || 'Failed to update.',
        severity: 'error'
      });
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Student Management</Typography>
      <form onSubmit={handleAddStudent} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <TextField label="Full Name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} required />
        <TextField label="Grade" value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} required />
        <TextField label="Roll Number" value={form.rollNumber} onChange={e => setForm({ ...form, rollNumber: e.target.value })} required />
        <Button type="submit" variant="contained">Add</Button>
      </form>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files[0])} />
        <Button variant="outlined" onClick={handleCsvUpload} disabled={!csvFile}>Upload CSV</Button>
      </Box>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Roll #</TableCell>
              <TableCell>Vaccinated?</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pupils.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.grade}</TableCell>
                <TableCell>{p.rollNumber}</TableCell>
                <TableCell>{p.vaccines?.length > 0 ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => setSelectedPupil(p)}>
                    Mark Vaccinated
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* Vaccinate Dialog */}
      <Dialog open={!!selectedPupil} onClose={() => setSelectedPupil(null)}>
        <DialogTitle>Vaccinate {selectedPupil?.fullName}</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="dense" label="Vaccine Name"
            value={vaccinationForm.vaccine}
            onChange={e => setVaccinationForm({ ...vaccinationForm, vaccine: e.target.value })}
            required />
          <TextField fullWidth type="date" margin="dense" label="Date"
            InputLabelProps={{ shrink: true }}
            value={vaccinationForm.administeredOn}
            onChange={e => setVaccinationForm({ ...vaccinationForm, administeredOn: e.target.value })}
            required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedPupil(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleVaccinate}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Alert Message */}
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
