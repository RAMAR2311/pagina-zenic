import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Datos de los puestos directivos y agentes de Zenic
const DESK_STATIONS = [
  { id: 'ceo', name: 'Marlon Ramírez', role: 'CEO & Fundador', desk: 'Despacho Ejecutivo', x: -4, z: -3, color: '#9C4DCC', badge: 'Estrategia' },
  { id: 'admin', name: 'Jhon Aparicio', role: 'Dir. Administrativo', desk: 'Estación de Finanzas', x: 4, z: -3, color: '#00E5FF', badge: 'Operaciones' },
  { id: 'cto', name: 'Miguel Rodriguez', role: 'Dir. de Tecnología', desk: 'Laboratorio POS & IA', x: -4, z: 3, color: '#C084FC', badge: 'Arquitectura' },
  { id: 'cmo', name: 'Santiago Peraza', role: 'Dir. de Marketing', desk: 'Sala Retail & Demos', x: 4, z: 3, color: '#00FF87', badge: 'Ventas' },
  { id: 'cerebro', name: 'Cerebro Zenic IA', role: 'Agente Autónomo', desk: 'Núcleo Cognitivo', x: 0, z: 0, color: '#FF007F', badge: '28 Docs' },
]

export default function Office3DPreview({ darkMode = true, onSelectStation = null }) {
  const containerRef = useRef(null)
  const [hoveredStation, setHoveredStation] = useState(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    // Scene & Camera (Isometric perspective)
    const scene = new THREE.Scene()
    const aspect = width / height
    const d = 9
    const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000)
    camera.position.set(20, 20, 20)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    container.appendChild(renderer.domElement)

    // Lighting
    const ambientLight = new THREE.AmbientLight(darkMode ? 0x223355 : 0x8899aa, 1.2)
    scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, darkMode ? 1.5 : 1.8)
    dirLight.position.set(15, 25, 10)
    dirLight.castShadow = true
    scene.add(dirLight)

    const purpleLight = new THREE.PointLight(0x9C4DCC, 3, 20)
    purpleLight.position.set(0, 4, 0)
    scene.add(purpleLight)

    const cyanLight = new THREE.PointLight(0x00E5FF, 2, 20)
    cyanLight.position.set(0, 3, 0)
    scene.add(cyanLight)

    // Office Floor Plate
    const floorGeo = new THREE.BoxGeometry(16, 0.4, 14)
    const floorMat = new THREE.MeshStandardMaterial({
      color: darkMode ? 0x091422 : 0xE2E8F0,
      roughness: 0.4,
      metalness: 0.2,
    })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.position.y = -0.2
    floor.receiveShadow = true
    scene.add(floor)

    // Grid on floor
    const grid = new THREE.GridHelper(15, 15, darkMode ? 0x9C4DCC : 0x7928CA, darkMode ? 0x1A283C : 0xCBD5E1)
    grid.position.y = 0.02
    scene.add(grid)

    // Office Walls (Glass / Low borders)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: darkMode ? 0x00E5FF : 0x9C4DCC,
      transparent: true,
      opacity: 0.2,
      roughness: 0.1,
      transmission: 0.6,
    })

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(16, 2.5, 0.2), glassMat)
    backWall.position.set(0, 1.25, -7)
    scene.add(backWall)

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.2, 2.5, 14), glassMat)
    leftWall.position.set(-8, 1.25, 0)
    scene.add(leftWall)

    // Build Desks
    const deskGroup = new THREE.Group()
    const deskMeshMap = []

    DESK_STATIONS.forEach((st) => {
      const isCentral = st.id === 'cerebro'
      const group = new THREE.Group()
      group.position.set(st.x, 0, st.z)

      // Desk Table
      const tableGeo = new THREE.BoxGeometry(isCentral ? 2.8 : 2.2, 0.1, isCentral ? 2.8 : 1.2)
      const tableMat = new THREE.MeshStandardMaterial({
        color: isCentral ? (darkMode ? 0x1E1035 : 0xF3E8FF) : (darkMode ? 0x0E1D2D : 0xFFFFFF),
        roughness: 0.3,
        metalness: 0.5,
      })
      const table = new THREE.Mesh(tableGeo, tableMat)
      table.position.y = 1.0
      table.castShadow = true
      table.receiveShadow = true
      group.add(table)

      // Desk Legs
      const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0)
      const legMat = new THREE.MeshStandardMaterial({ color: darkMode ? 0x334155 : 0x94A3B8 })
      const legOffsets = isCentral
        ? [[-1.2, -1.2], [1.2, -1.2], [-1.2, 1.2], [1.2, 1.2]]
        : [[-0.95, -0.45], [0.95, -0.45], [-0.95, 0.45], [0.95, 0.45]]

      legOffsets.forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(legGeo, legMat)
        leg.position.set(lx, 0.5, lz)
        group.add(leg)
      })

      // Laptop / Screen
      const laptopBase = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.03, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x475569 })
      )
      laptopBase.position.set(0, 1.07, 0)
      group.add(laptopBase)

      const screenGeo = new THREE.BoxGeometry(0.48, 0.32, 0.02)
      const screenMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(st.color),
      })
      const screen = new THREE.Mesh(screenGeo, screenMat)
      screen.position.set(0, 1.25, -0.15)
      screen.rotation.x = -0.2
      group.add(screen)

      // Chair
      const chairMat = new THREE.MeshStandardMaterial({ color: darkMode ? 0x1E293B : 0x64748B })
      const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.08, 0.6), chairMat)
      chairSeat.position.set(0, 0.6, 0.7)
      group.add(chairSeat)

      const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.08), chairMat)
      chairBack.position.set(0, 0.95, 0.95)
      group.add(chairBack)

      // Central Hologram / Brain Orb if central station
      if (isCentral) {
        const orbGeo = new THREE.IcosahedronGeometry(0.55, 2)
        const orbMat = new THREE.MeshStandardMaterial({
          color: 0x00E5FF,
          emissive: 0x9C4DCC,
          emissiveIntensity: 0.8,
          wireframe: true,
        })
        const orb = new THREE.Mesh(orbGeo, orbMat)
        orb.position.y = 1.8
        group.add(orb)
        group.userData.orb = orb
      }

      // Floating Marker Beacon
      const beaconGeo = new THREE.ConeGeometry(0.18, 0.4, 4)
      const beaconMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(st.color) })
      const beacon = new THREE.Mesh(beaconGeo, beaconMat)
      beacon.rotation.x = Math.PI
      beacon.position.set(0, 2.5, 0)
      group.add(beacon)
      group.userData.beacon = beacon

      group.userData.station = st
      deskGroup.add(group)
      deskMeshMap.push(group)
    })

    scene.add(deskGroup)

    // Ambient floating particles
    const particleCount = 120
    const particleGeo = new THREE.BufferGeometry()
    const posArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 18
      posArray[i + 1] = Math.random() * 5 + 0.5
      posArray[i + 2] = (Math.random() - 0.5) * 16
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.12,
      color: darkMode ? 0x00E5FF : 0x9C4DCC,
      transparent: true,
      opacity: 0.7,
    })
    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // Animation Loop
    let frameId
    let clock = { last: performance.now() }
    let mouseX = 0
    let mouseY = 0
    let targetRotY = 0

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((e.clientX - rect.left) / width) * 2 - 1
      mouseY = -(((e.clientY - rect.top) / height) * 2 - 1)
      targetRotY = mouseX * 0.35
    }

    container.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const now = performance.now()
      const delta = (now - clock.last) * 0.001
      clock.last = now

      // Smooth camera pan based on mouse
      scene.rotation.y += (targetRotY - scene.rotation.y) * 0.04

      // Animate floating beacons
      deskMeshMap.forEach((grp, idx) => {
        if (grp.userData.beacon) {
          grp.userData.beacon.position.y = 2.4 + Math.sin(now * 0.003 + idx) * 0.15
          grp.userData.beacon.rotation.y += 0.02
        }
        if (grp.userData.orb) {
          grp.userData.orb.rotation.y += 0.015
          grp.userData.orb.rotation.x += 0.008
        }
      })

      // Particle slow drift
      particleSystem.rotation.y += 0.0008

      renderer.render(scene, camera)
    }

    animate()

    // Resize handler
    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      const asp = w / h
      camera.left = -d * asp
      camera.right = d * asp
      camera.top = d
      camera.bottom = -d
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', onMouseMove)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [darkMode])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 380 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

      {/* Floating HUD Legend */}
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
          <span>Vista Isométrica 3D · 5 Estaciones Activas</span>
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
          Mueve el cursor para girar la perspectiva
        </div>
      </div>
    </div>
  )
}
