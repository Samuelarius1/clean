import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Divider, // <--- ADDED THIS IMPORT
  useMediaQuery,
  useTheme
} from '@mui/material';
import {
  Palette,
  Brightness4,
  Brightness7,
  Language
} from '@mui/icons-material';
import { useSettings } from '../../../hooks/useSettings';
const AppearanceSettings = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { showMessage } = useSettings();
  
  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('English (US)');
  
  const handleSave = () => {
    // Apply theme logic here
    const newMode = currentMode;
    localStorage.setItem('theme-mode', newMode);
    window.location.reload(); // Simple reload to apply theme globally
    showMessage('Appearance settings saved', 'success');
  };

  const themeOptions = [
    { value: 'light', label: 'Light Mode', icon: <Brightness7 />, desc: 'Clean and bright' },
    { value: 'dark', label: 'Dark Mode', icon: <Brightness4 />, desc: 'Easy on the eyes' },
  ];

  const languageOptions = ['English (US)', 'Spanish', 'French', 'German', 'Japanese'];

  return (
    <Box maxWidth="800px">
      <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Appearance</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Customize how FaithsCleanPro looks and feels.
        </Typography>

        {/* Theme Selection */}
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Palette color="primary" /> Theme
        </Typography>

        {isMobile ? (
          // MOBILE: Grid of Cards
          <Grid container spacing={2} sx={{ mb: 5 }}>
            {themeOptions.map((opt) => (
              <Grid  key={opt.value}>
                <Paper
                  elevation={0}
                  onClick={() => setCurrentMode(opt.value as 'light' | 'dark')}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: currentMode === opt.value ? 'primary.main' : 'divider',
                    bgcolor: currentMode === opt.value ? 'primary.light' : 'background.paper',
                    transition: 'all 0.2s',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Box sx={{ fontSize: 32, color: currentMode === opt.value ? 'primary.main' : 'text.secondary' }}>
                    {opt.icon}
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600}>{opt.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{opt.desc}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          // DESKTOP: Select Dropdown
          <FormControl fullWidth sx={{ mb: 5 }}>
            <InputLabel>Theme Preference</InputLabel>
            <Select
              value={currentMode}
              label="Theme Preference"
              onChange={(e) => setCurrentMode(e.target.value as 'light' | 'dark')}
            >
              {themeOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {opt.icon}
                    <Typography>{opt.label}</Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Language Selection */}
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Language color="primary" /> Language
        </Typography>
        
        <Box sx={{ mb: 5 }}>
           <FormControl fullWidth>
            <InputLabel>Language</InputLabel>
            <Select
              value={language}
              label="Language"
              onChange={(e) => setLanguage(e.target.value)}
            >
              {languageOptions.map((lang) => (
                <MenuItem key={lang} value={lang}>{lang}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* This Divider will now work */}
        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{ px: 4 }}
          >
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AppearanceSettings;