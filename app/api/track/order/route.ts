import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import { normalizeOrderNumber, parseIdentifier } from '@/lib/order-status'
import { findOrders } from '@/lib/track-lookup'
import { buildTrackDetail } from '@/lib/track-detail'

export const dynamic = 'force-dynamic'

// Used when a customer has several orders and picks one from the list.
// The identifier is re-verified on every call (stateless — no session to forge).
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  const ip = rateLimit(`track:detail:${clientIp(req)}`, 30, 10 * 60 * 1000)
  if (!ip.ok) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes and try again.' }, { status: 429 })
  }

  const notFound = (reason: string) => {
    // Server log only — the customer always gets the same generic message.
    console.warn(`[track/order] not found: ${reason}`)
    return NextResponse.json({ error: 'We couldn’t find that order.' }, { status: 404 })
  }

  const identifier = parseIdentifier(typeof body.identifier === 'string' ? body.identifier : '')
  if (!identifier) return notFound('invalid identifier')
  const orderNumber = normalizeOrderNumber(typeof body.orderNumber === 'string' ? body.orderNumber : '')
  if (!orderNumber) return notFound(`invalid order number "${body.orderNumber}"`)

  const rows = await findOrders(identifier, orderNumber, 1)
  if (rows === null) return notFound('database error (see "track lookup failed" above)')
  if (!rows[0]) return notFound(`no ${identifier.type} match for ${orderNumber}`)

  const order = await buildTrackDetail(rows[0])
  return NextResponse.json({ order }, { headers: { 'Cache-Control': 'no-store' } })
}
