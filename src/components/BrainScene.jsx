import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function BrainScene({ darkMode }) {
  const mountRef = useRef(null)
  const sceneRef = useRef({})

  useEffect(() => {
    const mount = mountRef.current
    const w = mount.clientWidth
    const h = mount.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, w / h, 0.1, 100)
    camera.position.z = 5

    // ─── BRAIN SPHERE (Icosahedron vertices as neural nodes) ───
    const brainGeo = new THREE.IcosahedronGeometry(1.8, 3)
    const vertices = brainGeo.attributes.position
    const nodePositions = []

    // Extract unique vertices
    const seen = new Set()
    for (let i = 0; i < vertices.count; i++) {
      const key = `${vertices.getX(i).toFixed(3)},${vertices.getY(i).toFixed(3)},${vertices.getZ(i).toFixed(3)}`
      if (!seen.has(key)) {
        seen.add(key)
        nodePositions.push(new THREE.Vector3(vertices.getX(i), vertices.getY(i), vertices.getZ(i)))
      }
    }

    // ─── CIRCUIT LINES (connections between nearby nodes) ───
    const linePoints = []
    const threshold = 1.1
    for (let i = 0; i < nodePositions.length; i++) {
      for (let j = i + 1; j < nodePositions.length; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < threshold) {
          linePoints.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z)
          linePoints.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z)
        }
      }
    }

    const lineGeo = new THREE.BufferGeometry()
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePoints, 3))
    const lineMat = new THREE.LineBasicMaterial({
      color: '#9C4DCC',
      transparent: true,
      opacity: 0.4,
    })
    const circuitLines = new THREE.LineSegments(lineGeo, lineMat)
    scene.add(circuitLines)

    // ─── DATA NODES (glowing spheres at vertices) ───
    const nodesGroup = new THREE.Group()
    const nodeMat = new THREE.MeshBasicMaterial({ color: '#80DEEA' })
    const nodeGeo = new THREE.SphereGeometry(0.03, 8, 8)

    // Select subset of nodes to be "active" (pulsing cyan)
    const activeIndices = new Set()
    while (activeIndices.size < Math.min(30, nodePositions.length)) {
      activeIndices.add(Math.floor(Math.random() * nodePositions.length))
    }

    const activeNodes = []
    nodePositions.forEach((pos, idx) => {
      if (activeIndices.has(idx)) {
        const node = new THREE.Mesh(nodeGeo, nodeMat.clone())
        node.position.copy(pos)
        node.userData.baseScale = 0.8 + Math.random() * 0.6
        node.userData.phase = Math.random() * Math.PI * 2
        nodesGroup.add(node)
        activeNodes.push(node)
      }
    })
    scene.add(nodesGroup)

    // ─── OUTER GLOW SPHERE ───
    const glowGeo = new THREE.SphereGeometry(2.0, 32, 32)
    const glowMat = new THREE.MeshBasicMaterial({
      color: '#4A2574',
      transparent: true,
      opacity: 0.04,
      side: THREE.BackSide,
    })
    const glowSphere = new THREE.Mesh(glowGeo, glowMat)
    scene.add(glowSphere)

    // ─── FLOATING PARTICLES ───
    const particleCount = 400
    const pPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      pPositions[i] = (Math.random() - 0.5) * 14
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
    const pMat = new THREE.PointsMaterial({
      color: '#80DEEA',
      size: 0.02,
      transparent: true,
      opacity: 0.5,
    })
    const particleField = new THREE.Points(pGeo, pMat)
    scene.add(particleField)

    // ─── LIGHTING ───
    const ambient = new THREE.AmbientLight(0xffffff, 0.3)
    scene.add(ambient)

    // ─── GSAP INTRO ───
    const brainGroup = new THREE.Group()
    brainGroup.add(circuitLines)
    brainGroup.add(nodesGroup)
    brainGroup.add(glowSphere)
    scene.add(brainGroup)
    // Remove from scene root since we moved them to group
    scene.remove(circuitLines)
    scene.remove(nodesGroup)
    scene.remove(glowSphere)

    gsap.from(brainGroup.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.8,
      ease: 'elastic.out(1, 0.6)',
      delay: 0.3,
    })
    gsap.from(brainGroup.rotation, {
      y: -Math.PI * 1.5,
      duration: 2.2,
      ease: 'power3.out',
      delay: 0.2,
    })

    // ─── MOUSE INTERACTION ───
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // ─── ANIMATION LOOP ───
    let raf
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      // Brain rotation
      brainGroup.rotation.y += 0.002
      brainGroup.rotation.x = mouse.y * 0.15
      brainGroup.rotation.z = mouse.x * 0.05

      // Pulsing data nodes
      activeNodes.forEach((node) => {
        const pulse = Math.sin(t * 2.5 + node.userData.phase) * 0.5 + 0.5
        const s = node.userData.baseScale * (0.7 + pulse * 0.8)
        node.scale.setScalar(s)
        node.material.opacity = 0.5 + pulse * 0.5
      })

      // Particle drift
      particleField.rotation.y = t * 0.015
      particleField.rotation.x = t * 0.008

      // Camera parallax
      camera.position.x += (mouse.x * 0.4 - camera.position.x) * 0.03
      camera.position.y += (mouse.y * 0.2 - camera.position.y) * 0.03
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    // Store refs for dark mode updates
    sceneRef.current = { lineMat, pMat, glowMat, activeNodes }

    // ─── RESIZE ───
    const onResize = () => {
      const nw = mount.clientWidth
      const nh = mount.clientHeight
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Update colors based on dark mode
  useEffect(() => {
    const { lineMat, pMat, glowMat, activeNodes } = sceneRef.current
    if (!lineMat) return

    if (darkMode) {
      lineMat.opacity = 0.6
      pMat.opacity = 0.7
      glowMat.opacity = 0.08
      activeNodes?.forEach((n) => { n.material.color.set('#80DEEA') })
    } else {
      lineMat.opacity = 0.4
      pMat.opacity = 0.5
      glowMat.opacity = 0.04
      activeNodes?.forEach((n) => { n.material.color.set('#80DEEA') })
    }
  }, [darkMode])

  return <div ref={mountRef} className="absolute inset-0 w-full h-full" />
}
