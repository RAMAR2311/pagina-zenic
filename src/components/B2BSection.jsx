import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const clientData = [
  { name: 'Tienda El Paisano',    saldo: '$2.450.000', estado: 'Al día',    abono: '$800.000',   dias: 0 },
  { name: 'Almacén La Estrella',  saldo: '$5.120.000', estado: 'Mora leve', abono: '$1.200.000', dias: 8 },
  { name: 'Variedades Don José',  saldo: '$890.000',   estado: 'Al día',    abono: '$890.000',   dias: 0 },
  { name: 'Cell Center Express',  saldo: '$3.750.000', estado: 'Mora',      abono: '$500.000',   dias: 22 },
  { name: 'Boutique María F.',    saldo: '$1.680.000', estado: 'Al día',    abono: '$1.680.000', dias: 0 },
]

const estadoColor = {
  'Al día':    { bg: 'rgba(34,197,94,0.12)',  text: 'rgb(74,222,128)',   border: 'rgba(34,197,94,0.2)' },
  'Mora leve': { bg: 'rgba(234,179,8,0.12)',  text: 'rgb(250,204,21)',   border: 'rgba(234,179,8,0.2)' },
  'Mora':      { bg: 'rgba(239,68,68,0.12)',  text: 'rgb(252,165,165)',  border: 'rgba(239,68,68,0.2)' },
}

export default function B2BSection({ darkMode }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.reveal-item')
    items?.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(50px)' })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target.querySelectorAll('.reveal-item'), {
              y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const glassCard = {
    borderRadius: 20,
    background: darkMode ? 'rgba(26,21,37,0.75)' : 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${darkMode ? 'rgba(156,77,204,0.12)' : 'rgba(156,77,204,0.18)'}`,
  }

  return (
    <section
      id="b2b"
      ref={sectionRef}
      style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1rem,5vw,3rem)', width: '100%' }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal-item" style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
          <span className="glass" style={{
            display: 'inline-block', padding: '0.3rem 1rem', borderRadius: 999,
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#4A2574', marginBottom: '1rem',
          }}>
            B2B / Bodega
          </span>
          <h2 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800, marginBottom: '1rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Confianza <span className="text-gradient">mayorista</span>
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(61,74,96,0.65)', maxWidth: 560, margin: '0 auto' }}>
            Carteras, abonos y facturación masiva. Cierre de caja sin enredos.
          </p>
        </div>

        {/* Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'start' }}>

          {/* Stat cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.75rem,2vw,1.5rem)' }}>
            {[
              { label: 'Cartera Total', value: '$13.890.000', sub: '+12% vs mes anterior', subColor: 'rgb(74,222,128)' },
              { label: 'Recaudo del Mes', value: '$5.070.000', progress: 65 },
              { label: 'Clientes Activos', value: '48', sub: '5 nuevos este mes' },
            ].map((stat, i) => (
              <div key={i} className="reveal-item" style={{ ...glassCard, padding: 'clamp(1rem,3vw,1.5rem)' }}>
                <p style={{ fontSize: '0.8rem', marginBottom: 4, color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.5)' }}>{stat.label}</p>
                <p style={{ fontSize: 'clamp(1.5rem,4vw,2rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60' }}>{stat.value}</p>
                {stat.progress ? (
                  <>
                    <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'rgba(74,37,116,0.15)' }}>
                      <div style={{ height: '100%', width: `${stat.progress}%`, borderRadius: 3, background: 'linear-gradient(to right, #4A2574, #80DEEA)' }} />
                    </div>
                    <p style={{ fontSize: '0.75rem', marginTop: 4, color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(61,74,96,0.4)' }}>{stat.progress}% de meta mensual</p>
                  </>
                ) : (
                  <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: '0.72rem', background: 'rgba(34,197,94,0.1)', color: stat.subColor || (darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(61,74,96,0.45)') }}>{stat.sub}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="reveal-item" style={{ ...glassCard, overflow: 'hidden', gridColumn: 'span 2' }}>
            <div style={{ padding: 'clamp(1rem,3vw,1.5rem)', borderBottom: `1px solid ${darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.12)'}` }}>
              <h3 style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60' }}>Saldos Pendientes</h3>
              <p style={{ fontSize: '0.8rem', color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.5)' }}>Vista en tiempo real de la cartera</p>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'clamp(0.75rem,1.5vw,0.875rem)' }}>
                <thead>
                  <tr style={{ color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(61,74,96,0.4)' }}>
                    {['Cliente', 'Saldo', 'Estado', 'Último Abono'].map(h => (
                      <th key={h} style={{ padding: 'clamp(0.5rem,2vw,0.75rem) clamp(0.75rem,2vw,1.5rem)', textAlign: 'left', fontWeight: 600, whiteSpace: 'nowrap', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clientData.map((c, i) => {
                    const s = estadoColor[c.estado]
                    return (
                      <tr key={i} style={{ borderTop: `1px solid ${darkMode ? 'rgba(156,77,204,0.06)' : 'rgba(61,74,96,0.06)'}`, transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(156,77,204,0.06)' : 'rgba(156,77,204,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: 'clamp(0.6rem,2vw,1rem) clamp(0.75rem,2vw,1.5rem)', fontWeight: 600, color: darkMode ? 'rgba(255,255,255,0.8)' : '#3D4A60', whiteSpace: 'nowrap' }}>{c.name}</td>
                        <td style={{ padding: 'clamp(0.6rem,2vw,1rem) clamp(0.75rem,2vw,1.5rem)', fontFamily: 'monospace', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(61,74,96,0.7)', whiteSpace: 'nowrap' }}>{c.saldo}</td>
                        <td style={{ padding: 'clamp(0.6rem,2vw,1rem) clamp(0.75rem,2vw,1.5rem)' }}>
                          <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 999, fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.text, border: `1px solid ${s.border}` }}>{c.estado}</span>
                        </td>
                        <td style={{ padding: 'clamp(0.6rem,2vw,1rem) clamp(0.75rem,2vw,1.5rem)', fontFamily: 'monospace', color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.5)', whiteSpace: 'nowrap' }}>{c.abono}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '1rem', textAlign: 'center', borderTop: `1px solid ${darkMode ? 'rgba(156,77,204,0.08)' : 'rgba(156,77,204,0.1)'}` }}>
              <button style={{ fontSize: '0.85rem', color: '#9C4DCC', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                Ver cartera completa →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
