import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { LEGAL_DOCUMENTS } from '../data/legalDocuments'

export default function Legal({ darkMode }) {
  const { docId } = useParams()
  const navigate = useNavigate()
  const [activeId, setActiveId] = useState(docId && LEGAL_DOCUMENTS[docId] ? docId : 'terminos')
  const [searchTerm, setSearchTerm] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (docId && LEGAL_DOCUMENTS[docId]) {
      setActiveId(docId)
    }
  }, [docId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [activeId])

  const activeDoc = LEGAL_DOCUMENTS[activeId] || LEGAL_DOCUMENTS.terminos

  const docList = [
    { id: 'terminos', name: 'Términos y Condiciones', icon: '📜', badge: 'SaaS' },
    { id: 'privacidad', name: 'Protección de Datos (Habeas Data)', icon: '🛡️', badge: 'Ley 1581' },
    { id: 'cookies', name: 'Política de Cookies', icon: '🍪', badge: 'Privacidad' },
    { id: 'retracto', name: 'Facturación DIAN y Retracto', icon: '💳', badge: 'Ley 1480' },
    { id: 'pqr', name: 'Aviso Legal y PQR (SIC)', icon: '⚖️', badge: 'Vigilado' },
  ]

  const handleSelectDoc = (id) => {
    setActiveId(id)
    navigate(`/legal/${id}`)
    setSearchTerm('')
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const filteredSections = activeDoc.sections.filter(sec => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return sec.title.toLowerCase().includes(term) || sec.content.some(c => c.toLowerCase().includes(term))
  })

  const border = darkMode ? 'rgba(156,77,204,0.18)' : 'rgba(61,74,96,0.15)'
  const cardBg = darkMode ? 'rgba(255,255,255,0.03)' : '#FFFFFF'
  const textTitle = darkMode ? '#FFFFFF' : '#0F172A'
  const textMuted = darkMode ? 'rgba(255,255,255,0.65)' : '#64748B'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '6rem', paddingBottom: '5rem', paddingLeft: 'clamp(1rem, 4vw, 3rem)', paddingRight: 'clamp(1rem, 4vw, 3rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {/* Breadcrumbs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.84rem', color: textMuted, marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: textMuted, textDecoration: 'none' }}>Inicio</Link>
          <span>/</span>
          <span style={{ color: '#C084FC' }}>Centro Legal & Cumplimiento</span>
          <span>/</span>
          <span style={{ color: textTitle, fontWeight: 600 }}>{activeDoc.title}</span>
        </div>

        {/* Hero Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 99, background: 'rgba(156,77,204,0.15)', border: '1px solid rgba(156,77,204,0.3)', marginBottom: 12 }}>
            <span style={{ fontSize: '0.8rem', color: '#C084FC', fontWeight: 600 }}>República de Colombia — Marco Regulatorio Oficial</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: textTitle, lineHeight: 1.2, margin: '0 0 10px 0' }}>
            Centro Legal & Cumplimiento Normativo
          </h1>
          <p style={{ fontSize: '1rem', color: textMuted, maxWidth: 750, margin: 0, lineHeight: 1.6 }}>
            ZENIC S.A.S. (NIT 901.842.109-4) opera bajo los más altos estándares de legalidad colombiana, garantizando la seguridad jurídica, la protección de datos y los derechos del consumidor.
          </p>
        </div>

        {/* Layout: Sidebar + Content */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '2rem', alignItems: 'start' }}>
          
          {/* Sidebar / Document selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                borderRadius: 18,
                padding: '1.25rem',
                background: cardBg,
                border: `1px solid ${border}`,
                boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.3)' : '0 10px 30px rgba(0,0,0,0.04)',
              }}
            >
              <h3 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: textMuted, marginBottom: '1rem' }}>
                Documentos Legales Obligatorios
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {docList.map(doc => {
                  const isSel = doc.id === activeId
                  return (
                    <button
                      key={doc.id}
                      onClick={() => handleSelectDoc(doc.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 12,
                        border: isSel ? '1px solid #9C4DCC' : `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
                        background: isSel
                          ? (darkMode ? 'linear-gradient(135deg, rgba(74,37,116,0.35), rgba(156,77,204,0.2))' : 'rgba(156,77,204,0.1)')
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: '1.2rem' }}>{doc.icon}</span>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: isSel ? 700 : 500, color: isSel ? (darkMode ? '#FFFFFF' : '#4A2574') : textTitle }}>
                            {doc.name}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: textMuted }}>
                            {doc.badge}
                          </div>
                        </div>
                      </div>
                      {isSel && (
                        <span style={{ color: '#9C4DCC', fontWeight: 800 }}>→</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Corporate Verification Box */}
            <div
              style={{
                borderRadius: 18,
                padding: '1.25rem',
                background: 'linear-gradient(135deg, rgba(74,37,116,0.15), rgba(156,77,204,0.08))',
                border: '1px solid rgba(156,77,204,0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: textTitle, margin: 0 }}>
                  ZENIC S.A.S.
                </h4>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.78rem', color: textMuted, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <li><strong>NIT:</strong> 901.842.109-4</li>
                <li><strong>Domicilio:</strong> Bogotá D.C., Colombia</li>
                <li><strong>Notificaciones:</strong> judicial@zenic.co</li>
                <li><strong>Canal PQR:</strong> pqr@zenic.co</li>
                <li><strong>Atención:</strong> +57 311 564 3557</li>
              </ul>
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${border}` }}>
                <a
                  href="https://www.sic.gov.co"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.76rem', color: '#C084FC', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  Superintendencia de Industria y Comercio ↗
                </a>
              </div>
            </div>
          </div>

          {/* Main Document Reader */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Action Bar */}
            <div
              style={{
                padding: '1rem 1.5rem',
                borderRadius: 16,
                background: cardBg,
                border: `1px solid ${border}`,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ flex: '1 1 260px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Buscar en el documento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 34px',
                    borderRadius: 8,
                    border: `1px solid ${border}`,
                    background: darkMode ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                    color: textTitle,
                    fontSize: '0.82rem',
                    outline: 'none',
                  }}
                />
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                  🔍
                </span>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: 'transparent',
                    border: `1px solid ${border}`,
                    color: copied ? '#4ade80' : textMuted,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {copied ? '✓ Enlace Copiado' : '🔗 Copiar Enlace'}
                </button>
                <button
                  onClick={handlePrint}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #4A2574, #9C4DCC)',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    boxShadow: '0 4px 15px rgba(156,77,204,0.3)',
                  }}
                >
                  🖨️ Imprimir / Guardar PDF
                </button>
              </div>
            </div>

            {/* Document Details Card */}
            <div
              style={{
                padding: '2rem',
                borderRadius: 18,
                background: cardBg,
                border: `1px solid ${border}`,
                boxShadow: darkMode ? '0 10px 40px rgba(0,0,0,0.3)' : '0 10px 40px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: '0.74rem', padding: '3px 12px', borderRadius: 99, background: 'rgba(156,77,204,0.2)', color: '#C084FC', fontWeight: 600 }}>
                  {activeDoc.badge}
                </span>
                <span style={{ fontSize: '0.74rem', padding: '3px 12px', borderRadius: 99, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)', color: textMuted }}>
                  {activeDoc.lawReference}
                </span>
                <span style={{ fontSize: '0.74rem', color: textMuted, marginLeft: 'auto' }}>
                  {activeDoc.effectiveDate}
                </span>
              </div>

              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: textTitle, marginBottom: 12 }}>
                {activeDoc.title}
              </h2>
              <p style={{ fontSize: '0.94rem', color: textMuted, lineHeight: 1.7, marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${border}` }}>
                {activeDoc.summary}
              </p>

              {/* Sections */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {filteredSections.length === 0 ? (
                  <div style={{ padding: '3rem 1rem', textAlign: 'center', color: textMuted }}>
                    No se encontraron términos que coincidan con la búsqueda "{searchTerm}".
                  </div>
                ) : (
                  filteredSections.map((sec, idx) => (
                    <article key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: textTitle, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 4, height: 18, borderRadius: 2, background: 'linear-gradient(to bottom, #9C4DCC, #4A2574)', display: 'inline-block' }} />
                        {sec.title}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                        {sec.content.map((paragraph, pIdx) => (
                          <p key={pIdx} style={{ fontSize: '0.92rem', color: textMuted, lineHeight: 1.75, margin: 0 }}>
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </div>

            {/* Support Callout */}
            <div
              style={{
                padding: '1.5rem',
                borderRadius: 16,
                background: darkMode ? 'rgba(255,255,255,0.02)' : '#F8FAFC',
                border: `1px solid ${border}`,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 16,
              }}
            >
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: textTitle, margin: '0 0 4px 0' }}>
                  ¿Tienes dudas sobre nuestros términos o políticas?
                </h4>
                <p style={{ fontSize: '0.84rem', color: textMuted, margin: 0 }}>
                  Nuestro equipo de cumplimiento y soporte legal responde en menos de 24 horas hábiles.
                </p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <a
                  href="mailto:privacidad@zenic.co"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: 'rgba(156,77,204,0.15)',
                    border: '1px solid rgba(156,77,204,0.3)',
                    color: '#C084FC',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  ✉️ privacidad@zenic.co
                </a>
                <a
                  href="https://wa.me/573115643557?text=Hola%20ZENIC,%20tengo%20una%20consulta%20legal%20o%20de%20cumplimiento."
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    padding: '8px 16px',
                    borderRadius: 10,
                    background: '#25D366',
                    color: '#fff',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  💬 WhatsApp Asesor
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

