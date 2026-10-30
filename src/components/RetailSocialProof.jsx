import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, TrendingUp, Users, CheckCircle2, ShieldCheck, Building2, Store } from 'lucide-react'

const METRICS = [
  { value: '+31.4%', label: 'Incremento en Tasa de Conversión', desc: 'Promedio medido en tiendas que optimizaron turnos con Zenic', color: '#C084FC' },
  { value: '48.5M+', label: 'Interacciones y Transeúntes Analizados', desc: 'Flujo peatonal procesado anónimamente con visión artificial', color: '#00E5FF' },
  { value: '99.2%', label: 'Precisión Certificada en Conteo', desc: 'Diferenciación de adultos, niños, staff y sentido de paso', color: '#9C4DCC' },
  { value: '350+', label: 'Puntos de Venta Monitoreados', desc: 'En centros comerciales y tiendas de calle en Colombia y Latam', color: '#00FF87' },
]

const RETAIL_SECTORS = [
  {
    name: 'Centros Comerciales & Malls',
    brands: ['C.C. Santafé', 'C.C. Andino', 'C.C. Viva Malls', 'Plaza Central'],
    icon: '🏬',
  },
  {
    name: 'Moda, Calzado & Boutiques',
    brands: ['Urban Style', 'Bendito Encanto', 'Calzado & Moda', 'Boutique Elite'],
    icon: '👗',
  },
  {
    name: 'Supermercados & Gran Consumo',
    brands: ['Súper Express', 'Market Central', 'Cadena Regional', 'Fresh Gourmet'],
    icon: '🛒',
  },
  {
    name: 'Tecnología & Accesorios',
    brands: ['Tekfix Mobile', 'Cases.com', 'Gadget Hub', 'Digital Market'],
    icon: '📱',
  },
]

export default function RetailSocialProof({ darkMode }) {
  const [activeTab, setActiveTab] = useState(0)

  const bgSection = darkMode ? '#080E15' : '#F8FAFC'
  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'
  const cardBg = darkMode ? 'rgba(13, 22, 34, 0.8)' : 'rgba(255, 255, 255, 0.9)'
  const containerBg = darkMode ? 'rgba(9, 19, 29, 0.9)' : 'rgba(255, 255, 255, 0.95)'

  return (
    <section style={{
      padding: 'clamp(3.5rem, 7vw, 6rem) clamp(1rem, 4vw, 2.5rem)',
      position: 'relative',
      background: bgSection,
      transition: 'background 0.4s ease',
      overflow: 'hidden',
      borderTop: `1px solid ${darkMode ? 'rgba(156, 77, 204, 0.15)' : 'rgba(0, 0, 0, 0.06)'}`,
      borderBottom: `1px solid ${darkMode ? 'rgba(156, 77, 204, 0.15)' : 'rgba(0, 0, 0, 0.06)'}`,
    }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', position: 'relative', zIndex: 10 }}>

        {/* Big Impact Numbers Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 5vw, 4rem)' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '0.4rem 1.15rem', borderRadius: 999,
            background: darkMode ? 'rgba(156, 77, 204, 0.18)' : 'rgba(156, 77, 204, 0.12)',
            border: `1.5px solid ${darkMode ? 'rgba(192, 132, 252, 0.45)' : 'rgba(156, 77, 204, 0.35)'}`,
            boxShadow: darkMode ? '0 0 16px rgba(156, 77, 204, 0.25)' : 'none',
            marginBottom: '1rem'
          }}>
            <Award size={15} color="#C084FC" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#C084FC' : '#7928CA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              RESULTADOS AUDITADOS & SOCIAL PROOF
            </span>
          </div>

          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', fontWeight: 900, lineHeight: 1.15, color: titleColor, marginBottom: '1rem' }}>
            Impacto Comprobado en el{' '}
            <span className="text-gradient" style={{ fontWeight: 900 }}>
              Retail Colombiano
            </span>
          </h2>
          <p style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)', color: subColor, maxWidth: 650, margin: '0 auto' }}>
            Respaldado por métricas de operación diaria en centros comerciales, cadenas de moda y retail de alta rotación.
          </p>
        </div>

        {/* 4 Colossal Statistics Cards in a SINGLE line */}
        <div className="metrics-row-single" style={{
          display: 'grid',
          gap: 'clamp(0.75rem, 1.8vw, 1.25rem)',
          marginBottom: 'clamp(2.5rem, 5vw, 3.5rem)',
        }}>
          {METRICS.map((m, i) => {
            const metricColor = darkMode ? m.color : m.color === '#00FF87' ? '#059669' : '#0284C7'
            return (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                style={{
                  background: cardBg,
                  backdropFilter: 'blur(16px)',
                  border: `1.5px solid ${metricColor}35`,
                  borderRadius: 18,
                  padding: 'clamp(1.1rem, 2vw, 1.5rem) clamp(0.75rem, 1.5vw, 1.15rem)',
                  textAlign: 'center',
                  boxShadow: darkMode
                    ? `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${metricColor}10`
                    : '0 8px 24px rgba(0,0,0,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '100%',
                }}
              >
                <div>
                  <div style={{
                    fontSize: 'clamp(1.9rem, 2.8vw, 2.7rem)',
                    fontWeight: 900,
                    color: metricColor,
                    lineHeight: 1,
                    fontFamily: 'monospace',
                    marginBottom: '0.5rem',
                    textShadow: darkMode ? `0 0 20px ${metricColor}45` : 'none',
                  }}>
                    {m.value}
                  </div>
                  <h3 style={{ fontSize: 'clamp(0.85rem, 1.1vw, 0.98rem)', fontWeight: 800, color: titleColor, marginBottom: '0.4rem', lineHeight: 1.25 }}>
                    {m.label}
                  </h3>
                </div>
                <p style={{ fontSize: '0.74rem', color: subColor, lineHeight: 1.45, marginTop: '0.25rem' }}>
                  {m.desc}
                </p>
              </motion.div>
            )
          })}
        </div>

        <style>{`
          .metrics-row-single {
            grid-template-columns: repeat(4, 1fr);
          }
          @media (max-width: 860px) {
            .metrics-row-single {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 460px) {
            .metrics-row-single {
              grid-template-columns: 1fr;
            }
          }
        `}</style>

        {/* Sectors and Brands Showcase */}
        <div style={{
          background: containerBg,
          border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.2)' : 'rgba(0, 0, 0, 0.08)'}`,
          boxShadow: darkMode ? 'none' : '0 10px 35px rgba(0,0,0,0.04)',
          borderRadius: 24,
          padding: 'clamp(1.75rem, 4vw, 2.75rem)',
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: darkMode ? '#00E5FF' : '#0284C7', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              SECTORES QUE OPTIMIZAN SU TRÁFICO CON ZENIC
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: titleColor, marginTop: 4 }}>
              De Cadenas de Centros Comerciales a Tiendas Especializadas
            </h3>
          </div>

          {/* Sector Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            {RETAIL_SECTORS.map((sec, i) => (
              <button
                key={sec.name}
                onClick={() => setActiveTab(i)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '0.65rem 1.25rem', borderRadius: 12,
                  fontSize: '0.88rem', fontWeight: 700,
                  border: activeTab === i
                    ? `1.5px solid ${darkMode ? '#00FF87' : '#059669'}`
                    : `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                  background: activeTab === i
                    ? (darkMode ? 'rgba(0, 255, 135, 0.15)' : 'rgba(5, 150, 105, 0.1)')
                    : (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'),
                  color: activeTab === i ? (darkMode ? '#00FF87' : '#059669') : subColor,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <span>{sec.icon}</span>
                <span>{sec.name}</span>
              </button>
            ))}
          </div>

          {/* Brands in this sector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
            gap: '1rem',
          }}>
            {RETAIL_SECTORS[activeTab].brands.map((b) => (
              <div
                key={b}
                style={{
                  padding: '1.1rem 1.5rem',
                  borderRadius: 14,
                  background: darkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  fontWeight: 800,
                  fontSize: '1rem',
                  color: titleColor,
                  boxShadow: darkMode ? '0 4px 15px rgba(0,0,0,0.2)' : '0 2px 10px rgba(0,0,0,0.03)',
                }}
              >
                <CheckCircle2 size={16} color={darkMode ? '#00FF87' : '#059669'} />
                <span>{b}</span>
              </div>
            ))}
          </div>

          {/* Bottom quote badge */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem 1.5rem',
            borderRadius: 14,
            background: darkMode ? 'rgba(0, 255, 135, 0.05)' : 'rgba(5, 150, 105, 0.08)',
            border: `1px dashed ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(5, 150, 105, 0.3)'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: 12,
            fontSize: '0.85rem',
            color: subColor,
            textAlign: 'center',
          }}>
            <ShieldCheck size={18} color={darkMode ? '#00FF87' : '#059669'} />
            <span>Sensores con procesamiento Edge AI en local: <strong style={{ color: titleColor }}>cero imágenes grabadas, máxima privacidad y cumplimiento normativo.</strong></span>
          </div>
        </div>

      </div>
    </section>
  )
}
