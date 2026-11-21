import { useState } from 'react'
import useSWR from 'swr'
import { Alert } from '@mui/material'
import { ArrowLeft, Mail } from 'lucide-react'
import { adminApi } from '../services/api'

export default function CustomerManager({ csrf }: { csrf: string }) {
  const [selected,setSelected]=useState<number|null>(null);const [query,setQuery]=useState('')
  const {data:customers=[],error}=useSWR(['admin-customers',csrf],()=>adminApi.customers(csrf))
  const {data:detail}=useSWR(selected?['admin-customer',csrf,selected] as const:null,([,token,id])=>adminApi.customer(token,id))
  const filtered=customers.filter((customer)=>`${customer.name} ${customer.email}`.toLowerCase().includes(query.toLowerCase()))
  if(detail)return <div className="admin-table"><button className="status-toggle" onClick={()=>setSelected(null)}><ArrowLeft size={15}/> Back to customers</button><h2>{detail.customer.name}</h2><a href={`mailto:${encodeURIComponent(detail.customer.email)}`}><Mail size={15}/> {detail.customer.email}</a><p>Account created {new Date(detail.customer.created_at).toLocaleDateString()}</p><h3>Booking history</h3>{detail.bookings.length===0?<p>No bookings yet.</p>:<div className="table-scroll"><table><thead><tr><th>Service</th><th>Date</th><th>Time</th><th>Status</th></tr></thead><tbody>{detail.bookings.map((booking)=><tr key={booking.id}><td>{booking.service_name}</td><td>{booking.preferred_date}</td><td>{booking.preferred_time?.slice(0,5)||'—'}</td><td>{booking.status}</td></tr>)}</tbody></table></div>}</div>
  return <div className="admin-table"><h2>Registered customers</h2>{error&&<Alert severity="error">{error.message}</Alert>}<label className="customer-search">Search customers<input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Name or email"/></label>{filtered.length===0?<p>No registered customers found.</p>:<div className="table-scroll"><table><thead><tr><th>Customer</th><th>Email</th><th>Bookings</th><th>Account created</th><th/></tr></thead><tbody>{filtered.map((customer)=><tr key={customer.id}><td>{customer.name}</td><td>{customer.email}</td><td>{customer.booking_count}</td><td>{new Date(customer.created_at).toLocaleDateString()}</td><td><button className="status-toggle" onClick={()=>setSelected(customer.id)}>View history</button></td></tr>)}</tbody></table></div>}</div>
}
