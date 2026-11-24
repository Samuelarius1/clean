import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import useSWR from 'swr'
import { getPublicSettings } from '../services/api'

type Props = { mode: 'dark' | 'light'; onToggleTheme: () => void }
const links = [{ to: '/', label: 'Home' }, { to: '/about', label: 'Our story' }, { to: '/services', label: 'Services' }, { to: '/contact', label: 'Contact' }, { to: '/account', label: 'My account' }]

export function Header({ mode, onToggleTheme }: Props) {
  const { data: settings } = useSWR('public-settings', getPublicSettings)
  const businessName = settings?.business_name || 'Faith’s Walk CleanPro'
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
    <div className="header-inner">
      <Link to="/" className="brand" aria-label={`${businessName} home`} onClick={() => setOpen(false)}>
        <img src="/faith-cleanpro-logo.png" alt="" />
        <span className="brand-copy"><strong>{businessName}</strong><small>CLEAN · FRESH · PROFESSIONAL</small></span>
      </Link>
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'}>{link.label}</NavLink>)}</nav>
      <div className="header-actions">
        <button className="icon-button theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${mode === 'dark' ? 'light' : 'dark'} theme`}>{mode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
        <Link className="admin-link" to="/admin/login">Admin</Link><Link className="button button-small button-primary header-cta" to="/booking">Get a quote <ArrowUpRight size={15} /></Link>
        <button className="icon-button menu-toggle" onClick={() => setOpen(value => !value)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </div>
    <AnimatePresence>{open && <motion.nav className="mobile-nav" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>{links.map(link => <NavLink key={link.to} to={link.to} end={link.to === '/'} onClick={() => setOpen(false)}>{link.label}</NavLink>)}<Link to="/admin/login" onClick={() => setOpen(false)}>Admin</Link><Link className="button button-primary" to="/booking" onClick={() => setOpen(false)}>Get a quote <ArrowUpRight size={16} /></Link></motion.nav>}</AnimatePresence>
  </header>
}
