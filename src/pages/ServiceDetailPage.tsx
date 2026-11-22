import useSWR from 'swr'
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { getServices } from '../services/api'

export function ServiceDetailPage() {
  const { slug } = useParams()
  const { data: services, error, isLoading } = useSWR('public-services', getServices)
  const service = services?.find(item => item.slug === slug)
  if (isLoading) return <main className="subpage"><div className="wrap detail-loading" aria-label="Loading service details"><div className="service-skeleton" /></div></main>
  if (error || !service) return <main className="subpage"><div className="wrap not-found"><span className="eyebrow">SERVICE DETAILS</span><h1>{error ? 'We couldn’t load this service.' : 'This service isn’t available.'}</h1><p>Explore our full service menu or contact us for help with your space.</p><Link className="button button-primary" to="/services">Browse services <ArrowLeft size={16} /></Link></div></main>
  const image = service.image_url || 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=85'
  return <main className="subpage"><section className="section service-detail"><div className="wrap"><Link to="/services" className="back-link"><ArrowLeft size={15} /> All services</Link><div className="detail-grid"><Reveal className="detail-image"><img src={image} alt={`${service.name} service`} /><span className="detail-image-label">Faith’s Walk CleanPro</span></Reveal><Reveal className="detail-copy"><span className="eyebrow">{service.category || 'A THOUGHTFUL CLEAN'}</span><h1>{service.name}</h1><p className="detail-lead">{service.summary}</p><p>{service.description}</p>{service.price_from && <div className="detail-price"><span>Starting from</span><strong>${Number(service.price_from).toFixed(2)}</strong></div>}{service.features?.length > 0 && <><h2 className="included-heading">What’s included</h2><ul className="detail-checks">{service.features.map(feature => <li key={feature}><CheckCircle2 size={17} /> {feature}</li>)}</ul></>}<Link to={`/booking?service=${service.id}`} className="button button-primary">Request this service <ArrowRight size={16} /></Link></Reveal></div></div></section></main>
}
