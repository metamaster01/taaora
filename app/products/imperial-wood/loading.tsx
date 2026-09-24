export default function Loading() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b border-hair px-6 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="h-6 w-24 animate-pulse bg-[#F0EDE6]" />
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="aspect-[4/5] w-full animate-pulse bg-[#F5F3EE]" />
          <div className="flex flex-col gap-6">
            <div className="h-10 w-2/3 animate-pulse bg-[#F0EDE6]" />
            <div className="h-4 w-1/2 animate-pulse bg-[#F0EDE6]" />
            <div className="h-8 w-32 animate-pulse bg-[#F0EDE6]" />
            <div className="h-32 w-full animate-pulse bg-[#F0EDE6]" />
            <div className="h-12 w-full animate-pulse bg-[#F0EDE6]" />
          </div>
        </div>
      </main>
    </div>
  )
}