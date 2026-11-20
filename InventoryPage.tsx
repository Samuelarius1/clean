import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Inventory as InventoryIcon,
  Search,
  Warning
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const InventoryPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const [items] = useState([
    { id: 1, name: 'Eco-Friendly All-Purpose Cleaner', category: 'Chemicals', stock: 45, unit: 'Bottles', status: 'In Stock' },
    { id: 2, name: 'Microfiber Cloths (Pack)', category: 'Tools', stock: 12, unit: 'Packs', status: 'Low Stock' },
    { id: 3, name: 'Heavy Duty Mop', category: 'Equipment', stock: 8, unit: 'Units', status: 'In Stock' },
    { id: 4, name: 'Glass Cleaner', category: 'Chemicals', stock: 3, unit: 'Bottles', status: 'Critical' },
  ]);

  const getStockColor = (status: string) => {
    if (status === 'Critical') return 'error';
    if (status === 'Low Stock') return 'warning';
    return 'success';
  };

  // Filter items based on search
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#333' }}>Inventory Management</Typography>
          <Typography variant="body2" color="text.secondary">Track cleaning supplies and equipment.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />} sx={{ bgcolor: '#E91E63', '&:hover': { bgcolor: '#C2185B' } }} onClick={() => setOpen(true)}>
          Add Item
        </Button>
      </Box>

      {/* Critical Stock Alert */}
      {items.some(i => i.status === 'Critical') && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<Warning />}>
          Some items are critically low and need immediate restocking!
        </Alert>
      )}

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Search inventory..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          sx: { bgcolor: isDark ? '#1E1E1E' : '#fff', borderRadius: 2 }
        }}
        sx={{ mb: 3 }}
      />

      <Paper sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Stock Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'rgba(233, 30, 99, 0.1)', color: '#E91E63' }}><InventoryIcon /></Avatar>
                      <Typography variant="body1" fontWeight={600} sx={{ color: isDark ? '#fff' : '#333' }}>
                        {item.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    <Typography fontWeight="bold">{item.stock} {item.unit}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={item.status} color={getStockColor(item.status) as any} size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary"><Edit /></IconButton>
                    <IconButton size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Item Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: isDark ? '#1E1E1E' : '#fff' } }}>
        <DialogTitle>Add New Inventory Item</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid ><TextField fullWidth label="Item Name" variant="outlined" /></Grid>
            <Grid ><TextField fullWidth label="Category" variant="outlined" /></Grid>
            <Grid ><TextField fullWidth label="Initial Stock" type="number" variant="outlined" /></Grid>
            <Grid ><TextField fullWidth label="Unit (e.g. Bottles, Packs)" variant="outlined" /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ bgcolor: '#E91E63' }}>Add to Inventory</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default InventoryPage;