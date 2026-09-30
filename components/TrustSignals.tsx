'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Star, BadgeCheck, Truck, Factory, type LucideIcon } from 'lucide-react'

// Theme gold. Change here to retune the bar.
const GOLD = '#C9A45C'
const GRAD_ID = 'taaora-trust-gold'

type Signal = {
  icon: LucideIcon | 'stars'
  value: string
  label: string
}

// ⚠️ Replace with your REAL numbers before launch. Trust signals only work if they are true.
const signals: Signal[] = [
  { icon: 'stars', value: '4.9 / 5', label: 'Customer rating' },
  { icon: BadgeCheck, value: '500+', label: 'Verified reviews' },
  { icon: Truck, value: 'Ships in 24 hrs', label: 'Delivered in 3–5 days' },
  { icon: Factory, value: 'Made in India', label: 'Crafted with pride' },
]

export default function TrustSignals() {
  const reduce = useReducedMotion()

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.7 },
      }

  return (
    <section
      aria-label="Why customers trust Taaora"
      className="relative isolate overflow-hidden bg-gradient-to-b from-white via-[#FCFAF5] to-white text-ink"
    >
      {/* shared gold gradient used by every icon */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id={GRAD_ID} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E9CD8E" />
            <stop offset="50%" stopColor={GOLD} />
            <stop offset="100%" stopColor="#9C7429" />
          </linearGradient>
        </defs>
      </svg>

      {/* gold hairlines top + bottom */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}88, transparent)` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: `linear-gradient(to right, transparent, ${GOLD}55, transparent)` }}
      />

      <motion.ul
        {...fade}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-6 py-9 sm:py-10 lg:grid-cols-4 lg:gap-y-0 lg:py-12"
      >
        {signals.map(({ icon: Icon, value, label }, i) => (
          <li
            key={value}
            className={`flex flex-col items-center px-3 text-center lg:px-6 ${
              i % 2 === 1 ? 'border-l' : ''
            } ${i > 0 ? 'lg:border-l' : ''} ${
              i >= 2 ? 'border-t pt-6 lg:border-t-0 lg:pt-0' : ''
            }`}
            style={{ borderColor: `${GOLD}40` }}
          >
            {/* visual (top) */}
            <div aria-hidden="true" className="flex h-10 items-center justify-center lg:h-12">
              {Icon === 'stars' ? (
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className="h-[18px] w-[18px] lg:h-5 lg:w-5"
                      stroke="none"
                      fill={`url(#${GRAD_ID})`}
                    />
                  ))}
                </div>
              ) : (
                <Icon
                  className="h-9 w-9 lg:h-11 lg:w-11"
                  strokeWidth={1}
                  stroke={`url(#${GRAD_ID})`}
                />
              )}
            </div>

            {/* text (bottom) */}
            <p className="mt-3 font-display text-[1.125rem] leading-tight tracking-tight sm:text-xl lg:text-2xl">
              {value}
            </p>
            <p className="mt-1 text-xs tracking-wide text-muted sm:text-[13px]">{label}</p>
          </li>
        ))}
      </motion.ul>
    </section>
  )
}