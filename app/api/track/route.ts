import { NextResponse } from 'next/server'
import { clientIp, rateLimit } from '@/lib/rate-limit'
import {
  STAGE_LABEL,
  deriveStage,
  normalizeOrderNumber,
  parseIdentifier,
  type OrderStatus,
} from '@/lib/order-status'
import { findOrders, itemsSummary } from '@/lib/track-lookup'
import { buildTrackDetail } from '@/lib/track-detail'
import type { TrackSummary } from '@/types/track'

export const dynamic = 'force-dynamic'

// Step 1 of tracking: "which orders belong to this phone/email?"
// Deliberately returns only non-sensitive summaries — no name, no address.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))

  const ip = rateLimit(`track:ip:${clientIp(req)}`, 15, 10 * 60 * 1000)
  if (!ip.ok) {
    return NextResponse.json(
      { error: 'Too many attempts. Please wait a few minutes and try again.' },
      { status: 429 },
    )
  }

  const identifier = parseIdentifier(typeof body.identifier === 'string' ? body.identifier : '')
  if (!identifier) {
    return NextResponse.json(
      { error: 'Enter a valid 10-digit mobile number or email address.' },
      { status: 400 },
    )
  }

  // Also throttle per identifier so one phone/email can't be probed from many IPs.
  const perId = rateLimit(`track:id:${identifier.value}`, 20, 60 * 60 * 1000)
  if (!perId.ok) {
    return NextResponse.json({ error: 'Too many attempts. Please try again later.' }, { status: 429 })
  }

  let orderNumber: string | null = null
  if (typeof body.orderNumber === 'string' && body.orderNumber.trim()) {
    orderNumber = normalizeOrderNumber(body.orderNumber)
    if (!orderNumber) {
      return NextResponse.json({ error: 'That order number doesn’t look right. Example: TAAORA-000123.' }, { status: 400 })
    }
  }

  const rows = await findOrders(identifier, orderNumber)
  if (!rows) {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  const orders: TrackSummary[] = rows.map((o: any) => {
    // Summary stage comes from our own records (no courier call per order here).
    const stage = deriveStage(o.order_status as OrderStatus)
    return {
      orderNumber: o.order_number,
      placedAt: o.created_at,
      stage,
      stageLabel: STAGE_LABEL[stage],
      items: itemsSummary(o.order_items),
      totalPaise: o.total_paise,
      paymentMethod: o.payment_method,
    }
  })

  // One match → include the full detail now, so the page needs no second request.
  const detail = rows.length === 1 ? await buildTrackDetail(rows[0]) : null

  // Same response shape whether nothing matched or the details were wrong.
  return NextResponse.json({ orders, detail }, { headers: { 'Cache-Control': 'no-store' } })
}
