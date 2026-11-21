import { useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { Alert } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { adminApi } from '../services/api'

export default function FaqManager({ csrf }: { csrf: string }) {
  const { data: faqs = [], error, mutate } = useSWR(['admin-faqs', csrf], () => adminApi.faqs(csrf))
  const [failure,setFailure]=useState('');const [notice,setNotice]=useState('')
  async function create(event:FormEvent<HTMLFormElement>){event.preventDefault();setFailure('');const formElement=event.currentTarget;const form=new FormData(formElement);try{await adminApi.createFaq(csrf,{question:String(form.get('question')),answer:String(form.get('answer')),category:String(form.get('category')||'General'),published:form.get('published')==='on'});formElement.reset();await mutate();setNotice('FAQ added.')}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not add FAQ.')}}
  async function toggle(faq:typeof faqs[number]){try{await adminApi.updateFaq(csrf,{...faq,published:!faq.published});await mutate()}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not update FAQ.')}}
  async function remove(id:number){try{await adminApi.deleteFaq(csrf,id);await mutate()}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not delete FAQ.')}}
  return <div className="admin-table"><h2>Frequently asked questions</h2>{error&&<Alert severity="error">{error.message}</Alert>}{failure&&<Alert severity="error">{failure}</Alert>}{notice&&<Alert severity="success">{notice}</Alert>}<form className="admin-service-form" onSubmit={create}><label>Question<input name="question" required maxLength={300}/></label><label>Answer<textarea name="answer" required rows={4} maxLength={5000}/></label><label>Category<input name="category" maxLength={80}/></label><label className="checkbox-field"><input name="published" type="checkbox"/> Publish immediately</label><button className="button button-dark"><Plus size={16}/> Add FAQ</button></form><div className="admin-content-list">{faqs.map((faq)=><article key={faq.id}><div><strong>{faq.question}</strong><p>{faq.answer}</p></div><div className="admin-content-actions"><button className="status-toggle" onClick={()=>toggle(faq)}>{faq.published?'Published · hide':'Hidden · publish'}</button><button className="icon-danger" aria-label={`Delete ${faq.question}`} onClick={()=>remove(faq.id)}><Trash2 size={16}/></button></div></article>)}</div></div>
}
