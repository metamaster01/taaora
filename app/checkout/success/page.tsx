// // 'use client'

// // import { Suspense } from 'react'
// // import { useSearchParams } from 'next/navigation'
// // import Link from 'next/link'

// // function SuccessContent() {
// //   const order = useSearchParams().get('order')

// //   return (
// //     <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
// //       <p className="font-display text-3xl italic">Thank you.</p>
// //       <p className="mt-4 max-w-md text-muted leading-relaxed">
// //         We've received your payment{order ? ` for order ${order}` : ''}. You'll get a confirmation
// //         email shortly with your order details.
// //       </p>
// //       <Link href="/products/imperial-wood" className="mt-8 text-sm underline underline-offset-4">
// //         Back to Imperial Wood
// //       </Link>
// //     </div>
// //   )
// // }

// // export default function SuccessPage() {
// //   return (
// //     <Suspense fallback={null}>
// //       <SuccessContent />
// //     </Suspense>
// //   )
// // }


// 'use client'

// import { Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'

// function SuccessContent() {
//   const params = useSearchParams()
//   const order = params.get('order')
//   const isCod = params.get('method') === 'cod'

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
//       <p className="font-display text-3xl ">Thank you.</p>
//       <p className="mt-4 max-w-md text-muted leading-relaxed">
//         {isCod ? (
//           <>
//             Your order{order ? ` ${order}` : ''} is confirmed. Pay in cash when it arrives at your
//             door — you'll get a confirmation email shortly.
//           </>
//         ) : (
//           <>
//             We've received your payment{order ? ` for order ${order}` : ''}. You'll get a
//             confirmation email shortly with your order details.
//           </>
//         )}
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



// 'use client'

// import { Suspense } from 'react'
// import { useSearchParams } from 'next/navigation'
// import Link from 'next/link'
// import { motion } from 'framer-motion'
// import { Mail, MessageCircle, Truck, CreditCard, Banknote } from 'lucide-react'
// import LottiePlayer from '@/components/LottiePlayer'

// const steps = [
//   { icon: Mail, label: 'Confirmation email sent' },
//   { icon: MessageCircle, label: 'WhatsApp update on the way' },
//   { icon: Truck, label: "We'll notify you once it ships" },
// ]

// function SuccessContent() {
//   const params = useSearchParams()
//   const order = params.get('order')
//   const isCod = params.get('method') === 'cod'

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-16 text-center text-ink">
//       <motion.div
//         initial={{ opacity: 0, scale: 0.85 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.5, ease: 'easeOut' }}
//       >
//         <LottiePlayer src="/process-complete.json" loop={false} className="h-32 w-32 sm:h-40 sm:w-40" />
//       </motion.div>

//       <motion.p
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.3 }}
//         className="font-display text-3xl italic"
//       >
//         Thank you.
//       </motion.p>

//       <motion.p
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.4 }}
//         className="mt-3 max-w-md text-muted leading-relaxed"
//       >
//         {isCod ? (
//           <>
//             Your order{order ? ` ${order}` : ''} is confirmed. Pay in cash when it arrives at your
//             door — you'll get a confirmation email shortly.
//           </>
//         ) : (
//           <>
//             We've received your payment{order ? ` for order ${order}` : ''}. You'll get a
//             confirmation email shortly with your order details.
//           </>
//         )}
//       </motion.p>

//       {order && (
//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: 0.5 }}
//           className="mt-8 flex items-center gap-3 border-l-2 border-bronze bg-hair/30 px-5 py-3 text-left"
//         >
//           {isCod ? (
//             <Banknote className="h-5 w-5 shrink-0 text-bronze" />
//           ) : (
//             <CreditCard className="h-5 w-5 shrink-0 text-bronze" />
//           )}
//           <div>
//             <p className="text-xs uppercase tracking-wide text-muted">Order number</p>
//             <p className="font-display text-base">{order}</p>
//           </div>
//         </motion.div>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.4, delay: 0.6 }}
//         className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8"
//       >
//         {steps.map(({ icon: Icon, label }) => (
//           <div
//             key={label}
//             className="flex items-center gap-2 text-sm text-muted sm:flex-col sm:text-center"
//           >
//             <Icon className="h-4 w-4 shrink-0 text-bronze sm:h-5 sm:w-5" />
//             <span>{label}</span>
//           </div>
//         ))}
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.4, delay: 0.75 }}
//       >
//         <Link
//           href="/products/imperial-wood"
//           className="mt-10 inline-block text-sm underline underline-offset-4"
//         >
//           Back to Imperial Wood
//         </Link>
//       </motion.div>
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
import { motion } from 'framer-motion'
import { Mail, Truck, CreditCard, Banknote, Package } from 'lucide-react'
import LottiePlayer from '@/components/LottiePlayer'

const steps = [
  { icon: Mail, label: 'Confirmation email sent' },
  { icon: Truck, label: "We'll notify you once it ships" },
  { icon: Package, label: 'Your order will be delivered in 4–5 days' },
]

function SuccessContent() {
  const params = useSearchParams()
  const order = params.get('order')
  const isCod = params.get('method') === 'cod'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-16 text-center text-ink">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <LottiePlayer src="/process-complete.json" loop={false} className="h-32 w-32 sm:h-40 sm:w-40" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="font-display text-3xl italic"
      >
        Thank you.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="mt-3 max-w-md text-muted leading-relaxed"
      >
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
      </motion.p>

      {order && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-8 flex items-center gap-3 border-l-2 border-bronze bg-hair/30 px-5 py-3 text-left"
        >
          {isCod ? (
            <Banknote className="h-5 w-5 shrink-0 text-bronze" />
          ) : (
            <CreditCard className="h-5 w-5 shrink-0 text-bronze" />
          )}
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">Order number</p>
            <p className="font-display text-base">{order}</p>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-8"
      >
        {steps.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-sm text-muted sm:flex-col sm:text-center"
          >
            <Icon className="h-4 w-4 shrink-0 text-bronze sm:h-5 sm:w-5" />
            <span>{label}</span>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.75 }}
      >
        <Link
          href="/products/imperial-wood"
          className="mt-10 inline-block text-sm underline underline-offset-4"
        >
          Back to Imperial Wood
        </Link>
      </motion.div>
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