// // 'use client'

// // import Link from 'next/link'
// // import Image from 'next/image'
// // import { motion } from 'framer-motion'
// // import CursorMist from './CursorMist'
// // import type { Product } from '@/types/product'

// // export default function Hero({ product }: { product: Product }) {
// //   const notes = (product.scent_profile ?? []).slice(0, 3)

// //   return (
// //     <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0908] text-[#F4F1EA]">
// //       <Image
// //         src="/images/product/bottle-studio.webp"
// //         alt={product.name}
// //         fill
// //         priority
// //         className="object-cover opacity-60"
// //       />
// //       <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/70 to-[#0A0908]/20" />
// //       <CursorMist />

// //       <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
// //         <motion.p
// //           initial={{ opacity: 0, y: 10 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.8 }}
// //           className="text-sm uppercase tracking-[0.2em] text-bronze"
// //         >
// //           Eau de Parfum
// //         </motion.p>

// //         <motion.h1
// //           initial={{ opacity: 0, y: 24 }}
// //           animate={{ opacity: 1, y: 0 }}
// //           transition={{ duration: 0.9, delay: 0.1 }}
// //           className="mt-5 max-w-2xl font-display text-5xl italic leading-tight sm:text-6xl"
// //         >
// //           Wear a fragrance that becomes your presence.
// //         </motion.h1>

// //         <motion.p
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ duration: 0.9, delay: 0.3 }}
// //           className="mt-6 max-w-md text-[#C9C2B4]"
// //         >
// //           {product.tagline} {product.size_ml}ml · {product.concentration_pct}% concentration.
// //         </motion.p>

// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           transition={{ duration: 0.9, delay: 0.5 }}
// //           className="mt-8"
// //         >
// //           <Link
// //             href={`/products/${product.slug}`}
// //             className="inline-block bg-[#F4F1EA] px-8 py-4 text-sm text-[#0A0908] transition-opacity hover:opacity-90"
// //           >
// //             Shop now
// //           </Link>
// //         </motion.div>
// //       </div>

// //       {notes.length > 0 && (
// //         <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
// //           <div className="mx-auto flex max-w-6xl gap-12 px-6 py-4 text-sm text-[#C9C2B4] sm:gap-16">
// //             {notes.map((note) => (
// //               <span key={note}>{note}</span>
// //             ))}
// //           </div>
// //         </div>
// //       )}
// //     </section>
// //   )
// // }




// 'use client'

// import Link from 'next/link'
// import Image from 'next/image'
// import { motion } from 'framer-motion'
// import CursorGlow from './CursorGlow'
// import type { Product } from '@/types/product'

// export default function Hero({ product }: { product: Product }) {
//   const notes = (product.scent_profile ?? []).slice(0, 3)

//   return (
//     <section className="relative flex min-h-screen items-center overflow-hidden bg-[#0A0908] text-[#F4F1EA]">
//       <Image
//         src="/image-poster-2.png"
//         alt={product.name}
//         fill
//         priority
//         className="object-cover opacity-60"
//       />
//       <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/70 to-[#0A0908]/20" />
//       <CursorGlow />

//       <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
//         <motion.p
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           className="text-sm uppercase tracking-[0.2em] text-bronze"
//         >
//           Eau de Parfum
//         </motion.p>

//         <motion.h1
//           initial={{ opacity: 0, y: 24 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.9, delay: 0.1 }}
//           className="mt-5 max-w-2xl font-display text-5xl italic leading-tight sm:text-6xl"
//         >
//           Wear a fragrance that becomes your presence.
//         </motion.h1>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.9, delay: 0.3 }}
//           className="mt-6 max-w-md text-[#C9C2B4]"
//         >
//           {product.tagline} {product.size_ml}ml · {product.concentration_pct}% concentration.
//         </motion.p>

//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.9, delay: 0.5 }}
//           className="mt-8"
//         >
//           <Link
//             href={`/products/${product.slug}`}
//             className="inline-block bg-[#F4F1EA] px-8 py-4 text-sm text-[#0A0908] transition-opacity hover:opacity-90"
//           >
//             Shop now
//           </Link>
//         </motion.div>
//       </div>

//       {notes.length > 0 && (
//         <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-black/20 backdrop-blur-sm">
//           <div className="mx-auto flex max-w-6xl gap-12 px-6 py-4 text-sm text-[#C9C2B4] sm:gap-16">
//             {notes.map((note) => (
//               <span key={note}>{note}</span>
//             ))}
//           </div>
//         </div>
//       )}
//     </section>
//   )
// }




'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import CursorGlow from './CursorGlow'
import type { Product } from '@/types/product'

export default function Hero({ product }: { product: Product }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const notes = (product.scent_profile ?? []).slice(0, 3)

  const stripItems = notes.map((label, i) => ({
    label,
    image:
      i === 0
        ? '/hero-image-1.jpg'
        : i === notes.length - 1
          ? '/image-2.webp'
          : null,
  }))

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    // Don't autoplay for people who've asked for reduced motion — the poster
    // frame (a still from the bottle shoot) stands in as a static hero instead.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      return
    }
    video.play().catch(() => {
      // Autoplay can be blocked by the browser — the poster frame covers this case.
    })
  }, [])

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#0A0908] text-[#F4F1EA]">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        poster="/image-poster-2.png"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/65 to-[#0A0908]/25" />
      <CursorGlow />

      <div className="relative z-10 flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 pt-24 lg:grid-cols-[1.5fr_1fr] lg:items-start lg:pt-0">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="max-w-2xl font-display text-5xl font-medium leading-[1.1] sm:text-6xl lg:text-7xl"
          >
            Wear a fragrance that becomes your presence.
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="max-w-xs lg:pt-3"
          >
            {product.tagline && (
              <div className="flex items-start gap-3">
                <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze" />
                <p className="font-display text-2xl italic leading-snug sm:text-3xl">
                  {product.tagline}
                </p>
              </div>
            )}
            <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-[#C9C2B4]">{product.description}</p>
            <Link
              href={`/products/${product.slug}`}
              className="mt-6 inline-block rounded-full bg-[#F4F1EA] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-[#0A0908] transition-all duration-300 hover:scale-105 hover:opacity-90"
            >
              Shop now
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-10 hidden justify-center pb-4 lg:flex"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="h-10 w-px bg-white/20" />
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-1.5 w-1.5 rounded-full bg-bronze"
          />
        </div>
      </motion.div>

      {stripItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.4 }}
          className="relative z-10 mt-auto px-6 pb-10 sm:pb-14"
        >
          <div className="mx-auto flex max-w-6xl items-end">
            {stripItems.map((item, i) => (
              <div key={item.label} className="contents">
                <div className="flex items-end gap-3">
                  {item.image && (
                    <div className="h-24 w-20 overflow-hidden rounded-xl sm:h-28 sm:w-24">
                      <Image
                        src={item.image}
                        alt=""
                        width={96}
                        height={112}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <span className="pb-2 font-display text-base sm:text-lg">{item.label}</span>
                </div>
                {i < stripItems.length - 1 && (
                  <span className="mx-4 mb-3 h-px flex-1 self-center bg-white/30 sm:mb-4" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </section>
  )
}