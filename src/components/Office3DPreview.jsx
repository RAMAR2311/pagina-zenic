import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Sparkles, Compass, Eye, RotateCw, ZoomIn, ZoomOut, CheckCircle2, ArrowRight } from 'lucide-react'

// Datos de los puestos directivos y agentes de Zenic
export const DESK_STATIONS = [
  {
    id: 'ceo',
    name: 'Marlon Ramírez',
    role: 'CEO & Fundador',
    desk: 'Despacho Ejecutivo',
    description: 'Estrategia corporativa, alianzas de retail y visión del ecosistema Zenic en Colombia.',
    x: -4,
    z: -3,
    color: '#9C4DCC',
    badge: 'Estrategia',
    icon: '👑',
  },
  {
    id: 'admin',
    name: 'Jhon Aparicio',
    role: 'Dir. Administrativo',
    desk: 'Estación de Finanzas',
    description: 'Gestión contable, operaciones financieras, nómina y facturación electrónica POS.',
    x: 4,
    z: -3,
    color: '#00E5FF',
    badge: 'Operaciones',
    icon: '💼',
  },
  {
    id: 'cto',
    name: 'Miguel Rodriguez',
    role: 'Dir. de Tecnología',
    desk: 'Laboratorio POS & IA',
    description: 'Arquitectura de software cloud, sincronización offline y modelos de IA en punto de venta.',
    x: -4,
    z: 3,
    color: '#C084FC',
    badge: 'Arquitectura',
    icon: '⚡',
  },
  {
    id: 'cmo',
    name: 'Santiago Peraza',
    role: 'Dir. de Marketing',
    desk: 'Sala Retail & Demos',
    description: 'Crecimiento de comercios, campañas de retail popular y demostraciones en vivo a tenderos.',
    x: 4,
    z: 3,
    color: '#00FF87',
    badge: 'Ventas',
    icon: '🎯',
  },
  {
    id: 'cerebro',
    name: 'Cerebro Zenic IA',
    role: 'Núcleo Cognitivo',
    desk: 'Cerebro de la Empresa',
    description: 'Agente autónomo con 28 documentos neuronales y grafo sináptico empresarial en tiempo real.',
    x: 0,
    z: 0,
    color: '#FF007F',
    badge: '28 Docs',
    icon: '🧠',
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
    dirLight.position.set(15, 25, 10)
    dirLight.castShadow = true
    scene.add(dirLight)

    const purpleLight = new THREE.PointLight(0x9c4dcc, 3.5, 25)
    purpleLight.position.set(0, 5, 0)
    scene.add(purpleLight)

    const cyanLight = new THREE.PointLight(0x00e5ff, 2.5, 25)
    cyanLight.position.set(0, 4, 0)
    scene.add(cyanLight)

    // Office Floor Plate
    const floorGeo = new THREE.BoxGeometry(16, 0.4, 14)
    const floorMat = new THREE.MeshStandardMaterial({
      color: darkMode ? 0x091422 : 0xe2e8f0,
      roughness: 0.35,
      metalness: 0.25,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -0.2
    floor.receiveShadow = true
    scene.add(floor)

    // Grid on floor
    const grid = new THREE.GridHelper(15, 15, darkMode ? 0x9c4dcc : 0x7928ca, darkMode ? 0x1a283c : 0xcbd5e1)
    grid.position.y = 0.02
    scene.add(grid)

    // Office Walls (Glass / Low borders)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0x00e5ff : 0x9c4dcc,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
      transmission: 0.65,
    })

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 0.2), glassMat)
    backWall.position.set(0, 1.25, -7)
    scene.add(backWall)

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 14), glassMat)
    leftWall.position.set(-8, 1.25, 0)
    scene.add(leftWall)

    // Interactive Desks
    const deskGroup = new THREE.Group()
    const deskMeshMap = []
    const raycastableMeshes = []

    DESK_STATIONS.forEach((st) => {
      const isCentral = st.id === 'cerebro'
      const group = new THREE.Group()
      group.position.set(st.x, 0, st.z)

      // Desk Table
      const tableGeo = new THREE.BoxGeometry(isCentral ? 2.8 : 2.2, 0.12, isCentral ? 2.8 : 1.25)
      const tableMat = new THREE.MeshStandardMaterial({
        color: isCentral ? (darkMode ? 0x1e1035 : 0xf3e8ff) : darkMode ? 0x0e1d2d : 0xffffff,
        roughness: 0.3,
        metalness: 0.5,
      })
      const table = new THREE.Mesh(tableGeo, tableMat)
      table.position.y = 1.0
      table.castShadow = true
      table.receiveShadow = true
      group.add(table)

      // Desk Legs
      const legGeo = new THREE.CylinderGeometry(0.045, 0.045, 1.0)
      const legMat = new THREE.MeshStandardMaterial({ color: darkMode ? 0x334155 : 0x94a3b8 })
      const legOffsets = isCentral
        ? [
            [-1.2, -1.2],
            [1.2, -1.2],
            [-1.2, 1.2],
            [1.2, 1.2],
          ]
        : [
            [-0.95, -0.48],
            [0.95, -0.48],
            [-0.95, 0.48],
            [0.95, 0.48],
          ]

      legOffsets.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, 0.5, lz)
        group.add(leg)
      })

      // Laptop / Screen
      const laptopBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.03, 0.36),
        new THREE.MeshStandardMaterial({ color: 0x475569 })
      )
      laptopBase.position.set(0, 1.07, 0)
      group.add(laptopBase)

      const screenGeo = new THREE.BoxGeometry(0.5, 0.34, 0.02)
      const screenMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(st.color),
      })
      const screen = new THREE.Mesh(screenGeo, screenMat)
      screen.position.set(0, 1.26, -0.15)
      screen.rotation.x = -0.2
      group.add(screen)
      group.userData.screen = screen

      // Chair
      const chairMat = new THREE.MeshStandardMaterial({ color: darkMode ? 0x1e293b : 0x64748b })
      const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.65), chairMat)
      chairSeat.position.set(0, 0.6, 0.75)
      group.add(chairSeat)

      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.65, 0.08), chairMat)
      chairBack.position.set(0, 0.98, 1.02)
      group.add(chairBack)

      // Central Hologram / Brain Orb if central station
      if (isCentral) {
        const orbGeo = new THREE.IcosahedronGeometry(0.6, 2)
        const orbMat = new THREE.MeshStandardMaterial({
          color: 0x00e5ff,
          emissive: 0x9c4dcc,
          emissiveIntensity: 0.9,
          wireframe: true,
        })
        const orb = new THREE.Mesh(orbGeo, orbMat)
        orb.position.y = 1.85
        group.add(orb)
        group.userData.orb = orb
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
      const ringGeo = new THREE.RingGeometry(isCentral ? 1.8 : 1.3, isCentral ? 1.95 : 1.42, 32)
      ringGeo.rotateX(-Math.PI / 2)
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(st.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      })
      const ring = new THREE.Mesh(ringGeo, ringMat)
      ring.position.y = 0.03
      group.add(ring)
      group.userData.ring = ring

      // Invisible Click/Hover Hitbox (Raycast target)
      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(isCentral ? 3.5 : 2.8, 3.2, isCentral ? 3.5 : 2.5),
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
      posArray[i] = (Math.random() - 0.5) * 18
      posArray[i + 1] = Math.random() * 5 + 0.5
      posArray[i + 2] = (Math.random() - 0.5) * 16
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
    let rotSpeedX = 0
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
        rotSpeedX = deltaX * 0.008
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
          // Smooth focus towards clicked desk
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

    // Exposed controls to React UI
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

      // Animate floating beacons and glowing rings
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
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 420 }}>
      {/* 3D WebGL Canvas */}
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* ── TOP INTERACTIVE DOCK: STATION QUICK PICKERS ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          left: 14,
          right: 210,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          flexWrap: 'wrap',
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
            border: selectedStation === null ? '1px solid #00E5FF' : darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
            background: selectedStation === null ? 'rgba(0, 229, 255, 0.2)' : darkMode ? 'rgba(7, 13, 20, 0.8)' : 'rgba(255, 255, 255, 0.85)',
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
                border: isSelected ? `1px solid ${st.color}` : darkMode ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)',
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

      {/* ── TOP RIGHT CONTROLS: ROTATE / ZOOM ── */}
      <div
        style={{
          position: 'absolute',
          top: 14,
          right: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 10,
        }}
      >
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
              top: 60,
              left: 20,
              zIndex: 12,
              pointerEvents: 'none',
              background: darkMode ? 'rgba(6, 12, 19, 0.92)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: 14,
              padding: '0.65rem 0.95rem',
              border: `1.5px solid ${hoveredStation.color}`,
              boxShadow: `0 10px 30px rgba(0,0,0,0.4), 0 0 20px ${hoveredStation.color}44`,
              maxWidth: 240,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: '1.2rem' }}>{hoveredStation.icon}</span>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 900, color: darkMode ? '#FFFFFF' : '#0F172A', lineHeight: 1.2 }}>
                  {hoveredStation.name}
                </div>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: hoveredStation.color }}>
                  {hoveredStation.role}
                </div>
              </div>
            </div>
            <div style={{ fontSize: '0.65rem', color: darkMode ? '#94A3B8' : '#64748B' }}>
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
                <span>Puesto 3D activo y conectado en tiempo real</span>
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
            <span>Vista Isométrica 3D Interactiva · 5 Estaciones</span>
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
