'use client'

import { CreditCard, Banknote } from 'lucide-react'

export type PaymentMethod = 'online' | 'cod'

const options: { id: PaymentMethod; label: string; sub: string; icon: typeof CreditCard }[] = [
  { id: 'online', label: 'Pay Online', sub: 'Card, UPI, Netbanking, EMI', icon: CreditCard },
  { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when it arrives', icon: Banknote },
]

export default function PaymentMethodSelector({
  value,
  onChange,
}: {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {options.map((opt) => {
        const Icon = opt.icon
        const selected = value === opt.id
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={selected}
            className={`flex items-start gap-3 border p-4 text-left transition-colors ${
              selected ? 'border-ink bg-[#F5F3EE]' : 'border-hair hover:border-ink/40'
            }`}
          >
            <Icon className={`h-5 w-5 shrink-0 ${selected ? 'text-ink' : 'text-muted'}`} strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{opt.label}</p>
              <p className="mt-0.5 text-xs text-muted">{opt.sub}</p>
            </div>
            <span
              aria-hidden="true"
              className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                selected ? 'border-ink bg-ink' : 'border-hair bg-transparent'
              }`}
            />
          </button>
        )
      })}
    </div>
  )
}