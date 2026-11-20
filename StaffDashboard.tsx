import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import {  LocationOn } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { Grid} from '@mui/material';

const StaffDashboard = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: isDark ? '#fff' : '#333' }}>Good Morning, Cleaner</Typography>

      <Grid container spacing={3}>
        {/* Today's Stats */}
        <Grid>
          <Card sx={{ bgcolor: '#E91E63', color: '#fff' }}>
            <CardContent>
              <Typography variant="h3">3</Typography>
              <Typography>Tasks Today</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: isDark ? '#fff' : '#333' }}>Next Assignment</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><LocationOn color="primary" /></ListItemIcon>
                  <ListItemText primary="123 Main St, Apt 4B" secondary="Deep Cleaning Service - 10:00 AM" />
                  <Chip label="In Progress" color="warning" variant="outlined" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffDashboard;