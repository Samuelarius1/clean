import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Alert } from '@mui/material'
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { customerApi } from '../services/api'

export default function CustomerPasswordPage({ mode }: { mode: 'forgot' | 'reset' }) {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [error,setError]=useState('')
  const [sent,setSent]=useState(false)
  const [busy,setBusy]=useState(false)
  const token=params.get('token')||''
  const resetting=mode==='reset'

  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();setError('');setBusy(true)
    const form=new FormData(event.currentTarget)
    try {
      if(resetting) { await customerApi.resetPassword(token,String(form.get('password')));navigate('/login',{replace:true}) }
      else { await customerApi.forgotPassword(String(form.get('email')));setSent(true) }
    } catch(reason) { setError(reason instanceof Error?reason.message:'The request could not be completed.') }
    finally { setBusy(false) }
  }

  return <section className="form-page account-auth-page"><div className="form-intro"><Link to="/login" className="back-link"><ArrowLeft size={16}/> Back to sign in</Link><span className="eyebrow">ACCOUNT SECURITY</span><h1>{resetting?<>Choose a new<br/><em>password.</em></>:<>Let&apos;s get you<br/><em>back in.</em></>}</h1><p>{resetting?'Create a new password to secure your customer account.':'We’ll send a one-time reset link if an active account matches your email.'}</p></div><div className="form-panel"><span className="eyebrow">{resetting?'PASSWORD RESET':'ACCOUNT RECOVERY'}</span>{sent?<div className="success-state"><span className="success-icon"><CheckCircle2 size={26}/></span><h2>Check your <em>inbox.</em></h2><p>If an active account matches that address, reset instructions are on their way.</p></div>:<><h2>{resetting?'Set a new password.':'Reset your password.'}</h2>{error&&<Alert severity="error" className="api-alert">{error}</Alert>}{resetting&&!token&&<Alert severity="error" className="api-alert">This reset link is incomplete. Request a new one to continue.</Alert>}<form className="contact-form" onSubmit={submit}>{resetting?<label>New password<input required type="password" name="password" minLength={12} maxLength={200} autoComplete="new-password"/><span className="privacy-note">Use at least 12 characters.</span></label>:<label>Email address<input required type="email" name="email" maxLength={190} autoComplete="email"/></label>}<button className="button button-dark form-submit" disabled={busy||(resetting&&!token)}>{busy?'Please wait…':resetting?'Update password':'Send reset link'} <ArrowUpRight size={17}/></button></form></>}</div></section>
}
