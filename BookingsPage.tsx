import { Box, Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { COLORS } from '../../../utils/constants';

const BookingsPage = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const bookings = [
    { id: 1, client: 'John Smith', service: 'Home Cleaning', date: '2023-07-15', status: 'completed', amount: '$150' },
    { id: 2, client: 'Emily Johnson', service: 'Office Cleaning', date: '2023-07-16', status: 'in-progress', amount: '$250' },
    { id: 3, client: 'Michael Brown', service: 'Carpet Cleaning', date: '2023-07-17', status: 'pending', amount: '$120' },
  ];

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ color: theme.palette.text.primary }}>
          Bookings Management
        </Typography>
        <Button variant="contained" startIcon={<Add />} sx={{ backgroundColor: COLORS.primary, '&:hover': { backgroundColor: '#C2185B' } }}>
          Add Booking
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', backgroundColor: isDark ? COLORS.surface : '#fff' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.id} hover>
                  <TableCell>{booking.client}</TableCell>
                  <TableCell>{booking.service}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell><Chip label={booking.status} color="info" size="small" /></TableCell>
                  <TableCell>{booking.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default BookingsPage;