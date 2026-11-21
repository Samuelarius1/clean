import { useState } from 'react'
import useSWR from 'swr'
import { Alert } from '@mui/material'
import { Star } from 'lucide-react'
import { adminApi } from '../services/api'

export default function TestimonialManager({ csrf }: { csrf: string }) {
  const { data: reviews = [], error, mutate } = useSWR(['admin-testimonials', csrf], () => adminApi.testimonials(csrf))
  const [failure,setFailure]=useState('')
  async function update(id:number,approved:boolean,published:boolean){try{await adminApi.moderateTestimonial(csrf,id,approved,published);await mutate()}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not update review.')}}
  return <div className="admin-table"><h2>Customer reviews</h2><p>Only approved, published reviews are visible to the public.</p>{error&&<Alert severity="error">{error.message}</Alert>}{failure&&<Alert severity="error">{failure}</Alert>}{reviews.length===0?<p>No customer reviews have been submitted.</p>:<div className="admin-content-list">{reviews.map((review)=><article key={review.id}><div><strong>{review.customer_name} · {review.rating} <Star size={14}/></strong><p>{review.content}</p><span className="eyebrow">{review.approved?'Approved':'Needs review'} · {review.published?'Published':'Hidden'}</span></div><div className="admin-content-actions"><button className="status-toggle" onClick={()=>update(review.id,!review.approved,review.approved?false:review.published)}>{review.approved?'Reject':'Approve'}</button>{review.approved&&<button className="status-toggle" onClick={()=>update(review.id,true,!review.published)}>{review.published?'Hide':'Publish'}</button>}</div></article>)}</div>}</div>
}
