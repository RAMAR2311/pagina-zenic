import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Compass, RotateCw, ZoomIn, ZoomOut, CheckCircle2, ArrowRight, Maximize2 } from 'lucide-react'

// Datos de los puestos directivos y agentes de Zenic
export const DESK_STATIONS = [
  {
    id: 'ceo',
    name: 'Marlon Ramírez',
    role: 'CEO & Fundador',
    desk: 'Oficina Ejecutiva',
    officeName: 'Despacho CEO',
    description: 'Estrategia corporativa, alianzas de retail y visión del ecosistema Zenic en Colombia.',
    x: -4.4,
    z: -3.8,
    color: '#F59E0B',
    badge: 'Estrategia',
    icon: '👑',
    skinTone: '#ffd7b5',
    hairColor: '#2b2d42',
    accentColor: '#F59E0B',
  },
  {
    id: 'admin',
    name: 'Jhon Aparicio',
    role: 'Dir. Administrativo',
    desk: 'Oficina Financiera',
    officeName: 'Finanzas & Admin',
    description: 'Gestión contable, operaciones financieras, nómina y facturación electrónica POS.',
    x: 4.4,
    z: -3.8,
    color: '#00E5FF',
    badge: 'Operaciones',
    icon: '💼',
    skinTone: '#f1c27d',
    hairColor: '#4a3222',
    accentColor: '#00E5FF',
  },
  {
    id: 'cto',
    name: 'Miguel Rodriguez',
    role: 'Dir. de Tecnología',
    desk: 'Laboratorio Tech & IA',
    officeName: 'Lab Tech & POS',
    description: 'Arquitectura de software cloud, sincronización offline y modelos de IA en punto de venta.',
    x: -4.4,
    z: 3.8,
    color: '#C084FC',
    badge: 'Arquitectura',
    icon: '⚡',
    skinTone: '#ffd7b5',
    hairColor: '#6f4e37',
    accentColor: '#C084FC',
  },
  {
    id: 'cmo',
    name: 'Santiago Peraza',
    role: 'Dir. de Marketing',
    desk: 'Sala Retail & Demos',
    officeName: 'Marketing & Retail',
    description: 'Crecimiento de comercios, campañas de retail popular y demostraciones en vivo a tenderos.',
    x: 4.4,
    z: 3.8,
    color: '#00FF87',
    badge: 'Ventas',
    icon: '🎯',
    skinTone: '#e0ac69',
    hairColor: '#2b2d42',
    accentColor: '#00FF87',
  },
  {
    id: 'cerebro',
    name: 'Cerebro Zenic IA',
    role: 'Núcleo Cognitivo',
    desk: 'Cámara Central',
    officeName: 'Núcleo Neural',
    description: 'Agente autónomo con 28 documentos neuronales y grafo sináptico empresarial en tiempo real.',
    x: 0,
    z: 0,
    color: '#FF007F',
    badge: '28 Docs',
    icon: '🧠',
    skinTone: '#00E5FF',
    hairColor: '#FF007F',
    accentColor: '#FF007F',
  },
]

export default function Office3DPreview({ darkMode = true, onSelectStation = null, onLaunchOffice = null }) {
  const containerRef = useRef(null)
  const [selectedStation, setSelectedStation] = useState(null)
  const [hoveredStation, setHoveredStation] = useState(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [zoomLevel, setZoomLevel] = useState(9)

  const controlsRef = useRef({
    rotateTo: null,
    resetView: null,
    zoom: null,
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Camera (Isometric perspective)
    const scene = new THREE.Scene()
    const aspect = width / height
    let d = 9
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000)
    camera.position.set(22, 22, 22)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(darkMode ? 0x223355 : 0x8899aa, 1.4)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, darkMode ? 1.6 : 1.9)
    dirLight.position.set(16, 26, 12)
    dirLight.castShadow = true
    scene.add(dirLight)

    // CEO Marlon - Warm Radiant Gold Light
    const goldLight = new THREE.PointLight(0xffb703, 3.8, 25)
    goldLight.position.set(-4.4, 5, -3.8)
    scene.add(goldLight)

    // Admin Jhon - Crisp Cyan Light
    const cyanLight = new THREE.PointLight(0x00e5ff, 2.8, 25)
    cyanLight.position.set(4.4, 5, -3.8)
    scene.add(cyanLight)

    // CTO Miguel - Electric Tech Purple Light
    const purpleLight = new THREE.PointLight(0xc084fc, 3.2, 25)
    purpleLight.position.set(-4.4, 5, 3.8)
    scene.add(purpleLight)

    // CMO Santiago - Emerald Retail Light
    const greenLight = new THREE.PointLight(0x00ff87, 2.8, 25)
    greenLight.position.set(4.4, 5, 3.8)
    scene.add(greenLight)

    // Central Cerebro Core - Glowing Magenta Light
    const pinkCoreLight = new THREE.PointLight(0xff007f, 4.5, 18)
    pinkCoreLight.position.set(0, 3.5, 0)
    scene.add(pinkCoreLight)

    // ── LUXURY ARCHITECTURAL FLOOR (Procedural Designer Porcelain Tiles) ──
    const createFloorCanvas = (isDark) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 1024
      const c = canvas.getContext('2d')

      // Main dark porcelain / slate background
      c.fillStyle = isDark ? '#0b1320' : '#e6edf5'
      c.fillRect(0, 0, 1024, 1024)

      // Large format 128px tiles (8x8)
      const ts = 128
      for (let tx = 0; tx < 1024; tx += ts) {
        for (let ty = 0; ty < 1024; ty += ts) {
          const n = (Math.sin(tx * 0.05 + ty * 0.03) + 1) * 0.5
          const baseV = isDark ? 14 + n * 8 : 238 + n * 6
          c.fillStyle = `rgb(${baseV}, ${baseV + (isDark ? 4 : 2)}, ${baseV + (isDark ? 9 : 4)})`
          c.fillRect(tx + 2, ty + 2, ts - 4, ts - 4)

          // Soft diagonal sheen gradient
          const g = c.createLinearGradient(tx, ty, tx + ts, ty + ts)
          g.addColorStop(0, 'rgba(255,255,255,0.04)')
          g.addColorStop(0.5, 'rgba(255,255,255,0.01)')
          g.addColorStop(1, isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.05)')
          c.fillStyle = g
          c.fillRect(tx + 2, ty + 2, ts - 4, ts - 4)

          // Bevel grout border
          c.strokeStyle = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(203, 213, 225, 0.7)'
          c.lineWidth = 1
          c.strokeRect(tx + 1.5, ty + 1.5, ts - 3, ts - 3)
        }
      }

      // Polished micro-dots pattern on tile corners
      c.fillStyle = isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(100, 116, 139, 0.3)'
      for (let tx = 0; tx <= 1024; tx += ts) {
        for (let ty = 0; ty <= 1024; ty += ts) {
          c.beginPath()
          c.arc(tx, ty, 2, 0, Math.PI * 2)
          c.fill()
        }
      }

      return canvas
    }

    const floorTexture = new THREE.CanvasTexture(createFloorCanvas(darkMode))
    floorTexture.wrapS = THREE.RepeatWrapping
    floorTexture.wrapT = THREE.RepeatWrapping
    floorTexture.repeat.set(3, 3)

    const floorGeo = new THREE.BoxGeometry(19, 0.4, 17)
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTexture,
      roughness: 0.22,
      metalness: 0.35,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -0.2
    floor.receiveShadow = true
    scene.add(floor)

    // Architectural Perimeter Edge Trim (Dark bronze/gunmetal chamfered rim)
    const perimeterTrim = new THREE.Mesh(
      new THREE.BoxGeometry(19.25, 0.1, 17.25),
      new THREE.MeshStandardMaterial({ color: darkMode ? 0x0f172a : 0x94a3b8, metalness: 0.7, roughness: 0.3 })
    )
    perimeterTrim.position.y = -0.05
    scene.add(perimeterTrim)

    // Glowing Neon Floor Guide Trim (Cross corridors)
    const corridorMat = new THREE.MeshBasicMaterial({
      color: darkMode ? 0x00e5ff : 0x38bdf8,
      transparent: true,
      opacity: darkMode ? 0.35 : 0.5,
    })
    const hHallwayLine = new THREE.Mesh(new THREE.BoxGeometry(18.2, 0.005, 0.08), corridorMat)
    hHallwayLine.position.set(0, 0.015, 0)
    scene.add(hHallwayLine)
    const vHallwayLine = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.005, 16.2), corridorMat)
    vHallwayLine.position.set(0, 0.015, 0)
    scene.add(vHallwayLine)

    // Floor Grid pattern with subtle opacity
    const grid = new THREE.GridHelper(18, 18, darkMode ? 0x38bdf8 : 0x0284c7, darkMode ? 0x1e293b : 0xe2e8f0)
    grid.position.y = 0.02
    grid.material.opacity = darkMode ? 0.25 : 0.35
    grid.material.transparent = true
    scene.add(grid)

    // ── PERIMETER GLASS WALLS ──
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0x00e5ff : 0x9c4dcc,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      transmission: 0.75,
    })

    const wallFrameMat = new THREE.MeshStandardMaterial({
      color: darkMode ? 0x1e293b : 0x64748b,
      metalness: 0.7,
      roughness: 0.35,
    })

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(19, 2.8, 0.2), glassMat)
    backWall.position.set(0, 1.4, -8.5)
    scene.add(backWall)

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.8, 17), glassMat)
    leftWall.position.set(-9.5, 1.4, 0)
    scene.add(leftWall)

    // ── ARCHITECTURAL OFFICE DIVISIONS (Modular Suites with Frosted Modesty Strips) ──
    const interiorGlassMat = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0x38bdf8 : 0xc084fc,
      transparent: true,
      opacity: 0.3,
      roughness: 0.15,
      transmission: 0.65,
    })

    const frostedMat = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0xa5f3fc : 0xe0e7ff,
      transparent: true,
      opacity: darkMode ? 0.45 : 0.6,
      roughness: 0.6,
    })

    const buildWall = (w, h, d, x, y, z) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), interiorGlassMat)
      mesh.position.set(x, y, z)
      scene.add(mesh)

      // Frosted privacy strip at waist/eye level
      const frostedBand = new THREE.Mesh(new THREE.BoxGeometry(w, 0.55, d + 0.015), frostedMat)
      frostedBand.position.set(x, 1.05, z)
      scene.add(frostedBand)

      // Baseboard trim
      const trim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d + 0.02), wallFrameMat)
      trim.position.set(x, 0.04, z)
      scene.add(trim)
      // Top header trim
      const topTrim = new THREE.Mesh(new THREE.BoxGeometry(w, 0.06, d + 0.02), wallFrameMat)
      topTrim.position.set(x, h + 0.03, z)
      scene.add(topTrim)
    }

    // Horizontal Office Separators leaving center open
    buildWall(4.2, 2.2, 0.12, -5.5, 1.1, -1.2)
    buildWall(4.2, 2.2, 0.12, 5.5, 1.1, -1.2)
    buildWall(4.2, 2.2, 0.12, -5.5, 1.1, 1.2)
    buildWall(4.2, 2.2, 0.12, 5.5, 1.1, 1.2)

    // Vertical Office Separators
    buildWall(0.12, 2.2, 4.4, -2.2, 1.1, -5.0)
    buildWall(0.12, 2.2, 4.4, 2.2, 1.1, -5.0)
    buildWall(0.12, 2.2, 4.4, -2.2, 1.1, 5.0)
    buildWall(0.12, 2.2, 4.4, 2.2, 1.1, 5.0)

    // Modern Corridor Water Cooler & Hydration Station
    const waterCooler = new THREE.Group()
    const coolerBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.85, 0.38),
      new THREE.MeshStandardMaterial({ color: darkMode ? 0x1e293b : 0xf1f5f9, roughness: 0.3 })
    )
    coolerBase.position.y = 0.425
    waterCooler.add(coolerBase)
    const coolerBottle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.4, 16),
      new THREE.MeshPhysicalMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.65, roughness: 0.1 })
    )
    coolerBottle.position.y = 1.05
    waterCooler.add(coolerBottle)
    waterCooler.position.set(2.0, 0, 1.8)
    scene.add(waterCooler)

    // ── SYNAPSE LIGHT PATHS (Floor circuits leading from Brain Core to each Office) ──
    DESK_STATIONS.filter((s) => s.id !== 'cerebro').forEach((st) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.04, 0),
        new THREE.Vector3(st.x * 0.45, 0.04, st.z * 0.45),
        new THREE.Vector3(st.x, 0.04, st.z),
      ])
      const lineMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(st.color),
        transparent: true,
        opacity: darkMode ? 0.7 : 0.85,
        linewidth: 2,
      })
      const pathLine = new THREE.Line(lineGeo, lineMat)
      scene.add(pathLine)
    })

    // ── CENTRAL PLAZA BRAIN PEDESTAL ──
    const centralDais = new THREE.Mesh(
      new THREE.CylinderGeometry(2.3, 2.5, 0.18, 32),
      new THREE.MeshStandardMaterial({
        color: darkMode ? 0x140d28 : 0xf3e8ff,
        metalness: 0.6,
        roughness: 0.25,
      })
    )
    centralDais.position.set(0, 0.09, 0)
    scene.add(centralDais)

    const daisBorder = new THREE.Mesh(
      new THREE.RingGeometry(2.3, 2.45, 32),
      new THREE.MeshBasicMaterial({ color: 0xff007f, side: THREE.DoubleSide })
    )
    daisBorder.rotation.x = -Math.PI / 2
    daisBorder.position.set(0, 0.19, 0)
    scene.add(daisBorder)

    // Concentric glowing inner ring
    const daisInnerRing = new THREE.Mesh(
      new THREE.RingGeometry(1.6, 1.72, 32),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 })
    )
    daisInnerRing.rotation.x = -Math.PI / 2
    daisInnerRing.position.set(0, 0.195, 0)
    scene.add(daisInnerRing)

    // ── CHARACTER BUILDER (SITTING AGENTS WITH DIRECTOR TIE ACCENTS) ──
    const createSittingAgent = (colorHex, skinToneHex, hairColorHex, isCeo = false) => {
      const agentGroup = new THREE.Group()

      // Torso / Suit jacket or director shirt
      const torso = new THREE.Mesh(
        new THREE.BoxGeometry(0.44, 0.52, 0.28),
        new THREE.MeshStandardMaterial({
          color: isCeo ? 0x0f172a : new THREE.Color(colorHex),
          roughness: 0.45,
        })
      )
      torso.position.set(0, 0.94, 0.72)
      torso.castShadow = true
      agentGroup.add(torso)

      // Golden tie or director accent tie
      const tie = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.28, 0.02),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(colorHex),
          roughness: 0.3,
          metalness: isCeo ? 0.8 : 0.2,
        })
      )
      tie.position.set(0, 0.98, 0.57)
      agentGroup.add(tie)

      // Neck
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.09, 0.1),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(skinToneHex), roughness: 0.6 })
      )
      neck.position.set(0, 1.22, 0.72)
      agentGroup.add(neck)

      // Head
      const head = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.32, 0.3),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(skinToneHex), roughness: 0.6 })
      )
      head.position.set(0, 1.38, 0.72)
      head.castShadow = true
      agentGroup.add(head)

      // Hair
      const hair = new THREE.Mesh(
        new THREE.BoxGeometry(0.34, 0.14, 0.34),
        new THREE.MeshStandardMaterial({ color: new THREE.Color(hairColorHex), roughness: 0.7 })
      )
      hair.position.set(0, 1.5, 0.71)
      agentGroup.add(hair)

      // Arms typing towards desk
      const armMat = new THREE.MeshStandardMaterial({
        color: isCeo ? 0x0f172a : new THREE.Color(colorHex),
        roughness: 0.5,
      })
      const handMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(skinToneHex) })
      const leftArm = new THREE.Group()
      const rightArm = new THREE.Group()

      for (const sx of [-1, 1]) {
        const armRoot = sx === -1 ? leftArm : rightArm
        const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.28, 0.1), armMat)
        upperArm.position.set(sx * 0.28, 0.96, 0.64)
        upperArm.rotation.x = -Math.PI / 4.5
        upperArm.rotation.z = sx * 0.1
        armRoot.add(upperArm)

        const foreArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.24, 0.09), handMat)
        foreArm.position.set(sx * 0.22, 0.88, 0.44)
        foreArm.rotation.x = -Math.PI / 2
        armRoot.add(foreArm)
        agentGroup.add(armRoot)
      }

      // Legs sitting on chair (bent at 90 degrees)
      const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
      for (const sx of [-1, 1]) {
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.12, 0.42), pantsMat)
        thigh.position.set(sx * 0.14, 0.62, 0.52)
        agentGroup.add(thigh)

        const calf = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.36, 0.12), pantsMat)
        calf.position.set(sx * 0.14, 0.38, 0.32)
        agentGroup.add(calf)

        const shoe = new THREE.Mesh(
          new THREE.BoxGeometry(0.13, 0.08, 0.2),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 })
        )
        shoe.position.set(sx * 0.14, 0.04, 0.35)
        agentGroup.add(shoe)
      }

      return { root: agentGroup, head, leftArm, rightArm }
    }

    // ── DECORATIVE ELEMENTS PER SUITE (Luxury Rugs, Plants, Executive Credenzas, Art & Lounge) ──
    const addDecor = (st) => {
      if (st.id === 'cerebro') return

      // 1. Executive Suite Designer Rug with contrasting stitched borders
      const rugGroup = new THREE.Group()
      const rugBase = new THREE.Mesh(
        new THREE.BoxGeometry(4.0, 0.02, 3.6),
        new THREE.MeshStandardMaterial({
          color: darkMode ? 0x111827 : 0xf1f5f9,
          roughness: 0.85,
        })
      )
      rugBase.position.y = 0.01
      rugGroup.add(rugBase)

      // Outer accent border in director color
      const rugBorder = new THREE.Mesh(
        new THREE.RingGeometry(1.6, 1.75, 4),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color(st.color),
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        })
      )
      rugBorder.rotation.x = -Math.PI / 2
      rugBorder.rotation.z = Math.PI / 4
      rugBorder.scale.set(1.5, 1.4, 1)
      rugBorder.position.y = 0.022
      rugGroup.add(rugBorder)

      // Inner woven motif
      const innerBorder = new THREE.Mesh(
        new THREE.BoxGeometry(3.6, 0.005, 3.2),
        new THREE.MeshStandardMaterial({
          color: new THREE.Color(st.color),
          transparent: true,
          opacity: darkMode ? 0.2 : 0.28,
          roughness: 0.9,
        })
      )
      innerBorder.position.y = 0.018
      rugGroup.add(innerBorder)

      rugGroup.position.set(st.x, 0, st.z)
      scene.add(rugGroup)

      // 2. High-End Executive Credenza & Bookshelf against rear partition wall
      const credenzaZ = st.z > 0 ? st.z + 1.6 : st.z - 1.6
      const credenzaGroup = new THREE.Group()

      const credenzaBody = new THREE.Mesh(
        new THREE.BoxGeometry(2.4, 0.85, 0.42),
        new THREE.MeshStandardMaterial({
          color: darkMode ? 0x1e293b : 0x475569,
          roughness: 0.35,
          metalness: 0.3,
        })
      )
      credenzaBody.position.y = 0.425
      credenzaGroup.add(credenzaBody)

      const credenzaTop = new THREE.Mesh(
        new THREE.BoxGeometry(2.46, 0.04, 0.46),
        new THREE.MeshStandardMaterial({
          color: darkMode ? 0x0f172a : 0xf8fafc,
          roughness: 0.2,
          metalness: 0.5,
        })
      )
      credenzaTop.position.y = 0.87
      credenzaGroup.add(credenzaTop)

      // Hardcover books and binders
      const bookColors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
      for (let b = -0.9; b <= -0.2; b += 0.09) {
        const bookH = 0.22 + (Math.sin(b * 10) * 0.5 + 0.5) * 0.06
        const bCol = bookColors[Math.floor(Math.abs(b * 10)) % bookColors.length]
        const book = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, bookH, 0.26),
          new THREE.MeshStandardMaterial({ color: bCol, roughness: 0.5 })
        )
        book.position.set(b, 0.87 + bookH / 2, 0.02)
        credenzaGroup.add(book)
      }

      const folderStack = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.08, 0.26),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 })
      )
      folderStack.position.set(-0.02, 0.87 + 0.04, 0.02)
      credenzaGroup.add(folderStack)

      // Signature Prop per Director
      if (st.id === 'ceo') {
        // 🏆 Marlon's Golden Trophy Cup & Gold Diploma
        const trophyGroup = new THREE.Group()
        const trophyMat = new THREE.MeshStandardMaterial({ color: 0xffb703, metalness: 0.9, roughness: 0.2 })
        const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.08, 12), new THREE.MeshStandardMaterial({ color: 0x1e293b }))
        trophyGroup.add(pedestal)
        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.14, 8), trophyMat)
        stem.position.y = 0.11
        trophyGroup.add(stem)
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.04, 0.15, 12), trophyMat)
        cup.position.y = 0.22
        trophyGroup.add(cup)
        trophyGroup.position.set(0.65, 0.89, 0)
        credenzaGroup.add(trophyGroup)

        // Framed Gold Leadership Award
        const frame = new THREE.Mesh(
          new THREE.BoxGeometry(0.9, 0.6, 0.04),
          new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 })
        )
        frame.position.set(st.x, 1.8, st.z > 0 ? st.z + 1.75 : st.z - 1.75)
        scene.add(frame)
        const frameInner = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, 0.52, 0.045),
          new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.4 })
        )
        frameInner.position.set(st.x, 1.8, st.z > 0 ? st.z + 1.75 : st.z - 1.75)
        scene.add(frameInner)
      } else if (st.id === 'admin') {
        const posUnit = new THREE.Mesh(
          new THREE.BoxGeometry(0.24, 0.14, 0.28),
          new THREE.MeshStandardMaterial({ color: 0x00e5ff, roughness: 0.3 })
        )
        posUnit.position.set(0.6, 0.94, 0)
        credenzaGroup.add(posUnit)
      } else if (st.id === 'cto') {
        const serverChassis = new THREE.Mesh(
          new THREE.BoxGeometry(0.35, 0.45, 0.3),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 })
        )
        serverChassis.position.set(0.65, 0.87 + 0.225, 0)
        credenzaGroup.add(serverChassis)
        for (let l = 0; l < 4; l++) {
          const led = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.02, 0.02),
            new THREE.MeshBasicMaterial({ color: l % 2 === 0 ? 0x00e5ff : 0xc084fc })
          )
          led.position.set(0.55 + (l % 2) * 0.08, 0.95 + Math.floor(l / 2) * 0.08, 0.16)
          credenzaGroup.add(led)
        }
      } else if (st.id === 'cmo') {
        const displayBox = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.24, 0.25),
          new THREE.MeshStandardMaterial({ color: 0x00ff87, roughness: 0.4 })
        )
        displayBox.position.set(0.65, 0.99, 0)
        credenzaGroup.add(displayBox)
      }

      credenzaGroup.position.set(st.x, 0, credenzaZ)
      scene.add(credenzaGroup)

      // 3. Botanical Plant with fluted ceramic pot and lush leaves
      const plantGroup = new THREE.Group()
      const saucer = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.26, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: darkMode ? 0xd4af37 : 0x94a3b8, metalness: 0.6 })
      )
      saucer.position.y = 0.02
      plantGroup.add(saucer)

      const pot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.16, 0.52, 16),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
      )
      pot.position.y = 0.28
      plantGroup.add(pot)

      const soil = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16),
        new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.9 })
      )
      soil.position.y = 0.52
      plantGroup.add(soil)

      const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.5 })
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.7 })

      for (let i = 0; i < 7; i++) {
        const angle = (i / 7) * Math.PI * 2
        const rad = 0.16 + (i % 2) * 0.08
        const leafH = 0.65 + (i % 3) * 0.12

        const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.015, leafH - 0.45, 6), stemMat)
        stem.position.set(Math.cos(angle) * 0.05, 0.5 + (leafH - 0.5) / 2, Math.sin(angle) * 0.05)
        stem.rotation.z = Math.cos(angle) * 0.35
        stem.rotation.x = Math.sin(angle) * 0.35
        plantGroup.add(stem)

        const leaf = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18, 1), leafMat)
        leaf.scale.set(0.7, 1.4, 0.3)
        leaf.position.set(Math.cos(angle) * rad, leafH, Math.sin(angle) * rad)
        leaf.rotation.y = angle
        leaf.rotation.x = 0.4
        plantGroup.add(leaf)
      }

      const px = st.x > 0 ? st.x + 1.85 : st.x - 1.85
      const pz = st.z > 0 ? st.z + 1.6 : st.z - 1.6
      plantGroup.position.set(px, 0, pz)
      scene.add(plantGroup)

      // 4. Executive Visitor Armchair & Side Table in corner
      const loungeGroup = new THREE.Group()
      const chairCloth = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x1e293b : 0x64748b,
        roughness: 0.7,
      })
      const vSeat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.14, 0.6), chairCloth)
      vSeat.position.set(0, 0.38, 0)
      loungeGroup.add(vSeat)
      const vBack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.55, 0.14), chairCloth)
      vBack.position.set(0, 0.65, 0.25)
      loungeGroup.add(vBack)
      for (const ax of [-0.32, 0.32]) {
        const vArm = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.38, 0.55), chairCloth)
        vArm.position.set(ax, 0.52, 0)
        loungeGroup.add(vArm)
      }
      const vLegMat = new THREE.MeshStandardMaterial({ color: 0x92400e })
      for (const lx of [-0.26, 0.26]) {
        for (const lz of [-0.26, 0.26]) {
          const vLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 0.32, 8), vLegMat)
          vLeg.position.set(lx, 0.16, lz)
          loungeGroup.add(vLeg)
        }
      }

      const sideTable = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.24, 0.03, 16),
        new THREE.MeshStandardMaterial({ color: darkMode ? 0xd4af37 : 0xcbd5e1, metalness: 0.4 })
      )
      sideTable.position.set(-0.55, 0.42, 0)
      loungeGroup.add(sideTable)
      const tablePole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.4, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155 })
      )
      tablePole.position.set(-0.55, 0.2, 0)
      loungeGroup.add(tablePole)

      const lx = st.x > 0 ? st.x + 1.4 : st.x - 1.4
      const lz = st.z > 0 ? st.z - 1.1 : st.z + 1.1
      loungeGroup.position.set(lx, 0, lz)
      loungeGroup.rotation.y = st.x > 0 ? -Math.PI / 4 : Math.PI / 4
      scene.add(loungeGroup)
    }

    // ── BUILD STATIONS & AGENTS ──
    const deskGroup = new THREE.Group()
    const deskMeshMap = []
    const raycastableMeshes = []
    const animatedAgents = []

    DESK_STATIONS.forEach((st) => {
      const isCentral = st.id === 'cerebro'
      const group = new THREE.Group()
      group.position.set(st.x, 0, st.z)

      // Add furniture decor for suites
      addDecor(st)

      // Desk Table
      const tableGeo = new THREE.BoxGeometry(isCentral ? 2.6 : 2.3, 0.12, isCentral ? 2.6 : 1.35)
      const tableMat = new THREE.MeshStandardMaterial({
        color: isCentral ? (darkMode ? 0x1e1035 : 0xf3e8ff) : darkMode ? 0x0e1726 : 0xf8fafc,
        roughness: 0.25,
        metalness: 0.45,
      })
      const table = new THREE.Mesh(tableGeo, tableMat)
      table.position.y = 1.0
      table.castShadow = true
      table.receiveShadow = true
      group.add(table)

      // Desk modesty panel & accessories
      if (!isCentral) {
        const modestyPanel = new THREE.Mesh(
          new THREE.BoxGeometry(2.1, 0.58, 0.04),
          new THREE.MeshStandardMaterial({ color: darkMode ? 0x1e293b : 0xcbd5e1, roughness: 0.4 })
        )
        modestyPanel.position.set(0, 0.65, -0.62)
        group.add(modestyPanel)

        // Large leather desk mat
        const deskMat = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.015, 0.6),
          new THREE.MeshStandardMaterial({ color: darkMode ? 0x0b0f19 : 0x334155, roughness: 0.8 })
        )
        deskMat.position.set(0, 1.065, 0.05)
        group.add(deskMat)

        // Modern Architect Desk Lamp
        const lampGroup = new THREE.Group()
        const lampMat = new THREE.MeshStandardMaterial({ color: darkMode ? 0xd4af37 : 0x475569, metalness: 0.7 })
        lampGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.02, 12), lampMat))
        const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8), lampMat)
        lampArm.position.set(-0.06, 0.18, 0)
        lampArm.rotation.z = -0.3
        lampGroup.add(lampArm)
        const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.08, 12), lampMat)
        lampShade.position.set(-0.12, 0.33, 0)
        lampShade.rotation.z = 0.5
        lampGroup.add(lampShade)
        const lampGlow = new THREE.Mesh(
          new THREE.SphereGeometry(0.025, 8, 8),
          new THREE.MeshBasicMaterial({ color: 0xffedd5 })
        )
        lampGlow.position.set(-0.12, 0.3, 0)
        lampGroup.add(lampGlow)
        lampGroup.position.set(-0.85, 1.06, -0.2)
        group.add(lampGroup)

        // Coffee Mug on desk
        const mug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.045, 0.04, 0.09, 12),
          new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
        )
        mug.position.set(0.75, 1.11, -0.1)
        group.add(mug)
      }

      // Desk Legs
      const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.0)
      const legMat = new THREE.MeshStandardMaterial({ color: darkMode ? 0x334155 : 0x94a3b8, metalness: 0.6 })
      const legOffsets = isCentral
        ? [
            [-1.1, -1.1],
            [1.1, -1.1],
            [-1.1, 1.1],
            [1.1, 1.1],
          ]
        : [
            [-0.98, -0.52],
            [0.98, -0.52],
            [-0.98, 0.52],
            [0.98, 0.52],
          ]

      legOffsets.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, 0.5, lz)
        group.add(leg)
      })

      // Dual Widescreen Curved Monitors Setup
      if (!isCentral) {
        // Main Curved Widescreen Display
        const mainScreenFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.85, 0.44, 0.03),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 })
        )
        mainScreenFrame.position.set(-0.15, 1.35, -0.25)
        mainScreenFrame.rotation.x = -0.08
        group.add(mainScreenFrame)

        const screenFace = new THREE.Mesh(
          new THREE.BoxGeometry(0.81, 0.4, 0.005),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(st.color) })
        )
        screenFace.position.set(-0.15, 1.35, -0.23)
        screenFace.rotation.x = -0.08
        group.add(screenFace)
        group.userData.screen = screenFace

        // Secondary Vertical Coding / Metrics Monitor
        const secScreenFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.48, 0.03),
          new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7 })
        )
        secScreenFrame.position.set(0.48, 1.37, -0.22)
        secScreenFrame.rotation.y = -0.32
        secScreenFrame.rotation.x = -0.08
        group.add(secScreenFrame)

        const secScreenFace = new THREE.Mesh(
          new THREE.BoxGeometry(0.28, 0.45, 0.005),
          new THREE.MeshBasicMaterial({ color: new THREE.Color(st.color) })
        )
        secScreenFace.position.set(0.48, 1.37, -0.2)
        secScreenFace.rotation.y = -0.32
        secScreenFace.rotation.x = -0.08
        group.add(secScreenFace)

        // Articulated Monitor Desk Mount
        const standBase = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.09, 0.02, 12),
          new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 })
        )
        standBase.position.set(0, 1.07, -0.28)
        group.add(standBase)
        const standPole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.32, 8),
          new THREE.MeshStandardMaterial({ color: 0x64748b, metalness: 0.9 })
        )
        standPole.position.set(0, 1.22, -0.28)
        group.add(standPole)

        // Keyboard & Mouse
        const keyboard = new THREE.Mesh(
          new THREE.BoxGeometry(0.42, 0.015, 0.14),
          new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4 })
        )
        keyboard.position.set(-0.05, 1.07, 0.12)
        group.add(keyboard)

        const mouse = new THREE.Mesh(
          new THREE.BoxGeometry(0.07, 0.02, 0.1),
          new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 })
        )
        mouse.position.set(0.26, 1.07, 0.12)
        group.add(mouse)
      }

      // Ergonomic Executive Chair
      const chairMat = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x0f172a : 0x334155,
        roughness: 0.4,
      })
      const chairAccentMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(st.color),
        roughness: 0.4,
      })
      const chairGroup = new THREE.Group()
      const chairBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.28, 8), chairMat)
      chairBase.position.y = 0.16
      chairGroup.add(chairBase)
      for (let w = 0; w < 5; w++) {
        const rad = (w / 5) * Math.PI * 2
        const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.34), chairMat)
        spoke.position.set(Math.sin(rad) * 0.15, 0.06, Math.cos(rad) * 0.15)
        spoke.rotation.y = rad
        chairGroup.add(spoke)
      }
      const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.09, 0.62), chairMat)
      chairSeat.position.set(0, 0.58, 0)
      chairGroup.add(chairSeat)
      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.68, 0.07), chairMat)
      chairBack.position.set(0, 0.98, 0.28)
      chairBack.rotation.x = 0.08
      chairGroup.add(chairBack)
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.06), chairAccentMat)
      headrest.position.set(0, 1.38, 0.32)
      chairGroup.add(headrest)
      for (const ax of [-0.34, 0.34]) {
        const armPost = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 6), chairMat)
        armPost.position.set(ax, 0.68, 0)
        chairGroup.add(armPost)
        const armPad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.32), chairMat)
        armPad.position.set(ax, 0.79, 0)
        chairGroup.add(armPad)
      }
      chairGroup.position.set(0, 0, 0.75)
      group.add(chairGroup)

      // ── SITTING AGENT (Only for the 4 human directors; Central Core has Neural Orb) ──
      if (!isCentral) {
        const agent = createSittingAgent(st.color, st.skinTone, st.hairColor, st.id === 'ceo')
        group.add(agent.root)
        animatedAgents.push({ id: st.id, ...agent })
      }

      // Central Hologram / Brain Orb if central station
      if (isCentral) {
        const orbGeo = new THREE.IcosahedronGeometry(0.65, 2)
        const orbMat = new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0xff007f,
          emissiveIntensity: 0.9,
          wireframe: true,
        })
        const orb = new THREE.Mesh(orbGeo, orbMat)
        orb.position.y = 1.9
        group.add(orb)
        group.userData.orb = orb

        // Additional rotating neural gyro rings
        const gyroGeo = new THREE.TorusGeometry(0.9, 0.02, 8, 32)
        const gyroMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.7 })
        const gyro = new THREE.Mesh(gyroGeo, gyroMat)
        gyro.position.y = 1.9
        group.add(gyro)
        group.userData.gyro = gyro
      }

      // Floating Marker Beacon
      const beaconGeo = new THREE.ConeGeometry(0.22, 0.45, 4)
      const beaconMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(st.color) })
      const beacon = new THREE.Mesh(beaconGeo, beaconMat)
      beacon.rotation.x = Math.PI
      beacon.position.set(0, 2.5, 0)
      group.add(beacon)
      group.userData.beacon = beacon

      // Glowing Base Ring (Pulsing ground ring)
      const ringGeo = new THREE.RingGeometry(isCentral ? 1.6 : 1.25, isCentral ? 1.75 : 1.38, 32)
      ringGeo.rotateX(-Math.PI / 2)
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(st.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.45,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.y = 0.04
      group.add(ring)
      group.userData.ring = ring

      // Invisible Click/Hover Hitbox (Raycast target)
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(isCentral ? 3.4 : 2.8, 3.2, isCentral ? 3.4 : 2.5),
        new THREE.MeshBasicMaterial({ visible: false })
      )
      hitBox.position.y = 1.5
      hitBox.userData.station = st
      hitBox.userData.group = group
      group.add(hitBox)
      raycastableMeshes.push(hitBox)

      group.userData.station = st
      deskGroup.add(group)
      deskMeshMap.push(group)
    })

    scene.add(deskGroup)

    // Ambient floating particles
    const particleCount = 140
    const particleGeo = new THREE.BufferGeometry()
    const posArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 19
      posArray[i + 1] = Math.random() * 5 + 0.5
      posArray[i + 2] = (Math.random() - 0.5) * 17
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.13,
      color: darkMode ? 0x00e5ff : 0x9c4dcc,
      transparent: true,
      opacity: 0.75,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // Raycasting & Interaction State
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2(-999, -999)
    let hoveredGroup = null

    // Orbit & Drag rotation variables
    let isDragging = false
    let prevPointerX = 0
    let prevPointerY = 0
    let targetRotationY = 0
    let currentRotationY = 0
    let targetCameraPos = new THREE.Vector3(22, 22, 22)
    let targetLookAt = new THREE.Vector3(0, 0, 0)
    let currentLookAt = new THREE.Vector3(0, 0, 0)

    // Pointer events
    const onPointerDown = (e) => {
      isDragging = true
      prevPointerX = e.clientX
      prevPointerY = e.clientY
    }

    const onPointerMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1
      mouse.y = -(((e.clientY - rect.top) / height) * 2 - 1)

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX
        prevPointerX = e.clientX
        targetRotationY += deltaX * 0.008
      }
    }

    const onPointerUp = () => {
      isDragging = false
    }

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(raycastableMeshes, true)
      if (intersects.length > 0) {
        const station = intersects[0].object.userData.station
        if (station) {
          setSelectedStation(station)
          if (onSelectStation) onSelectStation(station)
          targetLookAt.set(station.x, 1, station.z)
          targetCameraPos.set(station.x + 14, 15, station.z + 14)
        }
      }
    }

    const onWheel = (e) => {
      e.preventDefault()
      const zoomDelta = e.deltaY * 0.005
      d = Math.max(5, Math.min(14, d + zoomDelta))
      setZoomLevel(d)
      updateCameraAspect()
    }

    container.addEventListener('pointerdown', onPointerDown)
    container.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    container.addEventListener('click', onClick)
    container.addEventListener('wheel', onWheel, { passive: false })

    const updateCameraAspect = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      const asp = w / h
      camera.left = -d * asp
      camera.right = d * asp
      camera.top = d
      camera.bottom = -d
      camera.updateProjectionMatrix()
    }

    // Controls exposed to React UI
    controlsRef.current.rotateTo = (station) => {
      setSelectedStation(station)
      if (station) {
        targetLookAt.set(station.x, 1, station.z)
        targetCameraPos.set(station.x + 14, 15, station.z + 14)
      } else {
        targetLookAt.set(0, 0, 0)
        targetCameraPos.set(22, 22, 22)
      }
    }

    controlsRef.current.resetView = () => {
      setSelectedStation(null)
      targetLookAt.set(0, 0, 0)
      targetCameraPos.set(22, 22, 22)
      targetRotationY = 0
      d = 9
      setZoomLevel(9)
      updateCameraAspect()
    }

    controlsRef.current.zoom = (inOut) => {
      d = Math.max(5, Math.min(14, inOut === 'in' ? d - 1.5 : d + 1.5))
      setZoomLevel(d)
      updateCameraAspect()
    }

    // Animation Loop
    let frameId
    let clock = { last: performance.now() }

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const now = performance.now()
      const delta = (now - clock.last) * 0.001
      clock.last = now

      // Auto rotation when idle
      if (autoRotate && !isDragging && !selectedStation) {
        targetRotationY += 0.0018
      }

      // Inertia & rotation smoothing
      currentRotationY += (targetRotationY - currentRotationY) * 0.08
      scene.rotation.y = currentRotationY

      // Smooth camera position and lookAt interpolation
      camera.position.lerp(targetCameraPos, 0.05)
      currentLookAt.lerp(targetLookAt, 0.05)
      camera.lookAt(currentLookAt)

      // Raycasting hover check
      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObjects(raycastableMeshes, true)

      if (intersects.length > 0) {
        const foundStation = intersects[0].object.userData.station
        if (hoveredGroup !== intersects[0].object.userData.group) {
          hoveredGroup = intersects[0].object.userData.group
          setHoveredStation(foundStation)
          container.style.cursor = 'pointer'
        }
      } else {
        if (hoveredGroup !== null) {
          hoveredGroup = null
          setHoveredStation(null)
          container.style.cursor = isDragging ? 'grabbing' : 'grab'
        }
      }

      // Animate sitting agents (Subtle typing & head nod motion)
      animatedAgents.forEach((ag, i) => {
        if (ag.head) {
          ag.head.rotation.y = Math.sin(now * 0.002 + i) * 0.08
          ag.head.rotation.x = 0.05 + Math.sin(now * 0.003 + i) * 0.04
        }
        if (ag.leftArm && ag.rightArm) {
          ag.leftArm.rotation.x = -Math.PI / 4.5 + Math.sin(now * 0.012 + i * 2) * 0.03
          ag.rightArm.rotation.x = -Math.PI / 4.5 + Math.cos(now * 0.012 + i * 2) * 0.03
        }
      })

      // Animate floating beacons, rings & core
      deskMeshMap.forEach((grp, idx) => {
        const st = grp.userData.station
        const isHovered = hoveredStation && hoveredStation.id === st.id
        const isSelected = selectedStation && selectedStation.id === st.id

        if (grp.userData.beacon) {
          const baseHeight = isSelected || isHovered ? 2.6 : 2.4
          grp.userData.beacon.position.y = baseHeight + Math.sin(now * 0.004 + idx) * 0.18
          grp.userData.beacon.rotation.y += isSelected || isHovered ? 0.05 : 0.02
          const targetScale = isSelected || isHovered ? 1.4 : 1.0
          grp.userData.beacon.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
        }

        if (grp.userData.ring) {
          const pulse = 0.35 + Math.sin(now * 0.005 + idx) * 0.25
          grp.userData.ring.material.opacity = isSelected ? 0.9 : isHovered ? 0.7 : pulse
          const targetRingScale = isSelected ? 1.15 : isHovered ? 1.1 : 1.0
          grp.userData.ring.scale.lerp(new THREE.Vector3(targetRingScale, targetRingScale, targetRingScale), 0.1)
        }

        if (grp.userData.orb) {
          grp.userData.orb.rotation.y += 0.02
          grp.userData.orb.rotation.x += 0.01
        }

        if (grp.userData.gyro) {
          grp.userData.gyro.rotation.z += 0.015
          grp.userData.gyro.rotation.y += 0.008
        }
      })

      // Particle slow drift
      particleSystem.rotation.y += 0.0006

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      updateCameraAspect()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('pointerup', onPointerUp)
      container.removeEventListener('pointerdown', onPointerDown)
      container.removeEventListener('pointermove', onPointerMove)
      container.removeEventListener('click', onClick)
      container.removeEventListener('wheel', onWheel)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [darkMode, autoRotate])

  const handleStationClick = (st) => {
    setSelectedStation(st)
    if (controlsRef.current.rotateTo) {
      controlsRef.current.rotateTo(st)
    }
    if (onSelectStation) onSelectStation(st)
  }

  const handleReset = () => {
    setSelectedStation(null)
    if (controlsRef.current.resetView) {
      controlsRef.current.resetView()
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 440 }}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* ── TOP INTERACTIVE DOCK: STATION SELECTOR PILLS ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
          maxWidth: 'calc(100% - 240px)',
          zIndex: 10,
        }}
      >
        <button
          onClick={handleReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '0.35rem 0.75rem',
            borderRadius: 999,
            border: selectedStation === null ? '1.5px solid #00E5FF' : darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            background: selectedStation === null ? 'rgba(0, 229, 255, 0.25)' : darkMode ? 'rgba(7, 13, 20, 0.85)' : 'rgba(255, 255, 255, 0.85)',
            color: selectedStation === null ? '#00E5FF' : darkMode ? '#94A3B8' : '#64748B',
            fontSize: '0.72rem',
            fontWeight: 800,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
        >
          <Compass size={13} />
          <span>Vista General</span>
        </button>

        {DESK_STATIONS.map((st) => {
          const isSelected = selectedStation?.id === st.id
          return (
            <button
              key={st.id}
              onClick={() => handleStationClick(st)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '0.35rem 0.75rem',
                borderRadius: 999,
                border: isSelected ? `1.5px solid ${st.color}` : darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
                background: isSelected ? `${st.color}33` : darkMode ? 'rgba(7, 13, 20, 0.75)' : 'rgba(255, 255, 255, 0.85)',
                color: isSelected ? '#FFFFFF' : darkMode ? '#CBD5E1' : '#334155',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: isSelected ? `0 0 12px ${st.color}55` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{st.icon}</span>
              <span>{st.name.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      {/* ── TOP RIGHT CONTROLS: ROTATE / ZOOM & FULLSCREEN ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          zIndex: 10,
        }}
      >
        {/* Explorar en 3D Button */}
        <button
          onClick={() => {
            if (onLaunchOffice) onLaunchOffice('3d')
            else window.open('http://localhost:4600', '_blank')
          }}
          title="Entrar a la Oficina 3D Interactiva"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '0.42rem 0.85rem',
            borderRadius: 10,
            border: 'none',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.35), rgba(156, 77, 204, 0.45))',
            color: '#00E5FF',
            fontSize: '0.75rem',
            fontWeight: 800,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 14px rgba(0, 229, 255, 0.25)',
          }}
        >
          <Maximize2 size={13} />
          <span>Explorar en 3D</span>
        </button>

        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title={autoRotate ? 'Pausar auto-rotación' : 'Activar auto-rotación'}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: autoRotate ? 'rgba(0, 229, 255, 0.25)' : darkMode ? 'rgba(7, 13, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            border: autoRotate ? '1px solid #00E5FF' : darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            color: autoRotate ? '#00E5FF' : darkMode ? '#94A3B8' : '#64748B',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          <RotateCw size={14} style={{ animation: autoRotate ? 'spin 6s linear infinite' : 'none' }} />
        </button>

        <button
          onClick={() => controlsRef.current.zoom?.('in')}
          title="Acercar cámara"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: darkMode ? 'rgba(7, 13, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            color: darkMode ? '#CBD5E1' : '#334155',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ZoomIn size={14} />
        </button>

        <button
          onClick={() => controlsRef.current.zoom?.('out')}
          title="Alejar cámara"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: darkMode ? 'rgba(7, 13, 20, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            color: darkMode ? '#CBD5E1' : '#334155',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          <ZoomOut size={14} />
        </button>
      </div>

      {/* ── HOVER TOOLTIP CARD ── */}
      <AnimatePresence>
        {hoveredStation && !selectedStation && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            style={{
              position: 'absolute',
              top: 65,
              left: 20,
              zIndex: 12,
              pointerEvents: 'none',
              background: darkMode ? 'rgba(6, 12, 19, 0.94)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: 14,
              padding: '0.65rem 0.95rem',
              border: `1.5px solid ${hoveredStation.color}`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${hoveredStation.color}44`,
              maxWidth: 250,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '1.25rem' }}>{hoveredStation.icon}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: darkMode ? '#FFFFFF' : '#0F172A', lineHeight: 1.2 }}>
                  {hoveredStation.name}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: hoveredStation.color }}>
                  {hoveredStation.role}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.66rem', color: darkMode ? '#94A3B8' : '#64748B' }}>
              📍 {hoveredStation.desk} · <span style={{ color: '#00FF87', fontWeight: 800 }}>Clic para enfocar</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SELECTED STATION DETAIL MODAL CARD ── */}
      <AnimatePresence>
        {selectedStation && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              position: 'absolute',
              bottom: 14,
              left: 14,
              right: 14,
              zIndex: 15,
              background: darkMode ? 'rgba(6, 12, 20, 0.95)' : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(14px)',
              borderRadius: 18,
              padding: '1.1rem 1.3rem',
              border: `1.5px solid ${selectedStation.color}`,
              boxShadow: `0 15px 40px rgba(0,0,0,0.5), 0 0 25px ${selectedStation.color}44`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${selectedStation.color}22`,
                    border: `1px solid ${selectedStation.color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                  }}
                >
                  {selectedStation.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 900, color: darkMode ? '#FFFFFF' : '#0F172A' }}>
                      {selectedStation.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '0.66rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 999,
                        background: `${selectedStation.color}22`,
                        color: selectedStation.color,
                        border: `1px solid ${selectedStation.color}55`,
                      }}
                    >
                      {selectedStation.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: selectedStation.color, fontWeight: 700, marginTop: 2 }}>
                    {selectedStation.role} · <span style={{ color: darkMode ? '#94A3B8' : '#64748B' }}>{selectedStation.desk}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReset}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: darkMode ? '#94A3B8' : '#64748B',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: 4,
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ margin: '8px 0 12px', fontSize: '0.78rem', color: darkMode ? '#CBD5E1' : '#475569', lineHeight: 1.45 }}>
              {selectedStation.description}
            </p>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  color: '#00FF87',
                }}
              >
                <CheckCircle2 size={13} />
                <span>Puesto 3D activo con agente conectado en tiempo real</span>
              </div>

              <div style={{ flex: 1 }} />

              <button
                onClick={() => {
                  if (onLaunchOffice) onLaunchOffice('3d')
                  else window.open('http://localhost:4600', '_blank')
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0.45rem 1rem',
                  borderRadius: 10,
                  border: 'none',
                  background: `linear-gradient(135deg, ${selectedStation.color}, #00E5FF)`,
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: `0 4px 14px ${selectedStation.color}66`,
                }}
              >
                <span>Visitar Estación en Metaverso</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING HUD BOTTOM BAR (when no station selected) ── */}
      {!selectedStation && (
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            right: 14,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            pointerEvents: 'none',
            zIndex: 8,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '0.4rem 0.85rem',
              borderRadius: 999,
              background: darkMode ? 'rgba(7, 13, 20, 0.85)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              border: darkMode ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
              fontSize: '0.74rem',
              fontWeight: 700,
              color: darkMode ? '#E2E8F0' : '#1E293B',
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#00FF87', boxShadow: '0 0 8px #00FF87' }} />
            <span>4 Despachos Ejecutivos + Núcleo Central de IA · Agentes en vivo</span>
          </div>

          <div
            style={{
              fontSize: '0.72rem',
              color: darkMode ? '#94A3B8' : '#64748B',
              background: darkMode ? 'rgba(7, 13, 20, 0.75)' : 'rgba(255, 255, 255, 0.8)',
              padding: '0.35rem 0.75rem',
              borderRadius: 999,
              backdropFilter: 'blur(6px)',
            }}
          >
            Arrastra para rotar 360° · Clic en escritorios para interactuar
          </div>
        </div>
      )}
    </div>
  )
}
