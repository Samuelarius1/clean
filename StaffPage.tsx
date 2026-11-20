import { useState } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid, MenuItem } from '@mui/material';
import { Add, Edit, Delete, Person } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const StaffPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [open, setOpen] = useState(false);

  // Mock Data
  const [staff, setStaff] = useState([
    { id: 1, name: 'Sarah Connor', email: 'sarah@faiths.com', role: 'Cleaner', status: 'Active' },
    { id: 2, name: 'John Wick', email: 'john@faiths.com', role: 'Supervisor', status: 'On Leave' },
  ]);

  // form state for the "add" dialog
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('Cleaner');

  const handleSaveStaff = () => {
    setStaff(prev => [
      ...prev,
      {
        id: prev.length ? prev[prev.length - 1].id + 1 : 1,
        name: newName,
        email: newEmail,
        role: newRole,
        status: 'Active',
      },
    ]);
    setNewName('');
    setNewEmail('');
    setNewRole('Cleaner');
    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#333' }}>Staff Management</Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#E91E63', '&:hover': { bgcolor: '#C2185B' } }} onClick={() => setOpen(true)}>
          Add New Staff
        </Button>
      </Box>

      <Paper sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#E91E63' }}><Person /></Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={600} sx={{ color: isDark ? '#fff' : '#333' }}>{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>
                    <Chip label={member.status} color={member.status === 'Active' ? 'success' : 'warning'} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" startIcon={<Edit />} color="primary">Edit</Button>
                    <Button size="small" startIcon={<Delete />} color="error">Archive</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Staff Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: isDark ? '#1E1E1E' : '#fff' } }}>
        <DialogTitle>Add New Staff Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid >
              <TextField
                fullWidth
                label="Full Name"
                variant="outlined"
                value={newName}
                onChange={e => setNewName(e.target.value)}
              />
            </Grid>
            <Grid >
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                value={newEmail}
                onChange={e => setNewEmail(e.target.value)}
              />
            </Grid>
            <Grid >
              <TextField
                fullWidth
                label="Role"
                variant="outlined"
                select
                value={newRole}
                onChange={e => setNewRole(e.target.value)}
              >
                <MenuItem value="Cleaner">Cleaner</MenuItem>
                <MenuItem value="Supervisor">Supervisor</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#E91E63' }} onClick={handleSaveStaff}>Save Staff</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffPage;