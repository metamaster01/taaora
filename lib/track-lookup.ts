// Server-only helpers shared by the two public track routes.
import { supabaseAdmin } from './supabase'
import type { Identifier } from './order-status'

// Only orders that really exist for the customer: confirmed or later.
// Online orders still awaiting payment are abandoned carts, not orders.
const VISIBLE = ['confirmed', 'shipped', 'delivered', 'cancelled']

const SELECT =
  'order_number, created_at, order_status, payment_method, total_paise, awb_number, courier_name, tracking_url, shipped_at, delivered_at, shipping_address, order_items(product_name, quantity)'

// Escape LIKE wildcards: "_" is common in emails and must not match any char.
const escapeLike = (s: string) => s.replace(/[\\%_]/g, (m) => `\\${m}`)

export async function findOrders(id: Identifier, orderNumber?: string | null, limit = 10) {
  let q = supabaseAdmin.from('orders').select(SELECT).in('order_status', VISIBLE)

  if (id.type === 'email') {
    q = q.ilike('customer_email', escapeLike(id.value))
  } else {
    // Tolerate numbers stored with a country code.
    q = q.in('customer_phone', [id.value, `+91${id.value}`, `91${id.value}`, `+91 ${id.value}`])
  }
  if (orderNumber) q = q.eq('order_number', orderNumber)

  const { data, error } = await q.order('created_at', { ascending: false }).limit(limit)
  if (error) {
    console.error('track lookup failed', error)
    return null
  }
  return data ?? []
}

export function itemsSummary(items: { product_name: string; quantity: number }[] | null) {
  return (items ?? []).map((i) => `${i.product_name} × ${i.quantity}`).join(', ') || 'Your order'
}
