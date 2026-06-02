const planes = [
  {
    nombre: 'ZENIC Estándar',
    precio: '$100.000',
    periodo: '/mes',
    precioNota: null,
    descripcion: 'Acceso completo a nuestro sistema y a todos los módulos estándar.',
    color: '#80DEEA',
    glow: 'rgba(128,222,234,0.15)',
    badge: null,
    features: [
      'Acceso a nuestro sistema ZENIC completo',
      'Todos los módulos estándar incluidos',
      'Inventario, ventas y reportes',
      'Actualizaciones continuas del sistema',
      'Soporte por chat',
    ],
    noIncluye: ['Personalización con tu marca', 'Módulos a la medida'],
  },
  {
    nombre: 'ZENIC Personalizado',
    precio: '$500.000',
    periodo: ' desarrollo + 1er mes',
    precioNota: 'Luego $80.000 / mes desde el 2.º mes',
    descripcion: 'El sistema con tu propia marca y módulos hechos a la medida de tu negocio.',
    color: '#9C4DCC',
    glow: 'rgba(156,77,204,0.2)',
    badge: '⭐ A tu medida',
    features: [
      'Todo lo del plan Estándar',
      'Sistema personalizado con tu marca (logo, colores e identidad)',
      'Módulos personalizados según tus necesidades',
      'Desarrollo a la medida de tu negocio',
      'Acompañamiento durante la implementación',
      'Soporte prioritario',
    ],
    noIncluye: [],
  },
]

const faqs = [
  { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Sí. Puedes hacer upgrade o downgrade desde tu panel de administración sin penalización. El cambio aplica al siguiente ciclo de facturación.' },
  { q: '¿Hay contrato de permanencia?', a: 'No. ZENIC funciona mes a mes. Si decides cancelar, lo haces desde el panel sin trámites ni cargos ocultos.' },
  { q: '¿Qué pasa con mis datos si cancelo?', a: 'Tus datos son tuyos. Tienes 30 días después de la cancelación para exportar toda tu información en formatos estándar (CSV, Excel).' },
  { q: '¿El soporte está incluido en todos los planes?', a: 'Sí. El plan Estándar incluye soporte por chat. El plan Personalizado tiene soporte prioritario y acompañamiento durante toda la implementación.' },
  { q: '¿Cómo funciona el cobro del plan Personalizado?', a: 'El plan Personalizado tiene un pago inicial de $500.000 que cubre el desarrollo a la medida y el primer mes de uso. A partir del segundo mes, pagas $80.000 mensuales como cualquier suscripción.' },
  { q: '¿ZENIC requiere conexión a internet?', a: 'Sí. ZENIC funciona en la nube y requiere conexión a internet para operar. Esto nos permite garantizar que tus datos siempre estén actualizados, seguros y accesibles desde cualquier dispositivo en tiempo real.' },
]

import GalaxyBackground from '../components/GalaxyBackground'

export default function Precios({ darkMode }) {
  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,2.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: darkMode ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(156,77,204,0.08) 0%, transparent 70%)' : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(156,77,204,0.05) 0%, transparent 70%)' }} />
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem', background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.08)', border: '1px solid rgba(156,77,204,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C4DCC' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
            Planes & Precios
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Sin letras pequeñas,<br />
            <span style={{ background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              sin contratos eternos
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.7, color: `${dim}0.6)` }}>
            Elige el plan que se adapta al tamaño de tu negocio. Cancela cuando quieras.
          </p>
        </div>
      </section>

      {/* ── TOGGLE ANUAL/MENSUAL (visual) ── */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(1rem,3vw,2rem)' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '0.4rem 1rem', borderRadius: 999, background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(156,77,204,0.12)'}`, fontSize: '0.85rem', color: `${dim}0.6)` }}>
          Facturación mensual
          <span style={{ padding: '2px 10px', borderRadius: 999, background: 'rgba(16,185,129,0.12)', color: '#10B981', fontSize: '0.72rem', fontWeight: 700 }}>Ahorra 20% anual</span>
        </span>
      </div>

      {/* ── PLANES ── */}
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(4rem,8vw,6rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(1rem,3vw,1.75rem)' }}>
          {planes.map((plan, i) => (
            <div key={i} style={{ position: 'relative', padding: 'clamp(1.75rem,4vw,2.5rem)', borderRadius: 24, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.75)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: `1px solid ${plan.color}30`, boxShadow: `0 4px 40px ${plan.glow}`, display: 'flex', flexDirection: 'column' }}>
              {plan.badge && (
                <span style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', padding: '4px 16px', borderRadius: 999, background: plan.color, color: '#fff', fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: `0 4px 16px ${plan.glow}` }}>
                  {plan.badge}
                </span>
              )}
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: plan.color, marginBottom: '0.25rem' }}>{plan.nombre}</h3>
                <p style={{ fontSize: '0.85rem', color: `${dim}0.55)`, marginBottom: '1rem' }}>{plan.descripcion}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: 'clamp(2rem,4vw,2.75rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60' }}>{plan.precio}</span>
                  <span style={{ fontSize: '0.9rem', color: `${dim}0.45)` }}>{plan.periodo}</span>
                </div>
                {plan.precioNota && (
                  <p style={{ marginTop: 6, fontSize: '0.8rem', fontWeight: 600, color: plan.color }}>
                    {plan.precioNota}
                  </p>
                )}
              </div>
              <div style={{ height: 1, background: `${plan.color}20`, marginBottom: '1.25rem' }} />
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
                {plan.features.map((f, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem', color: darkMode ? 'rgba(255,255,255,0.75)' : 'rgba(61,74,96,0.85)' }}>
                    <span style={{ color: plan.color, flexShrink: 0, marginTop: 2 }}>✓</span> {f}
                  </li>
                ))}
                {plan.noIncluye.map((f, j) => (
                  <li key={`no-${j}`} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: '0.875rem', color: `${dim}0.3)`, textDecoration: 'line-through' }}>
                    <span style={{ flexShrink: 0, marginTop: 2 }}>✗</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/contacto" style={{ display: 'block', marginTop: '1.75rem', padding: '0.8rem', borderRadius: 14, textAlign: 'center', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', background: plan.badge ? `linear-gradient(135deg, #4A2574, ${plan.color})` : 'transparent', color: plan.badge ? '#fff' : plan.color, border: `1.5px solid ${plan.color}60`, boxShadow: plan.badge ? `0 4px 20px ${plan.glow}` : 'none', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {plan.badge ? 'Solicitar personalización' : 'Empezar ahora'}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)', paddingBottom: 'clamp(4rem,8vw,7rem)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60' }}>Preguntas frecuentes</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {faqs.map((f, i) => (
              <div key={i} style={{ padding: '1.25rem 1.5rem', borderRadius: 16, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(156,77,204,0.1)'}` }}>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.5rem' }}>💬 {f.q}</p>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: `${dim}0.6)` }}>{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
