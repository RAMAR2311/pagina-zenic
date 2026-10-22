import { useState } from 'react'

// Enlace de WhatsApp: utiliza el número registrado de ZENIC en Colombia (+57 311 564 3557)
// Si tienes un enlace corto de WhatsApp Business (ej: https://wa.me/message/XXXXX), puedes reemplazarlo aquí.
const WHATSAPP_URL = 'https://wa.me/573115643557?text=Hola%20ZENIC,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios'

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {/* Tooltip / Cartel informativo al pasar el cursor */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.92)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '8px 14px',
          borderRadius: '20px',
          fontSize: '0.82rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(37, 211, 102, 0.3)',
          display: isHovered ? 'flex' : 'none',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#25D366',
            boxShadow: '0 0 8px #25D366',
          }}
        />
        <span>Chatea con nosotros <strong>@zenic_sas</strong></span>
      </div>

      {/* Botón flotante de WhatsApp */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp a Zenic Sas"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered
            ? '0 12px 28px rgba(37, 211, 102, 0.6), 0 0 0 4px rgba(37, 211, 102, 0.25)'
            : '0 6px 20px rgba(37, 211, 102, 0.4)',
          transform: isHovered ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
          transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          textDecoration: 'none',
          position: 'relative',
        }}
      >
        {/* Ícono oficial de WhatsApp */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}
        >
          <path
            d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.414z"
            fill="#ffffff"
          />
        </svg>

        {/* Punto indicador de disponibilidad / Online */}
        <span
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 13,
            height: 13,
            borderRadius: '50%',
            background: '#4ade80',
            border: '2px solid #ffffff',
          }}
        />
      </a>
    </div>
  )
}
