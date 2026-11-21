import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import useSWR from 'swr'
import { ArrowLeft, ArrowUpRight, CheckCircle2, Copy } from 'lucide-react'
import { Alert, CircularProgress } from '@mui/material'
import { availabilityApi, bookingApi, servicesApi, type BookingInput, type Service } from '../services/api'

const today = new Date().toISOString().slice(0, 10)

export default function BookingPage() {
  const [params] = useSearchParams()
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ reference: string } | null>(null)
  const [serviceId, setServiceId] = useState(Number(params.get('service') || 0))
  const [date, setDate] = useState('')
  const [referenceCopied, setReferenceCopied] = useState(false)
  const { data: services = [], isLoading, error: serviceError, mutate: reloadServices } = useSWR<Service[]>('services', servicesApi.list)
  const availabilityKey = serviceId && date ? ['availability', serviceId, date] as const : null
  const { data: slots = [], isLoading: slotsLoading, error: slotsError } = useSWR(
    availabilityKey,
    ([, id, selectedDate]) => availabilityApi.list(id, selectedDate),
  )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSaving(true)
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const input: BookingInput = {
      name: String(form.get('name')),
      email: String(form.get('email')),
      phone: String(form.get('phone')),
      service_id: serviceId,
      preferred_date: date,
      preferred_time: String(form.get('preferred_time')),
      property_type: String(form.get('property_type')),
      address: String(form.get('address')),
      notes: String(form.get('notes') || ''),
    }
    try {
      const booking = await bookingApi.create(input)
      setResult({ reference: booking.reference })
      formElement.reset()
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not send your request. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function copyReference() {
    if (!result) return
    await navigator.clipboard.writeText(result.reference)
    setReferenceCopied(true)
  }

  return <section className="form-page">
    <div className="form-intro"><Link to="/" className="back-link"><ArrowLeft size={16}/> Back home</Link><span className="eyebrow">YOUR FRESH START BEGINS HERE</span><h1>Let&apos;s make<br/><em>room to breathe.</em></h1><p>Choose a service and an available time, then share a few details so we can confirm your visit.</p><div className="form-aside"><span className="aside-mark"><CheckCircle2 size={19}/></span><span>Already booked? <Link to="/booking/lookup">Look up your booking</Link></span></div></div>
    <div className="form-panel">{result ? <div className="success-state"><span className="success-icon"><CheckCircle2 size={28}/></span><span className="eyebrow">REQUEST RECEIVED</span><h2>Your fresh start is <em>in motion.</em></h2><p>Save this private booking reference. You will need it together with your email address to check the request status.</p><div className="booking-reference"><strong>{result.reference}</strong><button type="button" onClick={copyReference} aria-label="Copy booking reference"><Copy size={16}/>{referenceCopied ? 'Copied' : 'Copy'}</button></div><Link className="button button-dark" to="/">Back to home <ArrowUpRight size={16}/></Link></div> : <><span className="eyebrow">CLEANING REQUEST</span><h2>A few details, <em>please.</em></h2>{serviceError&&<Alert severity="error" className="api-alert">We couldn&apos;t load the available services. <button type="button" onClick={()=>reloadServices()}>Try again</button></Alert>}{error && <Alert severity="error" className="api-alert">{error}</Alert>}{isLoading ? <div className="loading-inline"><CircularProgress size={20}/> Loading services</div> : <form className="contact-form" onSubmit={submit}>
      <div className="field-row"><label>Your name<input required name="name" autoComplete="name" maxLength={120} placeholder="Your name"/></label><label>Email address<input required name="email" type="email" autoComplete="email" maxLength={190} placeholder="you@example.com"/></label></div>
      <div className="field-row"><label>Phone number<input required name="phone" type="tel" autoComplete="tel" maxLength={30} placeholder="(555) 000-0000"/></label><label>Service<select required name="service_id" value={serviceId || ''} onChange={(event) => { setServiceId(Number(event.target.value)); setDate('') }}><option value="" disabled>Select a service</option>{services.map((service) => <option value={service.id} key={service.id}>{service.name}</option>)}</select></label></div>
      <div className="field-row"><label>Preferred date<input required name="preferred_date" type="date" min={today} value={date} onChange={(event) => setDate(event.target.value)} disabled={!serviceId}/></label><label>Available time<select required name="preferred_time" defaultValue="" disabled={!date || slotsLoading || slots.length === 0}><option value="" disabled>{slotsLoading ? 'Checking availability…' : slots.length ? 'Select an available time' : date ? 'No times available' : 'Choose a date first'}</option>{slots.map((slot) => <option value={slot.starts_at.slice(0, 5)} key={slot.id}>{slot.starts_at.slice(0, 5)} – {slot.ends_at.slice(0, 5)}</option>)}</select></label></div>
      {slotsError&&<Alert severity="error" className="api-alert">Availability could not be loaded. Choose another date or try again.</Alert>}
      <div className="field-row"><label>Property type<select name="property_type" required defaultValue=""><option value="" disabled>Select property type</option>{['Apartment','House','Office','Other'].map((item) => <option key={item}>{item}</option>)}</select></label><label>Service address<input required name="address" autoComplete="street-address" maxLength={255} placeholder="Street address"/></label></div>
      <label>Anything else we should know? <span className="optional">OPTIONAL</span><textarea name="notes" rows={3} maxLength={1200} placeholder="A little about your space or what you have in mind…"/></label>
      <button className="button button-dark form-submit" disabled={saving || !services.length || !slots.length}>{saving ? 'Sending request…' : 'Send my request'} {saving ? <CircularProgress size={17} color="inherit"/> : <ArrowUpRight size={17}/>}</button><p className="privacy-note">Your details are used only to respond to this request.</p>
    </form>}</>}</div>
  </section>
}
