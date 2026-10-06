'use client'

import { useEffect, useRef, useState } from 'react'
import type { AnimationItem } from 'lottie-web'

const animationCache = new Map<string, any>()
const fetchPromises = new Map<string, Promise<any>>()

/**
 * Kicks off (and caches) the fetch for a Lottie JSON file ahead of time, so
 * that by the time <LottiePlayer /> actually needs to render it, it's
 * already in memory — no flash of empty space, no network wait.
 */
export function preloadLottie(src: string) {
  if (animationCache.has(src) || fetchPromises.has(src)) return
  const promise = fetch(src)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      if (data) animationCache.set(src, data)
      return data
    })
    .catch(() => null)
  fetchPromises.set(src, promise)
}

export default function LottiePlayer({
  src,
  loop = true,
  className = '',
  onComplete,
}: {
  src: string
  loop?: boolean
  className?: string
  onComplete?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<any>(animationCache.get(src) ?? null)

  // Fetch (or reuse the preloaded) animation JSON.
  useEffect(() => {
    let active = true
    if (!data) {
      preloadLottie(src)
      fetchPromises.get(src)?.then((d) => {
        if (active && d) setData(d)
      })
    }
    return () => {
      active = false
    }
  }, [src, data])

  // Mount the actual lottie-web player once we have both the data and the
  // DOM node. Loaded dynamically so it never touches the server bundle.
  useEffect(() => {
    if (!data || !containerRef.current) return

    let cancelled = false
    let instance: AnimationItem | null = null

    import('lottie-web').then((mod) => {
      if (cancelled || !containerRef.current) return
      const lottie = (mod as any).default ?? mod
      const animation = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay: true,
        animationData: data,
      })
      instance = animation
      if (onComplete) animation.addEventListener('complete', onComplete)
    })

    return () => {
      cancelled = true
      instance?.destroy()
    }
  }, [data, loop, onComplete])

  // Fallback while the JSON loads (or if it fails) — a plain spinner so the
  // UI never shows a broken or blank patch.
  if (!data) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <span className="h-10 w-10 animate-spin rounded-full border-2 border-bronze/30 border-t-bronze" />
      </div>
    )
  }

  return <div ref={containerRef} className={className} />
}