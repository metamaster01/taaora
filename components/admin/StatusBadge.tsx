import type { OrderStatus } from '@/lib/order-status'

const STYLES: Record<OrderStatus, { label: string; cls: string; dot: string }> = {
  confirmed: { label: 'To ship', cls: 'bg-[#A9793D]/10 text-[#7A5428]', dot: 'bg-bronze' },
  shipped: { label: 'Shipped', cls: 'bg-sky-50 text-sky-800', dot: 'bg-sky-500' },
  delivered: { label: 'Delivered', cls: 'bg-emerald-50 text-emerald-800', dot: 'bg-emerald-500' },
  cancelled: { label: 'Cancelled', cls: 'bg-neutral-100 text-neutral-600', dot: 'bg-neutral-400' },
  pending: { label: 'Awaiting payment', cls: 'bg-neutral-50 text-neutral-500 ring-1 ring-inset ring-hair', dot: 'bg-neutral-300' },
}

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.12em] ${s.cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}
