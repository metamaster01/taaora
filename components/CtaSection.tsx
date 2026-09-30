'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

const SHOP_URL = '/products/imperial-wood'
const WHATSAPP_URL =
  'https://wa.me/917558566189?text=' +
  encodeURIComponent('Hi Taaora, I have a question about Imperial Wood.')

// lucide has no brand icons, so the WhatsApp glyph is inlined
function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.21 4.24-9.45 9.46-9.45 2.52 0 4.9.99 6.68 2.77a9.4 9.4 0 0 1 2.76 6.69c0 5.21-4.25 9.45-9.42 9.45zM20.52 3.45A11.4 11.4 0 0 0 12.05 0C5.73 0 .59 5.14.59 11.46c0 2.02.53 3.99 1.53 5.73L.5 23.5l6.47-1.7a11.44 11.44 0 0 0 5.08 1.2h.01c6.32 0 11.46-5.14 11.46-11.46 0-3.06-1.19-5.94-3.35-8.09z" />
    </svg>
  )
}

// Fine film-grain texture (inline SVG noise) so the dark background isn't flat
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")"

const buttonBase =
  'inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full px-8 text-[15px] font-medium tracking-wide transition-all duration-300 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F4F1EA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0908]'

export default function CtaSection() {
  const reduce = useReducedMotion()

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.7 },
      }

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="relative isolate overflow-hidden bg-[#0A0908] text-[#F4F1EA]"
    >
      {/* ---------- background ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {/* warm glows anchored to both sides so the wide edges feel lit, not empty */}
        <div className="absolute -left-40 top-1/2 h-[380px] w-[520px] -translate-y-1/2 rounded-full bg-bronze/25 blur-[120px]" />
        <div className="absolute -right-40 top-1/2 h-[380px] w-[520px] -translate-y-1/2 rounded-full bg-bronze/20 blur-[120px]" />

        {/* oversized brand wordmark, sits behind everything */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[48%] select-none whitespace-nowrap font-display text-[34vw] leading-none tracking-tight text-[#F4F1EA]/[0.035] lg:text-[17rem]">
          Taaora
        </span>

        {/* grain */}
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        {/* hairlines top and bottom, fading out toward the edges */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#F4F1EA]/10 to-transparent" />
      </div>

      {/* ---------- content ---------- */}
      <div className="mx-auto max-w-6xl px-6 py-14 sm:py-16 lg:py-14">
        <motion.div
          {...reveal}
          className="flex flex-col items-center gap-8 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:text-left"
        >
          {/* left: message */}
          <div className="max-w-xl">
            <h2
              id="cta-heading"
              className="font-display text-[2rem] leading-[1.15] tracking-tight sm:text-4xl lg:text-[2.75rem]"
            >
              Make it your signature.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#F4F1EA]/70 sm:text-base lg:mx-0">
              Imperial Wood is ready when you are. Not sure yet? Message us and we&apos;ll help you
              choose.
            </p>
          </div>

          {/* right: actions */}
          <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-md sm:flex-row lg:w-auto lg:max-w-none lg:shrink-0 lg:gap-4">
            <Link
              href={SHOP_URL}
              className={`${buttonBase} bg-[#F4F1EA] text-[#0A0908] hover:bg-white lg:min-w-[210px]`}
            >
              Shop Imperial Wood
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonBase} border border-[#F4F1EA]/30 text-[#F4F1EA] hover:border-[#F4F1EA]/70 hover:bg-[#F4F1EA]/5 lg:min-w-[240px]`}
            >
              <WhatsAppIcon className="h-5 w-5" />
              Chat on WhatsApp
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}