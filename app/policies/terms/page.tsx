import PolicyLayout from '@/components/PolicyLayout'

export const metadata = {
  title: 'Terms & Conditions — Taaora Perfumes',
}

export default function TermsPage() {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      updated="25 September 2026"
      intro="By using this website or placing an order with Taaora Perfumes, you agree to the terms below."
      sections={[
        {
          id: 'about',
          heading: 'About Taaora',
          content: (
            <p>
              Taaora Perfumes is a single-product fragrance brand based in India, currently offering
              Imperial Wood, a unisex Eau de Parfum.
            </p>
          ),
        },
        {
          id: 'eligibility',
          heading: 'Eligibility',
          content: (
            <p>
              You must be at least 18 years old, or purchasing with the involvement of a parent or
              guardian, to place an order on this site.
            </p>
          ),
        },
        {
          id: 'orders',
          heading: 'Orders & acceptance',
          content: (
            <p>
              Placing an order is an offer to buy. We confirm orders once payment is verified. We
              reserve the right to refuse or cancel any order — for example in cases of suspected fraud
              or stock unavailability — and will notify you if this happens.
            </p>
          ),
        },
        {
          id: 'pricing',
          heading: 'Pricing & payment',
          content: (
            <p>
              All prices are listed in Indian Rupees (INR). Checkout is prepaid only, processed
              securely through Razorpay (cards, UPI, netbanking, and wallets). We do not currently
              offer Cash on Delivery.
            </p>
          ),
        },
        {
          id: 'shipping',
          heading: 'Shipping',
          content: (
            <p>
              Shipping timelines and coverage are detailed in our{' '}
              <a href="/policies/shipping" className="underline underline-offset-2 hover:text-ink">
                Shipping Policy
              </a>
              .
            </p>
          ),
        },
        {
          id: 'returns',
          heading: 'Returns & refunds',
          content: (
            <p>
              Our approach to returns, exchanges, and refunds is detailed in our{' '}
              <a href="/policies/refund" className="underline underline-offset-2 hover:text-ink">
                Refund Policy
              </a>
              .
            </p>
          ),
        },
        {
          id: 'product-information',
          heading: 'Product information',
          content: (
            <p>
              We describe our fragrance and its notes as accurately as we can, but scent perception is
              personal and can vary from person to person and skin type to skin type. Product images
              are for illustration and may vary slightly from the item you receive.
            </p>
          ),
        },
        {
          id: 'ip',
          heading: 'Intellectual property',
          content: (
            <p>
              The Taaora name, logo, product photography, and website content are the property of
              Taaora Perfumes and may not be reproduced or used without written permission.
            </p>
          ),
        },
        {
          id: 'liability',
          heading: 'Limitation of liability & allergy notice',
          content: (
            <>
              <p>
                Taaora is not liable for indirect or incidental damages arising from the use of our
                products or website.
              </p>
              <p>
                Fragrance ingredients can cause reactions in people with sensitive skin or allergies. We
                recommend patch-testing on a small area of skin before full use, and discontinuing use
                immediately if irritation occurs.
              </p>
            </>
          ),
        },
        {
          id: 'governing-law',
          heading: 'Governing law',
          content: (
            <p>
              These terms are governed by the laws of India, with courts at [your city] having
              exclusive jurisdiction over any disputes.
            </p>
          ),
        },
        {
          id: 'changes',
          heading: 'Changes to these terms',
          content: (
            <p>
              We may update these terms from time to time. Continued use of the site after changes are
              posted constitutes acceptance of the updated terms.
            </p>
          ),
        },
        {
          id: 'contact',
          heading: 'Contact us',
          content: (
            <p>
              Questions about these terms? Reach us on WhatsApp at{' '}
              <a href="https://wa.me/917558566189" className="underline underline-offset-2 hover:text-ink">
                +91 75585 66189
              </a>{' '}
              or by email at{' '}
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