// 'use client'

// import { useLayoutEffect, useRef } from 'react'
// import gsap from 'gsap'
// import { ScrollTrigger } from 'gsap/ScrollTrigger'
// import Lenis from 'lenis'

// // useLayoutEffect warns during SSR; this resolves to a no-op on the server
// // and the real thing in the browser, avoiding the console warning.
// const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {}

// type Faq = {
//   id: string
//   question: string
//   answer: string[]
// }

// const faqs: Faq[] = [
//   {
//     id: 'longevity',
//     question: 'Is Imperial Wood really long-lasting?',
//     answer: [
//       "Yes — it's a 30% concentration Eau de Parfum, well above typical EDT strength.",
//       'Expect several hours of wear from a single application, longer on skin that holds scent well.',
//       'A couple of sprays at your pulse points is all it takes.',
//     ],
//   },
//   {
//     id: 'unisex',
//     question: 'Is it really unisex?',
//     answer: [
//       "Imperial Wood is built around wood, amber and spice — notes that don't lean masculine or feminine.",
//       'It\'s worn the same way by everyone who wears it: as their own signature, not a "his" or "hers" scent.',
//     ],
//   },
//   /* Commented out to keep the section to 4 questions — uncomment to restore.
//   {
//     id: 'delivery',
//     question: 'How long does delivery take?',
//     answer: [
//       'Orders across India typically arrive within a few business days.',
//       "You'll get tracking details on WhatsApp and email as soon as it ships.",
//       'Metro cities are usually quicker.',
//     ],
//   },
//   */
//   {
//     id: 'returns',
//     question: 'Can I return or exchange it?',
//     answer: [
//       "Since it's a fragrance, we can't accept returns once the seal is opened, for hygiene reasons.",
//       "If your bottle arrives damaged, reach out within 48 hours and we'll sort it immediately.",
//       'See our Refund Policy for full details.',
//     ],
//   },
//   {
//     id: 'payment',
//     question: 'Do you offer Cash on Delivery?',
//     answer: [
//       'Right now checkout is prepaid only, through Razorpay — cards, UPI, netbanking, and wallets.',
//       'It lets us keep pricing simple and dispatch orders faster.',
//     ],
//   },
//   /* Commented out to keep the section to 4 questions — uncomment to restore.
//   {
//     id: 'contact',
//     question: 'How do I reach you with a question?',
//     answer: [
//       'WhatsApp is fastest — message us directly and we typically reply within a few hours.',
//       'You can also email taaoraperfumes@gmail.com any time.',
//       "We're a small team, but we read everything ourselves.",
//     ],
//   },
//   */
// ]

// export default function FaqChat() {
//   const containerRef = useRef<HTMLDivElement>(null)

//   useIsoLayoutEffect(() => {
//     const container = containerRef.current
//     if (!container) return

//     gsap.registerPlugin(ScrollTrigger)

//     const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

//     const messages = Array.from(container.querySelectorAll<HTMLDivElement>('.faq-message'))

//     // Reduced motion: skip the whole collapse/expand dance and just show
//     // everything in its final, readable state.
//     if (prefersReducedMotion) {
//       messages.forEach((message) => {
//         const typingIndicator = message.querySelector<HTMLElement>('.typing-indicator')
//         const paragraphs = message.querySelectorAll<HTMLElement>('.faq-content p')
//         if (typingIndicator) typingIndicator.style.display = 'none'
//         paragraphs.forEach((p) => {
//           p.style.opacity = '1'
//         })
//       })
//       return
//     }

//     const lenis = new Lenis()
//     lenis.on('scroll', ScrollTrigger.update)
//     gsap.ticker.add((time) => lenis.raf(time * 1000))
//     gsap.ticker.lagSmoothing(0)

//     // Bubble widths are measured from rendered text — if the display font
//     // (Bodoni Moda) finishes loading after that measurement, the true width
//     // can shift slightly. Refreshing once fonts are ready keeps triggers accurate.
//     if ('fonts' in document) {
//       document.fonts.ready.then(() => ScrollTrigger.refresh())
//     }

//     const triggers: ScrollTrigger[] = []
//     const timelines: gsap.core.Timeline[] = []

//     messages.forEach((message) => {
//       const faqRow = message.parentElement
//       const typingIndicator = message.querySelector<HTMLElement>('.typing-indicator')
//       const messageCopy = message.querySelectorAll<HTMLElement>('.faq-content p')
//       if (!faqRow || !typingIndicator) return

//       // Measure the bubble's natural, fully-expanded size before collapsing it,
//       // so the expand animation has an exact target to animate toward.
//       const expandedWidth = message.offsetWidth
//       message.style.width = `${expandedWidth}px`
//       const expandedHeight = message.offsetHeight
//       faqRow.style.minHeight = `${expandedHeight}px`

//       gsap.set(message, {
//         width: 64,
//         height: 64,
//         borderRadius: '50%',
//         padding: 0,
//         scale: 0,
//       })

//       let collapseWhenDone = false

//       const enterTimeline = gsap.timeline({ paused: true })
//       enterTimeline.to(message, {
//         scale: 1,
//         duration: 0.4,
//         ease: 'power2.inOut',
//       })

//       const expandTimeline = gsap.timeline({
//         paused: true,
//         onReverseComplete: () => {
//           if (collapseWhenDone) {
//             collapseWhenDone = false
//             enterTimeline.reverse()
//           }
//         },
//       })

//       expandTimeline
//         .to(typingIndicator, { autoAlpha: 0, duration: 0.2 })
//         .to(message, {
//           width: expandedWidth,
//           borderRadius: '2rem',
//           paddingLeft: '2rem',
//           paddingRight: '2rem',
//           duration: 0.4,
//           ease: 'power3.inOut',
//         })
//         .to(
//           message,
//           {
//             height: expandedHeight,
//             paddingTop: '1.5rem',
//             paddingBottom: '1.5rem',
//             duration: 0.4,
//             ease: 'power3.inOut',
//           },
//           '-=0.2',
//         )
//         .to(messageCopy, { opacity: 1, duration: 0.3, stagger: 0.05 }, '-=0.25')

//       timelines.push(enterTimeline, expandTimeline)

//       triggers.push(
//         ScrollTrigger.create({
//           trigger: message,
//           start: 'top 88%',
//           onEnter: () => {
//             collapseWhenDone = false
//             enterTimeline.play()
//           },
//           onLeaveBack: () => {
//             if (expandTimeline.progress() > 0) {
//               collapseWhenDone = true
//             } else {
//               enterTimeline.reverse()
//             }
//           },
//         }),
//       )

//       triggers.push(
//         ScrollTrigger.create({
//           trigger: message,
//           start: 'top 55%',
//           onEnter: () => expandTimeline.play(),
//           onLeaveBack: () => expandTimeline.reverse(),
//         }),
//       )
//     })

//     return () => {
//       triggers.forEach((t) => t.kill())
//       timelines.forEach((t) => t.kill())
//       // Critical: undo every inline style this effect wrote (both the plain
//       // JS assignments and the gsap.set ones). Without this, a remount —
//       // whether from React Strict Mode's dev double-invoke or a real
//       // client-side navigation back to this page — would measure the
//       // already-collapsed 64px circle instead of the bubble's true content
//       // size, permanently breaking the expand animation's target size.
//       messages.forEach((message) => {
//         gsap.set(message, { clearProps: 'all' })
//         message.style.width = ''
//         if (message.parentElement) message.parentElement.style.minHeight = ''
//       })
//       lenis.destroy()
//     }
//   }, [])

//   return (
//     <section className="bg-paper px-4 py-28 text-ink sm:py-36">
//       <div className="mx-auto flex max-w-5xl flex-col items-center gap-20 text-center">
//         <h2 className="font-display text-[clamp(2.25rem,7vw,4.5rem)] uppercase italic leading-[0.95] tracking-tight">
//           Your questions,
//           <br />
//           answered.
//         </h2>

//         <div ref={containerRef} className="flex w-full flex-col gap-14 text-left sm:gap-20">
//           {faqs.map((faq) => (
//             <div key={faq.id} className="flex flex-col gap-6">
//               <div className="flex justify-start">
//                 <div className="faq-message w-full relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-ink/20 bg-[#F5F3EE] px-8 py-6">
//                   <div className="typing-indicator flex items-center justify-center gap-[0.35rem]">
//                     <span className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40" />
//                     <span
//                       className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
//                       style={{ animationDelay: '0.3s' }}
//                     />
//                     <span
//                       className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
//                       style={{ animationDelay: '0.6s' }}
//                     />
//                   </div>
//                   <div className="faq-content flex w-max max-w-full flex-col gap-3">
//                     <p className="whitespace-nowrap text-sm font-medium opacity-0 sm:text-base">{faq.question}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <div className="faq-message relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-bronze px-8 py-6">
//                   <div className="typing-indicator flex items-center justify-center gap-[0.35rem]">
//                     <span className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40" />
//                     <span
//                       className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
//                       style={{ animationDelay: '0.3s' }}
//                     />
//                     <span
//                       className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
//                       style={{ animationDelay: '0.6s' }}
//                     />
//                   </div>
//                   <div className="faq-content flex w-max max-w-full flex-col gap-3">
//                     {faq.answer.map((line) => (
//                       <p key={line} className="text-sm leading-relaxed opacity-0 sm:text-base">
//                         {line}
//                       </p>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }








'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

// useLayoutEffect warns during SSR; this resolves to a no-op on the server
// and the real thing in the browser, avoiding the console warning.
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : () => {}

type Faq = {
  id: string
  question: string
  answer: string[]
}

const faqs: Faq[] = [
  {
    id: 'longevity',
    question: 'Is Imperial Wood really long-lasting?',
    answer: [
      "Yes — it's a 30% concentration Eau de Parfum, well above typical EDT strength.",
      'A couple of sprays at your pulse points gives you several hours of wear.',
    ],
  },
  {
    id: 'unisex',
    question: 'Is it really unisex?',
    answer: [
      "Built around wood, amber and spice — notes that don't lean masculine or feminine.",
      "It's worn the same way by everyone, as their own signature.",
    ],
  },
  /* Commented out to keep the section to 4 questions — uncomment to restore.
  {
    id: 'delivery',
    question: 'How long does delivery take?',
    answer: [
      'Orders across India typically arrive within a few business days.',
      "You'll get tracking details on WhatsApp and email as soon as it ships.",
      'Metro cities are usually quicker.',
    ],
  },
  */
  {
    id: 'returns',
    question: 'Can I return or exchange it?',
    answer: [
      "We can't accept returns once the seal is opened, for hygiene reasons.",
      "If it arrives damaged, message us within 48 hours — full details in our Refund Policy.",
    ],
  },
  {
    id: 'payment',
    question: 'Do you offer Cash on Delivery?',
    answer: [
      'Yes — Cash on Delivery is available, alongside prepaid checkout.',
      'Prepaid orders go through Razorpay: cards, UPI, netbanking, and wallets.',
    ],
  },
  /* Commented out to keep the section to 4 questions — uncomment to restore.
  {
    id: 'contact',
    question: 'How do I reach you with a question?',
    answer: [
      'WhatsApp is fastest — message us directly and we typically reply within a few hours.',
      'You can also email taaoraperfumes@gmail.com any time.',
      "We're a small team, but we read everything ourselves.",
    ],
  },
  */
]

export default function FaqChat() {
  const containerRef = useRef<HTMLDivElement>(null)

  useIsoLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    gsap.registerPlugin(ScrollTrigger)

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const messages = Array.from(container.querySelectorAll<HTMLDivElement>('.faq-message'))

    // Reduced motion: skip the whole collapse/expand dance and just show
    // everything in its final, readable state.
    if (prefersReducedMotion) {
      messages.forEach((message) => {
        const typingIndicator = message.querySelector<HTMLElement>('.typing-indicator')
        const paragraphs = message.querySelectorAll<HTMLElement>('.faq-content p')
        if (typingIndicator) typingIndicator.style.display = 'none'
        paragraphs.forEach((p) => {
          p.style.opacity = '1'
        })
      })
      return
    }

    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // Bubble widths are measured from rendered text — if the display font
    // (Bodoni Moda) finishes loading after that measurement, the true width
    // can shift slightly. Refreshing once fonts are ready keeps triggers accurate.
    if ('fonts' in document) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }

    const triggers: ScrollTrigger[] = []
    const timelines: gsap.core.Timeline[] = []

    messages.forEach((message) => {
      const faqRow = message.parentElement
      const typingIndicator = message.querySelector<HTMLElement>('.typing-indicator')
      const messageCopy = message.querySelectorAll<HTMLElement>('.faq-content p')
      if (!faqRow || !typingIndicator) return

      // Measure the bubble's natural, fully-expanded size before collapsing it,
      // so the expand animation has an exact target to animate toward. Because
      // there's no forced width/nowrap on the content anymore, this naturally
      // respects the max-width clamp below and wraps on narrow screens.
      const expandedWidth = message.offsetWidth
      message.style.width = `${expandedWidth}px`
      const expandedHeight = message.offsetHeight
      faqRow.style.minHeight = `${expandedHeight}px`

      gsap.set(message, {
        width: 64,
        height: 64,
        borderRadius: '50%',
        padding: 0,
        scale: 0,
      })

      let collapseWhenDone = false

      const enterTimeline = gsap.timeline({ paused: true })
      enterTimeline.to(message, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.inOut',
      })

      const expandTimeline = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          if (collapseWhenDone) {
            collapseWhenDone = false
            enterTimeline.reverse()
          }
        },
      })

      expandTimeline
        .to(typingIndicator, { autoAlpha: 0, duration: 0.2 })
        .to(message, {
          width: expandedWidth,
          borderRadius: '1.75rem',
          paddingLeft: '1.5rem',
          paddingRight: '1.5rem',
          duration: 0.4,
          ease: 'power3.inOut',
        })
        .to(
          message,
          {
            height: expandedHeight,
            paddingTop: '1.25rem',
            paddingBottom: '1.25rem',
            duration: 0.4,
            ease: 'power3.inOut',
          },
          '-=0.2',
        )
        .to(messageCopy, { opacity: 1, duration: 0.3, stagger: 0.05 }, '-=0.25')

      timelines.push(enterTimeline, expandTimeline)

      triggers.push(
        ScrollTrigger.create({
          trigger: message,
          start: 'top 88%',
          onEnter: () => {
            collapseWhenDone = false
            enterTimeline.play()
          },
          onLeaveBack: () => {
            if (expandTimeline.progress() > 0) {
              collapseWhenDone = true
            } else {
              enterTimeline.reverse()
            }
          },
        }),
      )

      triggers.push(
        ScrollTrigger.create({
          trigger: message,
          start: 'top 55%',
          onEnter: () => expandTimeline.play(),
          onLeaveBack: () => expandTimeline.reverse(),
        }),
      )
    })

    return () => {
      triggers.forEach((t) => t.kill())
      timelines.forEach((t) => t.kill())
      // Critical: undo every inline style this effect wrote (both the plain
      // JS assignments and the gsap.set ones). Without this, a remount —
      // whether from React Strict Mode's dev double-invoke or a real
      // client-side navigation back to this page — would measure the
      // already-collapsed 64px circle instead of the bubble's true content
      // size, permanently breaking the expand animation's target size.
      messages.forEach((message) => {
        gsap.set(message, { clearProps: 'all' })
        message.style.width = ''
        if (message.parentElement) message.parentElement.style.minHeight = ''
      })
      lenis.destroy()
    }
  }, [])

  return (
    <section className="bg-paper px-4 py-28 text-ink sm:py-36">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-20 text-center">
        <h2 className="font-display text-[clamp(2.25rem,7vw,4.5rem)] uppercase italic leading-[0.95] tracking-tight">
          Your questions,
          <br />
          answered.
        </h2>

        <div ref={containerRef} className="flex w-full flex-col gap-14 text-left sm:gap-20">
          {faqs.map((faq) => (
            <div key={faq.id} className="flex flex-col gap-6">
              <div className="flex justify-start">
                <div className="faq-message relative flex max-w-[88%] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] border border-ink/20 bg-[#F5F3EE] px-6 py-5 sm:max-w-md sm:rounded-[2rem] sm:px-8 sm:py-6">
                  <div className="typing-indicator flex items-center justify-center gap-[0.35rem]">
                    <span className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40" />
                    <span
                      className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <span
                      className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
                      style={{ animationDelay: '0.6s' }}
                    />
                  </div>
                  <div className="faq-content flex w-max max-w-full flex-col gap-3">
                    <p className="text-sm font-medium opacity-0 sm:text-base">{faq.question}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="faq-message relative flex max-w-[88%] flex-col items-center justify-center overflow-hidden rounded-[1.75rem] bg-bronze px-6 py-5 sm:max-w-md sm:rounded-[2rem] sm:px-8 sm:py-6">
                  <div className="typing-indicator flex items-center justify-center gap-[0.35rem]">
                    <span className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40" />
                    <span
                      className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
                      style={{ animationDelay: '0.3s' }}
                    />
                    <span
                      className="h-[0.55rem] w-[0.55rem] animate-[typing-pulse_1s_ease-in-out_infinite] rounded-full bg-ink/40"
                      style={{ animationDelay: '0.6s' }}
                    />
                  </div>
                  <div className="faq-content flex w-max max-w-full flex-col gap-3">
                    {faq.answer.map((line) => (
                      <p key={line} className="text-sm leading-relaxed opacity-0 sm:text-base">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}