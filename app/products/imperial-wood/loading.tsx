// export default function Loading() {
//   return (
//     <div className="min-h-screen bg-paper">
//       <div className="border-b border-hair px-6 py-4">
//         <div className="mx-auto max-w-6xl">
//           <div className="h-6 w-24 animate-pulse bg-[#F0EDE6]" />
//         </div>
//       </div>

//       <main className="mx-auto max-w-6xl px-6 py-12">
//         <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
//           <div className="aspect-[4/5] w-full animate-pulse bg-[#F5F3EE]" />
//           <div className="flex flex-col gap-6">
//             <div className="h-10 w-2/3 animate-pulse bg-[#F0EDE6]" />
//             <div className="h-4 w-1/2 animate-pulse bg-[#F0EDE6]" />
//             <div className="h-8 w-32 animate-pulse bg-[#F0EDE6]" />
//             <div className="h-32 w-full animate-pulse bg-[#F0EDE6]" />
//             <div className="h-12 w-full animate-pulse bg-[#F0EDE6]" />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }






import Image from 'next/image'

// Skeleton for /products/imperial-wood. Every block mirrors the real component
// it stands in for (Navbar, ProductGallery, BuyBox) down to the height, so when
// the real page swaps in nothing jumps or reflows.

const SHIMMER_KEYFRAMES = '@keyframes taaora-shimmer{100%{transform:translateX(100%)}}'

function Sk({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden bg-[#F2EFE8] before:absolute before:inset-0 before:-translate-x-full before:animate-[taaora-shimmer_1.6s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent motion-reduce:before:animate-none ${className}`}
    />
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-paper text-ink" aria-busy="true">
      <style>{SHIMMER_KEYFRAMES}</style>
      <span className="sr-only">Loading product…</span>

      {/* ---------- navbar (same structure, sizes and logo as <Navbar />) ---------- */}
      <header className="border-b border-hair bg-paper/95">
        <nav className="mx-auto grid max-w-6xl grid-cols-3 items-center px-3 py-1.5 sm:flex sm:justify-between sm:px-6 sm:py-2 md:py-3">
          {/* left */}
          <div className="flex items-center justify-self-start">
            <div className="flex items-center gap-2 sm:hidden">
              <Sk className="h-6 w-6 rounded-full" />
              <Sk className="h-6 w-6 rounded-full" />
            </div>
            <div className="hidden items-center gap-10 sm:flex">
              <Sk className="h-3 w-12" />
              <Sk className="h-3 w-14" />
              <Sk className="h-3 w-12" />
            </div>
          </div>

          {/* logo — the real one, so it doesn't pop in later */}
          <div className="justify-self-center sm:absolute sm:left-1/2 sm:-translate-x-1/2">
            <Image
              src="/logo-3.png"
              alt="Taaora"
              width={112}
              height={96}
              priority
              className="h-14 w-20 object-contain sm:h-16 sm:w-24 md:h-[72px] md:w-28"
            />
          </div>

          {/* right */}
          <div className="flex items-center justify-self-end">
            <div className="flex items-center gap-2 sm:hidden">
              <Sk className="h-6 w-6 rounded-full" />
              <Sk className="h-6 w-6 rounded-full" />
            </div>
            <div className="hidden items-center gap-8 sm:flex">
              <Sk className="h-3 w-20" />
              <Sk className="h-9 w-9 rounded-full" />
            </div>
          </div>
        </nav>
      </header>

      {/* ---------- main: gallery + buy box ---------- */}
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* gallery */}
          <div>
            <Sk className="aspect-[4/5] w-full" />
            <div className="mt-4 flex gap-3">
              {[0, 1, 2, 3].map((i) => (
                <Sk key={i} className="h-16 w-16 shrink-0" />
              ))}
            </div>
          </div>

          {/* buy box */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-6">
              {/* title + tagline */}
              <div>
                <Sk className="h-11 w-3/4" />
                <Sk className="mt-2 h-5 w-1/2" />
              </div>

              {/* price row */}
              <div className="flex items-baseline gap-3">
                <Sk className="h-8 w-28" />
                <Sk className="h-5 w-16" />
                <Sk className="h-7 w-16" />
              </div>

              {/* offer box */}
              <div className="border border-hair p-3">
                <Sk className="my-0.5 h-4 w-2/3" />
                <Sk className="mb-0.5 mt-1 h-4 w-1/2" />
              </div>

              {/* details + scent lines */}
              <Sk className="my-0.5 h-4 w-2/3" />
              <Sk className="my-0.5 h-4 w-3/5" />

              {/* quantity */}
              <div className="flex items-center gap-4 border-y border-hair py-4">
                <Sk className="h-4 w-16" />
                <div className="flex items-center gap-4">
                  <Sk className="h-8 w-8" />
                  <Sk className="h-4 w-4" />
                  <Sk className="h-8 w-8" />
                </div>
              </div>

              {/* buy button */}
              <div className="h-14 w-full animate-pulse bg-ink/15" />

              {/* description */}
              <div className="space-y-2.5">
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-full" />
                <Sk className="h-3 w-4/5" />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ---------- first story section, so the page has realistic height ---------- */}
      <section className="border-t border-hair">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2">
          <Sk className="aspect-[4/3]" />
          <div className="space-y-4">
            <Sk className="h-7 w-3/4" />
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-2/3" />
          </div>
        </div>
      </section>
    </div>
  )
}