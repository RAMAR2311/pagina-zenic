import Hero from '../components/Hero'
import { Hero as AnimatedHero } from '../components/ui/animated-hero'
import { SplineSection } from '../components/SplineSection'
import StreetPowerSection from '../components/StreetPowerSection'
import ClientsCloud from '../components/ClientsCloud'

export default function Home({ darkMode }) {
  return (
    <>
      {/* Hero split: Brain 3D + Animated text side-by-side on desktop */}
      <div className="hero-split">
        <div className="hero-split-left">
          <Hero darkMode={darkMode} />
        </div>
        <div className="hero-split-right">
          <AnimatedHero darkMode={darkMode} />
        </div>
      </div>

      <ClientsCloud darkMode={darkMode} />

      <SplineSection darkMode={darkMode} />

      {/* ── PILARES ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,2.5rem)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: darkMode ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(156,77,204,0.08) 0%, transparent 70%)' : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(156,77,204,0.05) 0%, transparent 70%)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.08)', border: '1px solid rgba(156,77,204,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C4DCC' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
              Soluciones Digitales Integrales
            </span>
          </div>
          <h2 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 1.1, textAlign: 'center', marginBottom: '1.5rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Tu aliado tecnológico para{' '}
            <span style={{ background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              profesionalizar tu negocio
            </span>
          </h2>
          <p style={{ fontSize: 'clamp(1rem,2.2vw,1.2rem)', lineHeight: 1.8, textAlign: 'center', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(61,74,96,0.6)', maxWidth: 740, margin: '0 auto 3rem' }}>
            ZENIC S.A.S. es una empresa de tecnología enfocada en la creación de soluciones digitales integrales y sistemas de inteligencia de negocios para el sector comercial. Transformamos la operación de tu empresa a través de la digitalización y el análisis de datos en tiempo real.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(1rem,2.5vw,1.5rem)' }}>
            {[
              { icon: '🧠', titulo: 'Inteligencia de Negocios', desc: 'Convierte cada venta, movimiento de inventario y dato de cartera en información accionable para tomar mejores decisiones.', color: '#9C4DCC' },
              { icon: '⚡', titulo: 'Digitalización Real', desc: 'No vendemos software genérico. Construimos soluciones adaptadas al ritmo y las necesidades reales del comercio colombiano.', color: '#80DEEA' },
              { icon: '🤝', titulo: 'Socio Estratégico', desc: 'Acompañamos cada etapa del proceso: implementación, capacitación y crecimiento. Estamos contigo mucho más allá de la venta.', color: '#10B981' },
              { icon: '🔐', titulo: 'Veracidad Digital', desc: 'Ayudamos a las marcas a construir su credibilidad digital y comercial, combinando presencia física con validación en entornos digitales.', color: '#F59E0B' },
              { icon: '📊', titulo: 'Datos en Tiempo Real', desc: 'Dashboards gerenciales actualizados al instante. Toma decisiones con información precisa sin esperar reportes del día siguiente.', color: '#EC4899' },
              { icon: '🚀', titulo: 'Escalabilidad', desc: 'Desde un solo local hasta cadenas con múltiples sedes. ZENIC crece contigo sin que tengas que cambiar de sistema.', color: '#F97316' },
            ].map((p, i) => (
              <div key={i} style={{ padding: '1.5rem', borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${p.color}20`, transition: 'box-shadow 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 28px ${p.color}25`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{p.icon}</span>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: p.color, marginBottom: '0.5rem' }}>{p.titulo}</h3>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(61,74,96,0.6)' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StreetPowerSection darkMode={darkMode} />

      {/* ── BANNER CTA ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          borderRadius: 28, overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(135deg, #2D1456 0%, #4A2574 40%, #1a3a5c 100%)',
          padding: 'clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: '2rem',
          boxShadow: '0 20px 60px rgba(156,77,204,0.35)',
        }}>
          {/* Glow decorativo */}
          <div style={{ position: 'absolute', top: '-40%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(128,222,234,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-30%', left: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(156,77,204,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />

          {/* Texto */}
          <div style={{ position: 'relative', flex: '1 1 340px' }}>
            <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#80DEEA', marginBottom: '0.75rem' }}>
              🔥 Tu negocio merece más que eso
            </p>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.1, color: '#fff', marginBottom: '1rem' }}>
              Tu competencia ya usa IA.<br />
              ¿Tú sigues en{' '}
              <span style={{ color: '#80DEEA' }}>modo cuaderno?</span>
            </h2>
            <p style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: 500 }}>
              Cada día que operas sin datos reales es dinero que se va sin que lo veas. ZENIC te da el control total de tu negocio desde el primer día.
            </p>
          </div>

          {/* CTA */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem', flex: '0 0 auto' }}>
            <a
              href="/contacto"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '1rem 2.25rem', borderRadius: 16,
                background: 'linear-gradient(135deg, #80DEEA, #9C4DCC)',
                color: '#fff', fontWeight: 800, fontSize: 'clamp(1rem,2vw,1.15rem)',
                textDecoration: 'none', whiteSpace: 'nowrap',
                boxShadow: '0 8px 32px rgba(128,222,234,0.35)',
                transition: 'transform 0.25s, box-shadow 0.25s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(128,222,234,0.5)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(128,222,234,0.35)' }}
            >
              📅 Agenda tu demo gratis
            </a>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', paddingLeft: '0.25rem' }}>
              Respuesta en menos de 4 horas hábiles
            </p>
          </div>
        </div>
      </section>

      <style>{`
        /* Mobile: stacked (default) */
        .hero-split {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .hero-split-left,
        .hero-split-right {
          width: 100%;
          min-width: 0;
        }

        /* Desktop: side-by-side, each 50%, full viewport tall */
        @media (min-width: 1024px) {
          .hero-split {
            flex-direction: row;
            min-height: 100vh;
            align-items: stretch;
            position: relative;
          }
          .hero-split-left,
          .hero-split-right {
            width: 50%;
            flex: 1 1 50%;
          }
          .hero-split-right {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          /* Subtle divider between the two columns */
          .hero-split-right {
            border-left: 1px solid ${darkMode ? 'rgba(156,77,204,0.12)' : 'rgba(156,77,204,0.08)'};
          }
        }
      `}</style>
    </>
  )
}
