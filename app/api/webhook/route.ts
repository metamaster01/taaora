// import { NextRequest, NextResponse } from 'next/server'
// import crypto from 'crypto'
// import { supabaseAdmin } from '@/lib/supabase'

// export async function POST(req: NextRequest) {
//   // Razorpay signs the RAW request body — must read as text, not parsed JSON,
//   // or the signature check below will always fail.
//   const rawBody = await req.text()
//   const signature = req.headers.get('x-razorpay-signature')

//   if (!signature) {
//     return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
//   }

//   const expectedSignature = crypto
//     .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
//     .update(rawBody)
//     .digest('hex')

//   if (expectedSignature !== signature) {
//     console.error('Webhook signature mismatch — possible spoofed request')
//     return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
//   }

//   const event = JSON.parse(rawBody)

//   // Only act on successful payment capture — ack everything else so Razorpay stops retrying it
//   if (event.event !== 'payment.captured' && event.event !== 'order.paid') {
//     return NextResponse.json({ received: true })
//   }

//   const payment = event.payload?.payment?.entity
//   const razorpayOrderId = payment?.order_id
//   const razorpayPaymentId = payment?.id

//   if (!razorpayOrderId) {
//     return NextResponse.json({ error: 'Missing order id in payload' }, { status: 400 })
//   }

//   const { data: order, error: findError } = await supabaseAdmin
//     .from('orders')
//     .select('id, payment_status')
//     .eq('razorpay_order_id', razorpayOrderId)
//     .single()

//   if (findError || !order) {
//     console.error('Order not found for razorpay_order_id:', razorpayOrderId)
//     return NextResponse.json({ error: 'Order not found' }, { status: 404 })
//   }

//   // Idempotency guard — Razorpay can deliver the same webhook more than once
//   if (order.payment_status === 'paid') {
//     return NextResponse.json({ received: true, note: 'already processed' })
//   }

//   // Decrement stock atomically for every item on this order (normally just one row today)
//   const { data: items } = await supabaseAdmin
//     .from('order_items')
//     .select('product_id, quantity')
//     .eq('order_id', order.id)

//   let stockOk = true
//   for (const item of items ?? []) {
//     const { data: decremented } = await supabaseAdmin.rpc('decrement_stock', {
//       p_product_id: item.product_id,
//       p_quantity: item.quantity,
//     })
//     if (!decremented) stockOk = false
//   }

//   // Payment succeeded either way — money has moved. If stock ran out in the meantime,
//   // flag it for manual review (refund/backorder) instead of silently losing the order.
//   await supabaseAdmin
//     .from('orders')
//     .update({
//       payment_status: 'paid',
//       order_status: stockOk ? 'confirmed' : 'pending',
//       razorpay_payment_id: razorpayPaymentId,
//       razorpay_signature: signature,
//       notes: stockOk ? null : 'STOCK SHORTFALL — needs manual review',
//     })
//     .eq('id', order.id)

//   // TODO: trigger confirmation email (Resend) here once templates are ready

//   return NextResponse.json({ received: true })
// }








import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import { sendCustomerConfirmationEmail, sendAdminNotificationEmail } from '@/lib/notifications'

export async function POST(req: NextRequest) {
  // Razorpay signs the RAW request body — must read as text, not parsed JSON,
  // or the signature check below will always fail.
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    console.error('Webhook signature mismatch — possible spoofed request')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const event = JSON.parse(rawBody)

  // Only act on successful payment capture — ack everything else so Razorpay stops retrying it
  if (event.event !== 'payment.captured' && event.event !== 'order.paid') {
    return NextResponse.json({ received: true })
  }

  const payment = event.payload?.payment?.entity
  const razorpayOrderId = payment?.order_id
  const razorpayPaymentId = payment?.id

  if (!razorpayOrderId) {
    return NextResponse.json({ error: 'Missing order id in payload' }, { status: 400 })
  }

  const { data: order, error: findError } = await supabaseAdmin
    .from('orders')
    .select(
      'id, payment_status, order_number, customer_name, customer_email, customer_phone, shipping_address, subtotal_paise, shipping_paise, total_paise, payment_method',
    )
    .eq('razorpay_order_id', razorpayOrderId)
    .single()

  if (findError || !order) {
    console.error('Order not found for razorpay_order_id:', razorpayOrderId)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  // Idempotency guard — Razorpay can deliver the same webhook more than once
  if (order.payment_status === 'paid') {
    return NextResponse.json({ received: true, note: 'already processed' })
  }

  // Decrement stock atomically for every item on this order (normally just one row today)
  const { data: items } = await supabaseAdmin
    .from('order_items')
    .select('product_id, product_name, quantity, unit_price_paise')
    .eq('order_id', order.id)

  let stockOk = true
  for (const item of items ?? []) {
    const { data: decremented } = await supabaseAdmin.rpc('decrement_stock', {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    })
    if (!decremented) stockOk = false
  }

  // Payment succeeded either way — money has moved. If stock ran out in the meantime,
  // flag it for manual review (refund/backorder) instead of silently losing the order.
  await supabaseAdmin
    .from('orders')
    .update({
      payment_status: 'paid',
      order_status: stockOk ? 'confirmed' : 'pending',
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: signature,
      notes: stockOk ? null : 'STOCK SHORTFALL — needs manual review',
    })
    .eq('id', order.id)

  // Emails are a side effect, not part of the payment confirmation itself —
  // if they fail, the order is still correctly marked paid. Both functions
  // already swallow their own errors internally.
  await Promise.all([
    sendCustomerConfirmationEmail({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      items: (items ?? []).map((i) => ({
        productName: i.product_name,
        quantity: i.quantity,
        unitPricePaise: i.unit_price_paise,
      })),
      subtotalPaise: order.subtotal_paise,
      shippingPaise: order.shipping_paise,
      totalPaise: order.total_paise,
      paymentMethod: order.payment_method,
    }),
    sendAdminNotificationEmail({
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.shipping_address,
      items: (items ?? []).map((i) => ({
        productName: i.product_name,
        quantity: i.quantity,
        unitPricePaise: i.unit_price_paise,
      })),
      subtotalPaise: order.subtotal_paise,
      shippingPaise: order.shipping_paise,
      totalPaise: order.total_paise,
      paymentMethod: order.payment_method,
    }),
  ])

  return NextResponse.json({ received: true })
}