'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Product } from '@/types/product'

function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

export default function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const router = useRouter()
  const outOfStock = product.stock_count <= 0

  const details = [
    product.size_ml ? `${product.size_ml} ml` : null,
    product.gender,
    product.concentration_pct ? `${product.concentration_pct}% concentration` : null,
  ].filter(Boolean)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl leading-tight text-ink">{product.name}</h1>
        {product.tagline && <p className="mt-2 text-muted">{product.tagline}</p>}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-2xl text-ink">{formatRupees(product.sale_price_paise)}</span>
        {product.regular_price_paise > product.sale_price_paise && (
          <span className="text-muted line-through">{formatRupees(product.regular_price_paise)}</span>
        )}
      </div>

      {details.length > 0 && (
        <p className="text-sm text-muted">{details.join(', ')}</p>
      )}

      {product.scent_profile && product.scent_profile.length > 0 && (
        <p className="text-sm text-muted">{product.scent_profile.join(', ')}</p>
      )}

      <div className="flex items-center gap-4 border-y border-hair py-4">
        <span className="text-sm text-muted">Quantity</span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="h-8 w-8 border border-hair text-lg leading-none hover:border-ink transition-colors"
          >
            −
          </button>
          <span className="w-4 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(5, q + 1))}
            aria-label="Increase quantity"
            className="h-8 w-8 border border-hair text-lg leading-none hover:border-ink transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        disabled={outOfStock}
        onClick={() => router.push(`/checkout?qty=${qty}`)}
        className="w-full bg-ink py-4 text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {outOfStock ? 'Out of stock' : 'Buy now'}
      </button>

      {product.description && (
        <p className="text-sm leading-relaxed text-muted">{product.description}</p>
      )}
    </div>
  )
}