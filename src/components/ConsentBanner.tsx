import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { trackPageView } from '../services/api'

export function ConsentBanner() {
  const [visible, setVisible] = useState(() => localStorage.getItem('cleanpro-analytics-consent') === null)
  const location = useLocation()
  function choose(accepted: boolean) {
    localStorage.setItem('cleanpro-analytics-consent', accepted ? 'accepted' : 'rejected')
    setVisible(false)
    if (accepted) void trackPageView(location.pathname)
  }
  if (!visible) return null
  return <aside className="consent-banner" aria-label="Privacy preferences"><div><strong>Privacy, your way.</strong><p>We only use privacy-preserving visit analytics if you opt in. <Link to="/privacy" onClick={() => setVisible(false)}>Read our privacy note</Link>.</p></div><div className="consent-actions"><button type="button" className="consent-reject" onClick={() => choose(false)}>Only essential</button><button type="button" className="consent-accept" onClick={() => choose(true)}>Allow analytics</button></div></aside>
}
