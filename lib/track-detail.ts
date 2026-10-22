// Builds the customer-facing detail for ONE order row (from findOrders).
// Shared by /api/track (single match → returned inline) and /api/track/order.
import {
  STAGE_LABEL,
  buildSteps,
  classifyCourierStatus,
  deriveStage,
  type OrderStatus,
  type TrackStage,
} from './order-status'
import { itemsSummary } from './track-lookup'
import { trackByAwb } from './nimbuspost'
import { DISPATCH_WINDOW_TEXT, courierTrackingUrl } from './fulfillment-config'
import type { TrackDetail } from '@/types/track'

function messageFor(stage: TrackStage, courier: string | null, alert: TrackDetail['alert']): string {
  if (alert === 'rto')
    return 'The courier is returning this package to us. Please contact us on WhatsApp so we can sort it out quickly.'
  if (alert === 'exception')
    return 'The courier reported a delivery issue. They usually retry — if it doesn’t arrive soon, message us on WhatsApp and we’ll follow up.'
  switch (stage) {
    case 'confirmed':
      return `We’ve received your order and we’re preparing it. ${DISPATCH_WINDOW_TEXT} We’ll email your tracking details as soon as it ships.`
    case 'shipped':
      return `Your order has shipped${courier ? ` with ${courier}` : ''} and is on its way.`
    case 'out_for_delivery':
      return 'Your order is out for delivery today. Please keep your phone handy.'
    case 'delivered':
      return 'Your order has been delivered. We hope you love it.'
    case 'cancelled':
      return 'This order was cancelled. If you paid online, any refund goes back to your original payment method — message us on WhatsApp if you need help.'
  }
}

export async function buildTrackDetail(o: any): Promise<TrackDetail> {
  // Ask the courier only while the parcel is actually in transit.
  const live = o.order_status === 'shipped' && o.awb_number ? await trackByAwb(o.awb_number) : null
  const courierState = classifyCourierStatus(live?.status)
  const stage = deriveStage(o.order_status as OrderStatus, courierState)
  const alert = courierState === 'rto' ? 'rto' : courierState === 'exception' ? 'exception' : null
  const addr = o.shipping_address ?? {}

  return {
    orderNumber: o.order_number,
    placedAt: o.created_at,
    stage,
    stageLabel: STAGE_LABEL[stage],
    message: messageFor(stage, o.courier_name, alert),
    steps: buildSteps(stage, {
      confirmed: o.created_at,
      shipped: o.shipped_at,
      delivered: o.delivered_at,
    }),
    items: itemsSummary(o.order_items),
    totalPaise: o.total_paise,
    paymentMethod: o.payment_method,
    // City + state only — never the street address.
    destination: [addr.city, addr.state].filter(Boolean).join(', '),
    shipment: o.awb_number
      ? {
          courier: o.courier_name,
          awb: o.awb_number,
          link: courierTrackingUrl(o.awb_number, o.tracking_url),
        }
      : null,
    live,
    liveUnavailable: o.order_status === 'shipped' && !live,
    alert,
  }
}
