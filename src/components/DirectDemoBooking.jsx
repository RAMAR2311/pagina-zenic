import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Clock, Video, CheckCircle2, User, Mail, Store, Shield, Sparkles, ExternalLink } from 'lucide-react'

export default function DirectDemoBooking({ darkMode }) {
  // Generate next 5 business days
  const availableDays = useMemo(() => {
    const days = []
    const baseDate = new Date()
    let count = 0
    let dayOffset = 1
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

    while (count < 5) {
      const d = new Date(baseDate)
      d.setDate(baseDate.getDate() + dayOffset)
      const dayOfWeek = d.getDay()
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Monday to Friday
        days.push({
          fullDate: d,
          dateStr: `${d.getDate()} ${monthNames[d.getMonth()]}`,
          dayName: dayNames[dayOfWeek],
          iso: d.toISOString().split('T')[0],
        })
        count++
      }
      dayOffset++
    }
    return days
  }, [])

  const TIME_SLOTS = [
    '09:30 AM',
    '11:00 AM',
    '02:30 PM',
    '04:00 PM',
    '05:15 PM',
  ]

  const [selectedDay, setSelectedDay] = useState(availableDays[0])
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1])
  const [step, setStep] = useState(1) // 1: Select slot -> 2: Quick details -> 3: Confirmed
  const [formData, setFormData] = useState({ name: '', email: '', brand: '', phone: '' })
  const [isBooking, setIsBooking] = useState(false)

  const handleBook = (e) => {
    e.preventDefault()
    setIsBooking(true)
    setTimeout(() => {
      setIsBooking(false)
      setStep(3)
    }, 600)
  }

  const googleCalendarUrl = useMemo(() => {
    const text = encodeURIComponent('Demo Personalizada 15 min · Zenic Retail AI')
    const details = encodeURIComponent(`Sesión de diagnóstico y demostración de analítica de tráfico en vivo con un especialista de Zenic para ${formData.brand || 'tu empresa'}. Enlace Google Meet: https://meet.google.com/zen-ic-demo`)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`
  }, [formData])

  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'

  return (
    <section id="agendar-demo" style={{
      padding: 'clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 2.5rem)',
      position: 'relative',
      background: darkMode
        ? 'radial-gradient(circle at 50% 100%, #0d2238 0%, #080E15 70%)'
        : 'radial-gradient(circle at 50% 100%, #E2E8F0 0%, #F8FAFC 70%)',
      transition: 'background 0.4s ease',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.4rem 1.15rem', borderRadius: 999,
            background: darkMode ? 'rgba(156, 77, 204, 0.18)' : 'rgba(156, 77, 204, 0.12)',
            border: `1.5px solid ${darkMode ? 'rgba(192, 132, 252, 0.45)' : 'rgba(156, 77, 204, 0.35)'}`,
            boxShadow: darkMode ? '0 0 16px rgba(156, 77, 204, 0.25)' : 'none',
            marginBottom: '1rem'
          }}>
            <Calendar size={15} color="#C084FC" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#C084FC' : '#7928CA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              AGENDAMIENTO DIRECTO EN 2 CLICS · CALENDARIO DINÁMICO
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, color: titleColor, marginBottom: '1rem' }}>
            Agenda una Demo de 15 Minutos con un{' '}
            <span className="text-gradient" style={{ fontWeight: 900 }}>
              Especialista de Retail
            </span>
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: subColor, maxWidth: 620, margin: '0 auto' }}>
            Sin formularios interminables. Selecciona fecha, hora y conversa directamente con un consultor para ver cómo Zenic se adapta a tus tiendas.
          </p>
        </div>

        {/* Main Scheduler Container */}
        <div style={{
          background: darkMode ? 'rgba(13, 22, 34, 0.9)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1.5px solid ${darkMode ? 'rgba(0, 255, 135, 0.3)' : 'rgba(5, 150, 105, 0.25)'}`,
          borderRadius: 24,
          boxShadow: darkMode
            ? '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(0, 255, 135, 0.08)'
            : '0 20px 50px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
        }}>

          {/* Left Column: Meeting Info */}
          <div style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(8, 14, 21, 0.95) 0%, rgba(9, 25, 40, 0.95) 100%)'
              : 'linear-gradient(135deg, rgba(248, 250, 252, 0.98) 0%, rgba(240, 253, 250, 0.95) 100%)',
            padding: 'clamp(1.75rem, 4vw, 2.5rem)',
            borderRight: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: darkMode ? '#00FF87' : '#059669', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                <Video size={16} /> Demostración Ejecutiva Virtual
              </div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: titleColor, lineHeight: 1.25, marginBottom: '0.75rem' }}>
                Auditoría & Demostración de Telemetría Retail
              </h3>
              <p style={{ fontSize: '0.88rem', color: subColor, lineHeight: 1.6 }}>
                En 15 minutos analizaremos los puntos ciegos de tu tráfico y te mostraremos en vivo la plataforma de visión artificial conectada a sensores de muestra.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: titleColor }}>
                <Clock size={16} color={darkMode ? '#00E5FF' : '#0284C7'} />
                <span>Duración: <strong>15 minutos (ultra-eficiente)</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: titleColor }}>
                <Video size={16} color={darkMode ? '#00FF87' : '#059669'} />
                <span>Videollamada por Google Meet / Teams</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: titleColor }}>
                <Shield size={16} color="#F59E0B" />
                <span>Sin compromiso comercial obligatorio</span>
              </div>
            </div>

            <div style={{ background: darkMode ? 'rgba(0, 255, 135, 0.05)' : 'rgba(5, 150, 105, 0.08)', border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.2)' : 'rgba(5, 150, 105, 0.25)'}`, borderRadius: 14, padding: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: darkMode ? '#00FF87' : '#059669', fontSize: '0.8rem', fontWeight: 800, marginBottom: 4 }}>
                <Sparkles size={14} /> CONSULTOR ASIGNADO
              </div>
              <p style={{ fontSize: '0.82rem', color: subColor }}>
                Consultor Senior de Analítica Comercial · Respuesta confirmada de inmediato.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Calendar & Time Selector */}
          <div style={{ padding: 'clamp(1.75rem, 4vw, 2.5rem)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: titleColor, marginBottom: '1rem' }}>
                    1. Elige Fecha & Horario:
                  </h4>

                  {/* Day Picker Pills */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(58px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {availableDays.map(d => {
                      const isSel = selectedDay.iso === d.iso
                      return (
                        <button
                          key={d.iso}
                          type="button"
                          onClick={() => setSelectedDay(d)}
                          style={{
                            padding: '0.75rem 0.25rem',
                            borderRadius: 12,
                            border: isSel
                              ? '1.5px solid #C084FC'
                              : (darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.12)'),
                            background: isSel
                              ? (darkMode ? 'rgba(156, 77, 204, 0.22)' : 'rgba(156, 77, 204, 0.15)')
                              : (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                            color: isSel ? '#C084FC' : subColor,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            boxShadow: isSel ? '0 0 14px rgba(156, 77, 204, 0.25)' : 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>{d.dayName}</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 900, color: isSel ? (darkMode ? '#fff' : '#7928CA') : (darkMode ? '#CBD5E1' : '#1E293B') }}>{d.dateStr.split(' ')[0]}</span>
                          <span style={{ fontSize: '0.65rem', color: isSel ? '#C084FC' : subColor }}>{d.dateStr.split(' ')[1]}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Slots Grid */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <span style={{ display: 'block', fontSize: '0.8rem', color: subColor, fontWeight: 600, marginBottom: '0.6rem' }}>
                      Horarios disponibles para el {selectedDay.dayName} {selectedDay.dateStr}:
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: '0.6rem' }}>
                      {TIME_SLOTS.map(slot => {
                        const isSlot = selectedSlot === slot
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedSlot(slot)}
                            style={{
                              padding: '0.7rem 0.5rem',
                              borderRadius: 10,
                              border: isSlot
                                ? '1.5px solid #C084FC'
                                : (darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.12)'),
                              background: isSlot
                                ? (darkMode ? 'rgba(156, 77, 204, 0.2)' : 'rgba(156, 77, 204, 0.14)')
                                : (darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'),
                              color: isSlot
                                ? '#C084FC'
                                : (darkMode ? '#CBD5E1' : '#334155'),
                              fontSize: '0.85rem',
                              fontWeight: isSlot ? 800 : 600,
                              cursor: 'pointer',
                              boxShadow: isSlot ? '0 0 12px rgba(156, 77, 204, 0.25)' : 'none',
                              transition: 'all 0.2s',
                            }}
                          >
                            {slot}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.95rem',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 6px 20px rgba(156, 77, 204, 0.45)',
                    }}
                  >
                    Confirmar Horario ({selectedDay.dayName} · {selectedSlot}) →
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: titleColor }}>
                      2. Tus Datos para el Enlace de Google Meet:
                    </h4>
                    <button
                      onClick={() => setStep(1)}
                      style={{ background: 'none', border: 'none', color: darkMode ? '#00E5FF' : '#0284C7', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      Cambiar fecha
                    </button>
                  </div>

                  <div style={{ background: darkMode ? 'rgba(0, 229, 255, 0.08)' : 'rgba(2, 132, 199, 0.1)', border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.2)' : 'rgba(2, 132, 199, 0.25)'}`, borderRadius: 10, padding: '0.6rem 0.8rem', fontSize: '0.82rem', color: darkMode ? '#00E5FF' : '#0284C7', marginBottom: '1.25rem' }}>
                    📅 {selectedDay.dayName} {selectedDay.dateStr} a las {selectedSlot} (15 min)
                  </div>

                  <form onSubmit={handleBook} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                    <div>
                      <input
                        required
                        type="text"
                        placeholder="Tu Nombre Completo *"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`, color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <input
                        required
                        type="email"
                        placeholder="Correo Corporativo *"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`, color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <input
                        required
                        type="text"
                        placeholder="Empresa / Marca de Tienda *"
                        value={formData.brand}
                        onChange={e => setFormData({ ...formData, brand: e.target.value })}
                        style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`, color: titleColor, fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isBooking}
                      style={{
                        marginTop: '0.5rem',
                        padding: '1rem',
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '1rem',
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 8px 28px rgba(156, 77, 204, 0.5)',
                      }}
                    >
                      {isBooking ? 'Agendando...' : '¡Listo! Confirmar Demostración'}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{ textAlign: 'center' }}
                >
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: darkMode ? 'rgba(0, 255, 135, 0.15)' : 'rgba(5, 150, 105, 0.15)', color: darkMode ? '#00FF87' : '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                    <CheckCircle2 size={36} />
                  </div>

                  <h4 style={{ fontSize: '1.6rem', fontWeight: 900, color: titleColor, marginBottom: '0.5rem' }}>
                    ¡Demo Confirmada, {formData.name}!
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: subColor, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Hemos reservado tu espacio para el <strong>{selectedDay.dayName} {selectedDay.dateStr} a las {selectedSlot}</strong>. Te enviamos la invitación a <strong>{formData.email}</strong>.
                  </p>

                  <div style={{ background: darkMode ? 'rgba(0, 255, 135, 0.06)' : 'rgba(5, 150, 105, 0.08)', border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(5, 150, 105, 0.25)'}`, borderRadius: 14, padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
                    <div style={{ fontSize: '0.78rem', color: darkMode ? '#00FF87' : '#059669', fontWeight: 800, textTransform: 'uppercase' }}>ENLACE DE REUNIÓN</div>
                    <div style={{ fontSize: '0.9rem', color: titleColor, fontWeight: 700, marginTop: 4 }}>https://meet.google.com/zen-ic-retail</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: '0.9rem', borderRadius: 12,
                        background: darkMode
                          ? 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)'
                          : 'linear-gradient(135deg, #059669 0%, #0284C7 100%)',
                        color: '#ffffff', fontWeight: 800, fontSize: '0.95rem',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      }}
                    >
                      <Calendar size={18} /> Agregar a Google Calendar <ExternalLink size={15} />
                    </a>
                    <button
                      onClick={() => setStep(1)}
                      style={{ background: 'none', border: 'none', color: subColor, fontSize: '0.8rem', cursor: 'pointer' }}
                    >
                      Agendar otra reunión
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}
