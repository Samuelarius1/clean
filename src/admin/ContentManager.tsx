import { useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { Alert, CircularProgress } from '@mui/material'
import { Save } from 'lucide-react'
import { adminApi } from '../services/api'

const fields = [
  ['business_name', 'Business name'], ['business_email', 'Business email'], ['business_phone', 'Business phone'],
  ['business_address', 'Business address'], ['business_hours', 'Business hours'], ['home_headline', 'Homepage headline'],
  ['home_intro', 'Homepage introduction'], ['about_story', 'About story'], ['mission', 'Mission'], ['vision', 'Vision'],
  ['social_instagram', 'Instagram URL'], ['social_facebook', 'Facebook URL'],
] as const

export default function ContentManager({ csrf }: { csrf: string }) {
  const { data, error, isLoading, mutate } = useSWR(['admin-content', csrf], () => adminApi.content(csrf))
  const [notice, setNotice] = useState('')
  const [failure, setFailure] = useState('')
  const [saving, setSaving] = useState(false)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();setSaving(true);setFailure('');setNotice('')
    const form = new FormData(event.currentTarget);const values: Record<string,string> = {}
    for (const [key] of fields) values[key] = String(form.get(key) || '')
    try { await adminApi.saveContent(csrf, values); await mutate(); setNotice('Website content saved.') }
    catch (reason) { setFailure(reason instanceof Error ? reason.message : 'Could not save content.') }
    finally { setSaving(false) }
  }
  const content = Object.fromEntries((data || []).map((item) => [item.setting_key, item.setting_value]))
  if(isLoading&&!data&&!error)return <div className="loading-inline"><CircularProgress size={20}/> Loading website content</div>
  return <div className="admin-table"><h2>Website content and business details</h2><p>These values are stored in MySQL. Leave details blank until the business has confirmed them.</p>{error && <Alert severity="error">{error.message}</Alert>}{failure && <Alert severity="error">{failure}</Alert>}{notice && <Alert severity="success">{notice}</Alert>}<form className="admin-service-form" onSubmit={save}>{fields.map(([key,label])=><label key={key}>{label}{['home_intro','about_story','mission','vision','business_hours'].includes(key)?<textarea name={key} rows={3} defaultValue={content[key] || ''}/>:<input name={key} type={key.includes('email')?'email':'text'} maxLength={4000} defaultValue={content[key] || ''}/>}</label>)}<button className="button button-dark" disabled={saving}><Save size={16}/>{saving?'Saving…':'Save website content'}</button></form></div>
}
