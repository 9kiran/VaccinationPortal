import React, { useState, useEffect } from 'react';
import {
  Box, Typography, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, Paper, Stack
} from '@mui/material';
import axios from 'axios';

export default function Pupils() {
  const [pupils, setPupils] = useState([]);
  const [entry, setEntry] = useState({ fullName: '', grade: '', rollNumber: '' });
  const [uploadFile, setUploadFile] = useState(null);

  const retrievePupils = async () => {
    const res = await axios.get('http://localhost:5000/api/pupils');
    setPupils(res.data);
  };

  useEffect(() => { retrievePupils(); }, []);

  const addNewPupil = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/pupils', entry);
    retrievePupils();
    setEntry({ fullName: '', grade: '', rollNumber: '' });
  };

  const handleCSVUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append('file', uploadFile);
    await axios.post('http://localhost:5000/api/pupils/upload', formData);
    retrievePupils();
    setUploadFile(null);
  };

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Enroll Pupil</Typography>
      <form onSubmit={addNewPupil}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField label="Full Name" value={entry.fullName} onChange={e => setEntry({ ...entry, fullName: e.target.value })} required />
          <TextField label="Grade" value={entry.grade} onChange={e => setEntry({ ...entry, grade: e.target.value })} required />
          <TextField label="Roll Number" value={entry.rollNumber} onChange={e => setEntry({ ...entry, rollNumber: e.target.value })} required />
          <Button variant="contained" type="submit">Add</Button>
        </Stack>
      </form>

      <Typography mt={4} mb={1} variant="h6">Upload Pupils via CSV</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <input type="file" accept=".csv" onChange={(e) => setUploadFile(e.target.files[0])} />
        <Button variant="outlined" onClick={handleCSVUpload} disabled={!uploadFile}>Upload</Button>
      </Stack>

      <Typography variant="h6" mt={4} mb={1}>Registered Pupils</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Roll #</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pupils.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.grade}</TableCell>
                <TableCell>{p.rollNumber}</TableCell>
                <TableCell>{p.vaccines.length > 0 ? 'Vaccinated' : 'Pending'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}