import React, { useEffect, useState } from 'react';
import {
  Box, TextField, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Button
} from '@mui/material';
import axios from 'axios';

export default function Reports() {
  const [pupils, setPupils] = useState([]);
  const [search, setSearch] = useState('');
  const [filterVaccine, setFilterVaccine] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 5;

  useEffect(() => {
    axios.get('http://localhost:5000/api/pupils')
      .then(res => setPupils(res.data))
      .catch(err => console.log(err));
  }, []);

  const filtered = pupils.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) &&
    (filterVaccine === '' || p.vaccines.some(v => v.vaccine.toLowerCase().includes(filterVaccine.toLowerCase())))
  );

  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const exportCSV = () => {
    const headers = ['Name', 'Grade', 'Roll Number', 'Vaccines'];
    const rows = filtered.map(p =>
      [p.fullName, p.grade, p.rollNumber, p.vaccines.map(v => `${v.vaccine} (${new Date(v.administeredOn).toLocaleDateString()})`).join('; ')]
    );
    const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'vaccination_report.csv';
    a.click();
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Vaccination Reports</Typography>

      <Box display="flex" gap={2} mb={2}>
        <TextField label="Search Name" value={search} onChange={e => setSearch(e.target.value)} />
        <TextField label="Filter by Vaccine" value={filterVaccine} onChange={e => setFilterVaccine(e.target.value)} />
        <Button onClick={exportCSV} variant="outlined">Export CSV</Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Vaccines</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.map(p => (
              <TableRow key={p._id}>
                <TableCell>{p.fullName}</TableCell>
                <TableCell>{p.grade}</TableCell>
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
      <Box mt={2} display="flex" justifyContent="center" gap={2}>
        <Button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
        <Typography>Page {currentPage}</Typography>
        <Button disabled={currentPage * perPage >= filtered.length} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
      </Box>
    </Box>
  );
}
