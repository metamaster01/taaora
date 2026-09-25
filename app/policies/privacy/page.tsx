import PolicyLayout from '@/components/PolicyLayout'

export const metadata = {
  title: 'Privacy Policy — Taaora Perfumes',
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="25 September 2026"
      intro="This policy explains what information Taaora Perfumes collects when you visit this site or place an order, and how we use it."
      sections={[
        {
          id: 'overview',
          heading: 'Overview',
          content: (
            <p>
              Taaora Perfumes ("Taaora", "we", "us") respects your privacy. This policy applies to
              information collected through taaora.in and covers what we collect, why we collect it,
              and the choices you have.
            </p>
          ),
        },
        {
          id: 'information-we-collect',
          heading: 'Information we collect',
          content: (
            <>
              <p>When you place an order, we collect:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Your name, email address, and phone number</li>
                <li>Your shipping address</li>
                <li>Order details (product, quantity, amount)</li>
              </ul>
              <p>
                We do not collect or store your card, UPI, or bank details — payments are handled
                entirely by Razorpay, our payment processor.
              </p>
            </>
          ),
        },
        {
          id: 'how-we-use-it',
          heading: 'How we use your information',
          content: (
            <ul className="list-disc space-y-2 pl-5">
              <li>To process and deliver your order</li>
              <li>To send order confirmations and shipping updates via email or WhatsApp</li>
              <li>To respond to questions you send us</li>
              <li>To improve this website and our products</li>
            </ul>
          ),
        },
        {
          id: 'payment-information',
          heading: 'Payment information',
          content: (
            <p>
              All payments are processed by Razorpay. Taaora never sees or stores your full card
              number, UPI PIN, or bank credentials. Razorpay's own privacy and security practices
              govern how that payment data is handled.
            </p>
          ),
        },
        {
          id: 'sharing',
          heading: 'Data sharing',
          content: (
            <p>
              We share your information only with the parties necessary to fulfil your order — our
              payment processor (Razorpay) and shipping courier. We do not sell, rent, or trade your
              personal information to third parties for marketing purposes.
            </p>
          ),
        },
        {
          id: 'cookies',
          heading: 'Cookies',
          content: (
            <p>
              This site may use basic cookies to remember your preferences and understand how the site
              is used. You can disable cookies through your browser settings, though some features of
              the site may not work as intended without them.
            </p>
          ),
        },
        {
          id: 'security',
          heading: 'Data security',
          content: (
            <p>
              We take reasonable measures to protect your personal information. However, no method of
              transmission over the internet is completely secure, and we cannot guarantee absolute
              security.
            </p>
          ),
        },
        {
          id: 'your-rights',
          heading: 'Your rights',
          content: (
            <p>
              You can request access to, correction of, or deletion of your personal data at any time
              by emailing us at taaoraperfumes@gmail.com.
            </p>
          ),
        },
        {
          id: 'children',
          heading: "Children's privacy",
          content: (
            <p>
              This site is not directed at children, and we do not knowingly collect personal
              information from anyone under 18.
            </p>
          ),
        },
        {
          id: 'changes',
          heading: 'Changes to this policy',
          content: (
            <p>
              We may update this policy from time to time. Changes will be posted on this page with an
              updated "Last updated" date.
            </p>
          ),
        },
        {
          id: 'contact',
          heading: 'Contact us',
          content: (
            <p>
              Questions about this policy? Reach us on WhatsApp at{' '}
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