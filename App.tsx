// App.tsx - KEY FIX: Use 'authToken' consistently everywhere
import { useState, useEffect, Suspense, lazy } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  CssBaseline, Box, Typography, Container, Button
} from '@mui/material'; 
import { 
  Routes, Route, Navigate, BrowserRouter, useLocation, useNavigate
} from 'react-router-dom';

// Contexts
import { LayoutProvider, useLayout } from './contexts/LayoutContext';
import type { User, UserRole, LoginHandler } from './types';

// Layouts
import { ModernDashboardLayout } from './components/Layout/ModernDashboardLayout';
import { SettingsLayout } from './components/Layout/SettingsLayout';

// Public Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Loading from './components/common/Loading';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import AddNewClient from './components/admin/clients/AddClient';

// Lazy loaded pages (keep your existing imports)
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardOverview = lazy(() => import('./components/admin/Dashboard').catch(() => ({ 
  default: () => (<Container maxWidth="md" sx={{ mt: 4 }}><Typography variant="h4">Dashboard Overview</Typography><Typography color="text.secondary">Welcome to the admin dashboard</Typography></Container>) 
})));
const BookingsPage = lazy(() => import('./components/admin/bookings/BookingsPage').catch(() => ({ default: () => <PlaceholderPage title="Bookings" /> })));
const ClientsPage = lazy(() => import('./components/admin/clients/ClientList').catch(() => ({ default: () => <PlaceholderPage title="Clients" /> })));
const StaffPage = lazy(() => import('./components/admin/StaffPage').catch(() => ({ default: () => <PlaceholderPage title="Staff Management" /> })));
const InventoryPage = lazy(() => import('./components/admin/InventoryPage').catch(() => ({ default: () => <PlaceholderPage title="Inventory" /> })));
const FinancePage = lazy(() => import('./components/admin/FinancePage').catch(() => ({ default: () => <PlaceholderPage title="Finance" /> })));
const ArchivePage = lazy(() => import('./components/admin/ArchivePage').catch(() => ({ default: () => <PlaceholderPage title="Archive" /> })));
const ContentPage = lazy(() => import('./components/admin/ContentPage').catch(() => ({ default: () => <PlaceholderPage title="Website CMS" /> })));
const StaffDashboard = lazy(() => import('./components/admin/staff/StaffDashboard').catch(() => ({ default: () => <PlaceholderPage title="Staff Dashboard" /> })));
const StaffTasks = lazy(() => import('./components/admin/staff/StaffTasks').catch(() => ({ default: () => <PlaceholderPage title="Staff Tasks" /> })));
const ClientDashboard = lazy(() => import('./components/admin/clients/ClientDashboard').catch(() => ({ default: () => <PlaceholderPage title="Client Home" /> })));
const ClientBooking = lazy(() => import('./components/admin/clients/ClientBooking').catch(() => ({ default: () => <PlaceholderPage title="Book a Service" /> })));
const ProfileSettings = lazy(() => import('./components/admin/settings/ProfileSettings').catch(() => ({ default: () => <PlaceholderPage title="Profile Settings" /> })));
const NotificationSettings = lazy(() => import('./components/admin/settings/NotificationSettings').catch(() => ({ default: () => <PlaceholderPage title="Notifications" /> })));
const AppearanceSettings = lazy(() => import('./components/admin/settings/AppearanceSettings').catch(() => ({ default: () => <PlaceholderPage title="Appearance" /> })));
const SecuritySettings = lazy(() => import('./components/admin/settings/AppearanceSettings').catch(() => ({ default: () => <PlaceholderPage title="Security Settings" /> })));
const LanguageSettings = lazy(() => import('./components/admin/settings/AppearanceSettings').catch(() => ({ default: () => <PlaceholderPage title="Language & Region" /> })));
const BillingSettings = lazy(() => import('./components/admin/settings/AppearanceSettings').catch(() => ({ default: () => <PlaceholderPage title="Billing" /> })));
const OrganizationSettings = lazy(() => import('./components/admin/settings/AppearanceSettings').catch(() => ({ default: () => <PlaceholderPage title="Organization" /> })));

// ✅ FIXED: Removed .catch() to see actual errors during development
const ServiceSettings = lazy(() => import('./components/Services/Services'));

const HelpSettings = lazy(() => import('./components/admin/settings/AppearanceSettings').catch(() => ({ default: () => <PlaceholderPage title="Help & Support" /> })));

const normalizeRole = (role: string | undefined): UserRole => {
  if (!role) return 'client';
  const normalized = role.toLowerCase().replace(/_/g, '');
  const validRoles: UserRole[] = ['superadmin', 'admin', 'staff', 'client'];
  return validRoles.includes(normalized as UserRole) ? (normalized as UserRole) : 'client';
};

const PlaceholderPage = ({ title }: { title: string }) => {
  const isDark = localStorage.getItem('theme-mode') === 'dark';
  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, fontFamily: '"Montserrat", sans-serif', color: isDark ? "#fff" : "#1e293b" }}>{title}</Typography>
      <Typography color="text.secondary" sx={{ mb: 3, fontFamily: '"Montserrat", sans-serif' }}>This module is under construction or the file is missing.</Typography>
      <Button variant="contained" sx={{ bgcolor: '#E91E63', '&:hover': { bgcolor: '#C2185B' }, borderRadius: 2, px: 3, fontWeight: 600, textTransform: 'none', fontFamily: '"Montserrat", sans-serif' }} onClick={() => window.history.back()}>Go Back</Button>
    </Container>
  );
};

const getDesignTokens = (mode: 'dark' | 'light') => ({
  palette: { mode, primary: { main: '#E91E63' }, secondary: { main: '#FFC107' }, ...(mode === 'dark' ? { background: { default: '#0f172a', paper: '#1e293b' }, text: { primary: '#f8fafc', secondary: '#94a3b8' }, divider: 'rgba(255, 255, 255, 0.08)' } : { background: { default: '#f8fafc', paper: '#ffffff' }, text: { primary: '#1e293b', secondary: '#64748b' }, divider: 'rgba(0, 0, 0, 0.08)' }) },
  typography: { fontFamily: '"Montserrat", "Roboto", "Helvetica", "Arial", sans-serif', h1: { fontWeight: 800, fontSize: '2.5rem' }, h2: { fontWeight: 700, fontSize: '2rem' }, h3: { fontWeight: 600, fontSize: '1.5rem' }, h4: { fontWeight: 700, fontSize: '1.25rem' }, h5: { fontWeight: 600, fontSize: '1.125rem' }, h6: { fontWeight: 600, fontSize: '1rem' }, body1: { fontSize: '1rem', lineHeight: 1.6 }, body2: { fontSize: '0.875rem', lineHeight: 1.5 }, button: { textTransform: 'none', fontWeight: 600, fontFamily: '"Montserrat", sans-serif' } },
  components: { MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none', padding: '10px 24px', fontWeight: 600 } } }, MuiCard: { styleOverrides: { root: { borderRadius: 16, backgroundImage: 'none', border: `1px solid rgba(0,0,0,${mode === 'dark' ? '0.08' : '0.08'})` } } }, MuiDrawer: { styleOverrides: { paper: { borderRight: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, bgcolor: mode === 'dark' ? '#0f172a' : '#ffffff' } } }, MuiPaper: { styleOverrides: { root: { borderRadius: 16, backgroundImage: 'none' } } }, MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } } } } },
  shape: { borderRadius: 12 },
});

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<'dark' | 'light'>(() => (localStorage.getItem('theme-mode') as 'dark' | 'light') || 'dark');
  const { setShowFooter, setShowHeader } = useLayout(); 
  const theme = createTheme(getDesignTokens(mode));
  const location = useLocation();
  const navigate = useNavigate();

  // 🔐 Check authentication - KEY FIX: Use 'authToken' consistently
  useEffect(() => {
    const checkSession = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken'); // ✅ Use 'authToken'
        
        if (savedUser && token) {
          const parsedUser = JSON.parse(savedUser);
          parsedUser.role = normalizeRole(parsedUser.role);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('user');
          localStorage.removeItem('authToken'); // ✅ Use 'authToken'
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Auth check failed", error);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken'); // ✅ Use 'authToken'
        setIsAuthenticated(false);
        setUser(null);
      } finally { setIsLoading(false); }
    };
    checkSession();
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const isFullPageLayout = path.startsWith('/dashboard') || path.startsWith('/staff') || path.startsWith('/client') || path === '/login';
    setShowHeader(!isFullPageLayout);
    setShowFooter(!isFullPageLayout);
  }, [location.pathname, setShowHeader, setShowFooter]);

  const toggleColorMode = () => {
    const newMode = mode === 'dark' ? 'light' : 'dark';
    setMode(newMode);
    localStorage.setItem('theme-mode', newMode);
  };

  // ⭐ Login handler - KEY FIX: Use 'authToken' consistently
  const handleLogin: LoginHandler = (userData: User, token: string) => {
    const normalizedUser: User = { ...userData, role: normalizeRole(userData.role) };
    setUser(normalizedUser);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(normalizedUser));
    localStorage.setItem('authToken', token); // ✅ Use 'authToken'
    
    const redirectMap: Record<UserRole, string> = { staff: '/staff', client: '/client', admin: '/dashboard', superadmin: '/dashboard' };
    navigate(redirectMap[normalizedUser.role] || '/dashboard', { replace: true });
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); // ✅ Use 'authToken'
    navigate('/login', { replace: true });
  };

  if (isLoading) return <Loading />;
  const normalizedUserRole = user ? normalizeRole(user.role) : undefined;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: mode === 'dark' ? '#0f172a' : '#f8fafc', fontFamily: '"Montserrat", sans-serif' }}>
        <HeaderWrapper isAuthenticated={isAuthenticated} user={user} onLogout={handleLogout} mode={mode} toggleColorMode={toggleColorMode} />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/login" element={<PublicRoute isAuthenticated={isAuthenticated}><LoginPage onLogin={handleLogin} /></PublicRoute>} />
              
              {/* Admin Routes */}
              <Route path="/dashboard/*" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} allowedRoles={['superadmin', 'admin']} userRole={normalizedUserRole}><ModernDashboardLayout user={user} onLogout={handleLogout} userRole={normalizedUserRole || 'admin'} /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="bookings" element={<BookingsPage />} />
                <Route path="clients" element={<ClientsPage />} />
                <Route path="clients/add" element={<AddNewClient />} />
                <Route path="staff" element={<StaffPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="finance" element={<FinancePage />} />
                <Route path="content" element={<ContentPage />} />
                <Route path="archive" element={<ArchivePage />} />
                <Route path="settings/*" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                  <Route path="appearance" element={<AppearanceSettings />} />
                  <Route path="security" element={<SecuritySettings />} />
                  <Route path="language" element={<LanguageSettings />} />
                  <Route path="billing" element={<BillingSettings />} />
                  <Route path="organization" element={<OrganizationSettings />} />
                  <Route path="services" element={<ServiceSettings />} />
                  <Route path="help" element={<HelpSettings />} />
                </Route>
              </Route>

              {/* Staff Routes */}
              <Route path="/staff/*" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} allowedRoles={['superadmin', 'admin', 'staff']} userRole={normalizedUserRole}><ModernDashboardLayout user={user} onLogout={handleLogout} userRole={normalizedUserRole || 'staff'} /></ProtectedRoute>}>
                <Route index element={<StaffDashboard />} />
                <Route path="tasks" element={<StaffTasks />} />
                <Route path="settings/*" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                  <Route path="appearance" element={<AppearanceSettings />} />
                </Route>
              </Route>

              {/* Client Routes */}
              <Route path="/client/*" element={<ProtectedRoute isAuthenticated={isAuthenticated} isLoading={isLoading} allowedRoles={['superadmin', 'admin', 'client']} userRole={normalizedUserRole}><ModernDashboardLayout user={user} onLogout={handleLogout} userRole={normalizedUserRole || 'client'} /></ProtectedRoute>}>
                <Route index element={<ClientDashboard />} />
                <Route path="book-service" element={<ClientBooking />} />
                <Route path="settings/*" element={<SettingsLayout />}>
                  <Route index element={<Navigate to="profile" replace />} />
                  <Route path="profile" element={<ProfileSettings />} />
                  <Route path="notifications" element={<NotificationSettings />} />
                  <Route path="appearance" element={<AppearanceSettings />} />
                </Route>
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Box>
        <FooterWrapper />
      </Box>
    </ThemeProvider>
  );
};

const HeaderWrapper = ({ isAuthenticated, user, onLogout, mode, toggleColorMode }: { isAuthenticated: boolean; user: User | null; onLogout: () => void; mode: 'dark' | 'light'; toggleColorMode: () => void }) => {
  const { showHeader } = useLayout();
  return showHeader ? <Header isAuthenticated={isAuthenticated} user={user} onLogout={onLogout} mode={mode} toggleColorMode={toggleColorMode} /> : null;
};

const FooterWrapper = () => { const { showFooter } = useLayout(); return showFooter ? <Footer /> : null; };

function App() {
  return (<LayoutProvider><BrowserRouter><AppContent /></BrowserRouter></LayoutProvider>);
}

export default App;