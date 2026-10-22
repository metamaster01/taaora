import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-guard'
import { ADMIN_FILTERS, isAdminFilter, type AdminFilter } from '@/lib/order-status'
import { sendShippedEmail } from '@/lib/shipping-notifications'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 20

function applyFilter(query: any, filter: AdminFilter) {
  switch (filter) {
    case 'new':
      return query.eq('order_status', 'confirmed')
    case 'shipped':
      return query.eq('order_status', 'shipped')
    case 'delivered':
      return query.eq('order_status', 'delivered')
    case 'cancelled':
      return query.eq('order_status', 'cancelled')
    case 'awaiting_payment':
      return query.eq('order_status', 'pending')
    default:
      return query
  }
}

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

async function fetchOrder(id: string) {
  const { data } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single()
  return data
}

/* ------------------------------ GET ------------------------------ */

export async function GET(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const url = new URL(req.url)
  const filterParam = url.searchParams.get('filter')
  const filter: AdminFilter = isAdminFilter(filterParam) ? filterParam : 'new'
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1)
  // Strip characters that have meaning inside PostgREST's or() syntax.
  const q = (url.searchParams.get('q') ?? '').replace(/[,()%*\\"']/g, ' ').trim().slice(0, 80)

  let query = supabaseAdmin.from('orders').select('*, order_items(*)', { count: 'exact' })
  query = applyFilter(query, filter)
  if (q) {
    query = query.or(
      [
        `order_number.ilike.%${q}%`,
        `customer_name.ilike.%${q}%`,
        `customer_email.ilike.%${q}%`,
        `customer_phone.ilike.%${q}%`,
        `awb_number.ilike.%${q}%`,
      ].join(','),
    )
  }

  const from = (page - 1) * PAGE_SIZE
  const [list, ...countResults] = await Promise.all([
    query.order('created_at', { ascending: false }).range(from, from + PAGE_SIZE - 1),
    ...ADMIN_FILTERS.map((f) =>
      applyFilter(supabaseAdmin.from('orders').select('id', { count: 'exact', head: true }), f.key),
    ),
  ])

  if (list.error) {
    console.error('admin orders list failed', list.error)
    return fail('Could not load orders.', 500)
  }

  const counts: Record<string, number> = {}
  ADMIN_FILTERS.forEach((f, i) => {
    counts[f.key] = (countResults[i] as any).count ?? 0
  })

  return NextResponse.json({
    orders: list.data ?? [],
    total: list.count ?? 0,
    pageSize: PAGE_SIZE,
    counts,
  })
}

/* ------------------------------ PATCH ------------------------------ */

export async function PATCH(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  const action = typeof body?.action === 'string' ? body.action : ''
  if (!id || !action) return fail('Invalid request.')

  const current = await fetchOrder(id)
  if (!current) return fail('Order not found.', 404)

  const stale = () => fail('This order changed in the meantime. Refresh and try again.', 409)

  /* ---- add / edit tracking → order becomes "shipped" ---- */
  if (action === 'set_tracking') {
    const awb = typeof body.awb === 'string' ? body.awb.trim() : ''
    const courier = typeof body.courier === 'string' ? body.courier.trim() : ''
    const trackingUrl = typeof body.trackingUrl === 'string' ? body.trackingUrl.trim() : ''

    if (!/^[A-Za-z0-9\-_]{4,40}$/.test(awb)) return fail('Enter a valid AWB number (letters/numbers, 4–40 chars).')
    if (courier.length < 2 || courier.length > 60) return fail('Enter the courier name.')
    if (trackingUrl && !/^https:\/\/\S+$/i.test(trackingUrl)) return fail('Tracking link must start with https://')
    if (!['confirmed', 'shipped'].includes(current.order_status))
      return fail('Tracking can only be added to confirmed or shipped orders.', 409)

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        awb_number: awb,
        courier_name: courier,
        tracking_url: trackingUrl || null,
        order_status: 'shipped',
        shipped_at: current.shipped_at ?? new Date().toISOString(),
      })
      .eq('id', id)
      .in('order_status', ['confirmed', 'shipped'])
      .select('id')

    if (error) {
      if ((error as any).code === '23505') return fail('That AWB is already attached to another order.', 409)
      console.error('set_tracking failed', error)
      return fail('Could not save tracking.', 500)
    }
    if (!data?.length) return stale()

    if (body.notify && current.awb_number !== awb) {
      await sendShippedEmail({
        orderNumber: current.order_number,
        customerName: current.customer_name,
        customerEmail: current.customer_email,
        courierName: courier,
        awb,
        trackingUrl: trackingUrl || null,
      })
    }
    return NextResponse.json({ order: await fetchOrder(id) })
  }

  /* ---- remove tracking (wrong AWB / shipment cancelled) → back to confirmed ---- */
  if (action === 'clear_tracking') {
    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({
        awb_number: null,
        courier_name: null,
        tracking_url: null,
        shipped_at: null,
        order_status: 'confirmed',
      })
      .eq('id', id)
      .eq('order_status', 'shipped')
      .select('id')
    if (error) return fail('Could not remove tracking.', 500)
    if (!data?.length) return stale()
    return NextResponse.json({ order: await fetchOrder(id) })
  }

  /* ---- delivered ---- */
  if (action === 'mark_delivered') {
    const update: Record<string, unknown> = {
      order_status: 'delivered',
      delivered_at: new Date().toISOString(),
    }
    // Cash is collected on delivery, so a delivered COD order is now paid.
    if (current.payment_method === 'cod') update.payment_status = 'paid'

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(update)
      .eq('id', id)
      .eq('order_status', 'shipped')
      .select('id')
    if (error) return fail('Could not update order.', 500)
    if (!data?.length) return fail('Only shipped orders can be marked delivered.', 409)
    return NextResponse.json({ order: await fetchOrder(id) })
  }

  /* ---- cancel (before shipping only) ---- */
  if (action === 'cancel') {
    const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 300) : ''
    if (!['pending', 'confirmed'].includes(current.order_status))
      return fail('Shipped orders must have tracking removed first (and the courier shipment cancelled).', 409)

    const notes = [current.notes, reason ? `Cancelled: ${reason}` : 'Cancelled by admin']
      .filter(Boolean)
      .join('\n')

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update({ order_status: 'cancelled', cancelled_at: new Date().toISOString(), notes })
      .eq('id', id)
      .in('order_status', ['pending', 'confirmed'])
      .select('id')
    if (error) return fail('Could not cancel order.', 500)
    if (!data?.length) return stale()

    // Stock was only taken once the order was confirmed — give it back.
    if (current.order_status === 'confirmed') {
      for (const item of current.order_items ?? []) {
        const { error: rpcError } = await supabaseAdmin.rpc('increment_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
        if (rpcError) console.error('restock failed', rpcError)
      }
    }

    const warning =
      current.payment_method === 'online' && current.payment_status === 'paid'
        ? 'Cancelled. This was paid online — issue the refund manually in the Razorpay dashboard.'
        : undefined
    return NextResponse.json({ order: await fetchOrder(id), warning })
  }

  /* ---- internal notes ---- */
  if (action === 'save_notes') {
    const notes = typeof body.notes === 'string' ? body.notes.slice(0, 2000) : ''
    const { error } = await supabaseAdmin
      .from('orders')
      .update({ notes: notes || null })
      .eq('id', id)
    if (error) return fail('Could not save notes.', 500)
    return NextResponse.json({ order: await fetchOrder(id) })
  }

  return fail('Unknown action.')
}
