import { useState } from 'react'
import useSWR from 'swr'
import { ArrowUpRight, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'
import { getGallery } from '../services/api'

export function BeforeAfterGallery() {
  const { data: items = [], error, isLoading } = useSWR('public-gallery', getGallery)
  const [positions, setPositions] = useState<Record<number, number>>({})
  return <section className="section before-after-section"><div className="wrap"><Reveal className="section-heading"><span className="eyebrow">A CHANGE YOU CAN SEE</span><h2>Before. After. <em>Better.</em></h2><p>Thoughtfully shared, customer-approved transformations from our gallery.</p></Reveal>{isLoading ? <div className="gallery-loading"><Sparkles size={18} /> Loading the gallery…</div> : error ? <p className="inline-note">The photo gallery is temporarily unavailable. Please visit again soon.</p> : items.length ? <div className="before-after-grid">{items.map((item, index) => {
    const position = positions[item.id] ?? 52
    return <Reveal key={item.id} delay={index * 0.08}><article className="comparison-card"><div className="comparison-frame"><img className="comparison-before" src={item.before_image_path} alt={`${item.title}, before cleaning`} loading="lazy" /><img className="comparison-after" src={item.after_image_path} alt={`${item.title}, after cleaning`} loading="lazy" style={{ clipPath: `inset(0 0 0 ${position}%)` }} /><span className="comparison-label before-label">Before</span><span className="comparison-label after-label">After</span><input type="range" min="0" max="100" value={position} onChange={event => setPositions(current => ({ ...current, [item.id]: Number(event.target.value) }))} aria-label={`Compare before and after: ${item.title}`} /></div><div className="comparison-caption"><div><span>{item.category}</span><h3>{item.title}</h3><p>{item.description}</p></div><span className="comparison-mark" aria-hidden="true"><ArrowUpRight size={16} /></span></div></article></Reveal>})}</div> : <div className="gallery-empty"><Sparkles size={21} /><h3>Our gallery is getting ready.</h3><p>We only publish customer-approved project photos. Ask us about a cleaning service in the meantime.</p></div>}</div></section>
}
