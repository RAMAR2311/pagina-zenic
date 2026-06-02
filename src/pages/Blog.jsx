import { useState } from 'react'
import { Link } from 'react-router-dom'
import GalaxyBackground from '../components/GalaxyBackground'
import { useContent } from '../store/ContentContext'

export default function Blog({ darkMode }) {
  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'
  const { content } = useContent()
  const articulos = content.blog || []
  const categorias = ['Todos', ...Array.from(new Set(articulos.map(a => a.categoria).filter(Boolean)))]

  const [filtro, setFiltro] = useState('Todos')
  const verTodos = filtro === 'Todos'
  const filtrados = verTodos ? articulos : articulos.filter(a => a.categoria === filtro)
  // En "Todos" el primero es destacado y el resto va al grid; al filtrar, todos van al grid.
  const enGrid = verTodos ? filtrados.slice(1) : filtrados

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,2.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: darkMode ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(128,222,234,0.07) 0%, transparent 70%)' : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(128,222,234,0.05) 0%, transparent 70%)' }} />
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem', background: darkMode ? 'rgba(128,222,234,0.08)' : 'rgba(128,222,234,0.1)', border: '1px solid rgba(128,222,234,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#80DEEA' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#80DEEA', boxShadow: '0 0 8px #80DEEA', display: 'inline-block' }} />
            Blog & Recursos
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Conocimiento para el{' '}
            <span style={{ background: 'linear-gradient(135deg, #80DEEA, #9C4DCC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              comercio real
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.7, color: `${dim}0.6)` }}>
            Estrategias, guías y análisis para que tu negocio crezca con datos, no con suposiciones.
          </p>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
          {categorias.map((cat, i) => {
            const activo = filtro === cat
            return (
              <button key={i} onClick={() => setFiltro(cat)} style={{ padding: '0.4rem 1rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: activo ? 'linear-gradient(135deg, #4A2574, #9C4DCC)' : darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', color: activo ? '#fff' : `${dim}0.6)`, border: `1px solid ${activo ? 'transparent' : darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(156,77,204,0.15)'}`, backdropFilter: 'blur(8px)', transition: 'all 0.2s', fontFamily: 'inherit' }}
                onMouseEnter={e => { if (!activo) e.currentTarget.style.borderColor = 'rgba(156,77,204,0.4)' }}
                onMouseLeave={e => { if (!activo) e.currentTarget.style.borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(156,77,204,0.15)' }}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* ── ARTÍCULO DESTACADO (solo en "Todos") ── */}
      {verTodos && articulos[0] && (
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(2rem,4vw,3rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ padding: 'clamp(2rem,5vw,3rem)', borderRadius: 28, background: darkMode ? 'rgba(156,77,204,0.06)' : 'rgba(156,77,204,0.05)', border: '1px solid rgba(156,77,204,0.2)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '2rem', alignItems: 'center' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: 999, background: 'rgba(156,77,204,0.12)', color: '#9C4DCC', fontSize: '0.72rem', fontWeight: 700, marginBottom: '1rem' }}>
                ⭐ Artículo destacado
              </span>
              <h2 style={{ fontSize: 'clamp(1.5rem,3.5vw,2.2rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', lineHeight: 1.2, marginBottom: '1rem' }}>
                {articulos[0].titulo}
              </h2>
              <p style={{ fontSize: '1rem', lineHeight: 1.7, color: `${dim}0.6)`, marginBottom: '1.5rem' }}>{articulos[0].resumen}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: `${dim}0.45)` }}>📅 {articulos[0].fecha}</span>
                <span style={{ fontSize: '0.8rem', color: `${dim}0.45)` }}>⏱ {articulos[0].lectura} de lectura</span>
                <Link to={`/blog/${articulos[0].id ?? 0}`} style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9C4DCC', textDecoration: 'none' }}>Leer artículo →</Link>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 'min(100%, 280px)', aspectRatio: '1', borderRadius: 24, background: 'linear-gradient(135deg, rgba(156,77,204,0.15), rgba(128,222,234,0.1))', border: '1px solid rgba(156,77,204,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem' }}>
                {articulos[0].emoji}
              </div>
            </div>
          </div>
        </div>
      </section>
      )}

      {/* ── GRID ARTÍCULOS ── */}
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(4rem,8vw,7rem)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(1rem,2.5vw,1.5rem)' }}>
          {enGrid.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: `${dim}0.5)`, padding: '2rem', fontSize: '0.95rem' }}>
              No hay artículos en esta categoría todavía.
            </p>
          )}
          {enGrid.map((art, i) => (
            <Link key={art.id ?? i} to={`/blog/${art.id ?? articulos.indexOf(art)}`} style={{ textDecoration: 'none', padding: '1.5rem', borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: `1px solid ${art.color}18`, display: 'flex', flexDirection: 'column', gap: '0.75rem', transition: 'box-shadow 0.3s, transform 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 30px ${art.color}20`; e.currentTarget.style.transform = 'translateY(-3px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ padding: '3px 10px', borderRadius: 999, background: `${art.color}15`, color: art.color, fontSize: '0.7rem', fontWeight: 700 }}>{art.categoria}</span>
                <span style={{ fontSize: '1.5rem' }}>{art.emoji}</span>
              </div>
              <h3 style={{ fontSize: 'clamp(0.95rem,2vw,1.1rem)', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60', lineHeight: 1.35 }}>{art.titulo}</h3>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: `${dim}0.6)`, flex: 1 }}>{art.resumen}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(156,77,204,0.08)'}` }}>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: `${dim}0.4)` }}>📅 {art.fecha}</span>
                  <span style={{ fontSize: '0.75rem', color: `${dim}0.4)` }}>⏱ {art.lectura}</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: art.color }}>Leer →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}
