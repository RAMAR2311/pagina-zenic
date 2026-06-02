import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Single floating shape with electric ring + particles around it.
 * Lightweight accent piece for cards & sections.
 */
export default function OrbitingSphere3D({ color = 0x9c4dcc, shape = 'icosahedron' }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let mounted = true

    const w = container.clientWidth
    const h = container.clientHeight

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 50)
    camera.position.z = 4

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // Core geometry
    let coreGeo
    switch (shape) {
      case 'torus':    coreGeo = new THREE.TorusKnotGeometry(0.9, 0.28, 80, 16); break
      case 'octa':     coreGeo = new THREE.OctahedronGeometry(1.1, 0); break
      case 'dodeca':   coreGeo = new THREE.DodecahedronGeometry(1, 0); break
      default:         coreGeo = new THREE.IcosahedronGeometry(1.1, 1)
    }

    const core = new THREE.Mesh(
      coreGeo,
      new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.65 })
    )
    scene.add(core)

    // Inner glow sphere
    const innerGlow = new THREE.Mesh(
      new THREE.SphereGeometry(0.55, 16, 16),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.18 })
    )
    scene.add(innerGlow)

    // Orbiting ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.65, 0.02, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x80deea, transparent: true, opacity: 0.5 })
    )
    ring.rotation.x = Math.PI / 2.5
    scene.add(ring)

    // Orbit points
    const orbitParticles = []
    for (let i = 0; i < 3; i++) {
      const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.05, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x80deea })
      )
      p.userData = { angle: (i / 3) * Math.PI * 2, radius: 1.65 }
      scene.add(p)
      orbitParticles.push(p)
    }

    const clock = new THREE.Clock()
    const animate = () => {
      if (!mounted) return
      const t = clock.getElapsedTime()
      core.rotation.x += 0.005
      core.rotation.y += 0.008
      innerGlow.scale.setScalar(1 + Math.sin(t * 2) * 0.08)
      ring.rotation.z += 0.003

      orbitParticles.forEach((p, i) => {
        const a = p.userData.angle + t * 0.8
        p.position.x = Math.cos(a) * p.userData.radius
        p.position.y = Math.sin(a) * p.userData.radius * 0.4
        p.position.z = Math.sin(a) * p.userData.radius
      })

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    const onResize = () => {
      if (!container) return
      const nw = container.clientWidth, nh = container.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      mounted = false
      window.removeEventListener('resize', onResize)
      coreGeo.dispose(); core.material.dispose()
      innerGlow.geometry.dispose(); innerGlow.material.dispose()
      ring.geometry.dispose(); ring.material.dispose()
      orbitParticles.forEach(p => { p.geometry.dispose(); p.material.dispose() })
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [color, shape])

  return <div ref={containerRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
}
