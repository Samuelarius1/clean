import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Alert } from '@mui/material'
import { ArrowLeft, Search } from 'lucide-react'
import { customerApi } from '../services/api'

type LookupResult = Awaited<ReturnType<typeof customerApi.lookup>>

export default function BookingLookupPage() {
  const [result, setResult] = useState<LookupResult | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setResult(null)
    setBusy(true)
    const form = new FormData(event.currentTarget)
    try {
      setResult(await customerApi.lookup(String(form.get('reference')), String(form.get('email'))))
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not find a booking with those details.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="form-page"><div className="form-intro"><Link to="/booking" className="back-link"><ArrowLeft size={16}/> Back to booking</Link><span className="eyebrow">BOOKING STATUS</span><h1>Find your<br/><em>request.</em></h1><p>Enter the private reference from your confirmation and the email address used for that request.</p></div><div className="form-panel"><span className="eyebrow">SECURE LOOKUP</span><h2>Let&apos;s find it.</h2>{error && <Alert severity="error" className="api-alert">{error}</Alert>}<form className="contact-form" onSubmit={submit}><label>Booking reference<input required name="reference" autoCapitalize="characters" maxLength={27} placeholder="CP-0123456789ABCDEF01234567"/></label><label>Email address<input required name="email" type="email" autoComplete="email" maxLength={190}/></label><button className="button button-dark form-submit" disabled={busy}>{busy ? 'Searching…' : 'Find my booking'} <Search size={16}/></button></form>{result && <div className="lookup-result" role="status"><span className="eyebrow">{result.status}</span><h3>{result.service_name}</h3><p>{new Date(`${result.preferred_date}T00:00:00`).toLocaleDateString()} · {result.preferred_time?.slice(0, 5)}</p></div>}</div></section>
}
