import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function StreetPowerSection({ darkMode }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll('.reveal-item')
    items?.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(50px)' })

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target.querySelectorAll('.reveal-item'), {
              y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: 'power3.out',
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const cardStyle = {
    position: 'relative',
    padding: 'clamp(1.5rem,5vw,2.5rem)',
    borderRadius: 24,
    overflow: 'hidden',
    background: darkMode ? 'rgba(26,21,37,0.75)' : 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: `1px solid ${darkMode ? 'rgba(128,222,234,0.1)' : 'rgba(156,77,204,0.15)'}`,
  }

  return (
    <section
      id="calle"
      ref={sectionRef}
      style={{ padding: 'clamp(4rem,8vw,8rem) clamp(1rem,5vw,3rem)', width: '100%', position: 'relative', overflow: 'hidden' }}
    >
      {/* Background blobs */}
      <div style={{ position: 'absolute', top: '20%', left: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(74,37,116,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '-5%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(128,222,234,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal-item" style={{ textAlign: 'center', marginBottom: '4rem', padding: '0 1rem' }}>
          <span className="glass" style={{
            display: 'inline-block', padding: '0.3rem 1rem', borderRadius: 999,
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            color: '#80DEEA', marginBottom: '1rem',
          }}>
            El Poder de la Calle
          </span>
          <h2 style={{
            fontSize: 'clamp(2rem,5vw,3.2rem)', fontWeight: 800, marginBottom: '1rem',
            color: darkMode ? '#fff' : '#3D4A60',
          }}>
            Funcionalidades que <span className="text-gradient">nadie más tiene</span>
          </h2>
          <p style={{ fontSize: 'clamp(0.9rem,2vw,1.1rem)', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(61,74,96,0.65)', maxWidth: 560, margin: '0 auto' }}>
            Nacidas del comercio real. Probadas en la calle. Respaldadas con datos.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 'clamp(1rem,3vw,2rem)' }}>

          {/* MANEOS */}
          <div className="reveal-item" style={cardStyle}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, borderRadius: '50%', background: 'rgba(128,222,234,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(128,222,234,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#80DEEA', flexShrink: 0 }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.35rem)', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60' }}>Módulo de Maneos</h3>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#80DEEA' }}>"Tu mercancía siempre bajo control"</p>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(61,74,96,0.7)', marginBottom: '1.5rem' }}>
                Préstamos entre locales vecinos registrados con un toque. <strong>Maneos bajo palabra, pero con datos.</strong> Sabes quién tiene tu mercancía, cuánto tiempo lleva afuera, y cuándo vuelve.
              </p>

              {/* Flow diagram */}
              <div style={{ borderRadius: 16, padding: '1rem', background: darkMode ? 'rgba(13,11,20,0.5)' : 'rgba(255,255,255,0.6)', border: `1px solid ${darkMode ? 'rgba(128,222,234,0.1)' : 'rgba(156,77,204,0.1)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(156,77,204,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: '#9C4DCC' }}>L1</div>
                    <span style={{ fontSize: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.5)' }}>Tu Local</span>
                  </div>
                  <div style={{ flex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{ height: 2, width: '100%', background: 'linear-gradient(to right, #9C4DCC, #80DEEA)', borderRadius: 1 }} />
                    <span style={{ fontSize: '0.65rem', color: '#80DEEA', background: 'rgba(128,222,234,0.1)', padding: '2px 8px', borderRadius: 999 }}>3 items prestados</span>
                  </div>
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(128,222,234,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: '#80DEEA' }}>L2</div>
                    <span style={{ fontSize: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(61,74,96,0.5)' }}>Vecino</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.72rem', textAlign: 'center', marginTop: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(61,74,96,0.4)' }}>
                  Registro automático • Historial completo • Alertas de devolución
                </p>
              </div>
            </div>
          </div>

          {/* APROBACIÓN REMOTA */}
          <div className="reveal-item" style={{ ...cardStyle, borderColor: darkMode ? 'rgba(156,77,204,0.12)' : 'rgba(156,77,204,0.15)' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: 160, height: 160, borderRadius: '50%', background: 'rgba(156,77,204,0.08)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(156,77,204,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9C4DCC', flexShrink: 0 }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.35rem)', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60' }}>Aprobación Remota</h3>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#9C4DCC' }}>"El jefe siempre presente, sin estar ahí"</p>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(61,74,96,0.7)', marginBottom: '1.5rem' }}>
                El vendedor pide autorización de precio especial desde el POS. Tú lo apruebas desde tu celular en segundos. <strong>Sin llamadas, sin WhatsApp, sin enredos.</strong>
              </p>

              {/* POS → Admin */}
              <div style={{ borderRadius: 16, padding: '1rem', background: darkMode ? 'rgba(13,11,20,0.5)' : 'rgba(255,255,255,0.6)', border: `1px solid ${darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.1)'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: darkMode ? 'rgba(156,77,204,0.1)' : 'rgba(156,77,204,0.06)', border: '1px solid rgba(156,77,204,0.15)' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9C4DCC', marginBottom: 4 }}>POS Vendedor</p>
                    <p style={{ fontSize: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(61,74,96,0.6)', marginBottom: 4 }}>Solicita descuento</p>
                    <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#9C4DCC' }}>-15%</p>
                  </div>

                  <svg style={{ flexShrink: 0, color: '#80DEEA', animation: 'pulse 1.5s infinite' }} width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>

                  <div style={{ flex: 1, padding: '0.75rem', borderRadius: 12, background: darkMode ? 'rgba(128,222,234,0.1)' : 'rgba(128,222,234,0.06)', border: '1px solid rgba(128,222,234,0.15)' }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#80DEEA', marginBottom: 4 }}>Admin (Celular)</p>
                    <p style={{ fontSize: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(61,74,96,0.6)', marginBottom: 6 }}>Un toque:</p>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(34,197,94,0.15)', color: 'rgb(74,222,128)', fontSize: '0.7rem', fontWeight: 700 }}>✓ OK</span>
                      <span style={{ padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: 'rgb(252,165,165)', fontSize: '0.7rem', fontWeight: 700 }}>✗ No</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.72rem', textAlign: 'center', marginTop: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(61,74,96,0.4)' }}>
                  Respuesta en &lt;5 s • Log completo • Sin WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* IMEI & TRAZABILIDAD */}
          <div className="reveal-item" style={{ ...cardStyle, borderColor: darkMode ? 'rgba(245,158,11,0.15)' : 'rgba(245,158,11,0.2)' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 160, height: 160, borderRadius: '50%', background: 'rgba(245,158,11,0.07)', filter: 'blur(50px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative' }}>

              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0 }}>
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3m-3 3h3m-3 3h3" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontSize: 'clamp(1.1rem,2.5vw,1.35rem)', fontWeight: 700, color: darkMode ? '#fff' : '#3D4A60' }}>IMEI & Trazabilidad</h3>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#F59E0B' }}>"Cada equipo con su historia completa"</p>
                </div>
              </div>

              <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(61,74,96,0.7)', marginBottom: '1.5rem' }}>
                Registra el IMEI en la factura y lleva el historial completo del equipo. <strong>Batería, garantía y estado</strong> visibles desde el primer día de venta.
              </p>

              {/* Device card mockup */}
              <div style={{ borderRadius: 16, padding: '1rem', background: darkMode ? 'rgba(13,11,20,0.5)' : 'rgba(255,255,255,0.6)', border: `1px solid ${darkMode ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.15)'}` }}>

                {/* Device row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B', flexShrink: 0, fontSize: '1.1rem' }}>
                    📱
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: darkMode ? 'rgba(255,255,255,0.85)' : '#3D4A60', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Samsung Galaxy A55</p>
                    <p style={{ fontSize: '0.65rem', fontFamily: 'monospace', color: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(61,74,96,0.45)' }}>IMEI: 358 · 149 · 32 · 0</p>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: '0.65rem', fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: 'rgb(74,222,128)', whiteSpace: 'nowrap' }}>
                    ● Activo
                  </span>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>

                  {/* Batería */}
                  <div style={{ padding: '0.6rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(245,158,11,0.05)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(245,158,11,0.12)'}`, textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#F59E0B', marginBottom: 4 }}>Batería</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', lineHeight: 1 }}>87%</p>
                    {/* mini bar */}
                    <div style={{ marginTop: 5, height: 3, borderRadius: 99, background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: '87%', height: '100%', borderRadius: 99, background: 'linear-gradient(to right, #F59E0B, #FCD34D)' }} />
                    </div>
                  </div>

                  {/* Estado */}
                  <div style={{ padding: '0.6rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(34,197,94,0.04)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(34,197,94,0.12)'}`, textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'rgb(74,222,128)', marginBottom: 4 }}>Estado</p>
                    <p style={{ fontSize: '0.75rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', lineHeight: 1.2 }}>Buenas<br/>condiciones</p>
                  </div>

                  {/* Garantía */}
                  <div style={{ padding: '0.6rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(128,222,234,0.05)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(128,222,234,0.15)'}`, textAlign: 'center' }}>
                    <p style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#80DEEA', marginBottom: 4 }}>Garantía</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: 800, color: darkMode ? '#fff' : '#3D4A60', lineHeight: 1 }}>8 m</p>
                    <p style={{ fontSize: '0.55rem', color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(61,74,96,0.4)', marginTop: 2 }}>restantes</p>
                  </div>

                </div>

                <p style={{ fontSize: '0.72rem', textAlign: 'center', marginTop: '0.75rem', color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(61,74,96,0.4)' }}>
                  IMEI en factura • Historial completo • Alerta vencimiento
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
