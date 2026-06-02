import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Inicio',         to: '/' },
  { label: 'Nosotros',       to: '/nosotros' },
  { label: 'Servicios',      to: '/servicios' },
  { label: 'Precios',        to: '/precios' },
  { label: 'Casos de Éxito', to: '/casos' },
  { label: 'Blog',           to: '/blog' },
  { label: 'Contacto',       to: '/contacto' },
]

// Individual nav tab with position tracking
function NavTab({ link, setPosition, darkMode, isActive }) {
  const ref = useRef(null)

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref.current) return
        const { width } = ref.current.getBoundingClientRect()
        setPosition({ width, opacity: 1, left: ref.current.offsetLeft })
      }}
      style={{ position: 'relative', zIndex: 10, listStyle: 'none' }}
    >
      <Link
        to={link.to}
        style={{
          display: 'block',
          padding: '0.4rem 0.9rem',
          fontSize: 'clamp(0.8rem, 1vw, 0.95rem)',
          fontWeight: isActive ? 700 : 500,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          color: isActive
            ? '#fff'
            : darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(61,74,96,0.8)',
          transition: 'color 0.2s',
          mixBlendMode: 'normal',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => {
          e.currentTarget.style.color = isActive
            ? '#fff'
            : darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(61,74,96,0.8)'
        }}
      >
        {link.label}
      </Link>
    </li>
  )
}

// The sliding pill cursor
function SlidingCursor({ position }) {
  return (
    <motion.li
      animate={position}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{
        position: 'absolute',
        zIndex: 0,
        top: 3,
        bottom: 3,
        borderRadius: 999,
        background: 'linear-gradient(135deg, #4A2574, #9C4DCC)',
        boxShadow: '0 2px 14px rgba(156,77,204,0.45)',
        listStyle: 'none',
      }}
    />
  )
}

export default function Navbar({ darkMode, toggleDarkMode }) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [position, setPosition]   = useState({ left: 0, width: 0, opacity: 0 })
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const bg = scrolled
    ? darkMode ? 'rgba(13,11,20,0.88)' : 'rgba(232,232,242,0.88)'
    : 'transparent'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? '0.5rem 0' : '0.9rem 0',
      background: bg,
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? `0 1px 0 ${darkMode ? 'rgba(156,77,204,0.12)' : 'rgba(156,77,204,0.08)'}` : 'none',
      transition: 'padding 0.4s, background 0.4s, box-shadow 0.4s',
    }}>
      <div style={{
        width: '100%',
        padding: '0 clamp(1rem,4vw,2rem) 0 0.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>

        {/* ── Logo ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontSize: scrolled ? '1.5rem' : '1.75rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            transition: 'font-size 0.4s',
            lineHeight: 1,
          }}>
            ZENIC
          </span>
        </Link>

        {/* ── Desktop nav with sliding cursor ── */}
        <ul
          className="nav-desktop"
          style={{
            display: 'none',
            position: 'relative',
            alignItems: 'center',
            padding: '3px',
            borderRadius: 999,
            border: `1.5px solid ${darkMode ? 'rgba(156,77,204,0.25)' : 'rgba(156,77,204,0.2)'}`,
            background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(12px)',
            listStyle: 'none',
            margin: 0,
            gap: 0,
            flex: 1,
            justifyContent: 'center',
            maxWidth: 680,
          }}
          onMouseLeave={() => setPosition(pv => ({ ...pv, opacity: 0 }))}
        >
          {NAV_LINKS.map(link => (
            <NavTab
              key={link.to}
              link={link}
              setPosition={setPosition}
              darkMode={darkMode}
              isActive={location.pathname === link.to}
            />
          ))}
          <SlidingCursor position={position} />
        </ul>

        {/* ── Right actions ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label="Modo Noche"
            title="Noche de Inventario 🌙"
            style={{
              width: 48, height: 26, borderRadius: 999,
              position: 'relative', border: 'none', cursor: 'pointer',
              background: darkMode ? 'rgba(128,222,234,0.15)' : 'rgba(74,37,116,0.1)',
              outline: `1px solid ${darkMode ? 'rgba(128,222,234,0.35)' : 'rgba(74,37,116,0.2)'}`,
              flexShrink: 0,
              transition: 'background 0.3s',
            }}
          >
            <div style={{
              position: 'absolute', top: 3, width: 20, height: 20, borderRadius: '50%',
              background: darkMode ? '#80DEEA' : '#4A2574',
              left: darkMode ? 25 : 3,
              boxShadow: darkMode ? '0 0 10px rgba(128,222,234,0.6)' : 'none',
              transition: 'left 0.3s, background 0.3s, box-shadow 0.3s',
            }} />
          </button>

          {/* CTA button — desktop only */}
          <Link to="/contacto"
            className="nav-cta"
            style={{
              padding: '0.5rem 1.25rem', borderRadius: 12,
              background: 'linear-gradient(135deg,#4A2574,#9C4DCC)',
              color: '#fff', fontSize: '0.875rem', fontWeight: 600,
              textDecoration: 'none',
              display: 'none', whiteSpace: 'nowrap',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(156,77,204,0.45)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
          >
            Pedir Demo →
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="nav-hamburger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', flexDirection: 'column', gap: 5 }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: 22, height: 2, borderRadius: 1,
                background: darkMode ? '#fff' : '#3D4A60',
                transformOrigin: 'center',
                transform: menuOpen
                  ? i === 0 ? 'rotate(45deg) translate(5px,5px)'
                  : i === 1 ? 'scaleX(0)'
                  : 'rotate(-45deg) translate(5px,-5px)'
                  : 'none',
                opacity: menuOpen && i === 1 ? 0 : 1,
                transition: 'transform 0.3s, opacity 0.3s',
              }} />
            ))}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div style={{
          margin: '0.5rem clamp(1rem,4vw,2rem)', borderRadius: 16, padding: '1rem',
          background: darkMode ? 'rgba(13,11,20,0.97)' : 'rgba(232,232,242,0.97)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode ? 'rgba(156,77,204,0.15)' : 'rgba(156,77,204,0.1)'}`,
        }}>
          {NAV_LINKS.map((link, i, arr) => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '0.65rem 0.5rem', fontSize: '0.95rem',
                color: location.pathname === link.to ? '#9C4DCC' : darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(61,74,96,0.8)',
                textDecoration: 'none',
                fontWeight: location.pathname === link.to ? 700 : 400,
                borderBottom: i < arr.length - 1 ? `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(61,74,96,0.05)'}` : 'none',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/contacto"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', marginTop: '0.75rem', padding: '0.75rem', borderRadius: 10, background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', color: '#fff', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}
          >
            Pedir Demo →
          </Link>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .nav-desktop  { display: flex !important; }
          .nav-cta      { display: block !important; }
          .nav-hamburger { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
