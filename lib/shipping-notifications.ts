import { resend } from './resend'
import { SITE_URL } from './fulfillment-config'

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Sent when the admin adds an AWB. Never throws — a failed email must not
// block marking an order as shipped.
export async function sendShippedEmail(input: {
  orderNumber: string
  customerName: string
  customerEmail: string
  courierName: string
  awb: string
  trackingUrl?: string | null
}) {
  try {
    const trackLink = `${SITE_URL}/track`
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: input.customerEmail,
      subject: `Your Taaora order ${input.orderNumber} has shipped`,
      html: `
        <div style="font-family: Georgia, serif; max-width:520px; margin:0 auto; color:#161310;">
          <h1 style="font-size:22px; font-style:italic; font-weight:normal;">Your order is on its way.</h1>
          <p>Hi ${esc(input.customerName)}, order <strong>${esc(input.orderNumber)}</strong> has been shipped.</p>
          <table style="width:100%; border-collapse:collapse; margin:16px 0; border-top:1px solid #E8E3DA;">
            <tr><td style="padding:8px 0; color:#6B6459;">Courier</td><td style="padding:8px 0; text-align:right;">${esc(input.courierName)}</td></tr>
            <tr><td style="padding:8px 0; color:#6B6459; border-top:1px solid #E8E3DA;">Tracking (AWB)</td><td style="padding:8px 0; text-align:right; border-top:1px solid #E8E3DA;">${esc(input.awb)}</td></tr>
          </table>
          <p>
            <a href="${trackLink}" style="display:inline-block; background:#161310; color:#fff; padding:12px 22px; text-decoration:none;">Track your order</a>
          </p>
          <p style="color:#6B6459; font-size:13px;">
            On the tracking page, enter the mobile number or email you used at checkout${input.trackingUrl ? `, or <a href="${esc(input.trackingUrl)}" style="color:#A9793D;">track directly with the courier</a>` : ''}.
          </p>
        </div>`,
    })
  } catch (err) {
    console.error('sendShippedEmail failed', err)
  }
}
