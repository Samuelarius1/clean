import { useState, type FormEvent } from 'react'
import useSWR from 'swr'
import { Alert } from '@mui/material'
import { Plus, Trash2 } from 'lucide-react'
import { adminApi } from '../services/api'

export default function GalleryManager({ csrf }: { csrf: string }) {
  const { data: images = [], error, mutate } = useSWR(['admin-gallery', csrf], () => adminApi.gallery(csrf))
  const [failure,setFailure]=useState('');const [notice,setNotice]=useState('');const [saving,setSaving]=useState(false)
  async function upload(event:FormEvent<HTMLFormElement>){event.preventDefault();setFailure('');setSaving(true);const formElement=event.currentTarget;const form=new FormData(formElement);try{await adminApi.uploadGallery(csrf,form);formElement.reset();await mutate();setNotice('Image uploaded.')}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not upload image.')}finally{setSaving(false)}}
  async function toggle(id:number,published:boolean){try{await adminApi.setGalleryPublished(csrf,id,!published);await mutate()}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not update image.')}}
  async function remove(id:number){try{await adminApi.deleteGallery(csrf,id);await mutate()}catch(reason){setFailure(reason instanceof Error?reason.message:'Could not delete image.')}}
  return <div className="admin-table"><h2>Gallery images</h2><p>JPG, PNG, and WebP uploads up to 5 MB. New images stay private until published.</p>{error&&<Alert severity="error">{error.message}</Alert>}{failure&&<Alert severity="error">{failure}</Alert>}{notice&&<Alert severity="success">{notice}</Alert>}<form className="admin-service-form" onSubmit={upload}><label>Image title<input name="title" required maxLength={160}/></label><label>Description<input name="description" maxLength={500}/></label><label>Category<input name="category" maxLength={80}/></label><label>Image<input name="image" type="file" accept="image/jpeg,image/png,image/webp" required/></label><label className="checkbox-field"><input name="published" type="checkbox"/> Publish immediately</label><button className="button button-dark" disabled={saving}><Plus size={16}/>{saving?'Uploading…':'Upload image'}</button></form><div className="admin-gallery-grid">{images.map((image)=><article key={image.id}><img src={image.image_url} alt={image.title}/><div><strong>{image.title}</strong><p>{image.category}</p><button className="status-toggle" onClick={()=>toggle(image.id,Boolean(image.published))}>{image.published?'Published · hide':'Hidden · publish'}</button><button className="icon-danger" aria-label={`Delete ${image.title}`} onClick={()=>remove(image.id)}><Trash2 size={16}/></button></div></article>)}</div></div>
}
