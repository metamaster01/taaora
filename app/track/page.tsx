import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import TrackClient from '@/components/track/TrackClient'

export const metadata: Metadata = {
  title: 'Track your order | TAAORA',
  description: 'Check the status of your TAAORA order using your mobile number or email.',
}

export default function TrackPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar mode="solid" />
      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <TrackClient />
      </main>
      <Footer />
    </div>
  )
}
