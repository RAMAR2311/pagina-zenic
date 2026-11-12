import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  Sparkles,
  Bot,
  User,
  Key,
  RotateCcw,
  Check,
  AlertCircle,
  FileText,
  ShieldCheck,
  ChevronDown,
  Copy,
  ExternalLink,
  Info,
  Sliders,
  X,
  MessageSquare,
  Cpu,
} from 'lucide-react'

// Chips de preguntas rápidas sobre Zenic
const QUICK_QUESTIONS = [
  { label: '¿Cómo funciona el módulo de Maneos?', icon: '🤝' },
  { label: '¿Qué es la Aprobación Remota desde el celular?', icon: '📱' },
  { label: '¿Cómo funciona el historial de IMEI para celulares?', icon: '🔍' },
  { label: '¿Quiénes conforman el equipo directivo de Zenic?', icon: '👥' },
  { label: '¿Cuáles son los precios del POS?', icon: '🏷️' },
  { label: '¿Cuáles son los clientes oficiales de Zenic?', icon: '🏢' },
  { label: '¿Qué es la auditoría de negocio de 15 minutos?', icon: '⏱️' },
]

export default function ZenicBrainChat({ darkMode = true, isFloating = false, onClose = null }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: `¡Hola! Soy el **Cerebro IA de ZENIC S.A.S.**, entrenado y respaldado por la carpeta oficial de conocimiento **\`zenic-cerebro/\`** y la API de **Claude**.

Todo lo que respondo se basa exclusivamente en los 28 documentos oficiales de la empresa (módulos, equipo, clientes, propuesta de valor y visión de comercio real). **Nunca invento precios, clientes ni especificaciones.**

¿Qué deseas consultar hoy sobre Zenic?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: ['zenic-cerebro/CLAUDE.md', 'zenic-cerebro/README.md'],
      isClaudeApi: false,
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [knowledgeStats, setKnowledgeStats] = useState({ count: 28, hasApiKey: false })
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  // Cargar API Key desde localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('zenic_anthropic_api_key') || ''
    if (savedKey) setApiKey(savedKey)

    // Consultar estado de la base de conocimiento
    fetch('/api/cerebro/knowledge')
      .then(res => res.json())
      .then(data => {
        if (data.count) {
          setKnowledgeStats({ count: data.count, hasApiKey: data.hasApiKey })
        }
      })
      .catch(() => {
        // En caso de modo estático frontend
      })
  }, [])

  // Auto-scroll al recibir mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Guardar API Key
  const handleSaveApiKey = (key) => {
    const clean = key.trim()
    setApiKey(clean)
    if (clean) {
      localStorage.setItem('zenic_anthropic_api_key', clean)
    } else {
      localStorage.removeItem('zenic_anthropic_api_key')
    }
  }

  // Enviar mensaje
  const sendMessage = async (textToSend) => {
    const text = (textToSend || input).trim()
    if (!text || loading) return

    const userMsg = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/cerebro/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          apiKey: apiKey.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()
      const assistantMsg = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: data.content || 'Sin respuesta del cerebro.',
        sources: data.sources || [],
        model: data.model || (data.isClaudeApi ? 'Claude 3.5 Sonnet' : 'zenic-cerebro engine'),
        isClaudeApi: Boolean(data.isClaudeApi),
        warning: data.warning,
        note: data.note,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages(prev => [...prev, assistantMsg])
    } catch (err) {
      // Mensaje de fallback amigable si no responde el backend
      const errorMsg = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content: `No fue posible conectar con el servidor de IA (${err.message}). Recuerda verificar que el servidor local esté activo en el puerto 4000.`,
        sources: ['zenic-cerebro/'],
        isClaudeApi: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, errorMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Conversación reiniciada. Puedes consultar cualquier duda sobre Zenic S.A.S. y su base de conocimiento.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['zenic-cerebro/CLAUDE.md'],
        isClaudeApi: false,
      },
    ])
  }

  // Renderizador simple de markdown para el chat
  const formatMarkdown = (content) => {
    if (!content) return ''
    
    // Dividir en párrafos
    const lines = content.split('\n')
    return lines.map((line, idx) => {
      // Títulos
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} style={{ fontSize: '1rem', fontWeight: 800, margin: '0.8rem 0 0.3rem', color: darkMode ? '#C084FC' : '#7928CA' }}>
            {line.replace('### ', '')}
          </h4>
        )
      }
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} style={{ fontSize: '1.1rem', fontWeight: 800, margin: '1rem 0 0.4rem', color: darkMode ? '#00E5FF' : '#0284C7' }}>
            {line.replace('## ', '')}
          </h3>
        )
      }

      // Viñetas
      if (line.startsWith('* ') || line.startsWith('- ')) {
        const bulletText = line.substring(2)
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, margin: '0.25rem 0', paddingLeft: 8 }}>
            <span style={{ color: '#9C4DCC', fontWeight: 'bold' }}>•</span>
            <span>{renderFormattedInline(bulletText)}</span>
          </div>
        )
      }

      // Líneas numeradas (1. , 2. , etc.)
      const numMatch = line.match(/^(\d+)\.\s+(.*)/)
      if (numMatch) {
        return (
          <div key={idx} style={{ display: 'flex', gap: 8, margin: '0.25rem 0', paddingLeft: 8 }}>
            <span style={{ color: '#00E5FF', fontWeight: 800, fontFamily: 'monospace', minWidth: 16 }}>{numMatch[1]}.</span>
            <span>{renderFormattedInline(numMatch[2])}</span>
          </div>
        )
      }

      // Párrafo normal
      if (line.trim() === '') {
        return <div key={idx} style={{ height: 8 }} />
      }

      return (
        <p key={idx} style={{ margin: '0.35rem 0', lineHeight: 1.6 }}>
          {renderFormattedInline(line)}
        </p>
      )
    })
  }

  // Resalta negritas (**texto**) y código (`texto`)
  const renderFormattedInline = (text) => {
    const parts = []
    let remaining = text

    // Regex para **bold** y `code`
    const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index))
      }
      const token = match[0]
      if (token.startsWith('**') && token.endsWith('**')) {
        parts.push(
          <strong key={match.index} style={{ color: darkMode ? '#FFFFFF' : '#0F172A', fontWeight: 700 }}>
            {token.slice(2, -2)}
          </strong>
        )
      } else if (token.startsWith('`') && token.endsWith('`')) {
        parts.push(
          <code
            key={match.index}
            style={{
              padding: '0.15rem 0.4rem',
              borderRadius: 6,
              background: darkMode ? 'rgba(156, 77, 204, 0.22)' : 'rgba(156, 77, 204, 0.12)',
              color: darkMode ? '#C084FC' : '#7928CA',
              fontFamily: 'monospace',
              fontSize: '0.85em',
            }}
          >
            {token.slice(1, -1)}
          </code>
        )
      }
      lastIndex = regex.lastIndex
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex))
    }

    return parts.length > 0 ? parts : text
  }

  const containerBg = darkMode ? '#070D14' : '#FFFFFF'
  const cardBorder = darkMode ? '1px solid rgba(156, 77, 204, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)'
  const textColor = darkMode ? '#E2E8F0' : '#1E293B'
  const subColor = darkMode ? '#94A3B8' : '#64748B'

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: isFloating ? 'min(580px, calc(100vh - 170px))' : '700px',
        maxHeight: isFloating ? 'calc(100vh - 170px)' : '85vh',
        background: containerBg,
        borderRadius: 24,
        border: cardBorder,
        boxShadow: darkMode
          ? '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(156, 77, 204, 0.15)'
          : '0 15px 45px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── HEADER DEL CHAT ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 1.4rem',
          borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
          background: darkMode ? 'rgba(11, 20, 32, 0.95)' : 'rgba(248, 250, 252, 0.95)',
          backdropFilter: 'blur(10px)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #9C4DCC 0%, #00E5FF 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(156, 77, 204, 0.45)',
            }}
          >
            <Bot size={22} color="#FFFFFF" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h3 style={{ fontSize: '1.02rem', fontWeight: 900, color: darkMode ? '#FFFFFF' : '#0F172A', margin: 0 }}>
                Cerebro Zenic IA
              </h3>
              <span
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.55rem',
                  borderRadius: 999,
                  background: 'rgba(0, 229, 255, 0.15)',
                  color: '#00E5FF',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                }}
              >
                Claude API
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: '#00FF87',
                  boxShadow: '0 0 8px #00FF87',
                }}
              />
              <span style={{ fontSize: '0.74rem', color: subColor }}>
                Base de conocimiento: <strong>zenic-cerebro/</strong> ({knowledgeStats.count} archivos activos)
              </span>
            </div>
          </div>
        </div>

        {/* Acciones del Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Configurar clave de Claude (Anthropic API Key)"
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: 10,
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
              background: showSettings
                ? 'rgba(156, 77, 204, 0.25)'
                : darkMode
                ? 'rgba(255, 255, 255, 0.05)'
                : '#FFFFFF',
              color: showSettings ? '#C084FC' : textColor,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.78rem',
              fontWeight: 700,
              transition: 'all 0.2s',
            }}
          >
            <Key size={14} />
            <span className="hidden sm:inline">
              {apiKey ? 'API Key configurada' : 'Configurar Claude API'}
            </span>
          </button>

          <button
            onClick={handleClear}
            title="Reiniciar chat"
            style={{
              padding: '0.5rem',
              borderRadius: 10,
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.1)',
              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : '#FFFFFF',
              color: subColor,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <RotateCcw size={15} />
          </button>

          {isFloating && onClose && (
            <button
              onClick={onClose}
              title="Cerrar chat flotante"
              style={{
                padding: '0.5rem',
                borderRadius: 10,
                border: 'none',
                background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                color: textColor,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ── PANEL DESPLEGABLE DE AJUSTES DE API KEY ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{
              background: darkMode ? 'rgba(18, 31, 48, 0.95)' : '#F1F5F9',
              borderBottom: darkMode ? '1px solid rgba(156, 77, 204, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
              padding: '1rem 1.4rem',
              overflow: 'hidden',
              fontSize: '0.82rem',
              zIndex: 9,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <ShieldCheck size={16} color="#00E5FF" />
              <strong style={{ color: darkMode ? '#FFFFFF' : '#0F172A' }}>
                Conexión con Claude 3.5 Sonnet (Anthropic API)
              </strong>
            </div>

            <p style={{ color: subColor, margin: '0 0 10px 0', lineHeight: 1.45 }}>
              Para usar la API oficial de Claude directamente en tiempo real, ingresa tu clave{' '}
              <code style={{ color: '#C084FC' }}>sk-ant-...</code>. Se guarda únicamente en tu navegador local (localStorage).
              Si no cuentas con una clave, el chat continuará funcionando con el{' '}
              <strong style={{ color: '#00FF87' }}>motor local estricto</strong> de <code style={{ color: '#C084FC' }}>zenic-cerebro/</code>.
            </p>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="password"
                placeholder="sk-ant-api03-..."
                value={apiKey}
                onChange={(e) => handleSaveApiKey(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.85rem',
                  borderRadius: 10,
                  border: darkMode ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(0, 0, 0, 0.15)',
                  background: darkMode ? '#0A121C' : '#FFFFFF',
                  color: textColor,
                  fontSize: '0.84rem',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
              {apiKey && (
                <button
                  onClick={() => handleSaveApiKey('')}
                  style={{
                    padding: '0.55rem 0.85rem',
                    borderRadius: 10,
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#EF4444',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '0.78rem',
                  }}
                >
                  Borrar
                </button>
              )}
              <button
                onClick={() => setShowSettings(false)}
                style={{
                  padding: '0.55rem 1.1rem',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                }}
              >
                Listo
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LISTA DE MENSAJES ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1.25rem 1.4rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user'

          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: isUser ? 'row-reverse' : 'row',
                gap: 12,
                alignItems: 'flex-start',
                maxWidth: '100%',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isUser
                    ? 'linear-gradient(135deg, #00E5FF 0%, #0284C7 100%)'
                    : 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)',
                  boxShadow: isUser
                    ? '0 0 12px rgba(0, 229, 255, 0.3)'
                    : '0 0 12px rgba(156, 77, 204, 0.35)',
                }}
              >
                {isUser ? <User size={18} color="#FFFFFF" /> : <Bot size={18} color="#FFFFFF" />}
              </div>

              {/* Burbuja */}
              <div
                style={{
                  maxWidth: '82%',
                  background: isUser
                    ? darkMode
                      ? 'linear-gradient(135deg, #0f304d 0%, #092035 100%)'
                      : '#E0F2FE'
                    : darkMode
                    ? 'rgba(15, 23, 42, 0.85)'
                    : '#F8FAFC',
                  border: isUser
                    ? darkMode
                      ? '1px solid rgba(0, 229, 255, 0.3)'
                      : '1px solid rgba(2, 132, 199, 0.2)'
                    : darkMode
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                  padding: '0.9rem 1.15rem',
                  color: textColor,
                  fontSize: '0.9rem',
                  position: 'relative',
                  boxShadow: darkMode ? '0 4px 20px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {/* Cabecera del mensaje */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 6,
                    fontSize: '0.72rem',
                    color: subColor,
                  }}
                >
                  <span style={{ fontWeight: 700, color: isUser ? '#00E5FF' : '#C084FC' }}>
                    {isUser ? 'Tú' : 'Cerebro Zenic (Claude)'}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {msg.isClaudeApi && (
                      <span
                        style={{
                          fontSize: '0.64rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: 999,
                          background: 'rgba(0, 229, 255, 0.15)',
                          color: '#00E5FF',
                          fontWeight: 800,
                        }}
                      >
                        Claude 3.5 Sonnet
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      title="Copiar texto"
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: copiedId === msg.id ? '#00FF87' : subColor,
                        cursor: 'pointer',
                        padding: 0,
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      {copiedId === msg.id ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>

                {/* Contenido formateado */}
                <div>{formatMarkdown(msg.content)}</div>

                {/* Advertencia o nota informativa */}
                {msg.warning && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: '0.45rem 0.75rem',
                      borderRadius: 8,
                      background: 'rgba(245, 158, 11, 0.12)',
                      border: '1px solid rgba(245, 158, 11, 0.3)',
                      color: '#F59E0B',
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <AlertCircle size={14} />
                    <span>{msg.warning}</span>
                  </div>
                )}

                {/* Fuentes citadas en zenic-cerebro/ */}
                {!isUser && msg.sources && msg.sources.length > 0 && (
                  <div
                    style={{
                      marginTop: 10,
                      paddingTop: 8,
                      borderTop: darkMode ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: subColor, textTransform: 'uppercase' }}>
                      Documentos fuente:
                    </span>
                    {msg.sources.map((src, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: '0.7rem',
                          fontFamily: 'monospace',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 6,
                          background: darkMode ? 'rgba(156, 77, 204, 0.18)' : 'rgba(156, 77, 204, 0.1)',
                          color: darkMode ? '#C084FC' : '#7928CA',
                          border: `1px solid ${darkMode ? 'rgba(156, 77, 204, 0.35)' : 'rgba(156, 77, 204, 0.2)'}`,
                        }}
                      >
                        <FileText size={11} />
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}

        {/* Indicador de pensando / generando */}
        {loading && (
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Bot size={18} color="#FFFFFF" />
            </div>
            <div
              style={{
                background: darkMode ? 'rgba(15, 23, 42, 0.85)' : '#F8FAFC',
                border: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0,0,0,0.08)',
                borderRadius: '4px 18px 18px 18px',
                padding: '0.8rem 1.2rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#C084FC',
                  animation: 'pulse 1s infinite alternate',
                }}
              />
              <span style={{ fontSize: '0.82rem', color: subColor }}>
                Consultando 28 documentos en <strong>zenic-cerebro/</strong> con Claude...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── CHIPS DE PREGUNTAS RÁPIDAS ── */}
      <div
        style={{
          padding: '0.4rem 1.4rem',
          borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0,0,0,0.06)',
          background: darkMode ? 'rgba(8, 14, 22, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          display: 'flex',
          gap: 6,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
        }}
      >
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(q.label)}
            disabled={loading}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              border: darkMode ? '1px solid rgba(156, 77, 204, 0.25)' : '1px solid rgba(0, 0, 0, 0.08)',
              background: darkMode ? 'rgba(156, 77, 204, 0.1)' : 'rgba(156, 77, 204, 0.06)',
              color: darkMode ? '#E2E8F0' : '#475569',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.18s ease',
            }}
          >
            <span>{q.icon}</span>
            <span>{q.label}</span>
          </button>
        ))}
      </div>

      {/* ── BARRA DE ENTRADA / INPUT ── */}
      <div
        style={{
          padding: '0.9rem 1.4rem 1.1rem',
          borderTop: darkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0,0,0,0.08)',
          background: darkMode ? 'rgba(10, 18, 28, 0.98)' : '#FFFFFF',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'center',
            background: darkMode ? '#070D14' : '#F1F5F9',
            border: darkMode ? '1px solid rgba(0, 229, 255, 0.25)' : '1px solid rgba(0, 0, 0, 0.12)',
            borderRadius: 16,
            padding: '0.4rem 0.5rem 0.4rem 1rem',
            boxShadow: darkMode ? '0 4px 18px rgba(0,0,0,0.35)' : 'none',
          }}
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pregunta sobre Zenic, módulos, precios, directivos o clientes..."
            disabled={loading}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontSize: '0.88rem',
              color: textColor,
              lineHeight: 1.4,
              maxHeight: 100,
            }}
          />

          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              border: 'none',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, #00E5FF 0%, #9C4DCC 100%)'
                : darkMode
                ? 'rgba(255, 255, 255, 0.08)'
                : 'rgba(0, 0, 0, 0.08)',
              color: '#FFFFFF',
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.2s ease',
              boxShadow: input.trim() && !loading ? '0 0 14px rgba(0, 229, 255, 0.4)' : 'none',
            }}
          >
            <Send size={18} />
          </button>
        </div>

        {/* Micro-copy de política estricta anti-alucinaciones */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 6,
            fontSize: '0.68rem',
            color: subColor,
          }}
        >
          <span>
            🛡️ Respuestas generadas estrictamente con <strong>zenic-cerebro/</strong>. Cero alucinaciones.
          </span>
          <span style={{ fontFamily: 'monospace' }}>Enter para enviar</span>
        </div>
      </div>
    </div>
  )
}

