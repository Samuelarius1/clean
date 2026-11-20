// components/Layout/ModernDashboardLayout.tsx
import { useState } from "react";
import type { ReactNode } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Collapse,
  Chip,
  Tooltip,
} from "@mui/material";

import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  People,
  CleaningServices,
  Assignment,
  Assessment,
  AccountCircle,
  Logout,
  ExpandLess,
  ExpandMore,
  Inventory,
  Archive,
  Settings as SettingsIcon,
  CalendarToday,
  CreditCard,
  Receipt,
  TrendingUp,
  AccountBalance,
  Description,
  Category,
  ShoppingCart,
  Warehouse,
  LocalShipping,
  TrackChanges,
  AssignmentTurnedIn,
  Pending,
  CheckCircle,
  Star,
  Message,
  AccessTime,
  History,
  Schedule,
  Today,
  Event,
  Group,
  PersonAdd,
  Work,
  MonetizationOn,
  Payment,
  PersonOutline,
  CloudUpload,
  Restore,
  Web,
  PostAdd,
  Image as ImageIcon,
  Article,
  Delete,
  Repeat,
  Folder,
  LocationOn,
} from "@mui/icons-material";

import { useNavigate, useLocation, Outlet } from "react-router-dom";

const DRAWER_WIDTH = 280;
const COLLAPSED_WIDTH = 76; // slightly wider than 72 to fit icons nicely

interface ModernDashboardLayoutProps {
  children?: ReactNode;
  user: { name?: string; [key: string]: any } | null;
  onLogout: () => void;
  userRole: 'admin' | 'staff' | 'client' | 'superadmin';
}

interface SubMenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: SubMenuItem[];
}

export const ModernDashboardLayout = ({
  user,
  onLogout,
  userRole,
}: ModernDashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState<null | HTMLElement>(null);
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const location = useLocation();
  const isDark = theme.palette.mode === "dark";

  // Normalize role
  const normalizedRole = userRole.toLowerCase().replace(/_/g, "") as
    | "admin"
    | "staff"
    | "client"
    | "superadmin";

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElProfile(event.currentTarget);
  const handleNotificationsMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorElNotifications(event.currentTarget);
  const handleMenuClose = () => {
    setAnchorElProfile(null);
    setAnchorElNotifications(null);
  };

  const toggleMenu = (menuText: string) => {
    setOpenMenus((prev) => ({ ...prev, [menuText]: !prev[menuText] }));
  };

  const isActive = (path: string) => location.pathname === path;
  const isParentActive = (subItems?: SubMenuItem[]) =>
    subItems?.some((item) => location.pathname === item.path) ?? false;

  // Menu configuration
  let menuItems: MenuItem[] = [];

  if (normalizedRole === "admin" || normalizedRole === "superadmin") {
    menuItems = [
      {
        text: "Dashboard",
        icon: <DashboardIcon />,
        path: "/dashboard",
        subItems: [
          { text: "Overview", path: "/dashboard", icon: <DashboardIcon /> },
          { text: "Analytics", path: "/dashboard/analytics", icon: <TrendingUp /> },
          { text: "Reports", path: "/dashboard/reports", icon: <Assessment /> },
        ],
      },
      {
        text: "Bookings",
        icon: <CalendarToday />,
        path: "/dashboard/bookings",
        subItems: [
          { text: "All Bookings", path: "/dashboard/bookings", icon: <CalendarToday /> },
          { text: "Pending", path: "/dashboard/bookings/pending", icon: <AccessTime /> },
          { text: "Confirmed", path: "/dashboard/bookings/confirmed", icon: <CheckCircle /> },
          { text: "Completed", path: "/dashboard/bookings/completed", icon: <AssignmentTurnedIn /> },
          { text: "Cancelled", path: "/dashboard/bookings/cancelled", icon: <Delete /> },
        ],
      },
      {
        text: "Clients",
        icon: <People />,
        path: "/dashboard/clients",
        subItems: [
          { text: "Add Client", path: "/dashboard/clients/add", icon: <PersonAdd /> },
          { text: "All Clients", path: "/dashboard/clients", icon: <People /> },          
          { text: "Client Contracts", path: "/dashboard/clients/groups", icon: <Group /> },
          { text: "Feedback", path: "/dashboard/clients/feedback", icon: <Star /> },
        ],
      },
      {
        text: "Staff Management",
        icon: <Work />,
        path: "/dashboard/staff",
        subItems: [
          { text: "All Staff", path: "/dashboard/staff", icon: <Work /> },
          { text: "Add Staff", path: "/dashboard/staff/add", icon: <PersonAdd /> },
          { text: "Shifts & Schedule", path: "/dashboard/staff/schedule", icon: <Schedule /> },
          { text: "Performance", path: "/dashboard/staff/performance", icon: <Assessment /> },
          { text: "Payroll", path: "/dashboard/staff/payroll", icon: <MonetizationOn /> },
        ],
      },
      {
        text: "Inventory",
        icon: <Inventory />,
        path: "/dashboard/inventory",
        subItems: [
          { text: "Products", path: "/dashboard/inventory/products", icon: <Category /> },
          { text: "Categories", path: "/dashboard/inventory/categories", icon: <Folder /> },
          { text: "Stock Levels", path: "/dashboard/inventory/stock", icon: <Warehouse /> },
          { text: "Suppliers", path: "/dashboard/inventory/suppliers", icon: <LocalShipping /> },
          { text: "Orders", path: "/dashboard/inventory/orders", icon: <ShoppingCart /> },
        ],
      },
      {
        text: "Finance & Payments",
        icon: <MonetizationOn />,
        path: "/dashboard/finance",
        subItems: [
          { text: "Overview", path: "/dashboard/finance", icon: <AccountBalance /> },
          { text: "Transactions", path: "/dashboard/finance/transactions", icon: <Receipt /> },
          { text: "Invoices", path: "/dashboard/finance/invoices", icon: <Description /> },
          { text: "Payments", path: "/dashboard/finance/payments", icon: <Payment /> },
          { text: "Expenses", path: "/dashboard/finance/expenses", icon: <CreditCard /> },
          { text: "Revenue", path: "/dashboard/finance/revenue", icon: <TrendingUp /> },
        ],
      },
      {
        text: "Website CMS",
        icon: <Web />,
        path: "/dashboard/content",
        subItems: [
          { text: "Pages", path: "/dashboard/content/pages", icon: <Article /> },
          { text: "Posts", path: "/dashboard/content/posts", icon: <PostAdd /> },
          { text: "Media", path: "/dashboard/content/media", icon: <ImageIcon /> },
          { text: "SEO", path: "/dashboard/content/seo", icon: <TrendingUp /> },
        ],
      },
      ...(normalizedRole === "superadmin"
        ? [
            {
              text: "System Archive",
              icon: <Archive />,
              path: "/dashboard/archive",
              subItems: [
                { text: "Deleted Items", path: "/dashboard/archive/deleted", icon: <Delete /> },
                { text: "Backups", path: "/dashboard/archive/backups", icon: <CloudUpload /> },
                { text: "Restore", path: "/dashboard/archive/restore", icon: <Restore /> },
              ],
            },
          ]
        : []),
    ];
  } else if (normalizedRole === "staff") {
    menuItems = [
      {
        text: "My Dashboard",
        icon: <DashboardIcon />,
        path: "/staff",
        subItems: [
          { text: "Overview", path: "/staff", icon: <DashboardIcon /> },
          { text: "Today's Tasks", path: "/staff/today", icon: <Today /> },
          { text: "Performance", path: "/staff/performance", icon: <Assessment /> },
        ],
      },
      {
        text: "My Tasks",
        icon: <Assignment />,
        path: "/staff/tasks",
        subItems: [
          { text: "All Tasks", path: "/staff/tasks", icon: <Assignment /> },
          { text: "Pending", path: "/staff/tasks/pending", icon: <Pending /> },
          { text: "In Progress", path: "/staff/tasks/in-progress", icon: <TrackChanges /> },
          { text: "Completed", path: "/staff/tasks/completed", icon: <CheckCircle /> },
        ],
      },
      {
        text: "Schedule",
        icon: <CalendarToday />,
        path: "/staff/schedule",
        subItems: [
          { text: "My Schedule", path: "/staff/schedule", icon: <CalendarToday /> },
          { text: "Availability", path: "/staff/schedule/availability", icon: <AccessTime /> },
          { text: "Time Off", path: "/staff/schedule/time-off", icon: <Event /> },
        ],
      },
      {
        text: "Clients",
        icon: <People />,
        path: "/staff/clients",
        subItems: [
          { text: "My Clients", path: "/staff/clients", icon: <People /> },
          { text: "Messages", path: "/staff/clients/messages", icon: <Message /> },
        ],
      },
    ];
  } else if (normalizedRole === "client") {
    menuItems = [
      {
        text: "My Home",
        icon: <DashboardIcon />,
        path: "/client",
        subItems: [
          { text: "Dashboard", path: "/client", icon: <DashboardIcon /> },
          { text: "Quick Book", path: "/client/quick-book", icon: <CalendarToday /> },
        ],
      },
      {
        text: "Book a Service",
        icon: <CleaningServices />,
        path: "/client/book-service",
        subItems: [
          { text: "New Booking", path: "/client/book-service", icon: <CalendarToday /> },
          { text: "Recurring", path: "/client/book-service/recurring", icon: <Repeat /> },
          { text: "Schedule", path: "/client/schedule", icon: <Event /> },
        ],
      },
      {
        text: "My Bookings",
        icon: <Assignment />,
        path: "/client/bookings",
        subItems: [
          { text: "Upcoming", path: "/client/bookings/upcoming", icon: <AccessTime /> },
          { text: "History", path: "/client/bookings/history", icon: <History /> },
          { text: "Cancelled", path: "/client/bookings/cancelled", icon: <Delete /> },
        ],
      },
      {
        text: "Payments",
        icon: <Payment />,
        path: "/client/payments",
        subItems: [
          { text: "Invoices", path: "/client/payments/invoices", icon: <Description /> },
          { text: "Payment Methods", path: "/client/payments/methods", icon: <CreditCard /> },
          { text: "Transaction History", path: "/client/payments/history", icon: <Receipt /> },
        ],
      },
      {
        text: "Profile",
        icon: <AccountCircle />,
        path: "/client/profile",
        subItems: [
          { text: "My Profile", path: "/client/profile", icon: <PersonOutline /> },
          { text: "Addresses", path: "/client/profile/addresses", icon: <LocationOn /> },
          { text: "Preferences", path: "/client/profile/preferences", icon: <SettingsIcon /> },
        ],
      },
    ];
  }

  const basePath =
    normalizedRole === "staff" ? "/staff" : normalizedRole === "client" ? "/client" : "/dashboard";

  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#0f172a" : "#ffffff",
        borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2,
            bgcolor: "#E91E63",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CleaningServices sx={{ color: "#fff", fontSize: 24 }} />
        </Box>

        {(isSidebarOpen || isMobile) && (
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: isDark ? "#fff" : "#1e293b",
                fontSize: "1.1rem",
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              FaithsCleanPro
            </Typography>
            <Chip
              label={normalizedRole.toUpperCase()}
              size="small"
              sx={{
                bgcolor: isDark ? "rgba(233, 30, 99, 0.2)" : "rgba(233, 30, 99, 0.1)",
                color: "#E91E63",
                fontWeight: 700,
                fontSize: "0.65rem",
                height: 20,
                mt: 0.5,
              }}
            />
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <List
        sx={{
          flex: 1,
          px: 2.5,
          py: 3,
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: isDark ? "rgba(255,255,255,0.1)" : "#cbd5e1",
            borderRadius: "3px",
          },
        }}
      >
        {menuItems.map((item) => {
          const hasSubItems = !!item.subItems?.length;
          const isOpen = openMenus[item.text] ?? false;
          const active = !!item.path && isActive(item.path);
          const parentActive = isParentActive(item.subItems);

          // When collapsed → only show top-level items with tooltip
          if (!isSidebarOpen && !isMobile) {
            return (
              <Tooltip key={item.text} title={item.text} placement="right" arrow>
                <ListItem disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    onClick={() => {
                      if (hasSubItems) {
                        // Optional: expand sidebar when clicking collapsed parent
                        if (!isSidebarOpen) setIsSidebarOpen(true);
                        toggleMenu(item.text);
                      } else if (item.path) {
                        navigate(item.path);
                        if (isMobile) setMobileOpen(false);
                      }
                    }}
                    sx={{
                      borderRadius: 3,
                      minHeight: 48,
                      px: 2,
                      justifyContent: "center",
                      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(15,23,42,0.7)",
                      "&:hover": {
                        bgcolor: isDark ? "rgba(233,30,99,0.12)" : "rgba(233,30,99,0.08)",
                        color: "#E91E63",
                      },
                      ...(active || parentActive
                        ? {
                            bgcolor: isDark ? "rgba(233,30,99,0.18)" : "rgba(233,30,99,0.1)",
                            color: "#E91E63",
                          }
                        : {}),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "inherit",
                        minWidth: "auto",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              </Tooltip>
            );
          }

          // Normal expanded mode
          return (
            <Box key={item.text} sx={{ mb: 0.5 }}>
              <Tooltip
                title={!isSidebarOpen && !isMobile ? item.text : ""}
                placement="right"
                disableInteractive
              >
                <ListItemButton
                  onClick={() => {
                    if (hasSubItems) {
                      toggleMenu(item.text);
                    } else if (item.path) {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }
                  }}
                  sx={{
                    borderRadius: 3,
                    minHeight: 48,
                    px: 2,
                    py: 1.25,
                    color: isDark ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.65)",
                    "&:hover": {
                      bgcolor: isDark ? "rgba(233,30,99,0.08)" : "rgba(233,30,99,0.04)",
                      color: "#E91E63",
                    },
                    ...(active || parentActive
                      ? {
                          bgcolor: isDark ? "rgba(233,30,99,0.15)" : "rgba(233,30,99,0.08)",
                          color: "#E91E63",
                          fontWeight: 600,
                        }
                      : {}),
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: 40,
                      mr: 1.5,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active || parentActive ? 600 : 500,
                      fontSize: "0.875rem",
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  />

                  {hasSubItems && (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </ListItemButton>
              </Tooltip>

              {hasSubItems && (
                <Collapse in={isOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 3 }}>
                    {item.subItems!.map((subItem) => {
                      const subActive = isActive(subItem.path);
                      return (
                        <ListItem key={subItem.path} disablePadding sx={{ mb: 0.25 }}>
                          <ListItemButton
                            onClick={() => {
                              navigate(subItem.path);
                              if (isMobile) setMobileOpen(false);
                            }}
                            sx={{
                              borderRadius: 2.5,
                              minHeight: 42,
                              px: 2,
                              color: isDark ? "rgba(255,255,255,0.55)" : "rgba(15,23,42,0.6)",
                              "&:hover": {
                                bgcolor: isDark ? "rgba(233,30,99,0.08)" : "rgba(233,30,99,0.04)",
                                color: "#E91E63",
                              },
                              ...(subActive
                                ? {
                                    bgcolor: isDark ? "rgba(233,30,99,0.14)" : "rgba(233,30,99,0.07)",
                                    color: "#E91E63",
                                    fontWeight: 600,
                                  }
                                : {}),
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: "inherit",
                                minWidth: 36,
                                mr: 1.5,
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                            <ListItemText
                              primary={subItem.text}
                              primaryTypographyProps={{
                                fontWeight: subActive ? 600 : 400,
                                fontSize: "0.82rem",
                                fontFamily: '"Montserrat", sans-serif',
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      {/* Bottom section - Settings + User */}
      <Box
        sx={{
          p: 2.5,
          borderTop: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
          bgcolor: isDark ? "rgba(0,0,0,0.18)" : "rgba(241,245,249,0.4)",
        }}
      >
        <ListItemButton
          onClick={() => {
            navigate(`${basePath}/settings`);
            if (isMobile) setMobileOpen(false);
          }}
          sx={{
            borderRadius: 2.5,
            mb: 2,
            minHeight: 48,
            color: isDark ? "rgba(255,255,255,0.65)" : "rgba(15,23,42,0.65)",
            "&:hover": {
              bgcolor: isDark ? "rgba(233,30,99,0.08)" : "rgba(233,30,99,0.04)",
              color: "#E91E63",
            },
          }}
        >
          <ListItemIcon sx={{ color: "inherit", minWidth: 40, mr: 1.5 }}>
            <SettingsIcon />
          </ListItemIcon>
          {(isSidebarOpen || isMobile) && (
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{
                fontWeight: 500,
                fontSize: "0.875rem",
                fontFamily: '"Montserrat", sans-serif',
              }}
            />
          )}
        </ListItemButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1.5,
            borderRadius: 2.5,
            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
            "&:hover": {
              bgcolor: isDark ? "rgba(255,255,255,0.08)" : "#fff",
            },
          }}
        >
          <Avatar
            sx={{
              width: 42,
              height: 42,
              bgcolor: "#E91E63",
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>

          {(isSidebarOpen || isMobile) && (
            <>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{
                    fontWeight: 600,
                    color: isDark ? "#fff" : "#1e293b",
                    fontFamily: '"Montserrat", sans-serif',
                  }}
                >
                  {user?.name || "User"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(30,41,59,0.6)",
                    textTransform: "capitalize",
                  }}
                >
                  {normalizedRole}
                </Typography>
              </Box>

              <IconButton
                size="small"
                onClick={onLogout}
                sx={{
                  color: isDark ? "rgba(255,255,255,0.5)" : "rgba(30,41,59,0.5)",
                  "&:hover": { color: "#ef4444" },
                }}
                aria-label="logout"
              >
                <Logout fontSize="small" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: isDark ? "#0f172a" : "#f8fafc" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: isSidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH },
          flexShrink: { md: 0 },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Mobile temporary drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              bgcolor: isDark ? "#0f172a" : "#ffffff",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            width: isSidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
            "& .MuiDrawer-paper": {
              width: isSidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH,
              overflowX: "hidden",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              bgcolor: isDark ? "#0f172a" : "#ffffff",
              borderRight: isSidebarOpen
                ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`
                : "none",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${isSidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)` },
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: { md: `calc(100% - ${isSidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px)` },
            ml: { md: `${isSidebarOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH}px` },
            bgcolor: isDark ? "#1e293b" : "#ffffff",
            borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "#e2e8f0"}`,
            color: isDark ? "#fff" : "#1e293b",
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        >
          <Toolbar>
            {/* Mobile hamburger */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}
              aria-label="open menu"
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop collapse button */}
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleSidebar}
              sx={{
                mr: 2,
                display: { xs: "none", md: "inline-flex" },
                bgcolor: isDark ? "rgba(255,255,255,0.05)" : "rgba(15,23,42,0.04)",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.1)" : "rgba(15,23,42,0.08)",
                },
              }}
              aria-label={isSidebarOpen ? "collapse sidebar" : "expand sidebar"}
            >
              {isSidebarOpen ? <MenuOpenIcon /> : <MenuIcon />}
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                flexGrow: 1,
                fontWeight: 700,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              {normalizedRole === "client"
                ? "Client Portal"
                : normalizedRole === "staff"
                ? "Staff Portal"
                : "Admin Dashboard"}
            </Typography>

            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationsMenuOpen}
              sx={{ mr: 1 }}
              aria-label="show notifications"
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              onClick={handleProfileMenuOpen}
              aria-label="account"
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#E91E63",
                  border: `2px solid ${isDark ? "#0f172a" : "#fff"}`,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Profile dropdown */}
        <Menu
          anchorEl={anchorElProfile}
          open={Boolean(anchorElProfile)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              minWidth: 220,
              mt: 1.5,
              borderRadius: 2,
              bgcolor: isDark ? "#1e293b" : "#ffffff",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#e2e8f0"}`,
            },
          }}
        >
          <MenuItem onClick={() => { navigate(`${basePath}/settings/profile`); handleMenuClose(); }}>
            <AccountCircle sx={{ mr: 2 }} /> Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate(`${basePath}/settings`); handleMenuClose(); }}>
            <SettingsIcon sx={{ mr: 2 }} /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={onLogout} sx={{ color: "error.main" }}>
            <Logout sx={{ mr: 2 }} /> Logout
          </MenuItem>
        </Menu>

        {/* Notifications dropdown (demo content) */}
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: { minWidth: 320, mt: 1.5, borderRadius: 2 },
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6">Notifications</Typography>
          </Box>
          {/* Add real notification items here later */}
          <Box sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">No new notifications</Typography>
          </Box>
        </Menu>

        {/* Page content */}
        <Box
          component="div"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            mt: "64px",
            overflow: "auto",
            bgcolor: isDark ? "#0f172a" : "#f8fafc",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};