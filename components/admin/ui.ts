// Shared admin look — same palette/typography as the login page:
// warm paper (#FAF9F6), ink, bronze accent, Bodoni headings, tracked-caps labels.

export const eyebrow = 'text-[11px] font-medium uppercase tracking-[0.22em] text-muted'

export const inputCls =
  'h-11 w-full border border-hair bg-paper px-3 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-ink focus:ring-1 focus:ring-ink'

export const textareaCls =
  'w-full border border-hair bg-paper px-3 py-2.5 text-sm outline-none transition-colors placeholder:text-muted/50 focus:border-ink focus:ring-1 focus:ring-ink'

const btnBase =
  'inline-flex h-11 items-center justify-center gap-2 px-5 text-[12px] font-medium uppercase tracking-[0.16em] transition-colors disabled:cursor-not-allowed disabled:opacity-50'

export const btnPrimary = `${btnBase} bg-ink text-paper hover:bg-bronze disabled:hover:bg-ink`
export const btnGhost = `${btnBase} border border-hair bg-white text-ink hover:border-ink`
export const btnDanger = `${btnBase} bg-red-700 text-white hover:bg-red-800`

export const card = 'relative border border-hair bg-white'
export const cardAccent = 'pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-bronze'
