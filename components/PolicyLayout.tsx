import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

type Section = {
  id: string
  heading: string
  content: React.ReactNode
}

export default function PolicyLayout({
  title,
  updated,
  intro,
  sections,
}: {
  title: string
  updated: string
  intro?: React.ReactNode
  sections: Section[]
}) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar mode="solid" />

      <header className="border-b border-hair px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-bronze">Policy</p>
          <h1 className="mt-4 font-display text-4xl italic sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-muted">Last updated: {updated}</p>
          {intro && <p className="mt-6 max-w-2xl leading-relaxed text-muted">{intro}</p>}
        </div>
      </header>

      <main className="px-6 py-16 sm:py-20">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
          <nav className="hidden lg:block" aria-label="Sections">
            <div className="sticky top-28 flex flex-col gap-3 text-sm">
              {sections.map((s) => (
                <a key={s.id} href={`#${s.id}`} className="text-muted transition-colors hover:text-ink">
                  {s.heading}
                </a>
              ))}
            </div>
          </nav>

          <article className="flex max-w-2xl flex-col gap-14">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28">
                <h2 className="font-display text-xl italic text-ink sm:text-2xl">{s.heading}</h2>
                <div className="mt-4 flex flex-col gap-4 text-sm leading-relaxed text-muted sm:text-base">
                  {s.content}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>

      <Footer />
    </div>
  )
}