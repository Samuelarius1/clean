const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost/faiths-CleanPro/backend/public/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); this.name = 'ApiError' }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  const response = await fetch(`${API_BASE}/${path.replace(/^\//, '')}`, { ...options, headers, credentials: 'include' })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) throw new ApiError(payload.message || 'The request could not be completed.', response.status)
  return payload.data as T
}

export interface Service { id: number; name: string; slug: string; description: string; price_from: number | null; active: boolean }
export interface BookingInput { name: string; email: string; phone: string; service_id: number; preferred_date: string; preferred_time: string; property_type: string; address: string; notes?: string }
export interface AvailabilitySlot { id: number; slot_date: string; starts_at: string; ends_at: string }
export interface CustomerBooking { id: number; preferred_date: string; preferred_time: string | null; status: string; service_name: string }
export const customerApi = {
  register: (name: string, email: string, password: string) => api<{ csrf: string; name: string }>('customer/register', { method: 'POST', body: JSON.stringify({ name, email, password }) }),
  login: (email: string, password: string) => api<{ csrf: string; name: string }>('customer/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  session: () => api<{ csrf: string; name: string }>('customer/session'),
  logout: (csrf: string) => api<null>('customer/logout', { method: 'POST', headers: { 'X-CSRF-Token': csrf } }),
  bookings: (csrf: string) => api<CustomerBooking[]>('customer/bookings', { headers: { 'X-CSRF-Token': csrf } }),
  submitTestimonial: (csrf: string, content: string, rating: number) => api<{ id: number }>('testimonials', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ content, rating }) }),
  lookup: (reference: string, email: string) => api<{ preferred_date: string; preferred_time: string; status: string; service_name: string }>('booking-lookup', { method: 'POST', body: JSON.stringify({ reference, email }) }),
  forgotPassword: (email: string) => api<null>('customer/password/forgot', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) => api<null>('customer/password/reset', { method: 'POST', body: JSON.stringify({ token, password }) }),
}
export const availabilityApi = {
  list: (serviceId: number, date: string) => api<AvailabilitySlot[]>(`availability?service_id=${serviceId}&date=${encodeURIComponent(date)}`),
}
export const servicesApi = {
  list: () => api<Service[]>('services'),
  get: (slug: string) => api<Service>(`services/${encodeURIComponent(slug)}`),
}
export const bookingApi = { create: (booking: BookingInput) => api<{ id: number; reference: string }>('bookings', { method: 'POST', body: JSON.stringify(booking) }) }
export const contactApi = { send: (message: { name: string; email: string; phone?: string; message: string }) => api<{ id: number }>('contact', { method: 'POST', body: JSON.stringify(message) }) }
export interface AdminBooking { id: number; name: string; service_name: string; preferred_date: string; status: string }
export interface AdminService { id: number; name: string; slug: string; description: string; price_from: number | null; active: boolean; sort_order: number }
export interface AdminMessage { id: number; name: string; email: string; phone: string | null; message: string; status: string; created_at: string }
export interface FaqRecord { id: number; question: string; answer: string; category: string; published: boolean }
export interface GalleryRecord { id: number; title: string; description: string | null; category: string; image_url: string; published: boolean }
export interface TestimonialRecord { id: number; customer_name: string; content: string; rating: number; approved: boolean; published: boolean }
export interface SlotRecord { id: number; service_id: number; service_name: string; slot_date: string; starts_at: string; ends_at: string; capacity: number; active: boolean }
export interface AdminCustomer { id: number; name: string; email: string; created_at: string; booking_count: number }
export const publicContentApi = {
  faqs: () => api<FaqRecord[]>('faqs'),
  gallery: () => api<GalleryRecord[]>('gallery'),
  testimonials: () => api<TestimonialRecord[]>('testimonials'),
  content: () => api<Record<string, string>>('content'),
}
export const adminApi = {
  session: () => api<{ csrf: string; name: string }>('admin/session'),
  login: (email: string, password: string) => api<{ csrf: string; name: string }>('admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: (csrf: string) => api('admin/logout', { method: 'POST', headers: { 'X-CSRF-Token': csrf } }),
  dashboard: (csrf: string) => api<{ counts: { bookings: number; pending: number; confirmed: number; in_progress: number; completed: number; cancelled: number; customers: number; messages: number; unread_messages: number; services: number }; bookings: AdminBooking[] }>('admin/dashboard', { headers: { 'X-CSRF-Token': csrf } }),
  services: (csrf: string) => api<AdminService[]>('admin/services', { headers: { 'X-CSRF-Token': csrf } }),
  createService: (csrf: string, service: { name: string; slug: string; description: string; price_from: string }) => api<{ id: number }>('admin/services', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(service) }),
  setServiceActive: (csrf: string, id: number, active: boolean) => api<null>(`admin/services/${id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ active }) }),
  messages: (csrf: string) => api<AdminMessage[]>('admin/messages', { headers: { 'X-CSRF-Token': csrf } }),
  setMessageStatus: (csrf: string, id: number, status: string) => api<null>(`admin/messages/${id}/status`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ status }) }),
  setBookingStatus: (csrf: string, id: number, status: string) => api<null>(`admin/bookings/${id}/status`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ status }) }),
  customers: (csrf: string) => api<AdminCustomer[]>('admin/customers', { headers: { 'X-CSRF-Token': csrf } }),
  customer: (csrf: string, id: number) => api<{ customer: Omit<AdminCustomer,'booking_count'>; bookings: CustomerBooking[] }>(`admin/customers/${id}`, { headers: { 'X-CSRF-Token': csrf } }),
  availability: (csrf: string) => api<SlotRecord[]>('admin/availability', { headers: { 'X-CSRF-Token': csrf } }),
  createSlot: (csrf: string, slot: { service_id: number; slot_date: string; starts_at: string; ends_at: string; capacity: number }) => api<{ id: number }>('admin/availability', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(slot) }),
  setSlotActive: (csrf: string, id: number, active: boolean) => api<null>(`admin/availability/${id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ active }) }),
  faqs: (csrf: string) => api<FaqRecord[]>('admin/faqs', { headers: { 'X-CSRF-Token': csrf } }),
  createFaq: (csrf: string, faq: Omit<FaqRecord, 'id'>) => api<{ id: number }>('admin/faqs', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(faq) }),
  updateFaq: (csrf: string, faq: FaqRecord) => api<null>(`admin/faqs/${faq.id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(faq) }),
  deleteFaq: (csrf: string, id: number) => api<null>(`admin/faqs/${id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': csrf } }),
  gallery: (csrf: string) => api<GalleryRecord[]>('admin/gallery', { headers: { 'X-CSRF-Token': csrf } }),
  uploadGallery: (csrf: string, form: FormData) => api<{ id: number }>('admin/gallery', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: form }),
  setGalleryPublished: (csrf: string, id: number, published: boolean) => api<null>(`admin/gallery/${id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ published }) }),
  deleteGallery: (csrf: string, id: number) => api<null>(`admin/gallery/${id}`, { method: 'DELETE', headers: { 'X-CSRF-Token': csrf } }),
  testimonials: (csrf: string) => api<TestimonialRecord[]>('admin/testimonials', { headers: { 'X-CSRF-Token': csrf } }),
  moderateTestimonial: (csrf: string, id: number, approved: boolean, published: boolean) => api<null>(`admin/testimonials/${id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ approved, published }) }),
  content: (csrf: string) => api<Array<{ setting_key: string; setting_value: string }>>('admin/content', { headers: { 'X-CSRF-Token': csrf } }),
  saveContent: (csrf: string, content: Record<string, string>) => api<null>('admin/content', { method: 'PUT', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(content) }),
  downloadBookings: async (csrf: string, from: string, to: string) => {
    const response = await fetch(`${API_BASE}/admin/reports/bookings.csv?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, { credentials: 'include', headers: { 'X-CSRF-Token': csrf } })
    if (!response.ok) throw new ApiError('Could not export the booking report.', response.status)
    return response.blob()
  },
}
