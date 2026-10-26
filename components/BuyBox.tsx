// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import type { Product } from '@/types/product'

// function formatRupees(paise: number) {
//   return `₹${(paise / 100).toLocaleString('en-IN')}`
// }

// export default function BuyBox({ product }: { product: Product }) {
//   const [qty, setQty] = useState(1)
//   const router = useRouter()
//   const outOfStock = product.stock_count <= 0
//   const discountPct = product.regular_price_paise > product.sale_price_paise
//     ? Math.round(((product.regular_price_paise - product.sale_price_paise) / product.regular_price_paise) * 100)
//     : 0

//   const details = [
//     product.size_ml ? `${product.size_ml} ml` : null,
//     product.gender,
//     product.concentration_pct ? `${product.concentration_pct}% concentration` : null,
//   ].filter(Boolean)

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="font-display text-4xl leading-tight text-ink">{product.name}</h1>
//         {product.tagline && <p className="mt-2 text-muted">{product.tagline}</p>}
//       </div>

//       <div className="flex flex-wrap items-baseline gap-3">
//         <span className="font-display text-2xl text-ink">{formatRupees(product.sale_price_paise)}</span>
//         {product.regular_price_paise > product.sale_price_paise && (
//           <span className="text-muted line-through">{formatRupees(product.regular_price_paise)}</span>
//         )}
//         {discountPct > 0 && (
//           <span className="bg-ink px-2 py-1 text-xs font-medium uppercase tracking-wide text-paper">
//             {discountPct}% off
//           </span>
//         )}
//       </div>

//       <div className="border border-hair bg-paper p-3 text-sm">
//         <p className="font-medium text-ink">
//           Diwali offer{discountPct > 0 ? ` — save ${discountPct}%` : ' — festive savings'}
//         </p>
//         <p className={`mt-1 ${outOfStock ? 'text-muted' : 'text-amber-700'}`}>
//           {outOfStock
//             ? 'Currently out of stock'
//             : `Sale-time stock: ${product.stock_count} available${product.stock_count <= 5 ? ' — order soon!' : ''}`}
//         </p>
//       </div>

//       {details.length > 0 && (
//         <p className="text-sm text-muted">{details.join(', ')}</p>
//       )}

//       {product.scent_profile && product.scent_profile.length > 0 && (
//         <p className="text-sm text-muted">{product.scent_profile.join(', ')}</p>
//       )}

//       <div className="flex items-center gap-4 border-y border-hair py-4">
//         <span className="text-sm text-muted">Quantity</span>
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setQty((q) => Math.max(1, q - 1))}
//             aria-label="Decrease quantity"
//             className="h-8 w-8 border border-hair text-lg leading-none hover:border-ink transition-colors"
//           >
//             −
//           </button>
//           <span className="w-4 text-center">{qty}</span>
//           <button
//             onClick={() => setQty((q) => Math.min(5, q + 1))}
//             aria-label="Increase quantity"
//             className="h-8 w-8 border border-hair text-lg leading-none hover:border-ink transition-colors"
//           >
//             +
//           </button>
//         </div>
//       </div>

//       <button
//         disabled={outOfStock}
//         onClick={() => router.push(`/checkout?qty=${qty}`)}
//         className="w-full bg-ink py-4 text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
//       >
//         {outOfStock ? 'Out of stock' : 'Buy now'}
//       </button>

//       {product.description && (
//         <p className="text-sm leading-relaxed text-muted">{product.description}</p>
//       )}
//     </div>
//   )
// }




'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { Product } from '@/types/product'

function formatRupees(paise: number) {
  return `₹${(paise / 100).toLocaleString('en-IN')}`
}

export default function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const outOfStock = product.stock_count <= 0
  const checkoutHref = `/checkout?qty=${qty}`
  const discountPct = product.regular_price_paise > product.sale_price_paise
    ? Math.round(((product.regular_price_paise - product.sale_price_paise) / product.regular_price_paise) * 100)
    : 0

  const details = [
    product.size_ml ? `${product.size_ml} ml` : null,
    product.gender,
    product.concentration_pct ? `${product.concentration_pct}% concentration` : null,
  ].filter(Boolean)

  // Warm up the checkout route while the shopper is still reading the page,
  // so by the time they tap "Buy now" most of the work is already done.
  useEffect(() => {
    if (!outOfStock) router.prefetch(checkoutHref)
  }, [router, checkoutHref, outOfStock])

  function goToCheckout() {
    if (isPending || outOfStock) return
    // startTransition keeps `isPending` true until the next page is actually
    // ready to show — so the button reacts instantly and never looks frozen.
    startTransition(() => {
      router.push(checkoutHref)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-4xl leading-tight text-ink">{product.name}</h1>
        {product.tagline && <p className="mt-2 text-muted">{product.tagline}</p>}
      </div>

      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-2xl text-ink">{formatRupees(product.sale_price_paise)}</span>
        {product.regular_price_paise > product.sale_price_paise && (
          <span className="text-muted line-through">{formatRupees(product.regular_price_paise)}</span>
        )}
        {discountPct > 0 && (
          <span className="bg-ink px-2 py-1 text-xs font-medium uppercase tracking-wide text-paper">
            {discountPct}% off
          </span>
        )}
      </div>

      <div className="border border-hair bg-paper p-3 text-sm">
        <p className="font-medium text-ink">
          Diwali offer{discountPct > 0 ? ` — save ${discountPct}%` : ' — festive savings'}
        </p>
        <p className={`mt-1 ${outOfStock ? 'text-muted' : 'text-amber-700'}`}>
          {outOfStock
            ? 'Currently out of stock'
            : `Sale-time stock: ${product.stock_count} available${product.stock_count <= 5 ? ' — order soon!' : ''}`}
        </p>
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
            disabled={isPending}
            aria-label="Decrease quantity"
            className="h-8 w-8 border border-hair text-lg leading-none hover:border-ink transition-colors disabled:opacity-40"
          >
            −
          </button>
          <span className="w-4 text-center">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(5, q + 1))}
            disabled={isPending}
            aria-label="Increase quantity"
            className="h-8 w-8 border border-hair text-lg leading-none hover:border-ink transition-colors disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      <button
        disabled={outOfStock || isPending}
        onClick={goToCheckout}
        // Start loading on hover / touch, a moment before the actual click lands.
        onMouseEnter={() => !outOfStock && router.prefetch(checkoutHref)}
        onTouchStart={() => !outOfStock && router.prefetch(checkoutHref)}
        aria-busy={isPending}
        className={`flex w-full items-center justify-center gap-2.5 bg-ink py-4 text-paper transition-opacity ${
          outOfStock
            ? 'cursor-not-allowed opacity-40'
            : isPending
              ? 'cursor-wait opacity-90'
              : 'hover:opacity-90'
        }`}
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {outOfStock ? 'Out of stock' : isPending ? 'Taking you to checkout…' : 'Buy now'}
      </button>

      {product.description && (
        <p className="text-sm leading-relaxed text-muted">{product.description}</p>
      )}
    </div>
  )
}