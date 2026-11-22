import { useState } from 'react'
import useSWR from 'swr'
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { getPublicSettings, sendContactMessage } from '../services/api'

export function ContactPage() {
  const { data: settings } = useSWR('public-settings', getPublicSettings)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus('')
    try { await sendContactMessage(form); setStatus('Thanks for reaching out. Your message has been sent.'); setForm({ name: '', email: '', subject: '', message: '' }) }
    catch (error) { setStatus(error instanceof Error ? error.message : 'We couldn’t send your message. Please try again.') }
    finally { setBusy(false) }
  }
  return <main className="subpage"><section className="subpage-hero compact-hero"><div className="wrap"><Reveal><span className="eyebrow">WE’RE HERE TO HELP</span><h1>Let’s talk about <em>your space.</em></h1><p>Questions, a custom request, or not sure where to start? Send us a note.</p></Reveal></div></section><section className="section contact-section"><div className="wrap contact-grid"><Reveal className="contact-info"><span className="eyebrow">SAY HELLO</span><h2>A real person is ready to <em>listen.</em></h2><p>Share what you have in mind and we’ll help you take the next step.</p>{settings?.contact_email && <a href={`mailto:${settings.contact_email}`}><Mail size={17} /> {settings.contact_email}</a>}{settings?.contact_phone && <a href={`tel:${settings.contact_phone.replace(/[^+\d]/g, '')}`}><Phone size={17} /> {settings.contact_phone}</a>}{settings?.business_address && <span><MapPin size={17} /> {settings.business_address}</span>}<Link to="/booking" className="text-link">Prefer to book? Request a quote <ArrowRight size={15} /></Link></Reveal><form className="form-card" onSubmit={submit}><div className="form-card-heading"><h2>Send a message</h2><p>We’ll get back to you as soon as we can.</p></div>{status && <p className="form-status-message" role="status">{status}</p>}<label>Your name *<input required maxLength={120} value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} placeholder="Name" /></label><label>Email address *<input required type="email" maxLength={190} value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} placeholder="you@example.com" /></label><label>What can we help with?<input maxLength={180} value={form.subject} onChange={event => setForm({ ...form, subject: event.target.value })} placeholder="A custom clean, a question…" /></label><label>Your message *<textarea required rows={5} maxLength={2400} value={form.message} onChange={event => setForm({ ...form, message: event.target.value })} placeholder="Tell us a little more…" /></label><button type="submit" disabled={busy} className="button button-primary submit-button">{busy ? 'Sending…' : 'Send message'} <ArrowRight size={16} /></button></form></div></section></main>
}
