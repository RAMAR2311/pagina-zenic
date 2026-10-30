import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame, Users, Clock, ShoppingBag, AlertTriangle, Eye, Sparkles,
  Navigation, Layers, Play, Pause, RefreshCw, Video, ShieldCheck,
  Maximize2, Activity, Zap, Compass, Radio
} from 'lucide-react'

const BASE_STORE_ZONES = [
  {
    id: 'vitrina',
    name: 'Vitrina & Fachada Exterior',
    subtitle: 'Zona de Atracción e Impacto Visual',
    type: 'Captación',
    x: 8, y: 68, width: 28, height: 26,
    baseHeat: 88,
    afluenciaBase: 480,
    dwellTime: '48 segundos',
    conversion: '28.4% ingresan a tienda',
    status: 'Impacto Alto',
    color: '#00E5FF',
    glowColor: 'rgba(0, 229, 255, 0.45)',
    hotspotX: 22, hotspotY: 81,
    insight: 'La iluminación focalizada con sensor de presencia aumentó la atracción un +18% frente a vitrinas estáticas.',
    targetWaypoints: [{ x: 22, y: 81 }, { x: 15, y: 75 }],
  },
  {
    id: 'pasillo',
    name: 'Pasillo Central & Hotspot',
    subtitle: 'Arteria de Tráfico y Novedades',
    type: 'Alta Demanda',
    x: 34, y: 35, width: 32, height: 48,
    baseHeat: 96,
    afluenciaBase: 365,
    dwellTime: '4m 12s',
    conversion: '62% interactúan con producto',
    status: 'Zona Caliente 🔥',
    color: '#00FF87',
    glowColor: 'rgba(0, 255, 135, 0.55)',
    hotspotX: 50, hotspotY: 58,
    insight: 'Zona de mayor concentración. Ubicar productos de alto margen en esta isla eleva el ticket promedio en +22%.',
    targetWaypoints: [{ x: 50, y: 58 }, { x: 42, y: 46 }, { x: 56, y: 70 }],
  },
  {
    id: 'probadores',
    name: 'Probadores & Calzado',
    subtitle: 'Zona de Decisión y Experiencia',
    type: 'Conversión Crítica',
    x: 69, y: 12, width: 26, height: 38,
    baseHeat: 78,
    afluenciaBase: 142,
    dwellTime: '8m 45s',
    conversion: '71% compran tras probarse',
    status: 'Alta Conversión',
    color: '#C084FC',
    glowColor: 'rgba(192, 132, 252, 0.5)',
    hotspotX: 82, hotspotY: 30,
    insight: 'Cada cliente que entra al probador tiene 3.2x más probabilidad de cerrar compra. Mantener asistencia aquí es clave.',
    targetWaypoints: [{ x: 82, y: 30 }, { x: 74, y: 22 }],
  },
  {
    id: 'exhibicion',
    name: 'Exhibición Secundaria',
    subtitle: 'Colecciones de Temporada & Básico',
    type: 'Exploración',
    x: 8, y: 12, width: 23, height: 48,
    baseHeat: 48,
    afluenciaBase: 95,
    dwellTime: '2m 10s',
    conversion: '15% de interacción',
    status: 'Zona Fría ❄️',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    hotspotX: 19, hotspotY: 32,
    insight: 'Zona con bajo tránsito. Zenic sugiere colocar un producto gancho al fondo para atraer recorrido visual.',
    targetWaypoints: [{ x: 19, y: 32 }, { x: 14, y: 45 }],
  },
  {
    id: 'cajas',
    name: 'Cajas & Checkout',
    subtitle: 'Punto de Pago & Compra por Impulso',
    type: 'Fricción & Cobro',
    x: 69, y: 58, width: 26, height: 35,
    baseHeat: 84,
    afluenciaBase: 120,
    dwellTime: '3m 20s',
    conversion: 'Venta cerrada',
    status: 'Monitoreo de Fila',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.5)',
    hotspotX: 82, hotspotY: 75,
    insight: 'Tiempo en fila: 2.1 min. Se dispara alerta preventiva al superar 4 clientes para abrir caja auxiliar.',
    targetWaypoints: [{ x: 82, y: 75 }, { x: 74, y: 84 }],
  },
]

const TIME_PRESETS = [
  { id: 'morning', label: '10:00 AM (Apertura)', multiplier: 0.55, shoppers: 14, labelShort: 'Mañana' },
  { id: 'afternoon', label: '03:30 PM (Tarde)', multiplier: 0.8, shoppers: 26, labelShort: 'Tarde' },
  { id: 'peak', label: '07:15 PM (Hora Pico)', multiplier: 1.0, shoppers: 42, labelShort: 'Hora Pico 🔥' },
]

export default function HeatmapStoreDemo({ darkMode }) {
  const [selectedZoneId, setSelectedZoneId] = useState('pasillo')
  const [viewMode, setViewMode] = useState('heatmap') // 'heatmap' | 'flow' | 'sensors'
  const [timePresetIndex, setTimePresetIndex] = useState(2) // Default to peak hour
  const [isPlaying, setIsPlaying] = useState(true)
  const [hoveredShopper, setHoveredShopper] = useState(null)
  const [liveEvents, setLiveEvents] = useState([
    { id: 1, text: '🟢 Cliente #204 ingresó por Fachada Exterior', time: '19:14:02' },
    { id: 2, text: '🔥 Alta permanencia detectada en Pasillo Central (>3 min)', time: '19:14:08' },
    { id: 3, text: '👗 2 clientes en Probadores & Calzado', time: '19:14:14' },
  ])

  const canvasRef = useRef(null)
  const shoppersRef = useRef([])
  const animFrameRef = useRef(null)
  const scanLineRef = useRef(0)

  const currentPreset = TIME_PRESETS[timePresetIndex]

  // Calculated zones with current time multipliers
  const storeZones = useMemo(() => {
    return BASE_STORE_ZONES.map(z => ({
      ...z,
      heat: Math.round(z.baseHeat * currentPreset.multiplier),
      afluencia: `${Math.round(z.afluenciaBase * currentPreset.multiplier)} pers/h`,
    }))
  }, [currentPreset])

  const selectedZone = storeZones.find(z => z.id === selectedZoneId) || storeZones[1]

  // Initialize and run animated shoppers simulation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      if (!canvas.parentElement) return
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }
    resize()
    window.addEventListener('resize', resize)

    // Waypoint coordinates in pixels
    const getZoneCoord = (z) => ({
      x: (z.hotspotX / 100) * canvas.width,
      y: (z.hotspotY / 100) * canvas.height,
    })

    const entrancePoint = {
      x: 0.48 * canvas.width,
      y: 0.94 * canvas.height,
    }

    // Spawn initial shoppers based on preset
    const targetCount = currentPreset.shoppers
    shoppersRef.current = Array.from({ length: targetCount }, (_, i) => {
      const startAtEntrance = Math.random() > 0.4
      return {
        id: `#${100 + i}`,
        x: startAtEntrance ? entrancePoint.x + (Math.random() * 20 - 10) : Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        y: startAtEntrance ? entrancePoint.y : Math.random() * canvas.height * 0.7 + canvas.height * 0.15,
        targetZone: storeZones[Math.floor(Math.random() * storeZones.length)],
        speed: 0.5 + Math.random() * 0.7,
        dwellTimer: Math.floor(Math.random() * 120),
        size: 3.5 + Math.random() * 2,
        color: ['#00FF87', '#00E5FF', '#C084FC', '#F59E0B'][Math.floor(Math.random() * 4)],
        trail: [],
      }
    })

    let lastEventTime = Date.now()

    const render = () => {
      if (!canvas || !ctx) return

      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // ── 1. SCANLINE ANIMATION ──
      if (isPlaying) {
        scanLineRef.current = (scanLineRef.current + 1.2) % (w + 100)
      }
      const scanX = scanLineRef.current - 50
      const scanGrad = ctx.createLinearGradient(scanX - 60, 0, scanX + 60, 0)
      scanGrad.addColorStop(0, 'rgba(0, 229, 255, 0)')
      scanGrad.addColorStop(0.5, 'rgba(0, 229, 255, 0.12)')
      scanGrad.addColorStop(1, 'rgba(0, 229, 255, 0)')
      ctx.fillStyle = scanGrad
      ctx.fillRect(scanX - 60, 0, 120, h)

      // Thin laser line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(scanX, 0)
      ctx.lineTo(scanX, h)
      ctx.stroke()

      // ── 2. THERMAL HEAT BLOBS (LAYERED RADIAL GLOWS) ──
      if (viewMode === 'heatmap') {
        storeZones.forEach(zone => {
          const zx = (zone.hotspotX / 100) * w
          const zy = (zone.hotspotY / 100) * h
          const radius = (zone.heat / 100) * Math.min(w, h) * 0.42

          const heatGrad = ctx.createRadialGradient(zx, zy, 2, zx, zy, radius)
          if (zone.id === 'pasillo') {
            // Pasillo central: super hot (crimson/orange/emerald)
            heatGrad.addColorStop(0, 'rgba(255, 77, 77, 0.55)')
            heatGrad.addColorStop(0.35, 'rgba(255, 170, 0, 0.35)')
            heatGrad.addColorStop(0.7, 'rgba(0, 255, 135, 0.2)')
            heatGrad.addColorStop(1, 'transparent')
          } else if (zone.id === 'vitrina' || zone.id === 'cajas') {
            heatGrad.addColorStop(0, `${zone.color}60`)
            heatGrad.addColorStop(0.4, `${zone.color}30`)
            heatGrad.addColorStop(0.8, `${zone.color}10`)
            heatGrad.addColorStop(1, 'transparent')
          } else {
            heatGrad.addColorStop(0, `${zone.color}45`)
            heatGrad.addColorStop(0.5, `${zone.color}20`)
            heatGrad.addColorStop(1, 'transparent')
          }

          ctx.fillStyle = heatGrad
          ctx.beginPath()
          ctx.arc(zx, zy, radius, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // ── 3. CAMERA CONES & SENSORS (MODE = SENSORS) ──
      if (viewMode === 'sensors') {
        const cameras = [
          { x: 20, y: 20, angle: Math.PI / 4 },
          { x: w - 20, y: 20, angle: (3 * Math.PI) / 4 },
          { x: 20, y: h - 20, angle: -Math.PI / 4 },
          { x: w - 20, y: h - 20, angle: -(3 * Math.PI) / 4 },
        ]

        cameras.forEach((cam, idx) => {
          // Camera cone gradient
          const coneGrad = ctx.createRadialGradient(cam.x, cam.y, 4, cam.x, cam.y, 180)
          coneGrad.addColorStop(0, 'rgba(0, 229, 255, 0.4)')
          coneGrad.addColorStop(0.8, 'rgba(0, 229, 255, 0.05)')
          coneGrad.addColorStop(1, 'transparent')

          ctx.fillStyle = coneGrad
          ctx.beginPath()
          ctx.moveTo(cam.x, cam.y)
          ctx.arc(cam.x, cam.y, 180, cam.angle - 0.5, cam.angle + 0.5)
          ctx.closePath()
          ctx.fill()

          // Camera sensor node
          ctx.fillStyle = '#00E5FF'
          ctx.beginPath()
          ctx.arc(cam.x, cam.y, 5, 0, Math.PI * 2)
          ctx.fill()

          ctx.strokeStyle = '#FFFFFF'
          ctx.lineWidth = 1.5
          ctx.stroke()

          // Sensor Label
          ctx.fillStyle = '#00E5FF'
          ctx.font = '10px monospace'
          ctx.fillText(`CAM-0${idx + 1}`, cam.x + 8, cam.y - 6)
        })
      }

      // ── 4. SHOPPERS / CUSTOMERS SIMULATION ──
      const shoppers = shoppersRef.current

      shoppers.forEach(s => {
        if (isPlaying) {
          const target = getZoneCoord(s.targetZone)
          const dx = target.x - s.x
          const dy = target.y - s.y
          const dist = Math.hypot(dx, dy)

          if (dist < 22) {
            s.dwellTimer++
            // Jiggle lightly within zone
            s.x += (Math.random() - 0.5) * 0.6
            s.y += (Math.random() - 0.5) * 0.6

            if (s.dwellTimer > 90) {
              s.dwellTimer = 0
              // Pick next destination (weighted towards pasillo & cajas)
              const nextPool = [storeZones[1], storeZones[2], storeZones[4], storeZones[0]]
              s.targetZone = nextPool[Math.floor(Math.random() * nextPool.length)]
            }
          } else {
            s.x += (dx / dist) * s.speed
            s.y += (dy / dist) * s.speed
          }

          // Save trail
          s.trail.push({ x: s.x, y: s.y })
          if (s.trail.length > 10) s.trail.shift()
        }

        // Draw trail if in flow mode
        if (viewMode === 'flow' && s.trail.length > 2) {
          ctx.beginPath()
          ctx.moveTo(s.trail[0].x, s.trail[0].y)
          for (let i = 1; i < s.trail.length; i++) {
            ctx.lineTo(s.trail[i].x, s.trail[i].y)
          }
          ctx.strokeStyle = `${s.color}40`
          ctx.lineWidth = 1.8
          ctx.stroke()
        }

        // Draw customer particle
        ctx.fillStyle = s.color
        ctx.shadowColor = s.color
        ctx.shadowBlur = 8
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Inner core
        ctx.fillStyle = '#FFFFFF'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size * 0.45, 0, Math.PI * 2)
        ctx.fill()
      })

      // ── 5. RANDOM LIVE TICKER EVENTS ──
      if (Date.now() - lastEventTime > 4500 && isPlaying) {
        lastEventTime = Date.now()
        const templates = [
          '🟢 Cliente ingresó a Vitrina & Fachada',
          '🔥 Pico de aforo en Pasillo Central (94%)',
          '🛍️ Cliente pasó a Cajas & Checkout',
          '⏱️ Probador asignado · Tiempo de espera óptimo',
          '⚡ Sensor IA recalculó mapa de calor (+3% precisión)',
        ]
        const now = new Date()
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
        setLiveEvents(prev => [
          { id: Date.now(), text: templates[Math.floor(Math.random() * templates.length)], time: timeStr },
          prev[0],
          prev[1],
        ].filter(Boolean))
      }

      animFrameRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', resize)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [viewMode, currentPreset, isPlaying, storeZones])

  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'

  return (
    <section id="mapa-calor" style={{
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)',
      position: 'relative',
      background: darkMode ? '#080E15' : '#F4F6F9',
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      {/* Background ambient radial gradients */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%', width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,255,135,0.06) 0%, transparent 70%)', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%', width: 550, height: 550, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,255,0.06) 0%, transparent 70%)', pointerEvents: 'none'
      }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* ── HEADER ── */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.45rem 1.25rem', borderRadius: 999,
            background: 'rgba(0, 255, 135, 0.1)',
            border: '1px solid rgba(0, 255, 135, 0.3)',
            marginBottom: '1rem'
          }}>
            <Flame size={16} color="#00FF87" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#00FF87', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              VISIÓN TÉRMICA & AUDITORÍA EN TIEMPO REAL
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, color: titleColor, marginBottom: '1rem' }}>
            Simulador de{' '}
            <span className="text-gradient-tech" style={{ fontWeight: 900 }}>
              Mapa de Calor & Tráfico Retail
            </span>
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: subColor, maxWidth: 760, margin: '0 auto 1.5rem', lineHeight: 1.65 }}>
            Experimenta cómo la visión computacional de Zenic escanea cada rincón de un local comercial en vivo: descubre puntos fríos, cuellos de botella y las zonas donde los clientes toman decisiones de compra.
          </p>

          {/* ── CONTROL BAR: VIEW MODES & TIME SCRUBBER ── */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            padding: '0.75rem 1rem', borderRadius: 18,
            background: darkMode ? 'rgba(11, 20, 31, 0.85)' : 'rgba(255, 255, 255, 0.95)',
            border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
            boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
            maxWidth: 880, margin: '0 auto'
          }}>
            {/* View Modes */}
            <div style={{ display: 'flex', gap: 4, background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.04)', padding: 4, borderRadius: 12 }}>
              <button
                onClick={() => setViewMode('heatmap')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0.45rem 0.9rem', borderRadius: 9, fontSize: '0.8rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: viewMode === 'heatmap' ? 'linear-gradient(135deg, #00FF87, #00E5FF)' : 'transparent',
                  color: viewMode === 'heatmap' ? '#080E15' : subColor,
                  transition: 'all 0.2s',
                }}
              >
                <Flame size={14} /> Mapa Térmico
              </button>
              <button
                onClick={() => setViewMode('flow')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0.45rem 0.9rem', borderRadius: 9, fontSize: '0.8rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: viewMode === 'flow' ? 'linear-gradient(135deg, #00FF87, #00E5FF)' : 'transparent',
                  color: viewMode === 'flow' ? '#080E15' : subColor,
                  transition: 'all 0.2s',
                }}
              >
                <Navigation size={14} /> Trayectorias
              </button>
              <button
                onClick={() => setViewMode('sensors')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '0.45rem 0.9rem', borderRadius: 9, fontSize: '0.8rem', fontWeight: 700,
                  border: 'none', cursor: 'pointer',
                  background: viewMode === 'sensors' ? 'linear-gradient(135deg, #00FF87, #00E5FF)' : 'transparent',
                  color: viewMode === 'sensors' ? '#080E15' : subColor,
                  transition: 'all 0.2s',
                }}
              >
                <Radio size={14} /> Sensores IA
              </button>
            </div>

            {/* Time of Day Selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderLeft: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, paddingLeft: '0.75rem' }}>
              <Clock size={15} color="#00E5FF" />
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: subColor }}>Horario:</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {TIME_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.id}
                    onClick={() => setTimePresetIndex(idx)}
                    style={{
                      padding: '0.35rem 0.75rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 700,
                      border: 'none', cursor: 'pointer',
                      background: timePresetIndex === idx ? 'rgba(0, 229, 255, 0.2)' : 'transparent',
                      color: timePresetIndex === idx ? '#00E5FF' : subColor,
                      borderWidth: 1, borderStyle: 'solid',
                      borderColor: timePresetIndex === idx ? 'rgba(0, 229, 255, 0.45)' : 'transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    {preset.labelShort}
                  </button>
                ))}
              </div>
            </div>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.45rem 0.75rem', borderRadius: 10,
                background: isPlaying ? 'rgba(0,255,135,0.12)' : 'rgba(239,68,68,0.12)',
                border: `1px solid ${isPlaying ? 'rgba(0,255,135,0.3)' : 'rgba(239,68,68,0.3)'}`,
                color: isPlaying ? '#00FF87' : '#EF4444',
                fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} />}
              {isPlaying ? 'En Vivo' : 'Pausado'}
            </button>
          </div>
        </div>

        {/* ── MAIN BLUEPRINT & TELEMETRY GRID ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 560px), 1fr))',
          gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          alignItems: 'stretch',
        }}>

          {/* LEFT: THE INTERACTIVE ARCHITECTURAL CAD STORE PLAN */}
          <div style={{
            position: 'relative',
            background: darkMode ? 'rgba(10, 18, 28, 0.96)' : '#FFFFFF',
            border: `1.5px solid ${darkMode ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 150, 180, 0.25)'}`,
            borderRadius: 24,
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: darkMode
              ? '0 25px 60px rgba(0,0,0,0.7), 0 0 35px rgba(0, 229, 255, 0.12)'
              : '0 15px 40px rgba(0, 0, 0, 0.08), 0 0 30px rgba(0, 229, 255, 0.08)',
            overflow: 'hidden',
          }}>
            {/* Top Blueprint Bar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: '0.85rem', paddingBottom: '0.65rem',
              borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Layers size={17} color="#00FF87" />
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: titleColor, letterSpacing: '0.04em' }}>
                  PLANO ARQUITECTÓNICO · TIENDA RETAIL 240 m²
                </span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(0, 229, 255, 0.15)', color: '#00E5FF', padding: '2px 6px', borderRadius: 4, fontWeight: 800 }}>
                  LiDAR 3D
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 8px #00FF87' }} className="animate-pulse" />
                <span style={{ fontSize: '0.75rem', color: '#00FF87', fontWeight: 800 }}>
                  5 Sensores Activos · {currentPreset.shoppers} Clientes
                </span>
              </div>
            </div>

            {/* The CAD Blueprint Canvas Box */}
            <div style={{
              position: 'relative',
              flex: 1,
              minHeight: 'clamp(440px, 58vh, 560px)',
              borderRadius: 18,
              background: '#070E17', // High-tech dark cockpit background for maximum thermal contrast in both modes
              border: '1px solid rgba(0, 229, 255, 0.3)',
              overflow: 'hidden',
              boxShadow: 'inset 0 0 50px rgba(0, 0, 0, 0.8)',
            }}>
              {/* CAD Technical Grid Pattern */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15,
                backgroundImage: `
                  linear-gradient(rgba(0, 229, 255, 0.4) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 229, 255, 0.4) 1px, transparent 1px)
                `,
                backgroundSize: '24px 24px',
              }} />

              {/* Architectural Dimension Marks */}
              <div style={{ position: 'absolute', top: 8, right: 12, fontSize: '0.65rem', color: 'rgba(0, 229, 255, 0.5)', fontFamily: 'monospace' }}>
                DIM: 24.0m × 10.0m · ESCALA 1:50
              </div>

              {/* Shopper Particles & Dynamic Heatmap Canvas */}
              <canvas
                ref={canvasRef}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}
              />

              {/* Store Zones as Interactive Glowing Room Containers */}
              {storeZones.map(zone => {
                const isSelected = selectedZone.id === zone.id
                return (
                  <motion.div
                    key={zone.id}
                    onClick={() => setSelectedZoneId(zone.id)}
                    whileHover={{ scale: 1.025 }}
                    style={{
                      position: 'absolute',
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.width}%`,
                      height: `${zone.height}%`,
                      borderRadius: 14,
                      cursor: 'pointer',
                      zIndex: 12,
                      background: isSelected
                        ? `radial-gradient(ellipse at center, ${zone.color}35 0%, rgba(8,14,23,0.7) 100%)`
                        : `radial-gradient(ellipse at center, ${zone.color}15 0%, rgba(8,14,23,0.5) 100%)`,
                      border: isSelected ? `2.5px solid ${zone.color}` : `1.5px dashed ${zone.color}60`,
                      boxShadow: isSelected
                        ? `0 0 35px ${zone.glowColor}, inset 0 0 20px ${zone.color}25`
                        : `0 0 12px ${zone.color}15`,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      transition: 'border 0.25s, box-shadow 0.25s, background 0.25s',
                    }}
                  >
                    {/* Zone Title Tag */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                      <span style={{
                        fontSize: '0.73rem', fontWeight: 800,
                        color: isSelected ? '#FFFFFF' : zone.color,
                        background: 'rgba(7, 14, 23, 0.92)',
                        border: `1px solid ${zone.color}50`,
                        padding: '0.2rem 0.45rem', borderRadius: 6,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                        letterSpacing: '0.01em',
                      }}>
                        {zone.name}
                      </span>

                      {isSelected && (
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          fontSize: '0.65rem', fontWeight: 800, color: '#080E15',
                          background: zone.color, padding: '1px 6px', borderRadius: 999,
                          boxShadow: `0 0 10px ${zone.color}`,
                        }}>
                          ACTIVO
                        </span>
                      )}
                    </div>

                    {/* Zone Metrics Pill */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', fontSize: '0.72rem' }}>
                      <span style={{
                        color: '#E2E8F0',
                        background: 'rgba(7, 14, 23, 0.9)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '0.15rem 0.45rem', borderRadius: 5,
                        fontFamily: 'monospace', fontWeight: 700,
                      }}>
                        Calor: <strong style={{ color: zone.color, fontSize: '0.8rem' }}>{zone.heat}%</strong>
                      </span>

                      <span style={{
                        color: zone.color, fontSize: '0.68rem', fontWeight: 700,
                        background: `${zone.color}20`, padding: '0.1rem 0.4rem', borderRadius: 4
                      }}>
                        {zone.type}
                      </span>
                    </div>
                  </motion.div>
                )
              })}

              {/* Entrance Door Marker */}
              <div style={{
                position: 'absolute',
                bottom: 6,
                left: '48%',
                transform: 'translateX(-50%)',
                background: 'rgba(0, 255, 135, 0.25)',
                border: '1.5px solid #00FF87',
                boxShadow: '0 0 15px rgba(0,255,135,0.4)',
                padding: '0.25rem 0.9rem',
                borderRadius: 8,
                fontSize: '0.72rem',
                fontWeight: 900,
                color: '#00FF87',
                zIndex: 25,
                display: 'flex', alignItems: 'center', gap: 6,
                letterSpacing: '0.04em'
              }}>
                <span style={{ animation: 'bounce 1s infinite' }}>▼</span>
                ENTRADA CLIENTES
              </div>
            </div>

            {/* Live Ticker Feed Under Blueprint */}
            <div style={{
              marginTop: '0.85rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.55rem 0.85rem', borderRadius: 12,
              background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              fontSize: '0.76rem', color: subColor
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <Activity size={14} color="#00FF87" className="animate-pulse" />
                <span style={{ fontWeight: 700, color: titleColor }}>Registro en vivo:</span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={liveEvents[0]?.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: '#00E5FF', fontWeight: 600 }}
                  >
                    [{liveEvents[0]?.time}] {liveEvents[0]?.text}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span style={{ fontSize: '0.7rem', color: subColor, whiteSpace: 'nowrap', paddingLeft: 8 }}>
                👆 Clic para auditar zona
              </span>
            </div>
          </div>

          {/* RIGHT: DEEP TELEMETRY & ACTIONABLE AI INTELLIGENCE */}
          <div style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(12, 22, 34, 0.96) 0%, rgba(9, 25, 40, 0.92) 100%)'
              : 'linear-gradient(135deg, #FFFFFF 0%, rgba(240, 253, 250, 0.9) 100%)',
            border: `1.5px solid ${selectedZone.color}50`,
            borderRadius: 24,
            padding: 'clamp(1.5rem, 3vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: darkMode
              ? `0 25px 60px rgba(0,0,0,0.7), 0 0 35px ${selectedZone.color}20`
              : '0 15px 40px rgba(0,0,0,0.08)',
            gap: '1.25rem',
          }}>
            {/* Header of Selected Zone */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <span style={{
                  fontSize: '0.78rem', fontWeight: 800, color: selectedZone.color,
                  background: `${selectedZone.color}20`, padding: '0.35rem 0.85rem', borderRadius: 999,
                  border: `1px solid ${selectedZone.color}40`,
                }}>
                  {selectedZone.type}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 800, color: titleColor }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: selectedZone.color, boxShadow: `0 0 10px ${selectedZone.color}` }} />
                  {selectedZone.status}
                </div>
              </div>

              <h3 style={{ fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', fontWeight: 900, color: titleColor, lineHeight: 1.15 }}>
                {selectedZone.name}
              </h3>
              <p style={{ fontSize: '0.9rem', color: subColor, marginTop: 4 }}>
                {selectedZone.subtitle}
              </p>
            </div>

            {/* Metrics Dashboard for this Zone */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
              <div style={{
                background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 16, padding: '1rem',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: subColor, fontSize: '0.75rem', marginBottom: 4 }}>
                  <Users size={14} color="#00FF87" /> Afluencia Estimada
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00FF87', fontFamily: 'monospace' }}>
                  {selectedZone.afluencia}
                </div>
                <span style={{ fontSize: '0.68rem', color: subColor }}>{currentPreset.label}</span>
              </div>

              <div style={{
                background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 16, padding: '1rem',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: subColor, fontSize: '0.75rem', marginBottom: 4 }}>
                  <Clock size={14} color="#00E5FF" /> Permanencia (Dwell)
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#00E5FF', fontFamily: 'monospace' }}>
                  {selectedZone.dwellTime}
                </div>
                <span style={{ fontSize: '0.68rem', color: subColor }}>Tiempo promedio</span>
              </div>

              <div style={{
                background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 16, padding: '1rem',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: subColor, fontSize: '0.75rem', marginBottom: 4 }}>
                  <Flame size={14} color="#F59E0B" /> Nivel Térmico
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#F59E0B' }}>{selectedZone.heat}%</span>
                  <div style={{ flex: 1, height: 7, borderRadius: 999, background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedZone.heat}%`, height: '100%', background: selectedZone.color, transition: 'width 0.4s ease' }} />
                  </div>
                </div>
              </div>

              <div style={{
                background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0, 0, 0, 0.03)',
                borderRadius: 16, padding: '1rem',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: subColor, fontSize: '0.75rem', marginBottom: 4 }}>
                  <ShoppingBag size={14} color="#C084FC" /> Tasa de Conversión
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: titleColor, marginTop: 4 }}>
                  {selectedZone.conversion}
                </div>
                <span style={{ fontSize: '0.68rem', color: '#C084FC', fontWeight: 700 }}>Impacto en Caja</span>
              </div>
            </div>

            {/* AI Recommendation Card */}
            <div style={{
              background: 'rgba(0, 255, 135, 0.08)',
              border: '1.5px solid rgba(0, 255, 135, 0.35)',
              borderRadius: 18,
              padding: '1.25rem',
              boxShadow: '0 4px 20px rgba(0,255,135,0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Sparkles size={16} color="#00FF87" />
                <span style={{ fontSize: '0.78rem', fontWeight: 900, color: '#00FF87', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  RECOMENDACIÓN ACCIONABLE DE LA IA ZENIC
                </span>
              </div>
              <p style={{ fontSize: '0.92rem', color: darkMode ? '#E2E8F0' : '#1E293B', lineHeight: 1.6, fontWeight: 500 }}>
                "{selectedZone.insight}"
              </p>
            </div>

            {/* Direct Audit CTA */}
            <div>
              <a
                href="#agendar-demo"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  width: '100%', padding: '1rem 1.5rem', borderRadius: 14,
                  background: 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)',
                  color: '#080E15', fontWeight: 900, fontSize: '0.95rem',
                  textDecoration: 'none', boxSizing: 'border-box',
                  boxShadow: '0 8px 25px rgba(0, 255, 135, 0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 255, 135, 0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 255, 135, 0.35)' }}
              >
                <Zap size={18} />
                Auditar Mi Tienda con Zenic →
              </a>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: subColor, marginTop: 8 }}>
                Diagnóstico de aforo e instalación de sensores en menos de 48h
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
