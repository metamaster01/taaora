// 'use client'

// import { CreditCard, Banknote } from 'lucide-react'

// export type PaymentMethod = 'online' | 'cod'

// const options: { id: PaymentMethod; label: string; sub: string; icon: typeof CreditCard }[] = [
//   { id: 'online', label: 'Pay Online', sub: 'Card, UPI, Netbanking, EMI', icon: CreditCard },
//   { id: 'cod', label: 'Cash on Delivery', sub: 'Pay when it arrives', icon: Banknote },
// ]

// export default function PaymentMethodSelector({
//   value,
//   onChange,
// }: {
//   value: PaymentMethod
//   onChange: (method: PaymentMethod) => void
// }) {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//       {options.map((opt) => {
//         const Icon = opt.icon
//         const selected = value === opt.id
//         return (
//           <button
//             key={opt.id}
//             type="button"
//             onClick={() => onChange(opt.id)}
//             aria-pressed={selected}
//             className={`flex items-start gap-3 border p-4 text-left transition-colors ${
//               selected ? 'border-ink bg-[#F5F3EE]' : 'border-hair hover:border-ink/40'
//             }`}
//           >
//             <Icon className={`h-5 w-5 shrink-0 ${selected ? 'text-ink' : 'text-muted'}`} strokeWidth={1.5} />
//             <div className="flex-1">
//               <p className="text-sm font-medium text-ink">{opt.label}</p>
//               <p className="mt-0.5 text-xs text-muted">{opt.sub}</p>
//             </div>
//             <span
//               aria-hidden="true"
//               className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
//                 selected ? 'border-ink bg-ink' : 'border-hair bg-transparent'
//               }`}
//             />
//           </button>
//         )
//       })}
//     </div>
//   )
// }





// 'use client'

// import { CreditCard, Banknote } from 'lucide-react'
// import { COD_ENABLED } from '@/lib/config'

// export type PaymentMethod = 'online' | 'cod'

// const options: {
//   id: PaymentMethod
//   label: string
//   sub: string
//   icon: typeof CreditCard
//   disabled?: boolean
// }[] = [
//   { id: 'online', label: 'Pay Online', sub: 'Card, UPI, Netbanking, EMI', icon: CreditCard },
//   {
//     id: 'cod',
//     label: 'Cash on Delivery',
//     sub: COD_ENABLED ? 'Pay when it arrives' : 'Temporarily unavailable',
//     icon: Banknote,
//     disabled: !COD_ENABLED,
//   },
// ]

// export default function PaymentMethodSelector({
//   value,
//   onChange,
// }: {
//   value: PaymentMethod
//   onChange: (method: PaymentMethod) => void
// }) {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//       {options.map((opt) => {
//         const Icon = opt.icon
//         const selected = value === opt.id
//         return (
//           <button
//             key={opt.id}
//             type="button"
//             disabled={opt.disabled}
//             onClick={() => !opt.disabled && onChange(opt.id)}
//             aria-pressed={selected}
//             aria-disabled={opt.disabled}
//             className={`relative flex items-start gap-3 border p-4 text-left transition-colors ${
//               opt.disabled
//                 ? 'cursor-not-allowed border-hair opacity-50'
//                 : selected
//                   ? 'border-ink bg-[#F5F3EE]'
//                   : 'border-hair hover:border-ink/40'
//             }`}
//           >
//             <Icon
//               className={`h-5 w-5 shrink-0 ${selected && !opt.disabled ? 'text-ink' : 'text-muted'}`}
//               strokeWidth={1.5}
//             />
//             <div className="flex-1">
//               <p className="text-sm font-medium text-ink">{opt.label}</p>
//               <p className="mt-0.5 text-xs text-muted">{opt.sub}</p>
//             </div>
//             {opt.disabled ? (
//               <span className="absolute right-3 top-3 rounded-full bg-hair px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
//                 Coming soon
//               </span>
//             ) : (
//               <span
//                 aria-hidden="true"
//                 className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
//                   selected ? 'border-ink bg-ink' : 'border-hair bg-transparent'
//                 }`}
//               />
//             )}
//           </button>
//         )
//       })}
//     </div>
//   )
// }





'use client'

import { CreditCard, Banknote } from 'lucide-react'
import { COD_ENABLED, COD_HANDLING_FEE_PAISE } from '@/lib/config'
import { formatRupees } from '@/lib/format'

export type PaymentMethod = 'online' | 'cod'

const options: {
  id: PaymentMethod
  label: string
  sub: string
  icon: typeof CreditCard
  disabled?: boolean
}[] = [
  { id: 'online', label: 'Pay Online', sub: 'Card, UPI, Netbanking, EMI', icon: CreditCard },
  {
    id: 'cod',
    label: 'Cash on Delivery',
    sub: COD_ENABLED
      ? `Pay when it arrives · +${formatRupees(COD_HANDLING_FEE_PAISE)} handling fee`
      : 'Temporarily unavailable',
    icon: Banknote,
    disabled: !COD_ENABLED,
  },
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
            disabled={opt.disabled}
            onClick={() => !opt.disabled && onChange(opt.id)}
            aria-pressed={selected}
            aria-disabled={opt.disabled}
            className={`relative flex items-start gap-3 border p-4 text-left transition-colors ${
              opt.disabled
                ? 'cursor-not-allowed border-hair opacity-50'
                : selected
                  ? 'border-ink bg-[#F5F3EE]'
                  : 'border-hair hover:border-ink/40'
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${selected && !opt.disabled ? 'text-ink' : 'text-muted'}`}
              strokeWidth={1.5}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{opt.label}</p>
              <p className="mt-0.5 text-xs text-muted">{opt.sub}</p>
            </div>
            {opt.disabled ? (
              <span className="absolute right-3 top-3 rounded-full bg-hair px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
                Coming soon
              </span>
            ) : (
              <span
                aria-hidden="true"
                className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
                  selected ? 'border-ink bg-ink' : 'border-hair bg-transparent'
                }`}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}