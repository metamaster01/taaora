'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ImagePlus, Trash2 } from 'lucide-react'
import { formatRupees } from '@/lib/format'
import type { Product, ProductMedia } from '@/types/product'
import { btnGhost, btnPrimary, card, cardAccent, eyebrow, inputCls, textareaCls } from './ui'

type Draft = {
  name: string
  tagline: string
  short_description: string
  description: string
  overall_impression: string
  gender: string
  regular: string // rupees
  sale: string // rupees
  size_ml: string
  concentration_pct: string
  stock_count: string
  is_active: boolean
  top_notes: string
  heart_notes: string
  base_notes: string
  scent_profile: string
  images: ProductMedia[]
}

const toRupees = (paise: number) => String(paise / 100)
const toList = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean)

function toDraft(p: Product): Draft {
  return {
    name: p.name ?? '',
    tagline: p.tagline ?? '',
    short_description: p.short_description ?? '',
    description: p.description ?? '',
    overall_impression: p.overall_impression ?? '',
    gender: p.gender ?? '',
    regular: toRupees(p.regular_price_paise),
    sale: toRupees(p.sale_price_paise),
    size_ml: p.size_ml?.toString() ?? '',
    concentration_pct: p.concentration_pct?.toString() ?? '',
    stock_count: String(p.stock_count),
    is_active: p.is_active,
    top_notes: (p.top_notes ?? []).join(', '),
    heart_notes: (p.heart_notes ?? []).join(', '),
    base_notes: (p.base_notes ?? []).join(', '),
    scent_profile: (p.scent_profile ?? []).join(', '),
    images: p.images ?? [],
  }
}

function toPayload(id: string, d: Draft) {
  return {
    id,
    name: d.name,
    tagline: d.tagline,
    short_description: d.short_description,
    description: d.description,
    overall_impression: d.overall_impression,
    gender: d.gender,
    regular_price_paise: Math.round(parseFloat(d.regular) * 100),
    sale_price_paise: Math.round(parseFloat(d.sale) * 100),
    size_ml: d.size_ml,
    concentration_pct: d.concentration_pct,
    stock_count: d.stock_count,
    is_active: d.is_active,
    top_notes: toList(d.top_notes),
    heart_notes: toList(d.heart_notes),
    base_notes: toList(d.base_notes),
    scent_profile: toList(d.scent_profile),
    images: d.images,
  }
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">{label}</span>
        {hint && <span className="text-[11px] text-muted/70">{hint}</span>}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  )
}

function Card({
  title,
  subtitle,
  children,
  className = '',
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`${card} p-6 sm:p-8 ${className}`}>
      <span className={cardAccent} />
      <h2 className="font-display text-xl">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

function ProductForm({ product, onSaved }: { product: Product; onSaved: (p: Product) => void }) {
  const [d, setD] = useState<Draft>(() => toDraft(product))
  const baseline = useRef(JSON.stringify(toDraft(product)))
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const dirty = JSON.stringify(d) !== baseline.current

  // Warn before closing the tab with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [dirty])

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setD((prev) => ({ ...prev, [k]: v }))
    setMsg(null)
  }

  const regularPaise = Math.round(parseFloat(d.regular) * 100)
  const salePaise = Math.round(parseFloat(d.sale) * 100)
  const pricesValid = regularPaise > 0 && salePaise > 0 && salePaise <= regularPaise
  const discount = pricesValid ? Math.round(((regularPaise - salePaise) / regularPaise) * 100) : 0

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    setMsg(null)
    try {
      const added: ProductMedia[] = []
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append('file', file)
        const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
        const json = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(json.error ?? 'Upload failed.')
        added.push({ url: json.url, alt: d.name || 'Product image', type: 'image' })
      }
      setD((prev) => ({ ...prev, images: [...prev.images, ...added] }))
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Upload failed.' })
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function addUrl() {
    const url = urlInput.trim()
    if (!/^(https:\/\/|\/)\S+$/.test(url)) {
      setMsg({ kind: 'err', text: 'Enter a link starting with https:// (or / for a file in /public).' })
      return
    }
    const isVideo = /\.(mp4|webm)(\?|$)/i.test(url)
    set('images', [...d.images, { url, alt: d.name, ...(isVideo ? { type: 'video' as const } : {}) }])
    setUrlInput('')
  }

  const move = (i: number, dir: -1 | 1) => {
    const next = [...d.images]
    const j = i + dir
    if (j < 0 || j >= next.length) return
    ;[next[i], next[j]] = [next[j], next[i]]
    set('images', next)
  }

  async function save() {
    setSaving(true)
    setMsg(null)
    try {
      const res = await fetch('/api/admin/product', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toPayload(product.id, d)),
      })
      const json = await res.json().catch(() => ({}))
      if (res.status === 401) {
        window.location.assign('/admin/login')
        return
      }
      if (!res.ok) throw new Error(json.error ?? 'Could not save.')
      onSaved(json.product)
      const fresh = toDraft(json.product)
      baseline.current = JSON.stringify(fresh)
      setD(fresh)
      setMsg({ kind: 'ok', text: 'Saved — the live site is updated.' })
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Could not save.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* ================= main column ================= */}
        <div className="space-y-6">
          <Card title="Details" subtitle="What shoppers read on the product page.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Product name">
                <input className={inputCls} value={d.name} onChange={(e) => set('name', e.target.value)} />
              </Field>
              <Field label="Gender / audience">
                <input className={inputCls} value={d.gender} onChange={(e) => set('gender', e.target.value)} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Tagline">
                  <input className={inputCls} value={d.tagline} onChange={(e) => set('tagline', e.target.value)} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Short description">
                  <input
                    className={inputCls}
                    value={d.short_description}
                    onChange={(e) => set('short_description', e.target.value)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Description">
                  <textarea
                    rows={4}
                    className={textareaCls}
                    value={d.description}
                    onChange={(e) => set('description', e.target.value)}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Overall impression">
                  <textarea
                    rows={2}
                    className={textareaCls}
                    value={d.overall_impression}
                    onChange={(e) => set('overall_impression', e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </Card>

          <Card title="Fragrance" subtitle="Notes and attributes. Separate multiple entries with commas.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Size (ml)">
                <input className={inputCls} value={d.size_ml} onChange={(e) => set('size_ml', e.target.value)} />
              </Field>
              <Field label="Concentration (%)">
                <input
                  className={inputCls}
                  value={d.concentration_pct}
                  onChange={(e) => set('concentration_pct', e.target.value)}
                />
              </Field>
              <Field label="Top notes">
                <input className={inputCls} value={d.top_notes} onChange={(e) => set('top_notes', e.target.value)} />
              </Field>
              <Field label="Heart notes">
                <input className={inputCls} value={d.heart_notes} onChange={(e) => set('heart_notes', e.target.value)} />
              </Field>
              <Field label="Base notes">
                <input className={inputCls} value={d.base_notes} onChange={(e) => set('base_notes', e.target.value)} />
              </Field>
              <Field label="Scent profile">
                <input
                  className={inputCls}
                  value={d.scent_profile}
                  onChange={(e) => set('scent_profile', e.target.value)}
                />
              </Field>
            </div>
          </Card>

          <Card title="Images" subtitle="The first image is the main one. JPG, PNG, WebP or AVIF, up to 4 MB each.">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {d.images.map((m, i) => (
                <div key={`${m.url}-${i}`}>
                  <div className="group relative aspect-square overflow-hidden bg-hair/50">
                    {m.type === 'video' ? (
                      <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted">
                        Video
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.url} alt={m.alt} className="h-full w-full object-cover" />
                    )}

                    {i === 0 && (
                      <span className="absolute left-2 top-2 bg-bronze px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
                        Main
                      </span>
                    )}

                    <button
                      onClick={() => set('images', d.images.filter((_, k) => k !== i))}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center bg-white/90 text-red-700 opacity-100 transition-opacity hover:bg-white sm:opacity-0 sm:group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>

                    <div className="absolute inset-x-0 bottom-0 flex justify-between bg-gradient-to-t from-black/50 to-transparent p-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="Move earlier"
                        className="flex h-7 w-7 items-center justify-center bg-white/90 hover:bg-white disabled:opacity-30"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === d.images.length - 1}
                        aria-label="Move later"
                        className="flex h-7 w-7 items-center justify-center bg-white/90 hover:bg-white disabled:opacity-30"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                  <input
                    value={m.alt}
                    onChange={(e) =>
                      set(
                        'images',
                        d.images.map((x, k) => (k === i ? { ...x, alt: e.target.value } : x)),
                      )
                    }
                    placeholder="Alt text"
                    aria-label="Alt text"
                    className="mt-2 h-9 w-full border border-hair bg-paper px-2 text-xs outline-none focus:border-ink"
                  />
                </div>
              ))}

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                hidden
                onChange={(e) => uploadFiles(e.target.files)}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-hair bg-paper text-muted transition-colors hover:border-bronze hover:text-bronze disabled:opacity-50"
              >
                <ImagePlus className="h-6 w-6" strokeWidth={1.25} />
                <span className="text-[11px] font-medium uppercase tracking-[0.16em]">
                  {uploading ? 'Uploading…' : 'Add image'}
                </span>
              </button>
            </div>

            <div className="mt-5 flex gap-2">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="…or paste an image / video link"
                className={inputCls}
              />
              <button onClick={addUrl} className={btnGhost}>
                Add
              </button>
            </div>
          </Card>
        </div>

        {/* ================= side column ================= */}
        <aside className="space-y-6 lg:sticky lg:top-24">
          {/* live storefront preview */}
          <div className="relative overflow-hidden bg-[#0A0908] p-6 text-[#F4F1EA]">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(169,121,61,0.30),transparent_60%)]"
            />
            <p className="relative text-[11px] font-medium uppercase tracking-[0.26em] text-[#C9C2B4]">
              Storefront preview
            </p>
            <p className="relative mt-4 font-display text-2xl italic leading-tight">{d.name || 'Product name'}</p>
            <div className="relative mt-4 flex items-baseline gap-3">
              <span className="font-display text-3xl">{pricesValid ? formatRupees(salePaise) : '—'}</span>
              {pricesValid && discount > 0 && (
                <>
                  <span className="text-sm text-[#C9C2B4] line-through">{formatRupees(regularPaise)}</span>
                  <span className="bg-bronze px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white">
                    {discount}% off
                  </span>
                </>
              )}
            </div>
            <p className="relative mt-3 text-xs text-[#C9C2B4]">
              {d.is_active ? 'Visible on the store' : 'Hidden from the store'} · {d.stock_count || 0} in stock
            </p>
          </div>

          <Card title="Price & stock">
            <div className="space-y-5">
              <Field label="Regular price (₹)">
                <input
                  inputMode="decimal"
                  className={inputCls}
                  value={d.regular}
                  onChange={(e) => set('regular', e.target.value)}
                />
              </Field>
              <Field label="Sale price (₹)" hint={pricesValid && discount > 0 ? `${discount}% off` : undefined}>
                <input
                  inputMode="decimal"
                  className={inputCls}
                  value={d.sale}
                  onChange={(e) => set('sale', e.target.value)}
                />
              </Field>
              <Field label="Stock" hint="units">
                <input
                  inputMode="numeric"
                  className={inputCls}
                  value={d.stock_count}
                  onChange={(e) => set('stock_count', e.target.value)}
                />
              </Field>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={d.is_active}
                  onChange={(e) => set('is_active', e.target.checked)}
                  className="h-4 w-4 accent-[#A9793D]"
                />
                Visible on the store
              </label>
              {regularPaise > 0 && salePaise > regularPaise && (
                <p className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-xs text-red-800">
                  Sale price can’t be higher than the regular price.
                </p>
              )}
              <p className="text-xs leading-relaxed text-muted">
                Price changes apply to new orders only — existing orders keep the price they were bought at.
              </p>
            </div>
          </Card>
        </aside>
      </div>

      {/* ================= sticky save bar ================= */}
      <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-hair bg-white/95 px-4 py-3 backdrop-blur sm:mx-0 sm:border sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <p
            className={`flex items-center gap-2 text-sm ${
              msg?.kind === 'err' ? 'text-red-700' : msg ? 'text-emerald-800' : 'text-muted'
            }`}
          >
            {!msg && dirty && <span className="h-2 w-2 rounded-full bg-bronze" />}
            {msg?.text ?? (dirty ? 'You have unsaved changes' : 'All changes saved')}
          </p>
          <button onClick={save} disabled={saving || uploading || !dirty} className={btnPrimary}>
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProductEditor() {
  const [products, setProducts] = useState<Product[] | null>(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)

  useEffect(() => {
    fetch('/api/admin/product', { cache: 'no-store' })
      .then(async (res) => {
        if (res.status === 401) {
          window.location.assign('/admin/login')
          return
        }
        const json = await res.json()
        if (!res.ok) throw new Error(json.error ?? 'Could not load products.')
        setProducts(json.products)
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Could not load products.'))
  }, [])

  if (error) return <p className="border-l-2 border-red-700 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
  if (!products)
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-24 bg-hair" />
        <div className="h-9 w-56 bg-hair" />
        <div className="h-72 bg-hair/60" />
      </div>
    )
  if (products.length === 0) return <p className="text-sm text-muted">No products found.</p>

  const current = products[active] ?? products[0]

  return (
    <div>
      <p className={eyebrow}>Catalogue</p>
      <h1 className="mt-1 font-display text-3xl sm:text-4xl">Product</h1>

      {products.length > 1 && (
        <div className="mt-5 flex gap-1 border-b border-hair">
          {products.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-[12px] font-medium uppercase tracking-[0.16em] ${
                i === active ? 'border-bronze text-ink' : 'border-transparent text-muted hover:text-ink'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      )}

      <div className="mt-7">
        <ProductForm
          key={current.id}
          product={current}
          onSaved={(saved) => setProducts((prev) => prev!.map((p) => (p.id === saved.id ? saved : p)))}
        />
      </div>
    </div>
  )
}
