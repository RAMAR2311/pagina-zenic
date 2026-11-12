import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brain, Building2 } from 'lucide-react'

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
        background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 60%, #00E5FF 100%)',
        boxShadow: '0 2px 14px rgba(156,77,204,0.5)',
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
    ? darkMode ? 'rgba(8, 14, 21, 0.94)' : 'rgba(244, 246, 249, 0.94)'
    : 'transparent'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: scrolled ? '0.5rem 0' : '0.9rem 0',
      background: bg,
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
      boxShadow: scrolled ? `0 1px 0 ${darkMode ? 'rgba(156, 77, 204, 0.2)' : 'rgba(156, 77, 204, 0.15)'}` : 'none',
      transition: 'padding 0.4s, background 0.4s, box-shadow 0.4s',
    }}>
      <div style={{
        width: '100%',
        padding: '0 clamp(1rem,4vw,2rem) 0 0.75rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
      }}>

        {/* ── Logo con Cerebro al lado izquierdo ── */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          <img
            src={darkMode ? '/zenic-brain-dark.png' : '/zenic-brain-light.png'}
            alt="ZENIC Brain"
            style={{
              height: scrolled ? 30 : 36,
              width: 'auto',
              objectFit: 'contain',
              filter: darkMode
                ? 'drop-shadow(0 0 10px rgba(156, 77, 204, 0.65)) drop-shadow(0 0 4px rgba(0, 229, 255, 0.4))'
                : 'drop-shadow(0 2px 6px rgba(156, 77, 204, 0.2))',
              transition: 'height 0.4s ease, filter 0.3s ease',
              display: 'block',
            }}
          />
          <span
            className="text-gradient"
            style={{
              fontSize: scrolled ? '1.5rem' : '1.75rem',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              transition: 'font-size 0.4s',
              lineHeight: 1,
            }}
          >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>

          {/* ── Botón "Cerebro" (exactamente en el recuadro rojo de la captura) ── */}
          <Link
            to="/cerebro"
            aria-label="Sección Cerebro de IA"
            title="Arquitectura del Cerebro de Inteligencia Artificial 🧠"
            className="nav-cerebro-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.42rem 0.95rem',
              borderRadius: 999,
              background: location.pathname === '/cerebro'
                ? (darkMode ? 'rgba(156, 77, 204, 0.25)' : 'rgba(156, 77, 204, 0.15)')
                : (darkMode ? 'rgba(156, 77, 204, 0.1)' : 'rgba(156, 77, 204, 0.08)'),
              border: `1.5px solid ${location.pathname === '/cerebro'
                ? '#C084FC'
                : (darkMode ? 'rgba(156, 77, 204, 0.45)' : 'rgba(156, 77, 204, 0.35)')}`,
              color: location.pathname === '/cerebro'
                ? '#C084FC'
                : (darkMode ? '#FFFFFF' : '#0F172A'),
              fontSize: '0.85rem',
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: darkMode
                ? '0 0 16px rgba(156, 77, 204, 0.25)'
                : '0 2px 10px rgba(156, 77, 204, 0.1)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#C084FC'
              e.currentTarget.style.color = '#C084FC'
              e.currentTarget.style.boxShadow = darkMode
                ? '0 0 24px rgba(156, 77, 204, 0.55)'
                : '0 4px 16px rgba(156, 77, 204, 0.3)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const isAct = location.pathname === '/cerebro'
              e.currentTarget.style.borderColor = isAct
                ? '#C084FC'
                : (darkMode ? 'rgba(156, 77, 204, 0.45)' : 'rgba(156, 77, 204, 0.35)')
              e.currentTarget.style.color = isAct
                ? '#C084FC'
                : (darkMode ? '#FFFFFF' : '#0F172A')
              e.currentTarget.style.boxShadow = darkMode
                ? '0 0 16px rgba(156, 77, 204, 0.25)'
                : '0 2px 10px rgba(156, 77, 204, 0.1)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <Brain size={16} color="#C084FC" />
            <span>Cerebro</span>
            <span style={{
              fontSize: '0.62rem',
              padding: '1px 5px',
              borderRadius: 6,
              background: darkMode ? 'rgba(156, 77, 204, 0.3)' : 'rgba(156, 77, 204, 0.18)',
              color: '#C084FC',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              IA
            </span>
          </Link>

          {/* ── Botón "Oficina 3D" (Metaverso Retail) ── */}
          <Link
            to="/oficina"
            aria-label="Oficina Virtual 3D de Zenic"
            title="Metaverso Retail: Oficina Virtual 3D 🏢"
            className="nav-oficina-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.42rem 0.95rem',
              borderRadius: 999,
              background: location.pathname === '/oficina'
                ? (darkMode ? 'rgba(0, 229, 255, 0.25)' : 'rgba(0, 229, 255, 0.15)')
                : (darkMode ? 'rgba(0, 229, 255, 0.1)' : 'rgba(0, 229, 255, 0.08)'),
              border: `1.5px solid ${location.pathname === '/oficina'
                ? '#00E5FF'
                : (darkMode ? 'rgba(0, 229, 255, 0.45)' : 'rgba(0, 229, 255, 0.35)')}`,
              color: location.pathname === '/oficina'
                ? '#00E5FF'
                : (darkMode ? '#FFFFFF' : '#0F172A'),
              fontSize: '0.85rem',
              fontWeight: 800,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxShadow: darkMode
                ? '0 0 16px rgba(0, 229, 255, 0.25)'
                : '0 2px 10px rgba(0, 229, 255, 0.1)',
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#00E5FF'
              e.currentTarget.style.color = '#00E5FF'
              e.currentTarget.style.boxShadow = darkMode
                ? '0 0 24px rgba(0, 229, 255, 0.55)'
                : '0 4px 16px rgba(0, 229, 255, 0.3)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={e => {
              const isAct = location.pathname === '/oficina'
              e.currentTarget.style.borderColor = isAct
                ? '#00E5FF'
                : (darkMode ? 'rgba(0, 229, 255, 0.45)' : 'rgba(0, 229, 255, 0.35)')
              e.currentTarget.style.color = isAct
                ? '#00E5FF'
                : (darkMode ? '#FFFFFF' : '#0F172A')
              e.currentTarget.style.boxShadow = darkMode
                ? '0 0 16px rgba(0, 229, 255, 0.25)'
                : '0 2px 10px rgba(0, 229, 255, 0.1)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            <Building2 size={16} color="#00E5FF" />
            <span>Oficina 3D</span>
            <span style={{
              fontSize: '0.62rem',
              padding: '1px 5px',
              borderRadius: 6,
              background: darkMode ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.18)',
              color: '#00E5FF',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              VIVO
            </span>
          </Link>

          {/* Dark / Light mode toggle */}
          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            title={darkMode ? 'Cambiar a Modo Claro ☀️' : 'Cambiar a Modo Oscuro 🌙'}
            style={{
              width: 58,
              height: 30,
              borderRadius: 999,
              position: 'relative',
              border: 'none',
              cursor: 'pointer',
              background: darkMode ? 'rgba(156, 77, 204, 0.15)' : 'rgba(156, 77, 204, 0.12)',
              outline: `1.5px solid ${darkMode ? 'rgba(156, 77, 204, 0.4)' : 'rgba(156, 77, 204, 0.35)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 6px',
              flexShrink: 0,
              transition: 'all 0.3s',
            }}
          >
            <span style={{ fontSize: '0.8rem', zIndex: 1, lineHeight: 1, userSelect: 'none', opacity: darkMode ? 0.4 : 1 }}>☀️</span>
            <span style={{ fontSize: '0.8rem', zIndex: 1, lineHeight: 1, userSelect: 'none', opacity: darkMode ? 1 : 0.4 }}>🌙</span>
            <div style={{
              position: 'absolute',
              top: 3,
              left: darkMode ? 30 : 3,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: darkMode
                ? 'linear-gradient(135deg, #C084FC, #9C4DCC)'
                : 'linear-gradient(135deg, #9C4DCC, #4A2574)',
              boxShadow: darkMode
                ? '0 0 12px rgba(156, 77, 204, 0.8)'
                : '0 2px 8px rgba(74, 37, 116, 0.4)',
              transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: 0,
            }} />
          </button>

          {/* CTA button — desktop only */}
          <a
            href="/#agendar-demo"
            className="nav-cta"
            style={{
              padding: '0.55rem 1.35rem', borderRadius: 12,
              background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
              color: '#FFFFFF', fontSize: '0.875rem', fontWeight: 800,
              textDecoration: 'none',
              display: 'none', whiteSpace: 'nowrap',
              boxShadow: '0 4px 20px rgba(156, 77, 204, 0.45)',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 28px rgba(156, 77, 204, 0.7)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(156, 77, 204, 0.45)'; e.currentTarget.style.transform = 'none' }}
          >
            ⚡ Agendar Demo
          </a>

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
          background: darkMode ? 'rgba(8, 14, 21, 0.98)' : 'rgba(244, 246, 249, 0.98)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode ? 'rgba(156, 77, 204, 0.3)' : 'rgba(156, 77, 204, 0.2)'}`,
        }}>
          {NAV_LINKS.map((link, i, arr) => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block', padding: '0.65rem 0.5rem', fontSize: '0.95rem',
                color: location.pathname === link.to ? '#C084FC' : darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(61,74,96,0.8)',
                textDecoration: 'none',
                fontWeight: location.pathname === link.to ? 700 : 400,
                borderBottom: i < arr.length - 1 ? `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(61,74,96,0.05)'}` : 'none',
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/cerebro"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.65rem 0.5rem',
              fontSize: '0.95rem',
              color: location.pathname === '/cerebro' ? '#C084FC' : darkMode ? '#FFFFFF' : '#0F172A',
              textDecoration: 'none',
              fontWeight: 800,
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(61,74,96,0.05)'}`,
            }}
          >
            <Brain size={17} color="#C084FC" />
            <span>Cerebro IA</span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(156,77,204,0.25)', color: '#C084FC', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>NUEVO</span>
          </Link>

          <Link
            to="/oficina"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.65rem 0.5rem',
              fontSize: '0.95rem',
              color: location.pathname === '/oficina' ? '#00E5FF' : darkMode ? '#FFFFFF' : '#0F172A',
              textDecoration: 'none',
              fontWeight: 800,
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(61,74,96,0.05)'}`,
            }}
          >
            <Building2 size={17} color="#00E5FF" />
            <span>Oficina 3D (Metaverso)</span>
            <span style={{ fontSize: '0.65rem', background: 'rgba(0,229,255,0.2)', color: '#00E5FF', padding: '1px 6px', borderRadius: 4, fontWeight: 800 }}>3D VIVO</span>
          </Link>

          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.65rem 0.5rem',
            borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
            marginTop: '0.5rem',
          }}>
            <span style={{ fontSize: '0.85rem', color: darkMode ? '#E2E8F0' : '#1E293B', fontWeight: 600 }}>
              {darkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}
            </span>
            <button
              onClick={() => { toggleDarkMode(); }}
              style={{
                background: darkMode ? 'rgba(156,77,204,0.2)' : 'rgba(156,77,204,0.12)',
                border: `1px solid ${darkMode ? '#C084FC' : '#9C4DCC'}`,
                color: darkMode ? '#C084FC' : '#9C4DCC',
                borderRadius: 8, padding: '0.35rem 0.75rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              Cambiar a {darkMode ? '☀️ Claro' : '🌙 Oscuro'}
            </button>
          </div>
          <a
            href="/#agendar-demo"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'block', marginTop: '0.75rem', padding: '0.75rem', borderRadius: 10, background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)', color: '#FFFFFF', fontSize: '0.9rem', fontWeight: 800, textAlign: 'center', textDecoration: 'none' }}
          >
            ⚡ Agendar Demo 15 min
          </a>
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
