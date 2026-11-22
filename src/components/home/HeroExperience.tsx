import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { Check, Sparkles, Wind } from 'lucide-react'
import type { PointerEvent as ReactPointerEvent } from 'react'

const serviceHighlights = ['Home care', 'Office cleaning', 'Detail-first service']

export function HeroExperience() {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-8, 8]), { stiffness: 140, damping: 18 })
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), { stiffness: 140, damping: 18 })

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5)
    pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5)
  }

  function resetTilt() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <motion.div
      className="hero-visual experience-visual"
      initial={reduceMotion ? false : { opacity: 0, y: 34, rotateY: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.22, 1, 0.36, 1], delay: reduceMotion ? 0 : 0.12 }}
      style={{ rotateX, rotateY }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
    >
      <div className="experience-image-wrap">
        <img
          src="/images/cleaning-hero.png"
          alt="Illustrative image of a cleaning professional in a bright office; not a CleanPro employee"
        />
        <div className="experience-image-glow" aria-hidden="true" />
      </div>
      <div className="experience-top-tag"><Sparkles size={13} /> CARE THAT SHOWS</div>
      <motion.div
        className="experience-floating-card"
        animate={reduceMotion ? { y: 0, rotateZ: 0 } : { y: [0, -8, 0], rotateZ: [-1, 1, -1] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="experience-card-icon"><Wind size={17} /></span>
        <span><small>A LITTLE MORE PEACE</small><strong>A fresh start, every visit.</strong></span>
      </motion.div>
      <div className="experience-orbit experience-orbit-one" aria-hidden="true" />
      <div className="experience-orbit experience-orbit-two" aria-hidden="true" />
      <span className="experience-side-note">THOUGHTFUL BY NATURE · RELIABLE BY DESIGN</span>
      <ul className="experience-highlights" aria-label="CleanPro service highlights">
        {serviceHighlights.map((highlight) => (
          <li key={highlight}><Check size={13} />{highlight}</li>
        ))}
      </ul>
    </motion.div>
  )
}

export function ServiceTicker({ items }: { items: string[] }) {
  const labels = items.length ? items : ['Home cleaning', 'Office cleaning', 'Window care', 'Deep cleaning']

  return (
    <section className="service-ticker" aria-label="Cleaning services we offer">
      <div className="service-ticker-label"><span /> CLEANING FOR EVERY KIND OF SPACE</div>
      <div className="ticker-window">
        <div className="ticker-track">
          {[...labels, ...labels].map((label, index) => (
            <span className="ticker-item" key={`${label}-${index}`} aria-hidden={index >= labels.length}>
              <Sparkles size={14} aria-hidden="true" />{label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
