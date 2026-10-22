import type { OrderStatus, PaymentStatus } from '@/lib/order-status'

export type OrderItemRow = {
  id: string
  product_name: string
  quantity: number
  unit_price_paise: number
  line_total_paise: number
}

export type AdminOrder = {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  shipping_address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country?: string
  }
  subtotal_paise: number
  shipping_paise: number
  cod_fee_paise: number | null
  total_paise: number
  payment_method: 'online' | 'cod'
  payment_status: PaymentStatus
  order_status: OrderStatus
  razorpay_payment_id: string | null
  awb_number: string | null
  courier_name: string | null
  tracking_url: string | null
  shipped_at: string | null
  delivered_at: string | null
  cancelled_at: string | null
  notes: string | null
  created_at: string
  order_items: OrderItemRow[]
}
