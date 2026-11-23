import { useState } from 'react'
import { ArrowLeft, Check, MailMinus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { unsubscribeFromNewsletter } from '../services/api'

export function NewsletterPreferencesPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [busy, setBusy] = useState(false)
  const [complete, setComplete] = useState(false)
  const [error, setError] = useState('')
  const validToken = /^[a-f0-9]{64}$/i.test(token)
  async function unsubscribe(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!validToken || busy) return
    setBusy(true); setError('')
    try { await unsubscribeFromNewsletter(token); setComplete(true) }
    catch (issue) { setError(issue instanceof Error ? issue.message : 'Your preference could not be updated. Please try again.') }
    finally { setBusy(false) }
  }
  return <main className="subpage"><section className="section preferences-section"><div className="wrap"><Reveal className="preferences-card"><Link to="/" className="back-link"><ArrowLeft size={15} /> Back to home</Link><span className="preferences-icon">{complete ? <Check size={23} /> : <MailMinus size={23} />}</span><span className="eyebrow">EMAIL PREFERENCES</span><h1>{complete ? 'You’re unsubscribed.' : 'Manage your newsletter preferences.'}</h1><p>{complete ? 'This email address will no longer receive newsletter updates.' : validToken ? 'Confirm below to stop receiving newsletter updates. This link can be used only once.' : 'This preference link is missing or invalid. Use the link shown after signing up for the newsletter.'}</p>{validToken && !complete && <form onSubmit={unsubscribe}><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Updating…' : 'Unsubscribe from updates'}</button></form>}{error && <p className="form-error" role="alert">{error}</p>}</Reveal></div></section></main>
}
