import PolicyLayout from '@/components/PolicyLayout'

export const metadata = {
  title: 'Refund Policy — Taaora Perfumes',
}

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      title="Refund Policy"
      updated="25 September 2026"
      intro="Fragrance is a hygiene-sensitive product, so our refund policy works a little differently than a typical online store. Here's exactly how it works."
      sections={[
        {
          id: 'non-returnable',
          heading: 'Once opened, non-returnable',
          content: (
            <p>
              For hygiene reasons, we're unable to accept returns or exchanges once the seal on your
              bottle has been opened. This is standard practice across the fragrance industry and helps
              us guarantee that every bottle we ship is untouched and authentic.
            </p>
          ),
        },
        {
          id: 'damaged-or-incorrect',
          heading: 'Damaged or incorrect orders',
          content: (
            <>
              <p>If your order arrives damaged, leaking, or isn't what you ordered:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Contact us within 48 hours of delivery</li>
                <li>Share clear photos or a short video of the product and packaging</li>
                <li>We'll arrange a replacement or a full refund — your choice</li>
              </ul>
            </>
          ),
        },
        {
          id: 'refund-process',
          heading: 'How refunds are processed',
          content: (
            <p>
              Approved refunds are issued to your original payment method through Razorpay, and
              typically reflect in your account within 5–7 business days, depending on your bank or
              payment provider.
            </p>
          ),
        },
        {
          id: 'cancellations',
          heading: 'Order cancellations',
          content: (
            <p>
              You can cancel an order free of charge as long as it hasn't been dispatched yet — message
              us as soon as possible with your order number. Once an order has shipped, it can no
              longer be cancelled.
            </p>
          ),
        },
        {
          id: 'how-to-request',
          heading: 'How to request a refund or replacement',
          content: (
            <p>
              Message us on WhatsApp or email with your order number and a brief description of the
              issue — we'll take it from there.
            </p>
          ),
        },
        {
          id: 'contact',
          heading: 'Contact us',
          content: (
            <p>
              WhatsApp:{' '}
              <a href="https://wa.me/917558566189" className="underline underline-offset-2 hover:text-ink">
                +91 75585 66189
              </a>
              {' · '}Email:{' '}
              <a href="mailto:taaoraperfumes@gmail.com" className="underline underline-offset-2 hover:text-ink">
                taaoraperfumes@gmail.com
              </a>
            </p>
          ),
        },
      ]}
    />
  )
}