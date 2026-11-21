import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useSWR from 'swr'
import { Alert, CircularProgress } from '@mui/material'
import { ArrowUpRight, CalendarDays, LogOut } from 'lucide-react'
import { customerApi } from '../services/api'

export default function CustomerAccountPage() {
  const navigate=useNavigate()
  const [reviewNotice,setReviewNotice]=useState('')
  const [reviewError,setReviewError]=useState('')
  const {data:session,error:sessionError,isLoading}=useSWR('customer-session',customerApi.session)
  const {data:bookings=[],error:bookingsError,mutate}=useSWR(session?['customer-bookings',session.csrf] as const:null,([,csrf])=>customerApi.bookings(csrf))
  async function logout(){if(!session)return;await customerApi.logout(session.csrf);await mutate([],false);navigate('/login',{replace:true})}
  async function submitReview(event:FormEvent<HTMLFormElement>){event.preventDefault();if(!session)return;setReviewError('');setReviewNotice('');const formElement=event.currentTarget;const form=new FormData(formElement);try{await customerApi.submitTestimonial(session.csrf,String(form.get('content')),Number(form.get('rating')));formElement.reset();setReviewNotice('Thank you. Your review is awaiting approval.')}catch(reason){setReviewError(reason instanceof Error?reason.message:'Could not submit your review.')}}
  if(isLoading)return <section className="customer-page"><div className="loading-inline"><CircularProgress size={20}/> Loading your account</div></section>
  if(sessionError||!session)return <section className="customer-page"><span className="eyebrow">CUSTOMER ACCOUNT</span><h1>Your bookings, <em>in one place.</em></h1><p>Sign in to view requests linked to your account, or look up a guest booking with its private reference.</p><div className="customer-actions"><Link className="button button-dark" to="/login">Sign in <ArrowUpRight size={16}/></Link><Link className="button button-outline" to="/booking/lookup">Look up a booking</Link></div></section>
  const canReview=bookings.some((booking)=>booking.status==='completed')
  return <section className="customer-page"><div className="account-heading"><div><span className="eyebrow">CUSTOMER ACCOUNT</span><h1>Welcome, <em>{session.name}.</em></h1></div><button className="button button-outline" onClick={logout}><LogOut size={16}/> Sign out</button></div><h2>Your service requests</h2>{bookingsError&&<Alert severity="error" className="api-alert">{bookingsError.message}</Alert>}{bookings.length===0?<div className="empty-state"><CalendarDays size={24}/><h3>No bookings yet</h3><p>When you book a service while signed in, it will appear here.</p><Link className="button button-dark" to="/booking">Book a service <ArrowUpRight size={16}/></Link></div>:<div className="customer-booking-list">{bookings.map((booking)=><article className="customer-booking-card" key={booking.id}><div><span className="eyebrow">{booking.status.replace('_',' ')}</span><h3>{booking.service_name}</h3><p>{new Date(`${booking.preferred_date}T00:00:00`).toLocaleDateString()} {booking.preferred_time?` · ${booking.preferred_time.slice(0,5)}`:''}</p></div><CalendarDays size={20}/></article>)}</div>}{canReview&&<section className="customer-review-form"><h2>Share your experience</h2><p>Reviews are checked by the team before they appear publicly.</p>{reviewError&&<Alert severity="error">{reviewError}</Alert>}{reviewNotice&&<Alert severity="success">{reviewNotice}</Alert>}<form className="contact-form" onSubmit={submitReview}><label>Your rating<select name="rating" required defaultValue="5">{[5,4,3,2,1].map((rating)=><option key={rating} value={rating}>{rating} out of 5</option>)}</select></label><label>Your review<textarea name="content" required rows={4} maxLength={2000}/></label><button className="button button-dark">Submit review</button></form></section>}</section>
}
