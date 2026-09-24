import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import ProductGallery from '@/components/ProductGallery'
import BuyBox from '@/components/BuyBox'
import NotesSection from '@/components/NoteSection'
import Footer from '@/components/Footer'
import type { Product } from '@/types/product'

export const revalidate = 60 // re-check stock/price every minute

async function getProduct(): Promise<Product | null> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', 'imperial-wood')
    .eq('is_active', true)
    .single()
  return data
}

export default async function ProductPage() {
  const product = await getProduct()
  if (!product) notFound()

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar mode="solid" />

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <ProductGallery media={product.images} productName={product.name} />
          <div className="lg:sticky lg:top-24 lg:self-start">
            <BuyBox product={product} />
          </div>
        </div>
      </main>

      <section className="border-t border-hair">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div className="aspect-4/3 overflow-hidden bg-[#F5F3EE]">
            <img
              src="/image-1.webp"
              alt="Imperial Wood fragrance"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-display text-2xl italic text-ink">A fragrance made for presence.</p>
            <p className="mt-4 text-muted leading-relaxed">
              Designed for first meetings, important rooms, evening occasions, and everyday confidence —
              Imperial Wood is more than a fragrance. It is part of how you show up.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-hair">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <p className="font-display text-2xl italic text-ink">A rich, 30% concentration.</p>
            <p className="mt-4 text-muted leading-relaxed">
              A smooth, luxurious depth that lasts — blending a sophisticated woody character with warmth
              that settles into your skin rather than sitting on top of it.
            </p>
          </div>
          <div className="order-1 aspect-4/3 overflow-hidden bg-[#F5F3EE] lg:order-2">
            <img
              src="/image-2.webp"
              alt="Imperial Wood fragrance details"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <div className="border-t border-hair">
        <NotesSection product={product} />
      </div>

      <Footer />
    </div>
  )
}