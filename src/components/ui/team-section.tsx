import * as React from "react"
import { cn } from "@/lib/utils"
import { Mail, Globe } from "lucide-react"

interface TeamMember {
  name: string
  designation: string
  imageSrc: string
  bio: string
  email?: string
  web?: string
}

interface TeamSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  darkMode?: boolean
  members: TeamMember[]
}

export const TeamSection = React.forwardRef<HTMLDivElement, TeamSectionProps>(
  ({ darkMode, members, className, ...props }, ref) => {
    const dim = darkMode ? "rgba(255,255,255," : "rgba(61,74,96,"

    const accents = ["#9C4DCC", "#80DEEA", "#9C4DCC", "#80DEEA"]
    const glows   = ["rgba(156,77,204,0.25)", "rgba(128,222,234,0.2)", "rgba(156,77,204,0.25)", "rgba(128,222,234,0.2)"]

    return (
      <section
        ref={ref}
        className={cn("relative w-full overflow-hidden", className)}
        style={{ padding: "clamp(2.5rem,4vw,3.5rem) clamp(1rem,3vw,2rem)", paddingBottom: "clamp(3rem,5vw,5rem)" }}
        {...props}
      >
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.025, backgroundImage: "linear-gradient(rgba(156,77,204,1) 1px,transparent 1px),linear-gradient(90deg,rgba(156,77,204,1) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />

        <div style={{ maxWidth: 1360, margin: "0 auto", position: "relative" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "clamp(2rem,3.5vw,2.75rem)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0.35rem 1rem", borderRadius: 999, marginBottom: "1rem", background: darkMode ? "rgba(156,77,204,0.1)" : "rgba(156,77,204,0.08)", border: "1px solid rgba(156,77,204,0.25)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#9C4DCC" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9C4DCC", boxShadow: "0 0 8px #9C4DCC", display: "inline-block" }} />
              Nuestro Equipo
            </span>
            <h2 style={{ fontSize: "clamp(1.7rem,3.5vw,2.5rem)", fontWeight: 800, color: darkMode ? "#fff" : "#3D4A60", marginBottom: "0.6rem" }}>
              Las personas detrás de{" "}
              <span style={{ background: "linear-gradient(135deg, #9C4DCC, #80DEEA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>ZENIC</span>
            </h2>
            <p style={{ fontSize: "0.95rem", color: `${dim}0.55)`, maxWidth: 520, margin: "0 auto" }}>
              Un equipo comprometido con transformar la forma en que los negocios colombianos operan y crecen.
            </p>
          </div>

          {/* Cards grid: 4 columns on desktop in a single line */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-5">
            {members.map((member, i) => {
              const accent = accents[i % accents.length]
              const glow   = glows[i % glows.length]
              return (
                <div
                  key={i}
                  style={{ borderRadius: 20, overflow: "hidden", background: darkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.8)", border: `1px solid ${accent}25`, boxShadow: `0 4px 28px ${glow}`, transition: "transform 0.35s ease, box-shadow 0.35s ease", cursor: "default", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = `0 16px 44px ${glow}` }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = `0 4px 28px ${glow}` }}
                >
                  {/* Photo — compact height */}
                  <div style={{ position: "relative", width: "100%", height: "clamp(210px, 18vw, 250px)", overflow: "hidden" }}>
                    <img
                      src={member.imageSrc}
                      alt={member.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", transition: "transform 0.5s ease" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    {/* Gradient overlay bottom */}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: `linear-gradient(to top, ${darkMode ? "rgba(13,11,20,0.95)" : "rgba(255,255,255,0.95)"} 0%, transparent 100%)` }} />
                    {/* Accent top bar */}
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${accent}, ${i % 2 === 0 ? "#80DEEA" : "#9C4DCC"})` }} />
                    {/* Name over photo */}
                    <div style={{ position: "absolute", bottom: "0.85rem", left: "1rem", right: "1rem" }}>
                      <h3 style={{ fontSize: "clamp(1.05rem,1.8vw,1.25rem)", fontWeight: 800, color: darkMode ? "#fff" : "#1a1a2e", lineHeight: 1.2, marginBottom: "0.2rem" }}>{member.name}</h3>
                      <p style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: accent }}>{member.designation}</p>
                    </div>
                  </div>

                  {/* Info below photo */}
                  <div style={{ padding: "1rem 1.15rem 1.25rem", display: "flex", flexDirection: "column", flexGrow: 1, justifyContent: "space-between" }}>
                    <div>
                      {/* Divider */}
                      <div style={{ height: 1, background: `linear-gradient(to right, ${accent}50, transparent)`, marginBottom: "0.85rem" }} />
                      <p style={{ fontSize: "0.8rem", lineHeight: 1.6, color: `${dim}0.65)`, marginBottom: "1rem" }}>{member.bio}</p>
                    </div>
                    {/* Action buttons */}
                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {member.email && (
                        <a href={`mailto:${member.email}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.4rem 0.75rem", borderRadius: 8, fontSize: "0.74rem", fontWeight: 600, textDecoration: "none", background: `${accent}15`, color: accent, border: `1px solid ${accent}30`, transition: "background 0.2s" }}
                          onMouseEnter={e => (e.currentTarget.style.background = `${accent}28`)}
                          onMouseLeave={e => (e.currentTarget.style.background = `${accent}15`)}
                        >
                          <Mail size={12} /> Contactar
                        </a>
                      )}
                      {member.web && (
                        <a href={member.web} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0.4rem 0.75rem", borderRadius: 8, fontSize: "0.74rem", fontWeight: 600, textDecoration: "none", background: darkMode ? "rgba(255,255,255,0.05)" : "rgba(61,74,96,0.06)", color: `${dim}0.6)`, border: `1px solid ${darkMode ? "rgba(255,255,255,0.08)" : "rgba(61,74,96,0.12)"}`, transition: "background 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = `${accent}15`; e.currentTarget.style.color = accent }}
                          onMouseLeave={e => { e.currentTarget.style.background = darkMode ? "rgba(255,255,255,0.05)" : "rgba(61,74,96,0.06)"; e.currentTarget.style.color = `${dim}0.6)` }}
                        >
                          <Globe size={12} /> Perfil
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
)

TeamSection.displayName = "TeamSection"

export const zenicTeam: Parameters<typeof TeamSection>[0]["members"] = [
  {
    name: "Marlon Ramírez",
    designation: "CEO & Fundador",
    imageSrc: "/team/marlon.jpg",
    bio: "Visionario detrás de ZENIC. Lidera la estrategia de crecimiento y la dirección ejecutiva de la compañía con foco en el mercado colombiano.",
    email: "marlon@zenic.com.co",
    web: "#",
  },
  {
    name: "Jhon Aparicio",
    designation: "Director Administrativo",
    imageSrc: "/team/jhon.jpg",
    bio: "Garantiza la solidez operativa y financiera de ZENIC. Gestiona los procesos internos y asegura la eficiencia en cada área.",
    email: "jhon@zenic.com.co",
    web: "#",
  },
  {
    name: "Miguel Rodriguez",
    designation: "Director de Tecnología",
    imageSrc: "/team/miguel.png",
    bio: "Arquitecto de las soluciones digitales de ZENIC. Supervisa el desarrollo del POS, los módulos de IA y toda la infraestructura tecnológica.",
    email: "miguel@zenic.com.co",
    web: "#",
  },
  {
    name: "Santiago Peraza",
    designation: "Director de Marketing & Ventas",
    imageSrc: "/team/santiago.jpg",
    bio: "Impulsa el posicionamiento de ZENIC. Diseña las estrategias comerciales que conectan la tecnología con el comercio real.",
    email: "santiago@zenic.com.co",
    web: "#",
  },
]
