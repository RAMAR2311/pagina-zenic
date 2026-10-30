import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calculator, Download, Sparkles, CheckCircle2, TrendingUp, DollarSign, Store, Users, X, FileText, ArrowRight } from 'lucide-react'

export default function RetailRoiCalculator({ darkMode, onBookConsultation }) {
  // Inputs
  const [numStores, setNumStores] = useState(3)
  const [dailyTraffic, setDailyTraffic] = useState(850)
  const [avgTicket, setAvgTicket] = useState(85000) // in COP
  const [currentConversion, setCurrentConversion] = useState(1.8) // %
  const [currency, setCurrency] = useState('COP') // 'COP' | 'USD'

  // Lead Magnet Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leadForm, setLeadForm] = useState({ name: '', company: '', email: '', phone: '' })
  const [reportGenerated, setReportGenerated] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculations
  const calculations = useMemo(() => {
    const daysInMonth = 30
    const monthlyTrafficPerStore = dailyTraffic * daysInMonth
    const totalMonthlyTraffic = monthlyTrafficPerStore * numStores

    // Current metrics
    const currentMonthlyBuyers = Math.round(totalMonthlyTraffic * (currentConversion / 100))
    const currentMonthlyRevenue = currentMonthlyBuyers * avgTicket

    // Projected metrics with Zenic (typical retail increase: +28% to +35% relative conversion gain)
    // e.g. from 1.8% -> 2.45%
    const conversionBoostFactor = 0.32 // +32%
    const projectedConversion = +(currentConversion * (1 + conversionBoostFactor)).toFixed(2)
    const projectedMonthlyBuyers = Math.round(totalMonthlyTraffic * (projectedConversion / 100))
    const additionalMonthlyBuyers = projectedMonthlyBuyers - currentMonthlyBuyers

    const additionalMonthlyRevenue = additionalMonthlyBuyers * avgTicket
    const additionalAnnualRevenue = additionalMonthlyRevenue * 12

    // Estimated Zenic Investment & ROI ratio
    const estimatedMonthlyCost = numStores * (currency === 'COP' ? 750000 : 180)
    const roiRatio = +(additionalMonthlyRevenue / Math.max(estimatedMonthlyCost, 1)).toFixed(1)

    return {
      totalMonthlyTraffic,
      currentMonthlyBuyers,
      currentMonthlyRevenue,
      projectedConversion,
      additionalMonthlyBuyers,
      additionalMonthlyRevenue,
      additionalAnnualRevenue,
      roiRatio,
    }
  }, [numStores, dailyTraffic, avgTicket, currentConversion, currency])

  const formatMoney = (val) => {
    if (currency === 'USD') {
      return `$${val.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD`
    }
    return `$${val.toLocaleString('es-CO', { maximumFractionDigits: 0 })} COP`
  }

  const handleLeadSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setReportGenerated(true)
    }, 700)
  }

  const handlePrintReport = () => {
    window.print()
  }

  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'
  const labelColor = darkMode ? '#E2E8F0' : '#1E293B'
  const controlBg = darkMode ? 'rgba(13, 22, 34, 0.8)' : 'rgba(255, 255, 255, 0.92)'
  const controlBorder = darkMode ? '1px solid rgba(0, 229, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.08)'
  const resultsBg = darkMode
    ? 'linear-gradient(135deg, rgba(8, 14, 21, 0.95) 0%, rgba(13, 27, 42, 0.9) 100%)'
    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 253, 244, 0.95) 100%)'

  return (
    <section id="calculadora-roi" style={{
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)',
      position: 'relative',
      background: darkMode
        ? 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(9, 25, 40, 0.95) 0%, #080E15 100%)'
        : 'radial-gradient(ellipse 80% 50% at 50% 50%, #E6EDF5 0%, #F8FAFC 100%)',
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      {/* Background neon glows */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: 350, height: 350, borderRadius: '50%', background: darkMode ? 'rgba(0, 255, 135, 0.05)' : 'rgba(5, 150, 105, 0.05)', filter: 'blur(90px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: 400, height: 400, borderRadius: '50%', background: darkMode ? 'rgba(0, 229, 255, 0.06)' : 'rgba(2, 132, 199, 0.05)', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.4rem 1.1rem', borderRadius: 999,
            background: darkMode ? 'rgba(0, 255, 135, 0.08)' : 'rgba(5, 150, 105, 0.1)',
            border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(5, 150, 105, 0.3)'}`,
            marginBottom: '1rem'
          }}>
            <Calculator size={15} color={darkMode ? '#00FF87' : '#059669'} />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#00FF87' : '#059669', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              DIAGNÓSTICO EN TIEMPO REAL · LEAD MAGNET RETAIL
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, color: titleColor, marginBottom: '1rem' }}>
            Calculadora de Impacto &{' '}
            <span className="text-gradient" style={{ fontWeight: 900 }}>
              ROI de Retail
            </span>
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: subColor, maxWidth: 660, margin: '0 auto' }}>
            Ingresa las métricas estimadas de tus tiendas y proyecta al instante el incremento de facturación que obtienes al optimizar la tasa de conversión con analítica de tráfico Zenic.
          </p>
        </div>

        {/* Main Grid: Inputs vs Results */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 480px), 1fr))',
          gap: 'clamp(1.5rem, 4vw, 2.5rem)',
          alignItems: 'stretch',
        }}>

          {/* Controls Column */}
          <div style={{
            background: controlBg,
            backdropFilter: 'blur(20px)',
            border: controlBorder,
            borderRadius: 24,
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.75rem',
            boxShadow: darkMode ? 'none' : '0 10px 30px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, paddingBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Store size={20} color={darkMode ? '#00FF87' : '#059669'} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: titleColor }}>Parámetros de tu Negocio</h3>
              </div>
              {/* Currency selector */}
              <div style={{ display: 'flex', background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', borderRadius: 10, padding: 3 }}>
                <button
                  type="button"
                  onClick={() => { setCurrency('COP'); if (avgTicket < 1000) setAvgTicket(85000) }}
                  style={{
                    padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: currency === 'COP' ? (darkMode ? '#00FF87' : '#059669') : 'transparent',
                    color: currency === 'COP' ? (darkMode ? '#080E15' : '#ffffff') : subColor,
                  }}
                >
                  COP
                </button>
                <button
                  type="button"
                  onClick={() => { setCurrency('USD'); if (avgTicket > 1000) setAvgTicket(25) }}
                  style={{
                    padding: '0.25rem 0.65rem', borderRadius: 8, fontSize: '0.75rem', fontWeight: 800, border: 'none', cursor: 'pointer',
                    background: currency === 'USD' ? (darkMode ? '#00FF87' : '#059669') : 'transparent',
                    color: currency === 'USD' ? (darkMode ? '#080E15' : '#ffffff') : subColor,
                  }}
                >
                  USD
                </button>
              </div>
            </div>

            {/* Slider 1: Número de Tiendas */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: labelColor, fontWeight: 600 }}>Número de Tiendas o Sedes:</span>
                <span style={{ color: darkMode ? '#00FF87' : '#059669', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'monospace' }}>
                  {numStores} {numStores === 1 ? 'tienda' : 'tiendas'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={numStores}
                onChange={e => setNumStores(Number(e.target.value))}
                style={{ width: '100%', height: 6, borderRadius: 999, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: 4 }}>
                <span>1 local</span>
                <span>25 sedes</span>
                <span>50+ cadena</span>
              </div>
            </div>

            {/* Slider 2: Tráfico Peatonal Promedio Diario por Tienda */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Tráfico Peatonal Diario Estimado:</span>
                <span style={{ color: '#00E5FF', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'monospace' }}>
                  {dailyTraffic.toLocaleString()} visitas / día
                </span>
              </div>
              <input
                type="range"
                min="100"
                max="5000"
                step="50"
                value={dailyTraffic}
                onChange={e => setDailyTraffic(Number(e.target.value))}
                style={{ width: '100%', height: 6, borderRadius: 999, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: 4 }}>
                <span>100 pers</span>
                <span>2,500 pers</span>
                <span>5,000 pers</span>
              </div>
            </div>

            {/* Slider 3: Ticket Promedio */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Ticket Promedio de Venta:</span>
                <span style={{ color: '#00FF87', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'monospace' }}>
                  {formatMoney(avgTicket)}
                </span>
              </div>
              <input
                type="range"
                min={currency === 'COP' ? 15000 : 5}
                max={currency === 'COP' ? 500000 : 150}
                step={currency === 'COP' ? 5000 : 5}
                value={avgTicket}
                onChange={e => setAvgTicket(Number(e.target.value))}
                style={{ width: '100%', height: 6, borderRadius: 999, cursor: 'pointer' }}
              />
            </div>

            {/* Slider 4: Tasa de Conversión Actual */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.9rem' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Tasa de Conversión Actual estimada:</span>
                <span style={{ color: '#F59E0B', fontWeight: 800, fontSize: '1.05rem', fontFamily: 'monospace' }}>
                  {currentConversion}%
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.1"
                value={currentConversion}
                onChange={e => setCurrentConversion(Number(e.target.value))}
                style={{ width: '100%', height: 6, borderRadius: 999, cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: 4 }}>
                <span>0.5% (baja)</span>
                <span>1.8% (promedio retail)</span>
                <span>6.0% (alta)</span>
              </div>
            </div>

            <div style={{ background: 'rgba(0, 229, 255, 0.05)', border: '1px dashed rgba(0, 229, 255, 0.25)', borderRadius: 14, padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#94A3B8' }}>
              💡 <strong>Regla del Retail:</strong> La mayoría de cadenas pierden entre el 25% y 40% de conversiones posibles en horas pico por falta de personal alineado al flujo de tráfico real.
            </div>
          </div>

          {/* Results Column */}
          <div style={{
            background: resultsBg,
            backdropFilter: 'blur(20px)',
            border: `1.5px solid ${darkMode ? 'rgba(0, 255, 135, 0.35)' : 'rgba(5, 150, 105, 0.35)'}`,
            boxShadow: darkMode
              ? '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 255, 135, 0.07)'
              : '0 20px 50px rgba(0, 0, 0, 0.06), 0 0 30px rgba(5, 150, 105, 0.05)',
            borderRadius: 24,
            padding: 'clamp(1.5rem, 3.5vw, 2.5rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.75rem',
            position: 'relative',
          }}>
            {/* Top pill */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#00FF87' : '#059669', background: darkMode ? 'rgba(0, 255, 135, 0.12)' : 'rgba(5, 150, 105, 0.1)', padding: '0.35rem 0.8rem', borderRadius: 999 }}>
                ⚡ IMPACTO PROYECTADO CON ZENIC
              </span>
              <span style={{ fontSize: '0.82rem', color: subColor }}>
                Tráfico mensual: <strong style={{ color: titleColor }}>{calculations.totalMonthlyTraffic.toLocaleString()}</strong>
              </span>
            </div>

            {/* Big Main Result Card */}
            <div style={{ background: darkMode ? 'rgba(0, 255, 135, 0.04)' : 'rgba(5, 150, 105, 0.06)', border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(5, 150, 105, 0.25)'}`, borderRadius: 20, padding: '1.5rem', textAlign: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: subColor, fontWeight: 600, display: 'block', marginBottom: 6 }}>
                Incremento Estimado de Facturación Mensual
              </span>
              <div style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 900, color: darkMode ? '#00FF87' : '#059669', lineHeight: 1.1, fontFamily: 'monospace', textShadow: darkMode ? '0 0 20px rgba(0,255,135,0.4)' : 'none' }}>
                +{formatMoney(calculations.additionalMonthlyRevenue)}
              </div>
              <span style={{ fontSize: '0.85rem', color: darkMode ? '#00E5FF' : '#0284C7', fontWeight: 700, marginTop: 6, display: 'block' }}>
                ≈ +{formatMoney(calculations.additionalAnnualRevenue)} adicional al año
              </span>
            </div>

            {/* Grid of Micro-KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ background: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}` }}>
                <span style={{ fontSize: '0.75rem', color: subColor, display: 'block', marginBottom: 4 }}>Nueva Conversión Proyectada</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: darkMode ? '#00E5FF' : '#0284C7' }}>{calculations.projectedConversion}%</span>
                  <span style={{ fontSize: '0.72rem', color: darkMode ? '#00FF87' : '#059669', fontWeight: 700 }}>+32% relativo</span>
                </div>
              </div>

              <div style={{ background: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}` }}>
                <span style={{ fontSize: '0.75rem', color: subColor, display: 'block', marginBottom: 4 }}>Nuevos Clientes Compradores</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: titleColor }}>+{calculations.additionalMonthlyBuyers.toLocaleString()}</span>
                  <span style={{ fontSize: '0.72rem', color: subColor }}>/ mes</span>
                </div>
              </div>

              <div style={{ background: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}` }}>
                <span style={{ fontSize: '0.75rem', color: subColor, display: 'block', marginBottom: 4 }}>Retorno de Inversión (ROI)</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: darkMode ? '#00FF87' : '#059669' }}>{calculations.roiRatio}×</span>
                  <span style={{ fontSize: '0.72rem', color: darkMode ? '#00FF87' : '#059669' }}>retorno mensual</span>
                </div>
              </div>

              <div style={{ background: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}` }}>
                <span style={{ fontSize: '0.75rem', color: subColor, display: 'block', marginBottom: 4 }}>Periodo de Amortización</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: darkMode ? '#00E5FF' : '#0284C7' }}>&lt; 30 días</span>
                  <span style={{ fontSize: '0.72rem', color: subColor }}>Break-even</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                  padding: '1.1rem 1.8rem', borderRadius: 14,
                  background: darkMode
                    ? 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)'
                    : 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
                  color: '#ffffff', fontSize: '1rem', fontWeight: 800,
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 8px 25px rgba(0, 255, 135, 0.35)',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
              >
                <Download size={18} />
                Descargar Reporte Completo en PDF (Gratis)
              </button>

              <button
                onClick={onBookConsultation}
                style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '0.85rem 1.5rem', borderRadius: 12,
                  background: 'transparent',
                  border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.3)' : 'rgba(2, 132, 199, 0.3)'}`,
                  color: darkMode ? '#00E5FF' : '#0284C7', fontSize: '0.9rem', fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = darkMode ? 'rgba(0, 229, 255, 0.08)' : 'rgba(2, 132, 199, 0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                Agendar llamada de 15 min con un especialista →
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* ── MODAL DE DESCARGA DE REPORTE PDF (LEAD MAGNET) ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
            background: darkMode ? 'rgba(4, 8, 14, 0.85)' : 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(16px)',
          }}>
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              style={{
                width: '100%', maxWidth: 540,
                background: darkMode ? '#0D1622' : '#FFFFFF',
                border: `1.5px solid ${darkMode ? 'rgba(0, 255, 135, 0.35)' : 'rgba(5, 150, 105, 0.35)'}`,
                borderRadius: 24,
                padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                position: 'relative',
                boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
              }}
            >
              {/* Close Button */}
              <button
                onClick={() => { setIsModalOpen(false); setReportGenerated(false) }}
                style={{ position: 'absolute', top: 18, right: 18, background: 'none', border: 'none', color: subColor, cursor: 'pointer' }}
              >
                <X size={22} />
              </button>

              {!reportGenerated ? (
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.8rem', borderRadius: 999, background: darkMode ? 'rgba(0, 255, 135, 0.1)' : 'rgba(5, 150, 105, 0.1)', color: darkMode ? '#00FF87' : '#059669', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                    <FileText size={14} /> REPORTE EJECUTIVO PERSONALIZADO
                  </div>

                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: titleColor, marginBottom: '0.5rem', lineHeight: 1.2 }}>
                    Recibe tu Diagnóstico de Retail
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: subColor, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Hemos compilado el análisis detallado para <strong>{numStores} {numStores === 1 ? 'tienda' : 'tiendas'}</strong> con la estimación de <strong>+{formatMoney(calculations.additionalMonthlyRevenue)}/mes</strong>. Ingresa tus datos para enviártelo o imprimirlo al instante.
                  </p>

                  <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: labelColor, marginBottom: 4 }}>Tu Nombre y Apellido *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ej. Carlos Mendoza"
                        value={leadForm.name}
                        onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)', color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: labelColor, marginBottom: 4 }}>Empresa / Marca de Retail *</label>
                      <input
                        required
                        type="text"
                        placeholder="Ej. Tiendas Calzatodo"
                        value={leadForm.company}
                        onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                        style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)', color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: labelColor, marginBottom: 4 }}>Correo Corporativo *</label>
                        <input
                          required
                          type="email"
                          placeholder="carlos@marca.com"
                          value={leadForm.email}
                          onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                          style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)', color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: labelColor, marginBottom: 4 }}>Teléfono / WhatsApp *</label>
                        <input
                          required
                          type="tel"
                          placeholder="+57 310..."
                          value={leadForm.phone}
                          onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                          style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: darkMode ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.12)', color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        marginTop: '0.5rem',
                        padding: '1rem', borderRadius: 12,
                        background: darkMode
                          ? 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)'
                          : 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
                        color: darkMode ? '#080E15' : '#FFFFFF', fontWeight: 800, fontSize: '1rem',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      {isSubmitting ? 'Generando Reporte...' : 'Ver y Descargar Reporte en PDF →'}
                    </button>
                    <span style={{ textAlign: 'center', fontSize: '0.72rem', color: subColor }}>
                      🔒 Cero Spam. Tus datos comerciales están protegidos bajo estricta confidencialidad.
                    </span>
                  </form>
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', background: darkMode ? 'rgba(0, 255, 135, 0.15)' : 'rgba(5, 150, 105, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: darkMode ? '#00FF87' : '#059669' }}>
                    <CheckCircle2 size={34} />
                  </div>
                  <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: titleColor, marginBottom: '0.5rem' }}>
                    ¡Diagnóstico Listo, {leadForm.name}!
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: subColor, marginBottom: '1.5rem', lineHeight: 1.5 }}>
                    Hemos enviado una copia a <strong>{leadForm.email}</strong> con los detalles específicos para <strong>{leadForm.company}</strong>.
                  </p>

                  <div style={{ background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderRadius: 16, padding: '1.25rem', textAlign: 'left', marginBottom: '1.5rem', border: darkMode ? '1px solid rgba(0,255,135,0.2)' : '1px solid rgba(5,150,105,0.2)' }}>
                    <div style={{ fontSize: '0.75rem', color: darkMode ? '#00FF87' : '#059669', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Resumen Ejecutivo Generado</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: titleColor }}>Potencial Mensual: +{formatMoney(calculations.additionalMonthlyRevenue)}</div>
                    <div style={{ fontSize: '0.85rem', color: subColor, marginTop: 4 }}>
                      • Tiendas analizadas: {numStores}<br />
                      • Conversión actual: {currentConversion}% ➔ Meta con Zenic: {calculations.projectedConversion}%<br />
                      • ROI estimado: {calculations.roiRatio}x mensual
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      onClick={handlePrintReport}
                      style={{
                        flex: 1, padding: '0.9rem', borderRadius: 12,
                        background: darkMode
                          ? 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)'
                          : 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
                        color: darkMode ? '#080E15' : '#FFFFFF', fontWeight: 800, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <Download size={18} /> Imprimir / Guardar PDF
                    </button>
                    <button
                      onClick={() => { setIsModalOpen(false); onBookConsultation?.() }}
                      style={{
                        flex: 1, padding: '0.9rem', borderRadius: 12,
                        background: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                        color: titleColor, fontWeight: 700, border: darkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.15)', cursor: 'pointer',
                      }}
                    >
                      Agendar Sesión de 15 Min
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}
