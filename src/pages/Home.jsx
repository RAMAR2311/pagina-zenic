import Hero from '../components/Hero'
import { Hero as AnimatedHero } from '../components/ui/animated-hero'
import ClientsCloud from '../components/ClientsCloud'
import { SplineSection } from '../components/SplineSection'
import RetailSocialProof from '../components/RetailSocialProof'
import RetailRoiCalculator from '../components/RetailRoiCalculator'
import HeatmapStoreDemo from '../components/HeatmapStoreDemo'
import BeforeAfterSlider from '../components/BeforeAfterSlider'
import StreetPowerSection from '../components/StreetPowerSection'
import DirectDemoBooking from '../components/DirectDemoBooking'
import MobileStickyCta from '../components/MobileStickyCta'

export default function Home({ darkMode }) {
  const scrollToBooking = () => {
    const el = document.getElementById('agendar-demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToRoi = () => {
    const el = document.getElementById('calculadora-roi')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── 1. HERO SPLIT: CEREBRO 3D (SIN EL BOTÓN SEÑALADO) + TEXTO ANIMADO ZENIC 360 ── */}
      <div className="hero-split">
        <div className="hero-split-left">
          <Hero darkMode={darkMode} />
        </div>
        <div className="hero-split-right">
          <AnimatedHero darkMode={darkMode} />
        </div>
      </div>

      {/* ── 2. CLIENTES / LOGOS: "LOS MEJORES DEL JUEGO" ── */}
      <ClientsCloud darkMode={darkMode} />

      {/* ── 3. MOTOR INTELIGENTE: ROBOT 3D SPLINE ("EL CEREBRO DIGITAL DE TU NEGOCIO") ── */}
      <SplineSection darkMode={darkMode} />

      {/* ── 4. PRUEBA SOCIAL ESTRATÉGICA (ESTADÍSTICAS COLOSALES & SECTORES RETAIL) ── */}
      <RetailSocialProof darkMode={darkMode} />

      {/* ── 5. HERRAMIENTA INTERACTIVA: CALCULADORA DE ROI & DIAGNÓSTICO (LEAD MAGNET) ── */}
      <RetailRoiCalculator
        darkMode={darkMode}
        onBookConsultation={scrollToBooking}
      />

      {/* ── 6. DEMOSTRADOR INTERACTIVO DE MAPA DE CALOR & CONTEO EN VIVO ── */}
      <HeatmapStoreDemo darkMode={darkMode} />

      {/* ── 7. CASOS DE ÉXITO INTERACTIVOS (SLIDER ANTES VS. DESPUÉS) ── */}
      <BeforeAfterSlider darkMode={darkMode} />

      {/* ── 8. SECCIÓN DE CALLE / EXPERIENCIA EN TERRENO ── */}
      <StreetPowerSection darkMode={darkMode} />

      {/* ── 9. AGENDAMIENTO DIRECTO DE DEMOSTRACIONES (CALENDARIO DINÁMICO 15 MIN) ── */}
      <DirectDemoBooking darkMode={darkMode} />

      {/* ── 10. CTA FIJO MÓVIL PARA DECISORES (MOBILE-FIRST) ── */}
      <MobileStickyCta
        darkMode={darkMode}
        onBookClick={scrollToBooking}
        onRoiClick={scrollToRoi}
      />

      <style>{`
        /* Mobile: stacked (default) */
        .hero-split {
          display: flex;
          flex-direction: column;
          width: 100%;
        }
        .hero-split-left,
        .hero-split-right {
          width: 100%;
          min-width: 0;
        }

        /* Desktop: side-by-side, each 50%, full viewport tall */
        @media (min-width: 1024px) {
          .hero-split {
            flex-direction: row;
            min-height: 100vh;
            align-items: stretch;
            position: relative;
          }
          .hero-split-left,
          .hero-split-right {
            width: 50%;
            flex: 1 1 50%;
          }
          .hero-split-right {
            display: flex;
            align-items: center;
            justify-content: center;
            border-left: 1px solid ${darkMode ? 'rgba(156,77,204,0.12)' : 'rgba(156,77,204,0.08)'};
          }
        }
      `}</style>
    </>
  )
}
