import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete
} from '@mui/icons-material';
import { COLORS } from '../../utils/constants';

// Define types for our component
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  joinDate: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'John Smith', email: 'john@example.com', role: 'admin', status: 'active', joinDate: '2023-01-15' },
    { id: 2, name: 'Emily Johnson', email: 'emily@example.com', role: 'user', status: 'active', joinDate: '2023-02-20' },
    { id: 3, name: 'Michael Brown', email: 'michael@example.com', role: 'user', status: 'inactive', joinDate: '2023-03-10' },
    { id: 4, name: 'Sarah Davis', email: 'sarah@example.com', role: 'user', status: 'active', joinDate: '2023-04-05' },
    { id: 5, name: 'Robert Wilson', email: 'robert@example.com', role: 'user', status: 'active', joinDate: '2023-05-12' }
  ]);
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user',
    status: 'active' as 'active' | 'inactive'
  });

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, user: User) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenDialog = (user: User | null = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        role: 'user',
        status: 'active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
  };

  // Updated to handle both TextField and Select onChange events
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...formData }
          : user
      ));
    } else {
      // Add new user
      const newUser: User = {
        id: users.length + 1,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        joinDate: new Date().toISOString().split('T')[0]
      };
      setUsers([...users, newUser]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
    handleMenuClose();
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'primary' : 'default';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ color: COLORS.primary }}>
          Manage Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: COLORS.primary,
            '&:hover': {
              backgroundColor: COLORS.secondary
            }
          }}
        >
          Add New User
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2, bgcolor: COLORS.primary }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, user)}
                      >
                        <MoreVert />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && selectedUser?.id === user.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => { handleMenuClose(); handleOpenDialog(user); }}>
                          <Edit sx={{ mr: 1 }} fontSize="small" />
                          Edit
                        </MenuItem>
                        <MenuItem onClick={() => handleDelete(user.id)}>
                          <Delete sx={{ mr: 1 }} fontSize="small" />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Full Name"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUser ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageUsers;