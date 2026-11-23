const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost/faith-cleanpro/backend').replace(/\/$/, '')

type ApiEnvelope<T> = { status: 'success' | 'error'; data?: T; message?: string }

export class ApiError extends Error {
  constructor(message: string, public readonly statusCode: number) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    credentials: 'include',
  })
  const result = await response.json().catch(() => null) as ApiEnvelope<T> | null
  if (!response.ok || result?.status !== 'success') {
    throw new ApiError(result?.message || `Request failed (${response.status})`, response.status)
  }
  return result.data as T
}

export type CleaningService = {
  id: number
  name: string
  slug: string
  category: string
  summary: string
  description: string
  features: string[]
  price_from: number | null
  image_url: string | null
  featured: boolean
}

export type BookingPayload = {
  service_id: number
  name: string
  email: string
  phone: string
  address: string
  preferred_date: string
  preferred_time: string
  notes: string
}

export const getServices = () => apiRequest<CleaningService[]>('/routes/services.php')
export const createBooking = (payload: BookingPayload) => apiRequest<{ reference: string }>('/routes/bookings.php', { method: 'POST', body: JSON.stringify(payload) })
export type BookingLookup = { reference: string; preferred_date: string; preferred_time: string; status: string; quoted_amount: number | null; created_at: string; service_name: string }
export const lookupBooking = (reference: string, email: string) => apiRequest<BookingLookup>('/routes/booking-lookup.php', { method: 'POST', body: JSON.stringify({ reference, email }) })
export const sendContactMessage = (payload: { name: string; email: string; subject: string; message: string }) => apiRequest<{ id: number }>('/routes/messages.php', { method: 'POST', body: JSON.stringify(payload) })
export const subscribeToNewsletter = (email: string) => apiRequest<{ subscribed: boolean; unsubscribe_token: string }>('/routes/newsletter.php', { method: 'POST', body: JSON.stringify({ email }) })
export const unsubscribeFromNewsletter = (token: string) => apiRequest<{ updated: boolean }>('/routes/newsletter-unsubscribe.php', { method: 'POST', body: JSON.stringify({ token }) })
export type FAQ = { id: number; category: string; question: string; answer: string }
export const getFaqs = () => apiRequest<FAQ[]>('/routes/faqs.php')
export type PublicSettings = Partial<Record<'business_name' | 'home_hero_eyebrow' | 'home_hero_title' | 'home_hero_accent' | 'home_hero_description' | 'about_intro_title' | 'about_intro_body' | 'contact_email' | 'contact_phone' | 'business_address' | 'whatsapp_url' | 'instagram_url' | 'facebook_url', string>>
export const getPublicSettings = () => apiRequest<PublicSettings>('/routes/settings.php')
export type PublicTestimonial = { id: number; customer_name: string; quote: string; rating: number; profile_image: string | null }
export const getTestimonials = () => apiRequest<PublicTestimonial[]>('/routes/testimonials.php')
export type GalleryPair = { id: number; title: string; description: string; before_image_path: string; after_image_path: string; category: string }
export const getGallery = () => apiRequest<GalleryPair[]>('/routes/gallery.php')

export type Customer = { id: number; email: string; name: string; phone: string }
export type CustomerSession = { customer: Customer; csrfToken: string }
export type CustomerBooking = { reference: string; preferred_date: string; preferred_time: string; status: string; created_at: string; service_name: string }
let customerCsrfToken = ''
export async function customerAuth(payload: { action: 'login' | 'register'; email: string; password: string; name?: string; phone?: string }) {
  const result = await apiRequest<CustomerSession>('/routes/customer-auth.php', { method: 'POST', body: JSON.stringify(payload) })
  customerCsrfToken = result.csrfToken
  return result.customer
}
export async function getCustomerSession() {
  const result = await apiRequest<CustomerSession>('/routes/customer-session.php')
  customerCsrfToken = result.csrfToken
  return result.customer
}
export async function updateCustomerProfile(payload: { name: string; phone: string }) {
  const result = await apiRequest<{ customer: Customer }>('/routes/customer-profile.php', { method: 'POST', headers: { 'X-CSRF-Token': customerCsrfToken }, body: JSON.stringify(payload) })
  return result.customer
}
export const getCustomerBookings = () => apiRequest<CustomerBooking[]>('/routes/customer-bookings.php')
export async function customerLogout() {
  await apiRequest<{ signedOut: boolean }>('/routes/customer-session.php', { method: 'POST', headers: { 'X-CSRF-Token': customerCsrfToken } })
  customerCsrfToken = ''
}

export type AdminSession = { admin: { id: number; email: string; name: string }; csrfToken: string }
export type AnalyticsSummary = { days: number; totals: { page_views: number; unique_visitors: number }; bookings: { total: number; pending: number; confirmed: number; completed: number }; customerAccounts: number; daily: Array<{ date: string; page_views: number; unique_visitors: number }>; topPages: Array<{ page_path: string; page_views: number; unique_visitors: number }> }
export type AdminBooking = CustomerBooking & { id: number; reference: string; customer_name: string; customer_email: string; customer_phone: string; service_name: string; quoted_amount: number | null }
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected'
export type AdminResource = 'services' | 'faqs' | 'gallery' | 'testimonials' | 'messages' | 'customers'
let adminCsrfToken = ''
export async function adminLogin(email: string, password: string) {
  const result = await apiRequest<AdminSession>('/routes/admin-login.php', { method: 'POST', body: JSON.stringify({ email, password }) })
  adminCsrfToken = result.csrfToken
  return result.admin
}
export async function getAdminSession() {
  const result = await apiRequest<AdminSession>('/routes/admin-session.php')
  adminCsrfToken = result.csrfToken
  return result.admin
}
export const getAdminAnalytics = (days: number) => apiRequest<AnalyticsSummary>(`/routes/admin-analytics.php?days=${days}`)
export const getAdminBookings = () => apiRequest<AdminBooking[]>('/routes/admin-bookings.php')
export const setAdminBookingStatus = (id: number, status: BookingStatus) => apiRequest<{ id: number; status: BookingStatus }>('/routes/admin-booking-status.php', { method: 'POST', headers: { 'X-CSRF-Token': adminCsrfToken }, body: JSON.stringify({ id, status }) })
export const updateAdminBooking = (id: number, fields: { preferred_date?: string; preferred_time?: string; quoted_amount?: string | null }) => apiRequest<{ id: number }>('/routes/admin-booking-status.php', { method: 'POST', headers: { 'X-CSRF-Token': adminCsrfToken }, body: JSON.stringify({ id, ...fields }) })
export const getAdminResource = (resource: AdminResource) => apiRequest<Array<Record<string, unknown>>>(`/routes/admin-resources.php?resource=${resource}`)
export const saveAdminResource = (resource: AdminResource, action: 'create' | 'update' | 'delete', values: Record<string, unknown>) => apiRequest<{ id: number }>('/routes/admin-resources.php', { method: 'POST', headers: { 'X-CSRF-Token': adminCsrfToken }, body: JSON.stringify({ resource, action, ...values }) })
export const getAdminSettings = () => apiRequest<Record<string, string>>('/routes/admin-settings.php')
export const saveAdminSettings = (settings: Record<string, string>) => apiRequest<Record<string, string>>('/routes/admin-settings.php', { method: 'POST', headers: { 'X-CSRF-Token': adminCsrfToken }, body: JSON.stringify({ settings }) })
export const getAdminExportUrl = (report: 'bookings' | 'customers' | 'analytics', days = 30) => `${apiBase}/routes/admin-export.php?report=${report}&days=${days}`
export async function uploadAdminImage(file: File) {
  const form = new FormData(); form.append('image', file)
  const response = await fetch(`${apiBase}/routes/admin-upload.php`, { method: 'POST', credentials: 'include', headers: { Accept: 'application/json', 'X-CSRF-Token': adminCsrfToken }, body: form })
  const result = await response.json().catch(() => null) as ApiEnvelope<{ url: string }> | null
  if (!response.ok || result?.status !== 'success') throw new ApiError(result?.message || `Upload failed (${response.status})`, response.status)
  return result.data as { url: string }
}
export async function adminLogout() {
  await apiRequest<{ signedOut: boolean }>('/routes/admin-session.php', { method: 'POST', headers: { 'X-CSRF-Token': adminCsrfToken } })
  adminCsrfToken = ''
}

export async function trackPageView(pathname: string) {
  if (localStorage.getItem('cleanpro-analytics-consent') !== 'accepted' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return
  try {
    await apiRequest('/routes/visit.php', {
      method: 'POST',
      body: JSON.stringify({ path: pathname, referrer: document.referrer ? new URL(document.referrer).hostname : null }),
    })
  } catch {
    // Analytics is best-effort and must never block navigation.
  }
}
