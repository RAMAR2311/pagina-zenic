import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeftRight, TrendingUp, AlertCircle, CheckCircle, ShieldAlert, Zap, Clock, Users } from 'lucide-react'

const CASE_STUDIES = [
  {
    sector: 'Moda & Calzado',
    icon: '👗',
    storeName: 'Cadena de Boutiques Urban Fashion (14 Tiendas)',
    location: 'Bogotá & Medellín',
    summary: 'Optimización de turnos de asesoras y redistribución de producto en vitrina.',
    before: {
      tag: 'ANTES: A CIEGAS',
      color: '#EF4444',
      bgGrad: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.95))',
      conversion: '1.45%',
      fugasPico: '44% se van sin atención',
      esperaCaja: '7.8 min',
      decisionMethod: 'Planificación por intuición',
      quote: 'Sabíamos que entraba gente pero no entendíamos por qué tantas personas salían con las manos vacías en las tardes.',
    },
    after: {
      tag: 'CON ZENIC: DATOS EN VIVO',
      color: '#00FF87',
      bgGrad: 'linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(8, 14, 21, 0.95))',
      conversion: '2.52%',
      fugasPico: '9% fugas controladas',
      esperaCaja: '2.2 min',
      decisionMethod: 'Turnos alineados a horas pico reales',
      quote: 'Alineamos los horarios de las mejores vendedoras con los picos térmicos de tráfico. Las ventas subieron +34% en 60 días.',
    },
    lift: '+73.8% en Conversión',
    revenueLift: '+$48.5M COP / mes',
  },
  {
    sector: 'Supermercados & Conveniencia',
    icon: '🛒',
    storeName: 'Súper Express del Café (8 Sedes)',
    location: 'Eje Cafetero & Cali',
    summary: 'Detección automática de filas en cajas y optimización de góndolas de impulso.',
    before: {
      tag: 'ANTES: A CIEGAS',
      color: '#EF4444',
      bgGrad: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.95))',
      conversion: '3.8%',
      fugasPico: '32% abandono de canasta en fila',
      esperaCaja: '8.5 min',
      decisionMethod: 'Cajeros fijos sin importar el flujo',
      quote: 'En horas del almuerzo las filas llegaban al pasillo y muchos clientes dejaban los productos abandonados.',
    },
    after: {
      tag: 'CON ZENIC: DATOS EN VIVO',
      color: '#00FF87',
      bgGrad: 'linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(8, 14, 21, 0.95))',
      conversion: '5.4%',
      fugasPico: '5% abandono',
      esperaCaja: '1.8 min',
      decisionMethod: 'Apertura predictiva de cajas de apoyo',
      quote: 'La alerta sonora de fila abre cajas 4 minutos antes de que se colapse el punto de pago. Cero carritos abandonados.',
    },
    lift: '+42.1% en Cierre de Ventas',
    revenueLift: '+$62.0M COP / mes',
  },
  {
    sector: 'Tecnología & Accesorios',
    icon: '📱',
    storeName: 'Tekfix Retail Móvil (6 Puntos)',
    location: 'Bogotá D.C.',
    summary: 'Medición de tasa de atracción de vitrina y tiempo de permanencia en mostradores.',
    before: {
      tag: 'ANTES: A CIEGAS',
      color: '#EF4444',
      bgGrad: 'linear-gradient(135deg, rgba(239, 68, 68, 0.12), rgba(15, 23, 42, 0.95))',
      conversion: '2.1%',
      fugasPico: '38% tiempo muerto en vitrina',
      esperaCaja: '5.2 min',
      decisionMethod: 'Inventario y personal sin métricas de paso',
      quote: 'Creíamos que la vitrina funcionaba bien solo porque se veía bonita, pero no teníamos datos de cuántos miraban.',
    },
    after: {
      tag: 'CON ZENIC: DATOS EN VIVO',
      color: '#00FF87',
      bgGrad: 'linear-gradient(135deg, rgba(0, 255, 135, 0.15), rgba(8, 14, 21, 0.95))',
      conversion: '3.65%',
      fugasPico: '12% atención inmediata',
      esperaCaja: '1.5 min',
      decisionMethod: 'Atracción de vitrina medida con visión IA',
      quote: 'Rediseñamos la exhibición de fundas según el mapa de calor. Duplicamos la tasa de captura desde el pasillo del centro comercial.',
    },
    lift: '+73.8% en Conversión',
    revenueLift: '+$29.0M COP / mes',
  },
]

export default function BeforeAfterSlider({ darkMode }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [sliderPos, setSliderPos] = useState(50) // 0 to 100%
  const containerRef = useRef(null)
  const isDragging = useRef(false)

  const activeCase = CASE_STUDIES[activeIdx]

  const handlePointerDown = () => {
    isDragging.current = true
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const pct = Math.max(10, Math.min(90, (x / rect.width) * 100))
    setSliderPos(pct)
  }

  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'
  const cardBg = darkMode ? 'rgba(13, 22, 34, 0.7)' : 'rgba(255, 255, 255, 0.95)'

  return (
    <section id="casos-slider" style={{
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)',
      position: 'relative',
      background: darkMode
        ? 'radial-gradient(ellipse at 50% 0%, #0d1e30 0%, #080E15 80%)'
        : 'radial-gradient(ellipse at 50% 0%, #E2E8F0 0%, #F8FAFC 80%)',
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.4rem 1.1rem', borderRadius: 999,
            background: darkMode ? 'rgba(0, 255, 135, 0.08)' : 'rgba(5, 150, 105, 0.1)',
            border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(5, 150, 105, 0.3)'}`,
            marginBottom: '1rem'
          }}>
            <ArrowLeftRight size={15} color={darkMode ? '#00FF87' : '#059669'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#00FF87' : '#059669', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              CASOS DE ÉXITO INTERACTIVOS · ANTES VS. DESPUÉS
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, color: titleColor, marginBottom: '1rem' }}>
            Compara el Rendimiento:{' '}
            <span style={{ color: '#EF4444' }}>A Ciegas</span> vs.{' '}
            <span className="text-gradient" style={{ fontWeight: 900 }}>
              Con Zenic
            </span>
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: subColor, maxWidth: 660, margin: '0 auto 1.5rem' }}>
            Desliza el control interactivo para ver la transformación real de una tienda al pasar de operar por suposiciones a gestionar con telemetría de tráfico en tiempo real.
          </p>

          {/* Sector Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
            {CASE_STUDIES.map((c, i) => (
              <button
                key={c.sector}
                onClick={() => setActiveIdx(i)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0.6rem 1.25rem', borderRadius: 12,
                  fontSize: '0.9rem', fontWeight: 700,
                  border: activeIdx === i
                    ? `1.5px solid ${darkMode ? '#00FF87' : '#059669'}`
                    : `1px solid ${darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'}`,
                  background: activeIdx === i
                    ? (darkMode ? 'rgba(0, 255, 135, 0.15)' : 'rgba(5, 150, 105, 0.1)')
                    : (darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                  color: activeIdx === i ? (darkMode ? '#00FF87' : '#059669') : subColor,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span>{c.icon}</span>
                <span>{c.sector}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Store Profile Card */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
          background: cardBg,
          border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: darkMode ? 'none' : '0 8px 24px rgba(0,0,0,0.05)',
          borderRadius: 16, padding: '1rem 1.5rem', marginBottom: '1.5rem',
        }}>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: titleColor }}>{activeCase.storeName}</h4>
            <p style={{ fontSize: '0.82rem', color: subColor }}>{activeCase.location} · {activeCase.summary}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: darkMode ? '#00FF87' : '#059669', background: darkMode ? 'rgba(0,255,135,0.12)' : 'rgba(5,150,105,0.1)', padding: '0.4rem 0.8rem', borderRadius: 8 }}>
              {activeCase.lift}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: darkMode ? '#00E5FF' : '#0284C7', background: darkMode ? 'rgba(0,229,255,0.12)' : 'rgba(2,132,199,0.1)', padding: '0.4rem 0.8rem', borderRadius: 8 }}>
              {activeCase.revenueLift}
            </span>
          </div>
        </div>

        {/* Interactive Split View Slider Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          style={{
            position: 'relative',
            borderRadius: 24,
            overflow: 'hidden',
            border: darkMode ? '1.5px solid rgba(0, 229, 255, 0.3)' : '1.5px solid rgba(0, 180, 100, 0.25)',
            boxShadow: darkMode ? '0 25px 60px rgba(0,0,0,0.6)' : '0 15px 40px rgba(0,0,0,0.08)',
            userSelect: 'none',
            touchAction: 'none',
            cursor: 'ew-resize',
            minHeight: 520,
          }}
        >
          {/* ── LEFT HALF: "ANTES A CIEGAS" (RED/WARNING) ── */}
          <div style={{
            position: 'absolute', inset: 0,
            background: darkMode
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(254, 226, 226, 0.85) 0%, rgba(255, 255, 255, 0.98) 100%)',
          }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              boxSizing: 'border-box',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '0.35rem 0.85rem', borderRadius: 999,
                  background: darkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid #EF4444', color: '#EF4444',
                  fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.25rem',
                  letterSpacing: '0.04em'
                }}>
                  <ShieldAlert size={14} /> {activeCase.before.tag}
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', color: darkMode ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>
                    TASA DE CONVERSIÓN
                  </div>
                  <div style={{ fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, color: '#EF4444', fontFamily: 'monospace', lineHeight: 1.1, margin: '0.35rem 0 1.25rem' }}>
                    {activeCase.before.conversion}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: darkMode ? '#CBD5E1' : '#334155' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <AlertCircle size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                      <span>Fugas pico: <strong style={{ color: '#EF4444' }}>{activeCase.before.fugasPico}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Clock size={16} color="#EF4444" style={{ flexShrink: 0 }} />
                      <span>Espera en caja: <strong style={{ color: '#EF4444' }}>{activeCase.before.esperaCaja}</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Testimonial */}
              <div style={{
                background: darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.85)',
                borderRadius: 14, padding: '1rem 1.25rem',
                borderLeft: '4px solid #EF4444',
                borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.04)',
              }}>
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: darkMode ? '#CBD5E1' : '#475569', lineHeight: 1.5, margin: 0 }}>
                  "{activeCase.before.quote}"
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT HALF: "DESPUÉS CON ZENIC" (GREEN/SUCCESS) CLIPPED BY SLIDER ── */}
          <div style={{
            position: 'absolute', inset: 0,
            background: darkMode
              ? 'linear-gradient(135deg, rgba(0, 255, 135, 0.16) 0%, rgba(8, 14, 21, 0.98) 100%)'
              : 'linear-gradient(135deg, rgba(209, 250, 229, 0.88) 0%, rgba(255, 255, 255, 0.98) 100%)',
            clipPath: `polygon(${sliderPos}% 0%, 100% 0%, 100% 100%, ${sliderPos}% 100%)`,
          }}>
            <div style={{
              position: 'absolute', top: 0, bottom: 0, left: '50%', width: '50%',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
              boxSizing: 'border-box',
              textAlign: 'right',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '0.35rem 0.85rem', borderRadius: 999,
                  background: darkMode ? 'rgba(0, 255, 135, 0.2)' : 'rgba(5, 150, 105, 0.12)',
                  border: `1px solid ${darkMode ? '#00FF87' : '#059669'}`,
                  color: darkMode ? '#00FF87' : '#059669',
                  fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.25rem',
                  letterSpacing: '0.04em'
                }}>
                  <Zap size={14} /> {activeCase.after.tag}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: '0.78rem', color: darkMode ? '#94A3B8' : '#64748B', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
                    TASA DE CONVERSIÓN
                  </div>

                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 10, margin: '0.35rem 0 1.25rem', whiteSpace: 'nowrap' }}>
                    <span style={{
                      fontSize: '0.8rem', fontWeight: 800,
                      color: darkMode ? '#00FF87' : '#059669',
                      background: darkMode ? 'rgba(0,255,135,0.15)' : 'rgba(5,150,105,0.12)',
                      padding: '0.2rem 0.6rem', borderRadius: 6
                    }}>
                      {activeCase.lift}
                    </span>
                    <div style={{
                      fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900,
                      color: darkMode ? '#00FF87' : '#059669', fontFamily: 'monospace', lineHeight: 1.1,
                      textShadow: darkMode ? '0 0 25px rgba(0,255,135,0.45)' : 'none'
                    }}>
                      {activeCase.after.conversion}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: darkMode ? '#E2E8F0' : '#1E293B', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, whiteSpace: 'nowrap' }}>
                      <span>Fugas pico: <strong style={{ color: darkMode ? '#00FF87' : '#059669' }}>{activeCase.after.fugasPico}</strong></span>
                      <CheckCircle size={16} color={darkMode ? '#00FF87' : '#059669'} style={{ flexShrink: 0 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, whiteSpace: 'nowrap' }}>
                      <span>Espera en caja: <strong style={{ color: darkMode ? '#00FF87' : '#059669' }}>{activeCase.after.esperaCaja}</strong></span>
                      <Clock size={16} color={darkMode ? '#00FF87' : '#059669'} style={{ flexShrink: 0 }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote Testimonial Recostado a la Derecha */}
              <div style={{
                maxWidth: '460px',
                width: '100%',
                background: darkMode ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.85)',
                borderRadius: 14, padding: '1rem 1.25rem',
                borderRight: `4px solid ${darkMode ? '#00FF87' : '#059669'}`,
                borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                borderLeft: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.04)',
                textAlign: 'right',
                alignSelf: 'flex-end',
              }}>
                <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: darkMode ? '#E2E8F0' : '#1E293B', lineHeight: 1.5, margin: 0 }}>
                  "{activeCase.after.quote}"
                </p>
              </div>
            </div>
          </div>

          {/* DRAGGABLE DIVIDER LINE & HANDLE */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${sliderPos}%`,
            width: 3,
            background: 'linear-gradient(to bottom, #00E5FF, #00FF87)',
            boxShadow: '0 0 15px #00FF87',
            transform: 'translateX(-50%)',
            pointerEvents: 'none',
            zIndex: 30,
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 44, height: 44, borderRadius: '50%',
              background: '#080E15',
              border: '2px solid #00FF87',
              boxShadow: '0 0 20px rgba(0,255,135,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#00FF87',
            }}>
              <ArrowLeftRight size={18} />
            </div>
          </div>

          {/* Floating Helper Tip */}
          <div style={{
            position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(8, 14, 21, 0.9)', border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.35rem 0.9rem', borderRadius: 999, fontSize: '0.75rem', color: '#94A3B8',
            pointerEvents: 'none', zIndex: 35,
          }}>
            ↔ Arrastra el divisor para comparar
          </div>
        </div>

      </div>
    </section>
  )
}
