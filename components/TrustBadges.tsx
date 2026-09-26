import { ShieldCheck, Truck, BadgeCheck, MessageCircle } from 'lucide-react'

const badges = [
  { icon: ShieldCheck, label: '100% Authentic', sub: 'Sourced directly from us' },
  { icon: Truck, label: 'Free Delivery', sub: 'Across India' },
  { icon: BadgeCheck, label: 'Secure Checkout', sub: 'Razorpay-protected' },
  { icon: MessageCircle, label: 'Real Support', sub: 'WhatsApp us anytime' },
]

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 border border-hair p-6 sm:p-8">
      {badges.map(({ icon: Icon, label, sub }) => (
        <div key={label} className="flex flex-col items-start gap-2">
          <Icon className="h-5 w-5 text-bronze" strokeWidth={1.5} />
          <div>
            <p className="text-sm font-medium text-ink">{label}</p>
            <p className="text-xs text-muted">{sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}