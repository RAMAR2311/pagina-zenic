import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Users,
  Monitor,
  Cpu,
  Sparkles,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  ShieldCheck,
  Layers,
  Compass,
  Coffee,
  MessageSquare,
  Calendar,
  ArrowUpRight,
  Terminal,
  Bot,
  Play,
  CheckCircle2,
  X,
  Radio,
  Tv,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import GalaxyBackground from '../components/GalaxyBackground'
import Office3DPreview from '../components/Office3DPreview'

const STATIONS = [
  {
    id: 'marlon',
    name: 'Marlon Ramírez',
    role: 'CEO & Fundador',
    area: 'Estrategia & Dirección Ejecutiva',
    desc: 'Despacho principal de liderazgo, expansión nacional y alianzas con centros comerciales y cadenas retail.',
    color: '#9C4DCC',
    icon: '👔',
    status: 'En línea',
  },
  {
    id: 'jhon',
    name: 'Jhon Aparicio',
    role: 'Director Administrativo',
    area: 'Operaciones, Finanzas & Cartera',
    desc: 'Control financiero, flujo de caja, soporte administrativo y gobernanza operativa del sistema comercial.',
    color: '#00E5FF',
    icon: '💼',
    status: 'En línea',
  },
  {
    id: 'miguel',
    name: 'Miguel Rodriguez',
    role: 'Director de Tecnología',
    area: 'Arquitectura POS, IA & Telemetría',
    desc: 'Laboratorio de ingeniería: desarrollo de visión artificial en cámaras, módulo de maneos y sincronización offline.',
    color: '#C084FC',
    icon: '💻',
    status: 'Desarrollando',
  },
  {
    id: 'santiago',
    name: 'Santiago Peraza',
    role: 'Director de Marketing y Ventas',
    area: 'Relación con Comercios & Demos',
    desc: 'Coordinación de auditorías comerciales de 15 minutos, posicionamiento de marca y onboarding de nuevos clientes.',
    color: '#00FF87',
    icon: '📢',
    status: 'En reunión',
  },
  {
    id: 'cerebro',
    name: 'Cerebro Zenic IA',
    role: 'Agente Autónomo Central',
    area: 'Base de Conocimiento · 28 Documentos',
    desc: 'Terminal viva conectada a Claude 3.5 Sonnet y zenic-cerebro/, disponible 24/7 para responder sobre Zenic.',
    color: '#FF007F',
    icon: '🤖',
    status: 'Cognición Activa',
  },
]

const OFFICE_ROOMS = [
  {
    title: 'Sala de Juntas "Auditoría de 15 Minutos"',
    badge: 'Colaborativa',
    desc: 'Mesa de conferencias equipada con pizarrón digital (Excalidraw), llamadas de voz integradas y proyector de métricas retail.',
    icon: '🎙️',
  },
  {
    title: 'Showroom Retail 360 & Telemetría',
    badge: 'Demostración',
    desc: 'Espacio de prueba interactivo donde se simula el tráfico peatonal, mapas de calor y detección de colas en checkout.',
    icon: '🏬',
  },
  {
    title: 'Terraza & Café de Comercios',
    badge: 'Networking',
    desc: 'Zona de descanso con vista panorámica a Bogotá para conversaciones informales entre comerciantes aliados.',
    icon: '☕',
  },
  {
    title: 'Ascensor de Proyectos',
    badge: 'Multinivel',
    desc: 'Permite cambiar de piso según el módulo retail o repositorio de trabajo asignado a cada equipo.',
    icon: '🛗',
  },
]

export default function OficinaVirtual({ darkMode = true }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('3d') // '3d' | 'lite'
  const [isFullscreen, setIsFullscreen] = useState(false)

  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'
  const cardBg = darkMode ? 'rgba(10, 19, 30, 0.85)' : 'rgba(255, 255, 255, 0.92)'
  const cardBorder = darkMode ? '1px solid rgba(0, 229, 255, 0.22)' : '1px solid rgba(0, 0, 0, 0.08)'

  // Abre el modal interactivo a pantalla completa
  const handleLaunchOffice = (mode = '3d') => {
    setModalMode(mode)
    setIsModalOpen(true)
  }

  return (
    <div
      style={{
        paddingTop: '80px',
        minHeight: '100vh',
        background: darkMode ? '#080E15' : '#F4F6F9',
        color: darkMode ? '#E2E8F0' : '#1E293B',
        transition: 'background 0.4s ease',
        overflowX: 'hidden',
      }}
    >
      {/* ── HERO SECTION CON PARTÍCULAS DE GALAXIA ── */}
      <section
        style={{
          position: 'relative',
          padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 4vw, 2.5rem) 2.5rem',
          background: darkMode
            ? 'radial-gradient(circle at 50% 10%, #0d233a 0%, #080E15 70%)'
            : 'radial-gradient(circle at 50% 10%, #E2E8F0 0%, #F8FAFC 70%)',
          borderBottom: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 0, 0, 0.06)'}`,
          overflow: 'hidden',
        }}
      >
        <GalaxyBackground darkMode={darkMode} density={500} />

        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          {/* Eyebrow badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.4rem 1.15rem',
              borderRadius: 999,
              background: darkMode ? 'rgba(156, 77, 204, 0.18)' : 'rgba(156, 77, 204, 0.12)',
              border: `1.5px solid ${darkMode ? 'rgba(192, 132, 252, 0.45)' : 'rgba(156, 77, 204, 0.35)'}`,
              boxShadow: darkMode ? '0 0 16px rgba(156, 77, 204, 0.25)' : 'none',
              marginBottom: '1rem',
            }}
          >
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 12px #00E5FF' }} />
            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: darkMode ? '#00E5FF' : '#0284C7',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              METAVERSO CORPORATIVO RETAIL TECH · AGENT OFFICE
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <h1
                style={{
                  fontSize: 'clamp(2.4rem, 5vw, 4rem)',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: titleColor,
                }}
              >
                Oficina Virtual 3D de{' '}
                <span className="text-gradient" style={{ fontWeight: 900 }}>
                  ZENIC S.A.S.
                </span>
              </h1>

              <p
                style={{
                  fontSize: 'clamp(1rem, 2vw, 1.18rem)',
                  color: subColor,
                  maxWidth: 600,
                  marginTop: '1rem',
                  lineHeight: 1.6,
                }}
              >
                El primer espacio virtual de retail en Colombia donde nuestro <strong>equipo directivo</strong> y{' '}
                <strong>agentes autónomos de IA</strong> colaboran en tiempo real: escritorios con terminales en vivo,
                salas de juntas con pizarra interactiva y atención directa a comercios.
              </p>

              {/* Botones de acción principales */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '2rem' }}>
                <button
                  onClick={() => handleLaunchOffice('3d')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0.9rem 1.8rem',
                    borderRadius: 14,
                    border: 'none',
                    background: 'linear-gradient(135deg, #00E5FF 0%, #9C4DCC 100%)',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 30px rgba(0, 229, 255, 0.45)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.04) translateY(-2px)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
                >
                  <Play size={20} fill="#FFFFFF" />
                  <span>Entrar al Metaverso Zenic (3D)</span>
                </button>

                <button
                  onClick={() => handleLaunchOffice('lite')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0.9rem 1.5rem',
                    borderRadius: 14,
                    border: darkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.15)',
                    background: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
                    color: titleColor,
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Monitor size={18} color="#00E5FF" />
                  <span>Modo 2D Ligero (/lite)</span>
                </button>

                <Link
                  to="/contacto"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '0.9rem 1.5rem',
                    borderRadius: 14,
                    border: darkMode ? '1px solid rgba(156, 77, 204, 0.4)' : '1px solid rgba(156, 77, 204, 0.3)',
                    background: darkMode ? 'rgba(156, 77, 204, 0.15)' : 'rgba(156, 77, 204, 0.08)',
                    color: darkMode ? '#C084FC' : '#7928CA',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <Calendar size={18} />
                  <span>Agendar en Sala de Juntas</span>
                </Link>
              </div>

              {/* Vitals micro-bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'center',
                  marginTop: '2rem',
                  fontSize: '0.82rem',
                  color: subColor,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF87' }} />
                  <span>Servidor 3D Bogotá: <strong>Activo</strong></span>
                </div>
                <div>•</div>
                <div>5 Puestos de Trabajo</div>
                <div>•</div>
                <div>Voz WebRTC + Pizarrón Excalidraw</div>
              </div>
            </div>

            {/* ── VISUALIZADOR ISOMÉTRICO 3D INTERACTIVO ── */}
            <div
              style={{
                position: 'relative',
                borderRadius: 24,
                overflow: 'hidden',
                background: darkMode ? '#060B11' : '#FFFFFF',
                border: darkMode ? '1.5px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
                boxShadow: darkMode
                  ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(156, 77, 204, 0.2)'
                  : '0 15px 40px rgba(0, 0, 0, 0.08)',
                height: 440,
              }}
            >
              <Office3DPreview darkMode={darkMode} onLaunchOffice={handleLaunchOffice} />
            </div>
          </div>
        </div>
      </section>

      {/* ── DIRECTORIO DE PUESTOS DIRECTIVOS & AGENTES ── */}
      <section style={{ maxWidth: 1280, margin: '3.5rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#C084FC',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 8,
            }}
          >
            <Users size={16} />
            <span>Directorio de Escritorios y Estaciones de Trabajo</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, color: titleColor, margin: 0 }}>
            Conoce a quienes habitan la Oficina Virtual
          </h2>
          <p style={{ color: subColor, fontSize: '1rem', maxWidth: 620, margin: '8px auto 0' }}>
            Cada directivo de Zenic y el Cerebro de Inteligencia Artificial cuentan con su propio espacio de trabajo
            y terminal en tiempo real dentro del edificio.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {STATIONS.map((st) => (
            <motion.div
              key={st.id}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: cardBg,
                borderRadius: 20,
                border: cardBorder,
                padding: '1.4rem',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: darkMode ? '0 10px 25px rgba(0,0,0,0.3)' : '0 4px 15px rgba(0,0,0,0.05)',
              }}
            >
              {/* Top color accent */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: `linear-gradient(90deg, ${st.color} 0%, transparent 100%)`,
                }}
              />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '1.8rem' }}>{st.icon}</span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
                    background: `${st.color}22`,
                    color: st.color,
                    border: `1px solid ${st.color}44`,
                  }}
                >
                  {st.status}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: titleColor, margin: '0 0 4px 0' }}>
                {st.name}
              </h3>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: st.color, marginBottom: 8 }}>
                {st.role}
              </div>

              <p style={{ fontSize: '0.82rem', color: subColor, lineHeight: 1.5, margin: '0 0 14px 0' }}>
                {st.desc}
              </p>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                  fontSize: '0.74rem',
                  color: subColor,
                }}
              >
                <span>{st.area}</span>
                <ArrowUpRight size={14} color={st.color} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── SALAS Y ESPACIOS DEL EDIFICIO ── */}
      <section style={{ maxWidth: 1280, margin: '4rem auto', padding: '0 1.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 900, color: titleColor, margin: 0 }}>
            Espacios y Salas Colaborativas
          </h2>
          <p style={{ color: subColor, fontSize: '0.95rem', maxWidth: 580, margin: '8px auto 0' }}>
            Diseñado para la colaboración remota en retail: pizarrón interactivo, demostraciones de hardware y streaming de telemetría.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {OFFICE_ROOMS.map((room, idx) => (
            <div
              key={idx}
              style={{
                background: cardBg,
                borderRadius: 18,
                border: cardBorder,
                padding: '1.4rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: '1.8rem' }}>{room.icon}</span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 999,
                    background: darkMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 229, 255, 0.1)',
                    color: '#00E5FF',
                  }}
                >
                  {room.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: titleColor, margin: '0 0 6px 0' }}>
                {room.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: subColor, lineHeight: 1.55, margin: 0 }}>
                {room.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MODAL DE INMERSIÓN EN EL METAVERSO 3D (IFRAME/FULLSCREEN VIEWER) ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 100000,
              background: 'rgba(4, 9, 15, 0.96)',
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top Bar Controls */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1.5rem',
                borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
                background: '#070E17',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #00E5FF 0%, #9C4DCC 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Building2 size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontSize: '0.98rem', fontWeight: 900, color: '#FFFFFF', margin: 0 }}>
                      Oficina Virtual 3D · ZENIC S.A.S.
                    </h3>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.5rem',
                        borderRadius: 999,
                        background: '#00FF8722',
                        color: '#00FF87',
                        border: '1px solid #00FF8744',
                      }}
                    >
                      BOGOTÁ LIVE
                    </span>
                    <span
                      style={{
                        fontSize: '0.64rem',
                        fontWeight: 800,
                        padding: '0.1rem 0.5rem',
                        borderRadius: 999,
                        background: 'rgba(156, 77, 204, 0.25)',
                        color: '#C084FC',
                        border: '1px solid rgba(156, 77, 204, 0.4)',
                        fontFamily: 'monospace',
                      }}
                    >
                      Clave: zenic2026
                    </span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                    Usa <strong>WASD</strong> para moverte · <strong>Mouse</strong> para mirar · Tecla <strong>E</strong> para interactuar · <strong>🍸 Subir a Terraza</strong> (barra superior o en el ascensor)
                  </span>
                </div>
              </div>

              {/* Controles de vista */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setModalMode('3d')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    border: 'none',
                    background: modalMode === '3d' ? 'rgba(0, 229, 255, 0.25)' : 'transparent',
                    color: modalMode === '3d' ? '#00E5FF' : '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Vista 3D Completa
                </button>

                <button
                  onClick={() => setModalMode('lite')}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    border: 'none',
                    background: modalMode === 'lite' ? 'rgba(0, 229, 255, 0.25)' : 'transparent',
                    color: modalMode === 'lite' ? '#00E5FF' : '#94A3B8',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Vista 2D Lite
                </button>

                <a
                  href={modalMode === '3d' ? 'http://localhost:4600' : 'http://localhost:4600/lite'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    background: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <span>Abrir en Pestaña</span>
                  <ExternalLink size={13} />
                </a>

                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '0.45rem 0.85rem',
                    borderRadius: 8,
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.2)',
                    color: '#EF4444',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <X size={16} />
                  <span>Salir</span>
                </button>
              </div>
            </div>

            {/* Iframe Viewport del Servidor de la Oficina */}
            <div style={{ flex: 1, position: 'relative', background: '#000000' }}>
              <iframe
                src={modalMode === '3d' ? 'http://localhost:4600' : 'http://localhost:4600/lite'}
                title="Oficina Virtual 3D Zenic"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
