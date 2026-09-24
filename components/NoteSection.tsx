import type { Product } from '@/types/product'

function NoteColumn({ label, notes }: { label: string; notes: string[] | null }) {
  if (!notes || notes.length === 0) return null
  return (
    <div>
      <p className="font-display text-lg italic text-ink">{label}</p>
      <ul className="mt-3 space-y-1.5 text-sm text-muted">
        {notes.map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
    </div>
  )
}

export default function NotesSection({ product }: { product: Product }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="font-display text-2xl text-ink">Fragrance notes</p>
      <div className="mt-10 grid grid-cols-1 gap-10 divide-y divide-hair sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        <div className="sm:pr-10">
          <NoteColumn label="Top" notes={product.top_notes} />
        </div>
        <div className="pt-10 sm:pl-10 sm:pt-0">
          <NoteColumn label="Heart" notes={product.heart_notes} />
        </div>
        <div className="pt-10 sm:pl-10 sm:pt-0">
          <NoteColumn label="Base" notes={product.base_notes} />
        </div>
      </div>
      {product.overall_impression && (
        <p className="mt-16 max-w-2xl text-lg leading-relaxed text-ink">{product.overall_impression}</p>
      )}
    </section>
  )
}