import { useState } from 'react';
import type { MouseEvent } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Grid,
  Divider
} from '@mui/material';
import {
  People,
  Assignment,
  TrendingUp,
  MonetizationOn,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from '@mui/icons-material';

interface Booking {
  id: number;
  client: string;
  service: string;
  date: string;
  status: 'completed' | 'in-progress' | 'pending';
  amount: string;
}

const DashboardOverview = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleMenuOpen = (event: MouseEvent<HTMLElement>, booking: Booking) => {
    setAnchorEl(event.currentTarget);
    setSelectedBooking(booking);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBooking(null);
  };

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'pending': return 'default';
      default: return 'default';
    }
  };

  const stats = [
    { title: 'Total Bookings', value: '245', icon: <Assignment />, color: '#E91E63', trend: '+8.2%' },
    { title: 'Active Clients', value: '182', icon: <People />, color: '#10B981', trend: '+15.3%' },
    { title: 'Revenue', value: '$45,230', icon: <MonetizationOn />, color: '#F59E0B', trend: '+12.5%' },
    { title: 'Growth Rate', value: '12.5%', icon: <TrendingUp />, color: '#EC4899', trend: '+2.1%' }
  ];

  const recentBookings: Booking[] = [
    { id: 1, client: 'John Smith', service: 'Home Cleaning', date: '2023-07-15', status: 'completed', amount: '$150' },
    { id: 2, client: 'Emily Johnson', service: 'Office Cleaning', date: '2023-07-16', status: 'in-progress', amount: '$250' },
    { id: 3, client: 'Michael Brown', service: 'Carpet Cleaning', date: '2023-07-17', status: 'pending', amount: '$120' },
    { id: 4, client: 'Sarah Davis', service: 'Window Cleaning', date: '2023-07-18', status: 'pending', amount: '$100' },
    { id: 5, client: 'Robert Wilson', service: 'Deep Cleaning', date: '2023-07-19', status: 'pending', amount: '$300' }
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>Dashboard Overview</Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Here's what's happening today.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Assignment />} sx={{ bgcolor: '#E91E63', '&:hover': { bgcolor: '#C2185B' } }}>+ New Booking</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid key={index}>
            <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 3, p: 2, border: '1px solid #e0e0e0' }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 0 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar sx={{ bgcolor: `${stat.color}15`, color: stat.color, width: 48, height: 48 }}>{stat.icon}</Avatar>
                  <Chip label={stat.trend} size="small" sx={{ bgcolor: `${stat.color}20`, color: stat.color, fontWeight: 700, fontSize: '0.75rem', height: 24 }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>{stat.value}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{stat.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 3, border: '1px solid #e0e0e0', overflow: 'hidden' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid #f0f0f0' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>Recent Bookings</Typography>
        </Box>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {['Client', 'Service', 'Date', 'Status', 'Amount', ''].map((head) => (
                  <TableCell key={head} sx={{ fontWeight: 600, color: 'text.secondary' }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell sx={{ fontWeight: 500, color: 'text.primary' }}>{booking.client}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{booking.service}</TableCell>
                  <TableCell sx={{ color: 'text.secondary' }}>{booking.date}</TableCell>
                  <TableCell>
                    <Chip label={booking.status.replace('-', ' ').toUpperCase()} color={getStatusColor(booking.status) as any} size="small" sx={{ fontWeight: 600, fontSize: '0.7rem', height: 24, borderRadius: '4px' }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: 'text.primary' }}>{booking.amount}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, booking)}><MoreVert /></IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl) && selectedBooking?.id === booking.id} onClose={handleMenuClose}>
                      <MenuItem onClick={handleMenuClose}><Visibility fontSize="small" sx={{ mr: 1 }}/> View</MenuItem>
                      <MenuItem onClick={handleMenuClose}><Edit fontSize="small" sx={{ mr: 1 }}/> Edit</MenuItem>
                      <Divider />
                      <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}><Delete fontSize="small" sx={{ mr: 1 }}/> Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default DashboardOverview;