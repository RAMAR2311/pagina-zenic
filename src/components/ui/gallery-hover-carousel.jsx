import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

/**
 * Gallery hover carousel adapted for ZENIC.
 * Horizontal scroll-snap row of cards. On hover the image shrinks to the
 * top half and a text panel reveals with title + summary.
 */
export default function GalleryHoverCarousel({
  darkMode = true,
  heading = 'Casos de Éxito',
  subheading = 'Negocios colombianos reales que transformaron su operación con ZENIC. De la calle a los datos en tiempo real.',
  items = [],
}) {
  const trackRef = useRef(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateScrollState = () => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }

  useEffect(() => {
    updateScrollState()
    const el = trackRef.current
    if (!el) return
    el.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  const scrollByCards = (dir) => {
    const el = trackRef.current
    if (!el) return
    const amount = Math.min(el.clientWidth * 0.8, 380)
    el.scrollBy({ left: dir * amount, behavior: 'smooth' })
  }

  const text = darkMode ? '#fff' : '#3D4A60'
  const dim  = darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(61,74,96,0.6)'

  const NavBtn = ({ dir, disabled }) => (
    <button
      onClick={() => scrollByCards(dir)}
      disabled={disabled}
      aria-label={dir < 0 ? 'Anterior' : 'Siguiente'}
      style={{
        width: 44, height: 44, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: disabled ? 'default' : 'pointer',
        background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
        border: `1.5px solid ${darkMode ? 'rgba(156,77,204,0.3)' : 'rgba(156,77,204,0.25)'}`,
        color: disabled ? (darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(61,74,96,0.25)') : '#9C4DCC',
        opacity: disabled ? 0.5 : 1,
        transition: 'background 0.2s, transform 0.2s, opacity 0.2s',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'scale(1.08)' }}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {dir < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  )

  return (
    <section style={{ padding: 'clamp(2rem,5vw,4rem) 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1rem,5vw,2.5rem)' }}>

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(1.5rem,4vw,2.5rem)' }}>
          <div style={{ maxWidth: 640 }}>
            <h3 style={{ fontSize: 'clamp(1.5rem,4vw,2.5rem)', fontWeight: 800, lineHeight: 1.15, color: text }}>
              {heading}{' '}
              <span style={{ fontSize: 'clamp(0.95rem,2vw,1.15rem)', fontWeight: 500, color: dim, display: 'block', marginTop: '0.5rem', lineHeight: 1.6 }}>
                {subheading}
              </span>
            </h3>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <NavBtn dir={-1} disabled={!canPrev} />
            <NavBtn dir={1} disabled={!canNext} />
          </div>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="ghc-track"
        style={{
          display: 'flex',
          gap: 'clamp(1rem,2.5vw,1.5rem)',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          padding: '0.5rem clamp(1rem,5vw,2.5rem)',
          scrollPaddingLeft: 'clamp(1rem,5vw,2.5rem)',
        }}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url || '#'}
            className="ghc-card"
            style={{
              flex: '0 0 auto',
              width: 'min(85vw, 340px)',
              height: 380,
              scrollSnapAlign: 'start',
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              textDecoration: 'none',
              border: `1px solid ${item.color}30`,
              boxShadow: `0 4px 30px ${item.color}18`,
              display: 'block',
              background: darkMode ? 'rgba(10,8,18,0.6)' : 'rgba(255,255,255,0.8)',
            }}
          >
            {/* Image */}
            <div className="ghc-img" style={{ position: 'relative', height: '100%', width: '100%', overflow: 'hidden' }}>
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                style={{ height: '100%', width: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
              />
              {/* Permanent bottom gradient + sector chip */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,18,0.85) 0%, transparent 55%)' }} />
              <div style={{ position: 'absolute', top: 14, left: 14, display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.7rem', borderRadius: 999, background: 'rgba(10,8,18,0.6)', backdropFilter: 'blur(8px)', border: `1px solid ${item.color}50` }}>
                <span style={{ fontSize: '0.85rem' }}>{item.emoji}</span>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: item.color }}>{item.sector}</span>
              </div>
              {/* Title always visible at bottom */}
              <div className="ghc-base-title" style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{item.title}</h4>
              </div>
            </div>

            {/* Reveal panel */}
            <div
              className="ghc-panel"
              style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '1.25rem 1.25rem 1.5rem',
                background: darkMode ? 'rgba(13,11,20,0.97)' : 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(10px)',
                borderTop: `2px solid ${item.color}`,
              }}
            >
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: text, marginBottom: '0.4rem', lineHeight: 1.2 }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.55, color: dim, marginBottom: '0.85rem' }}>{item.summary}</p>
              {item.metric && (
                <span style={{ display: 'inline-block', padding: '0.25rem 0.7rem', borderRadius: 999, background: `${item.color}1f`, color: item.color, fontSize: '0.72rem', fontWeight: 800 }}>
                  {item.metric}
                </span>
              )}
              <span className="ghc-arrow" style={{
                position: 'absolute', bottom: 16, right: 16,
                width: 36, height: 36, borderRadius: 999,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${item.color}40`, color: item.color,
                transition: 'transform 0.4s',
              }}>
                <ArrowRight size={16} />
              </span>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .ghc-track { -ms-overflow-style: none; scrollbar-width: none; }
        .ghc-track::-webkit-scrollbar { display: none; }

        .ghc-card .ghc-img       { transition: height 0.5s cubic-bezier(0.4,0,0.2,1); }
        .ghc-card .ghc-panel     { opacity: 0; transform: translateY(8px); transition: opacity 0.45s, transform 0.45s; pointer-events: none; }
        .ghc-card .ghc-base-title { transition: opacity 0.3s; }

        .ghc-card:hover .ghc-img        { height: 52%; }
        .ghc-card:hover .ghc-base-title { opacity: 0; }
        .ghc-card:hover .ghc-panel      { opacity: 1; transform: translateY(0); pointer-events: auto; }
        .ghc-card:hover .ghc-arrow      { transform: rotate(-45deg); }
      `}</style>
    </section>
  )
}
