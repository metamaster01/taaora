'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    const container = containerRef.current
    if (!glow || !container) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // Current position eases toward the target with a lag, giving the glow
    // weight and softness rather than snapping straight to the cursor.
    let target = { x: 0, y: 0 }
    let current = { x: 0, y: 0 }
    let active = false

    function onMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect()
      target = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (!active) {
        current = { ...target }
        active = true
        glow!.style.opacity = '1'
      }
    }
    function onLeave() {
      active = false
      glow!.style.opacity = '0'
    }

    window.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)

    let frame: number
    function tick() {
      current.x += (target.x - current.x) * 0.07
      current.y += (target.y - current.y) * 0.07
      glow!.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`
      frame = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={containerRef} className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(circle, rgba(201,165,92,0.22) 0%, rgba(201,165,92,0.08) 45%, rgba(201,165,92,0) 72%)',
          filter: 'blur(20px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  )
}