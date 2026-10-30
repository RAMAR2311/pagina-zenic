import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Globe, X, Sparkles, CheckCircle2, MessageCircle, Phone, Briefcase, Award, ShieldCheck } from "lucide-react"

export interface TeamMemberData {
  name: string
  designation: string
  imageSrc: string
  bio: string
  email?: string
  web?: string
  phone?: string
  location?: string
  specialties?: string[]
  stats?: { label: string; value: string }[]
  quote?: string
}

const DEFAULT_MEMBER: TeamMemberData = {
  name: "Marlon Ramírez",
  designation: "CEO & Fundador",
  imageSrc: "/team/marlon.jpg",
  bio: "Visionario detrás de ZENIC. Lidera la estrategia de crecimiento y la dirección ejecutiva de la compañía con foco en el mercado colombiano, transformando la operación tradicional de los comercios con inteligencia artificial y telemetría en tiempo real.",
  email: "marlon@zenic.com.co",
  web: "https://zenic.com.co",
  phone: "+57 311 564 3557",
  location: "Bogotá, Colombia",
  specialties: ["Estrategia de Negocios", "Visión Retail 360", "Inteligencia Artificial", "Escalamiento Comercial", "Liderazgo Ejecutivo"],
  stats: [
    { label: "Experiencia Retail", value: "+8 Años" },
    { label: "Puntos Impactados", value: "350+" },
    { label: "Foco Operativo", value: "100% Calle" }
  ],
  quote: "El comercio que madruga merece tecnología de punta que hable su mismo idioma y cuide cada peso de su caja."
}

// Map custom data per team member if extra details are needed
const MEMBER_EXTRAS: Record<string, Partial<TeamMemberData>> = {
  "Marlon Ramírez": {
    specialties: ["Estrategia de Negocios", "Visión Retail 360", "Inteligencia Artificial", "Escalamiento Comercial"],
    stats: [
      { label: "Experiencia Retail", value: "+8 Años" },
      { label: "Puntos Impactados", value: "350+" },
      { label: "Foco Operativo", value: "100% Calle" }
    ],
    quote: "El comercio que madruga merece tecnología de punta que hable su mismo idioma y cuide cada peso de su caja."
  },
  "Jhon Aparicio": {
    specialties: ["Finanzas Corporativas", "Operaciones en Puntos de Venta", "Eficiencia en Costos", "Control de Cartera"],
    stats: [
      { label: "Auditoría Financiera", value: "+10 Años" },
      { label: "Sectores Optimizados", value: "6 Sectores" },
      { label: "Eficiencia de Margen", value: "+28%" }
    ],
    quote: "La tranquilidad de un comerciante radica en saber con exactitud dónde está cada peso de su inventario y caja."
  },
  "Miguel Rodriguez": {
    specialties: ["Arquitectura Cloud", "Modelos de Visión Artificial", "Sistemas POS Alta Disponibilidad", "Edge Computing"],
    stats: [
      { label: "Uptime Arquitectura", value: "99.9%" },
      { label: "Latencia de Datos", value: "< 2s" },
      { label: "Sensores Conectados", value: "+1.2K" }
    ],
    quote: "Construimos software ultrarrápido y robusto para que la tecnología nunca sea un cuello de botella en tu local."
  },
  "Santiago Peraza": {
    specialties: ["Crecimiento B2B", "Ventas en Terreno", "Marketing Estratégico", "Alianzas Comerciales"],
    stats: [
      { label: "Cobertura Nacional", value: "Bogotá & Med" },
      { label: "Retención Clientes", value: "96.4%" },
      { label: "Comercios Activos", value: "+10 Redes" }
    ],
    quote: "No vendemos software de escritorio: acompañamos al comerciante en el mostrador para asegurar que venda más."
  }
}

interface TeamMemberCardProps {
  member?: TeamMemberData
  darkMode?: boolean
  onClose?: () => void
  isModal?: boolean
}

export default function TeamMemberCard({
  member = DEFAULT_MEMBER,
  darkMode = true,
  onClose,
  isModal = false,
}: TeamMemberCardProps) {
  // Merge extras if available
  const extras = MEMBER_EXTRAS[member.name] || {}
  const fullMember: TeamMemberData = {
    ...member,
    ...extras,
    specialties: member.specialties || extras.specialties || DEFAULT_MEMBER.specialties,
    stats: member.stats || extras.stats || DEFAULT_MEMBER.stats,
    quote: member.quote || extras.quote || DEFAULT_MEMBER.quote,
  }

  const dim = darkMode ? "rgba(255,255,255," : "rgba(61,74,96,"
  const accentColor = "#9C4DCC"
  const neonCyan = "#00E5FF"
  const neonGreen = "#00FF87"

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 620,
        borderRadius: 28,
        overflow: "hidden",
        background: darkMode
          ? "linear-gradient(145deg, rgba(14, 22, 34, 0.98) 0%, rgba(8, 14, 21, 0.96) 100%)"
          : "linear-gradient(145deg, #FFFFFF 0%, #F8FAFC 100%)",
        border: `1.5px solid ${darkMode ? "rgba(156, 77, 204, 0.35)" : "rgba(156, 77, 204, 0.25)"}`,
        boxShadow: darkMode
          ? "0 25px 65px rgba(0, 0, 0, 0.75), 0 0 35px rgba(156, 77, 204, 0.25)"
          : "0 20px 50px rgba(0, 0, 0, 0.12), 0 0 30px rgba(156, 77, 204, 0.12)",
        backdropFilter: "blur(20px)",
        color: darkMode ? "#FFFFFF" : "#0F172A",
      }}
    >
      {/* Decorative Top Accent Banner */}
      <div
        style={{
          height: 6,
          width: "100%",
          background: "linear-gradient(90deg, #9C4DCC 0%, #00E5FF 50%, #00FF87 100%)",
        }}
      />

      {/* Close button if modal or onClose provided */}
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Cerrar perfil"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            border: `1px solid ${darkMode ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
            color: darkMode ? "#FFFFFF" : "#1E293B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 30,
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = "scale(1.08)"
            e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)"
            e.currentTarget.style.color = "#EF4444"
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = "none"
            e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
            e.currentTarget.style.color = darkMode ? "#FFFFFF" : "#1E293B"
          }}
        >
          <X size={18} />
        </button>
      )}

      {/* Main Content Body */}
      <div style={{ padding: "clamp(1.5rem, 4vw, 2.25rem)" }}>
        {/* Top Header Section: Photo + Status + Identity */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {/* Photo with Glowing Glass Ring */}
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 22,
                overflow: "hidden",
                border: `2px solid ${neonCyan}`,
                boxShadow: `0 0 24px rgba(0, 229, 255, 0.4), 0 8px 20px rgba(0,0,0,0.4)`,
              }}
            >
              <img
                src={fullMember.imageSrc}
                alt={fullMember.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
              />
            </div>
            {/* Live Indicator */}
            <span
              style={{
                position: "absolute",
                bottom: -3,
                right: -3,
                width: 18,
                height: 18,
                borderRadius: "50%",
                background: neonGreen,
                border: `3px solid ${darkMode ? "#0E1622" : "#FFFFFF"}`,
                boxShadow: `0 0 10px ${neonGreen}`,
              }}
              title="Disponible en ZENIC"
            />
          </div>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "0.2rem 0.65rem",
                  borderRadius: 999,
                  background: darkMode ? "rgba(156,77,204,0.18)" : "rgba(156,77,204,0.12)",
                  border: "1px solid rgba(156,77,204,0.35)",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  color: "#C084FC",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={11} color="#C084FC" />
                Equipo Directivo ZENIC
              </span>
            </div>

            <h3
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                fontWeight: 900,
                lineHeight: 1.15,
                color: darkMode ? "#FFFFFF" : "#0F172A",
                margin: "0 0 4px",
              }}
            >
              {fullMember.name}
            </h3>

            <p
              style={{
                fontSize: "0.85rem",
                fontWeight: 800,
                color: neonCyan,
                letterSpacing: "0.02em",
                margin: 0,
              }}
            >
              {fullMember.designation}
            </p>
          </div>
        </div>

        {/* Bio Narrative */}
        <div
          style={{
            background: darkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
            border: `1px solid ${darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)"}`,
            borderRadius: 18,
            padding: "1.1rem 1.25rem",
            marginBottom: "1.25rem",
          }}
        >
          <p
            style={{
              fontSize: "0.92rem",
              lineHeight: 1.65,
              color: darkMode ? "#E2E8F0" : "#334155",
              margin: 0,
            }}
          >
            {fullMember.bio}
          </p>
        </div>

        {/* Executive Quote if present */}
        {fullMember.quote && (
          <div
            style={{
              borderLeft: `3px solid ${neonGreen}`,
              padding: "0.6rem 0 0.6rem 1rem",
              marginBottom: "1.25rem",
              background: darkMode ? "rgba(0, 255, 135, 0.04)" : "rgba(5, 150, 105, 0.05)",
              borderRadius: "0 12px 12px 0",
            }}
          >
            <p
              style={{
                fontSize: "0.82rem",
                fontStyle: "italic",
                color: darkMode ? "#CBD5E1" : "#475569",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              "{fullMember.quote}"
            </p>
          </div>
        )}

        {/* Impact Stats Grid */}
        {fullMember.stats && fullMember.stats.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              marginBottom: "1.25rem",
            }}
          >
            {fullMember.stats.map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: darkMode ? "rgba(0, 229, 255, 0.05)" : "rgba(2, 132, 199, 0.06)",
                  border: `1px solid ${darkMode ? "rgba(0, 229, 255, 0.2)" : "rgba(2, 132, 199, 0.2)"}`,
                  borderRadius: 14,
                  padding: "0.75rem 0.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    color: idx === 0 ? "#C084FC" : idx === 1 ? neonCyan : neonGreen,
                    fontFamily: "monospace",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    color: `${dim}0.65)`,
                    marginTop: 4,
                    fontWeight: 600,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expertise / Skill Tags */}
        {fullMember.specialties && fullMember.specialties.length > 0 && (
          <div style={{ marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: `${dim}0.6)`,
                marginBottom: "0.6rem",
              }}
            >
              Áreas de Especialidad & Foco
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
              {fullMember.specialties.map((spec, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "0.3rem 0.75rem",
                    borderRadius: 999,
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    background: darkMode ? "rgba(156, 77, 204, 0.12)" : "rgba(156, 77, 204, 0.08)",
                    border: `1px solid ${darkMode ? "rgba(156, 77, 204, 0.3)" : "rgba(156, 77, 204, 0.2)"}`,
                    color: darkMode ? "#E2E8F0" : "#334155",
                  }}
                >
                  <CheckCircle2 size={12} color={neonCyan} />
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Direct Action Contacts */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
          {fullMember.email && (
            <a
              href={`mailto:${fullMember.email}`}
              style={{
                flex: 1,
                minWidth: 160,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "0.85rem 1.25rem",
                borderRadius: 14,
                background: "linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 6px 20px rgba(156, 77, 204, 0.35)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "none")}
            >
              <Mail size={15} />
              Enviar Correo
            </a>
          )}

          <a
            href={`https://wa.me/573115643557?text=${encodeURIComponent(`Hola, quisiera contactar a ${fullMember.name} de ZENIC.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              minWidth: 160,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "0.85rem 1.25rem",
              borderRadius: 14,
              background: darkMode ? "rgba(0, 255, 135, 0.12)" : "rgba(5, 150, 105, 0.1)",
              border: `1.5px solid ${darkMode ? neonGreen : "#059669"}`,
              color: darkMode ? neonGreen : "#059669",
              fontSize: "0.85rem",
              fontWeight: 800,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.background = darkMode ? "rgba(0, 255, 135, 0.22)" : "rgba(5, 150, 105, 0.18)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "none"
              e.currentTarget.style.background = darkMode ? "rgba(0, 255, 135, 0.12)" : "rgba(5, 150, 105, 0.1)"
            }}
          >
            <MessageCircle size={15} />
            WhatsApp Directo
          </a>
        </div>
      </div>
    </div>
  )
}
