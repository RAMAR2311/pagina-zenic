import { useRef, useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Company photo carousel — scroll-snap row with autoplay, arrows and dots.
 */
export default function PhotoCarousel({
  darkMode = true,
  title = 'ZENIC por dentro',
  subtitle = 'El equipo, la calle y la tecnología que mueve a los comercios colombianos.',
  photos = [],
  autoPlay = true,
  interval = 4000,
}) {
  const trackRef = useRef(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  const text = darkMode ? '#fff' : '#3D4A60'
  const dim  = darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(61,74,96,0.6)'

  const goTo = useCallback((i) => {
    const el = trackRef.current
    if (!el) return
    const count = photos.length
    const idx = (i + count) % count
    const child = el.children[idx]
    if (child) {
      el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' })
      setActive(idx)
    }
  }, [photos.length])

  // Track which slide is centered on scroll
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const onScroll = () => {
      const center = el.scrollLeft + el.clientWidth / 2
      let closest = 0, min = Infinity
      Array.from(el.children).forEach((c, i) => {
        const mid = c.offsetLeft - el.offsetLeft + c.clientWidth / 2
        const d = Math.abs(mid - center)
        if (d < min) { min = d; closest = i }
      })
      setActive(closest)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Autoplay
  useEffect(() => {
    if (!autoPlay || paused || photos.length <= 1) return
    const id = setInterval(() => {
      setActive(prev => {
        const next = (prev + 1) % photos.length
        const el = trackRef.current
        const child = el?.children[next]
        if (el && child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: 'smooth' })
        return next
      })
    }, interval)
    return () => clearInterval(id)
  }, [autoPlay, paused, interval, photos.length])

  const NavBtn = ({ dir }) => (
    <button
      onClick={() => goTo(active + dir)}
      aria-label={dir < 0 ? 'Anterior' : 'Siguiente'}
      style={{
        width: 44, height: 44, borderRadius: 999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
        border: `1.5px solid ${darkMode ? 'rgba(156,77,204,0.3)' : 'rgba(156,77,204,0.25)'}`,
        color: '#9C4DCC', backdropFilter: 'blur(8px)',
        transition: 'transform 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      {dir < 0 ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </button>
  )

  return (
    <section style={{ padding: 'clamp(3rem,6vw,5rem) 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(1rem,5vw,2.5rem)' }}>

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'clamp(1.5rem,4vw,2.5rem)' }}>
          <div style={{ maxWidth: 640 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1rem', background: darkMode ? 'rgba(128,222,234,0.08)' : 'rgba(128,222,234,0.1)', border: '1px solid rgba(128,222,234,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#80DEEA' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#80DEEA', boxShadow: '0 0 8px #80DEEA', display: 'inline-block' }} />
              Galería
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, lineHeight: 1.15, color: text, marginBottom: '0.5rem' }}>{title}</h2>
            <p style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', color: dim, lineHeight: 1.6 }}>{subtitle}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <NavBtn dir={-1} />
            <NavBtn dir={1} />
          </div>
        </div>
      </div>

      {/* Track */}
      <div
        ref={trackRef}
        className="pc-track"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          display: 'flex',
          gap: 'clamp(1rem,2.5vw,1.5rem)',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          padding: '0.5rem clamp(1rem,5vw,2.5rem)',
          scrollPaddingLeft: 'clamp(1rem,5vw,2.5rem)',
        }}
      >
        {photos.map((p, i) => (
          <figure
            key={i}
            style={{
              flex: '0 0 auto',
              width: 'min(88vw, 560px)',
              height: 'clamp(280px, 45vw, 420px)',
              scrollSnapAlign: 'center',
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              margin: 0,
              border: `1px solid ${darkMode ? 'rgba(156,77,204,0.2)' : 'rgba(156,77,204,0.15)'}`,
              boxShadow: '0 8px 40px rgba(156,77,204,0.15)',
            }}
          >
            <img
              src={p.src}
              alt={p.caption || `Foto ${i + 1}`}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />
            {p.caption && (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,18,0.8) 0%, transparent 50%)', pointerEvents: 'none' }} />
                <figcaption style={{ position: 'absolute', bottom: 18, left: 20, right: 20, color: '#fff' }}>
                  <p style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.3 }}>{p.caption}</p>
                  {p.desc && <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{p.desc}</p>}
                </figcaption>
              </>
            )}
          </figure>
        ))}
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: '1.5rem' }}>
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir a la foto ${i + 1}`}
            style={{
              width: active === i ? 26 : 8, height: 8, borderRadius: 999, cursor: 'pointer', border: 'none', padding: 0,
              background: active === i ? 'linear-gradient(135deg, #9C4DCC, #80DEEA)' : (darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(61,74,96,0.2)'),
              transition: 'width 0.3s, background 0.3s',
            }}
          />
        ))}
      </div>

      <style>{`
        .pc-track { -ms-overflow-style: none; scrollbar-width: none; }
        .pc-track::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}
