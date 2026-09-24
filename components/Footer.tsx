import Image from 'next/image'
import Link from 'next/link'

const shopLinks = [
  { href: '/', label: 'Home' },
  { href: '/products/imperial-wood', label: 'Shop Imperial Wood' },
  { href: '/#story', label: 'About' },
]

const policyLinks = [
  { href: '/policies/privacy', label: 'Privacy Policy' },
  { href: '/policies/terms', label: 'Terms & Conditions' },
  { href: '/policies/refund', label: 'Refund Policy' },
  { href: '/policies/shipping', label: 'Shipping Policy' },
]

export default function Footer() {
  return (
    <footer className="border-t border-hair bg-paper text-ink">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-4">
          <div className="sm:col-span-2">
            <Image
              src="/logo-removebg.png"
              alt="Taaora"
              width={160}
              height={140}
              className="h-24 w-28 object-contain"
            />
            <p className="mt-4 font-display text-lg italic">Taaora — Wear Your Presence.</p>
            <p className="mt-4 max-w-xs text-sm text-muted">
              {/* TODO: replace with your real business address */}
              Add your business address here
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted">Shop</p>
            <ul className="mt-4 space-y-3 text-sm">
              {shopLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-bronze transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-muted">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a
                  href="https://wa.me/917558566189"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-bronze transition-colors"
                >
                  WhatsApp: +91 75585 66189
                </a>
              </li>
              <li>
                <a href="mailto:taaoraperfumes@gmail.com" className="hover:text-bronze transition-colors">
                  taaoraperfumes@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-hair pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Taaora Perfumes. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {policyLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-ink transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}