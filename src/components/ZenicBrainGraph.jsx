import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Users,
  Layers,
  Cpu,
  FileText,
  Compass,
  Repeat,
  Smartphone,
  Barcode,
  Eye,
  Briefcase,
  Zap,
  CheckCircle2,
  X,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

// Categorías según la leyenda de la imagen
const CATEGORIES = {
  area: { label: 'Área', color: '#9C4DCC', dot: '🟣' },
  persona: { label: 'Persona', color: '#38BDF8', dot: '👤' },
  flujo: { label: 'Proyecto o flujo de IA', color: '#F43F5E', dot: '🟥' },
  herramienta: { label: 'Herramienta / Módulo', color: '#00FF87', dot: '🔹' },
  documento: { label: 'Documento / Registro', color: '#FBBF24', dot: '🟡' },
  cliente: { label: 'Cliente Real', color: '#A855F7', dot: '🟢' },
}

// Entidades del cerebro de Zenic S.A.S.
const NODES_DATA = [
  // Núcleo
  { id: 'zenic', label: 'ZENIC S.A.S.', type: 'area', group: 'core', desc: 'Núcleo central de la compañía. Soluciones digitales e inteligencia de negocios para comercio en Colombia.', radius: 28, color: '#C084FC' },

  // Áreas Principales
  { id: 'area-ventas', label: 'Ventas & Clientes', type: 'area', group: 'ventas', desc: 'Estrategia comercial, adquisición y relacionamiento con comercios.', radius: 20, color: '#9C4DCC' },
  { id: 'area-producto', label: 'Producto & POS', type: 'area', group: 'producto', desc: 'Desarrollo de módulos operativos, POS con IA y dashboards.', radius: 20, color: '#9C4DCC' },
  { id: 'area-equipo', label: 'Personas (Equipo)', type: 'area', group: 'equipo', desc: 'Liderazgo directivo y talento de Zenic.', radius: 20, color: '#9C4DCC' },
  { id: 'area-operaciones', label: 'Operaciones & Caja', type: 'area', group: 'operaciones', desc: 'Cuadres de caja, inventario, cartera y operación diaria.', radius: 20, color: '#9C4DCC' },
  { id: 'area-tech', label: 'Tecnología & IA', type: 'area', group: 'tech', desc: 'Infraestructura, visión artificial, sensores y sincronización.', radius: 20, color: '#9C4DCC' },
  { id: 'area-marketing', label: 'Marketing & Web', type: 'area', group: 'marketing', desc: 'Posicionamiento de marca, zenic.com.co y mensajes oficiales.', radius: 20, color: '#9C4DCC' },

  // Personas
  { id: 'p-marlon', label: 'Marlon Ramírez', sub: 'CEO & Fundador', type: 'persona', group: 'equipo', avatar: '/team/marlon.jpg', desc: 'Visión estratégica y liderazgo ejecutivo de Zenic S.A.S.', radius: 16, color: '#38BDF8' },
  { id: 'p-jhon', label: 'Jhon Aparicio', sub: 'Director Administrativo', type: 'persona', group: 'equipo', avatar: '/team/jhon.jpg', desc: 'Gestión de operaciones internas, finanzas y control administrativo.', radius: 16, color: '#38BDF8' },
  { id: 'p-miguel', label: 'Miguel Rodriguez', sub: 'Director de Tecnología', type: 'persona', group: 'equipo', avatar: '/team/miguel.png', desc: 'Arquitectura de software, módulos de IA y POS.', radius: 16, color: '#38BDF8' },
  { id: 'p-santiago', label: 'Santiago Peraza', sub: 'Director Marketing & Ventas', type: 'persona', group: 'equipo', avatar: '/team/santiago.jpg', desc: 'Posicionamiento comercial y relación directa con comercios.', radius: 16, color: '#38BDF8' },

  // Herramientas / Módulos
  { id: 'm-pos', label: 'POS con IA', type: 'herramienta', group: 'producto', desc: 'Punto de venta central que procesa ventas, inventario, caja y cartera en tiempo real.', radius: 15, color: '#00FF87' },
  { id: 'm-maneos', label: 'Módulo Maneos', type: 'herramienta', group: 'producto', desc: 'Préstamos de mercancía entre locales vecinos con registro y alertas de retorno.', radius: 15, color: '#00FF87' },
  { id: 'm-aprobacion', label: 'Aprobación Remota', type: 'herramienta', group: 'producto', desc: 'El vendedor pide descuento desde el POS y el dueño lo autoriza desde su celular.', radius: 15, color: '#00FF87' },
  { id: 'm-imei', label: 'IMEI & Trazabilidad', type: 'herramienta', group: 'producto', desc: 'Historial por equipo, garantía, batería y estado para tiendas de celulares.', radius: 15, color: '#00FF87' },
  { id: 'm-dashboards', label: 'Dashboards en Vivo', type: 'herramienta', group: 'producto', desc: 'Métricas gerenciales en tiempo real para control de ventas y márgenes.', radius: 14, color: '#00FF87' },
  { id: 'm-zenic360', label: 'ZENIC 360', type: 'herramienta', group: 'producto', desc: 'Universal Retail para cadenas comerciales multisede.', radius: 14, color: '#00FF87' },
  { id: 'm-telemetria', label: 'Telemetría Retail', type: 'herramienta', group: 'tech', desc: 'Visión artificial conectada a sensores físicos para analizar tráfico peatonal.', radius: 14, color: '#00FF87' },

  // Clientes Reales
  { id: 'c-manhattan', label: 'Barbería Manhattan', type: 'cliente', group: 'ventas', desc: 'Cliente oficial visible en zenic.com.co. Cuidado personal y barbería.', radius: 13, color: '#A855F7' },
  { id: 'c-digitalmarket', label: 'Digital Market', type: 'cliente', group: 'ventas', desc: 'Cliente oficial visible en zenic.com.co. Comercio de tecnología.', radius: 13, color: '#A855F7' },
  { id: 'c-tekfix', label: 'Tekfix', type: 'cliente', group: 'ventas', desc: 'Cliente oficial visible en zenic.com.co. Telefonía celular y soporte técnico.', radius: 13, color: '#A855F7' },
  { id: 'c-bendito', label: 'Bendito Encanto', type: 'cliente', group: 'ventas', desc: 'Cliente oficial visible en zenic.com.co. Boutique de moda retail.', radius: 13, color: '#A855F7' },

  // Proyectos o Flujos de IA
  { id: 'f-auditoria', label: 'Auditoría de 15 Min', type: 'flujo', group: 'ventas', desc: 'Llamado a la acción central por Google Meet o Teams sin costo comercial.', radius: 13, color: '#F43F5E' },
  { id: 'f-colas', label: 'Detección de Colas', type: 'flujo', group: 'tech', desc: 'Sensor cognitivo que anticipa cuellos de botella en checkout.', radius: 12, color: '#F43F5E' },
  { id: 'f-mapascalor', label: 'Mapas de Calor', type: 'flujo', group: 'tech', desc: 'Seguimiento térmico de permanencia de clientes en pasillos.', radius: 12, color: '#F43F5E' },
  { id: 'f-alerta-devolucion', label: 'Alerta Retorno Maneo', type: 'flujo', group: 'operaciones', desc: 'Notificación automática para recuperar mercancía prestada a vecinos.', radius: 12, color: '#F43F5E' },
  { id: 'f-log-descuento', label: 'Log de Aprobación Móvil', type: 'flujo', group: 'operaciones', desc: 'Registro histórico auditable de descuentos aprobados desde el celular.', radius: 12, color: '#F43F5E' },
  { id: 'f-vencimiento-imei', label: 'Alerta Vencimiento Garantía', type: 'flujo', group: 'operaciones', desc: 'Aviso preventivo antes de que caduque la cobertura de un dispositivo.', radius: 12, color: '#F43F5E' },

  // Documentos
  { id: 'd-quienes', label: 'quienes-somos.md', type: 'documento', group: 'equipo', desc: 'Identidad corporativa de Zenic S.A.S. en zenic-cerebro/empresa/.', radius: 10, color: '#FBBF24' },
  { id: 'd-propuesta', label: 'propuesta-de-valor.md', type: 'documento', group: 'ventas', desc: 'Qué vendemos primero y escalamiento comercial.', radius: 10, color: '#FBBF24' },
  { id: 'd-tono', label: 'tono-de-marca.md', type: 'documento', group: 'marketing', desc: 'Guía verbal cercana, directa y centrada en comercio real.', radius: 10, color: '#FBBF24' },
  { id: 'd-objeciones', label: 'objeciones.md', type: 'documento', group: 'ventas', desc: 'Respuestas comerciales a "Ya uso Excel" y caídas de internet.', radius: 10, color: '#FBBF24' },
  { id: 'd-guion', label: 'guion-demo.md', type: 'documento', group: 'ventas', desc: 'Estructura de la demo comercial de 15 minutos.', radius: 10, color: '#FBBF24' },
  { id: 'd-web', label: 'mapa-del-sitio.md', type: 'documento', group: 'marketing', desc: 'Estructura de navegación de zenic.com.co y botón Cerebro IA.', radius: 10, color: '#FBBF24' },
  { id: 'd-arquitectura', label: 'arquitectura.md', type: 'documento', group: 'tech', desc: 'Arquitectura técnica de POS, dashboards y visión artificial.', radius: 10, color: '#FBBF24' },
  { id: 'd-glosario', label: 'glosario.md', type: 'documento', group: 'tech', desc: 'Definiciones de IMEI, Maneos, Cartera, POS y Telemetría.', radius: 10, color: '#FBBF24' },
]

// Conexiones / Aristas (Relaciones Sinápticas)
const EDGES_DATA = [
  // Conexiones núcleo
  { source: 'zenic', target: 'area-ventas' },
  { source: 'zenic', target: 'area-producto' },
  { source: 'zenic', target: 'area-equipo' },
  { source: 'zenic', target: 'area-operaciones' },
  { source: 'zenic', target: 'area-tech' },
  { source: 'zenic', target: 'area-marketing' },

  // Equipo
  { source: 'area-equipo', target: 'p-marlon' },
  { source: 'area-equipo', target: 'p-jhon' },
  { source: 'area-equipo', target: 'p-miguel' },
  { source: 'area-equipo', target: 'p-santiago' },
  { source: 'area-equipo', target: 'd-quienes' },

  // Producto
  { source: 'area-producto', target: 'm-pos' },
  { source: 'area-producto', target: 'm-maneos' },
  { source: 'area-producto', target: 'm-aprobacion' },
  { source: 'area-producto', target: 'm-imei' },
  { source: 'area-producto', target: 'm-dashboards' },
  { source: 'area-producto', target: 'm-zenic360' },

  // Ventas & Clientes
  { source: 'area-ventas', target: 'c-manhattan' },
  { source: 'area-ventas', target: 'c-digitalmarket' },
  { source: 'area-ventas', target: 'c-tekfix' },
  { source: 'area-ventas', target: 'c-bendito' },
  { source: 'area-ventas', target: 'f-auditoria' },
  { source: 'area-ventas', target: 'd-propuesta' },
  { source: 'area-ventas', target: 'd-guion' },
  { source: 'area-ventas', target: 'd-objeciones' },

  // Operaciones & Caja
  { source: 'area-operaciones', target: 'm-pos' },
  { source: 'area-operaciones', target: 'f-alerta-devolucion' },
  { source: 'area-operaciones', target: 'f-log-descuento' },
  { source: 'area-operaciones', target: 'f-vencimiento-imei' },
  { source: 'm-maneos', target: 'f-alerta-devolucion' },
  { source: 'm-aprobacion', target: 'f-log-descuento' },
  { source: 'm-imei', target: 'f-vencimiento-imei' },

  // Tecnología & IA
  { source: 'area-tech', target: 'm-telemetria' },
  { source: 'area-tech', target: 'f-colas' },
  { source: 'area-tech', target: 'f-mapascalor' },
  { source: 'area-tech', target: 'd-arquitectura' },
  { source: 'area-tech', target: 'd-glosario' },
  { source: 'm-telemetria', target: 'f-colas' },
  { source: 'm-telemetria', target: 'f-mapascalor' },

  // Marketing & Web
  { source: 'area-marketing', target: 'd-web' },
  { source: 'area-marketing', target: 'd-tono' },
  { source: 'area-marketing', target: 'p-santiago' },
  { source: 'area-marketing', target: 'f-auditoria' },

  // Interconexiones cruzadas
  { source: 'p-miguel', target: 'area-tech' },
  { source: 'p-santiago', target: 'area-ventas' },
  { source: 'p-jhon', target: 'area-operaciones' },
  { source: 'p-marlon', target: 'area-producto' },
  { source: 'c-tekfix', target: 'm-imei' },
  { source: 'c-bendito', target: 'm-maneos' },
  { source: 'c-manhattan', target: 'm-pos' },
  { source: 'c-digitalmarket', target: 'm-dashboards' },
]

export default function ZenicBrainGraph({ darkMode }) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  // Estados interactivos
  const [selectedNodeId, setSelectedNodeId] = useState('zenic')
  const [hoveredNodeId, setHoveredNodeId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' | 'area' | 'persona' | 'herramienta' | 'flujo' | 'documento' | 'cliente'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Colores tema
  const titleColor = darkMode ? '#FFFFFF' : '#0F172A'
  const subColor = darkMode ? '#94A3B8' : '#475569'
  const cardBg = darkMode ? 'rgba(10, 18, 28, 0.92)' : 'rgba(255, 255, 255, 0.95)'
  const cardBorder = darkMode ? '1px solid rgba(0, 229, 255, 0.18)' : '1px solid rgba(0, 0, 0, 0.08)'

  // Posicionamiento de nodos (Grafo Radial con Física Liviana)
  const simulationRef = useRef({
    nodes: [],
    edges: [],
    draggingNode: null,
    offset: { x: 0, y: 0 },
    zoom: 1,
  })

  // Inicializar posiciones radiales
  useEffect(() => {
    const nodes = NODES_DATA.map(node => {
      let x = 0
      let y = 0

      if (node.id === 'zenic') {
        x = 0
        y = 0
      } else if (node.type === 'area') {
        // Anillo 1: Áreas (radio 140)
        const areaNodes = NODES_DATA.filter(n => n.type === 'area' && n.id !== 'zenic')
        const idx = areaNodes.findIndex(n => n.id === node.id)
        const angle = (idx / areaNodes.length) * Math.PI * 2 - Math.PI / 2
        x = Math.cos(angle) * 155
        y = Math.sin(angle) * 155
      } else {
        // Anillo 2 y 3: Subnodos alrededor de su grupo
        const groupAngleMap = {
          ventas: 0,
          producto: Math.PI / 3,
          equipo: (2 * Math.PI) / 3,
          operaciones: Math.PI,
          tech: (4 * Math.PI) / 3,
          marketing: (5 * Math.PI) / 3,
        }
        const baseAngle = groupAngleMap[node.group] || Math.random() * Math.PI * 2
        const jitter = (Math.random() - 0.5) * 0.75
        const dist = node.type === 'persona' ? 250 : node.type === 'herramienta' ? 275 : node.type === 'flujo' ? 320 : 360
        x = Math.cos(baseAngle + jitter) * dist
        y = Math.sin(baseAngle + jitter) * dist
      }

      return {
        ...node,
        x,
        y,
        vx: 0,
        vy: 0,
        targetX: x,
        targetY: y,
      }
    })

    const edges = EDGES_DATA.map(e => ({
      source: e.source,
      target: e.target,
    }))

    simulationRef.current.nodes = nodes
    simulationRef.current.edges = edges
  }, [])

  // Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const handleResize = () => {
      if (!canvas.parentElement) return
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Interacción ratón
    let isMouseDown = false
    let lastMousePos = { x: 0, y: 0 }

    const getCanvasMousePos = (e) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseDown = (e) => {
      isMouseDown = true
      const pos = getCanvasMousePos(e)
      lastMousePos = pos

      const { nodes, offset, zoom } = simulationRef.current
      const centerX = canvas.parentElement.offsetWidth / 2 + offset.x
      const centerY = canvas.parentElement.offsetHeight / 2 + offset.y

      // Buscar si se hizo clic en un nodo
      const clicked = nodes.slice().reverse().find(n => {
        const nx = centerX + n.x * zoom
        const ny = centerY + n.y * zoom
        const dist = Math.hypot(pos.x - nx, pos.y - ny)
        return dist <= (n.radius + 6) * zoom
      })

      if (clicked) {
        simulationRef.current.draggingNode = clicked
        setSelectedNodeId(clicked.id)
      }
    }

    const onMouseMove = (e) => {
      const pos = getCanvasMousePos(e)
      const { nodes, offset, zoom, draggingNode } = simulationRef.current
      const centerX = canvas.parentElement.offsetWidth / 2 + offset.x
      const centerY = canvas.parentElement.offsetHeight / 2 + offset.y

      if (draggingNode) {
        draggingNode.x = (pos.x - centerX) / zoom
        draggingNode.y = (pos.y - centerY) / zoom
        draggingNode.targetX = draggingNode.x
        draggingNode.targetY = draggingNode.y
        return
      }

      if (isMouseDown) {
        offset.x += pos.x - lastMousePos.x
        offset.y += pos.y - lastMousePos.y
        lastMousePos = pos
        return
      }

      // Hover check
      const hovered = nodes.slice().reverse().find(n => {
        const nx = centerX + n.x * zoom
        const ny = centerY + n.y * zoom
        const dist = Math.hypot(pos.x - nx, pos.y - ny)
        return dist <= (n.radius + 6) * zoom
      })

      setHoveredNodeId(hovered ? hovered.id : null)
      canvas.style.cursor = hovered ? 'pointer' : 'grab'
    }

    const onMouseUp = () => {
      isMouseDown = false
      simulationRef.current.draggingNode = null
    }

    const onWheel = (e) => {
      e.preventDefault()
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92
      simulationRef.current.zoom = Math.min(2.2, Math.max(0.45, simulationRef.current.zoom * zoomFactor))
    }

    canvas.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    canvas.addEventListener('wheel', onWheel, { passive: false })

    // Bucle de renderizado
    let frame = 0
    const render = () => {
      frame++
      if (!canvas || !canvas.parentElement) return
      const w = canvas.parentElement.offsetWidth
      const h = canvas.parentElement.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const { nodes, edges, offset, zoom } = simulationRef.current
      const centerX = w / 2 + offset.x
      const centerY = h / 2 + offset.y

      // Dibujar cuadrícula sutil
      ctx.save()
      ctx.strokeStyle = darkMode ? 'rgba(0, 229, 255, 0.035)' : 'rgba(0, 0, 0, 0.03)'
      ctx.lineWidth = 1
      const gridSize = 40 * zoom
      const startX = (centerX % gridSize) - gridSize
      const startY = (centerY % gridSize) - gridSize

      ctx.beginPath()
      for (let x = startX; x < w + gridSize; x += gridSize) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
      }
      for (let y = startY; y < h + gridSize; y += gridSize) {
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
      }
      ctx.stroke()
      ctx.restore()

      // Dibujar círculos orbitales concéntricos
      ctx.save()
      const orbits = [155, 250, 320, 360]
      orbits.forEach(r => {
        ctx.beginPath()
        ctx.arc(centerX, centerY, r * zoom, 0, Math.PI * 2)
        ctx.strokeStyle = darkMode ? 'rgba(156, 77, 204, 0.08)' : 'rgba(156, 77, 204, 0.06)'
        ctx.setLineDash([4, 6])
        ctx.stroke()
      })
      ctx.restore()

      // Encontrar nodo enfocado (hovered o selected)
      const activeId = hoveredNodeId || selectedNodeId
      const connectedNodeIds = new Set()
      if (activeId) {
        connectedNodeIds.add(activeId)
        edges.forEach(e => {
          if (e.source === activeId) connectedNodeIds.add(e.target)
          if (e.target === activeId) connectedNodeIds.add(e.source)
        })
      }

      // Dibujar Conexiones (Edges)
      edges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        const targetNode = nodes.find(n => n.id === edge.target)
        if (!sourceNode || !targetNode) return

        const sx = centerX + sourceNode.x * zoom
        const sy = centerY + sourceNode.y * zoom
        const tx = centerX + targetNode.x * zoom
        const ty = centerY + targetNode.y * zoom

        const isHighlighted = activeId && (edge.source === activeId || edge.target === activeId)
        const isDimmed = activeId && !isHighlighted

        ctx.save()
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(tx, ty)

        if (isHighlighted) {
          ctx.strokeStyle = darkMode ? 'rgba(0, 229, 255, 0.85)' : 'rgba(156, 77, 204, 0.75)'
          ctx.lineWidth = 2.2
          ctx.shadowBlur = darkMode ? 10 : 0
          ctx.shadowColor = '#00E5FF'
        } else if (isDimmed) {
          ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.04)'
          ctx.lineWidth = 0.8
        } else {
          ctx.strokeStyle = darkMode ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)'
          ctx.lineWidth = 1
        }
        ctx.stroke()

        // Pulso sináptico que viaja por las aristas
        if (isHighlighted || (frame + edge.source.length * 15) % 180 < 40) {
          const t = ((frame * 0.015 + edge.source.length) % 1)
          const px = sx + (tx - sx) * t
          const py = sy + (ty - sy) * t
          ctx.beginPath()
          ctx.arc(px, py, 2.5 * zoom, 0, Math.PI * 2)
          ctx.fillStyle = isHighlighted ? '#00FF87' : (darkMode ? '#C084FC' : '#9C4DCC')
          ctx.fill()
        }

        ctx.restore()
      })

      // Dibujar Nodos
      nodes.forEach(node => {
        // Filtrado
        const matchesFilter = filterType === 'all' || node.type === filterType || (filterType === 'area' && node.id === 'zenic')
        const matchesSearch = !searchQuery || node.label.toLowerCase().includes(searchQuery.toLowerCase()) || node.desc.toLowerCase().includes(searchQuery.toLowerCase())
        const isConnected = !activeId || connectedNodeIds.has(node.id)
        const isSelected = selectedNodeId === node.id
        const isHovered = hoveredNodeId === node.id

        const nx = centerX + node.x * zoom
        const ny = centerY + node.y * zoom
        const r = node.radius * zoom

        ctx.save()

        // Opacidad según filtro y enfoque
        if (!matchesFilter || !matchesSearch) {
          ctx.globalAlpha = 0.12
        } else if (activeId && !isConnected) {
          ctx.globalAlpha = 0.2
        } else {
          ctx.globalAlpha = 1
        }

        // Halo resplandeciente para nodo seleccionado o hovered
        if (isSelected || isHovered) {
          ctx.beginPath()
          ctx.arc(nx, ny, r * 1.6, 0, Math.PI * 2)
          ctx.fillStyle = isSelected
            ? (darkMode ? 'rgba(192, 132, 252, 0.35)' : 'rgba(156, 77, 204, 0.25)')
            : (darkMode ? 'rgba(0, 229, 255, 0.3)' : 'rgba(0, 229, 255, 0.2)')
          ctx.fill()
        }

        // Cuerpo del nodo
        ctx.beginPath()
        ctx.arc(nx, ny, r, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Borde
        ctx.lineWidth = (isSelected ? 3 : 1.5) * zoom
        ctx.strokeStyle = isSelected ? '#FFFFFF' : (darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.25)')
        ctx.stroke()

        // Nodo central Zenic con logotipo interior
        if (node.id === 'zenic') {
          ctx.fillStyle = '#FFFFFF'
          ctx.font = `bold ${Math.max(10, 11 * zoom)}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('ZENIC', nx, ny)
        }

        // Etiquetas de texto
        if (zoom > 0.65 || isSelected || isHovered || node.type === 'area' || node.type === 'persona') {
          ctx.fillStyle = titleColor
          ctx.font = `${isSelected ? 'bold ' : ''}${Math.max(9, (node.type === 'area' ? 11 : 9.5) * zoom)}px sans-serif`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'top'

          // Sombra de fondo para legibilidad
          ctx.shadowColor = darkMode ? '#000000' : '#FFFFFF'
          ctx.shadowBlur = 4
          ctx.fillText(node.label, nx, ny + r + 4)
          ctx.shadowBlur = 0
        }

        ctx.restore()
      })

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      canvas.removeEventListener('wheel', onWheel)
    }
  }, [darkMode, hoveredNodeId, selectedNodeId, filterType, searchQuery])

  // Nodo actualmente seleccionado
  const selectedNode = useMemo(() => {
    return NODES_DATA.find(n => n.id === selectedNodeId) || NODES_DATA[0]
  }, [selectedNodeId])

  // Nodos conectados al seleccionado
  const connectedNodes = useMemo(() => {
    const ids = new Set()
    EDGES_DATA.forEach(e => {
      if (e.source === selectedNodeId) ids.add(e.target)
      if (e.target === selectedNodeId) ids.add(e.source)
    })
    return NODES_DATA.filter(n => ids.has(n.id))
  }, [selectedNodeId])

  // Reset de vista / cámara
  const resetCamera = () => {
    simulationRef.current.offset = { x: 0, y: 0 }
    simulationRef.current.zoom = 1
  }

  // Centrar en un nodo al hacer clic en la lista
  const focusOnNode = (nodeId) => {
    setSelectedNodeId(nodeId)
    const node = simulationRef.current.nodes.find(n => n.id === nodeId)
    if (node) {
      simulationRef.current.offset = { x: -node.x * simulationRef.current.zoom, y: -node.y * simulationRef.current.zoom }
    }
  }

  // Lista de entidades filtradas para el panel izquierdo
  const filteredEntities = useMemo(() => {
    return NODES_DATA.filter(n => {
      const matchesFilter = filterType === 'all' || n.type === filterType || (filterType === 'area' && n.id === 'zenic')
      const matchesSearch = !searchQuery || n.label.toLowerCase().includes(searchQuery.toLowerCase()) || n.desc.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [filterType, searchQuery])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(620px, 82vh, 850px)',
        borderRadius: 24,
        overflow: 'hidden',
        border: cardBorder,
        background: darkMode ? 'rgba(5, 10, 16, 0.72)' : 'rgba(248, 250, 252, 0.75)',
        backdropFilter: 'blur(16px)',
        boxShadow: darkMode
          ? '0 25px 70px rgba(0, 0, 0, 0.6), 0 0 50px rgba(0, 229, 255, 0.08)'
          : '0 15px 40px rgba(0, 0, 0, 0.07)',
        display: 'flex',
      }}
    >
      {/* ── CANVAS DE GRAFO DE CONOCIMIENTO ── */}
      <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* HUD SUPERIOR: ESTADÍSTICAS Y ACTUALIZACIÓN EN VIVO (COMO EN LA IMAGEN) */}
        <div style={{
          position: 'absolute', top: 16, left: isSidebarOpen ? 320 : 16, right: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 10, pointerEvents: 'none', zIndex: 10,
          transition: 'left 0.3s ease',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '0.45rem 1rem', borderRadius: 999,
            background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            border: cardBorder,
            fontSize: '0.8rem', fontWeight: 700, pointerEvents: 'auto',
          }}>
            <span style={{ color: '#00FF87', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 10px #00FF87' }} />
              Actualización hace 2 min
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ color: titleColor }}>
              <strong>{NODES_DATA.length} entidades</strong> · <strong>{EDGES_DATA.length} conexiones</strong>
            </span>
          </div>

          {/* Botones de control rápido */}
          <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
            <button
              onClick={resetCamera}
              title="Centrar vista"
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                border: cardBorder, color: titleColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={() => setIsSidebarOpen(prev => !prev)}
              title="Mostrar / Ocultar panel lateral"
              style={{
                padding: '0 0.8rem', height: 36, borderRadius: 10,
                background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                border: cardBorder, color: titleColor,
                fontSize: '0.78rem', fontWeight: 700,
                display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer',
              }}
            >
              <Filter size={14} />
              <span>{isSidebarOpen ? 'Ocultar Panel' : 'Ver Entidades'}</span>
            </button>
          </div>
        </div>

        {/* LEYENDA INFERIOR IZQUIERDA (EXACTA A LA IMAGEN) */}
        <div style={{
          position: 'absolute', bottom: 16, left: isSidebarOpen ? 320 : 16,
          background: darkMode ? 'rgba(8, 14, 21, 0.88)' : 'rgba(255, 255, 255, 0.92)',
          backdropFilter: 'blur(12px)',
          border: cardBorder,
          borderRadius: 14,
          padding: '0.65rem 1rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.74rem',
          fontWeight: 700,
          zIndex: 10,
          pointerEvents: 'auto',
          transition: 'left 0.3s ease',
        }}>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setFilterType(filterType === key ? 'all' : key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: 'none', cursor: 'pointer',
                color: filterType === key ? '#FFFFFF' : (darkMode ? '#CBD5E1' : '#475569'),
                opacity: filterType === 'all' || filterType === key ? 1 : 0.45,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: cat.color }} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* PANEL FLOTANTE DE DETALLE DEL NODO SELECCIONADO (INSPECTOR) */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                position: 'absolute',
                top: 70,
                right: 16,
                width: 'min(330px, calc(100vw - 32px))',
                background: darkMode ? 'rgba(8, 14, 21, 0.92)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(16px)',
                border: `1.5px solid ${selectedNode.color}60`,
                borderRadius: 18,
                padding: '1.25rem',
                boxShadow: darkMode ? '0 15px 40px rgba(0,0,0,0.5)' : '0 8px 30px rgba(0,0,0,0.1)',
                zIndex: 20,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <span style={{
                  fontSize: '0.7rem', fontWeight: 800,
                  color: selectedNode.color,
                  background: `${selectedNode.color}20`,
                  padding: '0.2rem 0.6rem', borderRadius: 999,
                  textTransform: 'uppercase',
                }}>
                  {CATEGORIES[selectedNode.type]?.label || 'Entidad'}
                </span>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  style={{ background: 'transparent', border: 'none', color: subColor, cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Título y Avatar si aplica */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                {selectedNode.avatar ? (
                  <img
                    src={selectedNode.avatar}
                    alt={selectedNode.label}
                    style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${selectedNode.color}` }}
                  />
                ) : (
                  <div style={{
                    width: 40, height: 40, borderRadius: 12,
                    background: `${selectedNode.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: selectedNode.color, fontWeight: 900,
                  }}>
                    {CATEGORIES[selectedNode.type]?.dot || '●'}
                  </div>
                )}
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: titleColor, margin: 0 }}>
                    {selectedNode.label}
                  </h4>
                  {selectedNode.sub && (
                    <span style={{ fontSize: '0.78rem', color: selectedNode.color, fontWeight: 700 }}>
                      {selectedNode.sub}
                    </span>
                  )}
                </div>
              </div>

              <p style={{ fontSize: '0.82rem', color: subColor, lineHeight: 1.5, margin: '0 0 1rem' }}>
                {selectedNode.desc}
              </p>

              {/* Conexiones directas */}
              <div style={{ borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`, paddingTop: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: subColor, textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                  Conexiones Sinápticas ({connectedNodes.length})
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 130, overflowY: 'auto' }}>
                  {connectedNodes.map(cNode => (
                    <button
                      key={cNode.id}
                      onClick={() => focusOnNode(cNode.id)}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.55rem',
                        borderRadius: 8,
                        background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                        border: `1px solid ${cNode.color}40`,
                        color: titleColor,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cNode.color }} />
                      <span>{cNode.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── PANEL LATERAL IZQUIERDO: LISTA DE ENTIDADES (COMO EN LA IMAGEN) ── */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              width: 300,
              background: cardBg,
              backdropFilter: 'blur(16px)',
              borderRight: cardBorder,
              display: 'flex',
              flexDirection: 'column',
              zIndex: 15,
              overflow: 'hidden',
            }}
          >
            {/* Buscador de Entidades */}
            <div style={{ padding: '1rem', borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}` }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)',
                borderRadius: 10, padding: '0.5rem 0.75rem',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
              }}>
                <Search size={15} color={subColor} />
                <input
                  type="text"
                  placeholder="Buscar en el cerebro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: titleColor, fontSize: '0.82rem', width: '100%',
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'transparent', border: 'none', color: subColor, cursor: 'pointer' }}
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>

            {/* Lista con Scroll de Entidades */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.65rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, color: subColor, textTransform: 'uppercase', padding: '0.25rem 0.5rem 0.5rem' }}>
                Entidades ({filteredEntities.length})
              </div>

              {filteredEntities.map(node => {
                const isSelected = selectedNodeId === node.id
                return (
                  <button
                    key={node.id}
                    onClick={() => focusOnNode(node.id)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '0.6rem 0.75rem',
                      borderRadius: 12,
                      textAlign: 'left',
                      cursor: 'pointer',
                      background: isSelected
                        ? (darkMode ? 'rgba(156, 77, 204, 0.22)' : 'rgba(156, 77, 204, 0.12)')
                        : 'transparent',
                      border: isSelected
                        ? `1.5px solid ${node.color}`
                        : '1px solid transparent',
                      marginBottom: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    {node.avatar ? (
                      <img
                        src={node.avatar}
                        alt={node.label}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                      />
                    ) : (
                      <div style={{
                        width: 26, height: 26, borderRadius: 8,
                        background: `${node.color}25`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: node.color, fontSize: '0.72rem', flexShrink: 0,
                      }}>
                        {CATEGORIES[node.type]?.dot || '●'}
                      </div>
                    )}

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: '0.82rem', fontWeight: 700, color: titleColor,
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {node.label}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: subColor }}>
                        {node.sub || CATEGORIES[node.type]?.label}
                      </div>
                    </div>

                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: node.color, flexShrink: 0 }} />
                  </button>
                )
              })}
            </div>

            {/* Footer de Estado */}
            <div style={{
              padding: '0.75rem 1rem',
              borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              fontSize: '0.72rem', color: subColor,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>Zenic Cognitive Graph</span>
              <span style={{ color: '#00FF87', fontWeight: 800 }}>● Activo</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

