'use client'

import { useEffect } from 'react'
import { trackViewContent } from '@/lib/meta-pixel'

// Drop into a product page (works inside server components): <TrackViewContent id=".." name=".." price={..} />
export default function TrackViewContent({ id, name, price }: { id: string; name: string; price?: number }) {
  useEffect(() => {
    trackViewContent({ id, name, price })
  }, [id, name, price])
  return null
}
