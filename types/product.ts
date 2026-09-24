export type ProductMedia = { url: string; alt: string; type?: 'image' | 'video' }

export type Product = {
  id: string
  slug: string
  name: string
  tagline: string | null
  description: string | null
  short_description: string | null
  regular_price_paise: number
  sale_price_paise: number
  currency: string
  size_ml: number | null
  concentration_pct: number | null
  gender: string | null
  top_notes: string[] | null
  heart_notes: string[] | null
  base_notes: string[] | null
  scent_profile: string[] | null
  overall_impression: string | null
  images: ProductMedia[]
  stock_count: number
  is_active: boolean
}