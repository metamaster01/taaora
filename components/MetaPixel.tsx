
// "use client";

// import { useCallback, useEffect, useRef, useState } from "react";
// import { usePathname, useSearchParams } from "next/navigation";

// type Consent = "unknown" | "accepted" | "rejected";

// declare global {
//   interface Window {
//     fbq?: (...args: unknown[]) => void;
//     _fbq?: Window["fbq"];
//     __metaPixelInitialized?: boolean;
//     __metaPixelLastPageView?: string;
//   }
// }

// const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
// const CONSENT_KEY = "meta-pixel-consent";

// function initializePixel() {
//   if (!PIXEL_ID || typeof window === "undefined") return;

//   if (!window.fbq) {
//     const fbq = function (...args: unknown[]) {
//       const fn = fbq as typeof fbq & {
//         callMethod?: (...args: unknown[]) => void;
//         queue: unknown[][];
//         push: (...args: unknown[]) => void;
//         loaded?: boolean;
//         version?: string;
//       };

//       if (fn.callMethod) {
//         fn.callMethod(...args);
//       } else {
//         fn.queue.push(args);
//       }
//     } as typeof window.fbq & {
//       queue: unknown[][];
//       push: (...args: unknown[]) => void;
//       loaded?: boolean;
//       version?: string;
//     };

//     fbq.queue = [];
//     fbq.push = (...args: unknown[]) => fbq.queue.push(args);
//     fbq.loaded = true;
//     fbq.version = "2.0";

//     window.fbq = fbq;
//     window._fbq = fbq;

//     const script = document.createElement("script");
//     script.async = true;
//     script.src = "https://connect.facebook.net/en_US/fbevents.js";
//     script.dataset.metaPixel = "true";
//     document.head.appendChild(script);
//   }

//   if (!window.__metaPixelInitialized) {
//     window.fbq("init", PIXEL_ID);
//     window.__metaPixelInitialized = true;
//   }
// }

// function trackPageView(url: string) {
//   if (
//     !window.fbq ||
//     window.__metaPixelLastPageView === url
//   ) {
//     return;
//   }

//   window.__metaPixelLastPageView = url;
//   window.fbq("track", "PageView");
// }

// export default function MetaPixel() {
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const [consent, setConsent] = useState<Consent>("unknown");
//   const [ready, setReady] = useState(false);
//   const previousUrl = useRef<string | null>(null);

//   const query = searchParams.toString();
//   const currentUrl = query
//     ? `${pathname}?${query}`
//     : pathname;

//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(CONSENT_KEY);

//       if (saved === "accepted" || saved === "rejected") {
//         setConsent(saved);
//       }
//     } finally {
//       setReady(true);
//     }
//   }, []);

//   useEffect(() => {
//     if (!ready || consent !== "accepted" || !PIXEL_ID) {
//       return;
//     }

//     initializePixel();
//     trackPageView(currentUrl);
//     previousUrl.current = currentUrl;
//   }, [ready, consent, currentUrl]);

//   const chooseConsent = useCallback((choice: "accepted" | "rejected") => {
//     try {
//       localStorage.setItem(CONSENT_KEY, choice);
//       setConsent(choice);
//     } catch {
//       // Fail closed if consent cannot be saved.
//       setConsent("rejected");
//     }
//   }, []);

//   if (!ready || consent !== "unknown") return null;

//   return (
//     <aside
//       role="dialog"
//       aria-label="Cookie preferences"
//       aria-describedby="meta-cookie-description"
//       className="fixed inset-x-0 bottom-0 z-[9999] border-t bg-white p-4 text-gray-900 shadow-2xl sm:inset-x-auto sm:bottom-4 sm:left-4 sm:max-w-md sm:rounded-xl sm:border"
//     >
//       <h2 className="text-base font-semibold">
//         Your privacy choices
//       </h2>

//       <p
//         id="meta-cookie-description"
//         className="mt-2 text-sm leading-6 text-gray-700"
//       >
//         We use Meta Pixel to understand website visits and
//         measure advertising performance. It may use cookies
//         and share browsing information with Meta. You can
//         accept or reject this optional tracking.
//       </p>

//       <div className="mt-4 flex flex-wrap gap-3">
//         <button
//           type="button"
//           onClick={() => chooseConsent("rejected")}
//           className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
//         >
//           Reject optional tracking
//         </button>

//         <button
//           type="button"
//           onClick={() => chooseConsent("accepted")}
//           className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
//         >
//           Accept
//         </button>
//       </div>

//       <p className="mt-3 text-xs text-gray-500">
//         You can change your choice through our cookie
//         preferences at any time.
//       </p>
//     </aside>
//   );
// }






'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { EXCLUDED_PATH_PREFIXES, PIXEL_ID, isPixelEnabled, pageView } from '@/lib/meta-pixel'

// PIXEL_ID is validated as digits-only in lib/meta-pixel.ts, so it is safe to inline here.
const initScript = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${PIXEL_ID}');
var ex=${JSON.stringify(EXCLUDED_PATH_PREFIXES)};
if(!ex.some(function(p){return location.pathname.indexOf(p)===0})){fbq('track','PageView');}
`

export default function MetaPixel() {
  const pathname = usePathname()
  // Starts as the current path, so the first render never double-counts the
  // initial PageView that the script above already sends (also safe in React strict mode).
  const lastPath = useRef(pathname)

  useEffect(() => {
    if (!isPixelEnabled) return
    if (lastPath.current === pathname) return
    lastPath.current = pathname
    if (EXCLUDED_PATH_PREFIXES.some((p) => pathname.startsWith(p))) return
    pageView() // client-side route change (Next.js doesn't reload the page)
  }, [pathname])

  if (!isPixelEnabled) return null

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {initScript}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  )
}