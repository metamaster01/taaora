'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Star, BadgeCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

const GOLD = '#C9A45C'

type Review = {
  quote: string
  name: string
  city: string
  product: string
}

// Placeholder review examples. Replace with real, permitted customer reviews
// and use customer names only with consent before launch.
const reviews: Review[] = [
  {
    quote: 'A fresh opening with a smooth, woody finish. It felt polished all day, and two friends asked what I was wearing.',
    name: 'Aarav Mehta',
    city: 'Mumbai',
    product: 'Imperial Wood',
  },
  {
    quote: 'The presentation was lovely, but the fragrance is what won me over: warm, confident, and never overpowering.',
    name: 'Ananya Kapoor',
    city: 'Delhi',
    product: 'Imperial Wood',
  },
  {
    quote: 'That amber-and-musk dry down is beautiful. It stays close and comforting, even after a long day out in the heat.',
    name: 'Ishita Nair',
    city: 'Bengaluru',
    product: 'Imperial Wood',
  },
  {
    quote: 'Starts crisp, then turns into something rich and effortlessly elegant. This has quickly become my evening pick.',
    name: 'Rohan Iyer',
    city: 'Chennai',
    product: 'Imperial Wood',
  },
  {
    quote: 'I love fragrances that feel distinctive without taking over a room. This one gets that balance exactly right.',
    name: 'Meera Shah',
    city: 'Ahmedabad',
    product: 'Imperial Wood',
  },
  {
    quote: 'Smooth woods with a subtle sweetness make this feel special from the first spray. Already planning to gift it.',
    name: 'Kabir Singh',
    city: 'Jaipur',
    product: 'Imperial Wood',
  },
  {
    quote: 'It feels considered and versatile—easy for a workday, yet memorable enough for dinner plans afterward.',
    name: 'Priya Menon',
    city: 'Kochi',
    product: 'Imperial Wood',
  },
]

function Stars({ size = 16 }: { size?: number }) {
  return (
    <div className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} stroke="none" fill={GOLD} />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const reduce = useReducedMotion()
  const carouselRef = useRef<HTMLUListElement>(null)

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.7 },
      }

  useEffect(() => {
    if (reduce) return

    const interval = window.setInterval(() => {
      const carousel = carouselRef.current
      if (!carousel) return

      const firstCard = carousel.querySelector('li')
      if (!firstCard) return

      const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 0
      const nextPosition = carousel.scrollLeft + firstCard.getBoundingClientRect().width + gap
      const isAtEnd = nextPosition >= carousel.scrollWidth - carousel.clientWidth - 4

      carousel.scrollTo({ left: isAtEnd ? 0 : nextPosition, behavior: 'smooth' })
    }, 4500)

    return () => window.clearInterval(interval)
  }, [reduce])

  return (
    <section aria-labelledby="reviews-heading" className="bg-white py-14 text-ink sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* header */}
        <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
          <h2
            id="reviews-heading"
            className="font-display text-[2rem] leading-[1.15] tracking-tight sm:text-4xl lg:text-5xl"
          >
            Worn, noticed, remembered.
          </h2>
          <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
            <Stars size={18} />
            <p className="text-sm text-muted">
              <span className="font-medium text-ink">4.9 out of 5</span> from 500+ verified reviews
            </p>
          </div>
        </motion.div>

        {/* swipeable carousel with automatic sliding */}
        <ul
          ref={carouselRef}
          className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:mt-14 sm:gap-6 sm:px-0 sm:pb-0"
          aria-label="Customer reviews"
        >
          {reviews.map((r, i) => (
            <li
              key={i}
              className="relative flex w-[84%] shrink-0 snap-center flex-col border border-hair bg-[#FBF8F1] p-6 sm:w-[calc((100%-3rem)/3)] sm:p-7"
            >
              {/* gold top edge */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[2px]"
                style={{
                  background: `linear-gradient(to right, transparent, ${GOLD}, transparent)`,
                }}
              />

              <span
                aria-hidden="true"
                className="font-display text-6xl leading-[0.6] h-6"
                style={{ color: GOLD }}
              >
                &ldquo;
              </span>

              <blockquote className="mt-3 flex-1 font-display text-[1.0625rem] leading-relaxed sm:text-lg">
                {r.quote}
              </blockquote>

              <div className="mt-6 border-t border-hair pt-4">
                <Stars size={14} />
                <p className="mt-2.5 text-sm font-medium">{r.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                  <BadgeCheck size={14} strokeWidth={1.5} style={{ color: GOLD }} aria-hidden="true" />
                  Verified buyer, {r.city}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}