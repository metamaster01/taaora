'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import CheckoutSummary from '@/components/CheckoutSummary'
import TrustBadges from '@/components/TrustBadges'
import PaymentMethodSelector, { type PaymentMethod } from '@/components/PaymentMethodSelector'
import type { Product } from '@/types/product'

declare global {
  interface Window {
    Razorpay: any
  }
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

type FormState = {
  name: string
  email: string
  phone: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
}

const emptyForm: FormState = {
  name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '',
}

export default function CheckoutClient({ product, qty }: { product: Product; qty: number }) {
  const router = useRouter()

  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online')
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState('')

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate(): boolean {
    const next: Partial<FormState> = {}
    if (!form.name.trim()) next.name = 'Enter your full name'
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Enter a valid email'
    if (!/^[6-9]\d{9}$/.test(form.phone)) next.phone = 'Enter a valid 10-digit phone number'
    if (!form.line1.trim()) next.line1 = 'Enter your address'
    if (!form.city.trim()) next.city = 'Enter your city'
    if (!form.state.trim()) next.state = 'Enter your state'
    if (!/^\d{6}$/.test(form.pincode)) next.pincode = 'Enter a valid 6-digit pincode'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerError('')
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          quantity: qty,
          paymentMethod,
          address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setServerError(data.error || 'Something went wrong. Please try again.')
        setSubmitting(false)
        return
      }

      if (paymentMethod === 'cod') {
        router.push(`/checkout/success?order=${data.orderNumber}&method=cod`)
        return
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setServerError('Could not load the payment widget. Check your connection and try again.')
        setSubmitting(false)
        return
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        order_id: data.razorpayOrderId,
        name: 'Taaora Perfumes',
        description: `${product.name} — ${product.size_ml}ml`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#A9793D' },
        handler: () => {
          // The frontend redirect is never the source of truth — the webhook
          // confirms payment server-side. This just gets the customer to a
          // "we've got it" screen.
          router.push(`/checkout/success?order=${data.orderNumber}&method=online`)
        },
        modal: {
          ondismiss: () => setSubmitting(false),
        },
      })

      razorpay.on('payment.failed', () => {
        setServerError('Payment failed or was cancelled. You can try again.')
        setSubmitting(false)
      })

      razorpay.open()
    } catch (err) {
      setServerError('Something went wrong. Please try again.')
      setSubmitting(false)
    }
  }

  const fields: { key: keyof FormState; label: string; span?: string }[] = [
    { key: 'name', label: 'Full name', span: 'sm:col-span-2' },
    { key: 'email', label: 'Email', span: 'sm:col-span-2' },
    { key: 'phone', label: 'Phone number', span: 'sm:col-span-2' },
    { key: 'line1', label: 'Address line 1', span: 'sm:col-span-2' },
    { key: 'line2', label: 'Address line 2 (optional)', span: 'sm:col-span-2' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' },
  ]

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-hair px-6 py-4">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="font-display text-xl">
            Taaora
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        <h1 className="font-display text-3xl italic">Checkout</h1>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div>
              <h2 className="font-display text-lg italic">Shipping details</h2>
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {fields.map(({ key, label, span }) => (
                  <div key={key} className={span}>
                    <label htmlFor={key} className="text-sm text-muted">
                      {label}
                    </label>
                    <input
                      id={key}
                      value={form[key]}
                      onChange={(e) => update(key, e.target.value)}
                      className="mt-1 w-full border border-hair bg-paper px-3 py-2 outline-none focus:border-ink"
                    />
                    {errors[key] && <p className="mt-1 text-sm text-red-700">{errors[key]}</p>}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-display text-lg italic">Payment method</h2>
              <div className="mt-4">
                <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />
              </div>
            </div>

            {serverError && <p className="text-sm text-red-700">{serverError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-ink py-4 text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {submitting
                ? 'Processing…'
                : paymentMethod === 'cod'
                  ? 'Place order'
                  : 'Proceed to payment'}
            </button>
          </form>

          <div className="flex flex-col gap-8 lg:sticky lg:top-12">
            <CheckoutSummary product={product} qty={qty} />
            <TrustBadges />
          </div>
        </div>
      </main>
    </div>
  )
}