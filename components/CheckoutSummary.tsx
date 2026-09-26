import Image from 'next/image'
import { formatRupees } from '@/lib/format'
import type { Product } from '@/types/product'

export default function CheckoutSummary({ product, qty }: { product: Product; qty: number }) {
  const subtotalPaise = product.sale_price_paise * qty
  const shippingPaise = 0
  const totalPaise = subtotalPaise + shippingPaise
  const image = product.images?.[0]

  const details = [
    product.size_ml ? `${product.size_ml}ml` : null,
    product.gender,
    product.concentration_pct ? `${product.concentration_pct}% concentration` : null,
  ]
    .filter(Boolean)
    .join(', ')

  return (
    <div className="border border-hair p-6 sm:p-8">
      <div className="flex gap-4 border-b border-hair pb-6">
        <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[#F5F3EE] sm:h-24 sm:w-20">
          {image ? (
            <Image src={image.url} alt={image.alt || product.name} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-center text-[10px] italic leading-tight text-muted">No image</span>
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <p className="font-display text-lg italic text-ink">{product.name}</p>
            {details && <p className="mt-1 text-xs text-muted">{details}</p>}
          </div>
          <p className="text-sm text-muted">Qty: {qty}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 text-sm">
        <div className="flex justify-between text-muted">
          <span>
            {product.name} × {qty}
          </span>
          <span>{formatRupees(subtotalPaise)}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Delivery</span>
          <span className="text-ink">Free</span>
        </div>
        <div className="flex justify-between border-t border-hair pt-3 text-base font-medium text-ink">
          <span>Total</span>
          <span>{formatRupees(totalPaise)}</span>
        </div>
      </div>
    </div>
  )
}