'use client'

import { useEffect, useRef } from 'react'

type Particle = {
  x: number
  y: number
  angle: number
  speed: number
  vy: number
  life: number
  maxLife: number
  size: number
}

export default function CursorMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Respect reduced-motion preference — skip the animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let height = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    function resize() {
      const rect = canvas!.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas!.width = width * dpr
      canvas!.height = height * dpr
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    let particles: Particle[] = []
    let lastSpawn = { x: -1000, y: -1000 }

    function spawn(x: number, y: number) {
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 12,
          y: y + (Math.random() - 0.5) * 12,
          angle: Math.random() * Math.PI * 2,
          speed: 0.25 + Math.random() * 0.35,
          vy: -0.35 - Math.random() * 0.35,
          life: 0,
          maxLife: 80 + Math.random() * 50,
          size: 16 + Math.random() * 24,
        })
      }
    }

    function handleMove(x: number, y: number) {
      const dx = x - lastSpawn.x
      const dy = y - lastSpawn.y
      if (Math.hypot(dx, dy) > 8) {
        spawn(x, y)
        lastSpawn = { x, y }
      }
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect()
      handleMove(e.clientX - rect.left, e.clientY - rect.top)
    }
    function onTouchMove(e: TouchEvent) {
      const rect = canvas!.getBoundingClientRect()
      const t = e.touches[0]
      if (t) handleMove(t.clientX - rect.left, t.clientY - rect.top)
    }

    // Listen on window (not the canvas) so the canvas can stay pointer-events-none
    // and never block clicks on the button/text sitting above it.
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let frame: number

    function tick() {
      ctx!.clearRect(0, 0, width, height)
      ctx!.globalCompositeOperation = 'lighter'

      particles = particles.filter((p) => p.life < p.maxLife)

      for (const p of particles) {
        p.life += 1
        // Wave-like horizontal drift layered on top of gentle outward motion
        p.x += Math.cos(p.angle) * p.speed + Math.sin(p.life * 0.06) * 0.5
        p.y += p.vy

        const t = p.life / p.maxLife
        const alpha = Math.sin(t * Math.PI) * 0.3
        const radius = p.size * (0.6 + t * 0.7)

        const gradient = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius)
        gradient.addColorStop(0, `rgba(201, 165, 92, ${alpha})`)
        gradient.addColorStop(1, 'rgba(201, 165, 92, 0)')
        ctx!.fillStyle = gradient
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx!.fill()
      }

      frame = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}