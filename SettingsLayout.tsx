import { useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
} from "@mui/material";
import {
  Person,
  Lock,
  Notifications,
  Palette,
  Payment,
  Business,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { COLORS } from "../../utils/constants";

const SETTINGS_DRAWER_WIDTH = 240;

interface SettingsMenuItem {
  text: string;
  icon: React.ReactNode;
  path: string; // This is the last part of the path, e.g., "profile"
  description: string;
}

export const SettingsLayout = (): React.ReactElement => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme.palette.mode === 'dark';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const settingsMenuItems: SettingsMenuItem[] = [
    { text: "Profile", icon: <Person />, path: "profile", description: "Personal Information" },
    { text: "Security", icon: <Lock />, path: "security", description: "Password and 2FA" },
    { text: "Notifications", icon: <Notifications />, path: "notifications", description: "Alert Preferences" },
    { text: "Appearance", icon: <Palette />, path: "appearance", description: "Theme and Layout" },
    { text: "Language", icon: <Payment />, path: "language", description: "Localization Settings" },
    { text: "Billing", icon: <Payment />, path: "billing", description: "Subscriptions" },
    { text: "Services", icon: <Business />, path: "services", description: "Company Services" },
    { text: "Organization", icon: <Business />, path: "organization", description: "Company Details" },
  ];

  // ✅ FIX: Determine the base path to build absolute links.
  // This is now more robust. It finds the 'settings' part of the URL.
  const pathSegments = location.pathname.split('/');
  const settingsIndex = pathSegments.indexOf('settings');
  const basePath = settingsIndex > -1 ? `/${pathSegments.slice(0, settingsIndex + 1).join('/')}` : '/dashboard/settings';

  const isActive = (path: string) => {
    return location.pathname.endsWith(path);
  };

  // ✅ FIX: Navigate to an absolute path
  const handleNavigate = (path: string) => {
    const absolutePath = `${basePath}/${path}`;
    navigate(absolutePath);
    if (isMobile) setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      bgcolor: "transparent"
    }}>
      {/* Header */}
      <Box sx={{ p: 2, mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: isDark ? "#fff" : "#0F172A" }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage preferences
        </Typography>
      </Box>

      {/* Menu Items */}
      <List sx={{ px: 1, overflow: "auto", flex: 1 }}>
        {settingsMenuItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigate(item.path)}
              sx={{
                borderRadius: "8px",
                py: 1.2,
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
                "&:hover": { 
                  bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                },
                ...(isActive(item.path) && {
                  bgcolor: isDark ? "rgba(233, 30, 99, 0.15)" : "rgba(233, 30, 99, 0.08)",
                  color: COLORS.primary,
                  borderLeft: `3px solid ${COLORS.primary}`
                }),
              }}
            >
              <ListItemIcon sx={{ color: "inherit", minWidth: 36 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                secondary={item.description}
                primaryTypographyProps={{ fontWeight: 600, fontSize: "0.95rem" }}
                secondaryTypographyProps={{ fontSize: "0.75rem", sx: { mt: 0.25 } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      display: "flex", 
      height: "100%", 
      position: "relative", 
      overflow: "auto",
      bgcolor: isDark ? COLORS.background : "#f8fafc" 
    }}>
      
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Paper
          elevation={0}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 20,
            zIndex: 1300,
            borderRadius: "50%",
            bgcolor: isDark ? COLORS.surface : "#fff",
            boxShadow: theme.shadows[4],
            display: { lg: 'none' }
          }}
        >
          <IconButton onClick={handleDrawerToggle} size="large">
            <MenuIcon />
          </IconButton>
        </Paper>
      )}

      {/* Inner Settings Drawer */}
      <Box
        component="nav"
        sx={{ 
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: { lg: SETTINGS_DRAWER_WIDTH }, 
          flexShrink: { lg: 0 }, 
          display: { xs: 'none', lg: 'block' },
          zIndex: 0
        }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SETTINGS_DRAWER_WIDTH,
              bgcolor: isDark ? COLORS.surface : "#fff",
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", lg: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: SETTINGS_DRAWER_WIDTH,
              border: "none",
              borderRight: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #e0e0e0",
              bgcolor: "transparent",
              position: 'relative',
              height: '100%',
              overflow: 'hidden'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Settings Content Area */}
      <Box
        component="main"
        sx={{
          position: "relative",
          zIndex: 1,
          flexGrow: 1,
          width: { xs: "100%", lg: `calc(100% - ${SETTINGS_DRAWER_WIDTH}px)` },
          ml: { lg: `${SETTINGS_DRAWER_WIDTH}px` },
          p: { xs: 1, lg: 3 },
          minWidth: 0,
          bgcolor: isDark ? COLORS.background : "#f8fafc", 
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "inherit",
            zIndex: -1,
          }
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};