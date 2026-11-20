import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
  Button
} from '@mui/material';
import {
  Notifications,
  Email,
  Sms,
  Campaign
} from '@mui/icons-material';
import { useSettings } from '../../../hooks/useSettings';

const NotificationSettings = () => {
  const { 
    notifications, 
    saveNotifications, 
    loading, 
    snackbar
  } = useSettings();

  const [localState, setLocalState] = React.useState(notifications);
  const [hasChanges, setHasChanges] = React.useState(false);

  useEffect(() => {
    setLocalState(notifications);
  }, [notifications]);

  const handleToggle = (key: keyof typeof notifications) => {
    const newState = { ...localState, [key]: !localState[key] };
    setLocalState(newState);
    setHasChanges(true);
  };

  const handleSave = () => {
    saveNotifications(localState);
    setHasChanges(false);
  };

  return (
    <Box maxWidth="600px">
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Notifications</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Manage how you receive alerts about your business.
        </Typography>

        {hasChanges && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You have unsaved changes.
          </Alert>
        )}

        <List sx={{ p: 0 }}>
          {/* Email Alerts */}
          <ListItem sx={{ px: 0, py: 2 }}>
            <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <Email />
            </Box>
            <ListItemText
              primary="Email Alerts"
              secondary="Receive daily summary and critical updates via email."
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={localState.emailAlerts}
                onChange={() => handleToggle('emailAlerts')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          {/* Push Notifications */}
          <ListItem sx={{ px: 0, py: 2 }}>
            <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <Notifications />
            </Box>
            <ListItemText
              primary="Push Notifications"
              secondary="Receive real-time notifications in your browser."
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={localState.pushNotifications}
                onChange={() => handleToggle('pushNotifications')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          {/* SMS Alerts */}
          <ListItem sx={{ px: 0, py: 2 }}>
            <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <Sms />
            </Box>
            <ListItemText
              primary="SMS Alerts"
              secondary="Get text messages for urgent bookings."
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={localState.smsAlerts}
                onChange={() => handleToggle('smsAlerts')}
              />
            </ListItemSecondaryAction>
          </ListItem>
          <Divider />

          {/* Marketing */}
          <ListItem sx={{ px: 0, py: 2 }}>
            <Box sx={{ mr: 3, display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <Campaign />
            </Box>
            <ListItemText
              primary="Marketing Emails"
              secondary="Receive news, tips, and promotional offers."
              primaryTypographyProps={{ fontWeight: 500 }}
            />
            <ListItemSecondaryAction>
              <Switch
                edge="end"
                checked={localState.marketingEmails}
                onChange={() => handleToggle('marketingEmails')}
              />
            </ListItemSecondaryAction>
          </ListItem>
        </List>

        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!hasChanges || loading}
            sx={{ px: 4 }}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </Box>

        {snackbar.open && (
          <Alert severity={snackbar.severity} sx={{ mt: 2 }}>
            {snackbar.message}
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default NotificationSettings;