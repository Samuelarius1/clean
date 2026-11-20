import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Avatar,
  Grid,
  Tab,
  Tabs,
  Paper,
  IconButton,
  useTheme,
  useMediaQuery,
  Alert
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  CameraAlt,
  Save,
  Close
} from '@mui/icons-material';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

interface SettingsProps {
  user: User;
}

const SettingsView = ({ user }: SettingsProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDark = theme.palette.mode === 'dark';

  // Local State for Tabs
  const [currentTab, setCurrentTab] = useState('profile');

  // Local State for Form
  const [formData, setFormData] = useState({
    firstName: user.name.split(' ')[0] || '',
    lastName: user.name.split(' ').slice(1).join(' ') || '',
    email: user.email,
    phone: '+1 (555) 000-0000'
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', formData);
    setHasChanges(false);
    // Here you would call your API to update the user
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.name.split(' ')[0] || '',
      lastName: user.name.split(' ').slice(1).join(' ') || '',
      email: user.email,
      phone: '+1 (555) 000-0000'
    });
    setHasChanges(false);
  };

  // Settings Navigation Data
  const settingsNavItems = [
    { id: 'profile', label: 'Profile', icon: <Person /> },
    { id: 'security', label: 'Security', icon: <Security /> },
    { id: 'notifications', label: 'Notifications', icon: <Notifications /> },
  ];

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      
      {/* Layout Grid */}
      <Grid container spacing={3}>
        
        {/* LEFT: Navigation (Vertical on Desktop, Tabs on Mobile) */}
        <Grid >
          {isMobile ? (
            // Mobile: Horizontal Tabs
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={currentTab} 
                onChange={(_, newVal) => setCurrentTab(newVal)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ minHeight: 48 }}
              >
                {settingsNavItems.map((item) => (
                  <Tab 
                    key={item.id} 
                    label={item.label} 
                    value={item.id} 
                    icon={item.icon}
                    iconPosition="start"
                    sx={{ 
                      minHeight: 48, 
                      textTransform: 'none', 
                      fontWeight: 500,
                      color: theme.palette.text.secondary
                    }} 
                  />
                ))}
              </Tabs>
            </Box>
          ) : (
            // Desktop: Vertical List
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 3, 
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                overflow: 'hidden',
                bgcolor: isDark ? '#1E293B' : '#fff'
              }}
            >
              <Box sx={{ p: 3, bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC' }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Settings</Typography>
              </Box>
              <Box sx={{ p: 1 }}>
                {settingsNavItems.map((item) => (
                  <Button
                    key={item.id}
                    fullWidth
                    startIcon={item.icon}
                    onClick={() => setCurrentTab(item.id)}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 1.5,
                      px: 2,
                      mb: 0.5,
                      borderRadius: 2,
                      color: currentTab === item.id ? '#4F46E5' : theme.palette.text.secondary,
                      bgcolor: currentTab === item.id ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
                      },
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* RIGHT: Content Area */}
        <Grid >
          
          {/* PROFILE TAB CONTENT */}
          {currentTab === 'profile' && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                bgcolor: isDark ? '#1E293B' : '#fff',
                overflow: 'visible'
              }}
            >
              {/* Header */}
              <Box sx={{ p: { xs: 3, md: 4 }, borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}` }}>
                <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#0F172A' }}>
                  Profile Settings
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Update your photo and personal details here.
                </Typography>
              </Box>

              <Box sx={{ p: { xs: 3, md: 4 } }}>
                
                {/* Avatar Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 6, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' }, gap: 3 }}>
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      sx={{ width: 100, height: 100, border: '4px solid', borderColor: isDark ? '#334155' : '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: '#4F46E5',
                        color: '#fff',
                        '&:hover': { bgcolor: '#4338CA' },
                        border: '2px solid',
                        borderColor: isDark ? '#1E293B' : '#fff'
                      }}
                    >
                      <CameraAlt fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      JPG, GIF or PNG. Max size of 800K
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                      Upload New
                    </Button>
                  </Box>
                </Box>

                {/* Form Section */}
                <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Grid container spacing={3}>
                    <Grid >
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}
                      />
                    </Grid>
                    <Grid >
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}
                      />
                    </Grid>
                    <Grid >
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}
                      />
                    </Grid>
                    <Grid >
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        variant="outlined"
                        size="medium"
                        sx={{
                          '& .MuiOutlinedInput-root': { borderRadius: 2 },
                          bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent'
                        }}
                      />
                    </Grid>
                  </Grid>

                  {/* Unsaved Changes Warning */}
                  {hasChanges && (
                    <Alert severity="warning" sx={{ borderRadius: 2, mt: 2 }}>
                      You have unsaved changes. Remember to save before leaving.
                    </Alert>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2, pt: 3, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}` }}>
                    <Button
                      variant="outlined"
                      startIcon={<Close />}
                      onClick={handleCancel}
                      disabled={!hasChanges}
                      sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 4 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSave}
                      disabled={!hasChanges}
                      sx={{
                        bgcolor: '#4F46E5',
                        boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        px: 4,
                        '&:hover': { bgcolor: '#4338CA' }
                      }}
                    >
                      Save Changes
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}

          {/* SECURITY TAB CONTENT */}
          {currentTab === 'security' && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                bgcolor: isDark ? '#1E293B' : '#fff',
                textAlign: 'center'
              }}
            >
              <Security sx={{ fontSize: 48, color: '#64748B', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Security Settings</Typography>
              <Typography variant="body2" color="text.secondary">
                Change your password and configure 2FA here. (Coming Soon)
              </Typography>
            </Paper>
          )}

          {/* NOTIFICATIONS TAB CONTENT */}
          {currentTab === 'notifications' && (
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 3,
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
                bgcolor: isDark ? '#1E293B' : '#fff',
                textAlign: 'center'
              }}
            >
              <Notifications sx={{ fontSize: 48, color: '#64748B', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>Notification Preferences</Typography>
              <Typography variant="body2" color="text.secondary">
                Manage how you receive alerts. (Coming Soon)
              </Typography>
            </Paper>
          )}

        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsView;