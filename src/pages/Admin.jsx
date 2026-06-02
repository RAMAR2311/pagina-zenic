import { useState, useRef } from 'react'
import { useContent, uploadImage } from '../store/ContentContext'
import {
  LogIn, LogOut, Plus, Trash2, ArrowUp, ArrowDown,
  RotateCcw, Upload, Users, Newspaper, Trophy, Images, ShieldCheck,
} from 'lucide-react'

// ⚠️ Client-side gate only. Change this password to your own.
const ADMIN_PASSWORD = 'zenic2025'
const AUTH_KEY = 'zenic_admin_auth'

// ── Field schemas per section ──
const SECTIONS = {
  team: {
    label: 'Equipo',
    icon: Users,
    titleField: 'name',
    fields: [
      { key: 'name',        label: 'Nombre',         type: 'text' },
      { key: 'designation', label: 'Cargo',          type: 'text' },
      { key: 'imageSrc',    label: 'Foto',           type: 'image' },
      { key: 'bio',         label: 'Biografía',      type: 'textarea' },
      { key: 'email',       label: 'Email',          type: 'text' },
      { key: 'web',         label: 'Web / Perfil',   type: 'text' },
    ],
    blank: { name: '', designation: '', imageSrc: '', bio: '', email: '', web: '#' },
  },
  blog: {
    label: 'Blog',
    icon: Newspaper,
    titleField: 'titulo',
    fields: [
      { key: 'titulo',    label: 'Título',     type: 'text' },
      { key: 'resumen',   label: 'Resumen (intro)', type: 'textarea' },
      { key: 'contenido', label: 'Contenido del artículo', type: 'textarea', big: true, hint: 'Separa párrafos con una línea en blanco. Usa "## " al inicio de una línea para subtítulos.' },
      { key: 'categoria', label: 'Categoría',  type: 'text' },
      { key: 'autor',     label: 'Autor',      type: 'text' },
      { key: 'emoji',     label: 'Emoji',      type: 'text' },
      { key: 'color',     label: 'Color',      type: 'color' },
      { key: 'lectura',   label: 'Tiempo lectura', type: 'text' },
      { key: 'fecha',     label: 'Fecha',      type: 'text' },
      { key: 'id',        label: 'Slug / ID (URL)', type: 'text', hint: 'Identificador único en la URL, ej: mi-articulo' },
    ],
    blank: { id: '', titulo: '', resumen: '', contenido: '', categoria: '', autor: 'Equipo ZENIC', emoji: '📰', color: '#9C4DCC', lectura: '5 min', fecha: '' },
  },
  casos: {
    label: 'Casos de Éxito',
    icon: Trophy,
    titleField: 'title',
    fields: [
      { key: 'title',   label: 'Empresa',       type: 'text' },
      { key: 'sector',  label: 'Sector',        type: 'text' },
      { key: 'emoji',   label: 'Emoji',         type: 'text' },
      { key: 'color',   label: 'Color',         type: 'color' },
      { key: 'summary', label: 'Resumen',       type: 'textarea' },
      { key: 'metric',  label: 'Métrica clave', type: 'text' },
      { key: 'image',   label: 'Imagen',        type: 'image' },
      { key: 'url',     label: 'Enlace',        type: 'text' },
    ],
    blank: { id: '', title: '', sector: '', emoji: '🏪', color: '#9C4DCC', summary: '', metric: '', image: '', url: '#' },
  },
  fotos: {
    label: 'Fotos Empresa',
    icon: Images,
    titleField: 'caption',
    fields: [
      { key: 'src',     label: 'Imagen',      type: 'image' },
      { key: 'caption', label: 'Título',      type: 'text' },
      { key: 'desc',    label: 'Descripción', type: 'text' },
    ],
    blank: { src: '', caption: '', desc: '' },
  },
}

const SECTION_KEYS = Object.keys(SECTIONS)

export default function Admin({ darkMode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === '1')
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  const login = (e) => {
    e.preventDefault()
    if (pwd === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, '1')
      setAuthed(true)
      setError('')
    } else {
      setError('Contraseña incorrecta')
    }
  }

  if (!authed) {
    return <LoginScreen darkMode={darkMode} pwd={pwd} setPwd={setPwd} login={login} error={error} />
  }

  return <AdminPanel darkMode={darkMode} onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuthed(false) }} />
}

// ── Login screen ──
function LoginScreen({ darkMode, pwd, setPwd, login, error }) {
  const text = darkMode ? '#fff' : '#3D4A60'
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 1.5rem 2rem' }}>
      <form onSubmit={login} style={{
        width: '100%', maxWidth: 400, padding: 'clamp(1.5rem,5vw,2.5rem)', borderRadius: 24,
        background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)',
        border: `1px solid ${darkMode ? 'rgba(156,77,204,0.2)' : 'rgba(156,77,204,0.15)'}`,
        boxShadow: '0 8px 40px rgba(156,77,204,0.18)', backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: 16, margin: '0 auto 1.25rem', background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', color: '#fff' }}>
          <ShieldCheck size={28} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: text, textAlign: 'center', marginBottom: '0.4rem' }}>Panel de Administración</h1>
        <p style={{ fontSize: '0.85rem', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(61,74,96,0.55)', textAlign: 'center', marginBottom: '1.5rem' }}>
          Ingresa la contraseña para editar el contenido del sitio.
        </p>
        <input
          type="password"
          value={pwd}
          onChange={e => setPwd(e.target.value)}
          placeholder="Contraseña"
          autoFocus
          style={{
            width: '100%', padding: '0.8rem 1rem', borderRadius: 12, fontSize: '0.95rem', boxSizing: 'border-box',
            background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${error ? '#ef4444' : darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}`,
            color: text, outline: 'none', marginBottom: error ? '0.5rem' : '1rem',
          }}
        />
        {error && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '1rem' }}>{error}</p>}
        <button type="submit" style={{
          width: '100%', padding: '0.85rem', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', color: '#fff', fontSize: '0.95rem', fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <LogIn size={16} /> Entrar
        </button>
      </form>
    </div>
  )
}

// ── Main panel ──
function AdminPanel({ darkMode, onLogout }) {
  const { content, updateSection, resetSection, resetAll } = useContent()
  const [tab, setTab] = useState('team')
  const text = darkMode ? '#fff' : '#3D4A60'
  const dim  = darkMode ? 'rgba(255,255,255,0.55)' : 'rgba(61,74,96,0.6)'

  const schema = SECTIONS[tab]
  const items = content[tab] || []

  const updateItem = (idx, key, value) => {
    const next = items.map((it, i) => i === idx ? { ...it, [key]: value } : it)
    updateSection(tab, next)
  }
  const addItem = () => {
    const blank = { ...schema.blank }
    // Auto-generate a unique slug/id for blog articles
    if (tab === 'blog') {
      const base = 'articulo'
      let n = items.length + 1
      let id = `${base}-${n}`
      const existing = new Set(items.map(it => it.id))
      while (existing.has(id)) { n += 1; id = `${base}-${n}` }
      blank.id = id
    }
    updateSection(tab, [...items, blank])
  }
  const removeItem = (idx) => {
    if (!confirm('¿Eliminar este elemento?')) return
    updateSection(tab, items.filter((_, i) => i !== idx))
  }
  const move = (idx, dir) => {
    const j = idx + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[idx], next[j]] = [next[j], next[idx]]
    updateSection(tab, next)
  }

  const cardBg = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.8)'
  const border = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(156,77,204,0.12)'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '90px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(1rem,5vw,2.5rem) 4rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.6rem,4vw,2.2rem)', fontWeight: 800, color: text }}>
              Panel de <span style={{ background: 'linear-gradient(135deg,#9C4DCC,#80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Administración</span>
            </h1>
            <p style={{ fontSize: '0.85rem', color: dim, marginTop: 4 }}>Los cambios se guardan automáticamente en este navegador.</p>
          </div>
          <button onClick={onLogout} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.1rem', borderRadius: 12, cursor: 'pointer',
            background: 'transparent', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(61,74,96,0.2)'}`, color: dim, fontSize: '0.85rem', fontWeight: 600,
          }}>
            <LogOut size={15} /> Salir
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: '1.75rem' }}>
          {SECTION_KEYS.map(key => {
            const S = SECTIONS[key]
            const Icon = S.icon
            const active = tab === key
            return (
              <button key={key} onClick={() => setTab(key)} style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.55rem 1.1rem', borderRadius: 999, cursor: 'pointer',
                fontSize: '0.85rem', fontWeight: 700,
                background: active ? 'linear-gradient(135deg,#4A2574,#9C4DCC)' : (darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)'),
                color: active ? '#fff' : dim,
                border: `1px solid ${active ? 'transparent' : border}`,
                transition: 'all 0.2s',
              }}>
                <Icon size={15} /> {S.label}
                <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>({(content[key] || []).length})</span>
              </button>
            )
          })}
        </div>

        {/* Section actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: '1.25rem' }}>
          <button onClick={addItem} style={btnPrimary}>
            <Plus size={15} /> Añadir
          </button>
          <button onClick={() => { if (confirm(`¿Restaurar "${schema.label}" a los valores por defecto?`)) resetSection(tab) }} style={btnGhost(darkMode, border, dim)}>
            <RotateCcw size={14} /> Restaurar sección
          </button>
        </div>

        {/* Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {items.length === 0 && (
            <p style={{ color: dim, fontSize: '0.9rem', textAlign: 'center', padding: '2rem' }}>No hay elementos. Pulsa “Añadir”.</p>
          )}
          {items.map((item, idx) => (
            <div key={idx} style={{ padding: 'clamp(1rem,3vw,1.5rem)', borderRadius: 18, background: cardBg, border: `1px solid ${border}` }}>
              {/* Item header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9C4DCC' }}>
                  #{idx + 1} · {String(item[schema.titleField] || 'Sin título').slice(0, 40)}
                </span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <IconBtn onClick={() => move(idx, -1)} disabled={idx === 0} darkMode={darkMode}><ArrowUp size={14} /></IconBtn>
                  <IconBtn onClick={() => move(idx, 1)} disabled={idx === items.length - 1} darkMode={darkMode}><ArrowDown size={14} /></IconBtn>
                  <IconBtn onClick={() => removeItem(idx)} danger darkMode={darkMode}><Trash2 size={14} /></IconBtn>
                </div>
              </div>

              {/* Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 240px), 1fr))', gap: '0.85rem' }}>
                {schema.fields.map(field => (
                  <Field
                    key={field.key}
                    field={field}
                    value={item[field.key] ?? ''}
                    onChange={(v) => updateItem(idx, field.key, v)}
                    darkMode={darkMode}
                    text={text} dim={dim} border={border}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Danger zone */}
        <div style={{ marginTop: '3rem', padding: '1.25rem', borderRadius: 16, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
          <p style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ef4444', marginBottom: 4 }}>Zona de riesgo</p>
          <p style={{ fontSize: '0.8rem', color: dim, marginBottom: '0.85rem' }}>Restaura TODO el contenido editable a los valores originales.</p>
          <button onClick={() => { if (confirm('¿Restaurar TODAS las secciones? Esta acción no se puede deshacer.')) resetAll() }} style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.1rem', borderRadius: 12, cursor: 'pointer',
            background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444', fontSize: '0.85rem', fontWeight: 700,
          }}>
            <RotateCcw size={14} /> Restaurar todo
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Field renderer ──
function Field({ field, value, onChange, darkMode, text, dim, border }) {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const label = <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: dim, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{field.label}</label>
  const hint = field.hint ? <p style={{ fontSize: '0.68rem', color: dim, marginTop: 4, opacity: 0.8, lineHeight: 1.4 }}>{field.hint}</p> : null

  const baseInput = {
    width: '100%', padding: '0.6rem 0.8rem', borderRadius: 10, fontSize: '0.875rem', boxSizing: 'border-box',
    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.95)',
    border: `1px solid ${border}`, color: text, outline: 'none', fontFamily: 'inherit',
  }

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file)
      onChange(url)
    } catch (err) {
      // Fallback to base64 if the backend is offline
      console.warn('Subida al servidor falló, usando base64:', err.message)
      const reader = new FileReader()
      reader.onload = () => onChange(reader.result)
      reader.readAsDataURL(file)
    } finally {
      setUploading(false)
    }
  }

  if (field.type === 'textarea') {
    return <div style={{ gridColumn: '1 / -1' }}>{label}<textarea value={value} onChange={e => onChange(e.target.value)} rows={field.big ? 12 : 3} style={{ ...baseInput, resize: 'vertical', lineHeight: 1.6 }} />{hint}</div>
  }

  if (field.type === 'color') {
    return (
      <div>{label}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input type="color" value={value || '#9C4DCC'} onChange={e => onChange(e.target.value)} style={{ width: 40, height: 38, border: 'none', borderRadius: 8, background: 'none', cursor: 'pointer', padding: 0 }} />
          <input type="text" value={value} onChange={e => onChange(e.target.value)} style={baseInput} />
        </div>
      </div>
    )
  }

  if (field.type === 'image') {
    return (
      <div style={{ gridColumn: '1 / -1' }}>{label}
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {value
            ? <img src={value} alt="preview" style={{ width: 84, height: 84, borderRadius: 10, objectFit: 'cover', border: `1px solid ${border}`, flexShrink: 0 }} />
            : <div style={{ width: 84, height: 84, borderRadius: 10, border: `1px dashed ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: dim, fontSize: '0.65rem', flexShrink: 0 }}>Sin foto</div>}
          <div style={{ flex: 1, minWidth: 180, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder="Pega una URL de imagen…" style={baseInput} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.5rem 0.9rem', borderRadius: 10, cursor: uploading ? 'default' : 'pointer', alignSelf: 'flex-start', opacity: uploading ? 0.6 : 1,
              background: darkMode ? 'rgba(156,77,204,0.12)' : 'rgba(156,77,204,0.08)', border: '1px solid rgba(156,77,204,0.3)', color: '#9C4DCC', fontSize: '0.78rem', fontWeight: 600,
            }}>
              <Upload size={13} /> {uploading ? 'Subiendo…' : 'Subir archivo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
          </div>
        </div>
      </div>
    )
  }

  // default text
  return <div>{label}<input type="text" value={value} onChange={e => onChange(e.target.value)} style={baseInput} />{hint}</div>
}

// ── Small UI helpers ──
function IconBtn({ children, onClick, disabled, danger, darkMode }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: 32, height: 32, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.35 : 1,
      background: danger ? 'rgba(239,68,68,0.1)' : (darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(61,74,96,0.06)'),
      border: `1px solid ${danger ? 'rgba(239,68,68,0.3)' : (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(61,74,96,0.12)')}`,
      color: danger ? '#ef4444' : (darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(61,74,96,0.7)'),
    }}>{children}</button>
  )
}

const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.2rem', borderRadius: 12, cursor: 'pointer',
  background: 'linear-gradient(135deg,#4A2574,#9C4DCC)', color: '#fff', border: 'none', fontSize: '0.85rem', fontWeight: 700,
}
const btnGhost = (darkMode, border, dim) => ({
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.6rem 1.2rem', borderRadius: 12, cursor: 'pointer',
  background: 'transparent', border: `1px solid ${border}`, color: dim, fontSize: '0.85rem', fontWeight: 600,
})
