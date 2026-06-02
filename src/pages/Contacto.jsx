import { useState } from 'react'

const canales = [
  { icon: '📞', label: 'Teléfono / WhatsApp', valor: '+57 300 000 0000', color: '#10B981' },
  { icon: '📧', label: 'Correo comercial', valor: 'hola@zenic.com.co', color: '#9C4DCC' },
  { icon: '📍', label: 'Ubicación', valor: 'Bogotá, Colombia', color: '#80DEEA' },
  { icon: '⏰', label: 'Horario de atención', valor: 'Lun – Sáb, 8am – 7pm', color: '#F59E0B' },
]

const motivos = [
  'Quiero una demo del sistema',
  'Necesito información sobre precios',
  'Tengo una empresa con múltiples sedes',
  'Soy distribuidor / revendedor',
  'Tengo una duda técnica',
  'Otro',
]

import GalaxyBackground from '../components/GalaxyBackground'

export default function Contacto({ darkMode }) {
  const dim = darkMode ? 'rgba(255,255,255,' : 'rgba(61,74,96,'
  const [form, setForm] = useState({ nombre: '', empresa: '', email: '', whatsapp: '', motivo: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem', borderRadius: 12, fontSize: '0.9rem',
    background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)',
    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}`,
    color: darkMode ? '#fff' : '#3D4A60',
    outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = e => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div style={{ paddingTop: '80px' }}>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1rem,5vw,2.5rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: darkMode ? 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(156,77,204,0.08) 0%, transparent 70%)' : 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(156,77,204,0.05) 0%, transparent 70%)' }} />
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.35rem 1rem', borderRadius: 999, marginBottom: '1.25rem', background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.08)', border: '1px solid rgba(156,77,204,0.25)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9C4DCC' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#9C4DCC', boxShadow: '0 0 8px #9C4DCC', display: 'inline-block' }} />
            Contacto
          </span>
          <h1 style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem', color: darkMode ? '#fff' : '#3D4A60' }}>
            Hablemos de<br />
            <span style={{ background: 'linear-gradient(135deg, #9C4DCC, #80DEEA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              tu negocio
            </span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem,2vw,1.15rem)', lineHeight: 1.7, color: `${dim}0.6)` }}>
            Sin formularios eternos. Cuéntanos qué necesitas y te contactamos en menos de 24 horas.
          </p>
        </div>
      </section>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <section style={{ padding: '0 clamp(1rem,5vw,2.5rem) clamp(4rem,8vw,7rem)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'start' }}>

          {/* Formulario */}
          <div>
            {enviado ? (
              <div style={{ padding: '3rem 2rem', borderRadius: 24, textAlign: 'center', background: darkMode ? 'rgba(16,185,129,0.08)' : 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.25)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.75rem' }}>¡Mensaje recibido!</h3>
                <p style={{ fontSize: '1rem', color: `${dim}0.6)` }}>Un asesor de ZENIC te contactará en menos de 24 horas hábiles.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: `${dim}0.55)`, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nombre *</label>
                    <input name="nombre" required value={form.nombre} onChange={handleChange} placeholder="Tu nombre" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#9C4DCC'}
                      onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: `${dim}0.55)`, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Empresa</label>
                    <input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Nombre del negocio" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = '#9C4DCC'}
                      onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: `${dim}0.55)`, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Correo electrónico *</label>
                  <input type="email" name="email" required value={form.email} onChange={handleChange} placeholder="tucorreo@empresa.com" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#9C4DCC'}
                    onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: `${dim}0.55)`, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>WhatsApp</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="+57 300 000 0000" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#9C4DCC'}
                    onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: `${dim}0.55)`, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>¿En qué te podemos ayudar? *</label>
                  <select name="motivo" required value={form.motivo} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }}
                    onFocus={e => e.target.style.borderColor = '#9C4DCC'}
                    onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}
                  >
                    <option value="">Selecciona un motivo</option>
                    {motivos.map((m, i) => <option key={i} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: `${dim}0.55)`, marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Mensaje adicional</label>
                  <textarea name="mensaje" rows={4} value={form.mensaje} onChange={handleChange} placeholder="Cuéntanos más sobre tu negocio y lo que necesitas..." style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#9C4DCC'}
                    onBlur={e => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(156,77,204,0.2)'}
                  />
                </div>

                <button type="submit" style={{ padding: '0.9rem', borderRadius: 14, background: 'linear-gradient(135deg, #4A2574, #9C4DCC)', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(156,77,204,0.35)', transition: 'box-shadow 0.3s, transform 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 36px rgba(156,77,204,0.55)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 24px rgba(156,77,204,0.35)'; e.currentTarget.style.transform = 'none' }}
                >
                  Enviar mensaje →
                </button>

                <p style={{ fontSize: '0.75rem', color: `${dim}0.4)`, textAlign: 'center' }}>
                  🔐 Tu información es privada. No la compartimos con terceros.
                </p>
              </form>
            )}
          </div>

          {/* Info lateral */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            <div style={{ padding: '1.5rem', borderRadius: 20, background: darkMode ? 'rgba(156,77,204,0.07)' : 'rgba(156,77,204,0.05)', border: '1px solid rgba(156,77,204,0.18)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', marginBottom: '0.4rem' }}>¿Por qué ZENIC?</h3>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.65, color: `${dim}0.6)` }}>
                Somos un aliado tecnológico, no solo un proveedor de software. Nuestro equipo acompaña tu proceso de digitalización desde el primer día hasta que el sistema sea parte natural de tu operación.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {canales.map((c, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderRadius: 16, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', border: `1px solid ${c.color}20` }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: `${c.color}15`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                    {c.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: `${dim}0.4)`, marginBottom: '0.1rem' }}>{c.label}</p>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: c.color }}>{c.valor}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '1.25rem', borderRadius: 16, background: darkMode ? 'rgba(16,185,129,0.07)' : 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', flexShrink: 0, display: 'inline-block' }} />
              <p style={{ fontSize: '0.85rem', color: `${dim}0.65)` }}>
                Tiempo de respuesta promedio: <strong style={{ color: '#10B981' }}>menos de 4 horas hábiles</strong>
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
