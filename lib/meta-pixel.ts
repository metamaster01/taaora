// Client-side Meta Pixel helpers. Safe to import from any client component.

export const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? ''

// Only run with a valid numeric ID, and only in production
// (set NEXT_PUBLIC_META_PIXEL_DEV=true to test locally).
export const isPixelEnabled =
  /^\d{8,20}$/.test(PIXEL_ID) &&
  (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_META_PIXEL_DEV === 'true')

// Never track internal pages.
export const EXCLUDED_PATH_PREFIXES = ['/admin', '/dashboard', '/api']

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

type StandardEvent = 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'Contact' | 'Lead'

export type TrackUser = { email?: string; phone?: string; firstName?: string }

function canTrack(): boolean {
  return typeof window !== 'undefined' && isPixelEnabled
}

export function newEventId(): string {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }
}

export function pageView() {
  if (!canTrack()) return
  try {
    window.fbq?.('track', 'PageView')
  } catch {}
}

/**
 * Fires the browser pixel AND sends the same event (same event_id) to our
 * Conversions API route, so Meta de-duplicates and ad-blocked users still count.
 */
export function track(
  event: StandardEvent,
  data: Record<string, unknown> = {},
  opts: { eventId?: string; user?: TrackUser } = {}
) {
  if (!canTrack()) return
  const eventId = opts.eventId ?? newEventId()

  try {
    window.fbq?.('track', event, data, { eventID: eventId })
  } catch {}

  try {
    fetch('/api/meta/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName: event,
        eventId,
        sourceUrl: window.location.href,
        customData: data,
        user: opts.user,
      }),
      keepalive: true, // survives page navigation
    }).catch(() => {})
  } catch {}
}

// ---- ready-made events for Taaora ----
export function trackViewContent(p: { id: string; name: string; price?: number }) {
  track('ViewContent', {
    content_ids: [p.id],
    content_name: p.name,
    content_type: 'product',
    value: p.price,
    currency: 'INR',
  })
}

export function trackInitiateCheckout(p: { id: string; value: number; numItems?: number }) {
  track('InitiateCheckout', {
    content_ids: [p.id],
    content_type: 'product',
    value: p.value,
    currency: 'INR',
    num_items: p.numItems ?? 1,
  })
}

// WhatsApp / contact button clicks
export function trackContact(source: 'whatsapp' | 'other' = 'whatsapp') {
  track('Contact', { content_name: source })
}

/**
 * Purchase fires ONCE per order, even if the success page is refreshed.
 * event_id = purchase_<orderId>, so a server-side send with the same id is de-duplicated.
 */
export function trackPurchase(p: {
  orderId: string
  value: number
  currency?: string
  contentIds?: string[]
  numItems?: number
  user?: TrackUser
}) {
  if (!canTrack()) return
  if (!p.orderId || !Number.isFinite(p.value) || p.value < 0) return

  const key = `taaora_purchase_${p.orderId}`
  try {
    if (localStorage.getItem(key)) return
    localStorage.setItem(key, '1')
  } catch {}

  track(
    'Purchase',
    {
      value: p.value,
      currency: p.currency ?? 'INR',
      content_ids: p.contentIds,
      content_type: 'product',
      num_items: p.numItems ?? 1,
      order_id: p.orderId,
    },
    { eventId: `purchase_${p.orderId}`, user: p.user }
  )
}
