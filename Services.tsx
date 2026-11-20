// src/components/Services/Services.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Dialog,
  DialogContent,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  useMediaQuery,
  InputAdornment,
  Pagination,
  PaginationItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CleaningServices as ServiceIcon,
  AttachMoney as PriceIcon,
  Schedule as TimeIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { serviceAPI, preferenceAPI } from '../../API/api';

// ─── Types (matching API response structure) ─────────────────────────────────
interface Service {
  id: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  [key: string]: any;
}

interface PreferenceOption {
  id: number;
  label: string;
  value?: string;
  category: 'service_day' | 'time_slot' | 'frequency' | 'client_status';
  [key: string]: any;
}

interface ApiResponse {
  status: string;
  message?: string;
  data?: any;
}

interface ServiceFormData {
  name: string;
  description: string;
  price: string;
  duration: string;
}

interface PreferenceFormData {
  label: string;
}

type FormData = ServiceFormData & PreferenceFormData;

// ─── Inject Google Fonts ─────────────────────────────────────────────────────
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href =
  'https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=Playfair+Display:wght@600;700&display=swap';
if (!document.head.querySelector('[href*="DM+Sans"]')) {
  document.head.appendChild(fontLink);
}

// ─── Keyframe injector ───────────────────────────────────────────────────────
const injectStyles = () => {
  if (document.getElementById('svc-anim')) return;
  const s = document.createElement('style');
  s.id = 'svc-anim';
  s.textContent = `
    @keyframes svcFadeUp {
      from { opacity: 0; transform: translateY(14px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes svcSlideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to   { opacity: 1; transform: translateX(0); }
    }
    .svc-card-anim { animation: svcFadeUp 0.38s ease both; }
    .svc-row-anim  { animation: svcSlideIn 0.3s ease both; }
    .svc-card-anim:nth-child(1) { animation-delay: 0.04s; }
    .svc-card-anim:nth-child(2) { animation-delay: 0.08s; }
    .svc-card-anim:nth-child(3) { animation-delay: 0.12s; }
    .svc-card-anim:nth-child(4) { animation-delay: 0.16s; }
    .svc-card-anim:nth-child(5) { animation-delay: 0.20s; }
    .svc-card-anim:nth-child(6) { animation-delay: 0.24s; }
    .svc-row-anim:nth-child(1) { animation-delay: 0.04s; }
    .svc-row-anim:nth-child(2) { animation-delay: 0.08s; }
    .svc-row-anim:nth-child(3) { animation-delay: 0.12s; }
    .svc-row-anim:nth-child(4) { animation-delay: 0.16s; }
  `;
  document.head.appendChild(s);
};

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
  rose: '#F0194A',
  roseLight: '#FF4D75',
  rosePale: '#FFF0F3',
  roseBorder: '#FFDCE4',
  ink: '#1A1A2E',
  inkMid: '#4A4A6A',
  inkSoft: '#8888AA',
  surface: '#F7F7FB',
  white: '#FFFFFF',
  border: '#EBEBF5',
  fontDisplay: `'Playfair Display', serif`,
  fontBody: `'DM Sans', sans-serif`,
  radius: '18px',
  radiusSm: '10px',
  shadowSm: '0 2px 8px rgba(240,25,74,0.06), 0 1px 3px rgba(0,0,0,0.05)',
  shadowMd: '0 8px 24px rgba(240,25,74,0.10), 0 2px 8px rgba(0,0,0,0.06)',
  shadowLg: '0 20px 48px rgba(240,25,74,0.12), 0 4px 16px rgba(0,0,0,0.08)',
};

// ─── Main Component ──────────────────────────────────────────────────────────
const Services: React.FC = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  injectStyles();

  // ── State ─────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'services' | 'preferences'>('services');
  const [activeCategory, setActiveCategory] = useState<PreferenceOption['category']>('service_day');
  const [services, setServices] = useState<Service[]>([]);
  const [preferences, setPreferences] = useState<PreferenceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);
  const [editingItem, setEditingItem] = useState<Service | PreferenceOption | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    duration: '',
    label: '',
  });

  // ── Search & Pagination State ─────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [servicesPage, setServicesPage] = useState(1);
  const [preferencesPage, setPreferencesPage] = useState(1);
  const ITEMS_PER_PAGE = 6;
  const PREF_ITEMS_PER_PAGE = 8;

  const categoryTabs: { key: PreferenceOption['category']; label: string; shortLabel: string }[] = [
    { key: 'service_day', label: 'Preferred Service Day', shortLabel: 'Service Day' },
    { key: 'time_slot', label: 'Preferred Time Slot', shortLabel: 'Time Slot' },
    { key: 'frequency', label: 'Service Frequency', shortLabel: 'Frequency' },
    { key: 'client_status', label: 'Client Status', shortLabel: 'Status' },
  ];

  // ── Data Loading ──────────────────────────────────────────────────────────
  const loadServices = useCallback(async () => {
    setLoading(true);
    setServicesPage(1);
    try {
      const r = await serviceAPI.getAll();
      if (r.status === 'success' && r.data) setServices(r.data as Service[]);
      else setSnackbar({ open: true, message: r.message || 'Failed to load services', severity: 'error' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to load services', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPreferences = useCallback(async (cat: PreferenceOption['category']) => {
    setLoading(true);
    setPreferencesPage(1);
    try {
      const r = await preferenceAPI.getByCategory(cat);
      if (r.status === 'success' && r.data) setPreferences(r.data as PreferenceOption[]);
      else setSnackbar({ open: true, message: r.message || 'Failed to load preferences', severity: 'error' });
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to load preferences', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'services') loadServices();
    else loadPreferences(activeCategory);
  }, [activeTab, activeCategory, loadServices, loadPreferences]);

  // ── Filtering Logic ───────────────────────────────────────────────────────
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [services, searchQuery]);

  const filteredPreferences = useMemo(() => {
    if (!searchQuery.trim()) return preferences;
    const q = searchQuery.toLowerCase();
    return preferences.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        (p.value && p.value.toLowerCase().includes(q))
    );
  }, [preferences, searchQuery]);

  // ── Pagination Logic ──────────────────────────────────────────────────────
  const paginatedServices = useMemo(() => {
    const start = (servicesPage - 1) * ITEMS_PER_PAGE;
    return filteredServices.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredServices, servicesPage]);

  const paginatedPreferences = useMemo(() => {
    const start = (preferencesPage - 1) * PREF_ITEMS_PER_PAGE;
    return filteredPreferences.slice(start, start + PREF_ITEMS_PER_PAGE);
  }, [filteredPreferences, preferencesPage]);

  const servicesTotalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const preferencesTotalPages = Math.ceil(filteredPreferences.length / PREF_ITEMS_PER_PAGE);

  useEffect(() => {
    setServicesPage(1);
  }, [searchQuery, activeTab]);

  useEffect(() => {
    setPreferencesPage(1);
  }, [searchQuery, activeCategory]);

  // ── Modal Handlers ────────────────────────────────────────────────────────
  const handleOpenModal = (item?: Service | PreferenceOption) => {
    setEditingItem(item || null);
    if (item) {
      if ('name' in item && 'price' in item) {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          price: item.price?.toString() || '',
          duration: item.duration?.toString() || '',
          label: '',
        });
      } else {
        setFormData({
          label: item.label || '',
          name: '',
          description: '',
          price: '',
          duration: '',
        });
      }
    } else {
      setFormData({ name: '', description: '', price: '', duration: '', label: '' });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', duration: '', label: '' });
  };

  // ── Submit Handler ────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (activeTab === 'services') {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price) || 0,
          duration: parseInt(formData.duration) || 0,
        };
        if (!payload.name) {
          setSnackbar({ open: true, message: 'Service name is required', severity: 'error' });
          setSubmitting(false);
          return;
        }
        let response: ApiResponse;
        if (editingItem && 'id' in editingItem && 'name' in editingItem) {
          response = await serviceAPI.update(editingItem.id, payload);
          if (response.status === 'success') {
            setSnackbar({ open: true, message: response.message || 'Service updated!', severity: 'success' });
            await loadServices();
          } else {
            setSnackbar({ open: true, message: response.message || 'Failed to update service', severity: 'error' });
          }
        } else {
          response = await serviceAPI.create(payload);
          if (response.status === 'success') {
            setSnackbar({ open: true, message: response.message || 'Service created!', severity: 'success' });
            await loadServices();
          } else {
            setSnackbar({ open: true, message: response.message || 'Failed to create service', severity: 'error' });
          }
        }
      } else {
        const payload = {
          label: formData.label.trim(),
          value: formData.label.trim().toLowerCase().replace(/\s+/g, '-'),
        };
        if (!payload.label) {
          setSnackbar({ open: true, message: 'Label is required', severity: 'error' });
          setSubmitting(false);
          return;
        }
        let response: ApiResponse;
        if (editingItem && 'id' in editingItem && 'label' in editingItem) {
          response = await preferenceAPI.update(editingItem.id, activeCategory, payload);
          if (response.status === 'success') {
            setSnackbar({ open: true, message: response.message || 'Option updated!', severity: 'success' });
            await loadPreferences(activeCategory);
          } else {
            setSnackbar({ open: true, message: response.message || 'Failed to update option', severity: 'error' });
          }
        } else {
          response = await preferenceAPI.create(activeCategory, payload);
          if (response.status === 'success') {
            setSnackbar({ open: true, message: response.message || 'Option created!', severity: 'success' });
            await loadPreferences(activeCategory);
          } else {
            setSnackbar({ open: true, message: response.message || 'Failed to create option', severity: 'error' });
          }
        }
      }
      handleCloseModal();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Operation failed', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete Handler ────────────────────────────────────────────────────────
  const handleDeleteClick = (id: number, name: string) => {
    setItemToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      let response: ApiResponse;
      if (activeTab === 'services') {
        response = await serviceAPI.delete(itemToDelete.id);
        if (response.status === 'success') {
          setSnackbar({ open: true, message: response.message || 'Service deleted!', severity: 'success' });
          await loadServices();
        } else {
          setSnackbar({ open: true, message: response.message || 'Failed to delete', severity: 'error' });
        }
      } else {
        response = await preferenceAPI.delete(itemToDelete.id, activeCategory);
        if (response.status === 'success') {
          setSnackbar({ open: true, message: response.message || 'Option deleted!', severity: 'success' });
          await loadPreferences(activeCategory);
        } else {
          setSnackbar({ open: true, message: response.message || 'Failed to delete', severity: 'error' });
        }
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Delete failed', severity: 'error' });
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  // ── Shared Styles ─────────────────────────────────────────────────────────
  const bg = isDark ? '#13131F' : T.surface;
  const cardBg = isDark ? '#1E1E2F' : T.white;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : T.border;
  const textPrimary = isDark ? '#F0F0FF' : T.ink;
  const textSecondary = isDark ? 'rgba(255,255,255,0.45)' : T.inkSoft;

  // ── Reusable Styled Button ────────────────────────────────────────────────
  const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <Button
      variant="contained"
      startIcon={<AddIcon sx={{ fontSize: '17px !important' }} />}
      onClick={onClick}
      size={isMobile ? 'small' : 'medium'}
      sx={{
        background: `linear-gradient(135deg, ${T.rose} 0%, ${T.roseLight} 100%)`,
        color: '#fff',
        fontFamily: T.fontBody,
        fontWeight: 600,
        fontSize: isMobile ? 13 : 14,
        textTransform: 'none',
        borderRadius: '50px',
        px: isMobile ? 2 : 2.5,
        py: isMobile ? 0.8 : 1.2,
        boxShadow: '0 4px 16px rgba(240,25,74,0.35)',
        whiteSpace: 'nowrap',
        transition: 'all 0.2s ease',
        '&:hover': {
          background: `linear-gradient(135deg, ${T.roseLight} 0%, #FF6B90 100%)`,
          transform: 'translateY(-1px)',
          boxShadow: '0 6px 20px rgba(240,25,74,0.45)',
        },
        '&:active': { transform: 'translateY(0)' },
      }}
    >
      {label}
    </Button>
  );

  // ── Section Header ────────────────────────────────────────────────────────
  const SectionHeader = ({
    title,
    count,
    addLabel,
    onAdd,
  }: {
    title: string;
    count: number;
    addLabel: string;
    onAdd: () => void;
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Typography
          sx={{
            fontFamily: T.fontDisplay,
            fontSize: isMobile ? 20 : 24,
            fontWeight: 700,
            color: textPrimary,
            letterSpacing: '-0.3px',
            lineHeight: 1.2,
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            background: T.rose,
            color: '#fff',
            fontFamily: T.fontBody,
            fontWeight: 700,
            fontSize: 12,
            width: 24,
            height: 24,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {count}
        </Box>
      </Box>
      <AddButton label={addLabel} onClick={onAdd} />
    </Box>
  );

  // ── Empty State ───────────────────────────────────────────────────────────
  const EmptyState = ({ message }: { message: string }) => (
    <Box
      sx={{
        textAlign: 'center',
        py: 10,
        background: cardBg,
        border: `1.5px dashed ${borderColor}`,
        borderRadius: T.radius,
      }}
    >
      <ServiceIcon sx={{ fontSize: 56, color: T.rosePale, mb: 2, opacity: 0.8 }} />
      <Typography sx={{ fontFamily: T.fontBody, color: textSecondary, fontSize: 15 }}>
        {message}
      </Typography>
    </Box>
  );

  // ── Custom Pagination Component ───────────────────────────────────────────
  const StyledPagination = ({
    count,
    page,
    onChange,
    isSmall = false,
  }: {
    count: number;
    page: number;
    onChange: (e: React.ChangeEvent<unknown>, value: number) => void;
    isSmall?: boolean;
  }) => (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
      <Pagination
        count={count}
        page={page}
        onChange={onChange}
        size={isSmall || isMobile ? 'small' : 'medium'}
        showFirstButton={!isMobile}
        showLastButton={!isMobile}
        siblingCount={isMobile ? 0 : 1}
        boundaryCount={isMobile ? 1 : 2}
        renderItem={(item) => (
          <PaginationItem
            {...item}
            slots={{
              previous: KeyboardArrowLeft,
              next: KeyboardArrowRight,
            }}
            sx={{
              fontFamily: T.fontBody,
              fontWeight: 500,
              fontSize: isSmall || isMobile ? 12 : 13,
              color: textSecondary,
              '&.Mui-selected': {
                background: `linear-gradient(135deg, ${T.rose}, ${T.roseLight})`,
                color: '#fff',
                fontWeight: 600,
                '&:hover': {
                  background: `linear-gradient(135deg, ${T.roseLight}, #FF6B90)`,
                },
              },
              '&:hover:not(.Mui-selected)': {
                background: isDark ? 'rgba(255,255,255,0.08)' : T.rosePale,
                color: T.rose,
              },
              borderRadius: '8px',
              margin: '0 2px',
              minWidth: isSmall || isMobile ? 32 : 38,
              height: isSmall || isMobile ? 32 : 38,
            }}
          />
        )}
      />
    </Box>
  );

  // ── Shared TextField Styles ───────────────────────────────────────────────
  const inputSx = (isDark: boolean, borderColor: string, T: any) => ({
    '& .MuiInputBase-root': {
      fontFamily: T.fontBody,
      fontSize: 14.5,
      borderRadius: T.radiusSm,
      background: isDark ? 'rgba(255,255,255,0.04)' : T.surface,
      transition: 'border-color 0.2s',
    },
    '& .MuiOutlinedInput-notchedOutline': { borderColor: borderColor },
    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: T.rose },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: T.rose,
      borderWidth: '1.5px',
    },
    '& .MuiInputLabel-root': { fontFamily: T.fontBody, fontSize: 14, color: T.inkSoft },
    '& .MuiInputLabel-root.Mui-focused': { color: T.rose },
    '& .MuiFormHelperText-root': { fontFamily: T.fontBody, fontSize: 12.5, mt: 0.75 },
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        fontFamily: T.fontBody,
        background: bg,
        minHeight: '100vh',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: -200,
          right: -200,
          width: 500,
          height: 500,
          background: `radial-gradient(circle, rgba(240,25,74,0.07) 0%, transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 0,
        },
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        {/* ── Page Header ── */}
        <Box sx={{ mb: { xs: 3, md: 4 } }}>
          <Typography
            sx={{
              fontFamily: T.fontDisplay,
              fontSize: { xs: 26, sm: 32, md: 38 },
              fontWeight: 500,
              color: textPrimary,
              letterSpacing: '-0.5px',
              lineHeight: 1.15,
              mb: 0.75,
            }}
          >
            Services &amp; Preferences
          </Typography>
          <Typography sx={{ fontFamily: T.fontBody, color: textSecondary, fontSize: { xs: 13.5, sm: 15 } }}>
            Manage cleaning services and client preference dropdowns
          </Typography>
        </Box>

        {/* ── Main Tabs ── */}
        <Box sx={{ borderBottom: `2px solid ${borderColor}`, mb: { xs: 3, md: 4 } }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              minHeight: 44,
              '& .MuiTabs-indicator': {
                background: T.rose,
                height: 2,
                borderRadius: '2px 2px 0 0',
              },
              '& .MuiTab-root': {
                fontFamily: T.fontBody,
                fontWeight: 500,
                fontSize: { xs: 13.5, sm: 15 },
                textTransform: 'none',
                color: textSecondary,
                minHeight: 44,
                px: { xs: 1.5, sm: 2.5 },
                transition: 'color 0.2s',
                '&.Mui-selected': { color: T.rose, fontWeight: 600 },
              },
            }}
          >
            <Tab label="Cleaning Services" value="services" />
            <Tab label="Client Form Dropdowns" value="preferences" />
          </Tabs>
        </Box>

        {/* ── Global Search Bar ── */}
        <Box sx={{ mb: { xs: 3, md: 4 }, maxWidth: '600px' }}>
          <TextField
            fullWidth
            placeholder={`Search ${activeTab === 'services' ? 'services' : 'options'}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: textSecondary, fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    sx={{ color: textSecondary, '&:hover': { color: T.rose } }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            variant="outlined"
            sx={inputSx(isDark, borderColor, T)}
          />
        </Box>

        {/* ════════════════════════════════════════
            SERVICES TAB
            ════════════════════════════════════════ */}
        {activeTab === 'services' && (
          <>
            <SectionHeader
              title="All Services"
              count={filteredServices.length}
              addLabel={isMobile ? 'Add Service' : 'Add New Service'}
              onAdd={() => handleOpenModal()}
            />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: T.rose }} />
              </Box>
            ) : filteredServices.length === 0 ? (
              <EmptyState
                message={searchQuery ? `No services found matching "${searchQuery}"` : 'No services yet. Add your first one!'}
              />
            ) : (
              <>
                <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
                  {paginatedServices.map((service) => (
                    <Grid key={service.id}>
                      <Card
                        className="svc-card-anim"
                        elevation={0}
                        sx={{
                          background: cardBg,
                          border: `1.5px solid ${borderColor}`,
                          borderRadius: T.radius,
                          overflow: 'hidden',
                          position: 'relative',
                          cursor: 'default',
                          transition: 'box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '3px',
                            background: `linear-gradient(90deg, ${T.rose}, ${T.roseLight})`,
                            transform: 'scaleX(0)',
                            transformOrigin: 'left',
                            transition: 'transform 0.3s ease',
                          },
                          '&:hover': {
                            boxShadow: T.shadowMd,
                            transform: 'translateY(-4px)',
                            borderColor: T.roseBorder,
                            '&::before': { transform: 'scaleX(1)' },
                          },
                        }}
                      >
                        <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
                          <Typography
                            sx={{
                              fontFamily: T.fontBody,
                              fontWeight: 700,
                              fontSize: { xs: 16, sm: 17 },
                              color: textPrimary,
                              mb: 0.75,
                              letterSpacing: '-0.2px',
                            }}
                          >
                            {service.name}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: T.fontBody,
                              fontSize: { xs: 13, sm: 13.5 },
                              color: textSecondary,
                              lineHeight: 1.55,
                              mb: 2.5,
                              minHeight: 40,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {service.description || 'No description provided'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                background: T.rose,
                                color: '#fff',
                                borderRadius: '50px',
                                px: 1.5,
                                py: 0.6,
                                fontSize: 13,
                                fontWeight: 600,
                                fontFamily: T.fontBody,
                              }}
                            >
                              <PriceIcon sx={{ fontSize: '13px !important' }} />
                              ${parseFloat((service.price ?? 0).toString()).toFixed(2)}
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.75,
                                background: 'transparent',
                                color: isDark ? 'rgba(255,255,255,0.6)' : T.inkMid,
                                border: `1.5px solid ${borderColor}`,
                                borderRadius: '50px',
                                px: 1.5,
                                py: 0.6,
                                fontSize: 13,
                                fontWeight: 500,
                                fontFamily: T.fontBody,
                              }}
                            >
                              <TimeIcon sx={{ fontSize: '13px !important' }} />
                              {service.duration || 0} min
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              borderTop: `1px solid ${borderColor}`,
                              pt: 2,
                            }}
                          >
                            <Button
                              size="small"
                              startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
                              onClick={() => handleOpenModal(service)}
                              sx={{
                                fontFamily: T.fontBody,
                                fontWeight: 600,
                                fontSize: 13,
                                color: T.rose,
                                textTransform: 'none',
                                borderRadius: T.radiusSm,
                                px: 1.5,
                                py: 0.7,
                                '&:hover': { background: T.rosePale },
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteClick(service.id, service.name)}
                              sx={{
                                ml: 'auto',
                                color: textSecondary,
                                borderRadius: T.radiusSm,
                                '&:hover': { background: '#FFF0F0', color: '#D93025' },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: '18px !important' }} />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                {servicesTotalPages > 1 && (
                  <StyledPagination
                    count={servicesTotalPages}
                    page={servicesPage}
                    onChange={(_, page) => {
                      setServicesPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ════════════════════════════════════════
            PREFERENCES TAB
            ════════════════════════════════════════ */}
        {activeTab === 'preferences' && (
          <>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                background: cardBg,
                border: `1.5px solid ${borderColor}`,
                borderRadius: '50px',
                p: '4px',
                mb: 3,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                flexWrap: { xs: 'nowrap', md: 'wrap' },
              }}
            >
              {categoryTabs.map((tab) => {
                const isActive = activeCategory === tab.key;
                return (
                  <Button
                    key={tab.key}
                    onClick={() => setActiveCategory(tab.key)}
                    sx={{
                      fontFamily: T.fontBody,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: { xs: 12.5, sm: 13.5 },
                      textTransform: 'none',
                      borderRadius: '50px',
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      color: isActive ? '#fff' : textSecondary,
                      background: isActive
                        ? `linear-gradient(135deg, ${T.rose}, ${T.roseLight})`
                        : 'transparent',
                      boxShadow: isActive ? '0 3px 12px rgba(240,25,74,0.3)' : 'none',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: isActive
                          ? `linear-gradient(135deg, ${T.roseLight}, #FF6B90)`
                          : T.rosePale,
                        color: isActive ? '#fff' : T.rose,
                      },
                    }}
                  >
                    {isMobile ? tab.shortLabel : tab.label}
                  </Button>
                );
              })}
            </Box>

            <SectionHeader
              title={categoryTabs.find((t) => t.key === activeCategory)?.label || ''}
              count={filteredPreferences.length}
              addLabel={isMobile ? 'Add Option' : 'Add New Option'}
              onAdd={() => handleOpenModal()}
            />
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress sx={{ color: T.rose }} />
              </Box>
            ) : filteredPreferences.length === 0 ? (
              <EmptyState
                message={searchQuery ? `No options found matching "${searchQuery}"` : 'No options yet in this category. Add one!'}
              />
            ) : (
              <>
                <Paper
                  elevation={0}
                  sx={{
                    background: cardBg,
                    border: `1.5px solid ${borderColor}`,
                    borderRadius: T.radius,
                    overflow: 'hidden',
                    boxShadow: T.shadowSm,
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr auto', sm: '1fr 1fr auto' },
                      px: { xs: 2, sm: 3 },
                      py: 1.5,
                      background: isDark ? 'rgba(255,255,255,0.04)' : T.surface,
                      borderBottom: `1.5px solid ${borderColor}`,
                      gap: 2,
                    }}
                  >
                    {['Display Label', 'Value (used in code)', 'Actions'].map((h, i) => (
                      <Typography
                        key={h}
                        sx={{
                          fontFamily: T.fontBody,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: textSecondary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.8px',
                          display: i === 1 ? { xs: 'none', sm: 'block' } : 'block',
                          textAlign: i === 2 ? 'right' : 'left',
                        }}
                      >
                        {h}
                      </Typography>
                    ))}
                  </Box>
                  {paginatedPreferences.map((option) => (
                    <Box
                      key={option.id}
                      className="svc-row-anim"
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr auto', sm: '1fr 1fr auto' },
                        px: { xs: 2, sm: 3 },
                        py: 2,
                        borderBottom: `1px solid ${borderColor}`,
                        alignItems: 'center',
                        gap: 2,
                        transition: 'background 0.15s',
                        '&:last-child': { borderBottom: 'none' },
                        '&:hover': { background: isDark ? 'rgba(240,25,74,0.05)' : T.rosePale },
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: T.fontBody,
                          fontSize: { xs: 14, sm: 14.5 },
                          fontWeight: 500,
                          color: textPrimary,
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: isDark ? 'rgba(255,255,255,0.06)' : T.surface,
                            border: `1.5px solid ${borderColor}`,
                            borderRadius: '6px',
                            px: 1.5,
                            py: 0.4,
                            fontFamily: `'DM Mono', 'Courier New', monospace`,
                            fontSize: 13,
                            fontWeight: 600,
                            color: isDark ? 'rgba(255,255,255,0.55)' : T.inkMid,
                            letterSpacing: '0.2px',
                          }}
                        >
                          {option.value || option.label.toLowerCase().replace(/\s+/g, '-')}
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenModal(option)}
                          sx={{
                            color: textSecondary,
                            borderRadius: T.radiusSm,
                            width: 34,
                            height: 34,
                            '&:hover': { background: T.rosePale, color: T.rose },
                          }}
                        >
                          <EditIcon sx={{ fontSize: '16px !important' }} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(option.id, option.label)}
                          sx={{
                            color: textSecondary,
                            borderRadius: T.radiusSm,
                            width: 34,
                            height: 34,
                            '&:hover': { background: '#FFF0F0', color: '#D93025' },
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: '16px !important' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Paper>
                {preferencesTotalPages > 1 && (
                  <StyledPagination
                    count={preferencesTotalPages}
                    page={preferencesPage}
                    onChange={(_, page) => {
                      setPreferencesPage(page);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    isSmall
                  />
                )}
              </>
            )}
          </>
        )}

        {/* ════════════════════════════════════════
            ADD / EDIT DIALOG
            ════════════════════════════════════════ */}
        <Dialog
          open={modalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          fullScreen={isMobile}
          PaperProps={{
            elevation: 0,
            sx: {
              background: cardBg,
              border: isMobile ? 'none' : `1.5px solid ${borderColor}`,
              borderRadius: isMobile ? 0 : T.radius,
              boxShadow: T.shadowLg,
              overflow: 'hidden',
              fontFamily: T.fontBody,
            },
          }}
        >
          <Box
            sx={{
              px: { xs: 2.5, sm: 3 },
              py: 2.5,
              borderBottom: `1px solid ${borderColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: isDark ? 'rgba(255,255,255,0.03)' : T.surface,
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: T.fontDisplay,
                  fontSize: { xs: 18, sm: 20 },
                  fontWeight: 700,
                  color: textPrimary,
                  letterSpacing: '-0.3px',
                }}
              >
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'services' ? 'Service' : 'Option'}
              </Typography>
              <Typography sx={{ fontFamily: T.fontBody, fontSize: 13, color: textSecondary, mt: 0.3 }}>
                {editingItem ? 'Update the details below' : 'Fill in the details to create a new entry'}
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseModal}
              sx={{ color: textSecondary, borderRadius: T.radiusSm, '&:hover': { background: T.rosePale, color: T.rose } }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent sx={{ px: { xs: 2.5, sm: 3 }, py: 3 }}>
            {activeTab === 'services' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {[
                  {
                    label: 'Service Name *',
                    field: 'name',
                    multiline: false,
                    type: 'text',
                    placeholder: 'e.g. Deep Cleaning',
                  },
                  {
                    label: 'Description',
                    field: 'description',
                    multiline: true,
                    rows: 3,
                    type: 'text',
                    placeholder: 'Brief description of this service...',
                  },
                ].map(({ label, field, multiline, rows, type, placeholder }) => (
                  <TextField
                    key={field}
                    label={label}
                    placeholder={placeholder}
                    value={(formData as any)[field]}
                    onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                    fullWidth
                    multiline={multiline}
                    rows={rows}
                    type={type}
                    disabled={submitting}
                    variant="outlined"
                    sx={inputSx(isDark, borderColor, T)}
                  />
                ))}
                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  {[
                    { label: 'Price ($)', field: 'price', placeholder: '0.00' },
                    { label: 'Duration (minutes)', field: 'duration', placeholder: '60' },
                  ].map(({ label, field, placeholder }) => (
                    <TextField
                      key={field}
                      label={label}
                      placeholder={placeholder}
                      type="number"
                      value={(formData as any)[field]}
                      onChange={(e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }))}
                      fullWidth
                      disabled={submitting}
                      inputProps={{ min: 0, step: field === 'price' ? 0.01 : 1 }}
                      sx={inputSx(isDark, borderColor, T)}
                    />
                  ))}
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Option Label *"
                  placeholder="e.g. Monday"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  fullWidth
                  disabled={submitting}
                  helperText='Value will be auto-generated (e.g. "Any Day" → "any-day")'
                  sx={inputSx(isDark, borderColor, T)}
                />
                {formData.label && (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      background: isDark ? 'rgba(240,25,74,0.08)' : T.rosePale,
                      border: `1.5px solid ${T.roseBorder}`,
                      borderRadius: T.radiusSm,
                      px: 2,
                      py: 1.25,
                    }}
                  >
                    <Typography sx={{ fontFamily: T.fontBody, fontSize: 13, color: textSecondary }}>
                      Auto-generated value:
                    </Typography>
                    <Box
                      sx={{
                        fontFamily: `'DM Mono', 'Courier New', monospace`,
                        fontSize: 13,
                        fontWeight: 700,
                        color: T.rose,
                        background: isDark ? 'rgba(240,25,74,0.15)' : '#fff',
                        border: `1.5px solid ${T.roseBorder}`,
                        borderRadius: '6px',
                        px: 1,
                        py: 0.25,
                      }}
                    >
                      {formData.label.toLowerCase().replace(/\s+/g, '-')}
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <Box
            sx={{
              px: { xs: 2.5, sm: 3 },
              py: 2.5,
              borderTop: `1px solid ${borderColor}`,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
              background: isDark ? 'rgba(255,255,255,0.02)' : T.surface,
            }}
          >
            <Button
              onClick={handleCloseModal}
              disabled={submitting}
              sx={{
                fontFamily: T.fontBody,
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                color: textSecondary,
                borderRadius: T.radiusSm,
                px: 2.5,
                '&:hover': { background: isDark ? 'rgba(255,255,255,0.06)' : T.border },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitting}
              sx={{
                fontFamily: T.fontBody,
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                background: `linear-gradient(135deg, ${T.rose}, ${T.roseLight})`,
                color: '#fff',
                borderRadius: T.radiusSm,
                px: 3,
                minWidth: 110,
                boxShadow: '0 4px 14px rgba(240,25,74,0.35)',
                '&:hover': {
                  background: `linear-gradient(135deg, ${T.roseLight}, #FF6B90)`,
                  boxShadow: '0 6px 20px rgba(240,25,74,0.45)',
                },
                '&.Mui-disabled': { background: isDark ? 'rgba(255,255,255,0.1)' : '#E0E0E0' },
              }}
            >
              {submitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : editingItem ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Dialog>

        {/* ════════════════════════════════════════
            DELETE DIALOG
            ════════════════════════════════════════ */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            elevation: 0,
            sx: {
              background: cardBg,
              border: `1.5px solid ${borderColor}`,
              borderRadius: T.radius,
              boxShadow: T.shadowLg,
            },
          }}
        >
          <Box sx={{ px: 3, pt: 3.5, pb: 1 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                background: '#FFF0F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <DeleteIcon sx={{ color: '#D93025', fontSize: 26 }} />
            </Box>
            <Typography
              sx={{
                fontFamily: T.fontDisplay,
                fontSize: 20,
                fontWeight: 700,
                color: textPrimary,
                mb: 1,
              }}
            >
              Delete Confirmation
            </Typography>
            <Typography sx={{ fontFamily: T.fontBody, fontSize: 14.5, color: textSecondary, lineHeight: 1.6 }}>
              Are you sure you want to delete{' '}
              <Box component="span" sx={{ color: textPrimary, fontWeight: 600 }}>
                {itemToDelete?.name}
              </Box>
              ? This action{' '}
              <Box component="span" sx={{ color: '#D93025', fontWeight: 600 }}>
                cannot be undone
              </Box>
              .
            </Typography>
          </Box>
          <Box
            sx={{
              px: 3,
              py: 2.5,
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1.5,
              borderTop: `1px solid ${borderColor}`,
              mt: 2,
            }}
          >
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              disabled={submitting}
              sx={{
                fontFamily: T.fontBody,
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                color: textSecondary,
                borderRadius: T.radiusSm,
                px: 2.5,
                '&:hover': { background: isDark ? 'rgba(255,255,255,0.06)' : T.border },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDeleteConfirm}
              disabled={submitting}
              sx={{
                fontFamily: T.fontBody,
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                background: '#D93025',
                color: '#fff',
                borderRadius: T.radiusSm,
                px: 3,
                boxShadow: '0 4px 14px rgba(217,48,37,0.35)',
                '&:hover': { background: '#C62828', boxShadow: '0 6px 18px rgba(217,48,37,0.45)' },
              }}
            >
              {submitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Delete'}
            </Button>
          </Box>
        </Dialog>

        {/* ── Snackbar ── */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
            severity={snackbar.severity}
            variant="filled"
            sx={{
              fontFamily: T.fontBody,
              borderRadius: T.radiusSm,
              boxShadow: T.shadowMd,
              '& .MuiAlert-filledSuccess': { background: '#1B873A' },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Services;