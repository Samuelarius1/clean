import { useState } from 'react'
import { ArrowRight, CalendarDays, Search } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { lookupBooking } from '../services/api'
import type { BookingLookup } from '../services/api'

const statusLabels: Record<string, string> = { pending: 'Awaiting review', confirmed: 'Confirmed', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled', rejected: 'Closed' }
export function BookingTrackingPage() {
  const [params] = useSearchParams()
  const [reference, setReference] = useState(params.get('reference') || '')
  const [email, setEmail] = useState('')
  const [booking, setBooking] = useState<BookingLookup | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setBooking(null)
    try { setBooking(await lookupBooking(reference, email)) }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'We couldn’t find that request.') }
    finally { setBusy(false) }
  }
  return <main className="subpage"><section className="subpage-hero compact-hero"><div className="wrap"><Reveal><span className="eyebrow">BOOKING STATUS</span><h1>Keep up with <em>your clean.</em></h1><p>Enter your booking reference and email address to check the latest request status.</p></Reveal></div></section><section className="section"><div className="wrap tracking-wrap"><div className="booking-aside"><span className="eyebrow">A PRIVATE LOOKUP</span><h2>Your request, <em>at a glance.</em></h2><p>We match your unique request reference with the email address used to book. We don’t display your address or other private booking notes here.</p><Link to="/account" className="text-link">Sign in for full booking history <ArrowRight size={15} /></Link><p className="tracking-help">Lost the reference number? <Link to="/contact">Contact our team</Link>.</p></div><div className="tracking-panel"><form className="form-card" onSubmit={submit}><div className="form-card-heading"><h2>Find your booking</h2><p>Your reference starts with FW- followed by 10 characters.</p></div>{error && <p className="form-error" role="alert">{error}</p>}<label>Booking reference<input required maxLength={13} autoCapitalize="characters" autoComplete="off" value={reference} onChange={event => setReference(event.target.value.toUpperCase())} placeholder="FW-1234567890" /></label><label>Email address<input required type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="The email used for your booking" /></label><button type="submit" className="button button-primary submit-button" disabled={busy}>{busy ? 'Checking…' : 'Check booking'} <Search size={15} /></button></form>{booking && <Reveal className="booking-result"><span className="eyebrow">REQUEST STATUS</span><div className="booking-result-heading"><div><small>{booking.reference}</small><h3>{booking.service_name}</h3></div><span className={`booking-status status-${booking.status}`}>{statusLabels[booking.status] || booking.status}</span></div><p><CalendarDays size={15} /> {new Date(`${booking.preferred_date}T12:00:00`).toLocaleDateString(undefined, { dateStyle: 'long' })} · {booking.preferred_time}</p>{booking.quoted_amount !== null && Number(booking.quoted_amount) > 0 && <p>Current quote: <strong>${Number(booking.quoted_amount).toFixed(2)}</strong></p>}</Reveal>}</div></div></section></main>
}
