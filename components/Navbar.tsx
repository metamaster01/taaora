// 'use client'

// import Link from 'next/link'
// import { useEffect, useState } from 'react'

// export default function Navbar({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
//   const [scrolled, setScrolled] = useState(false)

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8)
//     onScroll()
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   const isDark = theme === 'dark'

//   return (
//     <header
//       className={`sticky top-0 z-50 transition-colors duration-300 ${
//         isDark ? 'bg-[#0A0908]/95 text-[#F4F1EA]' : 'bg-paper/95 text-ink'
//       } ${scrolled ? (isDark ? 'border-b border-white/10' : 'border-b border-hair') : 'border-b border-transparent'} backdrop-blur-sm`}
//     >
//       <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
//         <Link href="/" className="font-display text-xl tracking-tight">
//           Taaora
//         </Link>
//         <div className="flex items-center gap-8 text-sm">
//           <Link href="/products/imperial-wood" className="hover:opacity-70 transition-opacity">
//             Shop
//           </Link>
//           <a
//             href="https://wa.me/917558566189"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:opacity-70 transition-opacity"
//           >
//             Contact
//           </a>
//         </div>
//       </nav>
//     </header>
//   )
// }




// 'use client'

// import Link from 'next/link'
// import Image from 'next/image'
// import { usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'

// const links = [
//   { href: '/products/imperial-wood', label: 'Shop' },
//   { href: '/#story', label: 'Story' },
// ]

// export default function Navbar({ mode = 'solid' }: { mode?: 'solid' | 'auto' }) {
//   const [scrolled, setScrolled] = useState(false)
//   const [menuOpen, setMenuOpen] = useState(false)
//   const pathname = usePathname()

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 60)
//     onScroll()
//     window.addEventListener('scroll', onScroll, { passive: true })
//     return () => window.removeEventListener('scroll', onScroll)
//   }, [])

//   useEffect(() => {
//     setMenuOpen(false)
//   }, [pathname])

//   // "auto" mode is transparent over a dark hero until the person scrolls past it,
//   // then becomes the same solid white bar every other page uses. "solid" mode
//   // (used on white-background pages) never goes transparent.
//   const transparent = mode === 'auto' && !scrolled
//   const textColor = transparent ? 'text-[#F4F1EA]' : 'text-ink'
//   const bar = transparent
//     ? 'bg-transparent border-b border-transparent'
//     : 'bg-paper/95 backdrop-blur-sm border-b border-hair'

//   return (
//     <header className={`sticky top-0 z-50 transition-colors duration-300 ${bar} ${textColor}`}>
//       <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
//         <Link href="/" className="flex items-center gap-3">
//           <Image
//             src="/logo-removebg.png"
//             alt="Taaora"
//             width={44}
//             height={44}
//             className="h-10 w-10 object-contain"
//           />
//           <span className="font-display text-2xl tracking-tight">Taaora</span>
//         </Link>

//         <div className="hidden items-center gap-9 text-sm sm:flex">
//           {links.map((l) => (
//             <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
//               {l.label}
//             </Link>
//           ))}
//           <a
//             href="https://wa.me/917558566189"
//             target="_blank"
//             rel="noopener noreferrer"
//             className="hover:opacity-70 transition-opacity"
//           >
//             Contact
//           </a>
//         </div>

//         <button
//           onClick={() => setMenuOpen((o) => !o)}
//           aria-label="Toggle menu"
//           aria-expanded={menuOpen}
//           className="flex flex-col gap-1.5 sm:hidden"
//         >
//           <span
//             className={`h-px w-6 transition-transform ${transparent ? 'bg-[#F4F1EA]' : 'bg-ink'} ${
//               menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
//             }`}
//           />
//           <span
//             className={`h-px w-6 transition-transform ${transparent ? 'bg-[#F4F1EA]' : 'bg-ink'} ${
//               menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
//             }`}
//           />
//         </button>
//       </nav>

//       {menuOpen && (
//         <div className="border-t border-hair bg-paper px-6 py-6 text-ink sm:hidden">
//           <div className="flex flex-col gap-5 text-base">
//             {links.map((l) => (
//               <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
//                 {l.label}
//               </Link>
//             ))}
//             <a href="https://wa.me/917558566189" target="_blank" rel="noopener noreferrer">
//               Contact
//             </a>
//           </div>
//         </div>
//       )}
//     </header>
//   )
// }





'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const leftLinks = [
  // { href: '/products/imperial-wood', label: 'Shop' },
  { href: '/', label: 'Home' },
  { href: '/#story', label: 'About' },
]

const rightLinks = [
  { href: '/products/imperial-wood', label: 'Shop' },
  { href: 'https://wa.me/917558566189', label: 'Contact', external: true },
]

const navLinkClass =
  'relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'

export default function Navbar({ mode = 'solid' }: { mode?: 'solid' | 'auto' }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const transparent = mode === 'auto' && !scrolled
  const textColor = transparent ? 'text-[#F4F1EA]' : 'text-ink'
  const bar = transparent
    ? 'bg-transparent border-b border-transparent'
    : 'bg-paper/95 backdrop-blur-sm border-b border-hair'

  // "auto" mode (the homepage) needs to be fixed, not sticky — sticky still
  // reserves its own height in normal flow before the first scroll, which
  // pushes the hero video down instead of letting it fill the full viewport
  // with the nav floating transparently on top of it.
  const position = mode === 'auto' ? 'fixed' : 'sticky'

  return (
    <header className={`${position} top-0 inset-x-0 z-50 transition-colors duration-300 ${bar} ${textColor}`}>
      <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-2 sm:py-2 md:py-8">
        <div className="hidden items-center gap-9 text-base sm:flex">
          {leftLinks.map((l) => (
            <Link key={l.href} href={l.href} className={navLinkClass}>
              {l.label}
            </Link>
          ))}
        </div>

        <Link
          href="/"
          className="transition-transform duration-300 hover:scale-105 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
        >
          <Image
            src="/logo-removebg.png"
            alt="Taaora"
            width={64}
            height={64}
            className="h-18 w-24 object-contain sm:h-18 sm:w-24 md:h-24 md:w-28"
            priority
          />
        </Link>

        <div className="hidden items-center gap-9 text-base sm:flex">
          {rightLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener noreferrer' : undefined}
              className={navLinkClass}
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="flex flex-col gap-1.5 sm:hidden"
        >
          <span
            className={`h-px w-6 transition-transform ${transparent ? 'bg-[#F4F1EA]' : 'bg-ink'} ${
              menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
            }`}
          />
          <span
            className={`h-px w-6 transition-transform ${transparent ? 'bg-[#F4F1EA]' : 'bg-ink'} ${
              menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-hair bg-paper px-6 py-6 text-ink sm:hidden">
          <div className="flex flex-col gap-5 text-base">
            {leftLinks.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                {l.label}
              </Link>
            ))}
            {rightLinks.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}