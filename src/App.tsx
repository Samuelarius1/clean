import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { MessageCircle } from 'lucide-react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import useSWR from 'swr'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { PageFallback } from './components/PageFallback'
import { ConsentBanner } from './components/ConsentBanner'
import { ScrollToTopButton } from './components/ScrollToTopButton'
import { getPublicSettings, trackPageView } from './services/api'

const HomePage = lazy(() => import('./pages/HomePage').then(module => ({ default: module.HomePage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })))
const ServicesPage = lazy(() => import('./pages/ServicesPage').then(module => ({ default: module.ServicesPage })))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage').then(module => ({ default: module.ServiceDetailPage })))
const BookingPage = lazy(() => import('./pages/BookingPage').then(module => ({ default: module.BookingPage })))
const BookingTrackingPage = lazy(() => import('./pages/BookingTrackingPage').then(module => ({ default: module.BookingTrackingPage })))
const ContactPage = lazy(() => import('./pages/ContactPage').then(module => ({ default: module.ContactPage })))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then(module => ({ default: module.PrivacyPage })))
const CustomerAccountPage = lazy(() => import('./pages/CustomerAccountPage').then(module => ({ default: module.CustomerAccountPage })))
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage').then(module => ({ default: module.AdminLoginPage })))
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })))
const AdminManagePage = lazy(() => import('./pages/AdminManagePage').then(module => ({ default: module.AdminManagePage })))
const AdminPrintableReportPage = lazy(() => import('./pages/AdminPrintableReportPage').then(module => ({ default: module.AdminPrintableReportPage })))
const NewsletterPreferencesPage = lazy(() => import('./pages/NewsletterPreferencesPage').then(module => ({ default: module.NewsletterPreferencesPage })))

export function App() {
  const [mode, setMode] = useState<'dark' | 'light'>(() => localStorage.getItem('cleanpro-theme') === 'light' ? 'light' : 'dark')
  const location = useLocation()
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: '#E923DA' }, background: { default: mode === 'dark' ? '#052361' : '#f7f8fc', paper: mode === 'dark' ? '#101f38' : '#fff' } },
    typography: { fontFamily: 'DM Sans, sans-serif', button: { textTransform: 'none', fontWeight: 700 } },
    shape: { borderRadius: 14 },
  }), [mode])

  const isAdminRoute = location.pathname.startsWith('/admin')
  const { data: publicSettings } = useSWR(!isAdminRoute ? 'public-settings' : null, getPublicSettings)
  useSWR(!isAdminRoute && localStorage.getItem('cleanpro-analytics-consent') === 'accepted' ? `page-view:${location.pathname}` : null, () => trackPageView(location.pathname), { revalidateOnFocus: false, dedupingInterval: 30_000 })

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    const businessName = publicSettings?.business_name || 'Faith’s Walk CleanPro'
    const pageName = location.pathname === '/' ? businessName : `${location.pathname.split('/').filter(Boolean).pop()?.replaceAll('-', ' ')} | ${businessName}`
    document.title = pageName
  }, [location.pathname, publicSettings?.business_name])

  const toggleTheme = () => setMode(current => {
    const next = current === 'dark' ? 'light' : 'dark'
    localStorage.setItem('cleanpro-theme', next)
    document.documentElement.dataset.theme = next
    return next
  })

  const routes = <AnimatePresence mode="wait"><Suspense fallback={<PageFallback />}><Routes location={location} key={location.pathname}>
    <Route path="/" element={<HomePage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/services" element={<ServicesPage />} />
    <Route path="/services/:slug" element={<ServiceDetailPage />} />
    <Route path="/booking" element={<BookingPage />} />
    <Route path="/tracking" element={<BookingTrackingPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/privacy" element={<PrivacyPage />} />
    <Route path="/unsubscribe" element={<NewsletterPreferencesPage />} />
    <Route path="/account" element={<CustomerAccountPage />} />
    <Route path="/admin/login" element={<AdminLoginPage />} />
    <Route path="/admin/reports/print" element={<AdminPrintableReportPage />} />
    <Route path="/admin/manage/:resource" element={<AdminManagePage />} />
    <Route path="/admin" element={<AdminDashboardPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes></Suspense></AnimatePresence>

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-shell" data-theme={mode}>
        {isAdminRoute ? routes : <>
          <Header mode={mode} onToggleTheme={toggleTheme} />
          {routes}
          <Footer />
          <ConsentBanner />
          <ScrollToTopButton />
          {publicSettings?.whatsapp_url ? <a className="whatsapp-float" href={publicSettings.whatsapp_url} target="_blank" rel="noreferrer" aria-label="Message Faith’s Walk CleanPro on WhatsApp"><MessageCircle size={21} /></a> : <Link className="whatsapp-float" to="/contact" aria-label="Contact Faith’s Walk CleanPro"><MessageCircle size={21} /></Link>}
        </>}
      </div>
    </ThemeProvider>
  )
}
