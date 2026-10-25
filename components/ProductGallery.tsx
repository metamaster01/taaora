// 'use client'

// import { useState } from 'react'
// import type { ProductMedia } from '@/types/product'

// export default function ProductGallery({ media, productName }: { media: ProductMedia[]; productName: string }) {
//   const items = media.length > 0 ? media : [{ url: '', alt: productName, type: 'image' as const }]
//   const [active, setActive] = useState(0)
//   const [loaded, setLoaded] = useState(false)

//   const current = items[active]

//   return (
//     <div>
//       <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE]">
//         {current.url ? (
//           current.type === 'video' ? (
//             <video
//               src={current.url}
//               controls
//               className="h-full w-full object-cover"
//               onLoadedData={() => setLoaded(true)}
//             />
//           ) : (
//             // eslint-disable-next-line @next/next/no-img-element
//             <img
//               src={current.url}
//               alt={current.alt}
//               onLoad={() => setLoaded(true)}
//               className={`h-full w-full object-cover transition-all duration-700 ease-out ${
//                 loaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md'
//               }`}
              
//             />
//           )
//         ) : (
//           <div className="flex h-full w-full items-center justify-center">
//             <span className="font-display text-sm italic text-muted">Product photography pending</span>
//           </div>
//         )}
//       </div>

//       {items.length > 1 && (
//         <div className="mt-4 flex gap-3">
//           {items.map((item, i) => (
//             <button
//               key={i}
//               onClick={() => {
//                 setLoaded(false)
//                 setActive(i)
//               }}
//               aria-label={`View ${item.alt}`}
//               className={`h-16 w-16 shrink-0 overflow-hidden bg-[#F5F3EE] transition-opacity ${
//                 i === active ? 'opacity-100 ring-1 ring-ink' : 'opacity-60 hover:opacity-100'
//               }`}
//             >
//               {item.url ? (
//                 // eslint-disable-next-line @next/next/no-img-element
//                 <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
//               ) : null}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }




'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProductMedia } from '@/types/product'

export default function ProductGallery({ media, productName }: { media: ProductMedia[]; productName: string }) {
  const items = media.length > 0 ? media : [{ url: '', alt: productName, type: 'image' as const }]
  const [active, setActive] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const current = items[active]

  // THE FIX: the server-rendered <img> starts downloading BEFORE React hydrates.
  // If it finishes first, its "load" event fires with nobody listening, so
  // `loaded` never becomes true and the image stays at opacity-0 (blank box).
  // After hydration (and after every image change) check whether the browser
  // already has the image, and reveal it if so.
  useEffect(() => {
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true)
  }, [active, current.url])

  function select(i: number) {
    if (i === active) return
    setLoaded(false)
    setActive(i)
  }

  return (
    <div>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE]">
        {current.url ? (
          current.type === 'video' ? (
            <video src={current.url} controls playsInline className="h-full w-full object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              // key = brand-new element per image, so no stale "complete" state carries over
              key={current.url}
              ref={imgRef}
              src={current.url}
              alt={current.alt}
              // the first image is the page's main visual — fetch it first
              loading={active === 0 ? 'eager' : undefined}
              fetchPriority={active === 0 ? 'high' : undefined}
              decoding="async"
              onLoad={() => setLoaded(true)}
              // never leave a failed image invisible — show the (broken) state instead of a blank box
              onError={() => setLoaded(true)}
              className={`h-full w-full object-cover transition-all duration-700 ease-out ${
                loaded ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md'
              }`}
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-sm italic text-muted">Product photography pending</span>
          </div>
        )}
      </div>

      {items.length > 1 && (
        <div className="mt-4 flex gap-3">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => select(i)}
              aria-label={`View ${item.alt}`}
              className={`h-16 w-16 shrink-0 overflow-hidden bg-[#F5F3EE] transition-opacity ${
                i === active ? 'opacity-100 ring-1 ring-ink' : 'opacity-60 hover:opacity-100'
              }`}
            >
              {item.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.url} alt={item.alt} className="h-full w-full object-cover" />
              ) : null}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}