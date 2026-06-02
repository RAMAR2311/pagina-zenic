import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Calendar, User } from 'lucide-react'
import GalaxyBackground from '../components/GalaxyBackground'
import { useContent } from '../store/ContentContext'

// Render the article body: blank-line separated blocks; "## " => subheading
function renderBody(contenido, darkMode, color) {
  const text = darkMode ? 'rgba(255,255,255,0.8)' : 'rgba(61,74,96,0.85)'
  const heading = darkMode ? '#fff' : '#3D4A60'
  const blocks = (contenido || '').split(/\n\s*\n/).map(b => b.trim()).filter(Boolean)

  return blocks.map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h2 key={i} style={{ fontSize: 'clamp(1.25rem,3vw,1.6rem)', fontWeight: 800, color: heading, margin: '2rem 0 0.75rem', lineHeight: 1.25 }}>
          <span style={{ color }}>›</span> {block.replace(/^##\s+/, '')}
        </h2>
      )
    }
    return (
      <p key={i} style={{ fontSize: 'clamp(1rem,2vw,1.12rem)', lineHeight: 1.85, color: text, marginBottom: '1.15rem' }}>
        {block}
      </p>
    )
  })
}

export default function BlogArticulo({ darkMode }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { content } = useContent()
  const articulos = content.blog || []

  // match by id, or fall back to numeric index
  const idx = articulos.findIndex(a => a.id === id)
  const art = idx >= 0 ? articulos[idx] : articulos[Number(id)]

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }) }, [id])

  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'

  if (!art) {
    return (
      <div style={{ minHeight: '70vh', paddingTop: '120px', textAlign: 'center', padding: '120px 1.5rem 4rem' }}>
        <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem' }}>Artículo no encontrado</h1>
        <p style={{ color: `${dim}0.6)`, marginBottom: '1.5rem' }}>Puede que haya sido movido o eliminado.</p>
        <Link to="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.7rem 1.5rem', borderRadius: 12, background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
          <ArrowLeft size={16} /> Volver al blog
        </Link>
      </div>
    )
  }

  const color = art.color || '#9C4DCC'
  // Related: other articles in same category, then any
  const related = articulos.filter(a => a !== art).sort((a, b) => (b.categoria === art.categoria) - (a.categoria === art.categoria)).slice(0, 3)

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* HERO */}
      <section style={{ padding: 'clamp(2.5rem,6vw,4.5rem) clamp(1rem,5vw,2.5rem) clamp(1.5rem,3vw,2.5rem)', position: 'relative', overflow: 'hidden' }}>
        <GalaxyBackground darkMode={darkMode} density={500} />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <button onClick={() => navigate('/blog')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.45rem 0.9rem', borderRadius: 999, marginBottom: '1.5rem', cursor: 'pointer', background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.15)'}`, color: `${dim}0.7)`, fontSize: '0.82rem', fontWeight: 600 }}>
            <ArrowLeft size={14} /> Volver al blog
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.25rem' }}>
            <span style={{ padding: '4px 12px', borderRadius: 999, background: `${color}1f`, color, fontSize: '0.75rem', fontWeight: 700 }}>{art.categoria}</span>
            <span style={{ fontSize: '1.8rem' }}>{art.emoji}</span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 800, lineHeight: 1.15, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '1.25rem' }}>
            {art.titulo}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: `${dim}0.5)` }}>
            {art.autor && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><User size={14} /> {art.autor}</span>}
            {art.fecha && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Calendar size={14} /> {art.fecha}</span>}
            {art.lectura && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Clock size={14} /> {art.lectura} de lectura</span>}
          </div>
        </div>
      </section>

      {/* BODY */}
      <article style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(3rem,6vw,5rem)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Lead / summary */}
          <p style={{ fontSize: 'clamp(1.1rem,2.5vw,1.3rem)', lineHeight: 1.7, fontWeight: 500, color: darkMode ? 'rgba(255,255,255,0.9)' : '#3D4A60', paddingLeft: '1.25rem', borderLeft: `3px solid ${color}`, marginBottom: '2rem' }}>
            {art.resumen}
          </p>

          {renderBody(art.contenido, darkMode, color)}

          {/* CTA */}
          <div style={{ marginTop: '3rem', padding: 'clamp(1.5rem,4vw,2.5rem)', borderRadius: 24, background: darkMode ? `${color}12` : `${color}0d`, border: `1px solid ${color}30`, textAlign: 'center' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem,3vw,1.6rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.6rem' }}>¿Quieres aplicar esto en tu negocio?</h3>
            <p style={{ fontSize: '0.95rem', color: `${dim}0.6)`, marginBottom: '1.5rem' }}>Agenda una demo gratuita y te mostramos cómo ZENIC lo hace realidad.</p>
            <Link to="/contacto" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.85rem 2rem', borderRadius: 14, background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', color: '#fff', textDecoration: 'none', fontWeight: 700 }}>
              📅 Agenda tu demo gratis
            </Link>
          </div>
        </div>
      </article>

      {/* RELATED */}
      {related.length > 0 && (
        <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(4rem,8vw,6rem)' }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <h3 style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '1.5rem' }}>Sigue leyendo</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(1rem,2.5vw,1.5rem)' }}>
              {related.map((r, i) => (
                <Link key={i} to={`/blog/${r.id ?? articulos.indexOf(r)}`} style={{ textDecoration: 'none', padding: '1.5rem', borderRadius: 20, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', border: `1px solid ${r.color}18`, display: 'flex', flexDirection: 'column', gap: '0.6rem', transition: 'box-shadow 0.3s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 6px 30px ${r.color}20`; e.currentTarget.style.transform = 'translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 999, background: `${r.color}15`, color: r.color, fontSize: '0.7rem', fontWeight: 700 }}>{r.categoria}</span>
                    <span style={{ fontSize: '1.4rem' }}>{r.emoji}</span>
                  </div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60', lineHeight: 1.35 }}>{r.titulo}</h4>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: r.color, marginTop: 'auto' }}>Leer →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
