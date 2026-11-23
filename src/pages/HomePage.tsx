import useSWR from 'swr'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { BeforeAfterGallery } from '../components/BeforeAfterGallery'
import { TestimonialsCarousel } from '../components/TestimonialsCarousel'
import { getFaqs, getPublicSettings, getServices } from '../services/api'

const photos = [
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85',
  'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=85',
]
function FaqSection() {
  const { data: items, error, isLoading } = useSWR('public-faqs', getFaqs)
  return <section className="section faq-section"><div className="wrap faq-grid"><Reveal><span className="eyebrow">GOOD TO KNOW</span><h2>Questions, meet <em>answers.</em></h2><p>Have a question we haven’t covered? We’re happy to help.</p><Link to="/contact" className="text-link">Talk to our team <ArrowRight size={16} /></Link></Reveal>{items?.length ? <div className="faq-list">{items.map((item, index) => <details key={item.id} open={index === 0}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div> : <p className="inline-note" role="status">{isLoading ? 'Loading answers…' : error ? 'For quick answers, please get in touch with our team.' : 'For quick answers, please get in touch with our team.'}</p>}</div></section>
}

function StatsStrip() {
  const { data: services } = useSWR('public-services', getServices)
  const stats = [[services ? `${services.length}` : '—', 'Services available'], ['Home + work', 'Spaces supported'], ['Custom care', 'Service planning'], ['Clear quotes', 'Before work begins']]
  return <section className="stats-strip" aria-label="Faith’s Walk CleanPro at a glance"><div className="wrap stats-grid">{stats.map(([value, label], index) => <Reveal key={label} delay={index * 0.08}><article className="stat-item"><motion.strong initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .4, delay: index * .07 }}>{value}</motion.strong><span>{label}</span></article></Reveal>)}</div></section>
}

function ServiceCards() {
  const { data, error, isLoading } = useSWR('public-services', getServices)
  const items = data?.slice(0, 3) ?? []
  if (isLoading) return <div className="service-grid">{[0, 1, 2].map(item => <div className="service-skeleton" key={item} />)}</div>
  if (error) return <p className="inline-note">Services are temporarily unavailable. Please reach out and we’ll help you find the right clean.</p>
  if (!items.length) return <p className="inline-note">Our service menu is being refreshed. Contact us to talk through your space.</p>
  return <div className="service-grid">{items.map((item, index) => <motion.article key={item.id} className="service-card" initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -8, rotateX: 2, rotateY: index === 1 ? 1 : -1 }} style={{ transformPerspective: 900 }}>
    <Link to={`/services/${item.slug}`} className="service-photo"><img src={item.image_url || photos[index % photos.length]} alt={`${item.name} cleaning service`} loading="lazy" /><span className="service-index">0{index + 1}</span><span className="photo-arrow"><ArrowUpRight size={17} /></span></Link>
    <div className="service-card-body"><span className="service-category">{item.category || 'CLEANING SERVICE'}</span><h3>{item.name}</h3><p>{item.summary || item.description}</p><div className="service-card-bottom"><span>{item.price_from ? `From $${Number(item.price_from).toFixed(0)}` : 'Personalized quote'}</span><Link to={`/services/${item.slug}`} aria-label={`Explore ${item.name}`}><ArrowRight size={18} /></Link></div></div>
  </motion.article>)}</div>
}

export function HomePage() {
  const reduceMotion = useReducedMotion()
  const { data: settings } = useSWR('public-settings', getPublicSettings)
  return <main>
    <section className="hero-section">
      <div className="hero-glow hero-glow-one" /><div className="hero-glow hero-glow-two" />
      <div className="hero-grid wrap">
        <div className="hero-copy">
          <motion.span className="eyebrow eyebrow-pill" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}><Sparkles size={13} /> {settings?.home_hero_eyebrow || 'PROFESSIONAL CLEANING, PERSONAL CARE'}</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.08 }}>{settings?.home_hero_title || 'A cleaner space.'}<br /><em>{settings?.home_hero_accent || 'A better feeling.'}</em></motion.h1>
          <motion.p className="hero-description" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>{settings?.home_hero_description || 'Thoughtful home and workplace cleaning, shaped around the way you live and work.'}</motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}><Link to="/booking" className="button button-primary">Request a quote <ArrowRight size={16} /></Link><Link to="/services" className="button button-ghost">Explore services</Link></motion.div>
          <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}><span className="hero-proof-check"><Check size={16} /></span><span><strong>Thoughtful care</strong><small>Every visit starts with your needs.</small></span></motion.div>
        </div>
        <motion.div className="hero-visual" initial={{ opacity: 0, scale: 0.94, rotateY: -8 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }} style={{ transformPerspective: 1100 }}>
          <motion.div className="hero-image-wrap" animate={reduceMotion ? undefined : { y: [0, -9, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><img src={photos[0]} alt="Professional cleaner carefully refreshing a bright home" fetchPriority="high" /><div className="image-shine" /></motion.div>
          <motion.div className="floating-note" animate={reduceMotion ? undefined : { y: [0, -6, 0], rotate: [0, 1, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}><span className="floating-icon"><Check size={17} /></span><span><small>Faith’s Walk CleanPro</small><strong>Thoughtful care. Every visit.</strong></span></motion.div>
          <div className="hero-orbit orbit-a" /><div className="hero-orbit orbit-b" />
        </motion.div>
      </div>
    </section>

    <StatsStrip />

    <section className="sponsor-strip" aria-label="Community sponsor and partner opportunities"><div className="wrap sponsor-strip-heading"><div><span className="eyebrow">COMMUNITY & PARTNERSHIPS</span><h2>Good work is better <em>together.</em></h2></div><p>We’re proud to work alongside the people and organizations who care for our community.</p></div><div className="sponsor-marquee" aria-label="Community organizations, local businesses, property teams, and residential communities"><div className="sponsor-track">{['Community organizations', 'Local businesses', 'Property teams', 'Residential communities', 'Community organizations', 'Local businesses', 'Property teams', 'Residential communities'].map((partner, index) => <span className="sponsor-wordmark" key={`${partner}-${index}`} aria-hidden={index > 3}><i aria-hidden="true" />{partner}</span>)}</div></div><div className="wrap sponsor-invite"><span>Interested in sponsoring a community clean?</span><Link to="/contact" className="text-link">Become a partner <ArrowRight size={16} /></Link></div></section>

    <section className="section services-section" id="services"><div className="wrap"><Reveal className="section-heading"><span className="eyebrow">OUR SERVICES</span><h2>Make room for <em>better.</em></h2><p>Tell us what your space needs. We’ll bring the care, the detail, and a fresh start.</p></Reveal><ServiceCards /><div className="section-link"><Link to="/services" className="text-link">Explore all services <ArrowRight size={16} /></Link></div></div></section>

    <section className="section why-section"><div className="wrap why-grid"><Reveal className="why-copy"><span className="eyebrow">WHY FAITH’S WALK</span><h2>The difference is <em>in the details.</em></h2><p>We believe a clean space should feel good long after the visit. That means listening first, caring for your home or workplace, and taking pride in the finishing touches.</p><Link to="/about" className="text-link">Get to know us <ArrowRight size={16} /></Link></Reveal><div className="why-points">{[['01', 'Care that feels personal', 'A plan shaped around your space, priorities, and schedule.'], ['02', 'A thoughtful finish', 'The little details matter. We treat every room with care.'], ['03', 'Clear communication', 'From your first question to the final walkthrough, we keep it easy.'], ['04', 'A team you can trust', 'Professional service with respect for your time and your space.']].map(([num, title, body], index) => <Reveal key={num} delay={index * 0.08}><article className="why-point"><span>{num}</span><div><h3>{title}</h3><p>{body}</p></div></article></Reveal>)}</div></div></section>

    <section className="section process-section"><div className="wrap"><Reveal className="section-heading center"><span className="eyebrow">A SIMPLE START</span><h2>From hello to <em>fresh.</em></h2><p>Good cleaning should feel easy from the very first conversation.</p></Reveal><div className="process-grid">{[['01', 'Tell us about your space', 'Share what you need, your preferred timing, and the details that matter.'], ['02', 'Get a tailored quote', 'We’ll follow up with a clear plan and answer any questions.'], ['03', 'Enjoy the reset', 'Our team gets to work so you can get back to what matters.']].map(([step, title, body], index) => <Reveal key={step} delay={index * 0.1}><article className="process-card"><span className="process-number">{step}</span><div className="process-watermark">{step}</div><h3>{title}</h3><p>{body}</p></article></Reveal>)}</div></div></section>

    <section className="section gallery-section"><div className="wrap"><Reveal className="section-heading"><span className="eyebrow">A LITTLE INSPIRATION</span><h2>Fresh feels <em>like this.</em></h2><p>Beautiful, cared-for spaces make room to breathe.</p></Reveal><div className="inspiration-grid">{photos.map((photo, index) => <Reveal key={photo} delay={index * 0.08}><div className={`inspiration-photo inspiration-${index + 1}`}><img src={index === 1 ? 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1100&q=85' : index === 2 ? 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1100&q=85' : photo} alt={['A freshly cared-for home interior', 'A bright and tidy modern workplace', 'A calm, sunlit living space'][index]} loading="lazy" /><span>{['A softer landing', 'Room to focus', 'A fresh perspective'][index]}</span></div></Reveal>)}</div></div></section>

    <BeforeAfterGallery />
    <TestimonialsCarousel />
    <FaqSection />

    <section className="section final-cta"><div className="wrap"><Reveal className="final-cta-card"><div className="cta-shape" /><span className="eyebrow">YOUR SPACE, READY FOR A RESET</span><h2>Let’s make your day <em>a little lighter.</em></h2><p>A fresh space is one conversation away. Tell us what you need and we’ll take it from there.</p><Link to="/booking" className="button button-light">Let’s get started <ArrowRight size={16} /></Link></Reveal></div></section>
  </main>
}
