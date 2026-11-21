import { useState, type FormEvent } from 'react'
import { Alert } from '@mui/material'
import { Download } from 'lucide-react'
import { adminApi } from '../services/api'

export default function ReportsManager({ csrf }: { csrf: string }) {
  const [failure,setFailure]=useState('');const [busy,setBusy]=useState(false)
  async function exportReport(event:FormEvent<HTMLFormElement>){event.preventDefault();setFailure('');setBusy(true);const form=new FormData(event.currentTarget);try{const blob=await adminApi.downloadBookings(csrf,String(form.get('from')),String(form.get('to')));const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='cleanpro-bookings.csv';link.click();URL.revokeObjectURL(url)}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not download report.')}finally{setBusy(false)}}
  return <div className="admin-table"><h2>Booking report</h2><p>Export actual booking records for a selected service date range. Revenue is not reported because no payment records are configured.</p>{failure&&<Alert severity="error">{failure}</Alert>}<form className="admin-service-form schedule-form" onSubmit={exportReport}><label>From<input name="from" type="date" required/></label><label>To<input name="to" type="date" required/></label><button className="button button-dark" disabled={busy}><Download size={16}/>{busy?'Preparing…':'Download CSV'}</button></form></div>
}
