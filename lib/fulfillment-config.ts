export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://taaora.in'
export const SUPPORT_WHATSAPP = '917558566189'

// Shown on the track page while an order is confirmed but not yet shipped.
// Keep this consistent with your Shipping Policy page.
export const DISPATCH_WINDOW_TEXT = 'Orders usually ship within 1–2 business days.'

// Optional courier-site fallback link. Set TRACKING_URL_TEMPLATE in env to
// something like https://example-courier.com/track?awb={awb}. A per-order
// tracking_url (set in the admin panel) always wins.
export function courierTrackingUrl(awb: string, override?: string | null): string | null {
  if (override) return override
  const template = process.env.TRACKING_URL_TEMPLATE
  return template ? template.replace('{awb}', encodeURIComponent(awb)) : null
}
