import { useState } from 'react'
import useSWR from 'swr'
import { Alert, CircularProgress } from '@mui/material'
import { X } from 'lucide-react'
import { publicContentApi, type GalleryRecord } from '../services/api'

export default function GalleryPage() {
  const { data: images = [], error, isLoading } = useSWR<GalleryRecord[]>('public-gallery', publicContentApi.gallery)
  const [category, setCategory] = useState('All')
  const [selected, setSelected] = useState<GalleryRecord | null>(null)
  const categories = ['All', ...new Set(images.map((image) => image.category))]
  const visible = category === 'All' ? images : images.filter((image) => image.category === category)
  return <section className="editorial-page gallery-page"><header className="editorial-heading"><span className="eyebrow">OUR WORK</span><h1>Spaces made for<br/><em>breathing room.</em></h1><p>Explore the gallery of spaces refreshed by Faith&apos;s Walk CleanPro.</p></header>{error&&<Alert severity="error">{error.message}</Alert>}{images.length>0&&<nav className="gallery-filters" aria-label="Filter gallery by category">{categories.map((item)=><button key={item} className={category===item?'active':''} onClick={()=>setCategory(item)} aria-pressed={category===item}>{item}</button>)}</nav>}{isLoading?<div className="loading-inline"><CircularProgress size={20}/> Loading gallery</div>:visible.length===0?<div className="empty-state"><h2>Gallery is being refreshed.</h2><p>New images will appear here once they&apos;re ready to share.</p></div>:<div className="public-gallery-grid">{visible.map((image)=><button className="public-gallery-card" key={image.id} onClick={()=>setSelected(image)} aria-label={`View ${image.title}`}><img src={image.image_url} alt={image.title} loading="lazy"/><span><strong>{image.title}</strong><small>{image.category}</small></span></button>)}</div>}{selected&&<div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={selected.title} onClick={()=>setSelected(null)}><button className="gallery-close" aria-label="Close image preview" onClick={()=>setSelected(null)}><X/></button><figure onClick={(event)=>event.stopPropagation()}><img src={selected.image_url} alt={selected.title}/><figcaption><strong>{selected.title}</strong>{selected.description&&<p>{selected.description}</p>}</figcaption></figure></div>}</section>
}
