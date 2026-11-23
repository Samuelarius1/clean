import { useState } from 'react'
import { ArrowUpRight, Check, Instagram, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { getPublicSettings, subscribeToNewsletter } from '../services/api'

export function Footer() {
  const { data: settings } = useSWR('public-settings', getPublicSettings)
  const [email, setEmail] = useState('')
  const [analyticsConsent, setAnalyticsConsent] = useState(() => localStorage.getItem('cleanpro-analytics-consent') === 'accepted')
  const toggleAnalyticsConsent = () => {
    const next = !analyticsConsent
    localStorage.setItem('cleanpro-analytics-consent', next ? 'accepted' : 'rejected')
    setAnalyticsConsent(next)
  }
  const [status, setStatus] = useState('')
  const [unsubscribeLink, setUnsubscribeLink] = useState('')
  const [busy, setBusy] = useState(false)
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus('')
    try { const result = await subscribeToNewsletter(email); setStatus('You’re on the list. Thank you!'); setUnsubscribeLink(`/unsubscribe?token=${encodeURIComponent(result.unsubscribe_token)}`); setEmail('') }
    catch (error) { setStatus(error instanceof Error ? error.message : 'Subscription could not be saved. Please try again.') }
    finally { setBusy(false) }
  }
  return <footer className="site-footer">
    <div className="footer-cta"><div><span className="eyebrow">A CLEANER SPACE IS CLOSER</span><h2>Come home to <em>clean.</em></h2><p>Make more room for the things that matter. We’ll take care of the rest.</p></div><Link to="/booking" className="button button-light">Request a quote <ArrowUpRight size={16} /></Link></div>
    <div className="footer-main">
      <div className="footer-about"><Link to="/" className="brand"><img src="/faith-cleanpro-logo.png" alt="" /><span className="brand-copy"><strong>{settings?.business_name || 'Faith’s Walk CleanPro'}</strong><small>CLEAN · FRESH · PROFESSIONAL</small></span></Link><p>Thoughtful, reliable cleaning that makes your space feel like yours again.</p><div className="social-links">{settings?.instagram_url && <a href={settings.instagram_url} target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>}{settings?.facebook_url && <a href={settings.facebook_url} target="_blank" rel="noreferrer" aria-label="Facebook"><ArrowUpRight size={16} /></a>}{settings?.contact_email && <a href={`mailto:${settings.contact_email}`} aria-label="Email"><Mail size={16} /></a>}</div></div>
      <div className="footer-links"><h3>Explore</h3><Link to="/about">Our story</Link><Link to="/services">All services</Link><Link to="/booking">Book a clean</Link><Link to="/tracking">Track a booking</Link><Link to="/contact">Contact us</Link></div>
      <div className="footer-contact"><h3>Say hello</h3>{settings?.contact_phone && <a href={`tel:${settings.contact_phone.replace(/[^+\d]/g, '')}`}><Phone size={15} /> {settings.contact_phone}</a>}{settings?.contact_email && <a href={`mailto:${settings.contact_email}`}><Mail size={15} /> {settings.contact_email}</a>}{settings?.business_address && <span><MapPin size={15} /> {settings.business_address}</span>}{!settings?.contact_email && <Link to="/contact">Send our team a message</Link>}</div>
      <form className="newsletter" onSubmit={submit}><h3>Little notes. Fresher spaces.</h3><p>Cleaning tips and occasional good news.</p><div className="newsletter-field"><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="Your email address" /><button type="submit" disabled={busy} aria-label="Subscribe">{status.startsWith('You’re') ? <Check size={16} /> : <ArrowUpRight size={16} />}</button></div><span className="form-status" role="status">{status}</span>{unsubscribeLink && <Link className="newsletter-preferences-link" to={unsubscribeLink}>Manage email preferences</Link>}</form>
    </div>
    <div className="footer-bottom"><span>© {new Date().getFullYear()} Faith&apos;s Walk CleanPro</span><span>Made with care, for a little more breathing room.</span><div className="footer-legal"><Link to="/privacy">Privacy</Link><button type="button" className="consent-settings" onClick={toggleAnalyticsConsent}>{analyticsConsent ? 'Turn off analytics' : 'Allow analytics'}</button><Link to="/contact">Contact</Link></div></div>
  </footer>
}
