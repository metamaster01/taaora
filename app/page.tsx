import { supabaseAdmin } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductShowcase from '@/components/ProductShowcase'
import Footer from '@/components/Footer'
import type { Product } from '@/types/product'

export const revalidate = 60

async function getProduct(): Promise<Product | null> {
  const { data } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', 'imperial-wood')
    .eq('is_active', true)
    .single()
  return data
}

export default async function HomePage() {
  const product = await getProduct()

  return (
    <div className="min-h-screen bg-black">
      <Navbar mode="auto" />

      {product ? (
        <>
          <Hero product={product} />
          <ProductShowcase product={product} />
        </>
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-[#F4F1EA]">
          <p className="font-display text-xl italic">Imperial Wood — coming soon.</p>
        </div>
      )}

      <Footer />
    </div>
  )
}