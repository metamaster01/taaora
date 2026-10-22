// Shared by the admin panel (client), the track page (client) and API routes.
// No server-only imports here.

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

/* ---------------- admin filters ---------------- */

export const ADMIN_FILTERS = [
  { key: 'new', label: 'To ship' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'awaiting_payment', label: 'Awaiting payment' },
  { key: 'all', label: 'All' },
] as const

export type AdminFilter = (typeof ADMIN_FILTERS)[number]['key']

export function isAdminFilter(v: string | null): v is AdminFilter {
  return ADMIN_FILTERS.some((f) => f.key === v)
}

/* ---------------- identifier normalisation ---------------- */

export function normalizePhone(input: string): string | null {
  let d = input.replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) d = d.slice(2)
  else if (d.length === 11 && d.startsWith('0')) d = d.slice(1)
  return /^[6-9]\d{9}$/.test(d) ? d : null
}

export function normalizeEmail(input: string): string | null {
  const e = input.trim().toLowerCase()
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : null
}

export type Identifier = { type: 'phone' | 'email'; value: string }

export function parseIdentifier(input: string): Identifier | null {
  const t = input.trim()
  if (t.includes('@')) {
    const e = normalizeEmail(t)
    return e ? { type: 'email', value: e } : null
  }
  const p = normalizePhone(t)
  return p ? { type: 'phone', value: p } : null
}

// "TAAORA-000123", "taaora123" and "123" all resolve to TAAORA-000123.
export function normalizeOrderNumber(input: string): string | null {
  const m = input.trim().toUpperCase().match(/^(?:TAAORA-?)?(\d{1,9})$/)
  return m ? `TAAORA-${m[1].padStart(6, '0')}` : null
}

/* ---------------- courier status → customer-facing stage ---------------- */

export type CourierState =
  | 'delivered'
  | 'out_for_delivery'
  | 'rto'
  | 'exception'
  | 'in_transit'
  | 'unknown'

// Courier status text varies by carrier, so match on meaning, not exact strings.
export function classifyCourierStatus(raw?: string | null): CourierState {
  const s = (raw ?? '').toLowerCase()
  if (!s) return 'unknown'
  if (/\brto\b|return(ed)? to (origin|seller|shipper)|returning/.test(s)) return 'rto'
  if (/out for delivery|\bofd\b/.test(s)) return 'out_for_delivery'
  if (/undeliver|not delivered|delivery attempt|failed|\bndr\b|exception|on hold|refused|cancel/.test(s))
    return 'exception'
  if (/delivered/.test(s)) return 'delivered'
  if (/transit|dispatch|picked|pick.?up|shipped|reached|arrived|departed|manifest|booked/.test(s))
    return 'in_transit'
  return 'unknown'
}

export type TrackStage = 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled'

export function deriveStage(orderStatus: OrderStatus, courier: CourierState = 'unknown'): TrackStage {
  if (orderStatus === 'cancelled') return 'cancelled'
  if (orderStatus === 'delivered') return 'delivered'
  if (orderStatus === 'shipped') {
    if (courier === 'delivered') return 'delivered'
    if (courier === 'out_for_delivery') return 'out_for_delivery'
    return 'shipped'
  }
  return 'confirmed'
}

export const STAGE_LABEL: Record<TrackStage, string> = {
  confirmed: 'Preparing your order',
  shipped: 'Shipped',
  out_for_delivery: 'Out for delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const STEP_DEFS = [
  { key: 'confirmed', label: 'Order confirmed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
] as const

export type TrackStep = {
  key: (typeof STEP_DEFS)[number]['key']
  label: string
  state: 'done' | 'current' | 'upcoming'
  at: string | null
}

export function buildSteps(
  stage: TrackStage,
  times: { confirmed?: string | null; shipped?: string | null; delivered?: string | null },
): TrackStep[] {
  if (stage === 'cancelled') return []
  const idx = STEP_DEFS.findIndex((s) => s.key === stage)
  return STEP_DEFS.map((s, i) => ({
    key: s.key,
    label: s.label,
    state: i < idx ? 'done' : i === idx ? (stage === 'delivered' ? 'done' : 'current') : 'upcoming',
    at:
      s.key === 'confirmed'
        ? times.confirmed ?? null
        : s.key === 'shipped'
          ? times.shipped ?? null
          : s.key === 'delivered'
            ? times.delivered ?? null
            : null,
  }))
}
