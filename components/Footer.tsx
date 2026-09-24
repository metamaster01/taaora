export default function Footer() {
  return (
    <footer className="border-t border-hair bg-paper py-16 text-center text-ink">
      <p className="font-display text-xl italic">Taaora — Wear Your Presence.</p>
      <div className="mt-6 flex justify-center gap-6 text-sm text-muted">
        <a href="https://wa.me/917558566189" target="_blank" rel="noopener noreferrer" className="hover:text-ink">
          WhatsApp
        </a>
        <a href="mailto:taaoraperfumes@gmail.com" className="hover:text-ink">
          taaoraperfumes@gmail.com
        </a>
      </div>
    </footer>
  )
}