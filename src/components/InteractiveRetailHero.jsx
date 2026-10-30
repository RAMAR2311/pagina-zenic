import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Users, Eye, Clock, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react'

export default function InteractiveRetailHero({ darkMode, onOpenBooking, onScrollToRoi }) {
  const canvasRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: -100, y: -100, active: false })
  const [activeZone, setActiveZone] = useState('Entrada Principal')
  const [liveCounter, setLiveCounter] = useState(1482)
  const [conversionRate, setConversionRate] = useState(2.84)

  // Live fluctuating simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCounter(prev => prev + (Math.random() > 0.4 ? 1 : 0))
      setConversionRate(prev => +(prev + (Math.random() * 0.04 - 0.02)).toFixed(2))
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  // Canvas Heatmap and Traffic Flow Simulation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let width = (canvas.width = canvas.parentElement.offsetWidth)
    let height = (canvas.height = canvas.parentElement.offsetHeight)

    const handleResize = () => {
      if (!canvas.parentElement) return
      width = canvas.width = canvas.parentElement.offsetWidth
      height = canvas.height = canvas.parentElement.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Store layout zones
    const zones = [
      { name: 'Vitrina & Fachada', x: 0.15, y: 0.75, radius: 60, color: 'rgba(0, 229, 255, ' },
      { name: 'Entrada Principal', x: 0.5, y: 0.8, radius: 75, color: 'rgba(0, 255, 135, ' },
      { name: 'Pasillo Central / Hotspot', x: 0.5, y: 0.45, radius: 85, color: 'rgba(0, 255, 135, ' },
      { name: 'Zona Promocional A', x: 0.28, y: 0.4, radius: 65, color: 'rgba(156, 77, 204, ' },
      { name: 'Probadores & Calzado', x: 0.75, y: 0.35, radius: 70, color: 'rgba(255, 184, 0, ' },
      { name: 'Cajas & Checkout', x: 0.82, y: 0.72, radius: 60, color: 'rgba(0, 229, 255, ' },
    ]

    // Simulated customers (particles with direction and speed)
    const particles = Array.from({ length: 42 }, () => {
      const targetZone = zones[Math.floor(Math.random() * zones.length)]
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        targetX: targetZone.x * width,
        targetY: targetZone.y * height,
        radius: Math.random() * 2.5 + 2,
        alpha: Math.random() * 0.5 + 0.3,
        history: [],
      }
    })

    let t = 0
    const render = () => {
      t += 0.015
      ctx.clearRect(0, 0, width, height)

      // Draw subtle architectural store grid
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.05)'
      ctx.lineWidth = 1
      const gridSize = 45
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw heat zones with soft radial glow
      zones.forEach(zone => {
        const zx = zone.x * width
        const zy = zone.y * height
        const pulse = Math.sin(t * 2 + zone.x * 10) * 8
        const grad = ctx.createRadialGradient(zx, zy, 4, zx, zy, zone.radius + pulse)
        grad.addColorStop(0, zone.color + '0.35)')
        grad.addColorStop(0.5, zone.color + '0.12)')
        grad.addColorStop(1, zone.color + '0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(zx, zy, zone.radius + pulse, 0, Math.PI * 2)
        ctx.fill()

        // Zone marker border
        ctx.strokeStyle = zone.color + '0.25)'
        ctx.setLineDash([4, 4])
        ctx.beginPath()
        ctx.arc(zx, zy, zone.radius * 0.7, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])
      })

      // Update and draw customer particles
      particles.forEach(p => {
        // Move towards target zone with slight noise
        const dx = p.targetX - p.x
        const dy = p.targetY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 40) {
          const nextZone = zones[Math.floor(Math.random() * zones.length)]
          p.targetX = nextZone.x * width + (Math.random() - 0.5) * 50
          p.targetY = nextZone.y * height + (Math.random() - 0.5) * 50
        } else {
          p.vx += (dx / dist) * 0.03
          p.vy += (dy / dist) * 0.03
        }

        // Mouse avoidance/attraction
        if (mousePos.active) {
          const mdx = mousePos.x - p.x
          const mdy = mousePos.y - p.y
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy)
          if (mdist < 120 && mdist > 10) {
            p.vx += (mdx / mdist) * 0.08
            p.vy += (mdy / mdist) * 0.08
          }
        }

        p.vx *= 0.96
        p.vy *= 0.96
        p.x += p.vx
        p.y += p.vy

        // Save history for heat trails
        p.history.push({ x: p.x, y: p.y })
        if (p.history.length > 8) p.history.shift()

        // Draw trail
        if (p.history.length > 1) {
          ctx.beginPath()
          ctx.moveTo(p.history[0].x, p.history[0].y)
          for (let i = 1; i < p.history.length; i++) {
            ctx.lineTo(p.history[i].x, p.history[i].y)
          }
          ctx.strokeStyle = 'rgba(0, 255, 135, 0.2)'
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // Draw particle node
        ctx.fillStyle = '#00FF87'
        ctx.shadowColor = '#00FF87'
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      // Mouse interactive sensor radar ring
      if (mousePos.active) {
        const radarGrad = ctx.createRadialGradient(
          mousePos.x, mousePos.y, 5,
          mousePos.x, mousePos.y, 90
        )
        radarGrad.addColorStop(0, 'rgba(0, 255, 135, 0.3)')
        radarGrad.addColorStop(0.7, 'rgba(0, 229, 255, 0.12)')
        radarGrad.addColorStop(1, 'rgba(0, 229, 255, 0)')

        ctx.fillStyle = radarGrad
        ctx.beginPath()
        ctx.arc(mousePos.x, mousePos.y, 90, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = 'rgba(0, 255, 135, 0.6)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.arc(mousePos.x, mousePos.y, (t * 50) % 90, 0, Math.PI * 2)
        ctx.stroke()

        // Cursor crosshair
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)'
        ctx.beginPath()
        ctx.moveTo(mousePos.x - 12, mousePos.y)
        ctx.lineTo(mousePos.x + 12, mousePos.y)
        ctx.moveTo(mousePos.x, mousePos.y - 12)
        ctx.lineTo(mousePos.x, mousePos.y + 12)
        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [mousePos])

  const handleMouseMove = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y, active: true })

    // Determine nearest zone
    const width = rect.width
    const height = rect.height
    const zones = [
      { name: 'Vitrina & Fachada', x: 0.15 * width, y: 0.75 * height },
      { name: 'Entrada Principal', x: 0.5 * width, y: 0.8 * height },
      { name: 'Pasillo Central', x: 0.5 * width, y: 0.45 * height },
      { name: 'Zona Promocional A', x: 0.28 * width, y: 0.4 * height },
      { name: 'Probadores & Calzado', x: 0.75 * width, y: 0.35 * height },
      { name: 'Cajas & Checkout', x: 0.82 * width, y: 0.72 * height },
    ]
    let nearest = zones[0]
    let minDist = 99999
    zones.forEach(z => {
      const d = Math.hypot(z.x - x, z.y - y)
      if (d < minDist) {
        minDist = d
        nearest = z
      }
    })
    if (minDist < 140) setActiveZone(nearest.name)
  }

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, active: false }))
  }

  const bgGradient = darkMode
    ? 'radial-gradient(circle at 50% 20%, #0d1b2a 0%, #080E15 70%, #05090e 100%)'
    : 'radial-gradient(circle at 50% 10%, #E6EDF5 0%, #F1F5F9 60%, #F8FAFC 100%)'

  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'

  return (
    <section style={{
      position: 'relative',
      minHeight: '94vh',
      display: 'flex',
      alignItems: 'center',
      padding: 'clamp(5.5rem, 10vw, 7.5rem) clamp(1rem, 4vw, 2.5rem) 3.5rem',
      background: bgGradient,
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      {/* Background Tech Glow & Grid with prominent Zenic Purple Cosmos */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: darkMode
          ? `
            radial-gradient(circle at 75% 25%, rgba(156, 77, 204, 0.22) 0%, transparent 55%),
            radial-gradient(circle at 18% 70%, rgba(74, 37, 116, 0.28) 0%, transparent 50%),
            radial-gradient(circle at 20% 30%, rgba(0, 255, 135, 0.06) 0%, transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(0, 229, 255, 0.06) 0%, transparent 50%)
          `
          : `
            radial-gradient(circle at 75% 25%, rgba(156, 77, 204, 0.14) 0%, transparent 55%),
            radial-gradient(circle at 18% 70%, rgba(156, 77, 204, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 20% 30%, rgba(0, 200, 117, 0.06) 0%, transparent 45%),
            radial-gradient(circle at 80% 60%, rgba(2, 132, 199, 0.06) 0%, transparent 50%)
          `,
      }} />

      <div style={{ maxWidth: 1320, margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))',
          gap: 'clamp(2rem, 5vw, 4rem)',
          alignItems: 'center',
        }}>

          {/* Left Column: Value-Driven Messaging */}
          <div>
            {/* Live Data Badge with Zenic Corporate Purple */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '0.45rem 1.15rem', borderRadius: 999,
              background: darkMode ? 'rgba(156, 77, 204, 0.16)' : 'rgba(156, 77, 204, 0.12)',
              border: `1.5px solid ${darkMode ? 'rgba(192, 132, 252, 0.45)' : 'rgba(156, 77, 204, 0.35)'}`,
              marginBottom: '1.5rem',
              boxShadow: darkMode ? '0 0 16px rgba(156, 77, 204, 0.25)' : '0 2px 8px rgba(156, 77, 204, 0.1)',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#C084FC', boxShadow: '0 0 12px #C084FC', display: 'inline-block' }} />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: darkMode ? '#C084FC' : '#7928CA' }}>
                VISIÓN ARTIFICIAL & ANALÍTICA DE RETAIL
              </span>
            </div>

            {/* Core Value Headline with Zenic Purple Glow */}
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5.2vw, 4.4rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: titleColor,
              marginBottom: '1.4rem',
            }}>
              Transformamos datos de tráfico en{' '}
              <span className="text-gradient" style={{ fontWeight: 900 }}>
                decisiones rentables
              </span>{' '}
              para el Retail.
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              lineHeight: 1.65,
              color: subColor,
              maxWidth: 580,
              marginBottom: '2.2rem',
            }}>
              Mide afluencia exacta en tienda, tiempos de permanencia y mapas de calor en tiempo real. Optimiza turnos de personal, vitrinas y tasa de conversión con inteligencia predictiva.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', marginBottom: '2.5rem' }}>
              <button
                onClick={onOpenBooking}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '1.05rem 2.2rem', borderRadius: 14,
                  fontSize: '1.02rem', fontWeight: 800,
                  color: '#FFFFFF',
                  background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(156, 77, 204, 0.45)',
                  transition: 'transform 0.25s, box-shadow 0.25s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 38px rgba(156, 77, 204, 0.7)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(156, 77, 204, 0.45)' }}
              >
                <Zap size={18} fill="#FFFFFF" />
                Agendar Demo en Vivo (15 min)
                <ArrowRight size={18} />
              </button>

              <button
                onClick={onScrollToRoi}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '1.05rem 1.8rem', borderRadius: 14,
                  fontSize: '0.98rem', fontWeight: 700,
                  color: darkMode ? '#00E5FF' : '#0284C7',
                  background: darkMode ? 'rgba(0, 229, 255, 0.08)' : 'rgba(2, 132, 199, 0.08)',
                  border: darkMode ? '1.5px solid rgba(0, 229, 255, 0.35)' : '1.5px solid rgba(2, 132, 199, 0.35)',
                  cursor: 'pointer',
                  transition: 'background 0.25s, border-color 0.25s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = darkMode ? 'rgba(0, 229, 255, 0.16)' : 'rgba(2, 132, 199, 0.16)';
                  e.currentTarget.style.borderColor = darkMode ? '#00E5FF' : '#0284C7';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = darkMode ? 'rgba(0, 229, 255, 0.08)' : 'rgba(2, 132, 199, 0.08)';
                  e.currentTarget.style.borderColor = darkMode ? 'rgba(0, 229, 255, 0.35)' : 'rgba(2, 132, 199, 0.35)';
                }}
              >
                📊 Calcular ROI de mi Tienda
              </button>
            </div>

            {/* Quick Guarantees */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', color: '#64748B', fontSize: '0.84rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} color="#00FF87" />
                <span>99.2% de precisión de conteo</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={16} color="#00E5FF" />
                <span>100% Anónimo (Cumple GDPR/Habeas Data)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Activity size={16} color="#00FF87" />
                <span>Métricas en vivo sin latencia</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive Retail Simulation Canvas & Dashboard */}
          <div style={{ position: 'relative' }}>
            {/* Dashboard Container */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                borderRadius: 24,
                overflow: 'hidden',
                background: darkMode ? 'rgba(9, 19, 29, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(0, 180, 120, 0.25)'}`,
                boxShadow: darkMode
                  ? '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 255, 135, 0.08)'
                  : '0 20px 60px rgba(0, 0, 0, 0.08), 0 0 40px rgba(0, 180, 120, 0.06)',
                height: 'clamp(440px, 55vh, 520px)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background 0.3s, border-color 0.3s',
              }}
            >
              {/* Top Bar: Telemetry Status */}
              <div style={{
                padding: '0.85rem 1.25rem',
                borderBottom: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)'}`,
                background: darkMode ? 'rgba(8, 14, 21, 0.9)' : 'rgba(248, 250, 252, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 8,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: darkMode ? '#00FF87' : '#059669', boxShadow: `0 0 10px ${darkMode ? '#00FF87' : '#059669'}` }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: titleColor, letterSpacing: '0.02em' }}>
                    ZENIC RETAIL OS · TIENDA DEMO EN VIVO
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: '0.75rem', color: darkMode ? '#00E5FF' : '#0284C7', background: darkMode ? 'rgba(0, 229, 255, 0.1)' : 'rgba(2, 132, 199, 0.1)', padding: '0.2rem 0.6rem', borderRadius: 999, fontWeight: 700 }}>
                    Sensor Activo: {activeZone}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: subColor }}>
                    FPS: 60 · 4K AI Vision
                  </span>
                </div>
              </div>

              {/* Main Canvas Viewport */}
              <div style={{ position: 'relative', flex: 1, cursor: 'crosshair', overflow: 'hidden' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

                {/* Floating Metric Pill: Live Footfall */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    padding: '0.65rem 1rem',
                    borderRadius: 14,
                    background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.3)' : 'rgba(0, 180, 100, 0.25)'}`,
                    boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.06)',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <Users size={15} color={darkMode ? '#00FF87' : '#059669'} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: subColor, textTransform: 'uppercase' }}>
                      Tráfico Acumulado Hoy
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 900, color: darkMode ? '#00FF87' : '#059669', fontFamily: 'monospace' }}>
                      {liveCounter.toLocaleString()}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: darkMode ? '#00E5FF' : '#0284C7', background: darkMode ? 'rgba(0,229,255,0.12)' : 'rgba(2,132,199,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                      +18.4% vs prom
                    </span>
                  </div>
                </motion.div>

                {/* Floating Metric Pill: Real-time Conversion */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    padding: '0.65rem 1rem',
                    borderRadius: 14,
                    background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                    backdropFilter: 'blur(16px)',
                    border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.3)' : 'rgba(2, 132, 199, 0.25)'}`,
                    boxShadow: darkMode ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.06)',
                    pointerEvents: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <TrendingUp size={15} color={darkMode ? '#00E5FF' : '#0284C7'} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: subColor, textTransform: 'uppercase' }}>
                      Tasa de Conversión
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: '1.45rem', fontWeight: 900, color: darkMode ? '#00E5FF' : '#0284C7', fontFamily: 'monospace' }}>
                      {conversionRate}%
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: darkMode ? '#00FF87' : '#059669', background: darkMode ? 'rgba(0,255,135,0.12)' : 'rgba(5,150,105,0.1)', padding: '0.1rem 0.4rem', borderRadius: 4 }}>
                      Optimizada
                    </span>
                  </div>
                </motion.div>

                {/* Bottom Overlay Pill: Zone Telemetry */}
                <div style={{
                  position: 'absolute',
                  bottom: 14,
                  left: 14,
                  right: 14,
                  padding: '0.6rem 1rem',
                  borderRadius: 12,
                  background: darkMode ? 'rgba(8, 14, 21, 0.92)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(16px)',
                  border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.2)' : 'rgba(0, 180, 100, 0.2)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                  fontSize: '0.8rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Clock size={14} color={darkMode ? '#00FF87' : '#059669'} />
                    <span style={{ color: titleColor, fontWeight: 600 }}>
                      Dwell Time: <strong style={{ color: darkMode ? '#00FF87' : '#059669' }}>6m 42s</strong>
                    </span>
                    <span style={{ color: subColor }}>|</span>
                    <span style={{ color: titleColor, fontWeight: 600 }}>
                      Captura Fachada: <strong style={{ color: darkMode ? '#00E5FF' : '#0284C7' }}>31.2%</strong>
                    </span>
                  </div>
                  <span style={{ color: subColor, fontSize: '0.75rem' }}>
                    💡 Mueve el cursor para inspeccionar zonas térmicas
                  </span>
                </div>
              </div>
            </div>

            {/* Glowing Accent Beneath Dashboard */}
            <div style={{
              position: 'absolute',
              bottom: -20,
              left: '10%',
              right: '10%',
              height: 40,
              background: 'radial-gradient(ellipse at center, rgba(0, 255, 135, 0.35) 0%, transparent 70%)',
              filter: 'blur(25px)',
              pointerEvents: 'none',
            }} />
          </div>

        </div>
      </div>
    </section>
  )
}
