
const modules = [
  {
    emoji: '👗',
    tag: 'Moda',
    title: 'Boutiques & Ropa',
    pain: 'Tallas agotadas sin saberlo',
    description: 'Control de tallas, colores y temporadas. Inventario visual con alertas de stock bajo y análisis de rotación por referencia.',
    features: ['Control de tallas y colores', 'Alertas de stock bajo', 'Temporadas y colecciones', 'Rotación por referencia'],
    accent: '#9C4DCC',
    glow: 'rgba(156,77,204,0.18)',
  },
  {
    emoji: '💻',
    tag: 'Tecnología',
    title: 'Tech & Electrónica',
    pain: 'Garantías sin seguimiento',
    description: 'Gestión de garantías, números de serie y reparaciones. Dashboard técnico con historial completo por equipo.',
    features: ['Control de garantías', 'Números de serie', 'Módulo de reparaciones', 'Historial por equipo'],
    accent: '#80DEEA',
    glow: 'rgba(128,222,234,0.18)',
  },
  {
    emoji: '🛒',
    tag: 'Mercado',
    title: 'Minimercados',
    pain: 'Vencimientos sin control',
    description: 'Lector de códigos, vencimientos automáticos y cartera de clientes frecuentes. POS ultrarrápido para filas cortas.',
    features: ['Lector de códigos', 'Control de vencimientos', 'Cartera frecuentes', 'POS ultrarrápido'],
    accent: '#F59E0B',
    glow: 'rgba(245,158,11,0.18)',
  },
  {
    emoji: '💆',
    tag: 'Bienestar',
    title: 'Salud & Belleza',
    pain: 'Citas dobles y comisiones perdidas',
    description: 'Agenda de citas, control de servicios y comisiones por estilista. Fidelización con historial detallado por cliente.',
    features: ['Agenda de citas', 'Comisiones por estilista', 'Historial de cliente', 'Fidelización'],
    accent: '#EC4899',
    glow: 'rgba(236,72,153,0.18)',
  },
  {
    emoji: '🚚',
    tag: 'Distribución',
    title: 'Mayoristas & Distribución',
    pain: 'Pedidos en campo sin control',
    description: 'Rutas de entrega, cartera mayorista y pedidos en campo. Sincronización offline para zonas sin señal.',
    features: ['Rutas de entrega', 'Cartera mayorista', 'Pedidos en campo', 'Modo offline'],
    accent: '#4A2574',
    glow: 'rgba(74,37,116,0.25)',
  },
  {
    emoji: '🍽️',
    tag: 'Food',
    title: 'Restaurantes & Puestos',
    pain: 'Comandas perdidas y caja descuadrada',
    description: 'Comandas por mesa, pantalla de cocina y control de insumos. Carta digital con QR y pedidos en línea integrados.',
    features: ['Comandas por mesa', 'Pantalla de cocina', 'Control de insumos', 'Carta digital QR'],
    accent: '#F97316',
    glow: 'rgba(249,115,22,0.18)',
  },
]

export default function ModulesSection({ darkMode }) {
  const handleMouseEnter = (e) => {
    e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)'
    e.currentTarget.style.transition = 'transform 0.4s ease'
  }
  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = 'translateY(0) scale(1)'
    e.currentTarget.style.transition = 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)'
  }

  return (
    <section
      id="modulos"
      style={{
        padding: 'clamp(4rem,8vw,8rem) clamp(1rem,5vw,2.5rem)',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Subtle grid bg */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
        backgroundImage:
          'linear-gradient(rgba(156,77,204,1) 1px,transparent 1px),linear-gradient(90deg,rgba(156,77,204,1) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,4rem)' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem',
            background: darkMode ? 'rgba(156,77,204,0.08)' : 'rgba(156,77,204,0.1)',
            border: '1px solid rgba(156,77,204,0.25)',
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#9C4DCC',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
            Universal Retail — 6 Sectores
          </span>

          <h2 style={{
            fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 800, lineHeight: 1.1,
            color: darkMode ? '#fff' : '#3D4A60',
            marginBottom: '1rem',
          }}>
            ZENIC 360<br />
            <span style={{
              background: 'linear-gradient(135deg, #9C4DCC 0%, #80DEEA 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Universal Retail OS
            </span>
          </h2>

          <p style={{
            fontSize: 'clamp(0.9rem,2vw,1.1rem)', lineHeight: 1.7,
            color: darkMode ? '#a0aab8' : '#5a6a7e',
            maxWidth: 520, margin: '0 auto',
          }}>
            Un solo sistema diseñado para adaptarse a cualquier tipo de comercio colombiano.
          </p>
        </div>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: 'clamp(1rem,2.5vw,1.5rem)',
        }}>
          {modules.map((mod, i) => (
            <div
              key={i}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              style={{
                padding: 'clamp(1.25rem,3vw,1.75rem)',
                borderRadius: 20,
                background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(156,77,204,0.1)'}`,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: `0 4px 30px ${mod.glow}`,
                cursor: 'default',
                transition: 'box-shadow 0.3s',
              }}
            >
              {/* Top row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, fontSize: '1.5rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: darkMode ? `${mod.glow}` : `${mod.glow}`,
                  border: `1px solid ${mod.accent}30`,
                  flexShrink: 0,
                }}>
                  {mod.emoji}
                </div>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: mod.accent,
                  padding: '3px 10px', borderRadius: 999,
                  background: `${mod.accent}15`,
                  border: `1px solid ${mod.accent}30`,
                }}>
                  {mod.tag}
                </span>
              </div>

              {/* Title + pain */}
              <h3 style={{
                fontSize: 'clamp(1rem,2.2vw,1.2rem)', fontWeight: 700, marginBottom: '0.25rem',
                color: darkMode ? '#ffffff' : '#2d3748',
              }}>
                {mod.title}
              </h3>
              <p style={{
                fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.75rem',
                color: mod.accent, display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span>⚠️</span> {mod.pain}
              </p>

              {/* Description */}
              <p style={{
                fontSize: 'clamp(0.8rem,1.6vw,0.88rem)', lineHeight: 1.65, marginBottom: '1rem',
                color: darkMode ? '#a0aab8' : '#4a5568',
              }}>
                {mod.description}
              </p>

              {/* Features */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {mod.features.map((f, j) => (
                  <li key={j} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontSize: '0.78rem', color: darkMode ? '#8b97a8' : '#4a5568',
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: mod.accent, flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Accent bottom bar */}
              <div style={{
                marginTop: '1.25rem', height: 2, borderRadius: 999,
                background: `linear-gradient(to right, ${mod.accent}, transparent)`,
                opacity: 0.4,
              }} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 'clamp(2.5rem,5vw,4rem)',
          padding: 'clamp(1.5rem,4vw,2.5rem)',
          borderRadius: 20,
          background: darkMode ? 'rgba(156,77,204,0.07)' : 'rgba(156,77,204,0.06)',
          border: '1px solid rgba(156,77,204,0.2)',
          textAlign: 'center',
        }}>
          <p style={{
            fontSize: 'clamp(1rem,2.5vw,1.35rem)', fontWeight: 700,
            color: darkMode ? '#ffffff' : '#2d3748',
            marginBottom: '0.5rem',
          }}>
            ¿Tu sector no está aquí?
          </p>
          <p style={{
            fontSize: 'clamp(0.8rem,1.8vw,0.95rem)',
            color: darkMode ? '#a0aab8' : '#4a5568',
            marginBottom: '1.5rem', maxWidth: 400, margin: '0 auto 1.5rem',
          }}>
            ZENIC se adapta a cualquier tipo de comercio. Hablemos de tu negocio.
          </p>
          <a
            href="#contacto"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '0.75rem 2rem', borderRadius: 12,
              background: 'linear-gradient(135deg, #4A2574, #9C4DCC)',
              color: '#fff', fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none', boxShadow: '0 4px 20px rgba(156,77,204,0.35)',
              transition: 'box-shadow 0.3s, transform 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(156,77,204,0.55)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(156,77,204,0.35)'
              e.currentTarget.style.transform = 'none'
            }}
          >
            💬 Personalizar mi plan
          </a>
        </div>
      </div>
    </section>
  )
}
