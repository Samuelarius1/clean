import { useState } from 'react'
import { ArrowLeft, LockKeyhole } from 'lucide-react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import { ApiError, adminLogin, getAdminSession } from '../services/api'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { data: admin, error: sessionError, isLoading } = useSWR('admin-session', getAdminSession, { shouldRetryOnError: false, revalidateOnFocus: false })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  if (admin) return <Navigate to="/admin" replace />
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('')
    try { await adminLogin(email, password); navigate('/admin', { replace: true }) }
    catch (issue) { setError(issue instanceof ApiError && issue.statusCode === 503 ? 'The admin service is unavailable. Check the PHP and MySQL setup.' : issue instanceof Error ? issue.message : 'Sign-in failed. Please try again.') }
    finally { setBusy(false) }
  }
  return <main className="admin-login-page"><section className="admin-login-card"><Link to="/" className="admin-back-link"><ArrowLeft size={15} /> Back to the website</Link><div className="admin-lock"><LockKeyhole size={23} /></div><span className="eyebrow">STAFF ACCESS</span><h1>Welcome back.</h1><p className="admin-login-intro">Sign in to open your role-based CleanPro workspace.</p>{isLoading && <p className="admin-loading" role="status">Checking your session…</p>}{sessionError && !(sessionError instanceof ApiError && sessionError.statusCode === 401) && <p className="form-error" role="status">The admin service is not available right now. Check your PHP API and database connection.</p>}{error && <p className="form-error" role="alert">{error}</p>}<form className="form-card admin-login-form" onSubmit={submit}><label>Work email<input type="email" required autoComplete="username" value={email} onChange={event => setEmail(event.target.value)} placeholder="name@company.com" /></label><label>Password<input type="password" required autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" /></label><button type="submit" className="button button-primary submit-button" disabled={busy || isLoading}>{busy ? 'Signing in…' : 'Sign in securely'}</button></form><p className="admin-login-footnote">Staff accounts are created by the administrator. Passwords are stored as one-way hashes.</p></section></main>
}
