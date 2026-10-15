import type { Metadata } from 'next'
import { Fraunces, Inter, Bodoni_Moda } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import MetaPixel from '@/components/MetaPixel'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
})


const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-bodoni',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'TAAORA - Wear Your Presence',
  description: 'TAAORA is a niche perfume brand that creates unique and captivating fragrances. Our perfumes are designed to evoke emotions, memories, and experiences, allowing you to express your individuality and leave a lasting impression.',
  keywords: ['TAAORA', 'niche perfume', 'luxury fragrance', 'artisan perfume', 'fine fragrance'],
  applicationName: 'TAAORA',
  openGraph: {
    title: 'TAAORA - Wear Your Presence',
    description: 'Discover unique, captivating fragrances from TAAORA, created to evoke emotion and express your individuality.',
    siteName: 'TAAORA',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TAAORA - Wear Your Presence',
    description: 'Discover unique, captivating fragrances from TAAORA, created to evoke emotion and express your individuality.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '9t2jYBj3gaxsYsEvp1Qa34PsK3MQGeoaoFI21v20aoE',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${bodoni.variable}`}>
      
      <body className="font-sans text-ink antialiased">
        {children}
        <Analytics />

       
          <MetaPixel />
      
      </body>
    </html>
  )
}