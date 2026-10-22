// Small in-memory sliding-window limiter. On serverless each warm instance keeps
// its own counters, so this is best-effort protection against brute force and
// scraping — enough for launch. If traffic grows, swap the body of rateLimit()
// for Upstash Redis; callers won't change.

const buckets = new Map<string, number[]>()
let lastSweep = Date.now()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()

  if (now - lastSweep > 5 * 60 * 1000) {
    lastSweep = now
    for (const [k, hits] of buckets) {
      if (!hits.length || now - hits[hits.length - 1] > windowMs * 2) buckets.delete(k)
    }
  }

  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)
  if (hits.length >= limit) {
    buckets.set(key, hits)
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) }
  }
  hits.push(now)
  buckets.set(key, hits)
  return { ok: true, retryAfter: 0 }
}

export function clientIp(req: Request) {
  const fwd = req.headers.get('x-forwarded-for')
  return (fwd?.split(',')[0] ?? req.headers.get('x-real-ip') ?? 'unknown').trim()
}
