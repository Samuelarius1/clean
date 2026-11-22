import { useState } from 'react'
import { ArrowRight, CalendarDays, CheckCircle2, LogOut, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { ApiError, customerAuth, customerLogout, getCustomerBookings, getCustomerSession, updateCustomerProfile } from '../services/api'
import type { CustomerBooking } from '../services/api'

const prettyStatus: Record<string, string> = { pending: 'Pending review', confirmed: 'Confirmed', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled', rejected: 'Closed' }

function History({ bookings, loading, error }: { bookings: CustomerBooking[]; loading: boolean; error: boolean }) {
  if (loading) return <p className="inline-note">Loading your booking history…</p>
  if (error) return <p className="form-error" role="alert">Your booking history could not be loaded. Please refresh the page.</p>
  if (!bookings.length) return <div className="empty-history"><CalendarDays size={23} /><h3>Your next fresh start is waiting.</h3><p>When you request a clean while signed in, you’ll find its status here.</p><Link to="/booking" className="button button-primary">Request a clean <ArrowRight size={15} /></Link></div>
  return <div className="customer-bookings">{bookings.map(item => <article className="customer-booking-card" key={item.reference}><div><span className="booking-reference">{item.reference}</span><h3>{item.service_name}</h3><p><CalendarDays size={14} /> {new Date(`${item.preferred_date}T12:00:00`).toLocaleDateString(undefined, { dateStyle: 'medium' })} · {item.preferred_time}</p></div><span className={`booking-status status-${item.status}`}>{prettyStatus[item.status] || item.status}</span></article>)}</div>
}

export function CustomerAccountPage() {
  const { data: customer, error: sessionError, isLoading: checking, mutate: refreshCustomer } = useSWR('customer-session', getCustomerSession, { shouldRetryOnError: false, revalidateOnFocus: false })
  const { data: bookings = [], error: bookingsError, isLoading: loadingBookings, mutate: refreshBookings } = useSWR(customer ? 'customer-bookings' : null, getCustomerBookings, { shouldRetryOnError: false })
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [profileBusy, setProfileBusy] = useState(false)
  if (checking) return <main className="subpage"><section className="section"><div className="wrap"><p className="inline-note">Checking your account…</p></div></section></main>
  const isUnauthenticated = sessionError instanceof ApiError && sessionError.statusCode === 401
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await customerAuth({ action: mode, email, password, ...(mode === 'register' ? { name, phone } : {}) })
      setPassword(''); await refreshCustomer()
    } catch (issue) { setMessage(issue instanceof Error ? issue.message : 'Your account request could not be completed.') }
    finally { setBusy(false) }
  }
  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!customer) return; setProfileBusy(true); setMessage('')
    const formData = new FormData(event.currentTarget)
    try { await updateCustomerProfile({ name: String(formData.get('name') || ''), phone: String(formData.get('phone') || '') }); setMessage('Your profile has been updated.'); await refreshCustomer() }
    catch (issue) { setMessage(issue instanceof Error ? issue.message : 'Your profile could not be updated.') }
    finally { setProfileBusy(false) }
  }
  async function signOut() {
    try { await customerLogout(); await refreshCustomer(undefined, { revalidate: false }); await refreshBookings(undefined, { revalidate: false }) }
    catch (issue) { setMessage(issue instanceof Error ? issue.message : 'Sign-out could not be completed.') }
  }
  return <main className="subpage"><section className="subpage-hero compact-hero"><div className="wrap"><span className="eyebrow">YOUR CLEANPRO ACCOUNT</span><h1>{customer ? <>Good to see you,<br /><em>{customer.name.split(' ')[0]}.</em></> : <>Your space, your <em>schedule.</em></>}</h1><p>Keep your details handy and check the status of your cleaning requests.</p></div></section><section className="section"><div className="wrap account-wrap">{customer ? <><div className="account-heading"><div><span className="eyebrow">MY ACCOUNT</span><h2>Your bookings</h2></div><button type="button" className="account-signout" onClick={signOut}><LogOut size={16} /> Sign out</button></div>{message && <p className="form-status-message" role="status">{message}</p>}<History bookings={bookings} loading={loadingBookings} error={Boolean(bookingsError)} /><details className="profile-details"><summary><UserRound size={16} /> Profile details <span>+</span></summary><form className="form-card profile-form" onSubmit={saveProfile}><label>Your name<input name="name" required maxLength={120} defaultValue={customer.name} /></label><label>Email address<input value={customer.email} readOnly disabled /></label><label>Phone number<input name="phone" required maxLength={32} defaultValue={customer.phone} /></label><button type="submit" className="button button-primary" disabled={profileBusy}>{profileBusy ? 'Saving…' : 'Save changes'}</button></form></details></> : <div className="account-entry-grid"><div className="account-entry-copy"><span className="eyebrow">A MORE PERSONAL CLEAN</span><h2>Good to have you <em>here.</em></h2><p>Sign in to follow your booking requests and keep your contact details up to date.</p><ul><li><CheckCircle2 size={16} /> See the status of your requests</li><li><CheckCircle2 size={16} /> Keep your details ready for next time</li><li><CheckCircle2 size={16} /> Manage your cleaning history</li></ul>{!isUnauthenticated && sessionError && <p className="form-error">The customer account service is unavailable. Check the XAMPP setup guide for the API connection.</p>}</div><form className="form-card account-form" onSubmit={submit}><div className="account-tabs" role="tablist"><button type="button" role="tab" aria-selected={mode === 'login'} className={mode === 'login' ? 'active' : ''} onClick={() => { setMode('login'); setMessage('') }}>Sign in</button><button type="button" role="tab" aria-selected={mode === 'register'} className={mode === 'register' ? 'active' : ''} onClick={() => { setMode('register'); setMessage('') }}>Create account</button></div><div className="form-card-heading"><h2>{mode === 'login' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'login' ? 'Pick up where you left off.' : 'Use at least 12 characters for your password.'}</p></div>{message && <p className="form-error" role="alert">{message}</p>}{mode === 'register' && <><label>Your name<input required maxLength={120} autoComplete="name" value={name} onChange={event => setName(event.target.value)} /></label><label>Phone number<input required maxLength={32} type="tel" autoComplete="tel" value={phone} onChange={event => setPhone(event.target.value)} /></label></>}<label>Email address<input required type="email" maxLength={190} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></label><label>Password<input required minLength={mode === 'register' ? 12 : 1} type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={event => setPassword(event.target.value)} placeholder={mode === 'register' ? 'At least 12 characters' : 'Your password'} /></label><button type="submit" className="button button-primary submit-button" disabled={busy}>{busy ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'} <ArrowRight size={15} /></button><p className="account-privacy">For password help, contact our team. Account access is protected by your password and private sign-in session.</p></form></div>}</div></section></main>
}
