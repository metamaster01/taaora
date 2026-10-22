'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react'

export default function LoginForm() {
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error ?? 'Login failed.')
        setBusy(false)
        return
      }
      // Only follow same-site admin paths — never an arbitrary redirect target.
      const next = params.get('next') ?? ''
      const safe = next.startsWith('/admin') && !next.startsWith('//') ? next : '/admin/orders'
      window.location.assign(safe)
    } catch {
      setError('Network error. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-paper text-ink lg:grid-cols-[1.05fr_1fr]">
      {/* ---------- brand panel (desktop only) ---------- */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#0A0908] p-14 text-[#F4F1EA] lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_25%_15%,rgba(169,121,61,0.30),transparent_58%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_90%_100%,rgba(169,121,61,0.14),transparent_55%)]"
        />

        <p className="relative text-[11px] uppercase tracking-[0.34em] text-[#C9C2B4]">Taaora Perfumes</p>

        <div className="relative max-w-md">
          <span className="block h-px w-12 bg-bronze" />
          <p className="mt-8 font-display text-5xl italic leading-[1.1]">Taaora - Wear your presence</p>
          <p className="mt-6 leading-relaxed text-[#C9C2B4]">
            Orders, shipments and the shelf — everything behind the counter, in one quiet place.
          </p>
        </div>

        <p className="relative text-xs text-[#C9C2B4]/70">© {new Date().getFullYear()} Taaora Wellness Pvt Ltd · Admin console</p>
      </aside>

      {/* ---------- sign-in ---------- */}
      <main className="flex flex-col items-center justify-center bg-[#FAF9F6] px-5 py-10 sm:px-8">
        <div className="w-full max-w-[420px]">
          <Link href="/" aria-label="Taaora — back to store" className="mx-auto block w-fit">
            <Image
              src="/logo-3.png"
              alt="Taaora"
              width={112}
              height={96}
              priority
              className="h-20 w-28 object-contain"
            />
          </Link>

          <div className="relative mt-6 border border-hair bg-white px-6 py-9 shadow-[0_28px_56px_-28px_rgba(22,19,16,0.22)] sm:px-10 sm:py-11">
            {/* bronze top accent */}
            <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-bronze" />

            <p className="text-center text-[11px] font-medium uppercase tracking-[0.32em] text-bronze">Admin</p>
            <h1 className="mt-3 text-center font-display text-[32px] leading-tight">Welcome back</h1>
            <p className="mt-2 text-center text-sm text-muted">Sign in to manage your orders and product.</p>

            <form onSubmit={submit} className="mt-9" noValidate>
              <label
                htmlFor="admin-password"
                className="block text-[11px] font-medium uppercase tracking-[0.2em] text-muted"
              >
                Password
              </label>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="admin-password"
                  type={show ? 'text' : 'password'}
                  autoFocus
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'login-error' : undefined}
                  className="h-12 w-full border border-hair bg-paper pl-10 pr-12 text-base outline-none transition-colors placeholder:text-muted/50 focus:border-ink focus:ring-1 focus:ring-ink"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-muted transition-colors hover:text-ink"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && (
                <p
                  id="login-error"
                  role="alert"
                  className="mt-4 border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={busy || !password}
                className="mt-6 h-12 w-full bg-ink text-[13px] font-medium uppercase tracking-[0.2em] text-paper transition-colors hover:bg-bronze disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-ink"
              >
                {busy ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>

          <Link
            href="/"
            className="mx-auto mt-6 flex w-fit items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to store
          </Link>
        </div>
      </main>
    </div>
  )
}
