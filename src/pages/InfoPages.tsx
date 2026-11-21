import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Alert, CircularProgress } from '@mui/material'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { publicContentApi, servicesApi, type Service } from '../services/api'
import useSWR from 'swr'

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    servicesApi.list().then(setServices).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Services are unavailable.')).finally(() => setLoading(false))
  }, [])
  return <section className="info-page"><span className="eyebrow">A THOUGHTFUL KIND OF CLEAN</span><h1>Your space, <em>your way.</em></h1><p className="info-lead">Every home and workplace is its own little world. Browse the services currently offered by the CleanPro team.</p>
    {loading ? <div className="loading-inline"><CircularProgress size={20} /> Loading available services</div> : error ? <Alert severity="info" className="api-alert">The live service list is unavailable right now. Please try again or contact the team.</Alert> : services.length ? <div className="info-cards service-directory">{services.map((service) => <article key={service.id}><span className="service-number">{String(service.id).padStart(2, '0')}</span><h2>{service.name}</h2><p>{service.description}</p>{service.price_from != null && <p className="service-price">From ${Number(service.price_from).toFixed(2)}</p>}<Link className="text-link" to={`/services/${encodeURIComponent(service.slug)}`}>Explore service <ArrowUpRight size={16} /></Link></article>)}</div> : <div className="empty-state"><h2>New services are on the way.</h2><p>The CleanPro team has not published any services yet. Contact us to discuss your space.</p><Link className="button button-dark" to="/contact">Get in touch <ArrowUpRight size={16} /></Link></div>}
  </section>
}

export function ServiceDetailPage() {
  const { slug = '' } = useParams()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  useEffect(() => {
    setLoading(true); setError('')
    servicesApi.get(slug).then(setService).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'This service is unavailable.')).finally(() => setLoading(false))
  }, [slug])
  if (loading) return <section className="info-page"><div className="loading-inline"><CircularProgress size={20} /> Loading service</div></section>
  if (error || !service) return <section className="info-page"><Link className="back-link" to="/services"><ArrowLeft size={16} /> All services</Link><Alert severity="info" className="api-alert">This service is unavailable or has not been published.</Alert></section>
  return <section className="info-page"><Link className="back-link" to="/services"><ArrowLeft size={16} /> All services</Link><span className="eyebrow">CLEANPRO SERVICE</span><h1>{service.name}</h1><p className="info-lead">{service.description}</p>{service.price_from != null && <p className="service-price">Starting at ${Number(service.price_from).toFixed(2)}</p>}<div className="info-callout"><div><span className="eyebrow">READY WHEN YOU ARE</span><h2>Let&apos;s talk about <em>your space.</em></h2></div><Link className="button button-dark" to={`/booking?service=${service.id}`}>Request this service <ArrowUpRight size={16} /></Link></div></section>
}

export function AboutPage() {
  const { data: content = {} } = useSWR<Record<string, string>>('public-content', publicContentApi.content)
  return <section className="info-page about-page"><span className="eyebrow">THE HEART BEHIND THE CLEAN</span><h1>A little more <em>care.</em><br />A lot more breathing room.</h1><p className="info-lead">{content.about_story || 'Faith’s Walk CleanPro is built around a simple idea: caring for a space means caring for the people who live, work, and gather in it.'}</p><div className="about-image"><img src="/images/cleaning-hero.png" alt="Illustrative cleaning-service scene in a light-filled workspace" /><span>Care for the space.<br /><b>Respect for the people in it.</b></span></div><p className="image-disclosure">Illustrative image; it does not depict CleanPro staff or a completed customer project.</p><div className="about-values"><div><span className="eyebrow">OUR MISSION</span><h2>It&apos;s in the <em>details.</em></h2><p>{content.mission || 'We believe a thoughtful clean comes from attention, consistency, and respect for the spaces entrusted to us.'}</p></div><div><span className="eyebrow">OUR VISION</span><h2>Good service should feel <em>simple.</em></h2><p>{content.vision || 'Clear communication and dependable follow-through help you feel comfortable from the first conversation to every visit.'}</p></div></div><div className="info-callout"><div><span className="eyebrow">WHEN YOU&apos;RE READY</span><h2>Let&apos;s make your space <em>feel good.</em></h2></div><Link to="/booking" className="button button-dark">Request a clean <ArrowUpRight size={16} /></Link></div></section>
}
