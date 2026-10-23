'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatRupees } from '@/lib/format'
import type { Product } from '@/types/product'

export default function ProductShowcase({ product }: { product: Product }) {
  const hasDiscount = product.regular_price_paise > product.sale_price_paise
  const discountPercentage = hasDiscount
    ? Math.round(((product.regular_price_paise - product.sale_price_paise) / product.regular_price_paise) * 100)
    : 0

  return (
    <section id="story" className="bg-paper py-24 text-ink">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
          className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE]"
        >
          <Image
            src="/image-1.webp"
            alt={product.name}
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <p className="font-display text-3xl  text-ink">{product.name}</p>
          {product.description && (
            <p className="mt-4 max-w-md text-muted leading-relaxed">{product.description}</p>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-2xl">{formatRupees(product.sale_price_paise)}</span>
            {hasDiscount && (
              <>
                <span className="text-muted line-through">{formatRupees(product.regular_price_paise)}</span>
                <span className="rounded-full bg-[#9C3F24] px-3 py-1 text-xs font-semibold tracking-wide text-white">
                  {discountPercentage}% OFF
                </span>
              </>
            )}
          </div>

          {hasDiscount && (
            <div className="mt-5 max-w-md border-l-2 border-[#C66A3D] bg-[#F7EDE3] px-4 py-3">
              <p className="text-sm font-semibold tracking-wide text-[#74351F]">Diwali Offer</p>
              <p className="mt-1 text-sm leading-relaxed text-[#754D3B]">
                Enjoy {discountPercentage}% off for the festive season. Shop now while this offer lasts.
              </p>
            </div>
          )}

          <Link
            href={`/products/${product.slug}`}
            className="mt-8 inline-block border border-ink px-8 py-4 text-sm transition-colors hover:bg-ink hover:text-paper"
          >
            {hasDiscount ? 'Shop Now • Diwali offer' : 'View product'}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}