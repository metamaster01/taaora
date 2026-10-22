import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { supabaseAdmin } from '@/lib/supabase'
import { requireAdmin } from '@/lib/admin-guard'

export const dynamic = 'force-dynamic'

const fail = (error: string, status = 400) => NextResponse.json({ error }, { status })

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: true })
  if (error) return fail('Could not load products.', 500)
  return NextResponse.json({ products: data ?? [] })
}

// Helpers: each returns the cleaned value, or throws a user-facing message.
const text = (v: unknown, label: string, max: number, required = false) => {
  if (v == null || v === '') {
    if (required) throw new Error(`${label} is required.`)
    return null
  }
  if (typeof v !== 'string') throw new Error(`${label} is invalid.`)
  const t = v.trim()
  if (required && !t) throw new Error(`${label} is required.`)
  if (t.length > max) throw new Error(`${label} is too long (max ${max} characters).`)
  return t || null
}

const int = (v: unknown, label: string, min: number, max: number, nullable = false) => {
  if ((v == null || v === '') && nullable) return null
  const n = Number(v)
  if (!Number.isInteger(n) || n < min || n > max) throw new Error(`${label} must be a whole number between ${min} and ${max}.`)
  return n
}

const list = (v: unknown, label: string) => {
  if (v == null) return []
  if (!Array.isArray(v) || v.length > 12) throw new Error(`${label} is invalid (max 12 entries).`)
  return v
    .map((x) => (typeof x === 'string' ? x.trim() : ''))
    .filter(Boolean)
    .map((x) => {
      if (x.length > 60) throw new Error(`${label}: each entry must be under 60 characters.`)
      return x
    })
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  const body = await req.json().catch(() => null)
  const id = typeof body?.id === 'string' ? body.id : ''
  if (!id) return fail('Invalid request.')

  let update: Record<string, unknown>
  try {
    const regular = int(body.regular_price_paise, 'Regular price', 100, 100_000_00)
    const sale = int(body.sale_price_paise, 'Sale price', 100, 100_000_00)
    if (regular === null) throw new Error('Regular price is required.')
    if (sale === null) throw new Error('Sale price is required.')
    if (sale > regular) throw new Error('Sale price cannot be higher than the regular price.')

    const images = Array.isArray(body.images) ? body.images : null
    if (!images || images.length > 12) throw new Error('Add between 0 and 12 images.')
    const cleanImages = images.map((m: any) => {
      const url = typeof m?.url === 'string' ? m.url.trim() : ''
      if (!/^(https:\/\/|\/)\S+$/.test(url)) throw new Error('Every image needs a valid https:// or / URL.')
      const alt = typeof m?.alt === 'string' ? m.alt.trim().slice(0, 160) : ''
      return { url, alt, ...(m?.type === 'video' ? { type: 'video' } : {}) }
    })

    update = {
      name: text(body.name, 'Name', 120, true),
      tagline: text(body.tagline, 'Tagline', 160),
      short_description: text(body.short_description, 'Short description', 160),
      description: text(body.description, 'Description', 3000),
      overall_impression: text(body.overall_impression, 'Overall impression', 500),
      gender: text(body.gender, 'Gender', 40),
      regular_price_paise: regular,
      sale_price_paise: sale,
      size_ml: int(body.size_ml, 'Size (ml)', 1, 5000, true),
      concentration_pct: int(body.concentration_pct, 'Concentration (%)', 0, 100, true),
      stock_count: int(body.stock_count, 'Stock', 0, 1_000_000),
      is_active: Boolean(body.is_active),
      top_notes: list(body.top_notes, 'Top notes'),
      heart_notes: list(body.heart_notes, 'Heart notes'),
      base_notes: list(body.base_notes, 'Base notes'),
      scent_profile: list(body.scent_profile, 'Scent profile'),
      images: cleanImages,
    }
  } catch (e) {
    return fail(e instanceof Error ? e.message : 'Invalid input.')
  }

  const { data, error } = await supabaseAdmin
    .from('products')
    .update(update)
    .eq('id', id)
    .select('*')
    .single()

  if (error || !data) {
    console.error('product update failed', error)
    return fail('Could not save product.', 500)
  }

  // Price/stock/images changed — make the storefront reflect it immediately
  // instead of waiting for the 60s revalidation window.
  revalidatePath('/', 'layout')

  return NextResponse.json({ product: data })
}
