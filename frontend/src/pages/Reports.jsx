import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, TextField, Paper } from '@mui/material';
import axios from 'axios';

export default function Reports() {
  const [pupils, setPupils] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/pupils').then(res => setPupils(res.data));
  }, []);

  const filtered = pupils.filter(p => p.fullName.toLowerCase().includes(search.toLowerCase()));

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>Pupil Vaccination Records</Typography>
      <TextField
        label="Search by name"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ marginBottom: 2 }}
      />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Full Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Roll Number</TableCell>
              <TableCell>Vaccines Taken</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.grade}</TableCell>
                <TableCell>{p.rollNumber}</TableCell>
                <TableCell>
                  {p.vaccines.length > 0
                    ? p.vaccines.map(v => `${v.vaccine} (${new Date(v.administeredOn).toLocaleDateString()})`).join(', ')
                    : 'Not vaccinated'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
