import { supabaseAdmin } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import ProductShowcase from '@/components/ProductShowcase'
import Footer from '@/components/Footer'
import type { Product } from '@/types/product'
import ScentJourney from '@/components/ScentJourney';
import AboutTaaora from '@/components/AboutTaaora';
import PromoBanner from '@/components/PromoBanner';
import FaqChat from '@/components/FaqChat';
import CtaSection from '@/components/CtaSection';
import TrustSignals from '@/components/TrustSignals';
import Testimonials from '@/components/Testimonials';

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
    <div className="min-h-screen bg-white">
      <Navbar mode="auto" />

      {product ? (
        <>
          <Hero product={product} />
          <ProductShowcase product={product} />
<AboutTaaora />
          <ScentJourney product={product} />
<PromoBanner product={product} />
        </>
      ) : (
        <div className="flex min-h-screen items-center justify-center bg-[#0A0908] text-[#F4F1EA]">
          <p className="font-display text-xl ">Imperial Wood — coming soon.</p>
        </div>
      )}

      <Testimonials />
<FaqChat />
<TrustSignals />
<CtaSection />
      <Footer />
    </div>
  )
}