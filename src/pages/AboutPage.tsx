import { ArrowRight, HeartHandshake, Leaf, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import useSWR from 'swr'
import { getPublicSettings } from '../services/api'

const values = [
  { icon: HeartHandshake, title: 'Care, made personal', text: 'We listen closely and shape each visit around the people who use the space.' },
  { icon: ShieldCheck, title: 'Respect in every room', text: 'Your home and workplace deserve thoughtful, professional attention.' },
  { icon: Sparkles, title: 'Pride in the details', text: 'A considered finish is the difference between clean and cared for.' },
  { icon: Leaf, title: 'A lighter footprint', text: 'We keep mindful choices at the heart of how we approach every clean.' },
]

export function AboutPage() {
  const { data: settings } = useSWR('public-settings', getPublicSettings)
  return <main className="subpage"><section className="subpage-hero about-hero"><div className="wrap"><Reveal><span className="eyebrow">THE PEOPLE BEHIND THE FRESH</span><h1>Cleaning with <em>heart.</em></h1><p>Faith’s Walk CleanPro is here to make everyday spaces feel a little more cared for, one thoughtful visit at a time.</p></Reveal></div></section><section className="section"><div className="wrap story-grid"><Reveal className="story-image"><img src="https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1100&q=85" alt="A bright, refreshed living space" /><span className="story-image-note">A fresh start, made personal.</span></Reveal><Reveal className="story-copy"><span className="eyebrow">OUR APPROACH</span><h2>{settings?.about_intro_title || 'Good cleaning starts with good care.'}</h2><p>{settings?.about_intro_body || 'We started Faith’s Walk CleanPro with a simple belief: everyone deserves to feel comfortable in the spaces they call home and work.'}</p><p>Our team brings a warm, reliable approach to every visit. We take the time to understand what matters to you, then bring care and consistency to the details.</p><Link to="/services" className="text-link">See how we can help <ArrowRight size={16} /></Link></Reveal></div></section><section className="section values-section"><div className="wrap"><Reveal className="section-heading center"><span className="eyebrow">WHAT GUIDES US</span><h2>Our work, rooted in <em>care.</em></h2><p>Simple values shape the way we show up for every customer.</p></Reveal><div className="values-grid">{values.map(({ icon: Icon, title, text }, index) => <Reveal key={title} delay={index * 0.08}><article className="value-card"><span className="value-icon"><Icon size={21} /></span><h3>{title}</h3><p>{text}</p></article></Reveal>)}</div></div></section><section className="section final-cta"><div className="wrap"><Reveal className="final-cta-card"><span className="eyebrow">LET’S MAKE SPACE FOR FRESH</span><h2>A little more breathing room <em>starts here.</em></h2><p>Tell us what your space needs, and we’ll help you find the right fit.</p><Link to="/booking" className="button button-light">Request a quote <ArrowRight size={16} /></Link></Reveal></div></section></main>
}
