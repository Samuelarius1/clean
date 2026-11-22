import { ArrowLeft, Printer } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import useSWR from 'swr'
import { ApiError, getAdminAnalytics, getAdminBookings, getAdminSession } from '../services/api'

const dateLabel = (value: string) => new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { dateStyle: 'medium' })
const number = (value: number | string | undefined) => Number(value || 0).toLocaleString()
export function AdminPrintableReportPage() {
  const { data: admin, error, isLoading } = useSWR('admin-session', getAdminSession, { shouldRetryOnError: false, revalidateOnFocus: false })
  const { data: analytics } = useSWR(admin ? ['admin-analytics', 30] : null, () => getAdminAnalytics(30))
  const { data: bookings = [] } = useSWR(admin ? 'admin-bookings' : null, getAdminBookings)
  if (isLoading) return <main className="admin-login-page"><p className="admin-loading">Checking owner session…</p></main>
  if (error instanceof ApiError && error.statusCode === 401) return <Navigate to="/admin/login" replace />
  if (error) return <main className="admin-login-page"><p className="admin-loading">Report data is unavailable. Check the API and database.</p></main>
  if (!admin) return null
  return <main className="print-report"><div className="print-toolbar"><Link to="/admin/manage/reports" className="back-link"><ArrowLeft size={15} /> Back to reports</Link><button className="button button-primary" type="button" onClick={() => window.print()}><Printer size={16} /> Print / Save as PDF</button></div><header className="print-report-header"><span className="eyebrow">FAITH’S WALK CLEANPRO</span><h1>Business activity report</h1><p>Last 30 days · Generated {new Date().toLocaleString()}</p></header><div className="print-report-stats">{[['Page views', analytics?.totals.page_views], ['Daily visitor IDs', analytics?.totals.unique_visitors], ['Bookings', analytics?.bookings.total], ['Pending bookings', analytics?.bookings.pending], ['Confirmed bookings', analytics?.bookings.confirmed], ['Completed bookings', analytics?.bookings.completed]].map(([label, value]) => <article key={String(label)}><span>{label}</span><strong>{number(value as number | string | undefined)}</strong></article>)}</div><section className="print-report-section"><h2>Recent booking requests</h2>{bookings.length ? <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Reference</th><th>Customer</th><th>Email</th><th>Service</th><th>Preferred date</th><th>Status</th><th>Quote</th></tr></thead><tbody>{bookings.map(item => <tr key={item.id}><td>{item.reference}</td><td>{item.customer_name}</td><td>{item.customer_email}</td><td>{item.service_name}</td><td>{dateLabel(item.preferred_date)}</td><td>{item.status.replaceAll('_', ' ')}</td><td>{item.quoted_amount ? `$${Number(item.quoted_amount).toFixed(2)}` : 'Not set'}</td></tr>)}</tbody></table></div> : <p>No bookings have been received in the current database.</p>}</section><p className="print-report-note">Page analytics include only visitors who opted in. Visitor IDs rotate each day and should not be interpreted as people across a longer reporting period. Quoted amounts are not collected revenue.</p></main>
}
