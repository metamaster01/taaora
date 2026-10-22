'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronRight, Inbox, RefreshCw, Search } from 'lucide-react'
import { ADMIN_FILTERS, type AdminFilter } from '@/lib/order-status'
import { formatRupees } from '@/lib/format'
import type { AdminOrder } from '@/types/order'
import StatusBadge from './StatusBadge'
import OrderDetail from './OrderDetail'
import { btnGhost, card, cardAccent, eyebrow } from './ui'

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  })

const STAT_CARDS: { key: AdminFilter; label: string; hint: string }[] = [
  { key: 'new', label: 'To ship', hint: 'Needs action' },
  { key: 'shipped', label: 'Shipped', hint: 'On the way' },
  { key: 'delivered', label: 'Delivered', hint: 'Completed' },
  { key: 'awaiting_payment', label: 'Awaiting payment', hint: 'Not paid yet' },
]

const initial = (name: string) => (name.trim()[0] ?? '?').toUpperCase()

function PayChip({ method }: { method: 'online' | 'cod' }) {
  return (
    <span
      className={`px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] ${
        method === 'cod' ? 'bg-[#A9793D]/10 text-[#7A5428]' : 'bg-hair/70 text-muted'
      }`}
    >
      {method === 'cod' ? 'COD' : 'Prepaid'}
    </span>
  )
}

export default function OrdersClient() {
  const [filter, setFilter] = useState<AdminFilter>('new')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')
  const [page, setPage] = useState(1)

  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [total, setTotal] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<AdminOrder | null>(null)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedQ(q)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams({ filter, page: String(page) })
      if (debouncedQ) params.set('q', debouncedQ)
      const res = await fetch(`/api/admin/orders?${params}`, { cache: 'no-store' })
      if (res.status === 401) {
        window.location.assign('/admin/login')
        return
      }
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Could not load orders.')
      setOrders(json.orders)
      setTotal(json.total)
      setPageSize(json.pageSize)
      setCounts(json.counts)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load orders.')
    } finally {
      setLoading(false)
    }
  }, [filter, debouncedQ, page])

  useEffect(() => {
    load()
  }, [load])

  // Escape closes the drawer; page behind it doesn't scroll while it's open.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setSelected(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [selected])

  function handleUpdated(updated: AdminOrder) {
    setSelected(updated)
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    load() // refresh counts and list membership
  }

  function pick(f: AdminFilter) {
    setFilter(f)
    setPage(1)
  }

  const lastPage = Math.max(1, Math.ceil(total / pageSize))
  const toShip = counts.new ?? 0

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className={eyebrow}>Dashboard</p>
          <h1 className="mt-1 font-display text-3xl sm:text-4xl">Orders</h1>
        </div>
        <button onClick={load} className={btnGhost}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* ---------- stat cards (also filters) ---------- */}
      <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {STAT_CARDS.map((s) => {
          const active = filter === s.key
          const n = counts[s.key] ?? 0
          const urgent = s.key === 'new' && n > 0
          return (
            <button
              key={s.key}
              onClick={() => pick(s.key)}
              aria-pressed={active}
              className={`${card} p-4 text-left transition-all sm:p-5 ${
                active ? 'border-ink shadow-[0_14px_30px_-18px_rgba(22,19,16,0.35)]' : 'hover:border-ink/40'
              }`}
            >
              {(active || urgent) && <span className={cardAccent} />}
              <span className={eyebrow}>{s.label}</span>
              <span
                className={`mt-3 block font-display text-4xl leading-none ${urgent ? 'text-bronze' : 'text-ink'}`}
              >
                {n}
              </span>
              <span className="mt-2 block text-xs text-muted">{s.hint}</span>
            </button>
          )
        })}
      </div>

      {/* ---------- toolbar ---------- */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search order no., name, phone, email or AWB"
            className="h-11 w-full border border-hair bg-white pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted/60 focus:border-ink focus:ring-1 focus:ring-ink"
          />
        </div>
        <div className="flex gap-2">
          {ADMIN_FILTERS.filter((f) => f.key === 'all' || f.key === 'cancelled').map((f) => {
            const active = filter === f.key
            return (
              <button
                key={f.key}
                onClick={() => pick(f.key)}
                aria-pressed={active}
                className={`h-11 whitespace-nowrap border px-4 text-[12px] font-medium uppercase tracking-[0.14em] transition-colors ${
                  active ? 'border-ink bg-ink text-paper' : 'border-hair bg-white text-muted hover:border-ink hover:text-ink'
                }`}
              >
                {f.label} <span className="ml-1 opacity-70">{counts[f.key] ?? 0}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* attention banner when you're looking at something else */}
      {filter !== 'new' && toShip > 0 && !debouncedQ && (
        <button
          onClick={() => pick('new')}
          className="mt-4 flex w-full items-center justify-between border-l-2 border-bronze bg-[#A9793D]/10 px-4 py-3 text-left text-sm text-[#7A5428] transition-colors hover:bg-[#A9793D]/15"
        >
          <span>
            <strong>{toShip}</strong> {toShip === 1 ? 'order is' : 'orders are'} waiting to ship
          </span>
          <span className="flex items-center gap-1 text-[12px] font-medium uppercase tracking-[0.14em]">
            View <ChevronRight className="h-3.5 w-3.5" />
          </span>
        </button>
      )}

      {error && <p className="mt-4 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

      {/* ---------- list ---------- */}
      <div className={`${card} mt-4`}>
        <span className={cardAccent} />

        <div className="hidden grid-cols-[1.15fr_1.5fr_1.1fr_1fr_1.25fr_20px] gap-4 border-b border-hair px-5 py-3 md:grid">
          {['Order', 'Customer', 'Total', 'Status', 'Tracking', ''].map((h) => (
            <span key={h} className={eyebrow}>
              {h}
            </span>
          ))}
        </div>

        {loading && orders.length === 0 &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex animate-pulse items-center gap-4 border-b border-hair px-5 py-5 last:border-b-0">
              <div className="h-9 w-9 rounded-full bg-hair" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-1/3 bg-hair" />
                <div className="h-3 w-1/2 bg-hair/70" />
              </div>
              <div className="h-5 w-20 bg-hair" />
            </div>
          ))}

        {!loading && orders.length === 0 && (
          <div className="flex flex-col items-center px-4 py-16 text-center">
            <Inbox className="h-8 w-8 text-muted/50" strokeWidth={1.25} />
            <p className="mt-3 font-display text-lg">{debouncedQ ? 'No matching orders' : 'Nothing here yet'}</p>
            <p className="mt-1 text-sm text-muted">
              {debouncedQ ? 'Try a different name, number or AWB.' : 'New orders in this view will show up here.'}
            </p>
          </div>
        )}

        {orders.map((o) => (
          <button
            key={o.id}
            onClick={() => setSelected(o)}
            className="group block w-full border-b border-l-2 border-b-hair border-l-transparent px-5 py-4 text-left transition-colors last:border-b-0 hover:border-l-bronze hover:bg-[#FAF9F6]"
          >
            {/* desktop row */}
            <div className="hidden grid-cols-[1.15fr_1.5fr_1.1fr_1fr_1.25fr_20px] items-center gap-4 md:grid">
              <span>
                <span className="block text-sm font-medium">{o.order_number}</span>
                <span className="block text-xs text-muted">{fmtDate(o.created_at)}</span>
              </span>
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hair/70 font-display text-sm">
                  {initial(o.customer_name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm">{o.customer_name}</span>
                  <span className="block text-xs text-muted">{o.customer_phone}</span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="text-sm font-medium">{formatRupees(o.total_paise)}</span>
                <PayChip method={o.payment_method} />
              </span>
              <span>
                <StatusBadge status={o.order_status} />
              </span>
              <span className="min-w-0">
                {o.awb_number ? (
                  <>
                    <span className="block truncate text-xs text-muted">{o.courier_name}</span>
                    <span className="block truncate font-mono text-xs">{o.awb_number}</span>
                  </>
                ) : (
                  <span className="text-xs text-muted">—</span>
                )}
              </span>
              <ChevronRight className="h-4 w-4 text-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-bronze" />
            </div>

            {/* mobile card */}
            <div className="md:hidden">
              <div className="flex items-start justify-between gap-3">
                <span>
                  <span className="block text-sm font-medium">{o.order_number}</span>
                  <span className="block text-xs text-muted">{fmtDate(o.created_at)}</span>
                </span>
                <StatusBadge status={o.order_status} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-hair/70 font-display text-sm">
                    {initial(o.customer_name)}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{o.customer_name}</span>
                    <span className="block text-xs text-muted">{o.customer_phone}</span>
                  </span>
                </span>
                <span className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-sm font-medium">{formatRupees(o.total_paise)}</span>
                  <PayChip method={o.payment_method} />
                </span>
              </div>
              {o.awb_number && (
                <p className="mt-3 truncate border-t border-hair pt-2 font-mono text-xs text-muted">
                  {o.courier_name} · {o.awb_number}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* ---------- pagination ---------- */}
      {total > pageSize && (
        <div className="mt-5 flex items-center justify-between">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={btnGhost}>
            Previous
          </button>
          <span className="text-[12px] uppercase tracking-[0.16em] text-muted">
            Page {page} / {lastPage}
          </span>
          <button disabled={page >= lastPage} onClick={() => setPage((p) => p + 1)} className={btnGhost}>
            Next
          </button>
        </div>
      )}

      {/* ---------- detail drawer ---------- */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              aria-label="Close"
              onClick={() => setSelected(null)}
              className="absolute inset-0 bg-[#0A0908]/55 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
            >
              <OrderDetail
                key={selected.id}
                order={selected}
                onUpdated={handleUpdated}
                onClose={() => setSelected(null)}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
