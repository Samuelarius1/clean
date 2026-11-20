const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost/faiths-CleanPro/backend/public/api').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message: string, readonly status: number) { super(message); this.name = 'ApiError' }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  headers.set('Accept', 'application/json')
  const response = await fetch(`${API_BASE}/${path.replace(/^\//, '')}`, { ...options, headers, credentials: 'include' })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) throw new ApiError(payload.message || 'The request could not be completed.', response.status)
  return payload.data as T
}

export interface Service { id: number; name: string; slug: string; description: string; price_from: number | null; active: boolean }
export interface BookingInput { name: string; email: string; phone: string; service_id: number; preferred_date: string; address: string; notes?: string }
export const servicesApi = {
  list: () => api<Service[]>('services'),
  get: (slug: string) => api<Service>(`services/${encodeURIComponent(slug)}`),
}
export const bookingApi = { create: (booking: BookingInput) => api<{ id: number }>('bookings', { method: 'POST', body: JSON.stringify(booking) }) }
export const contactApi = { send: (message: { name: string; email: string; phone?: string; message: string }) => api<{ id: number }>('contact', { method: 'POST', body: JSON.stringify(message) }) }
export interface AdminBooking { id: number; name: string; service_name: string; preferred_date: string; status: string }
export interface AdminService { id: number; name: string; slug: string; description: string; price_from: number | null; active: boolean; sort_order: number }
export interface AdminMessage { id: number; name: string; email: string; phone: string | null; message: string; status: string; created_at: string }
export const adminApi = {
  session: () => api<{ csrf: string; name: string }>('admin/session'),
  login: (email: string, password: string) => api<{ csrf: string; name: string }>('admin/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: (csrf: string) => api('admin/logout', { method: 'POST', headers: { 'X-CSRF-Token': csrf } }),
  dashboard: (csrf: string) => api<{ counts: { bookings: number; messages: number; services: number }; bookings: AdminBooking[] }>('admin/dashboard', { headers: { 'X-CSRF-Token': csrf } }),
  services: (csrf: string) => api<AdminService[]>('admin/services', { headers: { 'X-CSRF-Token': csrf } }),
  createService: (csrf: string, service: { name: string; slug: string; description: string; price_from: string }) => api<{ id: number }>('admin/services', { method: 'POST', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify(service) }),
  setServiceActive: (csrf: string, id: number, active: boolean) => api<null>(`admin/services/${id}`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ active }) }),
  messages: (csrf: string) => api<AdminMessage[]>('admin/messages', { headers: { 'X-CSRF-Token': csrf } }),
  setMessageStatus: (csrf: string, id: number, status: string) => api<null>(`admin/messages/${id}/status`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ status }) }),
  setBookingStatus: (csrf: string, id: number, status: string) => api<null>(`admin/bookings/${id}/status`, { method: 'PATCH', headers: { 'X-CSRF-Token': csrf }, body: JSON.stringify({ status }) }),
}
