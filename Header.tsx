// src/components/common/Header.tsx

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { MouseEvent } from 'react';

import {
  AppBar,
  Toolbar,
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  useMediaQuery,
  Tooltip,
} from '@mui/material';

import {
  Menu as MenuIcon,
  Close,
  Home,
  InfoOutlined,
  CleaningServices,
  ContactMailOutlined,
  MiscellaneousServices,
  DarkMode,
  LightMode,
  Login,
  Logout,
  AdminPanelSettings,
  ChevronRight,
} from '@mui/icons-material';

import type { User } from '../../types';

interface HeaderProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
  mode: 'dark' | 'light';
  toggleColorMode: () => void;
}

const NAVY = '#052361';
const MAGENTA = '#E923DA';

const menuItems = [
  {
    label: 'Home',
    path: '/',
    icon: <Home />,
  },
  {
    label: 'About',
    path: '/about',
    icon: <InfoOutlined />,
  },
  {
    label: 'Services',
    path: '/services',
    icon: <MiscellaneousServices />,
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: <ContactMailOutlined />,
  },
];

const Header = ({
  isAuthenticated,
  user,
  onLogout,
  mode,
  toggleColorMode,
}: HeaderProps) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] =
    useState<null | HTMLElement>(null);

  const isDark = mode === 'dark';

  const borderColor = isDark
    ? 'rgba(255,255,255,0.10)'
    : 'rgba(5,35,97,0.10)';

  const glassBackground = isDark
    ? 'rgba(5, 15, 38, 0.94)'
    : 'rgba(255, 255, 255, 0.94)';

  const textColor = isDark ? '#FFFFFF' : NAVY;

  const mutedColor = isDark
    ? 'rgba(255,255,255,0.68)'
    : 'rgba(5,35,97,0.65)';

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  const navigateTo = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setUserMenuAnchor(null);
  };

  const handleUserMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    setMobileMenuOpen(false);
    onLogout();
    navigate('/');
  };

  const getInitials = () => {
    if (!user?.name) return 'U';

    return user.name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const isAdmin =
    user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          top: 0,
          zIndex: theme.zIndex.appBar,
          background: glassBackground,
          color: textColor,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          boxShadow: isDark
            ? '0 8px 35px rgba(0,0,0,0.18)'
            : '0 8px 35px rgba(5,35,97,0.07)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 68,
                sm: 74,
                md: 82,
              },
              px: {
                xs: 1.5,
                sm: 2,
                md: 3,
              },
              gap: 1,
            }}
          >
            {/* BRAND */}
            <Box
              onClick={() => navigateTo('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: {
                  xs: 1,
                  sm: 1.25,
                },
                cursor: 'pointer',
                flexShrink: 0,
                userSelect: 'none',
              }}
            >
              <Box
                sx={{
                  width: {
                    xs: 42,
                    sm: 48,
                    md: 52,
                  },
                  height: {
                    xs: 42,
                    sm: 48,
                    md: 52,
                  },
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#FFFFFF',
                  border: `1px solid ${
                    isDark
                      ? 'rgba(255,255,255,0.14)'
                      : 'rgba(5,35,97,0.10)'
                  }`,
                  boxShadow: isDark
                    ? '0 5px 20px rgba(0,0,0,0.28)'
                    : '0 5px 20px rgba(5,35,97,0.12)',
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Faiths CleanPro"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              </Box>

              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily:
                      'Inter, Montserrat, Arial, sans-serif',
                    fontSize: {
                      sm: '1.05rem',
                      md: '1.2rem',
                    },
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: textColor,
                  }}
                >
                  Faiths
                  <Box
                    component="span"
                    sx={{
                      color: MAGENTA,
                      ml: 0.35,
                    }}
                  >
                    CleanPro
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    mt: 0.45,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.13em',
                    textTransform: 'uppercase',
                    color: mutedColor,
                  }}
                >
                  Clean • Fresh • Professional
                </Typography>
              </Box>
            </Box>

            {/* DESKTOP NAVIGATION */}
            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  ml: {
                    md: 3,
                    lg: 5,
                  },
                  gap: 0.5,
                }}
              >
                {menuItems.map((item) => {
                  const active = isActive(item.path);

                  return (
                    <Button
                      key={item.path}
                      onClick={() => navigateTo(item.path)}
                      disableRipple
                      sx={{
                        position: 'relative',
                        minWidth: 'auto',
                        px: {
                          md: 1.7,
                          lg: 2,
                        },
                        py: 1.5,
                        borderRadius: '12px',
                        color: active ? MAGENTA : textColor,
                        fontSize: '0.9rem',
                        fontWeight: active ? 800 : 600,
                        textTransform: 'none',
                        transition:
                          'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.06)'
                            : 'rgba(5,35,97,0.05)',
                          color: MAGENTA,
                        },
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: '50%',
                          bottom: 5,
                          width: active ? 22 : 0,
                          height: 3,
                          borderRadius: 10,
                          background: MAGENTA,
                          transform: 'translateX(-50%)',
                          transition:
                            'width 0.2s ease',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>
            )}

            {!isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.75,
                  flexShrink: 0,
                }}
              >
                {/* THEME */}
                <Tooltip
                  title={
                    isDark
                      ? 'Switch to light mode'
                      : 'Switch to dark mode'
                  }
                >
                  <IconButton
                    onClick={toggleColorMode}
                    aria-label="Toggle color mode"
                    sx={{
                      width: 44,
                      height: 44,
                      color: textColor,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '12px',
                      transition:
                        'all 0.2s ease',
                      '&:hover': {
                        color: MAGENTA,
                        borderColor: MAGENTA,
                        backgroundColor: isDark
                          ? 'rgba(233,35,218,0.10)'
                          : 'rgba(233,35,218,0.06)',
                      },
                    }}
                  >
                    {isDark ? (
                      <LightMode fontSize="small" />
                    ) : (
                      <DarkMode fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>

                {/* ACCOUNT */}
                {isAuthenticated ? (
                  <>
                    <Tooltip title="Account">
                      <IconButton
                        onClick={handleUserMenuOpen}
                        aria-label="Open account menu"
                        sx={{
                          ml: 0.5,
                          p: 0.35,
                          border: `2px solid ${
                            isDark
                              ? 'rgba(255,255,255,0.12)'
                              : 'rgba(5,35,97,0.10)'
                          }`,
                          borderRadius: '50%',
                          '&:hover': {
                            borderColor: MAGENTA,
                          },
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 38,
                            height: 38,
                            fontSize: '0.82rem',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            background:
                              `linear-gradient(135deg, ${NAVY}, ${MAGENTA})`,
                          }}
                        >
                          {getInitials()}
                        </Avatar>
                      </IconButton>
                    </Tooltip>

                    <Menu
                      anchorEl={userMenuAnchor}
                      open={Boolean(userMenuAnchor)}
                      onClose={handleUserMenuClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      PaperProps={{
                        sx: {
                          mt: 1.2,
                          minWidth: 230,
                          borderRadius: '16px',
                          overflow: 'hidden',
                          backgroundColor: isDark
                            ? '#101A31'
                            : '#FFFFFF',
                          border: `1px solid ${borderColor}`,
                          boxShadow:
                            '0 18px 50px rgba(0,0,0,0.16)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          px: 2,
                          py: 1.75,
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 800,
                            color: textColor,
                            fontSize: '0.92rem',
                          }}
                        >
                          {user?.name || 'User'}
                        </Typography>

                        <Typography
                          sx={{
                            mt: 0.35,
                            color: mutedColor,
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {user?.email || ''}
                        </Typography>
                      </Box>

                      {isAdmin && (
                        <MenuItem
                          onClick={() =>
                            navigateTo('/dashboard')
                          }
                          sx={{
                            py: 1.3,
                            fontWeight: 600,
                            color: textColor,
                            '&:hover': {
                              color: MAGENTA,
                              backgroundColor:
                                isDark
                                  ? 'rgba(233,35,218,0.08)'
                                  : 'rgba(233,35,218,0.05)',
                            },
                          }}
                        >
                          <AdminPanelSettings
                            sx={{
                              mr: 1.2,
                              color: MAGENTA,
                            }}
                          />
                          Admin Panel
                        </MenuItem>
                      )}

                      <MenuItem
                        onClick={handleLogout}
                        sx={{
                          py: 1.3,
                          fontWeight: 600,
                          color: textColor,
                          '&:hover': {
                            color: MAGENTA,
                            backgroundColor:
                              isDark
                                ? 'rgba(233,35,218,0.08)'
                                : 'rgba(233,35,218,0.05)',
                          },
                        }}
                      >
                        <Logout
                          sx={{
                            mr: 1.2,
                            color: MAGENTA,
                          }}
                        />
                        Logout
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Button
                    onClick={() => navigateTo('/login')}
                    startIcon={<Login />}
                    sx={{
                      ml: 0.75,
                      minHeight: 44,
                      px: 2.2,
                      borderRadius: '12px',
                      color: '#FFFFFF',
                      background:
                        `linear-gradient(135deg, ${NAVY} 0%, ${MAGENTA} 100%)`,
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      textTransform: 'none',
                      boxShadow:
                        '0 8px 22px rgba(233,35,218,0.20)',
                      '&:hover': {
                        background:
                          `linear-gradient(135deg, ${MAGENTA} 0%, ${NAVY} 100%)`,
                        boxShadow:
                          '0 10px 28px rgba(233,35,218,0.28)',
                      },
                    }}
                  >
                    Sign In
                  </Button>
                )}
              </Box>
            )}

            {/* MOBILE CONTROLS */}
            {isMobile && (
              <Box
                sx={{
                  ml: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <IconButton
                  onClick={toggleColorMode}
                  aria-label="Toggle color mode"
                  sx={{
                    width: 42,
                    height: 42,
                    color: textColor,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '12px',
                  }}
                >
                  {isDark ? (
                    <LightMode fontSize="small" />
                  ) : (
                    <DarkMode fontSize="small" />
                  )}
                </IconButton>

                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Open navigation"
                  sx={{
                    width: 46,
                    height: 46,
                    ml: 0.5,
                    color: '#FFFFFF',
                    background:
                      `linear-gradient(135deg, ${NAVY}, ${MAGENTA})`,
                    borderRadius: '13px',
                    '&:hover': {
                      background:
                        `linear-gradient(135deg, ${MAGENTA}, ${NAVY})`,
                    },
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      {/* MOBILE DRAWER */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            width: {
              xs: '88%',
              sm: 390,
            },
            maxWidth: 420,
            backgroundColor: isDark
              ? '#08142D'
              : '#FFFFFF',
            color: textColor,
            borderLeft: `1px solid ${borderColor}`,
            backgroundImage: 'none',
          },
        }}
      >
        <Box
          sx={{
            minHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* DRAWER HEADER */}
          <Box
            sx={{
              px: 2,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: `1px solid ${borderColor}`,
            }}
          >
            <Box
              onClick={() => navigateTo('/')}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.1,
                cursor: 'pointer',
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src="/logo.png"
                  alt="Faiths CleanPro"
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: textColor,
                    lineHeight: 1,
                  }}
                >
                  Faiths
                  <Box
                    component="span"
                    sx={{
                      color: MAGENTA,
                      ml: 0.3,
                    }}
                  >
                    CleanPro
                  </Box>
                </Typography>

                <Typography
                  sx={{
                    mt: 0.45,
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    color: mutedColor,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Premium Cleaning
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation"
              sx={{
                color: textColor,
                width: 42,
                height: 42,
                border: `1px solid ${borderColor}`,
                borderRadius: '12px',
              }}
            >
              <Close />
            </IconButton>
          </Box>

          {/* ACCOUNT CARD */}
          {isAuthenticated && (
            <Box
              sx={{
                mx: 2,
                mt: 2,
                p: 1.5,
                borderRadius: '16px',
                background: isDark
                  ? 'rgba(255,255,255,0.045)'
                  : 'rgba(5,35,97,0.035)',
                border: `1px solid ${borderColor}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
              }}
            >
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  fontWeight: 800,
                  background:
                    `linear-gradient(135deg, ${NAVY}, ${MAGENTA})`,
                }}
              >
                {getInitials()}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    color: textColor,
                  }}
                >
                  {user?.name || 'User'}
                </Typography>

                <Typography
                  sx={{
                    color: mutedColor,
                    fontSize: '0.72rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.email || ''}
                </Typography>
              </Box>
            </Box>
          )}

          {/* NAVIGATION */}
          <Box sx={{ px: 1.5, pt: 2 }}>
            <Typography
              sx={{
                px: 1,
                mb: 0.8,
                fontSize: '0.67rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: mutedColor,
              }}
            >
              Navigation
            </Typography>

            <List disablePadding>
              {menuItems.map((item) => {
                const active = isActive(item.path);

                return (
                  <ListItem
                    key={item.path}
                    disablePadding
                    sx={{ mb: 0.5 }}
                  >
                    <ListItemButton
                      onClick={() => navigateTo(item.path)}
                      selected={active}
                      sx={{
                        minHeight: 54,
                        px: 1.5,
                        borderRadius: '14px',
                        color: active
                          ? MAGENTA
                          : textColor,
                        '&.Mui-selected': {
                          backgroundColor: isDark
                            ? 'rgba(233,35,218,0.11)'
                            : 'rgba(233,35,218,0.07)',
                        },
                        '&.Mui-selected:hover': {
                          backgroundColor: isDark
                            ? 'rgba(233,35,218,0.15)'
                            : 'rgba(233,35,218,0.10)',
                        },
                        '&:hover': {
                          backgroundColor: isDark
                            ? 'rgba(255,255,255,0.05)'
                            : 'rgba(5,35,97,0.04)',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 42,
                          color: active
                            ? MAGENTA
                            : mutedColor,
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: active ? 800 : 600,
                          fontSize: '0.92rem',
                        }}
                      />

                      <ChevronRight
                        sx={{
                          fontSize: 20,
                          color: active
                            ? MAGENTA
                            : mutedColor,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          <Divider
            sx={{
              mx: 2,
              my: 1.5,
              borderColor,
            }}
          />

          {/* MOBILE ACTIONS */}
          <Box sx={{ px: 2 }}>
            <Typography
              sx={{
                mb: 1,
                fontSize: '0.67rem',
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: mutedColor,
              }}
            >
              Account
            </Typography>

            <Button
              fullWidth
              onClick={toggleColorMode}
              startIcon={
                isDark ? <LightMode /> : <DarkMode />
              }
              sx={{
                justifyContent: 'flex-start',
                minHeight: 50,
                px: 1.5,
                borderRadius: '13px',
                color: textColor,
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.05)'
                    : 'rgba(5,35,97,0.04)',
                },
              }}
            >
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </Button>

            {!isAuthenticated ? (
              <Button
                fullWidth
                onClick={() => navigateTo('/login')}
                startIcon={<Login />}
                sx={{
                  mt: 1,
                  minHeight: 52,
                  borderRadius: '14px',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  textTransform: 'none',
                  background:
                    `linear-gradient(135deg, ${NAVY}, ${MAGENTA})`,
                  '&:hover': {
                    background:
                      `linear-gradient(135deg, ${MAGENTA}, ${NAVY})`,
                  },
                }}
              >
                Sign In
              </Button>
            ) : (
              <>
                {isAdmin && (
                  <Button
                    fullWidth
                    onClick={() =>
                      navigateTo('/dashboard')
                    }
                    startIcon={
                      <AdminPanelSettings />
                    }
                    sx={{
                      mt: 0.5,
                      minHeight: 50,
                      justifyContent: 'flex-start',
                      px: 1.5,
                      borderRadius: '13px',
                      color: textColor,
                      fontWeight: 700,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: isDark
                          ? 'rgba(255,255,255,0.05)'
                          : 'rgba(5,35,97,0.04)',
                        color: MAGENTA,
                      },
                    }}
                  >
                    Admin Panel
                  </Button>
                )}

                <Button
                  fullWidth
                  onClick={handleLogout}
                  startIcon={<Logout />}
                  sx={{
                    mt: 0.5,
                    minHeight: 50,
                    justifyContent: 'flex-start',
                    px: 1.5,
                    borderRadius: '13px',
                    color: textColor,
                    fontWeight: 700,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: isDark
                        ? 'rgba(233,35,218,0.08)'
                        : 'rgba(233,35,218,0.05)',
                      color: MAGENTA,
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </Box>

          {/* DRAWER FOOTER */}
          <Box
            sx={{
              mt: 'auto',
              p: 2,
              pt: 3,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderRadius: '16px',
                background:
                  `linear-gradient(135deg, ${NAVY}, ${MAGENTA})`,
                color: '#FFFFFF',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <CleaningServices
                sx={{
                  position: 'absolute',
                  right: -8,
                  bottom: -8,
                  fontSize: 80,
                  opacity: 0.10,
                }}
              />

              <Typography
                sx={{
                  position: 'relative',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                }}
              >
                Faiths CleanPro
              </Typography>

              <Typography
                sx={{
                  position: 'relative',
                  mt: 0.5,
                  fontSize: '0.72rem',
                  opacity: 0.85,
                }}
              >
                Clean. Fresh. Professional.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default Header;