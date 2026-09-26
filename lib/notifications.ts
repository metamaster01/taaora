import { resend } from './resend'
import { formatRupees } from './format'

type OrderItemInput = {
  productName: string
  quantity: number
  unitPricePaise: number
}

type ShippingAddress = {
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export type OrderEmailInput = {
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: ShippingAddress
  items: OrderItemInput[]
  subtotalPaise: number
  shippingPaise: number
  totalPaise: number
  paymentMethod: 'online' | 'cod'
}

function renderItemsRows(items: OrderItemInput[]) {
  return items
    .map(
      (i) => `
        <tr>
          <td style="padding:8px 0;">${i.productName} × ${i.quantity}</td>
          <td style="padding:8px 0; text-align:right;">${formatRupees(i.unitPricePaise * i.quantity)}</td>
        </tr>`,
    )
    .join('')
}

function renderAddress(a: ShippingAddress) {
  return `${a.line1}${a.line2 ? ', ' + a.line2 : ''}, ${a.city}, ${a.state} ${a.pincode}`
}

// Sent to the customer once an order is confirmed — from the webhook for
// online payments, or directly from the checkout route for COD.
export async function sendCustomerConfirmationEmail(order: OrderEmailInput) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: order.customerEmail,
      subject: `Your Taaora order ${order.orderNumber} is confirmed`,
      html: `
        <div style="font-family: Georgia, serif; max-width:520px; margin:0 auto; color:#161310;">
          <h1 style="font-size:22px; font-style:italic; font-weight:normal;">Thank you for your order.</h1>
          <p>Hi ${order.customerName}, your order <strong>${order.orderNumber}</strong> is confirmed.</p>
          <table style="width:100%; border-collapse:collapse; margin-top:16px;">
            ${renderItemsRows(order.items)}
            <tr>
              <td style="padding-top:8px;">Delivery</td>
              <td style="text-align:right; padding-top:8px;">
                ${order.shippingPaise === 0 ? 'Free' : formatRupees(order.shippingPaise)}
              </td>
            </tr>
            <tr>
              <td style="padding-top:8px; font-weight:bold; border-top:1px solid #E8E3DA;">Total</td>
              <td style="text-align:right; padding-top:8px; font-weight:bold; border-top:1px solid #E8E3DA;">
                ${formatRupees(order.totalPaise)}
              </td>
            </tr>
          </table>
          <p style="margin-top:24px;"><strong>Shipping to:</strong><br/>${renderAddress(order.shippingAddress)}</p>
          <p style="margin-top:16px;">
            ${
              order.paymentMethod === 'cod'
                ? 'Please keep the amount ready for cash on delivery.'
                : "Payment received — we're getting your order ready."
            }
          </p>
          <p style="margin-top:24px; color:#6B6459; font-size:13px;">
            Questions? Reply to this email or WhatsApp us at +91 75585 66189.
          </p>
          <p style="margin-top:24px; font-style:italic;">Taaora — Wear Your Presence.</p>
        </div>
      `,
    })
  } catch (err) {
    // Never let an email failure break the order flow — just log it.
    console.error('Failed to send customer confirmation email:', err)
  }
}

// Sent to you whenever a new order comes in, from the same two trigger points.
export async function sendAdminNotificationEmail(order: OrderEmailInput) {
  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: process.env.ADMIN_EMAIL!,
      subject: `New order ${order.orderNumber} — ${formatRupees(order.totalPaise)} (${order.paymentMethod === 'cod' ? 'COD' : 'Paid online'})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width:520px; margin:0 auto; color:#161310;">
          <h2>New order received</h2>
          <p>
            <strong>Order:</strong> ${order.orderNumber}<br/>
            <strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Paid online'}
          </p>
          <table style="width:100%; border-collapse:collapse; margin-top:12px;">
            ${renderItemsRows(order.items)}
            <tr>
              <td style="padding-top:8px; font-weight:bold;">Total</td>
              <td style="text-align:right; padding-top:8px; font-weight:bold;">${formatRupees(order.totalPaise)}</td>
            </tr>
          </table>
          <p style="margin-top:16px;">
            <strong>Customer:</strong> ${order.customerName}<br/>
            <strong>Phone:</strong> ${order.customerPhone}<br/>
            <strong>Email:</strong> ${order.customerEmail}
          </p>
          <p><strong>Ship to:</strong><br/>${renderAddress(order.shippingAddress)}</p>
        </div>
      `,
    })
  } catch (err) {
    console.error('Failed to send admin notification email:', err)
  }
}