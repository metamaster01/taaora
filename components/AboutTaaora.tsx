'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export default function AboutTaaora() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageError, setImageError] = useState(false)

  // Ties the image's vertical position to how far this section has scrolled
  // through the viewport, so it drifts slightly slower than the page —
  // a proper scroll-linked parallax rather than a one-off fade-in.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <section ref={containerRef} className="overflow-hidden bg-paper py-16 text-ink lg:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="order-2 lg:order-1"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-bronze">About Taaora</p>
          <p className="mt-4 font-display text-3xl italic leading-snug sm:text-4xl">
            Built around a single presence, not a shelf of options.
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-muted">
            Taaora began with a simple belief — that a fragrance shouldn't compete for attention
            across a dozen bottles. It should be singular, considered, and unmistakably yours.
            Imperial Wood is that belief, bottled.
          </p>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Every bottle carries a rich, lasting concentration — made to be worn once and
            remembered all day. We make one fragrance. We intend to make it the only one you need.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.9 }}
          className="order-1 relative aspect-[9/10] w-full overflow-hidden bg-[#F5F3EE] lg:order-2"
        >
          <motion.div style={{ y }} className="absolute inset-x-0 -top-[8%] h-[116%] w-full">
            {imageError ? (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-sm italic text-muted">Photography pending</span>
              </div>
            ) : (
              <Image
                src="/about.webp"
                alt="About Taaora"
                fill
                onError={() => setImageError(true)}
                className="object-cover"
              />
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}