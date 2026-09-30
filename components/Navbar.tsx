// // 'use client'

// // import Link from 'next/link'
// // import { useEffect, useState } from 'react'

// // export default function Navbar({ theme = 'light' }: { theme?: 'light' | 'dark' }) {
// //   const [scrolled, setScrolled] = useState(false)

// //   useEffect(() => {
// //     const onScroll = () => setScrolled(window.scrollY > 8)
// //     onScroll()
// //     window.addEventListener('scroll', onScroll, { passive: true })
// //     return () => window.removeEventListener('scroll', onScroll)
// //   }, [])

// //   const isDark = theme === 'dark'

// //   return (
// //     <header
// //       className={`sticky top-0 z-50 transition-colors duration-300 ${
// //         isDark ? 'bg-[#0A0908]/95 text-[#F4F1EA]' : 'bg-paper/95 text-ink'
// //       } ${scrolled ? (isDark ? 'border-b border-white/10' : 'border-b border-hair') : 'border-b border-transparent'} backdrop-blur-sm`}
// //     >
// //       <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
// //         <Link href="/" className="font-display text-xl tracking-tight">
// //           Taaora
// //         </Link>
// //         <div className="flex items-center gap-8 text-sm">
// //           <Link href="/products/imperial-wood" className="hover:opacity-70 transition-opacity">
// //             Shop
// //           </Link>
// //           <a
// //             href="https://wa.me/917558566189"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="hover:opacity-70 transition-opacity"
// //           >
// //             Contact
// //           </a>
// //         </div>
// //       </nav>
// //     </header>
// //   )
// // }




// // 'use client'

// // import Link from 'next/link'
// // import Image from 'next/image'
// // import { usePathname } from 'next/navigation'
// // import { useEffect, useState } from 'react'

// // const links = [
// //   { href: '/products/imperial-wood', label: 'Shop' },
// //   { href: '/#story', label: 'Story' },
// // ]

// // export default function Navbar({ mode = 'solid' }: { mode?: 'solid' | 'auto' }) {
// //   const [scrolled, setScrolled] = useState(false)
// //   const [menuOpen, setMenuOpen] = useState(false)
// //   const pathname = usePathname()

// //   useEffect(() => {
// //     const onScroll = () => setScrolled(window.scrollY > 60)
// //     onScroll()
// //     window.addEventListener('scroll', onScroll, { passive: true })
// //     return () => window.removeEventListener('scroll', onScroll)
// //   }, [])

// //   useEffect(() => {
// //     setMenuOpen(false)
// //   }, [pathname])

// //   // "auto" mode is transparent over a dark hero until the person scrolls past it,
// //   // then becomes the same solid white bar every other page uses. "solid" mode
// //   // (used on white-background pages) never goes transparent.
// //   const transparent = mode === 'auto' && !scrolled
// //   const textColor = transparent ? 'text-[#F4F1EA]' : 'text-ink'
// //   const bar = transparent
// //     ? 'bg-transparent border-b border-transparent'
// //     : 'bg-paper/95 backdrop-blur-sm border-b border-hair'

// //   return (
// //     <header className={`sticky top-0 z-50 transition-colors duration-300 ${bar} ${textColor}`}>
// //       <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
// //         <Link href="/" className="flex items-center gap-3">
// //           <Image
// //             src="/logo-removebg.png"
// //             alt="Taaora"
// //             width={44}
// //             height={44}
// //             className="h-10 w-10 object-contain"
// //           />
// //           <span className="font-display text-2xl tracking-tight">Taaora</span>
// //         </Link>

// //         <div className="hidden items-center gap-9 text-sm sm:flex">
// //           {links.map((l) => (
// //             <Link key={l.href} href={l.href} className="hover:opacity-70 transition-opacity">
// //               {l.label}
// //             </Link>
// //           ))}
// //           <a
// //             href="https://wa.me/917558566189"
// //             target="_blank"
// //             rel="noopener noreferrer"
// //             className="hover:opacity-70 transition-opacity"
// //           >
// //             Contact
// //           </a>
// //         </div>

// //         <button
// //           onClick={() => setMenuOpen((o) => !o)}
// //           aria-label="Toggle menu"
// //           aria-expanded={menuOpen}
// //           className="flex flex-col gap-1.5 sm:hidden"
// //         >
// //           <span
// //             className={`h-px w-6 transition-transform ${transparent ? 'bg-[#F4F1EA]' : 'bg-ink'} ${
// //               menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
// //             }`}
// //           />
// //           <span
// //             className={`h-px w-6 transition-transform ${transparent ? 'bg-[#F4F1EA]' : 'bg-ink'} ${
// //               menuOpen ? '-translate-y-[3.5px] -rotate-45' : ''
// //             }`}
// //           />
// //         </button>
// //       </nav>

// //       {menuOpen && (
// //         <div className="border-t border-hair bg-paper px-6 py-6 text-ink sm:hidden">
// //           <div className="flex flex-col gap-5 text-base">
// //             {links.map((l) => (
// //               <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
// //                 {l.label}
// //               </Link>
// //             ))}
// //             <a href="https://wa.me/917558566189" target="_blank" rel="noopener noreferrer">
// //               Contact
// //             </a>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   )
// // }





// 'use client'

// import Link from 'next/link'
// import Image from 'next/image'
// import { usePathname } from 'next/navigation'
// import { useEffect, useState } from 'react'

// const leftLinks = [
//   // { href: '/products/imperial-wood', label: 'Shop' },
//   { href: '/', label: 'Home' },
//   { href: '/#about', label: 'About' },
// ]

// const rightLinks = [
//   { href: '/products/imperial-wood', label: 'Shop' },
//   { href: 'https://wa.me/917558566189', label: 'Contact', external: true },
// ]

// const navLinkClass =
//   'relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'

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

//   const transparent = mode === 'auto' && !scrolled
//   const textColor = transparent ? 'text-[#F4F1EA]' : 'text-ink'
//   const bar = transparent
//     ? 'bg-black/30 border-b border-transparent backdrop-blur-lg'
//     : 'bg-paper/95 backdrop-blur-sm border-b border-hair'

//   // "auto" mode (the homepage) needs to be fixed, not sticky — sticky still
//   // reserves its own height in normal flow before the first scroll, which
//   // pushes the hero video down instead of letting it fill the full viewport
//   // with the nav floating transparently on top of it.
//   const position = mode === 'auto' ? 'fixed' : 'sticky'

//   return (
//     <header className={`${position} top-0 inset-x-0 z-50 transition-colors duration-300 ${bar} ${textColor}`}>
//       <nav className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-2 sm:py-2 md:py-8">
//         <div className="hidden items-center gap-9 text-base sm:flex">
//           {leftLinks.map((l) => (
//             <Link key={l.href} href={l.href} className={navLinkClass}>
//               {l.label}
//             </Link>
//           ))}
//         </div>

//         <Link
//           href="/"
//           className="transition-transform duration-300 hover:scale-105 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
//         >
//           <Image
//             src="/logo-removebg-2.png"
//             alt="Taaora"
//             width={64}
//             height={64}
//             className="h-18 w-24 object-contain sm:h-18 sm:w-24 md:h-24 md:w-28"
//             priority
//           />
//         </Link>

//         <div className="hidden items-center gap-9 text-base sm:flex">
//           {rightLinks.map((l) => (
//             <a
//               key={l.href}
//               href={l.href}
//               target={l.external ? '_blank' : undefined}
//               rel={l.external ? 'noopener noreferrer' : undefined}
//               className={navLinkClass}
//             >
//               {l.label}
//             </a>
//           ))}
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
//             {leftLinks.map((l) => (
//               <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
//                 {l.label}
//               </Link>
//             ))}
//             {rightLinks.map((l) => (
//               <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
//                 {l.label}
//               </a>
//             ))}
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
import { Menu, X, ShoppingBag } from 'lucide-react'

const WHATSAPP_URL = 'https://wa.me/917558566189'

const leftLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
]

const rightLinks = [
  { href: '/products/imperial-wood', label: 'Shop' },
  { href: WHATSAPP_URL, label: 'Contact', external: true },
]

const navLinkClass =
  'relative inline-block after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full'

// lucide has no brand icons, so here's the WhatsApp glyph as an inline SVG
function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zM12.05 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.2-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.21 4.24-9.45 9.46-9.45 2.52 0 4.9.99 6.68 2.77a9.4 9.4 0 0 1 2.76 6.69c0 5.21-4.25 9.45-9.42 9.45zM20.52 3.45A11.4 11.4 0 0 0 12.05 0C5.73 0 .59 5.14.59 11.46c0 2.02.53 3.99 1.53 5.73L.5 23.5l6.47-1.7a11.44 11.44 0 0 0 5.08 1.2h.01c6.32 0 11.46-5.14 11.46-11.46 0-3.06-1.19-5.94-3.35-8.09z" />
    </svg>
  )
}

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

  // close the menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // lock page scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // stay solid whenever the mobile menu is open so links are always readable
  const transparent = mode === 'auto' && !scrolled && !menuOpen
  const textColor = transparent ? 'text-[#F4F1EA]' : 'text-ink'
  const bar = transparent
    ? 'bg-black/30 border-b border-transparent backdrop-blur-lg'
    : 'bg-paper/95 backdrop-blur-sm border-b border-hair'

  // fixed on the homepage so the hero video fills the viewport under the nav
  const position = mode === 'auto' ? 'fixed' : 'sticky'

  const iconBtn =
    'flex h-10 w-10 items-center justify-center rounded-full transition-opacity active:scale-95 hover:opacity-70'

  return (
    <header className={`${position} top-0 inset-x-0 z-50 transition-colors duration-300 ${bar} ${textColor}`}>
      <nav className="relative mx-auto grid max-w-6xl grid-cols-3 items-center px-3 py-1.5 sm:flex sm:justify-between sm:px-6 sm:py-2 md:py-8">
        {/* LEFT: menu icon (mobile) / links (desktop) */}
        <div className="flex items-center justify-self-start">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className={`${iconBtn} sm:hidden`}
          >
            {menuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          <div className="hidden items-center gap-9 text-base sm:flex">
            {leftLinks.map((l) => (
              <Link key={l.href} href={l.href} className={navLinkClass}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* CENTER: logo */}
        <Link
          href="/"
          aria-label="Taaora home"
          className="justify-self-center transition-transform duration-300 hover:scale-105 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
        >
          <Image
            src="/logo-3.png"
            alt="Taaora"
            width={112}
            height={96}
            className="h-14 w-20 object-contain sm:h-20 sm:w-26 md:h-24 md:w-28"
            priority
          />
        </Link>

        {/* RIGHT: shop + whatsapp icons (mobile) / links (desktop) */}
        <div className="flex items-center justify-self-end">
          <div className="flex items-center sm:hidden">
            <Link href="/products/imperial-wood" aria-label="Shop" className={iconBtn}>
              <ShoppingBag size={22} strokeWidth={1.5} />
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className={iconBtn}
            >
              <WhatsAppIcon className="h-[22px] w-[22px]" />
            </a>
          </div>

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
        </div>
      </nav>

      {/* MOBILE MENU: smooth slide-down */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out sm:hidden ${
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-hair bg-paper px-6 py-8 text-ink">
            <div className="flex flex-col gap-6 text-lg tracking-wide">
              {[...leftLinks, ...rightLinks].map((l) =>
                'external' in l && l.external ? (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </a>
                ) : (
                  <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
                    {l.label}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}