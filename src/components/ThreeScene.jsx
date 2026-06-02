import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

export default function ThreeScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const w = mount.clientWidth
    const h = mount.clientHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    // Scene & camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100)
    camera.position.z = 4

    // Geometry: icosahedron
    const geometry = new THREE.IcosahedronGeometry(1.2, 1)
    const material = new THREE.MeshStandardMaterial({
      color: '#7c3aed',
      roughness: 0.3,
      metalness: 0.6,
      wireframe: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const point1 = new THREE.PointLight('#a78bfa', 80, 20)
    point1.position.set(3, 3, 3)
    scene.add(point1)

    const point2 = new THREE.PointLight('#06b6d4', 60, 20)
    point2.position.set(-3, -2, 2)
    scene.add(point2)

    // Particle field
    const particleCount = 600
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 20
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMat = new THREE.PointsMaterial({
      color: '#a78bfa',
      size: 0.04,
      transparent: true,
      opacity: 0.6,
    })
    const particles = new THREE.Points(particleGeo, particleMat)
    scene.add(particles)

    // GSAP intro animation
    gsap.from(mesh.scale, {
      x: 0, y: 0, z: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
    })
    gsap.from(mesh.rotation, {
      y: -Math.PI,
      duration: 1.4,
      ease: 'power3.out',
    })

    // GSAP continuous float
    gsap.to(mesh.position, {
      y: 0.3,
      duration: 2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    // Mouse parallax
    const mouse = { x: 0, y: 0 }
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    // Render loop
    let raf
    const clock = new THREE.Clock()
    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mesh.rotation.y += 0.003
      mesh.rotation.x = mouse.y * 0.2
      mesh.rotation.z = mouse.x * 0.1

      particles.rotation.y = t * 0.03
      particles.rotation.x = t * 0.01

      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.05
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }
    animate()

    // Resize handler
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
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="w-full h-full" />
}
