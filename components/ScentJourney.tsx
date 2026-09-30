// 'use client'

// import Image from 'next/image'
// import { motion } from 'framer-motion'
// import type { Product } from '@/types/product'

// type NoteCard = {
//   key: 'top' | 'heart' | 'base'
//   eyebrow: string
//   title: string
//   description: string
//   image: string
// }

// const cards: NoteCard[] = [
//   {
//     key: 'top',
//     eyebrow: 'Opening',
//     title: 'Fresh Citrus & Aromatic Spices',
//     description:
//       'The first impression — a bright citrus burst layered with warm spice, awakening the senses the moment it settles on skin.',
//     image: '/notes/note-1.jpg',
//   },
//   {
//     key: 'heart',
//     eyebrow: 'Heart',
//     title: 'Aromatic Woods & Warm Florals',
//     description:
//       'As it settles, aromatic woods intertwine with soft florals and gentle spice — the true character of the fragrance begins to unfold.',
//     image: '/notes/note-2.jpg',
//   },
//   {
//     key: 'base',
//     eyebrow: 'Base',
//     title: 'Rich Woods, Amber & Musk',
//     description:
//       'The lasting impression — deep woods, warm amber and soft musk that linger for hours, the signature that stays with you.',
//     image: '/notes/note-3.png',
//   },
// ]

// export default function ScentJourney({ product }: { product: Product }) {
//   const notesByKey: Record<NoteCard['key'], string[] | null> = {
//     top: product.top_notes,
//     heart: product.heart_notes,
//     base: product.base_notes,
//   }

//   return (
//     <section className="bg-paper py-4 text-ink">
//       <div className="mx-auto max-w-6xl px-6">
//         <motion.p
//           initial={{ opacity: 0, y: 12 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ duration: 0.7 }}
//           className="font-display text-3xl"
//         >
//           Three notes, one presence.
//         </motion.p>

//         <div className="mt-14 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8">
//           {cards.map((card, i) => {
//             const notes = notesByKey[card.key]
//             return (
//               <motion.div
//                 key={card.key}
//                 initial={{ opacity: 0, y: 28 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true, margin: '-80px' }}
//                 transition={{ duration: 0.7, delay: i * 0.15 }}
//               >
//                 <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F5F3EE]">
//                   <Image
//                     src={card.image}
//                     alt={card.title}
//                     fill
//                     sizes="(min-width: 640px) 33vw, 100vw"
//                     className="object-cover transition-transform duration-700 ease-out hover:scale-105"
//                   />
//                 </div>
//                 <p className="mt-5 text-xs uppercase tracking-[0.15em] text-bronze">{card.eyebrow}</p>
//                 <p className="mt-2 font-display text-xl ">{card.title}</p>
//                 <p className="mt-3 text-sm leading-relaxed text-muted">{card.description}</p>
//                 {notes && notes.length > 0 && (
//                   <p className="mt-3 text-xs text-muted">{notes.join(', ')}</p>
//                 )}
//               </motion.div>
//             )
//           })}
//         </div>
//       </div>
//     </section>
//   )
// }

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Product } from "@/types/product";

type NoteCard = {
  key: "top" | "heart" | "base";
  eyebrow: string;
  title: string;
  description: string;
  image: string;
};

const cards: NoteCard[] = [
  {
    key: "top",
    eyebrow: "Opening",
    title: "Fresh Citrus & Aromatic Spices",
    description:
      "The first impression — a bright citrus burst layered with warm spice, awakening the senses the moment it settles on skin.",
    image: "/notes/note-1.jpg",
  },
  {
    key: "heart",
    eyebrow: "Heart",
    title: "Aromatic Woods & Warm Florals",
    description:
      "As it settles, aromatic woods intertwine with soft florals and gentle spice — the true character of the fragrance begins to unfold.",
    image: "/notes/note-2.jpg",
  },
  {
    key: "base",
    eyebrow: "Base",
    title: "Rich Woods, Amber & Musk",
    description:
      "The lasting impression — deep woods, warm amber and soft musk that linger for hours, the signature that stays with you.",
    image: "/notes/note-3.png",
  },
];

// Shared text reveal: a soft fade + small rise. Images are NOT animated.
const reveal = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-40px" },
};

export default function ScentJourney({ product }: { product: Product }) {
  const notesByKey: Record<NoteCard["key"], string[] | null> = {
    top: product.top_notes,
    heart: product.heart_notes,
    base: product.base_notes,
  };

  return (
    <section className="bg-paper py-8 text-ink sm:py-4">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <motion.p
          {...reveal}
          transition={{ duration: 0.6 }}
          className="font-display text-[1.75rem] leading-tight sm:text-3xl"
        >
          Three notes, one presence.
        </motion.p>

        <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-14 sm:grid-cols-3 sm:gap-8">
          {cards.map((card, i) => {
            const notes = notesByKey[card.key];
            return (
              <article key={card.key} className="flex flex-col">
                {/* Image: static, visible immediately, no reveal animation */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F3EE] sm:aspect-[4/5]">
                  {/* <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:hover:scale-105"
                  /> */}
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    quality={75}
                    loading="eager"
                    className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)]:hover:scale-105"
                  />
                </div>

                {/* Text: this is what animates */}
                <motion.div
                  {...reveal}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <div className="mt-4 flex items-center gap-3 sm:mt-5">
                    <span className="text-xs tracking-[0.15em] text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-6 bg-bronze/60" />
                    <span className="text-xs uppercase tracking-[0.15em] text-bronze">
                      {card.eyebrow}
                    </span>
                  </div>

                  <p className="mt-2.5 font-display text-[1.375rem] leading-snug sm:text-xl">
                    {card.title}
                  </p>

                  <p className="mt-2.5 text-[15px] leading-relaxed text-muted sm:mt-3 sm:text-sm">
                    {card.description}
                  </p>

                  {notes && notes.length > 0 && (
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {notes.map((note) => (
                        <li
                          key={note}
                          className="rounded-full border border-hair px-3 py-1 text-xs text-muted"
                        >
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
