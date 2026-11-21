import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { customerApi } from '../services/api'

export default function CustomerAuthPage({ mode }: { mode: 'login' | 'register' }) {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const registering = mode === 'register'

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    const form = new FormData(event.currentTarget)
    try {
      if (registering) await customerApi.register(String(form.get('name')), String(form.get('email')), String(form.get('password')))
      else await customerApi.login(String(form.get('email')), String(form.get('password')))
      navigate('/account', { replace: true })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'We could not complete that request.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="form-page account-auth-page"><div className="form-intro"><Link to="/" className="back-link"><ArrowLeft size={16}/> Back home</Link><span className="eyebrow">FAITH&apos;S WALK CLEANPRO</span><h1>{registering ? <>Create your<br/><em>clean start.</em></> : <>Welcome<br/><em>back.</em></>}</h1><p>Use your account to keep track of upcoming visits and completed service requests.</p></div><div className="form-panel"><span className="eyebrow">CUSTOMER ACCOUNT</span><h2>{registering ? 'Join us, ' : 'Sign in, '}<em>{registering ? 'please.' : 'please.'}</em></h2>{error && <Alert severity="error" className="api-alert">{error}</Alert>}<form className="contact-form" onSubmit={submit}>{registering && <label>Your name<input required name="name" autoComplete="name" maxLength={120}/></label>}<label>Email address<input required name="email" type="email" autoComplete="email" maxLength={190}/></label><label>Password<input required name="password" type="password" autoComplete={registering ? 'new-password' : 'current-password'} minLength={registering ? 12 : 1} maxLength={200}/>{registering && <span className="privacy-note">Use at least 12 characters.</span>}</label><button className="button button-dark form-submit" disabled={busy}>{busy ? 'Please wait…' : registering ? 'Create account' : 'Sign in'} <ArrowUpRight size={17}/></button></form><p className="privacy-note">{registering ? 'Already have an account? ' : 'New to CleanPro? '}<Link to={registering ? '/login' : '/register'}>{registering ? 'Sign in' : 'Create an account'}</Link>{!registering&&<> · <Link to="/forgot-password">Forgot password?</Link></>}</p></div></section>
}
