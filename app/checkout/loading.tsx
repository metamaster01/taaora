import Image from 'next/image'

// Shown INSTANTLY while /checkout fetches its data on the server (YouTube-style
// skeleton). It mirrors the real checkout layout so nothing jumps when the
// real page replaces it.
const bar = 'animate-pulse bg-hair/70'

function FieldSkeleton({ wide = false }: { wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <div className={`${bar} h-3 w-24`} />
      <div className={`${bar} mt-2 h-[42px] w-full`} />
    </div>
  )
}

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-paper text-ink" aria-busy="true" aria-label="Loading checkout">
      <header className="border-b border-hair px-6 py-2">
        <div className="mx-auto flex max-w-5xl justify-center">
          <Image
            src="/logo-new.png"
            alt="Taaora"
            width={112}
            height={80}
            priority
            className="h-16 w-24 object-contain sm:w-28"
          />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-4">
        <div className={`${bar} h-7 w-56`} />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* form column */}
          <div className="flex flex-col gap-10">
            <div>
              <div className={`${bar} h-5 w-36`} />
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FieldSkeleton wide />
                <FieldSkeleton wide />
                <FieldSkeleton wide />
                <FieldSkeleton wide />
                <FieldSkeleton wide />
                <FieldSkeleton />
                <FieldSkeleton />
                <FieldSkeleton />
              </div>
            </div>

            <div>
              <div className={`${bar} h-5 w-36`} />
              <div className="mt-4 space-y-3">
                <div className={`${bar} h-16 w-full`} />
                <div className={`${bar} h-16 w-full`} />
              </div>
            </div>

            <div className={`${bar} h-14 w-full`} />
          </div>

          {/* summary column */}
          <div className="flex flex-col gap-8">
            <div className="border border-hair p-5">
              <div className="flex gap-4">
                <div className={`${bar} h-16 w-16 shrink-0`} />
                <div className="flex-1 space-y-2.5">
                  <div className={`${bar} h-4 w-3/4`} />
                  <div className={`${bar} h-3 w-1/2`} />
                  <div className={`${bar} h-3 w-1/3`} />
                </div>
              </div>
              <div className="mt-6 space-y-3 border-t border-hair pt-5">
                <div className="flex justify-between"><div className={`${bar} h-3 w-20`} /><div className={`${bar} h-3 w-14`} /></div>
                <div className="flex justify-between"><div className={`${bar} h-3 w-16`} /><div className={`${bar} h-3 w-14`} /></div>
                <div className="flex justify-between pt-2"><div className={`${bar} h-4 w-16`} /><div className={`${bar} h-4 w-20`} /></div>
              </div>
            </div>

            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`${bar} h-5 w-5 shrink-0 rounded-full`} />
                  <div className={`${bar} h-3 w-2/3`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}