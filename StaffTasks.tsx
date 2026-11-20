import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Checkbox, Button } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const StaffTasks = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4, color: isDark ? '#fff' : '#333' }}>My Tasks</Typography>
      
      <Card sx={{ bgcolor: isDark ? '#1E1E1E' : '#fff', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Today's Assignment</Typography>
          <List>
            <ListItem>
              <Checkbox edge="start" />
              <ListItemText primary="Arrive at 123 Main St" secondary="10:00 AM" />
            </ListItem>
            <ListItem>
              <Checkbox edge="start" />
              <ListItemText primary="Vacuum Living Room" secondary="Deep clean required" />
            </ListItem>
            <ListItem>
              <Checkbox edge="start" />
              <ListItemText primary="Sanitize Bathroom" secondary="Use Eco-friendly products" />
            </ListItem>
          </List>
          <Button variant="contained" fullWidth sx={{ mt: 2, bgcolor: '#4CAF50' }} startIcon={<CheckCircle />}>
            Mark Job Complete
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StaffTasks;