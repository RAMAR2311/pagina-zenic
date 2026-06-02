import { Card } from '@/components/ui/card'
import { Spotlight } from '@/components/ui/spotlight'
import { SplineScene } from '@/components/ui/spline'

interface SplineSectionProps {
  darkMode: boolean
}

const stats = [
  { value: '+10', label: 'Comercios activos' },
  { value: '6',    label: 'Sectores cubiertos' },
  { value: '99.9%', label: 'Uptime garantizado' },
  { value: '< 2s', label: 'Tiempo de respuesta' },
]

export function SplineSection({ darkMode }: SplineSectionProps) {
  return (
    <section
      style={{
        padding: 'clamp(3rem,6vw,6rem) clamp(0.5rem,2vw,1.5rem)',
        width: '100%',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'clamp(2rem,4vw,3.5rem)' }}>

        {/* Section label */}
        <div style={{ textAlign: 'center' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.55rem 1.4rem', borderRadius: 999,
            background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.08)',
            border: '1px solid rgba(156,77,204,0.25)',
            fontSize: '0.95rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const,
            color: '#9C4DCC',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
            Motor Inteligente · Tecnología 3D
          </span>
        </div>

        {/* Main interactive card */}
        <Card
          className="w-full relative overflow-hidden"
          style={{
            height: 'clamp(520px, 80vh, 780px)',
            background: darkMode ? 'rgba(10,8,18,0.97)' : 'rgba(13,11,20,0.96)',
            border: '1px solid rgba(156,77,204,0.2)',
            borderRadius: 28,
          }}
        >
          {/* Spotlight cursor effect */}
          <Spotlight size={320} />

          {/* Purple/cyan grid overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
            backgroundImage:
              'linear-gradient(rgba(156,77,204,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(156,77,204,0.8) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div style={{ display: 'flex', height: '100%', position: 'relative', zIndex: 10 }}>

            {/* LEFT — text content */}
            <div style={{
              flex: '0 0 auto', width: 'clamp(280px,40%,460px)',
              padding: 'clamp(2rem,5vw,3.5rem)',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1.25rem',
            }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '4px 12px', borderRadius: 999,
                background: 'rgba(128,222,234,0.08)', border: '1px solid rgba(128,222,234,0.2)',
                fontSize: '0.7rem', fontWeight: 700, color: '#80DEEA', alignSelf: 'flex-start',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#80DEEA', boxShadow: '0 0 8px #80DEEA', display: 'inline-block' }} />
                IA en tiempo real
              </div>

              <h2 style={{
                fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, lineHeight: 1.1,
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.6) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>
                El cerebro digital<br />de tu negocio
              </h2>

              <p style={{ fontSize: 'clamp(0.85rem,1.8vw,1rem)', lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', maxWidth: 360 }}>
                ZENIC procesa cada venta, inventario y movimiento de caja con inteligencia artificial.
                Tu negocio visible desde cualquier pantalla, en cualquier momento.
              </p>

              {/* Stats grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                {stats.map((s) => (
                  <div key={s.label} style={{
                    padding: '0.75rem', borderRadius: 14,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    <p style={{ fontSize: 'clamp(1.1rem,2.5vw,1.5rem)', fontWeight: 800, color: '#9C4DCC', lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              <a
                href="#contacto"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0.7rem 1.6rem', borderRadius: 12, alignSelf: 'flex-start', marginTop: '0.25rem',
                  background: 'linear-gradient(135deg, #4A2574, #9C4DCC)',
                  color: '#fff', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none',
                  boxShadow: '0 4px 20px rgba(156,77,204,0.3)',
                  transition: 'box-shadow 0.3s, transform 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 30px rgba(156,77,204,0.5)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(156,77,204,0.3)'
                  e.currentTarget.style.transform = 'none'
                }}
              >
                📅 Solicitar demo
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>

            {/* RIGHT — Spline 3D scene */}
            <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
              {/* Gradient mask on left edge to blend with text */}
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 80, zIndex: 2, pointerEvents: 'none',
                background: 'linear-gradient(to right, rgba(10,8,18,0.9), transparent)',
              }} />

              <SplineScene
                scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>

        {/* Bottom feature pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
          {[
            '⚡ POS ultrarrápido',
            '🔐 Aprobación remota',
            '🔄 Módulo de maneos',
            '📊 Cartera en vivo',
            '🤝 Pagos mixtos',
            '📱 Control desde celular',
          ].map((pill) => (
            <span key={pill} style={{
              padding: '0.4rem 1rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
              background: darkMode ? 'rgba(156,77,204,0.08)' : 'rgba(156,77,204,0.07)',
              border: '1px solid rgba(156,77,204,0.18)',
              color: darkMode ? 'rgba(255,255,255,0.65)' : 'rgba(61,74,96,0.75)',
            }}>
              {pill}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}
