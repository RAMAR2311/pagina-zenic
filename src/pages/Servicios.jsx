
import ModulesSection from '../components/ModulesSection'
import GalaxyBackground from '../components/GalaxyBackground'

const planes = [
  {
    nombre: 'ZENIC Starter',
    precio: '$149.000',
    periodo: '/mes',
    descripcion: 'Para comercios que arrancan su digitalización.',
    color: '#80DEEA',
    glow: 'rgba(128,222,234,0.15)',
    badge: null,
    features: [
      'POS táctil + lector de códigos',
      'Inventario básico hasta 500 productos',
      'Reporte de ventas diario',
      'Soporte por chat',
      '1 usuario',
    ],
    noIncluye: ['Aprobación remota', 'Módulo de maneos', 'Cartera B2B'],
  },
  {
    nombre: 'ZENIC Pro',
    precio: '$289.000',
    periodo: '/mes',
    descripcion: 'El sistema completo para comercios en crecimiento.',
    color: '#9C4DCC',
    glow: 'rgba(156,77,204,0.2)',
    badge: '⭐ Más popular',
    features: [
      'Todo lo de Starter',
      'Inventario ilimitado',
      'Aprobación remota desde celular',
      'Módulo de maneos',
      'Cartera B2B con créditos',
      'Pagos mixtos (Nequi + QR + efectivo)',
      'Hasta 5 usuarios',
      'Soporte prioritario 7×12',
    ],
    noIncluye: [],
  },
  {
    nombre: 'ZENIC Enterprise',
    precio: 'A medida',
    periodo: '',
    descripcion: 'Para cadenas, distribuidoras y franquicias.',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.15)',
    badge: null,
    features: [
      'Todo lo de Pro',
      'Multi-sede y multi-bodega',
      'API de integración',
      'Roles y permisos personalizados',
      'Dashboard gerencial en tiempo real',
      'Usuarios ilimitados',
      'Gerente de cuenta dedicado',
      'SLA garantizado 99.9%',
    ],
    noIncluye: [],
  },
]

const serviciosDetalle = [
  {
    icon: '🖥️',
    titulo: 'POS Ultrarrápido',
    desc: 'Interfaz táctil optimizada para el ritmo de la calle. Procesa ventas en menos de 3 segundos con o sin internet.',
    accent: '#80DEEA',
  },
  {
    icon: '📦',
    titulo: 'Gestión de Inventario',
    desc: 'Control en tiempo real de existencias, alertas de stock bajo, entradas y salidas con trazabilidad completa.',
    accent: '#9C4DCC',
  },
  {
    icon: '🔐',
    titulo: 'Aprobación Remota',
    desc: 'Autoriza descuentos y precios especiales desde tu celular. Sin llamadas, sin WhatsApp, con log completo.',
    accent: '#EC4899',
  },
  {
    icon: '🔄',
    titulo: 'Módulo de Maneos',
    desc: 'Registra préstamos de mercancía entre locales con historial, alertas de devolución y datos siempre limpios.',
    accent: '#10B981',
  },
  {
    icon: '📊',
    titulo: 'Cartera B2B',
    desc: 'Gestiona créditos, abonos y deudas de tus clientes mayoristas con reportes automáticos y cobros digitales.',
    accent: '#F59E0B',
  },
  {
    icon: '📱',
    titulo: 'IMEI & Trazabilidad',
    desc: 'Registra el IMEI en la factura. Controla batería, estado y garantía de cada equipo desde el día uno.',
    accent: '#F97316',
  },
]

export default function Servicios({ darkMode }) {
  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'

  return (
    <div style={{ paddingTop: '80px' }}>

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <ModulesSection darkMode={darkMode} />
        </div>
      </div>


      {/* ── SERVICIOS DETALLE ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: 'linear-gradient(rgba(156,77,204,1) 1px,transparent 1px),linear-gradient(90deg,rgba(156,77,204,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div className="srv-fade" style={{ textAlign: 'center', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem' }}>
              Cada funcionalidad,{' '}
              <span style={{ background: 'linear-gradient(135deg,#9C4DCC,#80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>diseñada para la calle</span>
            </h2>
            <p style={{ fontSize: '1rem', color: `${dim}0.55)`, maxWidth: 480, margin: '0 auto' }}>
              No son funciones de catálogo. Son soluciones que nacieron de escuchar a comerciantes reales.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: 'clamp(1rem,2.5vw,1.5rem)' }}>
            {serviciosDetalle.map((s, i) => (
              <div key={i} className="srv-fade" style={{ padding: '1.5rem', borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.65)', backdropFilter: 'blur(12px)', border: `1px solid ${s.accent}20`, transition: 'box-shadow 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 6px 30px ${s.accent}25`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{s.icon}</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: s.accent, marginBottom: '0.5rem' }}>{s.titulo}</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: `${dim}0.6)` }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)', textAlign: 'center' }}>
        <div className="srv-fade" style={{ maxWidth: 600, margin: '0 auto', padding: 'clamp(2rem,5vw,3.5rem)', borderRadius: 28, background: darkMode ? 'rgba(156,77,204,0.08)' : 'rgba(156,77,204,0.06)', border: '1px solid rgba(156,77,204,0.2)' }}>
          <h2 style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem' }}>¿Listo para transformar tu negocio?</h2>
          <p style={{ fontSize: '1rem', color: `${dim}0.55)`, marginBottom: '1.75rem' }}>Agenda una auditoría gratuita y te mostramos ZENIC en vivo con tus propios datos.</p>
          <a href="#contacto" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.9rem 2.25rem', borderRadius: 14, background: 'linear-gradient(135deg, #4A2574, #9C4DCC)', color: '#fff', fontWeight: 700, fontSize: '1rem', textDecoration: 'none', boxShadow: '0 4px 24px rgba(156,77,204,0.35)', transition: 'box-shadow 0.3s, transform 0.2s' }}
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
