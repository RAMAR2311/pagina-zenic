import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";

interface HeroProps {
  darkMode?: boolean;
}

function Hero({ darkMode }: HeroProps) {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["inteligente", "veloz", "conectado", "visual", "poderoso"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev === titles.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  const textColor = darkMode ? "rgba(255,255,255,0.85)" : "#3D4A60";
  const subColor  = darkMode ? "rgba(255,255,255,0.5)"  : "rgba(61,74,96,0.65)";

  return (
    <section
      style={{
        width: "100%",
        padding: "clamp(3rem,8vw,6rem) clamp(1rem,5vw,2.5rem)",
        position: "relative",
        overflow: "hidden",
        /* subtle separator from the hero above */
        borderTop: `1px solid ${darkMode ? "rgba(156,77,204,0.1)" : "rgba(156,77,204,0.08)"}`,
      }}
    >
      {/* Radial glow bg */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: darkMode
          ? "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(156,77,204,0.07) 0%, transparent 70%)"
          : "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(156,77,204,0.05) 0%, transparent 70%)",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center", position: "relative" }}>

        {/* Badge */}
        <div style={{ marginBottom: "2rem" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "0.4rem 1.1rem", borderRadius: 999,
            background: darkMode ? "rgba(156,77,204,0.1)" : "rgba(156,77,204,0.08)",
            border: "1px solid rgba(156,77,204,0.25)",
            fontSize: "0.78rem", fontWeight: 700, color: "#9C4DCC",
            letterSpacing: "0.04em",
          }}>
            ZENIC 360 — Universal Retail
            <MoveRight size={14} />
          </span>
        </div>

        {/* Headline — "Tu negocio, [word]" */}
        <h2 style={{
          fontSize: "clamp(4rem, 11vw, 9rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: "clamp(1.5rem, 4vw, 2.5rem)",
          color: textColor,
        }}>
          Tu negocio,{" "}

          {/* Animated word container — needs explicit height */}
          <span style={{
            display: "inline-flex",
            position: "relative",
            justifyContent: "center",
            width: "100%",
            height: "1.15em",       /* ← critical: gives space for absolute children */
            overflow: "hidden",
            verticalAlign: "bottom",
          }}>
            {titles.map((title, index) => (
              <motion.span
                key={index}
                style={{
                  position: "absolute",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #9C4DCC 30%, #80DEEA 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                }}
                initial={{ opacity: 0, y: 80 }}
                transition={{ type: "spring", stiffness: 60, damping: 18 }}
                animate={
                  titleNumber === index
                    ? { y: 0, opacity: 1 }
                    : {
                        y: titleNumber > index ? -80 : 80,
                        opacity: 0,
                      }
                }
              >
                {title}
              </motion.span>
            ))}
          </span>
        </h2>

        {/* Description */}
        <p style={{
          fontSize: "clamp(1rem, 2.2vw, 1.2rem)",
          lineHeight: 1.75,
          color: subColor,
          maxWidth: 700,
          margin: "0 auto clamp(2rem, 4vw, 3rem)",
        }}>
          Gestionar un comercio hoy ya es difícil. No lo compliques con sistemas
          lentos y cajas descuadradas. ZENIC procesa tus ventas, inventario y
          cartera{" "}
          <strong style={{ color: "#9C4DCC", fontWeight: 700 }}>
            en tiempo real.
          </strong>
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.85rem", justifyContent: "center" }}>
          <a
            href="#contacto"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0.8rem 1.75rem", borderRadius: 12,
              border: "1.5px solid rgba(156,77,204,0.3)",
              color: textColor, background: "transparent",
              fontSize: "0.95rem", fontWeight: 600, textDecoration: "none",
              transition: "border-color 0.25s, color 0.25s, background 0.25s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#9C4DCC"; e.currentTarget.style.color = "#9C4DCC"; e.currentTarget.style.background = "rgba(156,77,204,0.06)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(156,77,204,0.3)"; e.currentTarget.style.color = textColor; e.currentTarget.style.background = "transparent"; }}
          >
            <PhoneCall size={16} />
            Hablar con un asesor
          </a>

          <a
            href="#contacto"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "0.8rem 1.75rem", borderRadius: 12,
              background: "linear-gradient(135deg, #4A2574, #9C4DCC)",
              color: "#fff", fontSize: "0.95rem", fontWeight: 700,
              textDecoration: "none", boxShadow: "0 4px 20px rgba(156,77,204,0.35)",
              transition: "box-shadow 0.25s, transform 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 32px rgba(156,77,204,0.55)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 4px 20px rgba(156,77,204,0.35)"; e.currentTarget.style.transform = "none"; }}
          >
            Agendar demo gratis
            <MoveRight size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}

export { Hero };
