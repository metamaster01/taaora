// SERVER ONLY. Never import this from a client component (it reads the access token).
import { createHash } from 'crypto'

// Check Meta's docs occasionally and bump this to a currently supported Graph API version.
const GRAPH_VERSION = process.env.META_GRAPH_VERSION ?? 'v23.0'

export const CAPI_ALLOWED_EVENTS = new Set([
  'ViewContent',
  'AddToCart',
  'InitiateCheckout',
  'Purchase',
  'Contact',
  'Lead',
])

export type CapiUser = {
  email?: string
  phone?: string
  firstName?: string
  ip?: string
  userAgent?: string
  fbp?: string
  fbc?: string
}

export type CapiInput = {
  eventName: string
  eventId: string
  sourceUrl?: string
  customData?: unknown
  user?: CapiUser
}

const sha256 = (v: string) => createHash('sha256').update(v).digest('hex')

const norm = (v?: string) => {
  const t = v?.trim().toLowerCase()
  return t ? t : undefined
}

// Indian numbers: 10 digits -> prefix 91. Meta wants digits only, with country code.
function normPhone(v?: string) {
  if (!v) return undefined
  let d = v.replace(/\D/g, '').replace(/^0+/, '')
  if (d.length === 10) d = '91' + d
  return d.length >= 11 ? d : undefined
}

const str = (v: unknown, max: number) => (typeof v === 'string' && v ? v.slice(0, max) : undefined)

// Whitelist what we forward, so the public endpoint can't be abused to send junk.
export function cleanCustomData(raw: unknown) {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>
  const out: Record<string, unknown> = {}

  if (typeof r.value === 'number' && Number.isFinite(r.value) && r.value >= 0) out.value = r.value
  if (typeof r.currency === 'string' && /^[A-Za-z]{3}$/.test(r.currency)) out.currency = r.currency.toUpperCase()
  if (Array.isArray(r.content_ids))
    out.content_ids = r.content_ids.filter((x) => typeof x === 'string').slice(0, 20).map((x) => (x as string).slice(0, 64))
  if (str(r.content_name, 120)) out.content_name = str(r.content_name, 120)
  if (str(r.content_type, 30)) out.content_type = str(r.content_type, 30)
  if (str(r.order_id, 64)) out.order_id = str(r.order_id, 64)
  if (typeof r.num_items === 'number' && Number.isInteger(r.num_items) && r.num_items > 0 && r.num_items < 1000)
    out.num_items = r.num_items

  return out
}

export async function sendCapiEvent(input: CapiInput): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
  const token = process.env.META_CAPI_ACCESS_TOKEN
  if (!pixelId || !token) return // not configured: do nothing

  const u = input.user ?? {}
  const email = norm(u.email)
  const phone = normPhone(u.phone)
  const first = norm(u.firstName)

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        event_source_url: input.sourceUrl,
        action_source: 'website',
        user_data: {
          em: email ? [sha256(email)] : undefined,
          ph: phone ? [sha256(phone)] : undefined,
          fn: first ? [sha256(first)] : undefined,
          client_ip_address: u.ip,
          client_user_agent: u.userAgent,
          fbp: u.fbp,
          fbc: u.fbc,
        },
        custom_data: cleanCustomData(input.customData),
      },
    ],
    test_event_code: process.env.META_CAPI_TEST_EVENT_CODE || undefined,
    access_token: token,
  }

  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_VERSION}/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) console.error('[meta-capi] failed', res.status, (await res.text()).slice(0, 300))
  } catch (e) {
    // Tracking must never break the site.
    console.error('[meta-capi] request error', (e as Error).name)
  }
}
