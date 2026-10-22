import { TeamSection } from '../components/ui/team-section'
import GalaxyBackground from '../components/GalaxyBackground'
import PhotoCarousel from '../components/ui/photo-carousel'
import { useContent } from '../store/ContentContext'

const valores = [
  { icon: '🛒', titulo: 'Nacimos en la calle', desc: 'ZENIC nació de observar cómo los comerciantes colombianos perdían ventas, inventario y dinero por falta de herramientas reales. No de una sala de juntas.' },
  { icon: '⚡', titulo: 'Rapidez sobre perfección', desc: 'Cada función se prueba primero con comerciantes reales. Si no les sirve en la práctica, no existe en ZENIC.' },
  { icon: '🤝', titulo: 'El cliente es el jefe', desc: 'Nuestros usuarios no son métricas. Son personas con negocios que sostienen familias. Eso guía cada decisión.' },
  { icon: '🔐', titulo: 'Datos con dignidad', desc: 'Tus datos son tuyos. Nunca los vendemos ni los usamos para fines distintos a mejorar tu experiencia.', destacado: true },
]


const equipo = [
  { nombre: 'Mariana Ríos', cargo: 'CEO & Co-fundadora', emoji: '👩‍💼', bio: 'Ex-administradora de una cadena de tiendas en Cali. Conoce el dolor de los comerciantes desde adentro.' },
  { nombre: 'Sebastián Mora', cargo: 'CTO & Co-fundador', emoji: '👨‍💻', bio: 'Ingeniero de sistemas con 8 años en fintech. Construyó el primer POS de ZENIC en una semana.' },
  { nombre: 'Valentina Cruz', cargo: 'Head of Product', emoji: '👩‍🎨', bio: 'Diseñadora UX obsesionada con que cada pantalla funcione igual en un iPhone 15 que en un Android de $300.000.' },
  { nombre: 'Andrés Patiño', cargo: 'Head of Sales', emoji: '🤝', bio: 'Lleva 5 años recorriendo galerías y centros comerciales populares. Conoce a los clientes por su nombre.' },
]

function renderValorCard(v, i, darkMode, dim) {
  return (
    <div
      key={i}
      className="valor-card"
      style={{
        padding: 'clamp(2rem,4vw,2.5rem)',
        borderRadius: 24,
        background: v.destacado
          ? (darkMode ? 'linear-gradient(135deg, rgba(156,77,204,0.18) 0%, rgba(128,222,234,0.1) 100%)' : 'linear-gradient(135deg, rgba(156,77,204,0.12) 0%, rgba(128,222,234,0.07) 100%)')
          : (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)'),
        backdropFilter: 'blur(12px)',
        border: v.destacado
          ? '1.5px solid rgba(156,77,204,0.4)'
          : `1px solid ${darkMode ? 'rgba(255,255,255,0.07)' : 'rgba(156,77,204,0.1)'}`,
        boxShadow: v.destacado ? '0 8px 40px rgba(156,77,204,0.2)' : 'none',
        position: 'relative',
        overflow: 'hidden',
        transform: v.destacado ? 'scale(1.03)' : 'scale(1)',
        transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s',
        animation: `valorFadeIn 0.7s ${i * 0.15}s ease-out backwards`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = v.destacado ? 'translateY(-10px) scale(1.05)' : 'translateY(-8px) scale(1.02)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(156,77,204,0.28)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = v.destacado ? 'scale(1.03)' : 'scale(1)'
        e.currentTarget.style.boxShadow = v.destacado ? '0 8px 40px rgba(156,77,204,0.2)' : 'none'
      }}
    >
      {v.destacado && (
        <span style={{ position: 'absolute', top: 16, right: 16, padding: '4px 10px', borderRadius: 999, background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)', color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(156,77,204,0.4)' }}>
          ⭐ Esencial
        </span>
      )}
      <div style={{
        position: 'absolute', top: '-30%', right: '-20%',
        width: 180, height: 180, borderRadius: '50%',
        background: v.destacado
          ? 'radial-gradient(circle, rgba(128,222,234,0.18) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(156,77,204,0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <span className="valor-icon" style={{ fontSize: 'clamp(2.75rem,5vw,3.5rem)', display: 'block', marginBottom: '1.25rem', lineHeight: 1, position: 'relative', transition: 'transform 0.4s ease' }}>{v.icon}</span>
      <h4 style={{ fontSize: 'clamp(1.25rem,2.5vw,1.5rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem', position: 'relative' }}>{v.titulo}</h4>
      <p style={{ fontSize: 'clamp(0.95rem,1.8vw,1.05rem)', lineHeight: 1.75, color: `${dim}0.65)`, position: 'relative' }}>{v.desc}</p>
    </div>
  )
}

export default function Nosotros({ darkMode }) {
  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'
  const { content } = useContent()

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: darkMode ? 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(128,222,234,0.07) 0%, transparent 70%)' : 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(128,222,234,0.05) 0%, transparent 70%)' }} />
        {/* Galaxy particle background */}
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 2 }} className="nos-fade">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem', background: darkMode ? 'rgba(128,222,234,0.08)' : 'rgba(128,222,234,0.1)', border: '1px solid rgba(128,222,234,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#80DEEA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#80DEEA', boxShadow: '0 0 8px #80DEEA', display: 'inline-block' }} />
            Nuestra Historia
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.25rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Construimos ZENIC<br />
            <span style={{ background: 'linear-gradient(135deg, #80DEEA, #9C4DCC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              desde el comercio real
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2.2vw,1.2rem)', lineHeight: 1.75, color: `${dim}0.6)`, maxWidth: 580, margin: '0 auto' }}>
            No somos una startup de Silicon Valley que imaginó los problemas del comercio. Somos colombianos que los vivimos, los documentamos y les pusimos tecnología.
          </p>
        </div>
      </section>

      {/* ── MISIÓN / VISIÓN / PROPÓSITO ── */}
      <section style={{ padding: '0 clamp(1rem,3vw,2rem) clamp(2.5rem,4vw,3.5rem)' }}>
        <div style={{ maxWidth: 1360, margin: '0 auto' }} className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
          {[
            { label: 'Misión', color: '#9C4DCC', icon: '🎯', colorHex: 0x9c4dcc, shape: 'icosahedron', texto: 'Democratizar la inteligencia de negocio para el comercio popular colombiano. Que el tendero de la esquina tenga las mismas herramientas que una gran cadena.' },
            { label: 'Visión', color: '#80DEEA', icon: '🔭', colorHex: 0x80deea, shape: 'torus',       texto: 'Ser el sistema operativo de referencia para el retail latinoamericano en 2030. Presentes en cada galería, cada centro comercial popular, cada negocio que madruga.' },
            { label: 'Propósito', color: '#F59E0B', icon: '💡', colorHex: 0xf59e0b, shape: 'octa',     texto: 'Que ningún comerciante pierda dinero por no tener datos. Que la informalidad encuentre en ZENIC su camino a la formalidad sin dolor ni burocracia.' },
          ].map((item, i) => (
            <div key={i} className="nos-fade" style={{ padding: 'clamp(1.2rem,2vw,1.6rem)', borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', border: `1px solid ${item.color}25`, boxShadow: `0 4px 26px ${item.color}12`, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1.75rem', display: 'block', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>{item.icon}</span>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: item.color, marginBottom: '0.45rem', textTransform: 'uppercase', letterSpacing: '0.08em', position: 'relative', zIndex: 1 }}>{item.label}</h3>
              <p style={{ fontSize: '0.84rem', lineHeight: 1.65, color: `${dim}0.65)`, position: 'relative', zIndex: 1 }}>{item.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── VALORES ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025, backgroundImage: 'linear-gradient(rgba(128,222,234,1) 1px,transparent 1px),linear-gradient(90deg,rgba(128,222,234,1) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div className="nos-fade" style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem,5vw,3.5rem)' }}>
            <h2 style={{ fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.5rem' }}>
              Lo que nos mueve
            </h2>
            <p style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', color: `${dim}0.55)`, maxWidth: 600, margin: '0 auto' }}>
              Los principios que guían cada decisión y cada línea de código en ZENIC.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1.25rem,3vw,2rem)' }}>
            {/* Row 1: 3 cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1.25rem,3vw,2rem)' }}>
              {valores.slice(0, 3).map((v, i) => renderValorCard(v, i, darkMode, dim))}
            </div>
            {/* Row 2: centered card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 'min(100%, 480px)' }}>
                {renderValorCard(valores[3], 3, darkMode, dim)}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes valorFadeIn {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .valor-card:hover .valor-icon {
            transform: scale(1.2) rotate(-8deg);
          }
        `}</style>
      </section>


      {/* ── UBICACIÓN: REAL + VIRTUAL ── */}
      <section style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1rem,5vw,2.5rem)', position: 'relative', overflow: 'hidden' }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(156,77,204,1) 1px,transparent 1px),linear-gradient(90deg,rgba(156,77,204,1) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>

          {/* Header */}
          <div className="nos-fade" style={{ textAlign: 'center', marginBottom: 'clamp(2rem,4vw,3rem)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem', background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.08)', border: '1px solid rgba(156,77,204,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C4DCC' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
              Estamos en todos lados
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem' }}>
              Presencia{' '}
              <span style={{ background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                física y digital
              </span>
            </h2>
            <p style={{ fontSize: '1rem', color: `${dim}0.55)`, maxWidth: 580, margin: '0 auto' }}>
              Operamos desde Colombia y conectamos negocios en cualquier rincón a través de nuestra plataforma.
            </p>
          </div>

          {/* Grid: Mapa Real + Centro de Comando Virtual */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 'clamp(1.25rem,3vw,2rem)' }}>

            {/* ─── MAPA REAL ─── */}
            <div style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              background: darkMode ? 'rgba(10,8,18,0.95)' : 'rgba(13,11,20,0.96)',
              border: '1px solid rgba(156,77,204,0.25)',
              boxShadow: '0 4px 40px rgba(156,77,204,0.18)',
              minHeight: 540,
              display: 'flex', flexDirection: 'column',
            }}>
              {/* HUD top bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                padding: '0.85rem 1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(to bottom, rgba(10,8,18,0.95), transparent)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#80DEEA', textTransform: 'uppercase' }}>HQ · BOGOTÁ</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
                  4.6738° N · 74.1108° W
                </span>
              </div>

              {/* Mapa embebido — Calle 52 B Bis #85 A-40, Bogotá */}
              <div style={{ position: 'relative', flex: 1, minHeight: 360 }}>
                <iframe
                  title="ZENIC Sede Bogotá"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-74.1208%2C4.6688%2C-74.1008%2C4.6788&layer=mapnik&marker=4.6738%2C-74.1108"
                  style={{
                    width: '100%', height: '100%', border: 0,
                    position: 'absolute', inset: 0,
                    filter: 'invert(0.92) hue-rotate(180deg) saturate(1.2) brightness(0.85)',
                    opacity: 0.9,
                  }}
                  loading="lazy"
                />

                {/* Overlay scanlines */}
                <div style={{
                  position: 'absolute', inset: 0, pointerEvents: 'none',
                  background: 'repeating-linear-gradient(0deg, rgba(156,77,204,0.03) 0px, rgba(156,77,204,0.03) 1px, transparent 1px, transparent 3px)',
                }} />

                {/* Pulsing marker overlay (centered on the map) */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -100%)',
                  pointerEvents: 'none', zIndex: 5,
                }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: '#9C4DCC',
                    border: '3px solid #fff',
                    boxShadow: '0 0 0 8px rgba(156,77,204,0.25), 0 0 20px rgba(156,77,204,0.8)',
                    animation: 'pulse 1.8s infinite',
                  }} />
                </div>
              </div>

              {/* Contact info bottom panel */}
              <div style={{
                position: 'relative', zIndex: 10,
                padding: '1rem 1.25rem 1.25rem',
                background: 'linear-gradient(to top, rgba(10,8,18,0.98) 60%, rgba(10,8,18,0.85))',
                borderTop: '1px solid rgba(156,77,204,0.18)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: '1.1rem' }}>📍</span>
                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Sede ZENIC · Bogotá</p>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginBottom: '0.85rem', lineHeight: 1.4 }}>
                  Calle 52 B Bis #85 A-40
                </p>

                {/* Contact rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                  <a href="tel:+573115643557" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.55rem 0.85rem', borderRadius: 10,
                    background: 'rgba(128,222,234,0.08)',
                    border: '1px solid rgba(128,222,234,0.2)',
                    color: '#80DEEA', textDecoration: 'none',
                    fontSize: '0.82rem', fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(128,222,234,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(128,222,234,0.08)'}
                  >
                    <span style={{ fontSize: '0.95rem' }}>📞</span> +57 311 564 3557
                  </a>
                  <a href="mailto:atencion@zenic.com.co" style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '0.55rem 0.85rem', borderRadius: 10,
                    background: 'rgba(156,77,204,0.1)',
                    border: '1px solid rgba(156,77,204,0.25)',
                    color: '#c084fc', textDecoration: 'none',
                    fontSize: '0.82rem', fontWeight: 600,
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(156,77,204,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(156,77,204,0.1)'}
                  >
                    <span style={{ fontSize: '0.95rem' }}>✉️</span> atencion@zenic.com.co
                  </a>
                </div>
              </div>
            </div>

            {/* ─── CENTRO DE COMANDO VIRTUAL ─── */}
            <div style={{
              position: 'relative', borderRadius: 24, overflow: 'hidden',
              background: darkMode ? 'rgba(10,8,18,0.95)' : 'rgba(13,11,20,0.96)',
              border: '1px solid rgba(128,222,234,0.25)',
              boxShadow: '0 4px 40px rgba(128,222,234,0.15)',
              padding: 'clamp(1.5rem,3vw,2rem)',
              display: 'flex', flexDirection: 'column',
            }}>
              {/* HUD top */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#80DEEA', boxShadow: '0 0 8px #80DEEA', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', color: '#80DEEA', textTransform: 'uppercase' }}>RADAR BOGOTÁ</span>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'monospace' }}>
                  10 LOCALES · ONLINE
                </span>
              </div>

              {/* Mini-map radar style — Bogotá */}
              <div style={{ position: 'relative', width: '100%', height: 280, marginBottom: '1.25rem', borderRadius: 16, overflow: 'hidden', background: 'radial-gradient(ellipse at center, rgba(156,77,204,0.18) 0%, rgba(13,11,20,0.7) 100%)', border: '1px solid rgba(156,77,204,0.18)' }}>
                {/* Compass labels */}
                {['N', 'E', 'S', 'O'].map((dir, i) => {
                  const pos = [
                    { top: '4%', left: '50%', t: 'translateX(-50%)' },
                    { top: '50%', left: '96%', t: 'translateY(-50%)' },
                    { top: '96%', left: '50%', t: 'translateX(-50%)' },
                    { top: '50%', left: '4%', t: 'translateY(-50%)' },
                  ][i]
                  return (
                    <span key={dir} style={{
                      position: 'absolute', ...pos, transform: pos.t,
                      fontSize: '0.6rem', fontFamily: 'monospace',
                      color: 'rgba(128,222,234,0.4)', fontWeight: 700,
                    }}>{dir}</span>
                  )
                })}

                {/* Radar circles */}
                {[90, 160, 230].map((size, i) => (
                  <div key={i} style={{
                    position: 'absolute', top: '50%', left: '50%',
                    width: size, height: size, borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    border: '1px solid rgba(128,222,234,0.15)',
                  }} />
                ))}

                {/* Cross lines */}
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(128,222,234,0.1)' }} />
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(128,222,234,0.1)' }} />

                {/* Zone center label */}
                <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, calc(-50% + 18px))', fontSize: '0.55rem', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', zIndex: 6 }}>BOGOTÁ D.C.</span>

                {/* Center — HQ */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', width: 14, height: 14, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 16px #9C4DCC', transform: 'translate(-50%, -50%)', zIndex: 5 }} />

                {/* Zonas operativas — 4 áreas con 10 locales */}
                {[
                  { top: '38%', left: '32%', label: 'SAN ANDRESITO 38', count: 3 },
                  { top: '58%', left: '52%', label: 'CENTRO',           count: 3 },
                  { top: '78%', left: '40%', label: 'LA ALQUERÍA',      count: 2 },
                  { top: '30%', left: '65%', label: 'GALERÍAS',         count: 2 },
                ].map((z, i) => (
                  <div key={i} style={{ position: 'absolute', top: z.top, left: z.left, transform: 'translate(-50%,-50%)', zIndex: 6 }}>
                    {/* Pulse ring */}
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: 28, height: 28, borderRadius: '50%',
                      transform: 'translate(-50%,-50%)',
                      border: '1.5px solid rgba(128,222,234,0.45)',
                      animation: `pulseRing ${2 + i * 0.3}s infinite`,
                    }} />
                    {/* Dot */}
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%',
                      background: '#80DEEA',
                      boxShadow: '0 0 12px #80DEEA',
                      border: '2px solid rgba(13,11,20,0.6)',
                      position: 'relative',
                    }}>
                      {/* Count badge */}
                      <span style={{
                        position: 'absolute', top: -8, right: -10,
                        minWidth: 16, height: 16, padding: '0 4px',
                        borderRadius: 8,
                        background: 'linear-gradient(135deg,#9C4DCC,#80DEEA)',
                        color: '#fff', fontSize: '0.55rem', fontWeight: 800,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(156,77,204,0.5)',
                      }}>{z.count}</span>
                    </div>
                    {/* Label */}
                    <span style={{
                      position: 'absolute', top: 14, left: '50%',
                      transform: 'translateX(-50%)',
                      fontSize: '0.55rem',
                      color: 'rgba(128,222,234,0.85)',
                      fontFamily: 'monospace',
                      whiteSpace: 'nowrap',
                      fontWeight: 700,
                      textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                    }}>{z.label}</span>
                  </div>
                ))}

                {/* Scan line sweep */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%',
                  width: 115, height: 2,
                  background: 'linear-gradient(to right, transparent, #80DEEA, transparent)',
                  transformOrigin: 'left center',
                  animation: 'radarSweep 4s linear infinite',
                }} />
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.55rem', marginBottom: '0.75rem' }}>
                {[
                  { valor: '10',    label: 'Locales activos',   color: '#80DEEA' },
                  { valor: '98%',   label: 'Uptime garantizado', color: '#9C4DCC' },
                  { valor: '<2s',   label: 'Sincronización',     color: '#10B981' },
                ].map((s, i) => (
                  <div key={i} style={{
                    padding: '0.6rem 0.5rem', borderRadius: 10, textAlign: 'center',
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${s.color}25`,
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.valor}</div>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginTop: 3, lineHeight: 1.2 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Zone list */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.55rem', marginBottom: '0.75rem' }}>
                {[
                  { name: 'San Andresito 38', count: 3, color: '#9C4DCC' },
                  { name: 'Centro',           count: 3, color: '#80DEEA' },
                  { name: 'La Alquería',      count: 2, color: '#F59E0B' },
                  { name: 'Galerías',         count: 2, color: '#EC4899' },
                ].map((z, i) => (
                  <div key={i} style={{
                    padding: '0.6rem 0.75rem', borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${z.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>{z.name}</span>
                    <span style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: `${z.color}22`,
                      color: z.color, fontSize: '0.7rem', fontWeight: 800,
                    }}>{z.count}</span>
                  </div>
                ))}
              </div>

              {/* Bottom status — 10 locales / negocios movidos con IA */}
              <div style={{
                marginTop: 'auto',
                padding: '0.85rem 1rem', borderRadius: 12,
                background: 'linear-gradient(135deg, rgba(156,77,204,0.12), rgba(128,222,234,0.08))',
                border: '1px solid rgba(128,222,234,0.25)',
                display: 'flex', alignItems: 'center', gap: 12,
              }}>
                <div style={{
                  flexShrink: 0,
                  width: 38, height: 38, borderRadius: 10,
                  background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', boxShadow: '0 4px 14px rgba(156,77,204,0.4)',
                }}>🤖</div>
                <div>
                  <p style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 2 }}>
                    <span style={{ color: '#80DEEA' }}>10 locales</span> · negocios movidos con IA
                  </p>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.3 }}>
                    Inventario, ventas y cartera operados en tiempo real
                  </p>
                </div>
                <span style={{ marginLeft: 'auto', width: 10, height: 10, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
              </div>
            </div>

          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%      { opacity: 0.5; transform: scale(1.3); }
          }
          @keyframes radarSweep {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }
        `}</style>
      </section>

      {/* ── GALERÍA DE FOTOS DE LA EMPRESA ── */}
      <PhotoCarousel darkMode={darkMode} photos={content.fotos} />

      {/* ── EQUIPO ── */}
      <TeamSection darkMode={darkMode} members={content.team} />

    </div>
  )
}
