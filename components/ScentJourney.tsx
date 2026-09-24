'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Product } from '@/types/product'

type NoteCard = {
  key: 'top' | 'heart' | 'base'
  eyebrow: string
  title: string
  description: string
  image: string
}

const cards: NoteCard[] = [
  {
    key: 'top',
    eyebrow: 'Opening',
    title: 'Fresh Citrus & Aromatic Spices',
    description:
      'The first impression — a bright citrus burst layered with warm spice, awakening the senses the moment it settles on skin.',
    image: '/notes/note-1.jpg',
  },
  {
    key: 'heart',
    eyebrow: 'Heart',
    title: 'Aromatic Woods & Warm Florals',
    description:
      'As it settles, aromatic woods intertwine with soft florals and gentle spice — the true character of the fragrance begins to unfold.',
    image: '/notes/note-2.jpg',
  },
  {
    key: 'base',
    eyebrow: 'Base',
    title: 'Rich Woods, Amber & Musk',
    description:
      'The lasting impression — deep woods, warm amber and soft musk that linger for hours, the signature that stays with you.',
    image: '/notes/note-3.png',
  },
]

export default function ScentJourney({ product }: { product: Product }) {
  const notesByKey: Record<NoteCard['key'], string[] | null> = {
    top: product.top_notes,
    heart: product.heart_notes,
    base: product.base_notes,
  }

  return (
    <section className="bg-paper py-4 text-ink">
      <div className="mx-auto max-w-6xl px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="font-display text-3xl italic"
        >
          Three notes, one presence.
        </motion.p>

        <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
          {cards.map((card, i) => {
            const notes = notesByKey[card.key]
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE]">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out hover:scale-105"
                  />
                </div>
                <p className="mt-5 text-xs uppercase tracking-[0.15em] text-bronze">{card.eyebrow}</p>
                <p className="mt-2 font-display text-xl italic">{card.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{card.description}</p>
                {notes && notes.length > 0 && (
                  <p className="mt-3 text-xs text-muted">{notes.join(', ')}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}