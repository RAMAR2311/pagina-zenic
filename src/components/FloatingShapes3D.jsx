import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Floating 3D shapes background — wireframe geometric forms
 * that drift, rotate and react to scroll/mouse.
 */
export default function FloatingShapes3D({ darkMode, intensity = 1 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let mounted = true

    // ── Scene ──
    const scene = new THREE.Scene()
    const width = container.clientWidth
    const height = container.clientHeight

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // ── Lights (for solid materials, mostly decorative) ──
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)
    const purpleLight = new THREE.PointLight(0x9c4dcc, 2, 30)
    purpleLight.position.set(5, 3, 5)
    scene.add(purpleLight)
    const cyanLight = new THREE.PointLight(0x80deea, 2, 30)
    cyanLight.position.set(-5, -3, 5)
    scene.add(cyanLight)

    // ── Shapes definitions ──
    const shapes = []
    const COLORS = {
      purple: 0x9c4dcc,
      cyan:   0x80deea,
      violet: 0x4a2574,
      amber:  0xf59e0b,
    }

    const addShape = (geometry, color, position, scale = 1) => {
      const wireMat = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      })
      const mesh = new THREE.Mesh(geometry, wireMat)
      mesh.position.set(...position)
      mesh.scale.setScalar(scale)
      mesh.userData = {
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.008,
          y: (Math.random() - 0.5) * 0.008,
          z: (Math.random() - 0.5) * 0.005,
        },
        floatPhase: Math.random() * Math.PI * 2,
        floatAmp: 0.3 + Math.random() * 0.4,
        baseY: position[1],
      }
      scene.add(mesh)
      shapes.push(mesh)
      return mesh
    }

    // Icosahedron (large center-left)
    addShape(
      new THREE.IcosahedronGeometry(1.4, 1),
      COLORS.purple,
      [-3.5, 0.8, 0],
      1
    )
    // Torus knot (top right)
    addShape(
      new THREE.TorusKnotGeometry(0.7, 0.22, 80, 14),
      COLORS.cyan,
      [3.2, 1.5, -1],
      1
    )
    // Octahedron (bottom right)
    addShape(
      new THREE.OctahedronGeometry(0.9, 0),
      COLORS.amber,
      [2.8, -1.8, 1],
      1
    )
    // Dodecahedron (bottom left)
    addShape(
      new THREE.DodecahedronGeometry(0.7, 0),
      COLORS.violet,
      [-2.2, -2, 1.5],
      1
    )
    // Small torus
    addShape(
      new THREE.TorusGeometry(0.5, 0.15, 12, 24),
      COLORS.cyan,
      [0, 2.2, -0.5],
      1
    )
    // Tetrahedron
    addShape(
      new THREE.TetrahedronGeometry(0.7, 0),
      COLORS.purple,
      [0.5, -0.5, 2],
      1
    )

    // ── Particle field ──
    const particleCount = 200
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const color1 = new THREE.Color(0x9c4dcc)
    const color2 = new THREE.Color(0x80deea)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 18
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6
      const mixed = color1.clone().lerp(color2, Math.random())
      colors[i * 3]     = mixed.r
      colors[i * 3 + 1] = mixed.g
      colors[i * 3 + 2] = mixed.b
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color',    new THREE.BufferAttribute(colors,    3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // ── Mouse interaction (parallax) ──
    const mouse = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect()
      target.x = ((e.clientX - rect.left) / rect.width  - 0.5) * 2
      target.y = ((e.clientY - rect.top)  / rect.height - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Resize ──
    const onResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    // ── Animate ──
    const clock = new THREE.Clock()
    const animate = () => {
      if (!mounted) return
      const t = clock.getElapsedTime()

      shapes.forEach((mesh) => {
        const ud = mesh.userData
        mesh.rotation.x += ud.rotSpeed.x * intensity
        mesh.rotation.y += ud.rotSpeed.y * intensity
        mesh.rotation.z += ud.rotSpeed.z * intensity
        mesh.position.y = ud.baseY + Math.sin(t * 0.6 + ud.floatPhase) * ud.floatAmp
      })

      particles.rotation.y = t * 0.02
      particles.rotation.x = t * 0.01

      // Smooth parallax
      mouse.x += (target.x - mouse.x) * 0.04
      mouse.y += (target.y - mouse.y) * 0.04
      camera.position.x = mouse.x * 0.8
      camera.position.y = -mouse.y * 0.5
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    // ── Cleanup ──
    return () => {
      mounted = false
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      shapes.forEach(m => {
        m.geometry.dispose()
        m.material.dispose()
      })
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [intensity])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: darkMode ? 0.85 : 0.7,
        zIndex: 0,
      }}
    />
  )
}
