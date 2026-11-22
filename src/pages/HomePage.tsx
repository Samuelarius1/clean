import { Link } from 'react-router-dom'
import useSWR from 'swr'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, ChevronRight, Leaf, Wind } from 'lucide-react'
import { Alert, CircularProgress } from '@mui/material'
import { HeroExperience, ServiceTicker } from '../components/home/HeroExperience'
import { publicContentApi, servicesApi, type Service, type TestimonialRecord } from '../services/api'
import '../styles/home-experience.css'

const fade = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }

export default function HomePage() {
  const reduceMotion = useReducedMotion()
  const { data: services = [], isLoading: loading, error } = useSWR<Service[]>('public-services', servicesApi.list)
  const { data: content = {} } = useSWR<Record<string, string>>('public-content', publicContentApi.content)
  const { data: testimonials = [] } = useSWR<TestimonialRecord[]>('public-testimonials', publicContentApi.testimonials)
  const revealInitial = reduceMotion ? false : 'hidden'

  return (
    <>
      <section className="hero-section experience-hero">
        <div className="experience-copy">
          <motion.span className="eyebrow experience-eyebrow" initial={revealInitial} animate="visible" variants={fade}>
            A CLEAN THAT FEELS LIKE A FRESH START
          </motion.span>
          <motion.h1 initial={revealInitial} animate="visible" variants={fade} transition={{ delay: reduceMotion ? 0 : 0.1 }}>
            {content.home_headline || <>A cleaner space.<br /><em>A better feeling.</em></>}
          </motion.h1>
          <motion.p initial={revealInitial} animate="visible" variants={fade} transition={{ delay: reduceMotion ? 0 : 0.2 }}>
            {content.home_intro || 'Professional cleaning for homes and workspaces, delivered with care, consistency, and attention to the details that make a space feel fresh.'}
          </motion.p>
          <motion.div className="experience-actions" initial={revealInitial} animate="visible" variants={fade} transition={{ delay: reduceMotion ? 0 : 0.28 }}>
            <Link to="/booking" className="button button-dark">Get a free quote <ArrowUpRight size={17} /></Link>
            <Link to="/services" className="text-link">Explore our services <ChevronRight size={16} /></Link>
          </motion.div>
          <div className="experience-proof" aria-label="Our service promises">
            <span><Check size={14} /> Trusted professionals</span>
            <span><Check size={14} /> Quality-focused service</span>
            <span><Check size={14} /> Satisfaction first</span>
          </div>
        </div>
        <HeroExperience />
      </section>

      <ServiceTicker items={services.map((service) => service.name)} />

      <motion.section
        className="approach-section experience-reveal"
        id="approach"
        initial={revealInitial}
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fade}
      >
        <div className="approach-lead">
          <span className="eyebrow">CLEANING, WITH A LITTLE MORE HEART</span>
          <h2>We take care of<br /><em>the little things.</em></h2>
        </div>
        <div className="approach-detail">
          <p>{content.about_story || 'Because the best clean isn’t just what you see. It’s the sense of calm when you walk through the door, and knowing someone truly cared for your space.'}</p>
          <div className="values-row">
            <div><span><Check size={16} /></span>People-first service</div>
            <div><span><Check size={16} /></span>Care in every corner</div>
          </div>
        </div>
      </motion.section>

      <section className="services-section experience-reveal">
        <div className="section-heading">
          <div><span className="eyebrow">A THOUGHTFUL KIND OF CLEAN</span><h2>Find your kind of <em>fresh.</em></h2></div>
          <Link to="/services" className="text-link">All services <ArrowUpRight size={16} /></Link>
        </div>
        {loading ? <div className="loading-inline"><CircularProgress size={22} /> Loading available services</div>
          : error ? <Alert severity="info" className="api-alert">Our service list is temporarily unavailable. Please contact us and we&apos;ll be happy to help.</Alert>
            : services.length === 0 ? <div className="empty-note">We&apos;re refreshing our service list. Check back soon or <Link to="/contact">get in touch</Link>.</div>
              : <div className="service-grid">
                {services.slice(0, 3).map((service, index) => (
                  <motion.article
                    className="service-card"
                    key={service.id}
                    initial={revealInitial}
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    variants={fade}
                    transition={{ delay: reduceMotion ? 0 : index * 0.12 }}
                  >
                    <div className="service-card-top"><span>0{index + 1}</span><Wind size={20} /></div>
                    <h3>{service.name}</h3>
                    <p>{service.description}</p>
                    {service.price_from !== null && <span className="starting-price">Starting at ${Number(service.price_from).toFixed(0)}</span>}
                    <Link to={`/booking?service=${service.id}`} aria-label={`Book ${service.name}`} className="round-arrow"><ArrowUpRight size={18} /></Link>
                  </motion.article>
                ))}
              </div>}
      </section>

      {testimonials.length > 0 && (
        <motion.section
          className="testimonials-section experience-reveal"
          initial={revealInitial}
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={fade}
        >
          <div className="section-heading"><div><span className="eyebrow">KIND WORDS</span><h2>What clients <em>share.</em></h2></div></div>
          <div className="testimonial-grid">
            {testimonials.slice(0, 3).map((review) => (
              <article className="testimonial-card" key={review.id}>
                <span className="testimonial-rating" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}</span>
                <blockquote>{review.content}</blockquote>
                <strong>{review.customer_name}</strong>
              </article>
            ))}
          </div>
        </motion.section>
      )}

      <motion.section
        className="closing-cta experience-reveal"
        initial={revealInitial}
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={fade}
      >
        <div className="cta-orbit"><Leaf size={28} /></div>
        <span className="eyebrow">YOUR SPACE IS READY FOR A RESET</span>
        <h2>More time for <em>your life.</em></h2>
        <p>Tell us a little about your space. We&apos;ll take it from there.</p>
        <Link to="/booking" className="button button-light">Let&apos;s get started <ArrowUpRight size={16} /></Link>
      </motion.section>
    </>
  )
}
