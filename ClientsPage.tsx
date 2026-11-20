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
  Avatar,
  Container,  // ✅ FIX: Added Container to imports
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { 
  PersonAdd, 
  Edit, 
  Delete, 
  Visibility 
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// TypeScript interface for client data
interface Client {
  id: number;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
}

const ClientsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // Mock data - replace with API call later
  const clients: Client[] = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@email.com', status: 'active' },
    { id: 2, name: 'Michael Chen', email: 'michael@email.com', status: 'active' },
    { id: 3, name: 'Emma Williams', email: 'emma@email.com', status: 'pending' },
    { id: 4, name: 'James Brown', email: 'james@email.com', status: 'inactive' },
  ];

  const getStatusColor = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2 
      }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 700,
            color: theme.palette.text.primary 
          }}>
            Client Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage your clients, view profiles, and track bookings
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<PersonAdd />} 
          sx={{ 
            backgroundColor: '#E91E63', 
            '&:hover': { backgroundColor: '#C2185B' },
            borderRadius: 2,
            px: 3,
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Add Client
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, 
        gap: 2, 
        mb: 4 
      }}>
        {[
          { label: 'Total Clients', value: clients.length, color: '#E91E63' },
          { label: 'Active Now', value: clients.filter(c => c.status === 'active').length, color: '#4CAF50' },
          { label: 'Pending', value: clients.filter(c => c.status === 'pending').length, color: '#FFC107' },
        ].map((stat, idx) => (
          <Paper 
            key={idx}
            sx={{ 
              p: 2.5, 
              borderRadius: 3,
              bgcolor: isDark ? '#1E1E1E' : '#fff',
              borderLeft: `4px solid ${stat.color}`
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700, color: stat.color }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Clients Table */}
      <Paper sx={{ 
        width: '100%', 
        overflow: 'hidden', 
        backgroundColor: isDark ? '#1E1E1E' : '#fff',
        borderRadius: 3,
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: isDark ? 'rgba(233, 30, 99, 0.1)' : 'rgba(233, 30, 99, 0.05)' }}>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Client</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: theme.palette.text.primary }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow 
                  key={client.id} 
                  hover
                  sx={{ 
                    '&:last-child td': { border: 0 },
                    '&:hover': { bgcolor: isDark ? 'rgba(233, 30, 99, 0.05)' : 'rgba(233, 30, 99, 0.02)' }
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: '#E91E63', 
                        color: '#fff',
                        width: 40, 
                        height: 40,
                        fontWeight: 600
                      }}>
                        {client.name.charAt(0)}
                      </Avatar>
                      <Typography fontWeight={500}>{client.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography color="text.secondary">{client.email}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      color={getStatusColor(client.status) as any}
                      size="small"
                      sx={{ fontWeight: 500, textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="View">
                        <IconButton size="small" sx={{ color: '#2196F3' }}>
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" sx={{ color: '#FFC107' }}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" sx={{ color: '#F44336' }}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Empty State */}
      {clients.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary" mb={2}>No clients found</Typography>
          <Button variant="outlined" startIcon={<PersonAdd />} sx={{ textTransform: 'none' }}>
            Add Your First Client
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default ClientsPage;