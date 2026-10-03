// Sends the order_confirmation template directly via Meta's WhatsApp Cloud
// API (graph.facebook.com), rather than through a paid BSP layer like
// AiSensy. No monthly platform fee — only Meta's own per-message charge.

const GRAPH_API_VERSION = 'v21.0'

type WhatsAppOrderInput = {
  customerName: string
  customerPhone: string
  orderNumber: string
  items: { productName: string; quantity: number }[]
  totalFormatted: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
  }
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '')
  // Meta's Cloud API wants the full international number, digits only, no
  // leading '+'. Indian 10-digit numbers get 91 prefixed automatically.
  if (digits.length === 10) return `91${digits}`
  if (digits.length === 12 && digits.startsWith('91')) return digits
  return digits
}

function summarizeItems(items: WhatsAppOrderInput['items']) {
  return items.map((i) => `${i.productName} × ${i.quantity}`).join(', ')
}

function summarizeAddress(a: WhatsAppOrderInput['shippingAddress']) {
  return `${a.line1}${a.line2 ? ', ' + a.line2 : ''}, ${a.city}, ${a.state} ${a.pincode}`
}

// Called from the same two trigger points as before: the webhook (online
// payments) and the checkout route (COD). Same 5 template variables, same
// order — name, order number, item summary, total, address.
export async function sendWhatsAppConfirmation(order: WhatsAppOrderInput) {
  try {
    const token = process.env.META_WHATSAPP_TOKEN
    const phoneNumberId = process.env.META_WHATSAPP_PHONE_NUMBER_ID
    if (!token || !phoneNumberId) {
      console.error('Meta WhatsApp env vars missing — skipping WhatsApp send')
      return
    }

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_API_VERSION}/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: normalizePhone(order.customerPhone),
          type: 'template',
          template: {
            name: 'order_confirmation',
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: order.customerName },
                  { type: 'text', text: order.orderNumber },
                  { type: 'text', text: summarizeItems(order.items) },
                  { type: 'text', text: order.totalFormatted },
                  { type: 'text', text: summarizeAddress(order.shippingAddress) },
                ],
              },
            ],
          },
        }),
      },
    )

    if (!res.ok) {
      console.error('Meta WhatsApp send failed:', res.status, await res.text())
    }
  } catch (err) {
    // Same rule as always — a WhatsApp failure never breaks the order flow.
    console.error('Failed to send WhatsApp confirmation:', err)
  }
}
