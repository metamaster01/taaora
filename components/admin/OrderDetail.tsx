'use client'

import { useState } from 'react'
import { Check, Copy, Mail, MessageCircle, Phone, X } from 'lucide-react'
import { formatRupees } from '@/lib/format'
import type { OrderStatus } from '@/lib/order-status'
import type { AdminOrder } from '@/types/order'
import StatusBadge from './StatusBadge'
import { btnDanger, btnGhost, btnPrimary, eyebrow, inputCls, textareaCls } from './ui'

const COURIERS = ['Delhivery', 'Blue Dart', 'DTDC', 'Xpressbees', 'Ecom Express', 'Ekart', 'Shadowfax', 'India Post']

const fmt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        timeZone: 'Asia/Kolkata',
      })
    : '—'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hair px-6 py-6 sm:px-8">
      <h3 className="flex items-center gap-3">
        <span className="h-px w-5 bg-bronze" />
        <span className={eyebrow}>{title}</span>
      </h3>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function Progress({ status }: { status: OrderStatus }) {
  if (status === 'cancelled' || status === 'pending') return null
  const idx = status === 'confirmed' ? 0 : status === 'shipped' ? 1 : 2
  const steps = ['Confirmed', 'Shipped', 'Delivered']
  return (
    <ol className="flex items-center px-6 pb-6 sm:px-8">
      {steps.map((s, i) => {
        const done = i < idx || status === 'delivered'
        const reached = i <= idx
        return (
          <li key={s} className="flex flex-1 items-center last:flex-none">
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] ${
                reached ? 'bg-bronze text-white' : 'border border-hair text-muted'
              }`}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span className={`ml-2 text-xs ${reached ? 'text-ink' : 'text-muted'}`}>{s}</span>
            {i < steps.length - 1 && <span className={`mx-3 h-px flex-1 ${i < idx ? 'bg-bronze' : 'bg-hair'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

export default function OrderDetail({
  order,
  onUpdated,
  onClose,
}: {
  order: AdminOrder
  onUpdated: (o: AdminOrder) => void
  onClose: () => void
}) {
  const [awb, setAwb] = useState(order.awb_number ?? '')
  const [courier, setCourier] = useState(order.courier_name ?? '')
  const [trackingUrl, setTrackingUrl] = useState(order.tracking_url ?? '')
  const [notify, setNotify] = useState(true)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState(order.notes ?? '')
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err' | 'warn'; text: string } | null>(null)
  const [copied, setCopied] = useState(false)

  const a = order.shipping_address
  const isCod = order.payment_method === 'cod'
  const status = order.order_status

  async function act(payload: Record<string, unknown>, okText: string) {
    setBusy(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, ...payload }),
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) {
        window.location.assign('/admin/login')
        return
      }
      if (!res.ok) {
        setMsg({ kind: 'err', text: json.error ?? 'Something went wrong.' })
        return
      }
      setMsg(json.warning ? { kind: 'warn', text: json.warning } : { kind: 'ok', text: okText })
      setEditing(false)
      setCancelOpen(false)
      onUpdated(json.order)
    } catch {
      setMsg({ kind: 'err', text: 'Network error. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  async function copyDetails() {
    const lines = [
      order.customer_name,
      order.customer_phone,
      a.line1,
      a.line2,
      `${a.city}, ${a.state} - ${a.pincode}`,
      '',
      `Order: ${order.order_number}`,
      isCod ? `COD amount: ${formatRupees(order.total_paise)}` : 'Prepaid',
    ].filter((l) => l !== undefined && l !== null)
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const showTrackingForm = status === 'confirmed' || (status === 'shipped' && editing)
  const waNumber = `91${order.customer_phone.replace(/\D/g, '').slice(-10)}`
  const contactBtn =
    'flex h-10 flex-1 items-center justify-center gap-2 border border-hair text-[12px] uppercase tracking-[0.12em] transition-colors hover:border-bronze hover:text-bronze'

  return (
    <div>
      {/* ---------- header ---------- */}
      <div className="sticky top-0 z-10 border-b border-hair bg-white/95 px-6 py-5 backdrop-blur sm:px-8">
        <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-bronze" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={eyebrow}>Order</p>
            <h2 className="mt-1 font-display text-2xl leading-tight">{order.order_number}</h2>
            <p className="mt-1 text-xs text-muted">Placed {fmt(order.created_at)}</p>
          </div>
          <div className="flex items-start gap-3">
            <StatusBadge status={status} />
            <button onClick={onClose} aria-label="Close" className="-mr-1 p-1 text-muted transition-colors hover:text-ink">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Progress status={status} />
      </div>

      {msg && (
        <div
          role="status"
          className={`mx-6 mb-5 border-l-2 px-3 py-2.5 text-sm sm:mx-8 ${
            msg.kind === 'ok'
              ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
              : msg.kind === 'warn'
                ? 'border-amber-600 bg-amber-50 text-amber-900'
                : 'border-red-700 bg-red-50 text-red-800'
          }`}
        >
          {msg.text}
        </div>
      )}

      {status === 'pending' && (
        <div className="mx-6 mb-5 border-l-2 border-hair bg-[#FAF9F6] px-3 py-2.5 text-sm text-muted sm:mx-8">
          Online payment hasn’t completed. If it never does, this is an abandoned checkout — nothing to ship.
        </div>
      )}

      {/* ---------- fulfillment ---------- */}
      {status !== 'pending' && (
        <Section title="Fulfillment">
          {status === 'cancelled' && <p className="text-sm">Cancelled {fmt(order.cancelled_at)}.</p>}

          {status === 'delivered' && (
            <div className="bg-[#FAF9F6] px-4 py-3 text-sm">
              <p>Delivered {fmt(order.delivered_at)}</p>
              <p className="mt-1 font-mono text-xs text-muted">
                {order.courier_name} · {order.awb_number}
              </p>
            </div>
          )}

          {status === 'shipped' && !editing && (
            <div>
              <div className="bg-[#FAF9F6] px-4 py-3">
                <p className="text-xs text-muted">{order.courier_name}</p>
                <p className="mt-0.5 font-mono text-sm">{order.awb_number}</p>
                <p className="mt-2 text-xs text-muted">Shipped {fmt(order.shipped_at)}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  disabled={busy}
                  onClick={() => act({ action: 'mark_delivered' }, 'Marked as delivered.')}
                  className={btnPrimary}
                >
                  Mark delivered
                </button>
                <button onClick={() => setEditing(true)} className={btnGhost}>
                  Edit tracking
                </button>
                <button
                  disabled={busy}
                  onClick={() => {
                    if (confirm('Remove tracking and move this order back to “To ship”?'))
                      act({ action: 'clear_tracking' }, 'Tracking removed.')
                  }}
                  className={btnGhost}
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          {showTrackingForm && (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                act(
                  { action: 'set_tracking', awb, courier, trackingUrl, notify },
                  'Tracking saved — order marked as shipped.',
                )
              }}
              className="space-y-4"
            >
              {status === 'confirmed' && (
                <p className="text-sm leading-relaxed text-muted">
                  Book the shipment in NimbusPost first, then enter the AWB it gives you.
                </p>
              )}
              <Field label="AWB number">
                <input value={awb} onChange={(e) => setAwb(e.target.value)} className={`${inputCls} font-mono`} />
              </Field>
              <Field label="Courier">
                <input
                  list="courier-list"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  placeholder="e.g. Delhivery"
                  className={inputCls}
                />
                <datalist id="courier-list">
                  {COURIERS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Courier tracking link (optional)">
                <input
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://…"
                  className={inputCls}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                  className="h-4 w-4 accent-[#A9793D]"
                />
                Email the customer their tracking details
              </label>
              <div className="flex gap-2">
                <button type="submit" disabled={busy || !awb || !courier} className={btnPrimary}>
                  {busy ? 'Saving…' : status === 'confirmed' ? 'Save & mark shipped' : 'Save changes'}
                </button>
                {editing && (
                  <button type="button" onClick={() => setEditing(false)} className={btnGhost}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}

          {status === 'confirmed' && (
            <div className="mt-6 border-t border-hair pt-5">
              {!cancelOpen ? (
                <button
                  onClick={() => setCancelOpen(true)}
                  className="text-[12px] font-medium uppercase tracking-[0.14em] text-red-700 hover:underline"
                >
                  Cancel this order…
                </button>
              ) : (
                <div className="space-y-3">
                  <input
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Reason (optional, saved to notes)"
                    className={inputCls}
                  />
                  {order.payment_method === 'online' && order.payment_status === 'paid' && (
                    <p className="border-l-2 border-amber-600 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      Paid online — you’ll need to refund this in the Razorpay dashboard.
                    </p>
                  )}
                  <div className="flex gap-2">
                    <button
                      disabled={busy}
                      onClick={() => act({ action: 'cancel', reason: cancelReason }, 'Order cancelled.')}
                      className={btnDanger}
                    >
                      Confirm cancel
                    </button>
                    <button onClick={() => setCancelOpen(false)} className={btnGhost}>
                      Keep order
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </Section>
      )}

      {/* ---------- customer ---------- */}
      <Section title="Customer">
        <p className="font-display text-lg">{order.customer_name}</p>
        <p className="mt-1 break-all text-sm text-muted">{order.customer_email}</p>
        <div className="mt-4 flex gap-2">
          <a href={`tel:${order.customer_phone}`} className={contactBtn}>
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
          <a href={`https://wa.me/${waNumber}`} target="_blank" rel="noreferrer" className={contactBtn}>
            <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
          </a>
          <a href={`mailto:${order.customer_email}`} className={contactBtn}>
            <Mail className="h-3.5 w-3.5" /> Email
          </a>
        </div>
        <p className="mt-3 font-mono text-xs text-muted">{order.customer_phone}</p>
      </Section>

      {/* ---------- address ---------- */}
      <Section title="Ship to">
        <div className="bg-[#FAF9F6] px-4 py-3.5 text-sm leading-relaxed">
          {a.line1}
          {a.line2 ? `, ${a.line2}` : ''}
          <br />
          {a.city}, {a.state} – {a.pincode}
        </div>
        <button
          onClick={copyDetails}
          className="mt-3 flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-bronze hover:underline"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy details for NimbusPost'}
        </button>
      </Section>

      {/* ---------- items & payment ---------- */}
      <Section title="Items & payment">
        <div className="space-y-2 text-sm">
          {order.order_items.map((i) => (
            <div key={i.id} className="flex justify-between gap-4">
              <span>
                {i.product_name} <span className="text-muted">× {i.quantity}</span>
              </span>
              <span>{formatRupees(i.line_total_paise)}</span>
            </div>
          ))}
          {order.shipping_paise > 0 && (
            <div className="flex justify-between text-muted">
              <span>Shipping</span>
              <span>{formatRupees(order.shipping_paise)}</span>
            </div>
          )}
          {(order.cod_fee_paise ?? 0) > 0 && (
            <div className="flex justify-between text-muted">
              <span>COD handling fee</span>
              <span>{formatRupees(order.cod_fee_paise!)}</span>
            </div>
          )}
          <div className="flex items-baseline justify-between border-t border-hair pt-3">
            <span className={eyebrow}>Total</span>
            <span className="font-display text-xl">{formatRupees(order.total_paise)}</span>
          </div>
        </div>

        {isCod ? (
          <div className="mt-5 border-l-2 border-bronze bg-[#A9793D]/10 px-4 py-3 text-sm">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#7A5428]">Cash on delivery</span>
            <p className="mt-1">
              Collect <strong>{formatRupees(order.total_paise)}</strong> from the customer.
              {order.payment_status === 'paid' && <span className="text-emerald-800"> Collected ✓</span>}
            </p>
          </div>
        ) : (
          <div className="mt-5 border-l-2 border-hair bg-[#FAF9F6] px-4 py-3 text-sm">
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">Paid online</span>
            <p className="mt-1 capitalize">{order.payment_status}</p>
            {order.razorpay_payment_id && (
              <p className="mt-1 break-all font-mono text-xs text-muted">{order.razorpay_payment_id}</p>
            )}
          </div>
        )}
      </Section>

      {/* ---------- notes ---------- */}
      <Section title="Internal notes">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className={textareaCls}
          placeholder="Only visible to you"
        />
        <button
          disabled={busy || notes === (order.notes ?? '')}
          onClick={() => act({ action: 'save_notes', notes }, 'Notes saved.')}
          className={`${btnGhost} mt-3`}
        >
          Save notes
        </button>
      </Section>
    </div>
  )
}
