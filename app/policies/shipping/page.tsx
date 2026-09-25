import PolicyLayout from '@/components/PolicyLayout'

export const metadata = {
  title: 'Shipping Policy — Taaora Perfumes',
}

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      title="Shipping Policy"
      updated="25 September 2026"
      intro="Everything you need to know about how and when your Taaora order will reach you."
      sections={[
        {
          id: 'coverage',
          heading: 'Where we ship',
          content: <p>We currently ship across India.</p>,
        },
        {
          id: 'processing',
          heading: 'Processing time',
          content: (
            <p>
              Orders are processed and dispatched within 1–2 business days of payment confirmation.
            </p>
          ),
        },
        {
          id: 'timeframes',
          heading: 'Delivery timeframes',
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>Metro cities: typically 3–5 business days after dispatch</li>
              <li>Other locations: typically 5–7 business days after dispatch</li>
            </ul>
          ),
        },
        {
          id: 'charges',
          heading: 'Shipping charges',
          content: <p>Shipping is currently free on all orders across India.</p>,
        },
        {
          id: 'tracking',
          heading: 'Order tracking',
          content: (
            <p>
              Once your order ships, we'll send tracking details to you over WhatsApp and email so you
              can follow it the whole way.
            </p>
          ),
        },
        {
          id: 'delays',
          heading: 'Possible delays',
          content: (
            <p>
              Occasionally, factors outside our control — weather, courier disruptions, or remote
              delivery areas — can extend these timeframes. We'll keep you posted if that happens.
            </p>
          ),
        },
        {
          id: 'failed-delivery',
          heading: 'Failed delivery attempts',
          content: (
            <p>
              If a courier is unable to deliver your order after a few attempts, it may be returned to
              us. We'll reach out to reschedule delivery or resolve the issue.
            </p>
          ),
        },
        {
          id: 'contact',
          heading: 'Contact us',
          content: (
            <p>
              Questions about your delivery? WhatsApp us at{' '}
              <a href="https://wa.me/917558566189" className="underline underline-offset-2 hover:text-ink">
                +91 75585 66189
              </a>{' '}
              or email{' '}
              <a href="mailto:taaoraperfumes@gmail.com" className="underline underline-offset-2 hover:text-ink">
                taaoraperfumes@gmail.com
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  )
}