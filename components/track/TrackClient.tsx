// 'use client'

// import { useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import {
//   AlertTriangle,
//   ArrowLeft,
//   Check,
//   ClipboardCheck,
//   Copy,
//   ExternalLink,
//   MessageCircle,
//   Package,
//   PackageCheck,
//   Truck,
// } from 'lucide-react'
// import { formatRupees } from '@/lib/format'
// import { SUPPORT_WHATSAPP } from '@/lib/fulfillment-config'
// import type { TrackDetail, TrackSummary } from '@/types/track'

// const STEP_ICONS = {
//   confirmed: ClipboardCheck,
//   shipped: Package,
//   out_for_delivery: Truck,
//   delivered: PackageCheck,
// } as const

// const fmtDate = (iso: string) =>
//   new Date(iso).toLocaleDateString('en-IN', {
//     day: 'numeric',
//     month: 'short',
//     year: 'numeric',
//     timeZone: 'Asia/Kolkata',
//   })

// // Courier timestamps vary in format — show a friendly date when it parses,
// // otherwise show exactly what the courier sent.
// const fmtEvent = (t: string | null) => {
//   if (!t) return ''
//   const ms = Date.parse(t)
//   return Number.isNaN(ms)
//     ? t
//     : new Date(ms).toLocaleString('en-IN', {
//         day: 'numeric',
//         month: 'short',
//         hour: 'numeric',
//         minute: '2-digit',
//         timeZone: 'Asia/Kolkata',
//       })
// }

// const waLink = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hi, I need help with my order.')}`

// const fade = {
//   initial: { opacity: 0, y: 10 },
//   animate: { opacity: 1, y: 0 },
//   exit: { opacity: 0, y: -6 },
//   transition: { duration: 0.3 },
// }

// export default function TrackClient() {
//   const [identifier, setIdentifier] = useState('')
//   const [orderNumber, setOrderNumber] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')

//   const [list, setList] = useState<TrackSummary[] | null>(null)
//   const [detail, setDetail] = useState<TrackDetail | null>(null)
//   const [copied, setCopied] = useState(false)

//   async function loadDetail(number: string, id = identifier) {
//     setLoading(true)
//     setError('')
//     try {
//       const res = await fetch('/api/track/order', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ identifier: id, orderNumber: number }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(json.error ?? 'Could not load this order.')
//       setDetail(json.order)
//     } catch (e) {
//       setError(e instanceof Error ? e.message : 'Could not load this order.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   async function search(e: React.FormEvent) {
//     e.preventDefault()
//     setLoading(true)
//     setError('')
//     setDetail(null)
//     setList(null)
//     try {
//       const res = await fetch('/api/track', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ identifier, orderNumber }),
//       })
//       const json = await res.json().catch(() => ({}))
//       if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.')
//       const orders: TrackSummary[] = json.orders
//       setList(orders)
//       // Exactly one match → skip the list and show it straight away.
//       if (orders.length === 1) await loadDetail(orders[0].orderNumber, identifier)
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   function reset() {
//     setDetail(null)
//     setList(null)
//     setError('')
//   }

//   async function copyAwb(awb: string) {
//     await navigator.clipboard.writeText(awb)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 1600)
//   }

//   const showForm = !list && !detail
//   const multiple = (list?.length ?? 0) > 1

//   return (
//     <div>
//       <h1 className="font-display text-3xl italic">Track your order</h1>
//       <p className="mt-2 text-muted">
//         Enter the mobile number or email you used at checkout.
//       </p>

//       <AnimatePresence mode="wait">
//         {/* ---------------- search form ---------------- */}
//         {showForm && (
//           <motion.form key="form" onSubmit={search} {...fade} className="mt-8 space-y-5">
//             <div>
//               <label htmlFor="identifier" className="text-sm text-muted">
//                 Mobile number or email
//               </label>
//               <input
//                 id="identifier"
//                 value={identifier}
//                 onChange={(e) => setIdentifier(e.target.value)}
//                 autoComplete="email"
//                 inputMode="email"
//                 className="mt-1 w-full border border-hair bg-paper px-3 py-3 outline-none focus:border-ink"
//               />
//             </div>
//             <div>
//               <label htmlFor="orderNumber" className="text-sm text-muted">
//                 Order number <span className="text-xs">(optional — helps if you’ve ordered more than once)</span>
//               </label>
//               <input
//                 id="orderNumber"
//                 value={orderNumber}
//                 onChange={(e) => setOrderNumber(e.target.value)}
//                 placeholder="TAAORA-000123"
//                 className="mt-1 w-full border border-hair bg-paper px-3 py-3 outline-none focus:border-ink"
//               />
//             </div>

//             {error && <p className="text-sm text-red-700">{error}</p>}

//             <button
//               type="submit"
//               disabled={loading || !identifier.trim()}
//               className="w-full bg-ink py-4 text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
//             >
//               {loading ? 'Looking up…' : 'Track order'}
//             </button>
//           </motion.form>
//         )}

//         {/* ---------------- no results ---------------- */}
//         {list && list.length === 0 && !detail && (
//           <motion.div key="empty" {...fade} className="mt-8 border border-hair p-6">
//             <p className="font-display text-lg italic">We couldn’t find an order.</p>
//             <p className="mt-2 text-sm text-muted">
//               Check the number or email for typos — it must match what you entered at checkout. Orders
//               appear here once payment is confirmed.
//             </p>
//             <div className="mt-5 flex flex-wrap gap-4 text-sm">
//               <button onClick={reset} className="underline underline-offset-4">
//                 Try again
//               </button>
//               <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-bronze">
//                 <MessageCircle className="h-4 w-4" /> Message us
//               </a>
//             </div>
//           </motion.div>
//         )}

//         {/* ---------------- single match but detail failed to load ---------------- */}
//         {list && list.length === 1 && !detail && !loading && (
//           <motion.div key="detail-error" {...fade} className="mt-8 border border-hair p-6">
//             <p className="text-sm text-red-700">{error || 'Could not load this order.'}</p>
//             <button onClick={reset} className="mt-4 text-sm underline underline-offset-4">
//               Try again
//             </button>
//           </motion.div>
//         )}

//         {/* ---------------- list of orders ---------------- */}
//         {list && multiple && !detail && (
//           <motion.div key="list" {...fade} className="mt-8">
//             <button onClick={reset} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
//               <ArrowLeft className="h-4 w-4" /> Search again
//             </button>
//             <p className="mt-5 text-sm text-muted">
//               We found {list.length} orders. Select the one you want to track.
//             </p>
//             {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
//             <ul className="mt-4 space-y-3">
//               {list.map((o) => (
//                 <li key={o.orderNumber}>
//                   <button
//                     disabled={loading}
//                     onClick={() => loadDetail(o.orderNumber)}
//                     className="w-full border border-hair p-4 text-left transition-colors hover:border-ink disabled:opacity-60"
//                   >
//                     <div className="flex items-center justify-between gap-3">
//                       <span className="font-medium">{o.orderNumber}</span>
//                       <span className="bg-hair/60 px-2 py-0.5 text-xs">{o.stageLabel}</span>
//                     </div>
//                     <p className="mt-1 text-sm text-muted">
//                       {fmtDate(o.placedAt)} · {o.items} · {formatRupees(o.totalPaise)}
//                     </p>
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </motion.div>
//         )}

//         {/* ---------------- detail ---------------- */}
//         {detail && (
//           <motion.div key="detail" {...fade} className="mt-8">
//             <button onClick={multiple ? () => setDetail(null) : reset} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
//               <ArrowLeft className="h-4 w-4" /> {multiple ? 'All orders' : 'Search again'}
//             </button>

//             <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
//               <h2 className="font-display text-2xl">{detail.orderNumber}</h2>
//               <span className="text-sm text-muted">Placed {fmtDate(detail.placedAt)}</span>
//             </div>
//             <p className="mt-1 text-sm text-muted">
//               {detail.items} · {formatRupees(detail.totalPaise)} ·{' '}
//               {detail.paymentMethod === 'cod' ? 'Pay on delivery' : 'Paid online'}
//             </p>

//             {/* status message */}
//             <div
//               className={`mt-6 flex gap-3 border-l-2 px-4 py-3 text-sm leading-relaxed ${
//                 detail.alert || detail.stage === 'cancelled'
//                   ? 'border-amber-600 bg-amber-50'
//                   : 'border-bronze bg-hair/30'
//               }`}
//             >
//               {(detail.alert || detail.stage === 'cancelled') && (
//                 <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
//               )}
//               <p>{detail.message}</p>
//             </div>

//             {/* timeline */}
//             {detail.steps.length > 0 && (
//               <ol className="mt-8">
//                 {detail.steps.map((s, i) => {
//                   const Icon = STEP_ICONS[s.key]
//                   const done = s.state === 'done'
//                   const current = s.state === 'current'
//                   const last = i === detail.steps.length - 1
//                   return (
//                     <li key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
//                       {!last && (
//                         <span
//                           className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px ${
//                             done ? 'bg-bronze' : 'bg-hair'
//                           }`}
//                         />
//                       )}
//                       <span
//                         className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
//                           done
//                             ? 'border-bronze bg-bronze text-white'
//                             : current
//                               ? 'border-bronze bg-paper text-bronze'
//                               : 'border-hair bg-paper text-muted/60'
//                         }`}
//                       >
//                         {current && (
//                           <span className="absolute inset-0 animate-ping rounded-full border border-bronze/40" />
//                         )}
//                         <Icon className="h-[18px] w-[18px]" />
//                       </span>
//                       <div className="pt-1.5">
//                         <p className={`text-sm font-medium ${s.state === 'upcoming' ? 'text-muted' : ''}`}>
//                           {s.label}
//                         </p>
//                         {s.at && s.state !== 'upcoming' && (
//                           <p className="text-xs text-muted">{fmtDate(s.at)}</p>
//                         )}
//                       </div>
//                     </li>
//                   )
//                 })}
//               </ol>
//             )}

//             {/* shipment */}
//             {detail.shipment && (
//               <div className="mt-8 border border-hair p-4">
//                 <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
//                   <div>
//                     <p className="text-xs uppercase tracking-wide text-muted">
//                       {detail.shipment.courier ?? 'Courier'} · AWB
//                     </p>
//                     <p className="mt-0.5 font-medium">{detail.shipment.awb}</p>
//                   </div>
//                   <div className="flex items-center gap-4">
//                     <button
//                       onClick={() => copyAwb(detail.shipment!.awb)}
//                       className="flex items-center gap-1.5 text-muted hover:text-ink"
//                     >
//                       {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
//                       {copied ? 'Copied' : 'Copy'}
//                     </button>
//                     {detail.shipment.link && (
//                       <a
//                         href={detail.shipment.link}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="flex items-center gap-1.5 text-bronze hover:underline"
//                       >
//                         Courier site <ExternalLink className="h-3.5 w-3.5" />
//                       </a>
//                     )}
//                   </div>
//                 </div>
//                 {detail.live?.edd && (
//                   <p className="mt-3 border-t border-hair pt-3 text-sm text-muted">
//                     Expected delivery: <span className="text-ink">{detail.live.edd}</span>
//                   </p>
//                 )}
//               </div>
//             )}

//             {/* live courier events */}
//             {detail.live && detail.live.events.length > 0 && (
//               <div className="mt-8">
//                 <h3 className="text-xs uppercase tracking-wide text-muted">Courier updates</h3>
//                 <ul className="mt-3 space-y-4 border-l border-hair pl-5">
//                   {detail.live.events.slice(0, 12).map((ev, i) => (
//                     <li key={i} className="relative text-sm">
//                       <span
//                         className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ${
//                           i === 0 ? 'bg-bronze' : 'bg-hair'
//                         }`}
//                       />
//                       <p className={i === 0 ? 'font-medium' : ''}>{ev.message ?? ev.status}</p>
//                       <p className="text-xs text-muted">
//                         {[ev.location, fmtEvent(ev.time)].filter(Boolean).join(' · ')}
//                       </p>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}

//             {detail.liveUnavailable && (
//               <p className="mt-6 text-sm text-muted">
//                 Detailed courier scans aren’t available right now — your parcel is still moving. Check again
//                 a little later{detail.shipment?.link ? ' or use the courier site above' : ''}.
//               </p>
//             )}

//             {detail.destination && (
//               <p className="mt-8 text-sm text-muted">Delivering to {detail.destination}</p>
//             )}

//             <a
//               href={waLink}
//               target="_blank"
//               rel="noreferrer"
//               className="mt-6 inline-flex items-center gap-2 text-sm text-bronze hover:underline"
//             >
//               <MessageCircle className="h-4 w-4" /> Need help with this order?
//             </a>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* loading state while the single-match detail loads */}
//       {loading && !showForm && !detail && !multiple && (
//         <p className="mt-8 text-sm text-muted">Loading your order…</p>
//       )}
//     </div>
//   )
// }





'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  ClipboardCheck,
  Copy,
  ExternalLink,
  MessageCircle,
  Package,
  PackageCheck,
  Truck,
} from 'lucide-react'
import { formatRupees } from '@/lib/format'
import { SUPPORT_WHATSAPP } from '@/lib/fulfillment-config'
import type { TrackDetail, TrackSummary } from '@/types/track'

const STEP_ICONS = {
  confirmed: ClipboardCheck,
  shipped: Package,
  out_for_delivery: Truck,
  delivered: PackageCheck,
} as const

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Kolkata',
  })

// Courier timestamps vary in format — show a friendly date when it parses,
// otherwise show exactly what the courier sent.
const fmtEvent = (t: string | null) => {
  if (!t) return ''
  const ms = Date.parse(t)
  return Number.isNaN(ms)
    ? t
    : new Date(ms).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      })
}

const waLink = `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent('Hi, I need help with my order.')}`

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.3 },
}

export default function TrackClient() {
  const [identifier, setIdentifier] = useState('')
  const [orderNumber, setOrderNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [list, setList] = useState<TrackSummary[] | null>(null)
  const [detail, setDetail] = useState<TrackDetail | null>(null)
  const [copied, setCopied] = useState(false)

  async function loadDetail(number: string, id = identifier) {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/track/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id, orderNumber: number }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? 'Could not load this order.')
      setDetail(json.order)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load this order.')
    } finally {
      setLoading(false)
    }
  }

  async function search(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDetail(null)
    setList(null)
    try {
      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, orderNumber }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json.error ?? 'Something went wrong. Please try again.')
      const orders: TrackSummary[] = json.orders
      setList(orders)
      // Exactly one match → the server already sent its full detail.
      if (json.detail) setDetail(json.detail)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setDetail(null)
    setList(null)
    setError('')
  }

  async function copyAwb(awb: string) {
    await navigator.clipboard.writeText(awb)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  const showForm = !list && !detail
  const multiple = (list?.length ?? 0) > 1

  return (
    <div>
      <h1 className="font-display text-3xl italic">Track your order</h1>
      <p className="mt-2 text-muted">
        Enter the mobile number or email you used at checkout.
      </p>

      <AnimatePresence mode="wait">
        {/* ---------------- search form ---------------- */}
        {showForm && (
          <motion.form key="form" onSubmit={search} {...fade} className="mt-8 space-y-5">
            <div>
              <label htmlFor="identifier" className="text-sm text-muted">
                Mobile number or email
              </label>
              <input
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="email"
                inputMode="email"
                className="mt-1 w-full border border-hair bg-paper px-3 py-3 outline-none focus:border-ink"
              />
            </div>
            <div>
              <label htmlFor="orderNumber" className="text-sm text-muted">
                Order number <span className="text-xs">(optional — helps if you’ve ordered more than once)</span>
              </label>
              <input
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="TAAORA-000123"
                className="mt-1 w-full border border-hair bg-paper px-3 py-3 outline-none focus:border-ink"
              />
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <button
              type="submit"
              disabled={loading || !identifier.trim()}
              className="w-full bg-ink py-4 text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Looking up…' : 'Track order'}
            </button>
          </motion.form>
        )}

        {/* ---------------- no results ---------------- */}
        {list && list.length === 0 && !detail && (
          <motion.div key="empty" {...fade} className="mt-8 border border-hair p-6">
            <p className="font-display text-lg italic">We couldn’t find an order.</p>
            <p className="mt-2 text-sm text-muted">
              Check the number or email for typos — it must match what you entered at checkout. Orders
              appear here once payment is confirmed.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-sm">
              <button onClick={reset} className="underline underline-offset-4">
                Try again
              </button>
              <a href={waLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-bronze">
                <MessageCircle className="h-4 w-4" /> Message us
              </a>
            </div>
          </motion.div>
        )}

        {/* ---------------- single match but detail failed to load ---------------- */}
        {list && list.length === 1 && !detail && !loading && (
          <motion.div key="detail-error" {...fade} className="mt-8 border border-hair p-6">
            <p className="text-sm text-red-700">{error || 'Could not load this order.'}</p>
            <button onClick={reset} className="mt-4 text-sm underline underline-offset-4">
              Try again
            </button>
          </motion.div>
        )}

        {/* ---------------- list of orders ---------------- */}
        {list && multiple && !detail && (
          <motion.div key="list" {...fade} className="mt-8">
            <button onClick={reset} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> Search again
            </button>
            <p className="mt-5 text-sm text-muted">
              We found {list.length} orders. Select the one you want to track.
            </p>
            {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
            <ul className="mt-4 space-y-3">
              {list.map((o) => (
                <li key={o.orderNumber}>
                  <button
                    disabled={loading}
                    onClick={() => loadDetail(o.orderNumber)}
                    className="w-full border border-hair p-4 text-left transition-colors hover:border-ink disabled:opacity-60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-medium">{o.orderNumber}</span>
                      <span className="bg-hair/60 px-2 py-0.5 text-xs">{o.stageLabel}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      {fmtDate(o.placedAt)} · {o.items} · {formatRupees(o.totalPaise)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* ---------------- detail ---------------- */}
        {detail && (
          <motion.div key="detail" {...fade} className="mt-8">
            <button onClick={multiple ? () => setDetail(null) : reset} className="flex items-center gap-1.5 text-sm text-muted hover:text-ink">
              <ArrowLeft className="h-4 w-4" /> {multiple ? 'All orders' : 'Search again'}
            </button>

            <div className="mt-5 flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-display text-2xl">{detail.orderNumber}</h2>
              <span className="text-sm text-muted">Placed {fmtDate(detail.placedAt)}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {detail.items} · {formatRupees(detail.totalPaise)} ·{' '}
              {detail.paymentMethod === 'cod' ? 'Pay on delivery' : 'Paid online'}
            </p>

            {/* status message */}
            <div
              className={`mt-6 flex gap-3 border-l-2 px-4 py-3 text-sm leading-relaxed ${
                detail.alert || detail.stage === 'cancelled'
                  ? 'border-amber-600 bg-amber-50'
                  : 'border-bronze bg-hair/30'
              }`}
            >
              {(detail.alert || detail.stage === 'cancelled') && (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              )}
              <p>{detail.message}</p>
            </div>

            {/* timeline */}
            {detail.steps.length > 0 && (
              <ol className="mt-8">
                {detail.steps.map((s, i) => {
                  const Icon = STEP_ICONS[s.key]
                  const done = s.state === 'done'
                  const current = s.state === 'current'
                  const last = i === detail.steps.length - 1
                  return (
                    <li key={s.key} className="relative flex gap-4 pb-7 last:pb-0">
                      {!last && (
                        <span
                          className={`absolute left-[19px] top-10 h-[calc(100%-2.5rem)] w-px ${
                            done ? 'bg-bronze' : 'bg-hair'
                          }`}
                        />
                      )}
                      <span
                        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          done
                            ? 'border-bronze bg-bronze text-white'
                            : current
                              ? 'border-bronze bg-paper text-bronze'
                              : 'border-hair bg-paper text-muted/60'
                        }`}
                      >
                        {current && (
                          <span className="absolute inset-0 animate-ping rounded-full border border-bronze/40" />
                        )}
                        <Icon className="h-[18px] w-[18px]" />
                      </span>
                      <div className="pt-1.5">
                        <p className={`text-sm font-medium ${s.state === 'upcoming' ? 'text-muted' : ''}`}>
                          {s.label}
                        </p>
                        {s.at && s.state !== 'upcoming' && (
                          <p className="text-xs text-muted">{fmtDate(s.at)}</p>
                        )}
                      </div>
                    </li>
                  )
                })}
              </ol>
            )}

            {/* shipment */}
            {detail.shipment && (
              <div className="mt-8 border border-hair p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted">
                      {detail.shipment.courier ?? 'Courier'} · AWB
                    </p>
                    <p className="mt-0.5 font-medium">{detail.shipment.awb}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => copyAwb(detail.shipment!.awb)}
                      className="flex items-center gap-1.5 text-muted hover:text-ink"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    {detail.shipment.link && (
                      <a
                        href={detail.shipment.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-bronze hover:underline"
                      >
                        Courier site <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
                {detail.live?.edd && (
                  <p className="mt-3 border-t border-hair pt-3 text-sm text-muted">
                    Expected delivery: <span className="text-ink">{detail.live.edd}</span>
                  </p>
                )}
              </div>
            )}

            {/* live courier events */}
            {detail.live && detail.live.events.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs uppercase tracking-wide text-muted">Courier updates</h3>
                <ul className="mt-3 space-y-4 border-l border-hair pl-5">
                  {detail.live.events.slice(0, 12).map((ev, i) => (
                    <li key={i} className="relative text-sm">
                      <span
                        className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full ${
                          i === 0 ? 'bg-bronze' : 'bg-hair'
                        }`}
                      />
                      <p className={i === 0 ? 'font-medium' : ''}>{ev.message ?? ev.status}</p>
                      <p className="text-xs text-muted">
                        {[ev.location, fmtEvent(ev.time)].filter(Boolean).join(' · ')}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detail.liveUnavailable && (
              <p className="mt-6 text-sm text-muted">
                Detailed courier scans aren’t available right now — your parcel is still moving. Check again
                a little later{detail.shipment?.link ? ' or use the courier site above' : ''}.
              </p>
            )}

            {detail.destination && (
              <p className="mt-8 text-sm text-muted">Delivering to {detail.destination}</p>
            )}

            <a
              href={waLink}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-bronze hover:underline"
            >
              <MessageCircle className="h-4 w-4" /> Need help with this order?
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* loading state while the single-match detail loads */}
      {loading && !showForm && !detail && !multiple && (
        <p className="mt-8 text-sm text-muted">Loading your order…</p>
      )}
    </div>
  )
}