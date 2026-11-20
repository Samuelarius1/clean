import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Avatar,
  Grid,
  Button,
  Divider,
  IconButton,
  Alert,
  Stack,
  useTheme
} from '@mui/material';
import {
  CameraAlt,
  Person,
  Email,
  Phone,
  LocationOn
} from '@mui/icons-material';
import { COLORS } from '../../../utils/constants';

const ProfileSettings = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  // Mock Data - replace with real context/hook data
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@faithscleanpro.com',
    phone: '+1 (555) 123-4567',
    address: '123 Clean Street',
    city: 'Sparkle City',
    zipCode: '90210',
    country: 'USA',
    avatar: ''
  });

  const [formData, setFormData] = useState(profile);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving:', formData);
    setProfile(formData);
    setHasChanges(false);
    // Add API call here
  };

  return (
    <Box maxWidth="900px">
      <Paper 
        sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 3, 
          bgcolor: isDark ? COLORS.surface : '#fff',
          border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #e0e0e0'
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? '#fff' : '#0F172A' }}>
            Profile Information
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Update your photo and personal details here.
          </Typography>
        </Box>

        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5, flexWrap: 'wrap' }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={profile.avatar || undefined}
              sx={{ width: 100, height: 100, bgcolor: `${COLORS.primary}20`, color: COLORS.primary, fontSize: 40 }}
            >
              {profile.avatar ? '' : profile.firstName.charAt(0)}
            </Avatar>
            <IconButton
              sx={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                bgcolor: isDark ? COLORS.surface : '#fff',
                border: '2px solid',
                borderColor: 'divider',
                '&:hover': { bgcolor: 'action.hover' }
              }}
            >
              <CameraAlt color="primary" />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} sx={{color: isDark ? '#fff' : '#333'}}>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              JPG, GIF or PNG. Max size of 800K
            </Typography>
            <Button variant="outlined" size="small">
              Upload New
            </Button>
          </Box>
        </Box>

        {hasChanges && (
          <Alert severity="info" sx={{ mb: 3 }}>
            You have unsaved changes.
          </Alert>
        )}

        {/* Form */}
        <Grid container spacing={3}>
          <Grid >
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              InputProps={{ 
                startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />,
                sx: { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }
              }}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              InputProps={{ 
                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                sx: { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }
              }}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              InputProps={{ 
                startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                sx: { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }
              }}
            />
          </Grid>
          <Grid >
            <Divider sx={{ my: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0' }} />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              InputProps={{ 
                startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                sx: { bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }
              }}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            />
          </Grid>
          <Grid >
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              sx={{ bgcolor: isDark ? 'rgba(255,255,255,0.02)' : 'transparent' }}
            />
          </Grid>
        </Grid>

        {/* Actions */}
        <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ mt: 4, pt: 3, borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}` }}>
          <Button
            variant="outlined"
            onClick={() => { setFormData(profile); setHasChanges(false); }}
            disabled={!hasChanges}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!hasChanges}
            sx={{ 
              px: 4, 
              borderRadius: 2,
              bgcolor: COLORS.primary,
              '&:hover': { bgcolor: '#C2185B' }
            }}
          >
            Save Changes
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default ProfileSettings;