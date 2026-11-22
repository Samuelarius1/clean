import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowUpRight, Menu, Moon, Sun, X } from 'lucide-react'
import { IconButton } from '@mui/material'

export function SiteLayout() {
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    try {
      return window.localStorage.getItem('cleanpro-theme') === 'dark'
    } catch {
      return false
    }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
    try {
      window.localStorage.setItem('cleanpro-theme', dark ? 'dark' : 'light')
    } catch {
      // Theme still works for this session when storage is unavailable.
    }
  }, [dark])
  const toggleTheme = () => setDark((current) => !current)
  const closeMenu = () => setOpen(false)
  return <div className="site-shell">
    <div className="announcement">A cleaner space. A little more room to breathe. <Link to="/booking">Let&apos;s make it happen <ArrowUpRight size={13} /></Link></div>
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Faith’s Walk CleanPro home"><img src="/logo.png" alt="Faith’s Walk CleanPro" /><span>faith&apos;s walk <b>cleanpro</b></span></Link>
      <nav id="primary-navigation" className={open ? 'nav-links nav-open' : 'nav-links'} aria-label="Main navigation">
        <NavLink onClick={closeMenu} to="/services">Services</NavLink><NavLink onClick={closeMenu} to="/about">Our story</NavLink><NavLink onClick={closeMenu} to="/contact">Contact</NavLink><NavLink onClick={closeMenu} to="/gallery">Gallery</NavLink><NavLink onClick={closeMenu} to="/faq">FAQs</NavLink>
        <Link className="mobile-book" onClick={closeMenu} to="/booking">Request a clean <ArrowUpRight size={16} /></Link>
      </nav>
      <div className="header-actions"><IconButton onClick={toggleTheme} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} size="small" className="theme-toggle">{dark ? <Sun size={17} /> : <Moon size={17} />}</IconButton><Link className="button button-dark header-book" to="/booking">Request a clean <ArrowUpRight size={16} /></Link><button className="mobile-toggle" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div>
    </header>
    <motion.main
      key={location.pathname}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.32, ease: 'easeOut' }}
    >
      <Outlet />
    </motion.main>
    <footer className="site-footer"><div className="footer-top"><div><Link className="brand footer-brand" to="/"><img src="/logo.png" alt="" /><span>faith&apos;s walk <b>cleanpro</b></span></Link><p>Thoughtful cleaning for the places<br />where life happens.</p></div><div className="footer-links"><div><span className="eyebrow">EXPLORE</span><Link to="/services">Our services</Link><Link to="/about">Our story</Link><Link to="/contact">Get in touch</Link><Link to="/gallery">Gallery</Link><Link to="/faq">FAQs</Link></div><div><span className="eyebrow">GET STARTED</span><Link to="/booking">Request a clean</Link><Link to="/account">My account</Link><Link to="/booking/lookup">Booking status</Link><Link to="/admin">Team sign in</Link></div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Faith&apos;s Walk CleanPro</span><span>Made with care, for a little more breathing room.</span></div></footer>
  </div>
}
