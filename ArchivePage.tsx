import { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Alert,
  } from '@mui/material';
import {
  Restore,
  Search,
  FolderOff,
  Archive as ArchiveIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ArchivePage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Archived Data
  const [archivedItems, setArchivedItems] = useState([
    { id: 101, type: 'Client', name: 'Old Client Corp', reason: 'Request by Client', archivedDate: '2023-09-15' },
    { id: 102, type: 'Staff', name: 'Ex-Employee Mike', reason: 'Terminated', archivedDate: '2023-08-20' },
    { id: 103, type: 'Booking', name: 'Booking #5521', reason: 'Cancelled & Refunded', archivedDate: '2023-10-01' },
    { id: 104, type: 'Inventory', name: 'Old Mop Model X', reason: 'Damaged', archivedDate: '2023-09-30' },
  ]);

  const handleRestore = (id: number) => {
    alert(`Restoring item ID: ${id} to active system.`);
    // In real app: API call to restore, then remove from state
    setArchivedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#333', display: 'flex', alignItems: 'center', gap: 2 }}>
            <ArchiveIcon color="primary" /> System Archive
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Super Admin Only: View and restore deleted records.
          </Typography>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Items in this section are hidden from the main system. You can restore them, but you cannot permanently delete them from here.
      </Alert>

      <TextField
        fullWidth
        placeholder="Search archives..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          sx: { bgcolor: isDark ? '#1E1E1E' : '#fff', borderRadius: 2, mb: 3 }
        }}
      />

      <Paper sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Record Name / ID</TableCell>
                <TableCell>Archive Reason</TableCell>
                <TableCell>Archived Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {archivedItems
                .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item) => (
                <TableRow key={item.id} hover sx={{ opacity: 0.8 }}>
                  <TableCell>
                    <Chip 
                      label={item.type} 
                      variant="outlined" 
                      size="small" 
                      color={item.type === 'Booking' ? 'primary' : (item.type === 'Client' ? 'secondary' : 'default')}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontWeight={600} sx={{ color: isDark ? '#fff' : '#333' }}>
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{item.reason}</TableCell>
                  <TableCell>{item.archivedDate}</TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Restore />}
                      onClick={() => handleRestore(item.id)}
                      sx={{ textTransform: 'none' }}
                    >
                      Restore
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {archivedItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'text.secondary' }}>
                      <FolderOff sx={{ fontSize: 48, mb: 1 }} />
                      <Typography>Archive is empty</Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ArchivePage;