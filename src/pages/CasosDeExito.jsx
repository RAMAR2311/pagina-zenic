const casos = [
  {
    empresa: 'MC Innovación Financiera',
    sector: 'Fintech & Servicios Financieros',
    emoji: '🏦',
    color: '#9C4DCC',
    glow: 'rgba(156,77,204,0.18)',
    reto: 'Gestión de clientes y cartera dispersa en hojas de cálculo sin trazabilidad real.',
    solucion: 'Implementación de inteligencia de negocios con dashboard en tiempo real, control de cartera y módulo de seguimiento de clientes corporativos.',
    resultados: [
      { valor: '68%', label: 'Reducción de tiempo en reportes' },
      { valor: '3×', label: 'Más visibilidad sobre cartera activa' },
      { valor: '0', label: 'Errores en conciliación mensual' },
    ],
    testimonio: 'ZENIC nos dio la visibilidad que necesitábamos para tomar decisiones financieras con datos reales, no con intuición.',
    cargo: 'Gerencia General — Mally Cabrera',
  },
  {
    empresa: 'Tekfix',
    sector: 'Accesorios de Celulares & Tecnología',
    emoji: '📱',
    color: '#80DEEA',
    glow: 'rgba(128,222,234,0.18)',
    reto: 'Inventario de accesorios sin control, ventas perdidas por desconocer el stock real y registro de clientes hecho en papel sin trazabilidad.',
    solucion: 'POS táctil con gestión de accesorios por referencia y código, control de inventario en tiempo real y reportes de rotación para optimizar las compras.',
    resultados: [
      { valor: '100%', label: 'Inventario con trazabilidad digital' },
      { valor: '40%', label: 'Reducción de pérdidas por descontrol' },
      { valor: '2 min', label: 'Tiempo promedio de atención al cliente' },
    ],
    testimonio: 'Antes no sabíamos qué teníamos en el local. Hoy vendemos más porque sabemos exactamente qué hay y qué se mueve.',
    cargo: 'Diego — Tekfix',
  },
  {
    empresa: 'Bendito Encanto',
    sector: 'Moda & Boutique',
    emoji: '👗',
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.18)',
    reto: 'Inventario de tallas y colores sin control. Ventas perdidas por no saber qué había en stock en tiempo real.',
    solucion: 'POS táctil con gestión de tallas, colores y temporadas. Alertas de stock bajo y análisis de rotación por referencia para compras más inteligentes.',
    resultados: [
      { valor: '35%', label: 'Aumento en rotación de inventario' },
      { valor: '0', label: 'Ventas perdidas por falta de info' },
      { valor: '1 día', label: 'Para hacer inventario completo' },
    ],
    testimonio: 'ZENIC me dio el control que tenía en la cabeza pero ahora en la pantalla. Compro mejor, vendo más y pierdo menos.',
    cargo: 'Jenni Ramírez — Bendito Encanto',
  },
]

const stats = [
  { valor: '+10', label: 'Clientes activos', icon: '🏪' },
  { valor: '6', label: 'Sectores cubiertos', icon: '📦' },
  { valor: '99.9%', label: 'Uptime garantizado', icon: '⚡' },
  { valor: '0', label: 'Contratos eternos', icon: '🤝' },
]

import GalaxyBackground from '../components/GalaxyBackground'
import GalleryHoverCarousel from '../components/ui/gallery-hover-carousel'
import { useContent } from '../store/ContentContext'

export default function CasosDeExito({ darkMode }) {
  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'
  const { content } = useContent()

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── GALERÍA DESTACADA (carrusel hover) con fondo de galaxia ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <GalleryHoverCarousel darkMode={darkMode} items={content.casos} />
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,2.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: darkMode ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(156,77,204,0.08) 0%, transparent 70%)' : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(156,77,204,0.05) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem', background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.08)', border: '1px solid rgba(156,77,204,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C4DCC' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
            Casos de Éxito
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Negocios reales,<br />
            <span style={{ background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              resultados reales
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2.2vw,1.2rem)', lineHeight: 1.75, color: `${dim}0.6)`, maxWidth: 560, margin: '0 auto' }}>
            No son demos ni simulaciones. Son empresas colombianas que transformaron su operación con ZENIC.
          </p>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(3rem,5vw,4rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(1rem,2.5vw,1.5rem)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: '1.5rem', borderRadius: 20, textAlign: 'center', background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(156,77,204,0.1)'}` }}>
              <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(1.75rem,4vw,2.5rem)', fontWeight: 900, color: '#9C4DCC', lineHeight: 1 }}>{s.valor}</div>
              <div style={{ fontSize: '0.8rem', color: `${dim}0.55)`, marginTop: '0.35rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CASOS ── */}
      <section style={{ padding: 'clamp(2rem,5vw,4rem) clamp(1rem,5vw,2.5rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(2rem,5vw,3.5rem)' }}>
          {casos.map((c, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(1rem,3vw,2rem)', alignItems: 'start' }}>

              {/* Info principal */}
              <div style={{ padding: 'clamp(1.5rem,4vw,2.5rem)', borderRadius: 24, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', border: `1px solid ${c.color}25`, boxShadow: `0 4px 40px ${c.glow}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `${c.glow}`, border: `1px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0 }}>
                    {c.emoji}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.15rem' }}>{c.empresa}</h3>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: c.color }}>{c.sector}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `${dim}0.4)`, marginBottom: '0.35rem' }}>El reto</p>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: `${dim}0.65)` }}>{c.reto}</p>
                </div>
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: `${dim}0.4)`, marginBottom: '0.35rem' }}>La solución</p>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: `${dim}0.65)` }}>{c.solucion}</p>
                </div>
              </div>

              {/* Resultados + testimonio */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {c.resultados.map((r, j) => (
                    <div key={j} style={{ padding: '1rem 0.75rem', borderRadius: 16, textAlign: 'center', background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${c.color}20` }}>
                      <div style={{ fontSize: 'clamp(1.25rem,3vw,1.75rem)', fontWeight: 900, color: c.color, lineHeight: 1 }}>{r.valor}</div>
                      <div style={{ fontSize: '0.7rem', color: `${dim}0.5)`, marginTop: '0.3rem', lineHeight: 1.3 }}>{r.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '1.5rem', borderRadius: 20, background: darkMode ? `${c.glow}` : `${c.glow}`, border: `1px solid ${c.color}25` }}>
                  <p style={{ fontSize: '1rem', lineHeight: 1.65, color: darkMode ? 'rgba(255,255,255,0.85)' : '#3D4A60', fontStyle: 'italic', marginBottom: '0.75rem' }}>
                    "{c.testimonio}"
                  </p>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: c.color }}>{c.cargo}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(4rem,8vw,7rem)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: 'clamp(2rem,5vw,3.5rem)', borderRadius: 28, background: darkMode ? 'rgba(156,77,204,0.08)' : 'rgba(156,77,204,0.06)', border: '1px solid rgba(156,77,204,0.2)' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem' }}>¿Tu empresa podría ser el próximo caso de éxito?</h2>
          <p style={{ fontSize: '1rem', color: `${dim}0.55)`, marginBottom: '1.75rem' }}>Agenda una auditoría gratuita y te mostramos exactamente cómo ZENIC impacta un negocio como el tuyo.</p>
          <a href="/contacto" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.9rem 2.25rem', borderRadius: 14, background: 'linear-gradient(135deg, #4A2574, #9C4DCC)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(156,77,204,0.35)', transition: 'box-shadow 0.3s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 36px rgba(156,77,204,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(156,77,204,0.35)'; e.currentTarget.style.transform = 'none' }}
          >
            📅 Agendar auditoría gratis
          </a>
        </div>
      </section>

    </div>
  )
}
