import type { TrackStage, TrackStep } from '@/lib/order-status'

export type TrackSummary = {
  orderNumber: string
  placedAt: string
  stage: TrackStage
  stageLabel: string
  items: string
  totalPaise: number
  paymentMethod: 'online' | 'cod'
}

export type TrackEvent = {
  status: string
  location: string | null
  time: string | null
  message: string | null
}

export type TrackDetail = {
  orderNumber: string
  placedAt: string
  stage: TrackStage
  stageLabel: string
  message: string
  steps: TrackStep[]
  items: string
  totalPaise: number
  paymentMethod: 'online' | 'cod'
  destination: string
  shipment: { courier: string | null; awb: string; link: string | null } | null
  live: { status: string | null; edd: string | null; events: TrackEvent[] } | null
  liveUnavailable: boolean
  alert: 'rto' | 'exception' | null
}
