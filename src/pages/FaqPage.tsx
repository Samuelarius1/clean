import { useMemo, useState } from 'react'
import useSWR from 'swr'
import { Alert, CircularProgress } from '@mui/material'
import { ChevronDown, Search } from 'lucide-react'
import { publicContentApi, type FaqRecord } from '../services/api'

export default function FaqPage() {
  const { data: faqs = [], error, isLoading } = useSWR<FaqRecord[]>('public-faqs', publicContentApi.faqs)
  const [query,setQuery]=useState('');const [open,setOpen]=useState<number|null>(null)
  const categories=useMemo(()=>['All',...new Set(faqs.map((faq)=>faq.category))],[faqs]);const [category,setCategory]=useState('All')
  const filtered=faqs.filter((faq)=>(category==='All'||faq.category===category)&&`${faq.question} ${faq.answer}`.toLowerCase().includes(query.toLowerCase()))
  return <section className="editorial-page faq-page"><header className="editorial-heading"><span className="eyebrow">HERE TO HELP</span><h1>A few helpful<br/><em>answers.</em></h1><p>Find helpful details about preparing for a cleaning visit and working with our team.</p></header>{error&&<Alert severity="error">{error.message}</Alert>}<label className="faq-search"><Search size={18}/><span className="sr-only">Search frequently asked questions</span><input value={query} onChange={(event)=>setQuery(event.target.value)} placeholder="Search questions"/></label><div className="faq-filter-row" aria-label="FAQ categories">{categories.map((item)=><button key={item} className={category===item?'active':''} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item}</button>)}</div>{isLoading?<div className="loading-inline"><CircularProgress size={20}/> Loading answers</div>:filtered.length===0?<div className="empty-state"><p>No published answers match your search.</p></div>:<div className="faq-list">{filtered.map((faq)=><article key={faq.id} className={open===faq.id?'faq-item open':'faq-item'}><h2><button aria-expanded={open===faq.id} onClick={()=>setOpen(open===faq.id?null:faq.id)}>{faq.question}<ChevronDown size={18}/></button></h2>{open===faq.id&&<p>{faq.answer}</p>}</article>)}</div>}</section>
}
