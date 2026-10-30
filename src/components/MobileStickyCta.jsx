import { useState, useEffect } from 'react'
import { Zap, Calculator, Calendar } from 'lucide-react'

export default function MobileStickyCta({ darkMode, onBookClick, onRoiClick }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show only after scrolling down a bit (past the initial hero header)
      setIsVisible(window.scrollY > 250)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!isVisible) return null

  return (
    <aside
      aria-label="Acciones rápidas móviles"
      className="mobile-sticky-cta"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 45,
        padding: '0.65rem 0.85rem calc(0.65rem + env(safe-area-inset-bottom, 0px))',
        background: darkMode ? 'rgba(8, 14, 21, 0.95)' : 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(0, 0, 0, 0.08)'}`,
        boxShadow: darkMode ? '0 -10px 25px rgba(0, 0, 0, 0.5)' : '0 -10px 25px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        gap: '0.6rem',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s, border-color 0.3s',
      }}
    >
      <a
        href="#calculadora-roi"
        onClick={(e) => {
          if (onRoiClick) {
            e.preventDefault()
            onRoiClick()
          }
        }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '0.75rem 0.6rem',
          borderRadius: 12,
          background: darkMode ? 'rgba(0, 229, 255, 0.1)' : 'rgba(2, 132, 199, 0.08)',
          border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.35)' : 'rgba(2, 132, 199, 0.3)'}`,
          color: darkMode ? '#00E5FF' : '#0284C7',
          fontSize: '0.82rem',
          fontWeight: 800,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <Calculator size={15} />
        <span>Calcular ROI</span>
      </a>

      <a
        href="#agendar-demo"
        onClick={(e) => {
          if (onBookClick) {
            e.preventDefault()
            onBookClick()
          }
        }}
        style={{
          flex: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          padding: '0.75rem 0.6rem',
          borderRadius: 12,
          background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
          color: '#FFFFFF',
          fontSize: '0.84rem',
          fontWeight: 900,
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          boxShadow: '0 4px 18px rgba(156, 77, 204, 0.45)',
        }}
      >
        <Zap size={15} fill="#FFFFFF" />
        <span>Agendar Demo (15 min)</span>
      </a>

      <style>{`
        /* Only display on screens smaller than 768px (mobile & tablet) */
        @media (min-width: 768px) {
          .mobile-sticky-cta {
            display: none !important;
          }
        }
      `}</style>
    </aside>
  )
}
