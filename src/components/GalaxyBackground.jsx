import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Pure particle galaxy — no geometric shapes.
 * Dense field of cyan/purple particles drifting with mouse parallax.
 */
export default function GalaxyBackground({ darkMode, density = 600 }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let mounted = true

    const width  = container.clientWidth
    const height = container.clientHeight

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100)
    camera.position.z = 8

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    // ── Foreground particles (bright, larger) ──
    const fgGeo = new THREE.BufferGeometry()
    const fgPositions = new Float32Array(density * 3)
    const fgColors    = new Float32Array(density * 3)
    const fgSizes     = new Float32Array(density)
    const purple = new THREE.Color(0x9c4dcc)
    const cyan   = new THREE.Color(0x80deea)
    const amber  = new THREE.Color(0xf59e0b)
    for (let i = 0; i < density; i++) {
      // Distribute in a flattened disk for galaxy feel
      const r = Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      fgPositions[i * 3]     = Math.cos(theta) * r
      fgPositions[i * 3 + 1] = (Math.random() - 0.5) * 6
      fgPositions[i * 3 + 2] = Math.sin(theta) * r * 0.6

      const t = Math.random()
      const mixed = t < 0.5
        ? purple.clone().lerp(cyan, t * 2)
        : cyan.clone().lerp(amber, (t - 0.5) * 0.6)
      fgColors[i * 3]     = mixed.r
      fgColors[i * 3 + 1] = mixed.g
      fgColors[i * 3 + 2] = mixed.b

      fgSizes[i] = 0.03 + Math.random() * 0.08
    }
    fgGeo.setAttribute('position', new THREE.BufferAttribute(fgPositions, 3))
    fgGeo.setAttribute('color',    new THREE.BufferAttribute(fgColors,    3))

    const fgMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const fgParticles = new THREE.Points(fgGeo, fgMat)
    scene.add(fgParticles)

    // ── Background dust (more subtle, denser) ──
    const dustCount = density * 2
    const dustGeo = new THREE.BufferGeometry()
    const dustPositions = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3]     = (Math.random() - 0.5) * 24
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 16
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 14 - 4
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.025,
      color: 0xb085d8,
      transparent: true,
      opacity: 0.35,
      sizeAttenuation: true,
    })
    const dustParticles = new THREE.Points(dustGeo, dustMat)
    scene.add(dustParticles)

    // ── Mouse parallax ──
    const mouse  = { x: 0, y: 0 }
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
      const w = container.clientWidth, h = container.clientHeight
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

      fgParticles.rotation.y = t * 0.03
      fgParticles.rotation.z = t * 0.005
      dustParticles.rotation.y = -t * 0.015

      // Mouse parallax
      mouse.x += (target.x - mouse.x) * 0.04
      mouse.y += (target.y - mouse.y) * 0.04
      camera.position.x = mouse.x * 1.2
      camera.position.y = -mouse.y * 0.8
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate()

    return () => {
      mounted = false
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      fgGeo.dispose(); fgMat.dispose()
      dustGeo.dispose(); dustMat.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [density])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        opacity: darkMode ? 0.95 : 0.75,
        zIndex: 0,
      }}
    />
  )
}
