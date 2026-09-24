'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { formatRupees } from '@/lib/format'
import type { Product } from '@/types/product'

export default function PromoBanner({ product }: { product: Product }) {
  const [imageError, setImageError] = useState(false)

  const savingsPaise = product.regular_price_paise - product.sale_price_paise
  const percentOff = Math.round((savingsPaise / product.regular_price_paise) * 100)

  return (
    <section className="relative flex h-72 items-center overflow-hidden bg-white text-[#F4F1EA] sm:h-80 my-24 py-24">
      {!imageError && (
        <motion.div
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/image-4.jpeg"
            alt=""
            fill
            onError={() => setImageError(true)}
            className="object-cover"
          />
        </motion.div>
      )}
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">Limited time</p>
            <p className="mt-2 font-display text-3xl italic sm:text-4xl">
              Save {formatRupees(savingsPaise)} on Imperial Wood
            </p>
            <p className="mt-2 text-sm text-[#C9C2B4]">
              {percentOff}% off — {formatRupees(product.sale_price_paise)} instead of{' '}
              {formatRupees(product.regular_price_paise)}.
            </p>
          </div>

          <Link
            href={`/products/${product.slug}`}
            className="inline-block shrink-0 rounded-full bg-[#F4F1EA] px-8 py-3.5 text-xs font-medium uppercase tracking-[0.15em] text-[#0A0908] transition-all duration-300 hover:scale-105 hover:opacity-90"
          >
            Shop now
          </Link>
        </motion.div>
      </div>
    </section>
  )
}