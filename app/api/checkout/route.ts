import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { razorpay } from '@/lib/razorpay'

const PRODUCT_SLUG = 'imperial-wood'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, phone, address, quantity = 1 } = body

    if (
      !name || !email || !phone ||
      !address?.line1 || !address?.city || !address?.state || !address?.pincode
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (quantity < 1 || quantity > 5) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 })
    }

    // 1. Fetch current product price + stock — never trust a price sent from the client
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, sale_price_paise, stock_count, is_active, name')
      .eq('slug', PRODUCT_SLUG)
      .single()

    if (productError || !product || !product.is_active) {
      return NextResponse.json({ error: 'Product unavailable' }, { status: 404 })
    }

    // Soft check only — the real, race-safe guarantee happens in the webhook via decrement_stock()
    if (product.stock_count < quantity) {
      return NextResponse.json({ error: 'Out of stock' }, { status: 409 })
    }

    const subtotalPaise = product.sale_price_paise * quantity
    const shippingPaise = 0 // set this if/when you charge shipping
    const totalPaise = subtotalPaise + shippingPaise

    // 2. Human-friendly order number (TAAORA-000123)
    const { data: orderNumber } = await supabaseAdmin.rpc('generate_order_number')

    // 3. Create the Razorpay order — its id is what the frontend checkout widget needs
    const razorpayOrder = await razorpay.orders.create({
      amount: totalPaise,
      currency: 'INR',
      receipt: orderNumber as string,
      notes: { order_number: orderNumber as string },
    })

    // 4. Insert our order as 'pending' — ONLY the webhook flips this to 'paid'
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: address,
        subtotal_paise: subtotalPaise,
        shipping_paise: shippingPaise,
        total_paise: totalPaise,
        razorpay_order_id: razorpayOrder.id,
        payment_status: 'pending',
        order_status: 'pending',
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order insert failed:', orderError)
      return NextResponse.json({ error: 'Could not create order' }, { status: 500 })
    }

    // 5. Snapshot the line item (name/price at time of purchase)
    await supabaseAdmin.from('order_items').insert({
      order_id: order.id,
      product_id: product.id,
      product_name: product.name,
      unit_price_paise: product.sale_price_paise,
      quantity,
      line_total_paise: subtotalPaise,
    })

    // 6. Everything the frontend needs to open Razorpay Checkout
    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: totalPaise,
      currency: 'INR',
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderNumber,
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}