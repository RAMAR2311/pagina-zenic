import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LEGAL_DOCUMENTS } from '../data/legalDocuments'

export default function LegalModal({ isOpen, onClose, initialDocId = 'terminos', darkMode }) {
  const [activeDocId, setActiveDocId] = useState(initialDocId)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (initialDocId && LEGAL_DOCUMENTS[initialDocId]) {
      setActiveDocId(initialDocId)
    }
  }, [initialDocId])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const activeDoc = LEGAL_DOCUMENTS[activeDocId] || LEGAL_DOCUMENTS.terminos

  const filteredSections = activeDoc.sections.filter(sec => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return sec.title.toLowerCase().includes(term) || sec.content.some(c => c.toLowerCase().includes(term))
  })

  const docList = [
    { id: 'terminos', name: 'Términos y Condiciones', icon: '📜' },
    { id: 'privacidad', name: 'Protección de Datos (Habeas Data)', icon: '🛡️' },
    { id: 'cookies', name: 'Política de Cookies', icon: '🍪' },
    { id: 'retracto', name: 'Facturación DIAN y Retracto', icon: '💳' },
    { id: 'pqr', name: 'Aviso Legal y PQR (SIC)', icon: '⚖️' },
  ]

  const bgModal = darkMode ? '#0F1523' : '#FFFFFF'
  const bgCard = darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const border = darkMode ? 'rgba(156,77,204,0.2)' : 'rgba(61,74,96,0.15)'
  const textTitle = darkMode ? '#FFFFFF' : '#0F172A'
  const textMuted = darkMode ? 'rgba(255,255,255,0.6)' : '#64748B'

  const handlePrint = () => {
    window.print()
  }

  const handleOpenFullPage = () => {
    onClose()
    navigate(`/legal/${activeDocId}`)
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(5, 8, 16, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 960,
          maxHeight: '90vh',
          background: bgModal,
          borderRadius: 20,
          border: `1px solid ${border}`,
          boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5), 0 0 40px rgba(156,77,204,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: `1px solid ${border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: darkMode ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #4A2574, #9C4DCC)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.1rem',
                boxShadow: '0 4px 15px rgba(156,77,204,0.3)',
              }}
            >
              ⚖️
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textTitle, margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                Marco Legal y Cumplimiento Normativo
                <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 99, background: 'rgba(74,222,128,0.15)', color: '#4ade80', fontWeight: 600 }}>
                  Colombia
                </span>
              </h3>
              <p style={{ fontSize: '0.78rem', color: textMuted, margin: 0 }}>
                ZENIC S.A.S. — NIT 901.842.109-4 — Vigilado SIC
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={handlePrint}
              title="Imprimir documento"
              style={{
                background: 'transparent',
                border: `1px solid ${border}`,
                color: textMuted,
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.78rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#9C4DCC'; e.currentTarget.style.borderColor = '#9C4DCC' }}
              onMouseLeave={e => { e.currentTarget.style.color = textMuted; e.currentTarget.style.borderColor = border }}
            >
              🖨️ Imprimir
            </button>
            <button
              onClick={handleOpenFullPage}
              title="Abrir en página completa"
              style={{
                background: 'rgba(156,77,204,0.12)',
                border: '1px solid rgba(156,77,204,0.3)',
                color: '#A855F7',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(156,77,204,0.25)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(156,77,204,0.12)' }}
            >
              ↗ Página Completa
            </button>
            <button
              onClick={onClose}
              title="Cerrar"
              style={{
                background: 'transparent',
                border: 'none',
                color: textMuted,
                width: 32,
                height: 32,
                borderRadius: 8,
                fontSize: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#EF4444' }}
              onMouseLeave={e => { e.currentTarget.style.color = textMuted }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: 6,
            padding: '0.75rem 1.25rem',
            borderBottom: `1px solid ${border}`,
            background: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
          }}
        >
          {docList.map(doc => {
            const isActive = doc.id === activeDocId
            return (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveDocId(doc.id)
                  setSearchTerm('')
                }}
                style={{
                  background: isActive ? 'linear-gradient(135deg, rgba(74,37,116,0.3), rgba(156,77,204,0.25))' : 'transparent',
                  border: isActive ? '1px solid #9C4DCC' : `1px solid transparent`,
                  color: isActive ? '#C084FC' : textMuted,
                  borderRadius: 10,
                  padding: '6px 12px',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s',
                }}
              >
                <span>{doc.icon}</span>
                <span>{doc.name}</span>
              </button>
            )
          })}
        </div>

        {/* Document Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Doc Title & Meta Card */}
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderRadius: 14,
              background: bgCard,
              border: `1px solid ${border}`,
            }}
          >
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: 99, background: 'rgba(156,77,204,0.2)', color: '#C084FC', fontWeight: 600 }}>
                {activeDoc.badge}
              </span>
              <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: 99, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', color: textMuted }}>
                {activeDoc.lawReference}
              </span>
              <span style={{ fontSize: '0.72rem', color: textMuted, marginLeft: 'auto' }}>
                {activeDoc.effectiveDate}
              </span>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: textTitle, marginBottom: 8 }}>
              {activeDoc.title}
            </h2>
            <p style={{ fontSize: '0.88rem', color: textMuted, lineHeight: 1.6, margin: 0 }}>
              {activeDoc.summary}
            </p>
          </div>

          {/* Quick search input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Buscar dentro de este documento (ej: datos, retracto, DIAN, derechos)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px 10px 36px',
                borderRadius: 10,
                border: `1px solid ${border}`,
                background: darkMode ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
                color: textTitle,
                fontSize: '0.84rem',
                outline: 'none',
              }}
            />
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5, fontSize: '0.9rem' }}>
              🔍
            </span>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: textMuted,
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Sections List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredSections.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: textMuted, fontSize: '0.9rem' }}>
                No se encontraron cláusulas o secciones que coincidan con "{searchTerm}".
              </div>
            ) : (
              filteredSections.map((sec, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 12,
                    background: bgCard,
                    border: `1px solid ${border}`,
                  }}
                >
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: textTitle, marginBottom: '0.6rem' }}>
                    {sec.title}
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {sec.content.map((p, pIdx) => (
                      <p key={pIdx} style={{ fontSize: '0.86rem', color: textMuted, lineHeight: 1.65, margin: 0 }}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Official Verification Footer Banner */}
          <div
            style={{
              padding: '1rem 1.25rem',
              borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(74,37,116,0.15), rgba(156,77,204,0.1))',
              border: '1px solid rgba(156,77,204,0.25)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <p style={{ fontSize: '0.78rem', fontWeight: 600, color: textTitle, margin: 0 }}>
                ZENIC S.A.S. — Cumplimiento Regulatorio Colombia
              </p>
              <p style={{ fontSize: '0.72rem', color: textMuted, margin: 0 }}>
                Entidad vigilada por la Superintendencia de Industria y Comercio (SIC) y la DIAN.
              </p>
            </div>
            <a
              href="https://www.sic.gov.co"
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '0.75rem',
                color: '#C084FC',
                textDecoration: 'none',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Portal SIC oficial ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
