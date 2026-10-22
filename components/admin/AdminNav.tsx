'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, LogOut } from 'lucide-react'

const links = [
  { href: '/admin/orders', label: 'Orders' },
  { href: '/admin/products', label: 'Product' },
]

export default function AdminNav() {
  const pathname = usePathname()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.assign('/admin/login')
  }

  return (
    <header className="sticky top-0 z-30 border-b border-hair bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link href="/admin/orders" className="flex items-center gap-3 py-1.5" aria-label="Taaora admin">
            <Image
              src="/logo-3.png"
              alt="Taaora"
              width={112}
              height={96}
              className="h-11 w-14 object-contain"
            />
            <span className="hidden h-6 w-px bg-hair sm:block" />
            <span className="hidden text-[11px] font-medium uppercase tracking-[0.3em] text-bronze sm:block">
              Admin
            </span>
          </Link>

          <nav className="flex">
            {links.map((l) => {
              const active = pathname.startsWith(l.href)
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3 py-5 text-[12px] font-medium uppercase tracking-[0.18em] transition-colors sm:px-4 ${
                    active ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {l.label}
                  {active && <span className="absolute inset-x-3 bottom-0 h-[2px] bg-bronze sm:inset-x-4" />}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-5 text-[12px] uppercase tracking-[0.14em] text-muted">
          <Link href="/" target="_blank" className="hidden items-center gap-1.5 hover:text-ink sm:flex">
            View site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button onClick={logout} className="flex items-center gap-1.5 hover:text-ink" aria-label="Log out">
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
