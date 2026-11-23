import { useState } from 'react'
import { ArrowLeft, ShieldCheck, UserPlus, UsersRound } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'
import useSWR from 'swr'
import { ApiError, getAdminSession, getAdminStaff, saveAdminStaff } from '../services/api'

export function AdminStaffPage() {
  const { data: admin, error: authError, isLoading: checking } = useSWR('admin-session', getAdminSession, { shouldRetryOnError: false, revalidateOnFocus: false })
  const { data: staff = [], error: staffError, isLoading, mutate } = useSWR(admin?.role === 'admin' ? 'admin-staff' : null, getAdminStaff)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  if (checking) return <main className="admin-login-page"><p className="admin-loading">Checking your staff session…</p></main>
  if (authError instanceof ApiError && authError.statusCode === 401) return <Navigate to="/admin/login" replace />
  if (admin?.role !== 'admin') return <Navigate to="/admin" replace />

  async function createManager(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage('')
    try {
      await saveAdminStaff({ action: 'create', name, email, password })
      setName(''); setEmail(''); setPassword(''); setMessage('Manager account created. Share its sign-in details securely.')
      await mutate()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'The manager account could not be created.') }
    finally { setBusy(false) }
  }

  async function toggleManager(id: number, is_active: boolean | number) {
    setBusy(true); setMessage('')
    try { await saveAdminStaff({ action: 'update', id, is_active: !is_active }); await mutate(); setMessage('Manager access updated.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Manager access could not be updated.') }
    finally { setBusy(false) }
  }

  return <main className="admin-app"><aside className="admin-sidebar"><Link to="/" className="admin-brand"><img src="/faith-cleanpro-logo.png" alt="" /><span><strong>Faith&apos;s CleanPro</strong><small>ADMIN CONSOLE</small></span></Link><Link to="/admin" className="admin-side-link"><ArrowLeft size={16} /> Dashboard</Link><span className="admin-sidebar-note">Only the administrator can create or disable manager accounts.</span></aside><section className="admin-main"><header className="admin-topbar"><div><span className="eyebrow">FAITH’S WALK CLEANPRO</span><h1>Staff access</h1></div><div className="admin-top-actions"><span className="admin-owner-chip"><span>{admin.name.slice(0, 1)}</span>{admin.name}</span><Link to="/admin" className="account-signout"><ArrowLeft size={15} /> Dashboard</Link></div></header><div className="admin-content"><div className="manage-title-row"><div><span className="eyebrow">ROLE MANAGEMENT</span><h2>Manage staff access</h2><p>Managers can manage bookings and the before-and-after gallery. Only you can change site settings and other content.</p></div></div>{message && <p className="form-status-message" role="status">{message}</p>}<div className="staff-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">NEW MANAGER</span><h3>Create a staff account</h3></div><UserPlus size={20} /></div><form className="staff-create-form" onSubmit={createManager}><label>Full name<input required maxLength={120} value={name} onChange={event => setName(event.target.value)} /></label><label>Work email<input required type="email" maxLength={190} autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} /></label><label>Temporary password<input required type="password" minLength={12} maxLength={1024} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} /><small>Use a unique password with at least 12 characters. Share it privately and encourage the manager to replace it with their own unique password.</small></label><button className="button button-primary" type="submit" disabled={busy}><UserPlus size={16} /> Create manager</button></form></section><section className="admin-panel"><div className="admin-panel-heading"><div><span className="eyebrow">TEAM DIRECTORY</span><h3>Administrator and managers</h3></div><UsersRound size={20} /></div>{staffError && <p className="form-error" role="alert">Staff accounts could not be loaded.</p>}{isLoading ? <p className="admin-loading">Loading staff…</p> : <div className="staff-list">{staff.map(person => <article className="staff-card" key={person.id}><div className="staff-avatar"><ShieldCheck size={17} /></div><div className="staff-details"><strong>{person.display_name}</strong><span>{person.email}</span><small>{person.role === 'admin' ? 'Administrator · full access' : 'Manager · bookings and gallery'}</small></div>{person.role === 'manager' && <button className="account-signout" type="button" disabled={busy} onClick={() => void toggleManager(person.id, person.is_active)}>{person.is_active ? 'Disable' : 'Enable'}</button>}</article>)}</div>}</section></div></div></section></main>
}
