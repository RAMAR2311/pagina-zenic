import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import BrainScene from './BrainScene'


export default function Hero({ darkMode }) {
  const heroRef = useRef(null)
  const ctaRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-eyebrow', { y: 30, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.4 })
      gsap.from('.hero-title', { y: 60, opacity: 0, scale: 0.92, duration: 1.3, ease: 'power3.out', delay: 0.6 })
      gsap.from('.hero-subtitle', { y: 40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.9 })
      gsap.from('.hero-actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: 1.1 })
      gsap.from('.hero-badge', { scale: 0, opacity: 0, duration: 0.6, ease: 'back.out(2)', delay: 1.35 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  // Magnetic CTA
  useEffect(() => {
    const btn = ctaRef.current
    if (!btn) return
    const onMove = (e) => {
      const r = btn.getBoundingClientRect()
      const x = e.clientX - r.left - r.width / 2
      const y = e.clientY - r.top - r.height / 2
      gsap.to(btn, { x: x * 0.22, y: y * 0.22, duration: 0.3, ease: 'power2.out' })
    }
    const onLeave = () => gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1,0.5)' })
    btn.addEventListener('mousemove', onMove)
    btn.addEventListener('mouseleave', onLeave)
    return () => { btn.removeEventListener('mousemove', onMove); btn.removeEventListener('mouseleave', onLeave) }
  }, [])

  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'

  return (
    <section
      ref={heroRef}
      style={{ minHeight: '100svh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
    >
      {/* 3D Brain */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <BrainScene darkMode={darkMode} />
      </div>

      {/* Gradient veil */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: darkMode
          ? 'linear-gradient(to bottom, rgba(13,11,20,0.15) 0%, transparent 35%, rgba(13,11,20,0.8) 100%)'
          : 'linear-gradient(to bottom, rgba(232,232,242,0.1) 0%, transparent 35%, rgba(232,232,242,0.88) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '6rem 1.5rem 3rem', width: '100%', maxWidth: 960, margin: '0 auto' }}>


        {/* Logo image as hero title */}
        <div className="hero-title" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <img
            src="/logo-zenic.png"
            alt="ZENIC"
            style={{
              width: 'clamp(220px, 45vw, 420px)',
              height: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 40px rgba(156,77,204,0.6)) drop-shadow(0 0 80px rgba(128,222,234,0.2))',
            }}
          />
        </div>

        {/* Subtitle */}
        <p className="hero-subtitle" style={{
          fontSize: 'clamp(1rem,2.8vw,1.4rem)', fontWeight: 300, lineHeight: 1.65,
          maxWidth: 580, margin: '0 auto 2.25rem',
          color: darkMode ? `${dim}0.58)` : `${dim}0.68)`,
        }}>
          La inteligencia artificial que procesa tus ventas en tiempo real.{' '}
          <strong style={{ fontWeight: 700, color: '#9C4DCC' }}>
            Diseñado para el comercio que madruga.
          </strong>
        </p>

        {/* Actions */}
        <div className="hero-actions" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1.75rem' }}>
          <button
            ref={ctaRef}
            style={{
              padding: '0.9rem 2.25rem', borderRadius: '1rem',
              fontSize: 'clamp(0.9rem,2vw,1.05rem)', fontWeight: 700,
              color: '#fff', background: 'linear-gradient(135deg, #4A2574, #9C4DCC)',
              border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 24px rgba(156,77,204,0.35)',
              transition: 'box-shadow 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 36px rgba(156,77,204,0.55)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 24px rgba(156,77,204,0.35)'}
          >
            📅 Agendar Auditoría de Negocio
          </button>

          <a href="#modulos" style={{
            padding: '0.9rem 2rem', borderRadius: '1rem',
            fontSize: 'clamp(0.85rem,2vw,1rem)', fontWeight: 600,
            color: darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(61,74,96,0.75)',
            background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(61,74,96,0.06)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(61,74,96,0.12)'}`,
            textDecoration: 'none',
            transition: 'border-color 0.3s, color 0.3s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(156,77,204,0.4)'; e.currentTarget.style.color = '#9C4DCC' }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(61,74,96,0.12)'
              e.currentTarget.style.color = darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(61,74,96,0.75)'
            }}
          >
            Ver módulos →
          </a>
        </div>


      </div>

      {/* Scroll indicator */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', opacity: 0.4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <span style={{ fontSize: '0.65rem', color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Scroll</span>
        <div style={{ width: 18, height: 30, borderRadius: 999, border: `1.5px solid ${darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(61,74,96,0.2)'}`, display: 'flex', justifyContent: 'center', paddingTop: 5 }}>
          <div style={{ width: 3, height: 7, borderRadius: 999, background: '#9C4DCC', animation: 'bounce 1.6s infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
      `}</style>
    </section>
  )
}
