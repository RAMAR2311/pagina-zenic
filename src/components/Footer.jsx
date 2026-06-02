import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Footer({ darkMode }) {
  const border = darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(61,74,96,0.1)'
  const textMuted = darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.5)'
  const textBase = darkMode ? '#E8E8F2' : '#3D4A60'

  const navigate = useNavigate()
  const clicks = useRef({ count: 0, timer: null })

  // Hidden admin access: triple-click the © symbol within 1.2s
  const handleSecretClick = () => {
    const c = clicks.current
    c.count += 1
    clearTimeout(c.timer)
    if (c.count >= 3) {
      c.count = 0
      navigate('/admin')
      return
    }
    c.timer = setTimeout(() => { c.count = 0 }, 1200)
  }

  return (
    <footer
      id="contacto"
      style={{
        padding: 'clamp(3rem,8vw,5rem) clamp(1rem,5vw,3rem)',
        borderTop: `1px solid ${border}`,
        width: '100%',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>

          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(74,37,116,0.3)' }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: '1rem' }}>Z</span>
              </div>
              <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: '1.8rem', color: textBase }}>ZENIC</span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, maxWidth: 300, color: textMuted }}>
              Software de gestión comercial con inteligencia artificial. Diseñado para el comercio real colombiano.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: '1.25rem' }}>
              {['twitter', 'github', 'linkedin'].map(social => (
                <a key={social} href="#"
                  style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(61,74,96,0.05)', color: textMuted, transition: 'all 0.2s', border: `1px solid ${border}` }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#9C4DCC'; e.currentTarget.style.borderColor = 'rgba(156,77,204,0.3)' }}
                  onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.borderColor = border }}
                >
                  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                    {social === 'twitter' && <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>}
                    {social === 'github' && <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>}
                    {social === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Producto', links: ['Módulos', 'Funcionalidades', 'B2B / Bodega', 'Precios'] },
            { title: 'Soporte', links: ['Portal Clientes', 'Documentación', 'WhatsApp', 'Changelog'] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: textMuted, marginBottom: '1rem' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" style={{ fontSize: '0.875rem', color: textMuted, textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#9C4DCC'}
                      onMouseLeave={e => e.currentTarget.style.color = textMuted}
                    >{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: '1.5rem', borderTop: `1px solid ${border}`, display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ fontSize: '0.78rem', color: textMuted }}>
            <span
              onClick={handleSecretClick}
              title=""
              style={{ cursor: 'default', userSelect: 'none' }}
            >&copy;</span>
            {' '}2026 ZENIC S.A.S. — Colombia.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgb(74,222,128)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.78rem', color: textMuted }}>Todos los sistemas operativos</span>
          </div>
        </div>
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    </footer>
  )
}
