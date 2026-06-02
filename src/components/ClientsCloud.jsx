import { InfiniteSlider } from './ui/infinite-slider'
import { ProgressiveBlur } from './ui/progressive-blur'

const clientes = [
  { nombre: 'Tekfix',            emoji: '📱', color: '#80DEEA' },
  { nombre: 'Bendito Encanto',   emoji: '👗', color: '#EC4899' },
  { nombre: 'Cases.com',         emoji: '📦', color: '#9C4DCC' },
  { nombre: 'Sarotex',           emoji: '🧵', color: '#F59E0B' },
  { nombre: 'DTavo Dtodo',       emoji: '🛒', color: '#10B981' },
  { nombre: 'Babería Manhattan', emoji: '✂️', color: '#80DEEA' },
  { nombre: 'Digital Market',    emoji: '💻', color: '#9C4DCC' },
]

export default function ClientsCloud({ darkMode }) {
  return (
    <section style={{ padding: 'clamp(2.5rem,5vw,4rem) 0', position: 'relative', overflow: 'hidden' }}>

      {/* Divider top */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(156,77,204,0.1)' }} />
      {/* Divider bottom */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(156,77,204,0.1)' }} />

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem,3vw,2.5rem)', padding: '0 1rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(61,74,96,0.45)', marginBottom: '0.4rem' }}>
          Negocios que ya confían en ZENIC
        </p>
        <p style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 900, color: darkMode ? '#fff' : '#3D4A60', letterSpacing: '-0.01em', lineHeight: 1.1 }}>
          Los mejores del juego
        </p>
      </div>

      {/* Slider */}
      <div style={{ position: 'relative' }}>
        <InfiniteSlider gap={42} speed={60} speedOnHover={20}>
          {clientes.map((c) => (
            <div
              key={c.nombre}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0.55rem 1.25rem', borderRadius: 999,
                background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${c.color}30`,
                boxShadow: `0 2px 12px ${c.color}15`,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>{c.emoji}</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 700, color: darkMode ? 'rgba(255,255,255,0.85)' : '#3D4A60', letterSpacing: '0.01em' }}>
                {c.nombre}
              </span>
            </div>
          ))}
        </InfiniteSlider>

        {/* Edge blur left */}
        <ProgressiveBlur
          direction="left"
          blurIntensity={1}
          style={{
            position: 'absolute', top: 0, left: 0,
            height: '100%', width: 140,
            pointerEvents: 'none',
            background: `linear-gradient(to right, ${darkMode ? 'rgba(10,8,18,1)' : 'rgba(248,246,255,1)'}, transparent)`,
          }}
        />
        {/* Edge blur right */}
        <ProgressiveBlur
          direction="right"
          blurIntensity={1}
          style={{
            position: 'absolute', top: 0, right: 0,
            height: '100%', width: 140,
            pointerEvents: 'none',
            background: `linear-gradient(to left, ${darkMode ? 'rgba(10,8,18,1)' : 'rgba(248,246,255,1)'}, transparent)`,
          }}
        />
      </div>
    </section>
  )
}
