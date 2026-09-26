// 'use client'

// import { Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'

// function SuccessContent() {
//   const order = useSearchParams().get('order')

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
//       <p className="font-display text-3xl italic">Thank you.</p>
//       <p className="mt-4 max-w-md text-muted leading-relaxed">
//         We've received your payment{order ? ` for order ${order}` : ''}. You'll get a confirmation
//         email shortly with your order details.
//       </p>
//       <Link href="/products/imperial-wood" className="mt-8 text-sm underline underline-offset-4">
//         Back to Imperial Wood
//       </Link>
//     </div>
//   )
// }

// export default function SuccessPage() {
//   return (
//     <Suspense fallback={null}>
//       <SuccessContent />
//     </Suspense>
//   )
// }


'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function SuccessContent() {
  const params = useSearchParams()
  const order = params.get('order')
  const isCod = params.get('method') === 'cod'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <p className="font-display text-3xl italic">Thank you.</p>
      <p className="mt-4 max-w-md text-muted leading-relaxed">
        {isCod ? (
          <>
            Your order{order ? ` ${order}` : ''} is confirmed. Pay in cash when it arrives at your
            door — you'll get a confirmation email shortly.
          </>
        ) : (
          <>
            We've received your payment{order ? ` for order ${order}` : ''}. You'll get a
            confirmation email shortly with your order details.
          </>
        )}
      </p>
      <Link href="/products/imperial-wood" className="mt-8 text-sm underline underline-offset-4">
        Back to Imperial Wood
      </Link>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessContent />
    </Suspense>
  )
}