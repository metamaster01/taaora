'use client'

import { useEffect } from 'react'
import { trackPurchase, type TrackUser } from '@/lib/meta-pixel'

// Drop into the order-success page once the order is confirmed.
export default function TrackPurchase(props: {
  orderId: string
  value: number
  contentIds?: string[]
  numItems?: number
  user?: TrackUser
}) {
  const { orderId, value, numItems, user } = props
  const ids = props.contentIds?.join(',')

  useEffect(() => {
    trackPurchase({ orderId, value, numItems, user, contentIds: ids ? ids.split(',') : undefined })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, value, numItems, ids])

  return null
}
