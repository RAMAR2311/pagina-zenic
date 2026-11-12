import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  Cpu,
  Zap,
  Activity,
  Sparkles,
  Send,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Layers,
  Database,
  Eye,
  TrendingUp,
  RefreshCw,
  Terminal,
  ShieldCheck,
  ChevronRight,
  Gauge,
  ArrowUpRight,
  MessageSquare,
  HelpCircle,
  BookOpen,
  Workflow,
  FolderTree,
  Network,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ZenicBrainGraph from '../components/ZenicBrainGraph'
import GalaxyBackground from '../components/GalaxyBackground'
import ZenicBrainChat from '../components/ZenicBrainChat'

// Predefined retail cognitive scenarios
const PRESET_SCENARIOS = [
  {
    id: 'cola-cajas',
    title: 'Alerta de Filas en Checkout',
    badge: 'Fricción de Pago',
    icon: '💳',
    text: 'Sábado 4:30 PM. Hay 9 clientes en cola de cajas y el tiempo de espera promedio superó los 5m 45s. Afluencia en pasillo: 420 personas/h.',
    tensorData: [0.85, 0.92, 0.45, 0.88, 0.95, 0.32, 0.74, 0.65, 0.89, 0.96],
    solution: {
      action: 'Apertura Inmediata de Cajas 3 y 4 de Apoyo',
      confidence: 98.4,
      directAnswer: 'El Cerebro detectó saturación en checkout. Te recomienda la apertura inmediata de Cajas 3 y 4 de apoyo durante los próximos 18 minutos para evitar un 22% de abandono de carritos en línea de pago.',
      reasoning: 'El tensor de permanencia en checkout (0.95) supera el umbral de abandono crítico (3m 15s). 22% de carritos corren riesgo de abandono en los próximos 4 minutos.',
      impact: 'Evita pérdida estimada de $1.850.000 COP en carritos abandonados.',
      ctaText: 'Ver Demostración de Detección de Filas',
      ctaUrl: '/servicios',
      kpis: [
        { label: 'Tiempo Espera Proyectado', val: '1m 40s (-71%)' },
        { label: 'Riesgo de Fuga', val: 'Reducido al 2.1%' },
        { label: 'Cajeros Asignados', val: '+2 automáticos' },
      ],
    },
  },
  {
    id: 'vitrina-fria',
    title: 'Fuga de Transeúntes en Fachada',
    badge: 'Atracción Visual',
    icon: '👗',
    text: 'Tráfico de pasillo exterior alto (1.200 personas/h), pero la tasa de conversión a vitrina cayó a 14% (promedio habitual: 28%).',
    tensorData: [0.35, 0.22, 0.90, 0.14, 0.40, 0.75, 0.82, 0.18, 0.45, 0.30],
    solution: {
      action: 'Rotación Focal de Maniquí Central & Ajuste de Iluminación',
      confidence: 96.1,
      directAnswer: 'El tráfico peatonal exterior es elevado (1.200 p/h), pero la atención a la vitrina cayó al 14%. El Cerebro recomienda rotar el maniquí central hacia el eje de tránsito y aumentar el foco de iluminación para captar hasta +168 clientes por hora.',
      reasoning: 'El flujo peatonal exterior no está interactuando con el foco visual primario. La permanencia en fachada es de apenas 12 segundos.',
      impact: 'Incremento proyectado de +34% en captación hacia el interior de tienda.',
      ctaText: 'Ver Analítica de Fachada y Vitrinas',
      ctaUrl: '/servicios',
      kpis: [
        { label: 'Atracción Estimada', val: 'De 14% a 29.5%' },
        { label: 'Tráfico Extra a Tienda', val: '+168 clientes/h' },
        { label: 'Dwell Time Fachada', val: '45 segundos (+275%)' },
      ],
    },
  },
  {
    id: 'pasillo-hotspot',
    title: 'Hotspot en Pasillo Central vs Probadores',
    badge: 'Conversión',
    icon: '🔥',
    text: 'Alta permanencia en Pasillo Central (calor térmico al 96%), pero solo el 8% de visitantes se traslada hacia la zona de probadores.',
    tensorData: [0.96, 0.88, 0.72, 0.08, 0.60, 0.45, 0.91, 0.52, 0.33, 0.84],
    solution: {
      action: 'Reubicación de Señalética Gancho & Activación de Asesora',
      confidence: 97.8,
      directAnswer: 'Hay una gran concentración de clientes en el pasillo central (96%), pero solo el 8% llega a probadores. El Cerebro aconseja reubicar la señalética hacia probadores y asignar una asesora activa en esa zona para triplicar la tasa de cierre de venta.',
      reasoning: 'Existe cuello de botella en navegación. Los clientes exploran productos pero no concretan el paso de prueba que multiplica la conversión x3.2.',
      impact: 'Aumento del +24% en pruebas de prenda y ticket promedio.',
      ctaText: 'Explorar Mapas de Calor Térmicos',
      ctaUrl: '/servicios',
      kpis: [
        { label: 'Paso a Probadores', val: 'De 8% a 22%' },
        { label: 'Probabilidad de Venta', val: '3.2x tras probador' },
        { label: 'Ticket Promedio', val: '+$35.000 COP' },
      ],
    },
  },
]

// Sugerencias de preguntas frecuentes para hacerle al Cerebro
const QUICK_QUESTIONS = [
  '¿Cuánto se demorarían para presentarme mi demo?',
  '¿Tengo que cambiar mis cámaras o comprar hardware nuevo?',
  '¿Qué precio tiene Zenic y cómo es el modelo de cobro?',
  '¿Cómo reducen las filas y cuellos de botella en cajas?',
  '¿Cómo protegen la privacidad y normas GDPR de los clientes?',
  '¿Cómo miden si la gente mira las vitrinas o pasa de largo?',
]

// Motor de Inferencia NLP y Razonamiento Cognitivo de Zenic Brain
function analyzeCustomQuery(rawQuery) {
  const q = (rawQuery || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim()
  const randomConf = +(96 + Math.random() * 3.5).toFixed(1)

  // 1. DEMOS / AGENDAMIENTO / TIEMPOS DE PRESENTACIÓN
  if (
    q.includes('demo') || q.includes('demora') || q.includes('demoran') || q.includes('demorarian') ||
    (q.includes('tiempo') && (q.includes('present') || q.includes('cita') || q.includes('mostrar') || q.includes('ver') || q.includes('entrega'))) ||
    q.includes('agendar') || q.includes('reunion') || q.includes('cita') || q.includes('presentar') || q.includes('presentacion')
  ) {
    return {
      action: 'Activación Inmediata de Demo Interactiva en Vivo (15 Minutos)',
      confidence: 99.4,
      directAnswer: '¡Podemos presentarte la demo en vivo hoy mismo o en menos de 24 horas! La sesión toma únicamente 15 minutos, es guiada por un especialista de Zenic y te mostraremos en tiempo real cómo la IA analiza el tráfico, mapas de calor y conversión de tu tienda sin ningún costo.',
      reasoning: 'Inferencia de canal comercial: Solicitud prioritaria de demostración. Red neuronal asigna disponibilidad inmediata para sesión interactiva guiada.',
      impact: 'Diagnóstico técnico sin compromiso y acceso inmediato al entorno simulado de tu sector retail.',
      ctaText: 'Agendar Demo en Vivo (15 min)',
      ctaUrl: '/#agendar-demo',
      kpis: [
        { label: 'Tiempo de Agendamiento', val: 'Menos de 24 horas' },
        { label: 'Duración de la Sesión', val: '15 minutos exactos' },
        { label: 'Costo de la Demo', val: '100% Gratuita' },
      ],
      tensorData: [0.15, 0.95, 0.98, 0.88, 0.92, 0.70, 0.85, 0.40, 0.95, 0.99],
    }
  }

  // 2. PRECIOS / COSTOS / PLANES / INVERSIÓN
  if (
    q.includes('precio') || q.includes('costo') || q.includes('cuesta') || q.includes('vale') ||
    q.includes('tarifa') || q.includes('plan') || q.includes('planes') || q.includes('presupuesto') ||
    q.includes('inversion') || q.includes('cotizar') || q.includes('cotizacion') || q.includes('pagar')
  ) {
    return {
      action: 'Suscripción SaaS Flexible & Retorno de Inversión (ROI)',
      confidence: 98.7,
      directAnswer: 'Zenic opera bajo un modelo de suscripción mensual o anual por tienda y cámaras activas, sin compras de servidores pesados. Gracias al incremento en conversión de venta (+18% a +32%) y la reducción de horas muertas de personal, la inversión se amortiza típicamente en las primeras 6 a 8 semanas.',
      reasoning: 'Evaluación financiera algorítmica: Cálculo de amortización acelerada por optimización de puntos calientes y personal de venta.',
      impact: 'Retorno de inversión (ROI) proyectado superior al 350% en el primer semestre.',
      ctaText: 'Ver Planes y Precios',
      ctaUrl: '/precios',
      kpis: [
        { label: 'Modelo de Pago', val: 'SaaS por Tienda' },
        { label: 'Amortización Media', val: '6 - 8 semanas' },
        { label: 'ROI Proyectado', val: '3.8x a 5.2x' },
      ],
      tensorData: [0.45, 0.60, 0.85, 0.92, 0.78, 0.95, 0.68, 0.88, 0.90, 0.94],
    }
  }

  // 3. CÁMARAS / HARDWARE / INSTALACIÓN / CCTV
  if (
    q.includes('camara') || q.includes('camaras') || q.includes('hardware') || q.includes('equipo') ||
    q.includes('cctv') || q.includes('dvr') || q.includes('nvr') || q.includes('hikvision') ||
    q.includes('dahua') || q.includes('axis') || q.includes('instalar') || q.includes('instalacion') ||
    q.includes('compatib')
  ) {
    return {
      action: 'Compatibilidad Plug & Play con tu CCTV Actual',
      confidence: 99.6,
      directAnswer: '¡No necesitas comprar cámaras nuevas! Zenic es 100% compatible con tus cámaras de seguridad existentes (Hikvision, Dahua, Axis o cualquier cámara IP con protocolo estándar RTSP/ONVIF). La instalación es digital y toma menos de 48 horas sin interrumpir tus ventas.',
      reasoning: 'Revisión de arquitectura física: El sistema aprovecha el parque de cámaras instalado, procesando las fuentes de video sin costo de reemplazo de infraestructura.',
      impact: 'Ahorro del 100% en sustitución de hardware y despliegue operativo en menos de 2 días.',
      ctaText: 'Consultar Compatibilidad de mis Cámaras',
      ctaUrl: '/contacto',
      kpis: [
        { label: 'Gasto en Nuevas Cámaras', val: '$0 (Reutiliza tus cámaras)' },
        { label: 'Protocolos Soportados', val: 'RTSP / ONVIF / IP' },
        { label: 'Tiempo de Puesta en Marcha', val: '< 48 horas' },
      ],
      tensorData: [0.98, 0.90, 0.85, 0.12, 0.25, 0.96, 0.89, 0.75, 0.82, 0.94],
    }
  }

  // 4. PRIVACIDAD / SEGURIDAD / GDPR / ROSTROS
  if (
    q.includes('privacidad') || q.includes('seguridad') || q.includes('gdpr') || q.includes('habeas') ||
    q.includes('cara') || q.includes('caras') || q.includes('rostro') || q.includes('rostros') ||
    q.includes('facial') || q.includes('legal') || q.includes('graban') || q.includes('graba') ||
    q.includes('espiar')
  ) {
    return {
      action: 'Cumplimiento Normativo Estricto & Anonimización Total',
      confidence: 99.8,
      directAnswer: 'Zenic NO graba rostros, no realiza reconocimiento facial ni almacena datos personales de tus clientes. Nuestro motor procesa únicamente vectores espaciales de movimiento y coordenadas anónimas en tiempo real, cumpliendo 100% con normativas GDPR y la Ley de Habeas Data.',
      reasoning: 'Verificación de políticas de gobernanza de datos: Inferencia Edge anónima donde cada individuo es únicamente una coordenada de trayectoria sin identificación personal.',
      impact: 'Tranquilidad jurídica absoluta y protección total de la privacidad de clientes y colaboradores.',
      ctaText: 'Ver Certificación de Privacidad',
      ctaUrl: '/nosotros',
      kpis: [
        { label: 'Almacenamiento Biométrico', val: '0% (Completamente Anónimo)' },
        { label: 'Cumplimiento Legal', val: '100% GDPR / Habeas Data' },
        { label: 'Procesamiento de Video', val: 'Metadata Efímera Edge' },
      ],
      tensorData: [0.05, 0.02, 0.99, 0.98, 0.95, 0.99, 0.88, 0.92, 0.96, 0.99],
    }
  }

  // 5. FILAS / CAJAS / TIEMPOS DE ESPERA
  if (
    q.includes('fila') || q.includes('filas') || q.includes('caja') || q.includes('cajas') ||
    q.includes('cola') || q.includes('colas') || q.includes('espera') || q.includes('checkout') ||
    (q.includes('demora') && q.includes('caja'))
  ) {
    return {
      action: 'Balanceo Predictivo de Línea de Cajas & Despacho',
      confidence: 98.9,
      directAnswer: 'El Cerebro analiza el volumen de personas en pasillos y probadores para anticipar la llegada a cajas con 8 minutos de anticipación. Envía una notificación automática al jefe de tienda para abrir cajas secundarias antes de que se forme una fila molesta y se pierdan ventas.',
      reasoning: 'Predicción de confluencia peatonal hacia facturación: Reduce el abandono de compra que ocurre cuando la fila supera los 3 minutos.',
      impact: 'Disminución del 58% en tiempos de espera y rescate de hasta un 12% en compras que solían abandonarse.',
      ctaText: 'Ver Detección Predictiva de Filas',
      ctaUrl: '/servicios',
      kpis: [
        { label: 'Anticipación de Alerta', val: '8 minutos antes' },
        { label: 'Reducción de Espera', val: '-58% en checkout' },
        { label: 'Ventas Rescatadas', val: '+12.4% tickets' },
      ],
      tensorData: [0.88, 0.94, 0.42, 0.89, 0.96, 0.35, 0.75, 0.68, 0.91, 0.97],
    }
  }

  // 6. VITRINAS / FACHADA / TRANSEÚNTES
  if (
    q.includes('vitrina') || q.includes('vitrinas') || q.includes('fachada') || q.includes('transeunte') ||
    q.includes('transeuntes') || q.includes('afuera') || q.includes('calle') || q.includes('entrar') ||
    q.includes('pasan') || q.includes('atraccion')
  ) {
    return {
      action: 'Optimización de Tasa de Captación en Fachada',
      confidence: 97.6,
      directAnswer: 'Zenic calcula la tasa de atracción midiendo cuántas personas caminan por el pasillo exterior frente a cuántas se detienen a mirar la vitrina (Dwell Time) e ingresan. Si la conversión exterior es baja, el sistema alerta para cambiar la exhibición o iluminación focal.',
      reasoning: 'Monitoreo de funnel exterior: El 68% de las decisiones de ingreso se deciden en los primeros 3 segundos de contacto visual con la vitrina.',
      impact: 'Incremento del +28% en transeúntes captados hacia el interior de tu tienda.',
      ctaText: 'Ver Analítica de Vitrinas',
      ctaUrl: '/servicios',
      kpis: [
        { label: 'Dwell Time Objetivo', val: '> 35 segundos' },
        { label: 'Tasa de Captación', val: 'De 14% a 28.5%' },
        { label: 'Tráfico Extra Adentro', val: '+140 personas/día' },
      ],
      tensorData: [0.35, 0.25, 0.92, 0.18, 0.45, 0.78, 0.85, 0.22, 0.50, 0.35],
    }
  }

  // 7. PROBADORES / ZONAS CALIENTES
  if (
    q.includes('probador') || q.includes('probadores') || q.includes('ropa') || q.includes('probar') ||
    q.includes('pasillo') || q.includes('caliente') || q.includes('hotspot') || q.includes('permanencia')
  ) {
    return {
      action: 'Activación del Multiplicador de Probadores (3.2x Conversión)',
      confidence: 98.2,
      directAnswer: 'En retail de moda, el 71% de los clientes que entran a un probador terminan comprando. El Cerebro identifica si hay zonas calientes en pasillos donde la gente se concentra pero no llega a probarse las prendas, aconsejando mover asesores hacia ese punto crítico.',
      reasoning: 'Análisis de transición de zona: Cuello de botella detectado entre área de exploración y área de decisión final de compra.',
      impact: 'Aumento del +24% en tasa de conversión efectiva y mayor ticket promedio.',
      ctaText: 'Explorar Mapas de Calor',
      ctaUrl: '/servicios',
      kpis: [
        { label: 'Paso a Probadores', val: 'De 8% a 22%' },
        { label: 'Probabilidad de Compra', val: '3.2x tras probador' },
        { label: 'Ticket Promedio', val: '+$35.000 COP' },
      ],
      tensorData: [0.95, 0.88, 0.74, 0.10, 0.62, 0.48, 0.92, 0.55, 0.38, 0.85],
    }
  }

  // 8. CÓMO FUNCIONA / INTELIGENCIA ARTIFICIAL
  if (
    q.includes('como funciona') || q.includes('que hace') || q.includes('ia') || q.includes('inteligencia') ||
    q.includes('algoritmo') || q.includes('modelo') || q.includes('vision') || q.includes('red') ||
    q.includes('tecnologia') || q.includes('cerebro')
  ) {
    return {
      action: 'Arquitectura Neuronal Cognitiva de Zenic Retail OS',
      confidence: 99.1,
      directAnswer: 'El Cerebro de Zenic combina visión artificial de última generación (detección posicional y tracking espacial en tiempo real) con redes neuronales predictivas. Convierte el video en vectores matemáticos para inferir afluencia, dwell time y rutas térmicas, generando recomendaciones tácticas al instante.',
      reasoning: 'Pipeline neuronal: Capas de visión espacial + normalización de tensores + mecanismo de atención para retail físico.',
      impact: 'Decisiones comerciales y operativas autónomas en 2.1 ms sin necesidad de revisar grabaciones.',
      ctaText: 'Ver Demostración Interactiva',
      ctaUrl: '/#demo-interactiva',
      kpis: [
        { label: 'Latencia Inferencia', val: '2.1 ms' },
        { label: 'Conexiones Sinápticas', val: '65.536 nodos' },
        { label: 'Precisión Cognitiva', val: '98.7%' },
      ],
      tensorData: [0.75, 0.82, 0.91, 0.88, 0.94, 0.79, 0.85, 0.92, 0.88, 0.96],
    }
  }

  // 9. CONTACTO / SOPORTE / HABLAR CON ASESOR
  if (
    q.includes('contacto') || q.includes('telefono') || q.includes('whatsapp') || q.includes('correo') ||
    q.includes('hablar') || q.includes('asesor') || q.includes('comunicar') || q.includes('soporte')
  ) {
    return {
      action: 'Enlace Directo con Especialista de Retail de Zenic',
      confidence: 99.5,
      directAnswer: 'Puedes comunicarte directamente con nuestro equipo de especialistas por WhatsApp al +57 322 364 8979 o agendar una llamada directa de 15 minutos en el formulario de la página.',
      reasoning: 'Enrutamiento omnicanal: Conexión inmediata con un asesor técnico-comercial dedicado.',
      impact: 'Atención personalizada en menos de 10 minutos en horario laboral.',
      ctaText: 'Escribir por WhatsApp Directo',
      ctaUrl: 'https://wa.me/573223648979?text=Hola%20Zenic,%20estoy%20en%20el%20Cerebro%20y%20quiero%20hacerles%20una%20consulta',
      kpis: [
        { label: 'Canal de Respuesta', val: 'WhatsApp / Meet' },
        { label: 'Tiempo de Espera', val: '< 10 minutos' },
        { label: 'Disponibilidad', val: 'Lun - Vie (8am - 6pm)' },
      ],
      tensorData: [0.20, 0.90, 0.88, 0.95, 0.99, 0.85, 0.92, 0.60, 0.88, 0.95],
    }
  }

  // 10. CONSULTA LIBRE GENERAL
  const queryClean = rawQuery.trim().replace(/^¿+|[?!.,;:]+$/g, '')
  return {
    action: `Estrategia de Optimización: ${queryClean.length > 40 ? queryClean.slice(0, 37) + '...' : queryClean}`,
    confidence: randomConf,
    directAnswer: `El Cerebro analizó tu consulta: "${rawQuery}". Evaluando la dinámica de tráfico y comportamiento de compra en tienda, nuestro modelo sugiere implementar medición continua de afluencia y correlación con ventas para responder de forma precisa a este escenario.`,
    reasoning: `Vectorización semántica completada para "${rawQuery}". Red neuronal calibró 10 tensores de afluencia, velocidad de tránsito y dwell time en retail.`,
    impact: 'Optimización predictiva ajustada a la dinámica de compra de tu tienda.',
    ctaText: 'Agendar Sesión con un Especialista',
    ctaUrl: '/#agendar-demo',
    kpis: [
      { label: 'Confianza Sináptica', val: `${randomConf}%` },
      { label: 'Tiempo de Inferencia', val: '2.1 ms' },
      { label: 'Modo de Respuesta', val: 'Inferencia Cognitiva' },
    ],
    tensorData: Array.from({ length: 10 }, () => +(0.3 + Math.random() * 0.65).toFixed(2)),
  }
}

// Memories internalized by the neural brain
const BRAIN_MEMORIES = [
  { id: 1, title: 'Umbral Crítico de Fila', value: '3m 15s', desc: 'Pasado este tiempo, el 38% de clientes evalúa abandonar la compra.', color: '#EF4444' },
  { id: 2, title: 'Correlación Probador-Compra', value: '71.4%', desc: '7 de cada 10 clientes que ingresan a probador cierran la venta.', color: '#00FF87' },
  { id: 3, title: 'Pico Térmico Vespertino', value: '5:30 - 7:45 PM', desc: 'Concentra el 44% de las transacciones diarias en retail de moda.', color: '#00E5FF' },
  { id: 4, title: 'Efecto Maniquí Dinámico', value: '+28% atracción', desc: 'Prendas con foco cenital aumentan la parada en fachada 3.1x.', color: '#9C4DCC' },
]

export default function Cerebro({ darkMode }) {
  const canvasRef = useRef(null)

  // Active View Tab: 'grafo' | 'chat' | 'simulador' | 'entrenamiento' | 'todos'
  const [activeTab, setActiveTab] = useState('grafo')
  const [isFloatingChatOpen, setIsFloatingChatOpen] = useState(false)

  // Brain Cognitive State
  const [brainStatus, setBrainStatus] = useState('vigilante') // 'vigilante' | 'pensando' | 'infiriendo' | 'aprendiendo'
  const [neuralImpulseRate, setNeuralImpulseRate] = useState(48)
  const [activeConnections, setActiveConnections] = useState(65536)
  const [inferenceLatency, setInferenceLatency] = useState(2.4)
  const [cognitiveAccuracy, setCognitiveAccuracy] = useState(98.7)

  // Interactive Scenario Reasoning Engine
  const [selectedScenario, setSelectedScenario] = useState(PRESET_SCENARIOS[0])
  const [customQuery, setCustomQuery] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentDecision, setCurrentDecision] = useState(PRESET_SCENARIOS[0].solution)
  const [tensorVector, setTensorVector] = useState(PRESET_SCENARIOS[0].tensorData)
  const [reasoningStep, setReasoningStep] = useState(4) // 1: Vectorize -> 2: Forward -> 3: Attention -> 4: Output

  // Live Training Simulator
  const [epochs, setEpochs] = useState(128)
  const [lossValue, setLossValue] = useState(0.0142)
  const [learningRate, setLearningRate] = useState(0.001)
  const [isTraining, setIsTraining] = useState(false)

  // Canvas Neural Network Animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let w = (canvas.width = canvas.parentElement.offsetWidth)
    let h = (canvas.height = canvas.parentElement.offsetHeight)

    const handleResize = () => {
      if (!canvas.parentElement) return
      w = canvas.width = canvas.parentElement.offsetWidth
      h = canvas.height = canvas.parentElement.offsetHeight
    }
    window.addEventListener('resize', handleResize)

    // Generate brain neural nodes in an organic bi-hemispheric cluster
    const numNodes = 58
    const nodes = []
    const centerX = w / 2
    const centerY = h / 2

    for (let i = 0; i < numNodes; i++) {
      const angle = Math.random() * Math.PI * 2
      const radiusX = Math.random() * (w * 0.38) + 20
      const radiusY = Math.random() * (h * 0.35) + 20
      const hemisphere = Math.random() > 0.5 ? 1 : -1
      
      nodes.push({
        x: centerX + Math.cos(angle) * radiusX + (hemisphere * 25),
        y: centerY + Math.sin(angle) * radiusY,
        baseX: centerX + Math.cos(angle) * radiusX + (hemisphere * 25),
        baseY: centerY + Math.sin(angle) * radiusY,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 2,
        energy: Math.random(),
        cluster: Math.floor(Math.random() * 4), // 0: Input, 1: Hidden1, 2: Hidden2, 3: Output
      })
    }

    // Interactive cursor repulsion
    let mouse = { x: -1000, y: -1000, active: false }
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.active = true
    }
    const onMouseLeave = () => { mouse.active = false }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    let frame = 0
    const render = () => {
      frame++
      ctx.clearRect(0, 0, w, h)

      const isHighActivity = brainStatus === 'pensando' || brainStatus === 'aprendiendo'
      const speedMultiplier = isHighActivity ? 2.5 : 1

      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx * speedMultiplier
        node.y += node.vy * speedMultiplier

        // Boundary constraint
        const dx = node.x - node.baseX
        const dy = node.y - node.baseY
        if (Math.hypot(dx, dy) > 28) {
          node.vx *= -1
          node.vy *= -1
        }

        // Mouse reaction
        if (mouse.active) {
          const mdx = node.x - mouse.x
          const mdy = node.y - mouse.y
          const mdist = Math.hypot(mdx, mdy)
          if (mdist < 100) {
            node.x += (mdx / mdist) * 2
            node.y += (mdy / mdist) * 2
            node.energy = 1.0 // Trigger action potential
          }
        }

        // Dissipate energy
        node.energy = Math.max(0.2, node.energy - 0.015)
        if (Math.random() < (isHighActivity ? 0.08 : 0.02)) {
          node.energy = 1.0 // Spontaneous synaptic firing
        }
      })

      // Draw synapses (edges between close nodes)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          const maxDist = 95

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * ((a.energy + b.energy) / 2) * (isHighActivity ? 0.8 : 0.45)
            
            // Choose color based on energy level with Zenic Purple & Violet dominance
            let strokeColor = `rgba(156, 77, 204, ${alpha * 1.15})`
            if (a.energy > 0.7 || b.energy > 0.7) {
              strokeColor = `rgba(192, 132, 252, ${alpha * 1.35})`
            }

            ctx.strokeStyle = strokeColor
            ctx.lineWidth = a.energy > 0.8 || b.energy > 0.8 ? 2 : 1.1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()

            // Draw traveling synaptic action potential packet in Zenic lavender
            if ((a.energy > 0.6 || isHighActivity) && frame % 4 === 0) {
              const progress = (frame * 0.03 + (i * 0.1)) % 1
              const px = a.x + (b.x - a.x) * progress
              const py = a.y + (b.y - a.y) * progress
              ctx.fillStyle = '#C084FC'
              ctx.beginPath()
              ctx.arc(px, py, 2, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      // Draw neural soma (nodes) with Zenic purple and vibrant violet
      nodes.forEach(node => {
        const glow = node.energy > 0.7
        const nodeColor = glow
          ? '#C084FC'
          : (node.cluster === 0 ? '#9C4DCC' : node.cluster === 1 ? '#7928CA' : node.cluster === 2 ? '#00E5FF' : '#C084FC')
        
        ctx.fillStyle = nodeColor
        if (glow) {
          ctx.shadowColor = '#C084FC'
          ctx.shadowBlur = 14
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * (glow ? 1.4 : 1), 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [brainStatus, activeTab])

  // Trigger Cognitive Inference on a Scenario or Custom Prompt
  const executeInference = (scenario = null, customText = '') => {
    setIsProcessing(true)
    setBrainStatus('pensando')
    setReasoningStep(1)

    // Sequence of brain thinking steps
    setTimeout(() => setReasoningStep(2), 300)
    setTimeout(() => setReasoningStep(3), 600)

    setTimeout(() => {
      setReasoningStep(4)
      setIsProcessing(false)
      setBrainStatus('vigilante')

      if (scenario) {
        setSelectedScenario(scenario)
        setCurrentDecision(scenario.solution)
        setTensorVector(scenario.tensorData)
      } else {
        const textToAnalyze = customText || customQuery
        const decision = analyzeCustomQuery(textToAnalyze)
        setSelectedScenario({
          id: 'custom-' + Date.now(),
          title: `Consulta: "${textToAnalyze.length > 28 ? textToAnalyze.slice(0, 25) + '...' : textToAnalyze}"`,
          badge: 'Consulta Directa',
          icon: '💬',
          text: textToAnalyze,
          tensorData: decision.tensorData,
          solution: decision,
        })
        setCurrentDecision(decision)
        setTensorVector(decision.tensorData)
      }

      // Slightly fluctuate live vitals
      setInferenceLatency(+(1.8 + Math.random() * 0.4).toFixed(1))
      setNeuralImpulseRate(prev => Math.min(68, prev + 2))
    }, 850)
  }

  // Live Brain Training Loop Step
  const runLiveTraining = () => {
    setIsTraining(true)
    setBrainStatus('aprendiendo')
    let currentEpoch = epochs

    const interval = setInterval(() => {
      currentEpoch += 5
      setEpochs(currentEpoch)
      setLossValue(prev => +(Math.max(0.0035, prev * 0.88 + (Math.random() * 0.002 - 0.001))).toFixed(4))
      setCognitiveAccuracy(prev => +(Math.min(99.6, prev + (100 - prev) * 0.15)).toFixed(1))
      setActiveConnections(prev => prev + 128)

      if (currentEpoch >= epochs + 25) {
        clearInterval(interval)
        setIsTraining(false)
        setBrainStatus('vigilante')
      }
    }, 200)
  }

  // Theme tokens
  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'
  const cardBg = darkMode ? 'rgba(9, 19, 29, 0.85)' : 'rgba(255, 255, 255, 0.94)'
  const cardBorder = darkMode ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid rgba(0, 0, 0, 0.08)'

  return (
    <div style={{
      paddingTop: '80px',
      minHeight: '100vh',
      background: darkMode ? '#080E15' : '#F4F6F9',
      color: darkMode ? '#E2E8F0' : '#1E293B',
      transition: 'background 0.4s ease',
      overflowX: 'hidden',
    }}>

      {/* ── HEADER & BRAIN CORE CONTROLLER ── */}
      <section style={{
        position: 'relative',
        padding: 'clamp(3rem, 6vw, 4.5rem) clamp(1rem, 4vw, 2.5rem) 2rem',
        background: darkMode
          ? 'radial-gradient(circle at 50% 10%, #0c2035 0%, #080E15 70%)'
          : 'radial-gradient(circle at 50% 10%, #E2E8F0 0%, #F8FAFC 70%)',
        borderBottom: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(0, 0, 0, 0.06)'}`,
        overflow: 'hidden',
      }}>
        {/* Fondo de galaxia con partículas y paralaje 3D (mismo efecto de Nosotros) */}
        <GalaxyBackground darkMode={darkMode} density={600} />
        <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 10 }}>

          {/* Top Title Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: '2rem' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '0.4rem 1.15rem', borderRadius: 999,
                background: darkMode ? 'rgba(156, 77, 204, 0.18)' : 'rgba(156, 77, 204, 0.12)',
                border: `1.5px solid ${darkMode ? 'rgba(192, 132, 252, 0.45)' : 'rgba(156, 77, 204, 0.35)'}`,
                boxShadow: darkMode ? '0 0 16px rgba(156, 77, 204, 0.25)' : 'none',
                marginBottom: '0.75rem',
              }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#C084FC', boxShadow: '0 0 12px #C084FC' }} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#C084FC' : '#7928CA', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  CEREBRO DE INTELIGENCIA ARTIFICIAL EN VIVO · SISTEMA COGNITIVO ACTIVO
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.2rem, 4.8vw, 3.8rem)',
                fontWeight: 900,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: titleColor,
              }}>
                Cerebro Zenic{' '}
                <span className="text-gradient" style={{ fontWeight: 900 }}>
                  Cognitivo
                </span>
              </h1>
              <p style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', color: subColor, maxWidth: 640, marginTop: 6 }}>
                Grafo de conocimiento empresarial y mapa sináptico de entidades, equipo, producto y clientes en tiempo real.
              </p>
            </div>

            {/* Brain Telemetry Vitals */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              background: cardBg,
              padding: '0.85rem 1.25rem',
              borderRadius: 18,
              border: cardBorder,
              boxShadow: darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 6px 20px rgba(0,0,0,0.05)',
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: subColor, textTransform: 'uppercase', display: 'block' }}>Sinapsis Activas</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: darkMode ? '#00FF87' : '#059669', fontFamily: 'monospace' }}>
                  {activeConnections.toLocaleString()}
                </span>
              </div>
              <div style={{ width: 1, background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: subColor, textTransform: 'uppercase', display: 'block' }}>Frecuencia</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: darkMode ? '#00E5FF' : '#0284C7', fontFamily: 'monospace' }}>
                  {neuralImpulseRate} Hz
                </span>
              </div>
              <div style={{ width: 1, background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: subColor, textTransform: 'uppercase', display: 'block' }}>Latencia</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: titleColor, fontFamily: 'monospace' }}>
                  {inferenceLatency} ms
                </span>
              </div>
              <div style={{ width: 1, background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)', margin: '0 4px' }} />
              <div>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: subColor, textTransform: 'uppercase', display: 'block' }}>Precisión</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#F59E0B', fontFamily: 'monospace' }}>
                  {cognitiveAccuracy}%
                </span>
              </div>
            </div>
          </div>

          {/* ── VIEW MODE NAVIGATION TABS ── */}
          <div style={{
            display: 'flex',
            gap: '0.65rem',
            flexWrap: 'wrap',
            margin: '0.5rem 0 2rem',
            padding: '0.4rem',
            background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
            borderRadius: 16,
            border: cardBorder,
            width: 'fit-content',
          }}>
            <button
              onClick={() => setActiveTab('grafo')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 800,
                background: activeTab === 'grafo'
                  ? 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)'
                  : 'transparent',
                color: activeTab === 'grafo' ? '#FFFFFF' : subColor,
                boxShadow: activeTab === 'grafo' ? '0 4px 18px rgba(156, 77, 204, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Network size={16} />
              <span>Grafo de Conocimiento (Grafo Vivo)</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.55rem',
                borderRadius: 999,
                background: activeTab === 'grafo' ? 'rgba(255,255,255,0.22)' : 'rgba(156, 77, 204, 0.2)',
                color: activeTab === 'grafo' ? '#FFFFFF' : '#C084FC',
                fontWeight: 800,
              }}>
                INTERACTIVO
              </span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 800,
                background: activeTab === 'chat'
                  ? 'linear-gradient(135deg, #00E5FF 0%, #9C4DCC 100%)'
                  : 'transparent',
                color: activeTab === 'chat' ? '#FFFFFF' : subColor,
                boxShadow: activeTab === 'chat' ? '0 4px 18px rgba(0, 229, 255, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <MessageSquare size={16} />
              <span>Chat Cerebro IA (Claude)</span>
              <span style={{
                fontSize: '0.68rem',
                padding: '0.15rem 0.55rem',
                borderRadius: 999,
                background: activeTab === 'chat' ? 'rgba(255,255,255,0.25)' : 'rgba(0, 229, 255, 0.2)',
                color: activeTab === 'chat' ? '#FFFFFF' : '#00E5FF',
                fontWeight: 800,
              }}>
                CLAUDE
              </span>
            </button>

            <button
              onClick={() => setActiveTab('simulador')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 800,
                background: activeTab === 'simulador'
                  ? 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)'
                  : 'transparent',
                color: activeTab === 'simulador' ? '#FFFFFF' : subColor,
                boxShadow: activeTab === 'simulador' ? '0 4px 18px rgba(156, 77, 204, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Brain size={16} />
              <span>Simulador Sináptico & Decisiones</span>
            </button>

            <button
              onClick={() => setActiveTab('entrenamiento')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '0.65rem 1.25rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.86rem',
                fontWeight: 800,
                background: activeTab === 'entrenamiento'
                  ? 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)'
                  : 'transparent',
                color: activeTab === 'entrenamiento' ? '#FFFFFF' : subColor,
                boxShadow: activeTab === 'entrenamiento' ? '0 4px 18px rgba(156, 77, 204, 0.4)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <Gauge size={16} />
              <span>Laboratorio Neural</span>
            </button>

            <button
              onClick={() => setActiveTab('todos')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '0.65rem 1rem',
                borderRadius: 12,
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: activeTab === 'todos'
                  ? 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)'
                  : 'transparent',
                color: activeTab === 'todos' ? '#FFFFFF' : subColor,
                transition: 'all 0.2s ease',
              }}
            >
              <span>Ver Todo</span>
            </button>
          </div>

          {/* ── CHAT CEREBRO IA (CLAUDE + ZENIC-CEREBRO) ── */}
          {activeTab === 'chat' && (
            <div style={{ marginTop: '0.5rem', marginBottom: '2.5rem' }}>
              <ZenicBrainChat darkMode={darkMode} />
            </div>
          )}

          {/* ── GRAFO DE CONOCIMIENTO (EXACTO A LA IMAGEN) ── */}
          {(activeTab === 'grafo' || activeTab === 'todos') && (
            <div style={{ marginTop: '0.5rem', marginBottom: '2rem' }}>
              <ZenicBrainGraph darkMode={darkMode} />
            </div>
          )}

          {/* ── THE LIVING NEURAL NETWORK CANVAS ── */}
          {(activeTab === 'simulador' || activeTab === 'todos') && (
            <div style={{
              position: 'relative',
              borderRadius: 26,
              overflow: 'hidden',
              border: `1.5px solid ${darkMode ? 'rgba(0, 229, 255, 0.28)' : 'rgba(0, 0, 0, 0.1)'}`,
              background: darkMode ? '#060B10' : '#FFFFFF',
              boxShadow: darkMode
                ? '0 25px 70px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 229, 255, 0.1)'
                : '0 15px 40px rgba(0, 0, 0, 0.08)',
              height: 'clamp(360px, 48vh, 460px)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Top HUD Bar */}
              <div style={{
                position: 'absolute', top: 14, left: 16, right: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 20, pointerEvents: 'none',
              }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0.35rem 0.85rem', borderRadius: 999,
                  background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${darkMode ? 'rgba(0, 255, 135, 0.25)' : 'rgba(0, 0, 0, 0.08)'}`,
                  fontSize: '0.78rem', fontWeight: 700,
                }}>
                  <Brain size={15} color={darkMode ? '#00FF87' : '#059669'} />
                  <span style={{ color: titleColor }}>Mapeo Sináptico 3D</span>
                  <span style={{ color: darkMode ? '#00FF87' : '#059669' }}>● {brainStatus.toUpperCase()}</span>
                </div>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  padding: '0.35rem 0.85rem', borderRadius: 999,
                  background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(12px)',
                  border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.25)' : 'rgba(0, 0, 0, 0.08)'}`,
                  fontSize: '0.78rem', color: subColor,
                }}>
                  <span>Pasa el cursor para emitir estímulos sinápticos</span>
                </div>
              </div>

              {/* Neural Canvas Element */}
              <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', cursor: 'crosshair' }} />

              {/* Bottom HUD: Neural Topology Layers Indicator */}
              <div style={{
                position: 'absolute', bottom: 12, left: 16, right: 16,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
                zIndex: 20, pointerEvents: 'none',
                fontSize: '0.75rem',
              }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ background: darkMode ? 'rgba(0, 229, 255, 0.15)' : 'rgba(2, 132, 199, 0.1)', color: darkMode ? '#00E5FF' : '#0284C7', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 700 }}>
                    [Capa 0: Sensores de Entrada · 10 Dim]
                  </span>
                  <span style={{ background: darkMode ? 'rgba(0, 255, 135, 0.15)' : 'rgba(5, 150, 105, 0.1)', color: darkMode ? '#00FF87' : '#059669', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 700 }}>
                    [Capa 1: Red Profunda · 64 Neuronas ReLU]
                  </span>
                  <span style={{ background: darkMode ? 'rgba(0, 255, 135, 0.15)' : 'rgba(5, 150, 105, 0.1)', color: darkMode ? '#00FF87' : '#059669', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 700 }}>
                    [Capa 2: Mecanismo de Atención · 64 Neuronas]
                  </span>
                  <span style={{ background: 'rgba(156, 77, 204, 0.18)', color: '#9C4DCC', padding: '0.2rem 0.6rem', borderRadius: 6, fontWeight: 700 }}>
                    [Capa 3: Decisión Ejecutiva · 1 Salida]
                  </span>
                </div>
                <span style={{ color: subColor, fontFamily: 'monospace' }}>
                  FP32 Tensors · PyTorch Engine Core
                </span>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* ── CORE SECTION: CONSULTAR & EJECUTAR AL CEREBRO (REASONING ENGINE) ── */}
      {(activeTab === 'simulador' || activeTab === 'todos') && (
        <section style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: 'clamp(2.5rem, 5vw, 4rem) clamp(1rem, 4vw, 2.5rem)',
        }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 540px), 1fr))',
          gap: 'clamp(1.5rem, 3.5vw, 2.5rem)',
          alignItems: 'stretch',
        }}>

          {/* Left Column: Feed Stimuli / Scenarios to the Brain */}
          <div style={{
            background: cardBg,
            borderRadius: 24,
            border: cardBorder,
            padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: darkMode ? '0 20px 50px rgba(0,0,0,0.3)' : '0 8px 25px rgba(0,0,0,0.05)',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '0.5rem' }}>
                <Cpu size={18} color={darkMode ? '#00E5FF' : '#0284C7'} />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: darkMode ? '#00E5FF' : '#0284C7', textTransform: 'uppercase' }}>
                  1. ALIMENTACIÓN DE ESTÍMULOS SENSORIALES
                </span>
              </div>

              <h2 style={{ fontSize: '1.55rem', fontWeight: 900, color: titleColor, marginBottom: '0.75rem' }}>
                Plantea un Escenario al Cerebro
              </h2>
              <p style={{ fontSize: '0.88rem', color: subColor, lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Elige uno de los escenarios reales de retail o ingresa una consulta libre. El cerebro vectorizará la información y calculará la acción óptima.
              </p>

              {/* Scenario Preset Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {PRESET_SCENARIOS.map(sc => {
                  const isSel = selectedScenario.id === sc.id
                  return (
                    <button
                      key={sc.id}
                      onClick={() => executeInference(sc)}
                      disabled={isProcessing}
                      style={{
                        padding: '1rem',
                        borderRadius: 14,
                        textAlign: 'left',
                        cursor: 'pointer',
                        background: isSel
                          ? (darkMode ? 'rgba(156, 77, 204, 0.18)' : 'rgba(156, 77, 204, 0.12)')
                          : (darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                        border: isSel
                          ? '1.5px solid #C084FC'
                          : `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                        boxShadow: isSel ? '0 0 18px rgba(156, 77, 204, 0.25)' : 'none',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: '1.1rem' }}>{sc.icon}</span>
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: titleColor }}>{sc.title}</span>
                        </div>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: isSel ? '#C084FC' : (darkMode ? '#00FF87' : '#059669'),
                          background: isSel ? 'rgba(156, 77, 204, 0.25)' : (darkMode ? 'rgba(0,255,135,0.1)' : 'rgba(5,150,105,0.1)'),
                          padding: '0.15rem 0.5rem',
                          borderRadius: 6,
                        }}>
                          {sc.badge}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: subColor, lineHeight: 1.5, margin: 0 }}>
                        {sc.text}
                      </p>
                    </button>
                  )
                })}
              </div>

              {/* Quick Questions Pills */}
              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: subColor, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  💡 Preguntas frecuentes que puedes hacerle al Cerebro:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCustomQuery(q)
                        executeInference(null, q)
                      }}
                      disabled={isProcessing}
                      style={{
                        fontSize: '0.75rem',
                        padding: '0.4rem 0.75rem',
                        borderRadius: 8,
                        background: darkMode ? 'rgba(156, 77, 204, 0.14)' : 'rgba(156, 77, 204, 0.08)',
                        border: `1px solid ${darkMode ? 'rgba(192, 132, 252, 0.35)' : 'rgba(156, 77, 204, 0.25)'}`,
                        color: darkMode ? '#E9D5FF' : '#6B21A8',
                        cursor: 'pointer',
                        fontWeight: 600,
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Box */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: subColor, marginBottom: 6, textTransform: 'uppercase' }}>
                  O escribe tu consulta libre para el Cerebro:
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={customQuery}
                    onChange={e => setCustomQuery(e.target.value)}
                    placeholder="Ej. '¿Cuánto se demorarían para presentarme mi demo?'"
                    style={{
                      flex: 1,
                      padding: '0.85rem 1rem',
                      borderRadius: 12,
                      background: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
                      color: titleColor,
                      fontSize: '0.88rem',
                      outline: 'none',
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && customQuery.trim()) {
                        executeInference(null, customQuery)
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (customQuery.trim()) executeInference(null, customQuery)
                    }}
                    disabled={isProcessing || !customQuery.trim()}
                    style={{
                      padding: '0.85rem 1.35rem',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: isProcessing || !customQuery.trim() ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      boxShadow: '0 4px 18px rgba(156, 77, 204, 0.45)',
                      opacity: isProcessing || !customQuery.trim() ? 0.6 : 1,
                    }}
                  >
                    <Send size={15} />
                    <span>{isProcessing ? 'Procesando...' : 'Preguntar'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tensor Vector Visualizer Bar */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: subColor, marginBottom: 6 }}>
                <span>Tensores de Entrada Alimentados (10 features normalizadas):</span>
                <span style={{ fontFamily: 'monospace' }}>Shape: [1, 10]</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', gap: 4 }}>
                {tensorVector.map((val, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ height: 26, background: darkMode ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.06)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: `${val * 100}%`,
                        background: val > 0.7 ? '#00FF87' : val > 0.4 ? '#00E5FF' : '#9C4DCC',
                        transition: 'height 0.4s ease',
                      }} />
                    </div>
                    <span style={{ fontSize: '0.62rem', color: subColor, fontFamily: 'monospace' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Reasoning Output & Cognitive Decision */}
          <div style={{
            background: cardBg,
            borderRadius: 24,
            border: `1.5px solid ${darkMode ? 'rgba(156, 77, 204, 0.35)' : 'rgba(156, 77, 204, 0.25)'}`,
            padding: 'clamp(1.5rem, 3.5vw, 2.25rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: darkMode ? '0 20px 60px rgba(156, 77, 204, 0.15)' : '0 10px 30px rgba(156, 77, 204, 0.08)',
          }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={18} color="#C084FC" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase' }}>
                    2. DECISIÓN COGNITIVA & INFERENCIA AUTÓNOMA
                  </span>
                </div>
                <span style={{
                  fontSize: '0.75rem', fontWeight: 800,
                  color: '#00FF87', background: 'rgba(0,255,135,0.12)',
                  padding: '0.2rem 0.65rem', borderRadius: 999,
                }}>
                  Confianza: {currentDecision.confidence}%
                </span>
              </div>

              {/* Progress Stepper during Thinking */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
                padding: '0.75rem', borderRadius: 12,
                background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)',
                marginBottom: '1.25rem',
                fontSize: '0.7rem',
              }}>
                <div style={{ color: reasoningStep >= 1 ? (darkMode ? '#00FF87' : '#059669') : subColor, fontWeight: 700 }}>
                  1. Tensores ✓
                </div>
                <div style={{ color: reasoningStep >= 2 ? (darkMode ? '#00FF87' : '#059669') : subColor, fontWeight: 700 }}>
                  2. Red ReLU ✓
                </div>
                <div style={{ color: reasoningStep >= 3 ? (darkMode ? '#00E5FF' : '#0284C7') : subColor, fontWeight: 700 }}>
                  3. Atención ✓
                </div>
                <div style={{ color: reasoningStep >= 4 ? '#C084FC' : subColor, fontWeight: 700 }}>
                  4. Decisión {reasoningStep >= 4 ? '✓' : ''}
                </div>
              </div>

              {/* 💬 RESPUESTA DIRECTA DEL CEREBRO ZENIC IA */}
              <div style={{
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(156, 77, 204, 0.18) 0%, rgba(0, 229, 255, 0.08) 100%)'
                  : 'linear-gradient(135deg, rgba(156, 77, 204, 0.12) 0%, rgba(0, 229, 255, 0.06) 100%)',
                border: `1.5px solid ${darkMode ? 'rgba(192, 132, 252, 0.5)' : 'rgba(156, 77, 204, 0.4)'}`,
                borderRadius: 18,
                padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: darkMode ? '0 10px 30px rgba(156, 77, 204, 0.18)' : '0 6px 20px rgba(156, 77, 204, 0.08)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8,
                      background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(156, 77, 204, 0.4)',
                    }}>
                      <Brain size={16} color="#FFFFFF" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#C084FC', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Respuesta del Cerebro Zenic IA
                    </span>
                  </div>
                  {isProcessing && (
                    <span style={{ fontSize: '0.72rem', color: '#00E5FF', fontWeight: 700 }}>
                      Calculando inferencia...
                    </span>
                  )}
                </div>

                <p style={{
                  fontSize: '0.98rem',
                  fontWeight: 600,
                  color: titleColor,
                  lineHeight: 1.65,
                  margin: '0 0 0.85rem 0',
                }}>
                  {currentDecision.directAnswer || currentDecision.reasoning}
                </p>

                {/* Call to action button if present */}
                {currentDecision.ctaText && (
                  <div style={{ marginTop: '0.85rem' }}>
                    {currentDecision.ctaUrl?.startsWith('http') ? (
                      <a
                        href={currentDecision.ctaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '0.55rem 1.15rem', borderRadius: 10,
                          background: 'linear-gradient(135deg, #00FF87 0%, #00E5FF 100%)',
                          color: '#080E15',
                          fontSize: '0.82rem', fontWeight: 800,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(0, 255, 135, 0.35)',
                        }}
                      >
                        <span>{currentDecision.ctaText}</span>
                        <ArrowUpRight size={14} />
                      </a>
                    ) : (
                      <Link
                        to={currentDecision.ctaUrl || '/#agendar-demo'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '0.55rem 1.15rem', borderRadius: 10,
                          background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 60%, #00E5FF 100%)',
                          color: '#FFFFFF',
                          fontSize: '0.82rem', fontWeight: 800,
                          textDecoration: 'none',
                          boxShadow: '0 4px 14px rgba(156, 77, 204, 0.4)',
                        }}
                      >
                        <span>{currentDecision.ctaText}</span>
                        <ChevronRight size={14} />
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Main Decision Banner / Acción Estratégica */}
              <div style={{
                background: darkMode ? 'rgba(0, 255, 135, 0.08)' : 'rgba(5, 150, 105, 0.08)',
                border: `1.5px solid ${darkMode ? 'rgba(0, 255, 135, 0.4)' : 'rgba(5, 150, 105, 0.35)'}`,
                borderRadius: 18,
                padding: '1.25rem',
                marginBottom: '1.25rem',
              }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: darkMode ? '#00FF87' : '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Acción Estratégica Determinada por la Red
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: titleColor, marginTop: 4, lineHeight: 1.3 }}>
                  {currentDecision.action}
                </h3>
                <p style={{ fontSize: '0.85rem', color: subColor, lineHeight: 1.55, marginTop: 6, fontStyle: 'italic', margin: 0 }}>
                  "{currentDecision.reasoning}"
                </p>
              </div>

              {/* Business Impact Note */}
              <div style={{
                background: darkMode ? 'rgba(0, 229, 255, 0.06)' : 'rgba(2, 132, 199, 0.06)',
                border: `1px solid ${darkMode ? 'rgba(0, 229, 255, 0.25)' : 'rgba(2, 132, 199, 0.25)'}`,
                borderRadius: 14,
                padding: '0.9rem 1.1rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: darkMode ? '#00E5FF' : '#0284C7', textTransform: 'uppercase' }}>
                  Impacto Proyectado en Rentabilidad:
                </div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: titleColor, marginTop: 2, margin: 0 }}>
                  {currentDecision.impact}
                </p>
              </div>

              {/* KPIs Generated */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {currentDecision.kpis.map((kp, idx) => (
                  <div key={idx} style={{
                    background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    borderRadius: 12,
                    padding: '0.75rem',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  }}>
                    <span style={{ fontSize: '0.7rem', color: subColor, display: 'block' }}>{kp.label}</span>
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: titleColor }}>{kp.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: subColor }}>
                Motor Inferencia: <strong>Zenic Brain v2.4 (PyTorch Core)</strong>
              </span>
              <a
                href="/#agendar-demo"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '0.55rem 1.15rem', borderRadius: 10,
                  background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.82rem', fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(156, 77, 204, 0.4)',
                }}
              >
                <span>Conectar a mis Tiendas</span>
                <ChevronRight size={14} />
              </a>
            </div>
          </div>

        </div>
      </section>
      )}

      {/* ── LIVE LEARNING LABORATORY (ENTRENAR EL CEREBRO) ── */}
      {(activeTab === 'entrenamiento' || activeTab === 'todos') && (
        <section style={{
          maxWidth: 1320,
          margin: '0 auto',
          padding: '0 clamp(1rem, 4vw, 2.5rem) clamp(3rem, 6vw, 5rem)',
        }}>
        <div style={{
          background: cardBg,
          borderRadius: 24,
          border: cardBorder,
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          boxShadow: darkMode ? '0 20px 60px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Gauge size={18} color="#C084FC" />
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#C084FC', textTransform: 'uppercase' }}>
                  3. LABORATORIO DE APRENDIZAJE & CALIBRACIÓN SINÁPTICA
                </span>
              </div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 900, color: titleColor }}>
                Entrena el Cerebro en Tiempo Real
              </h3>
              <p style={{ fontSize: '0.85rem', color: subColor }}>
                Ejecuta el Training Loop (Backpropagation + Adam Optimizer) para recalibrar los pesos de las 65.536 conexiones sinápticas.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: subColor }}>
                <span>Learning Rate:</span>
                <select
                  value={learningRate}
                  onChange={e => setLearningRate(Number(e.target.value))}
                  style={{
                    padding: '0.4rem 0.6rem', borderRadius: 8,
                    background: darkMode ? '#080E15' : '#FFFFFF',
                    border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}`,
                    color: titleColor, fontSize: '0.8rem', fontWeight: 700, outline: 'none',
                  }}
                >
                  <option value={0.001}>0.001 (Óptimo Adam)</option>
                  <option value={0.01}>0.01 (Acelerado)</option>
                  <option value={0.0001}>0.0001 (Fino)</option>
                </select>
              </div>

              <button
                onClick={runLiveTraining}
                disabled={isTraining}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '0.75rem 1.4rem', borderRadius: 12,
                  background: 'linear-gradient(135deg, #9C4DCC 0%, #7928CA 55%, #4A2574 100%)',
                  color: '#FFFFFF',
                  fontWeight: 900, fontSize: '0.9rem',
                  border: 'none', cursor: 'pointer',
                  boxShadow: '0 6px 22px rgba(156, 77, 204, 0.45)',
                }}
              >
                {isTraining ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
                <span>{isTraining ? 'Entrenando Sinapsis...' : 'Entrenar +25 Épocas'}</span>
              </button>
            </div>
          </div>

          {/* Training Telemetry Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}>
            <div style={{ background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <span style={{ fontSize: '0.72rem', color: subColor, textTransform: 'uppercase', fontWeight: 700 }}>Épocas de Entrenamiento</span>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: titleColor, fontFamily: 'monospace' }}>
                #{epochs}
              </div>
            </div>

            <div style={{ background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <span style={{ fontSize: '0.72rem', color: '#EF4444', textTransform: 'uppercase', fontWeight: 700 }}>Loss (Función de Error)</span>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#EF4444', fontFamily: 'monospace' }}>
                {lossValue}
              </div>
            </div>

            <div style={{ background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <span style={{ fontSize: '0.72rem', color: darkMode ? '#00FF87' : '#059669', textTransform: 'uppercase', fontWeight: 700 }}>Precisión Cognitiva</span>
              <div style={{ fontSize: '1.9rem', fontWeight: 900, color: darkMode ? '#00FF87' : '#059669', fontFamily: 'monospace' }}>
                {cognitiveAccuracy}%
              </div>
            </div>

            <div style={{ background: darkMode ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.03)', borderRadius: 16, padding: '1rem', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              <span style={{ fontSize: '0.72rem', color: darkMode ? '#00E5FF' : '#0284C7', textTransform: 'uppercase', fontWeight: 700 }}>Optimizador de Pesos</span>
              <div style={{ fontSize: '1.15rem', fontWeight: 900, color: darkMode ? '#00E5FF' : '#0284C7', fontFamily: 'monospace', marginTop: 4 }}>
                Backprop (Adam lr={learningRate})
              </div>
            </div>
          </div>

          {/* Internalized Brain Knowledge Graph */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: titleColor, marginBottom: '0.75rem' }}>
              Memoria y Conocimiento Internalizado por el Cerebro
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1rem',
            }}>
              {BRAIN_MEMORIES.map(m => (
                <div key={m.id} style={{
                  background: darkMode ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.02)',
                  borderRadius: 14,
                  padding: '1rem',
                  borderLeft: `3px solid ${m.color}`,
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                  borderLeftWidth: 3,
                  borderLeftColor: m.color,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: titleColor }}>{m.title}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 900, color: m.color, fontFamily: 'monospace' }}>{m.value}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: subColor, lineHeight: 1.5, margin: 0 }}>
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
      )}

      {/* ── BOTÓN FLOTANTE Y OVERLAY DEL CHAT CON CLAUDE (SEPARADO VERTICALMENTE DE WHATSAPP) ── */}
      {activeTab !== 'chat' && (
        <div style={{ position: 'fixed', bottom: '94px', right: '24px', zIndex: isFloatingChatOpen ? 10000 : 9990 }}>
          <AnimatePresence>
            {isFloatingChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  bottom: '54px',
                  right: 0,
                  width: 'clamp(320px, 92vw, 440px)',
                  boxShadow: '0 25px 70px rgba(0,0,0,0.65)',
                  borderRadius: 24,
                }}
              >
                <ZenicBrainChat
                  darkMode={darkMode}
                  isFloating={true}
                  onClose={() => setIsFloatingChatOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsFloatingChatOpen(!isFloatingChatOpen)}
            aria-label="Abrir Chat Cerebro IA"
            title="Chat Cerebro IA con Claude"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '0.75rem 1.25rem',
              borderRadius: 999,
              border: darkMode ? '1px solid rgba(0, 229, 255, 0.35)' : '1px solid rgba(156, 77, 204, 0.3)',
              background: 'linear-gradient(135deg, #00E5FF 0%, #9C4DCC 100%)',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.86rem',
              cursor: 'pointer',
              boxShadow: darkMode
                ? '0 10px 25px rgba(0, 229, 255, 0.4), 0 0 15px rgba(156, 77, 204, 0.3)'
                : '0 8px 22px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06) translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1) translateY(0)')}
          >
            <MessageSquare size={17} />
            <span>Chat Cerebro</span>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#00FF87',
                boxShadow: '0 0 8px #00FF87',
              }}
            />
          </button>
        </div>
      )}

    </div>
  )
}
