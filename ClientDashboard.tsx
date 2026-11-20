import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Event, History, CleaningServices } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const ClientDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: isDark ? '#fff' : '#333' }}>Welcome back!</Typography>

      <Grid container spacing={3}>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <CleaningServices sx={{ fontSize: 48, color: '#E91E63', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Book a Service</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Schedule a new cleaning appointment.</Typography>
              <Button variant="contained" sx={{ bgcolor: '#E91E63' }}>Book Now</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Event sx={{ fontSize: 48, color: '#FF9800', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Upcoming Bookings</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>You have 1 upcoming appointment.</Typography>
              <Button variant="outlined">View Details</Button>
            </CardContent>
          </Card>
        </Grid>
        <Grid >
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', height: '100%' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <History sx={{ fontSize: 48, color: '#2196F3', mb: 2 }} />
              <Typography variant="h6" gutterBottom>Service History</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>View past cleanings and invoices.</Typography>
              <Button variant="outlined">View History</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ClientDashboard;