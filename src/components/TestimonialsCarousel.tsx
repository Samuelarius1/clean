import { useState } from 'react'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import useSWR from 'swr'
import { Reveal } from './Reveal'
import { getTestimonials } from '../services/api'

export function TestimonialsCarousel() {
  const { data: items = [], error, isLoading } = useSWR('public-testimonials', getTestimonials)
  const [active, setActive] = useState(0)
  if (isLoading) return <section className="section testimonials-section"><div className="wrap"><p className="inline-note" role="status">Loading customer feedback…</p></div></section>
  if (error || items.length === 0) return null
  const current = items[active % items.length]
  return <section className="section testimonials-section"><div className="wrap"><Reveal className="section-heading"><span className="eyebrow">KIND WORDS, SHARED WITH PERMISSION</span><h2>Our favorite part? <em>Happy spaces.</em></h2><p>Customer feedback featured with approval.</p></Reveal><div className="testimonial-card"><span className="quote-mark">“</span><div className="testimonial-stars" aria-label={`${current.rating} out of 5 stars`}>{Array.from({ length: Number(current.rating) }).map((_, index) => <Star size={15} fill="currentColor" key={index} />)}</div><blockquote>{current.quote}</blockquote><div className="testimonial-person">{current.profile_image ? <img src={current.profile_image} alt="" loading="lazy" /> : <span className="testimonial-avatar" aria-hidden="true">{current.customer_name.slice(0, 1)}</span>}<div><strong>{current.customer_name}</strong><span>Faith’s Walk CleanPro customer</span></div></div>{items.length > 1 && <div className="testimonial-controls"><span>{String(active + 1).padStart(2, '0')} <i>/</i> {String(items.length).padStart(2, '0')}</span><button type="button" onClick={() => setActive(index => (index - 1 + items.length) % items.length)} aria-label="Previous testimonial"><ArrowLeft size={16} /></button><button type="button" onClick={() => setActive(index => (index + 1) % items.length)} aria-label="Next testimonial"><ArrowRight size={16} /></button></div>}</div></div></section>
}
