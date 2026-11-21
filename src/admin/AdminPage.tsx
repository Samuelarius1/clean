import { useEffect, useState, type FormEvent } from 'react'
import { ArrowUpRight, CheckCircle2, ClipboardList, Clock3, LogOut, MessageSquare, Plus, ShieldCheck, Users, XCircle } from 'lucide-react'
import { Alert, CircularProgress } from '@mui/material'
import { adminApi, type AdminMessage, type AdminService } from '../services/api'
import ContentManager from './ContentManager'
import ScheduleManager from './ScheduleManager'
import FaqManager from './FaqManager'
import GalleryManager from './GalleryManager'
import TestimonialManager from './TestimonialManager'
import ReportsManager from './ReportsManager'
import CustomerManager from './CustomerManager'

type Dashboard = Awaited<ReturnType<typeof adminApi.dashboard>>
type Tab = 'bookings' | 'services' | 'customers' | 'messages' | 'availability' | 'gallery' | 'testimonials' | 'faqs' | 'content' | 'reports'
const tabs: Tab[] = ['bookings','services','customers','messages','availability','gallery','testimonials','faqs','content','reports']

export default function AdminPage() {
  const [csrf, setCsrf] = useState('')
  const [name, setName] = useState('')
  const [data, setData] = useState<Dashboard | null>(null)
  const [services, setServices] = useState<AdminService[]>([])
  const [messages, setMessages] = useState<AdminMessage[]>([])
  const [tab, setTab] = useState<Tab>('bookings')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh(nextCsrf: string) {
    const dashboard = await adminApi.dashboard(nextCsrf)
    setData(dashboard)
    const [serviceRows, messageRows] = await Promise.all([adminApi.services(nextCsrf), adminApi.messages(nextCsrf)])
    setServices(serviceRows)
    setMessages(messageRows)
  }
  useEffect(() => {
    if (csrf) return
    adminApi.session().then((session) => { setName(session.name); setCsrf(session.csrf) }).catch(() => undefined)
  }, [csrf])
  useEffect(() => {
    if (!csrf) return
    refresh(csrf).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Could not load admin data.'))
  }, [csrf])

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(''); setNotice('')
    const form = new FormData(event.currentTarget)
    try {
      const result = await adminApi.login(String(form.get('email')), String(form.get('password')))
      setName(result.name); setCsrf(result.csrf)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Sign in failed.') } finally { setBusy(false) }
  }
  async function logout() {
    try { await adminApi.logout(csrf) } finally { setData(null); setCsrf(''); setName(''); setServices([]); setMessages([]) }
  }
  async function updateStatus(kind: 'booking' | 'message', id: number, status: string) {
    setError(''); setNotice('')
    try {
      if (kind === 'booking') await adminApi.setBookingStatus(csrf, id, status)
      else await adminApi.setMessageStatus(csrf, id, status)
      await refresh(csrf); setNotice('Record updated.')
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The update could not be saved.') }
  }
  async function createService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setNotice('')
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    const title = String(form.get('name')).trim()
    const slug = title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    try {
      await adminApi.createService(csrf, { name: title, slug, description: String(form.get('description')).trim(), price_from: String(form.get('price_from') || '') })
      formElement.reset(); await refresh(csrf); setNotice('Service published.')
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'The service could not be saved.') }
  }
  if (!data) return <section className="admin-page admin-login"><span className="eyebrow">FAITH&apos;S WALK CLEANPRO · PRIVATE</span><h1>Team <em>sign in.</em></h1><p>Administrator access is restricted to the account configured for this project.</p><form className="form-stack" onSubmit={login}><label>Email address<input name="email" type="email" autoComplete="username" required /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label><button className="button button-dark" disabled={busy}>{busy ? <CircularProgress size={18} color="inherit" /> : 'Sign in securely'} <ArrowUpRight size={16}/></button></form>{error && <Alert severity="error" className="api-alert">{error}</Alert>}<p className="admin-note">The server enforces the configured email allowlist and password hash. Login credentials are never stored in the browser.</p></section>

  return <section className="admin-page"><div className="admin-top"><div><span className="eyebrow">FAITH&apos;S WALK CLEANPRO · PRIVATE</span><h1>Welcome, <em>{name}.</em></h1></div><button className="button button-outline" onClick={logout}><LogOut size={16}/> Sign out</button></div>
    {error && <Alert severity="error" className="api-alert">{error}</Alert>}{notice && <Alert severity="success" className="api-alert">{notice}</Alert>}
    <div className="admin-metrics"><article><ClipboardList/><span>TOTAL BOOKINGS</span><b>{data.counts.bookings}</b></article><article><Clock3/><span>PENDING</span><b>{data.counts.pending}</b></article><article><CheckCircle2/><span>CONFIRMED</span><b>{data.counts.confirmed}</b></article><article><Clock3/><span>IN PROGRESS</span><b>{data.counts.in_progress}</b></article><article><CheckCircle2/><span>COMPLETED</span><b>{data.counts.completed}</b></article><article><XCircle/><span>CANCELLED</span><b>{data.counts.cancelled}</b></article><article><Users/><span>CUSTOMERS</span><b>{data.counts.customers}</b></article><article><MessageSquare/><span>UNREAD MESSAGES</span><b>{data.counts.unread_messages}</b></article><article><ShieldCheck/><span>ACTIVE SERVICES</span><b>{data.counts.services}</b></article></div>
    <div className="admin-tabs" role="tablist" aria-label="Admin sections">{tabs.map((item)=><button key={item} role="tab" aria-selected={tab===item} className={tab===item?'active':''} onClick={()=>setTab(item)}>{item}</button>)}</div>
    {tab==='bookings' && <div className="admin-table"><h2>Recent booking requests</h2>{data.bookings.length===0?<p>No booking requests have been received yet.</p>:<div className="table-scroll"><table><thead><tr><th>Client</th><th>Service</th><th>Preferred date</th><th>Status</th></tr></thead><tbody>{data.bookings.map(row=><tr key={row.id}><td>{row.name}</td><td>{row.service_name}</td><td>{row.preferred_date}</td><td><select aria-label={`Booking ${row.id} status`} value={row.status} onChange={(event)=>updateStatus('booking',row.id,event.target.value)}>{['new','contacted','confirmed','in_progress','completed','cancelled'].map((status)=><option key={status}>{status.replace('_',' ')}</option>)}</select></td></tr>)}</tbody></table></div>}</div>}
    {tab==='services' && <div className="admin-table"><h2>Service catalogue</h2><form className="admin-service-form" onSubmit={createService}><label>Service name<input name="name" required maxLength={150}/></label><label>Description<textarea name="description" rows={3} required maxLength={3000}/></label><label>Starting price (optional)<input name="price_from" type="number" min="0" step="0.01"/></label><button className="button button-dark"><Plus size={16}/> Publish service</button></form>{services.length===0?<p>No services have been published.</p>:<div className="table-scroll"><table><thead><tr><th>Service</th><th>Slug</th><th>Starting price</th><th>Visibility</th></tr></thead><tbody>{services.map((service)=><tr key={service.id}><td>{service.name}</td><td>{service.slug}</td><td>{service.price_from==null?'—':`$${Number(service.price_from).toFixed(2)}`}</td><td><button className="status-toggle" onClick={()=>adminApi.setServiceActive(csrf,service.id,!service.active).then(()=>refresh(csrf)).catch((reason:unknown)=>setError(reason instanceof Error?reason.message:'Could not update service.'))}>{service.active?'Published':'Hidden'} · change</button></td></tr>)}</tbody></table></div>}</div>}
    {tab==='customers' && <CustomerManager csrf={csrf}/>}
    {tab==='messages' && <div className="admin-table"><h2>Contact messages</h2>{messages.length===0?<p>No contact messages have been received yet.</p>:<div className="message-list">{messages.map((message)=><article key={message.id}><div><h3>{message.name}</h3><a href={`mailto:${encodeURIComponent(message.email)}`}>{message.email}</a>{message.phone&&<span>{message.phone}</span>}<p>{message.message}</p></div><select aria-label={`Message ${message.id} status`} value={message.status} onChange={(event)=>updateStatus('message',message.id,event.target.value)}>{['new','read','replied','archived'].map((status)=><option key={status}>{status}</option>)}</select></article>)}</div>}</div>}
    {tab==='availability' && <ScheduleManager csrf={csrf}/>}
    {tab==='gallery' && <GalleryManager csrf={csrf}/>}
    {tab==='testimonials' && <TestimonialManager csrf={csrf}/>}
    {tab==='faqs' && <FaqManager csrf={csrf}/>}
    {tab==='content' && <ContentManager csrf={csrf}/>}
    {tab==='reports' && <ReportsManager csrf={csrf}/>}
  </section>
}
