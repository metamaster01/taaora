// NimbusPost tracking client. Server-only (uses secret credentials).
//
// IMPORTANT: this is written against NimbusPost's documented REST API
// (login → bearer token → track by AWB) but I could not test it without your
// credentials. Every failure path returns null, and the track page then falls
// back to the order's own status + AWB, so a wrong endpoint or response shape
// degrades gracefully instead of breaking tracking. Verify once with a real AWB;
// if the shape differs, only parseTracking() below needs adjusting.
//
// Two auth styles exist across NimbusPost's published docs, so both are supported:
//   A) NIMBUSPOST_API_KEY  -> sent as the "NP-API-KEY" header (Settings -> API -> Generate API Key)
//   B) NIMBUSPOST_EMAIL + NIMBUSPOST_PASSWORD -> login, then Bearer token
// If NIMBUSPOST_API_KEY is set it is used; otherwise style B.
// Optional: NIMBUSPOST_API_BASE, NIMBUSPOST_TRACK_PATH (default /shipments/track/{awb})

const BASE = (process.env.NIMBUSPOST_API_BASE ?? 'https://api.nimbuspost.com/v1').replace(/\/$/, '')
const TIMEOUT_MS = 8000
const CACHE_TTL_MS = 5 * 60 * 1000
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000

export type TrackingEvent = {
  status: string
  location: string | null
  time: string | null
  message: string | null
}
export type LiveTracking = { status: string | null; edd: string | null; events: TrackingEvent[] }

export function nimbusConfigured() {
  return Boolean(
    process.env.NIMBUSPOST_API_KEY || (process.env.NIMBUSPOST_EMAIL && process.env.NIMBUSPOST_PASSWORD),
  )
}

let tokenCache: { token: string; at: number } | null = null
const trackCache = new Map<string, { at: number; value: LiveTracking | null }>()

async function login(): Promise<string | null> {
  try {
    const res = await fetch(`${BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.NIMBUSPOST_EMAIL,
        password: process.env.NIMBUSPOST_PASSWORD,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
    if (!res.ok) return null
    const json = await res.json()
    const token = typeof json?.data === 'string' ? json.data : (json?.data?.token ?? json?.token)
    if (typeof token !== 'string' || !token) return null
    tokenCache = { token, at: Date.now() }
    return token
  } catch {
    return null
  }
}

async function getToken(force = false) {
  if (!force && tokenCache && Date.now() - tokenCache.at < TOKEN_TTL_MS) return tokenCache.token
  return login()
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null
}

function parseTracking(json: any): LiveTracking | null {
  const data = json?.data ?? json
  if (!data) return null

  const list: any[] = Array.isArray(data)
    ? data
    : (data.history ?? data.tracking_history ?? data.scans ?? data.events ?? data.tracking ?? [])
  if (!Array.isArray(list)) return null

  const events: TrackingEvent[] = list
    .map((e: any) => ({
      status: str(e?.status) ?? str(e?.status_code) ?? str(e?.message) ?? '',
      location: str(e?.location),
      time: str(e?.event_time) ?? str(e?.timestamp) ?? str(e?.date) ?? str(e?.time),
      message: str(e?.message) ?? str(e?.remark) ?? str(e?.description),
    }))
    .filter((e) => e.status || e.message)

  // Newest first, but only reorder when every timestamp parses reliably.
  if (events.length > 1 && events.every((e) => e.time && !Number.isNaN(Date.parse(e.time)))) {
    events.sort((a, b) => Date.parse(b.time!) - Date.parse(a.time!))
  }

  const status =
    str(data?.status) ?? str(data?.current_status) ?? str(data?.shipment_status) ?? events[0]?.status ?? null
  const edd = str(data?.edd) ?? str(data?.expected_delivery_date) ?? str(data?.estimated_delivery)

  if (!status && events.length === 0) return null
  return { status, edd, events }
}

export async function trackByAwb(awb: string): Promise<LiveTracking | null> {
  if (!nimbusConfigured()) return null

  const cached = trackCache.get(awb)
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.value

  const trackPath = (process.env.NIMBUSPOST_TRACK_PATH ?? '/shipments/track/{awb}').replace(
    '{awb}',
    encodeURIComponent(awb),
  )
  const apiKey = process.env.NIMBUSPOST_API_KEY

  async function call(token: string | null) {
    return fetch(`${BASE}${trackPath}`, {
      headers: apiKey ? { 'NP-API-KEY': apiKey } : { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: 'no-store',
    })
  }

  try {
    let res: Response
    if (apiKey) {
      res = await call(null)
    } else {
      let token = await getToken()
      if (!token) return null
      res = await call(token)
      if (res.status === 401) {
        token = await getToken(true)
        if (!token) return null
        res = await call(token)
      }
    }
    const value = res.ok ? parseTracking(await res.json()) : null
    // Cache failures briefly too, so an outage doesn't hammer their API.
    trackCache.set(awb, { at: Date.now(), value })
    return value
  } catch {
    return null
  }
}
