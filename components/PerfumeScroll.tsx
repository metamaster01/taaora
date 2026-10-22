"use client";

/**
 * PerfumeScroll — scroll-driven 3D hero/story for TAAORA · Imperial Wood
 *
 * Stack: Next.js (App Router) · TypeScript · Tailwind v4 · three · gsap (ScrollTrigger) · lenis
 *
 *   npm i three gsap lenis
 *   npm i -D @types/three
 *
 * Put the bottle at /public/models/perfume-1.glb and render <PerfumeScroll /> on a page.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* -------------------------------------------------------------------------- */
/*  Content (edit freely)                                                      */
/* -------------------------------------------------------------------------- */

const NOTES = [
  {
    no: "01",
    label: "Opening",
    word: "OPENING",
    title: "Fresh Citrus & Aromatic Spices",
    body: "The first impression. A bright citrus burst laced with warm spice, waking the senses the moment it touches skin.",
    chips: ["Fresh Citrus", "Aromatic Spices"],
  },
  {
    no: "02",
    label: "Heart",
    word: "HEART",
    title: "Aromatic Woods & Warm Florals",
    body: "As it settles, woods meet soft florals and a hush of spice. This is where the true character begins to unfold.",
    chips: ["Aromatic Woods", "Warm Florals", "Soft Spices"],
  },
  {
    no: "03",
    label: "Base",
    word: "BASE",
    title: "Rich Woods, Amber & Musk",
    body: "The lasting impression. Deep woods, warm amber and soft musk that linger for hours. The part people remember.",
    chips: ["Rich Woods", "Amber", "Musk", "Resinous Accords"],
  },
] as const;

const STAGE_LABELS = ["Presence", "Story", "Opening", "Heart", "Base", "Signature"];

/* -------------------------------------------------------------------------- */
/*  Theme: white · mist · yellow · woody                                       */
/* -------------------------------------------------------------------------- */

const INK = "#3B2A1C"; // woody text
const SUN = "#EDB92E"; // yellow accent

// Page background per stage (hero → cta). Light only, no black.
const BG = [
  "#FBF8F1", // hero   – warm white
  "#E3EBEC", // story  – mist
  "#F5E7A9", // opening – soft yellow
  "#EFE3C6", // heart  – sand
  "#D9C3A3", // base   – woody tint
  "#FBF8F1", // cta    – warm white
];

/* -------------------------------------------------------------------------- */
/*  Bottle choreography                                                        */
/*  x: fraction of half the viewport width (-1 … 1) · y: world units           */
/* -------------------------------------------------------------------------- */

type Pose = { x: number; y: number; s: number; rx: number; ry: number; rz: number };

const POSES: Pose[] = [
  { x: 0, y: -0.05, s: 1, rx: 0, ry: -0.4, rz: 0 }, // hero
  { x: 0.5, y: 0, s: 0.95, rx: 0.04, ry: 1.4, rz: -0.05 }, // story
  { x: -0.5, y: 0.05, s: 1, rx: -0.03, ry: 3.2, rz: 0.06 }, // opening
  { x: 0.5, y: -0.05, s: 1.05, rx: 0.05, ry: 5.4, rz: -0.07 }, // heart
  { x: -0.5, y: 0, s: 1.1, rx: 0.02, ry: 8.0, rz: 0.05 }, // base
  { x: 0.5, y: 0, s: 1.12, rx: 0, ry: 12.2, rz: 0 }, // cta
];

const BOTTLE_HEIGHT = 3.4; // world units at scale 1
const CAM_Z = 9;
const FOV = 30;

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                              */
/* -------------------------------------------------------------------------- */

/** Word-by-word masked reveal. Animated by the effects below via data attributes. */
function Words({
  text,
  className = "",
  hero = false,
}: {
  text: string;
  className?: string;
  hero?: boolean;
}) {
  const attr = hero ? { "data-hero-word": "" } : { "data-word": "" };
  return (
    <span className={className} aria-label={text} {...(hero ? {} : { "data-reveal": "" })}>
      {text.split(" ").map((w, i) => (
        <span
          key={i}
          aria-hidden
          className="mr-[0.22em] inline-block overflow-hidden pb-[0.14em] align-bottom -mb-[0.14em]"
        >
          <span {...attr} className="inline-block will-change-transform" style={{ transform: "translateY(110%)" }}>
            {w}
          </span>
        </span>
      ))}
    </span>
  );
}

function GiantWord({ children, drift = 10 }: { children: string; drift?: number }) {
  return (
    <span
      aria-hidden
      data-drift={drift}
      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center font-serif text-[28vw] leading-none text-transparent"
      style={{ WebkitTextStroke: "1.5px rgba(59,42,28,0.16)" }}
    >
      {children}
    </span>
  );
}

function makeShadowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(59,42,28,0.5)");
  gr.addColorStop(1, "rgba(59,42,28,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

type Props = {
  modelUrl?: string;
  shopHref?: string;
  whatsappHref?: string;
  /** Set false if your site already runs its own Lenis instance. */
  smoothScroll?: boolean;
  className?: string;
};

export default function PerfumeScroll({
  modelUrl = "/models/perfume-2.glb",
  shopHref = "/products/imperial-wood",
  whatsappHref = "https://wa.me/917558566189?text=Hi%20Taaora%2C%20I%20have%20a%20question%20about%20Imperial%20Wood.",
  smoothScroll = true,
  className = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  // Shared between the three.js loop and the scroll timelines.
  const anim = useRef({
    target: { ...POSES[0] },
    cur: { ...POSES[0] },
    intro: { v: 0 },
  });

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [gone, setGone] = useState(false);
  const [stage, setStage] = useState(0);

  /* ---------------------------- three.js scene ---------------------------- */
  useEffect(() => {
    const canvas = canvasRef.current;
    const layer = layerRef.current;
    const root = rootRef.current;
    if (!canvas || !layer || !root) return;

    let disposed = false;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
    camera.position.set(0, 0, CAM_Z);

    // Studio reflections for the glass, no HDR download needed.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;

    const key = new THREE.DirectionalLight(0xfff1cf, 2.4);
    key.position.set(3, 4, 5);
    const rim = new THREE.DirectionalLight(0xf6d77a, 2.0);
    rim.position.set(-4, 2, -3);
    scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.35));

    const pivot = new THREE.Group();
    pivot.rotation.order = "YXZ";
    scene.add(pivot);

    // Soft contact shadow (camera-facing ellipse)
    const shadowTex = makeShadowTexture();
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 })
    );
    shadow.renderOrder = -1;
    scene.add(shadow);

    // Load the bottle
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);
    loader.setMeshoptDecoder(MeshoptDecoder);

    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const holder = new THREE.Group();
        holder.add(model);
        holder.scale.setScalar(BOTTLE_HEIGHT / size.y);
        pivot.add(holder);

        model.traverse((o) => {
          const m = o as THREE.Mesh;
          if (!m.isMesh) return;
          const mats = Array.isArray(m.material) ? m.material : [m.material];
          mats.forEach((mat) => {
            const std = mat as THREE.MeshStandardMaterial;
            if ("envMapIntensity" in std) std.envMapIntensity = 1.3;
          });
        });

        setProgress(100);
        setReady(true);
      },
      (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      },
      (err) => {
        console.error("[PerfumeScroll] could not load", modelUrl, err);
        setReady(true); // don't trap the user behind the loader
      }
    );

    // Sizing
    const resize = () => {
      const w = layer.clientWidth;
      const h = layer.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(layer);

    // Pointer parallax
    const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
    const onMove = (e: PointerEvent) => {
      ptr.x = (e.clientX / window.innerWidth) * 2 - 1;
      ptr.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Only render while the component is on screen
    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
    io.observe(root);

    const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

    const render = (t: number, deltaMs: number) => {
      if (!visible) return;
      const dt = Math.min(deltaMs / 1000, 0.05);
      const k = 1 - Math.exp(-dt * 6);
      const { cur, target, intro } = anim.current;

      (Object.keys(cur) as (keyof Pose)[]).forEach((p) => {
        cur[p] += (target[p] - cur[p]) * k;
      });
      ptr.sx += (ptr.x - ptr.sx) * k;
      ptr.sy += (ptr.y - ptr.sy) * k;

      const w = layer.clientWidth;
      const h = layer.clientHeight;
      const mobile = w < 768;
      const halfW = tanHalf * CAM_Z * (w / h);
      const xMul = mobile ? 0 : 1;
      const yAdd = mobile ? 1.0 : 0;
      const sMul = mobile ? 0.62 : 1;

      const scale = cur.s * sMul * (0.8 + 0.2 * intro.v);
      const px = cur.x * halfW * xMul;
      const py = cur.y + yAdd + Math.sin(t * 1.1) * 0.06 - (1 - intro.v) * 1.2;

      pivot.position.set(px, py, 0);
      pivot.scale.setScalar(scale);
      pivot.rotation.set(
        cur.rx + ptr.sy * 0.1,
        cur.ry + ptr.sx * 0.35 + Math.sin(t * 0.5) * 0.06 + (1 - intro.v) * Math.PI,
        cur.rz
      );
      pivot.visible = intro.v > 0.001;

      // shadow sits under the bottle
      const bottom = py - (BOTTLE_HEIGHT / 2) * scale - 0.1;
      shadow.position.set(px, bottom, -0.6);
      shadow.scale.set(2.6 * scale, 0.5 * scale, 1);
      (shadow.material as THREE.MeshBasicMaterial).opacity = intro.v * 0.9;

      // Move the glow orb with the bottle (screen-space)
      if (orbRef.current) {
        const ox = cur.x * (w / 2) * xMul;
        const oy = -(py * (h / (2 * tanHalf * CAM_Z)));
        orbRef.current.style.transform = `translate(calc(-50% + ${ox}px), calc(-50% + ${oy}px)) scale(${(0.9 + cur.s * 0.15) * intro.v})`;
      }

      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    return () => {
      disposed = true;
      gsap.ticker.remove(render);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      draco.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (!m.isMesh) return;
        m.geometry?.dispose();
        const mats = Array.isArray(m.material) ? m.material : [m.material];
        mats.forEach((mat) => {
          Object.values(mat).forEach((v) => {
            if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose();
          });
          mat.dispose();
        });
      });
      shadowTex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
    };
  }, [modelUrl]);

  /* ------------------- smooth scroll + scroll choreography ------------------ */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let lenis: Lenis | null = null;
    let raf: ((t: number) => void) | null = null;
    if (smoothScroll && !reduce) {
      lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      raf = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
    }

    const ctx = gsap.context(() => {
      const stages = gsap.utils.toArray<HTMLElement>("[data-stage]", root);
      const { target } = anim.current;

      stages.forEach((el, i) => {
        // active stage → rail + label
        ScrollTrigger.create({
          trigger: el,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => self.isActive && setStage(i),
        });

        if (i === 0) return;

        const st = { trigger: el, start: "top bottom", end: "top 30%", scrub: true };

        // bottle: previous pose → this pose
        gsap.fromTo(target, { ...POSES[i - 1] }, { ...POSES[i], ease: "none", immediateRender: false, scrollTrigger: st });

        // page colour: previous → this
        gsap.fromTo(
          root,
          { backgroundColor: BG[i - 1] },
          { backgroundColor: BG[i], ease: "none", immediateRender: false, scrollTrigger: st }
        );
      });

      // Giant outlined words drift sideways while their section passes
      gsap.utils.toArray<HTMLElement>("[data-drift]", root).forEach((el) => {
        const d = Number(el.dataset.drift) || 10;
        gsap.fromTo(
          el,
          { xPercent: -d },
          {
            xPercent: d,
            ease: "none",
            scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      });

      // Headline word reveals
      gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
        const words = el.querySelectorAll("[data-word]");
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              words,
              { yPercent: 110 },
              { yPercent: 0, duration: reduce ? 0 : 1.1, ease: "power4.out", stagger: 0.06 }
            ),
        });
      });

      // Fade-ups
      gsap.utils.toArray<HTMLElement>("[data-fade]", root).forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              el,
              { opacity: 0, y: 28 },
              { opacity: 1, y: 0, duration: reduce ? 0 : 0.9, ease: "power3.out" }
            ),
        });
      });

      // Note chips pop in
      gsap.utils.toArray<HTMLElement>("[data-chips]", root).forEach((wrap) => {
        const chips = wrap.querySelectorAll("[data-chip]");
        ScrollTrigger.create({
          trigger: wrap,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.fromTo(
              chips,
              { opacity: 0, y: 16, scale: 0.9 },
              { opacity: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.7, ease: "back.out(1.7)", stagger: 0.09 }
            ),
        });
      });

      // Top progress line
      if (barRef.current) {
        gsap.to(barRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true },
        });
      }
    }, root);

    return () => {
      ctx.revert();
      if (raf) gsap.ticker.remove(raf);
      lenis?.destroy();
    };
  }, [smoothScroll]);

  /* ------------------------------ hero intro ------------------------------ */
  useEffect(() => {
    if (!ready) return;
    const root = rootRef.current;
    if (!root) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.25 });
      tl.to(anim.current.intro, { v: 1, duration: reduce ? 0 : 2, ease: "power3.out" }, 0)
        .fromTo(
          "[data-hero-word]",
          { yPercent: 110 },
          { yPercent: 0, duration: reduce ? 0 : 1.2, ease: "power4.out", stagger: 0.07 },
          0.3
        )
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: reduce ? 0 : 1, ease: "power3.out", stagger: 0.12 },
          0.9
        );
    }, root);

    ScrollTrigger.refresh();
    const hide = setTimeout(() => setGone(true), 900);
    return () => {
      clearTimeout(hide);
      ctx.revert();
    };
  }, [ready]);

  /* --------------------------------- UI ----------------------------------- */

  const stageWrap = "relative flex min-h-svh items-end py-24 md:items-center";
  const grid = "relative z-20 mx-auto grid w-full max-w-7xl grid-cols-12 px-6 md:px-12";
  const left = "col-span-12 md:col-span-5";
  const right = "col-span-12 md:col-span-5 md:col-start-8";
  const h2 = "font-serif text-[clamp(2.4rem,6vw,5.2rem)] leading-[0.95] tracking-[-0.03em]";
  const eyebrow = "mb-5 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.28em]";
  const para = "mt-6 max-w-md text-[15px] leading-relaxed md:text-base";

  return (
    <div
      ref={rootRef}
      className={`relative isolate overflow-x-clip text-[#3B2A1C] ${className}`}
      style={{ backgroundColor: BG[0] }}
    >
      {/* Loader */}
      {!gone && (
        <div
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#FBF8F1] transition-opacity duration-700 ${
            ready ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <span className="font-serif text-3xl tracking-[0.35em]">TAAORA</span>
          <div className="h-px w-40 overflow-hidden bg-[#3B2A1C]/15">
            <div className="h-full bg-[#EDB92E] transition-[width] duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Sticky 3D layer: stays on screen while the stages scroll over it */}
      <div ref={layerRef} className="pointer-events-none sticky top-0 z-10 -mb-[100svh] h-svh w-full">
        {/* glow + ring following the bottle */}
        <div
          ref={orbRef}
          className="absolute left-1/2 top-1/2 aspect-square w-[min(62svh,78vw)] will-change-transform"
          style={{ transform: "translate(-50%,-50%) scale(0)" }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: `radial-gradient(circle, ${SUN}66 0%, ${SUN}22 45%, transparent 70%)` }}
          />
          <div className="absolute inset-[6%] animate-[spin_50s_linear_infinite] rounded-full border border-[#3B2A1C]/15">
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[#EDB92E]" />
          </div>
        </div>

        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* progress line */}
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[#3B2A1C]/5">
          <div ref={barRef} className="h-full origin-left scale-x-0 bg-[#EDB92E]" />
        </div>

        {/* stage label */}
        <div className="absolute bottom-6 left-6 hidden items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] md:flex md:left-12">
          <span>{String(stage + 1).padStart(2, "0")} / {String(STAGE_LABELS.length).padStart(2, "0")}</span>
          <span className="h-px w-10 bg-[#3B2A1C]/30" />
          <span>{STAGE_LABELS[stage]}</span>
        </div>

        {/* rail */}
        <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
          {STAGE_LABELS.map((l, i) => (
            <span
              key={l}
              className={`block h-2 w-2 rounded-full transition-all duration-500 ${
                i === stage ? "scale-150 bg-[#3B2A1C]" : "bg-[#3B2A1C]/25"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ------------------------------ 0 · HERO ------------------------------ */}
      <section data-stage className={stageWrap}>
        <GiantWord drift={6}>TAAORA</GiantWord>
        <div className={grid}>
          <div className="col-span-12 md:col-span-6">
            <p data-hero-fade className={`${eyebrow} opacity-0`}>
              <span className="h-px w-8 bg-[#3B2A1C]/40" /> Eau de Parfum · 30% concentration
            </p>
            <h1 className="font-serif text-[clamp(2.2rem,5.2vw,4.6rem)] leading-[0.98] tracking-[-0.03em]">
              <Words hero text="Wear a fragrance that becomes your presence." />
            </h1>
            <div data-hero-fade className="mt-8 flex flex-wrap items-center gap-4 opacity-0">
              <Link
                href={shopHref}
                className="rounded-full bg-[#EDB92E] px-7 py-4 text-sm font-semibold text-[#2B1D12] transition hover:scale-[1.03]"
              >
                Discover Imperial Wood
              </Link>
              <span className="text-sm">
                <span className="font-semibold">₹1,099</span>{" "}
                <span className="opacity-50 line-through">₹1,499</span>
                <span className="ml-2 rounded-full bg-[#3B2A1C]/10 px-2 py-0.5 text-[11px] font-medium">27% off</span>
              </span>
            </div>
          </div>
        </div>
        <div
          data-hero-fade
          className="absolute bottom-6 right-6 z-20 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.3em] opacity-0 md:right-12"
        >
          Scroll <span className="h-8 w-px animate-pulse bg-[#3B2A1C]/40" />
        </div>
      </section>

      {/* ------------------------------ 1 · STORY ----------------------------- */}
      <section data-stage className={stageWrap}>
        <GiantWord drift={12}>SINGULAR</GiantWord>
        <div className={grid}>
          <div className={left}>
            <p className={eyebrow} data-fade style={{ opacity: 0 }}>
              <span className="h-px w-8 bg-[#3B2A1C]/40" /> About Taaora
            </p>
            <h2 className={h2}>
              <Words text="One presence. Not a shelf of options." />
            </h2>
            <p data-fade style={{ opacity: 0 }} className={para}>
              A fragrance shouldn&rsquo;t compete for attention across a dozen bottles. It should be singular,
              considered and unmistakably yours. We make one fragrance, and we intend it to be the only one you need.
            </p>
            <dl data-fade style={{ opacity: 0 }} className="mt-8 flex gap-10 text-sm">
              <div>
                <dt className="text-[11px] uppercase tracking-[0.22em] opacity-60">Concentration</dt>
                <dd className="mt-1 font-serif text-3xl">30%</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-[0.22em] opacity-60">Made in</dt>
                <dd className="mt-1 font-serif text-3xl">India</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* ----------------------------- 2–4 · NOTES ---------------------------- */}
      {NOTES.map((n, i) => (
        <section key={n.no} data-stage className={stageWrap}>
          <GiantWord drift={i % 2 ? -12 : 12}>{n.word}</GiantWord>
          <div className={grid}>
            <div className={i % 2 === 0 ? right : left}>
              <p className={eyebrow} data-fade style={{ opacity: 0 }}>
                <span className="h-px w-8 bg-[#3B2A1C]/40" /> Three notes, one presence
              </p>
              <div className="flex items-end gap-5">
                <span className="font-serif text-7xl leading-none text-[#EDB92E] md:text-8xl">{n.no}</span>
                <span className="pb-2 text-[11px] font-medium uppercase tracking-[0.3em]">{n.label}</span>
              </div>
              <h2 className={`${h2} mt-4 !text-[clamp(2rem,4.4vw,3.8rem)]`}>
                <Words text={n.title} />
              </h2>
              <p data-fade style={{ opacity: 0 }} className={para}>
                {n.body}
              </p>
              <ul data-chips className="mt-7 flex flex-wrap gap-2">
                {n.chips.map((c) => (
                  <li
                    key={c}
                    data-chip
                    style={{ opacity: 0 }}
                    className="rounded-full border border-[#3B2A1C]/25 bg-white/50 px-4 py-2 text-[13px] backdrop-blur-sm"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ))}

      {/* ------------------------------ 5 · CTA ------------------------------- */}
      <section data-stage className={stageWrap}>
        <GiantWord drift={8}>IMPERIAL</GiantWord>
        <div className={grid}>
          <div className={left}>
            <p className={eyebrow} data-fade style={{ opacity: 0 }}>
              <span className="h-px w-8 bg-[#3B2A1C]/40" /> Limited-time offer
            </p>
            <h2 className={h2}>
              <Words text="Make it your signature." />
            </h2>
            <p data-fade style={{ opacity: 0 }} className={para}>
              Imperial Wood is ready when you are. Save ₹400 today: now{" "}
              <span className="font-semibold">₹1,099</span> instead of ₹1,499.
            </p>
            <div data-fade style={{ opacity: 0 }} className="mt-8 flex flex-wrap gap-3">
              <Link
                href={shopHref}
                className="rounded-full bg-[#EDB92E] px-7 py-4 text-sm font-semibold text-[#2B1D12] transition hover:scale-[1.03]"
              >
                Shop Imperial Wood
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#3B2A1C]/35 px-7 py-4 text-sm font-semibold transition hover:bg-[#3B2A1C] hover:text-[#FBF8F1]"
              >
                Chat on WhatsApp
              </a>
            </div>
            <ul
              data-fade
              style={{ opacity: 0 }}
              className="mt-10 grid grid-cols-2 gap-x-8 gap-y-4 text-sm"
            >
              <li><span className="font-serif text-2xl">4.9</span> <span className="opacity-60">/ 5 rating</span></li>
              <li><span className="font-serif text-2xl">500+</span> <span className="opacity-60">verified reviews</span></li>
              <li><span className="font-serif text-2xl">24h</span> <span className="opacity-60">to ship</span></li>
              <li><span className="font-serif text-2xl">3–5</span> <span className="opacity-60">days delivery</span></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}








// "use client";

// /**
//  * PerfumeScroll — scroll-driven 3D story for TAAORA · Imperial Wood
//  *
//  * Stack: Next.js (App Router) · TypeScript · Tailwind v4 · three · gsap (ScrollTrigger) · lenis
//  *
//  *   npm i three gsap lenis
//  *   npm i -D @types/three
//  *
//  * Put the bottle at /public/models/perfume-3.glb (or pass modelUrl) and render <PerfumeScroll />.
//  */

// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
// import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import Lenis from "lenis";

// if (typeof window !== "undefined") {
//   gsap.registerPlugin(ScrollTrigger);
// }

// /* -------------------------------------------------------------------------- */
// /*  Content (edit freely)                                                      */
// /* -------------------------------------------------------------------------- */

// const NOTES = [
//   {
//     no: "01",
//     label: "Opening",
//     word: "OPENING",
//     title: "Fresh Citrus & Aromatic Spices",
//     body: "The first impression. A bright citrus burst laced with warm spice, waking the senses the moment it touches skin.",
//     chips: ["Fresh Citrus", "Aromatic Spices"],
//   },
//   {
//     no: "02",
//     label: "Heart",
//     word: "HEART",
//     title: "Aromatic Woods & Warm Florals",
//     body: "As it settles, woods meet soft florals and a hush of spice. This is where the true character begins to unfold.",
//     chips: ["Aromatic Woods", "Warm Florals", "Soft Spices"],
//   },
//   {
//     no: "03",
//     label: "Base",
//     word: "BASE",
//     title: "Rich Woods, Amber & Musk",
//     body: "The lasting impression. Deep woods, warm amber and soft musk that linger for hours. The part people remember.",
//     chips: ["Rich Woods", "Amber", "Musk", "Resinous Accords"],
//   },
// ] as const;

// const STAGE_LABELS = ["Presence", "Story", "Opening", "Heart", "Base", "Signature"];

// /* -------------------------------------------------------------------------- */
// /*  Theme: white · mist · yellow · woody (all light, slightly deeper so the    */
// /*  glass bottle has something to stand against)                               */
// /* -------------------------------------------------------------------------- */

// const BG = [
//   "#F2EBDB", // hero    – warm white
//   "#D5E1E3", // story   – mist
//   "#F3DF92", // opening – yellow
//   "#EBD7AC", // heart   – sand
//   "#CDB08A", // base    – woody
//   "#F2EBDB", // cta     – warm white
// ];

// /* -------------------------------------------------------------------------- */
// /*  Bottle choreography (text and bottle alternate sides)                      */
// /*  x: fraction of half the viewport width (-1 … 1) · y: world units           */
// /* -------------------------------------------------------------------------- */

// type Pose = { x: number; y: number; s: number; rx: number; ry: number; rz: number };

// const POSES: Pose[] = [
//   { x: 0.48, y: -0.05, s: 1, rx: 0, ry: -0.5, rz: 0 }, // hero    – bottle right
//   { x: -0.5, y: 0, s: 0.95, rx: 0.04, ry: 1.4, rz: -0.05 }, // story   – bottle left
//   { x: 0.5, y: 0.05, s: 1, rx: -0.03, ry: 3.2, rz: 0.06 }, // opening – right
//   { x: -0.5, y: -0.05, s: 1.05, rx: 0.05, ry: 5.4, rz: -0.07 }, // heart   – left
//   { x: 0.5, y: 0, s: 1.1, rx: 0.02, ry: 8.0, rz: 0.05 }, // base    – right
//   { x: -0.5, y: 0, s: 1.12, rx: 0, ry: 12.2, rz: 0 }, // cta     – left
// ];

// const BOTTLE_HEIGHT = 3.4; // world units at scale 1
// const CAM_Z = 9;
// const FOV = 30;

// /* -------------------------------------------------------------------------- */
// /*  Small helpers                                                              */
// /* -------------------------------------------------------------------------- */

// /**
//  * Word-by-word masked reveal. Each word starts at opacity 0 (so nothing flashes)
//  * and is animated with yPercent by the effects below.
//  */
// function Words({
//   text,
//   className = "",
//   hero = false,
// }: {
//   text: string;
//   className?: string;
//   hero?: boolean;
// }) {
//   const attr = hero ? { "data-hero-word": "" } : { "data-word": "" };
//   return (
//     <span className={className} aria-label={text} {...(hero ? {} : { "data-reveal": "" })}>
//       {text.split(" ").map((w, i) => (
//         <span
//           key={i}
//           aria-hidden
//           className="mr-[0.22em] -mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom"
//         >
//           <span {...attr} className="inline-block will-change-transform" style={{ opacity: 0 }}>
//             {w}
//           </span>
//         </span>
//       ))}
//     </span>
//   );
// }

// /** Big background word: solid tint + strong outline so it reads on every background. */
// function GiantWord({ children, drift = 10 }: { children: string; drift?: number }) {
//   return (
//     <span
//       aria-hidden
//       data-drift={drift}
//       className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 select-none whitespace-nowrap text-center font-serif text-[30vw] font-bold leading-none"
//       style={{
//         color: "rgba(59,42,28,0.10)",
//         WebkitTextStroke: "2.5px rgba(59,42,28,0.42)",
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// function makeShadowTexture() {
//   const c = document.createElement("canvas");
//   c.width = c.height = 128;
//   const g = c.getContext("2d")!;
//   const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
//   gr.addColorStop(0, "rgba(59,42,28,0.55)");
//   gr.addColorStop(1, "rgba(59,42,28,0)");
//   g.fillStyle = gr;
//   g.fillRect(0, 0, 128, 128);
//   const t = new THREE.CanvasTexture(c);
//   t.colorSpace = THREE.SRGBColorSpace;
//   return t;
// }

// /* -------------------------------------------------------------------------- */
// /*  Component                                                                  */
// /* -------------------------------------------------------------------------- */

// type Props = {
//   modelUrl?: string;
//   shopHref?: string;
//   whatsappHref?: string;
//   /** Height in px of your fixed site header, so the bottle is never hidden behind it. */
//   headerOffset?: number;
//   /** Set false if your site already runs its own Lenis instance. */
//   smoothScroll?: boolean;
//   className?: string;
// };

// export default function PerfumeScroll({
//   modelUrl = "/models/perfume-2.glb",
//   shopHref = "/products/imperial-wood",
//   whatsappHref = "https://wa.me/917558566189?text=Hi%20Taaora%2C%20I%20have%20a%20question%20about%20Imperial%20Wood.",
//   headerOffset = 112,
//   smoothScroll = true,
//   className = "",
// }: Props) {
//   const rootRef = useRef<HTMLDivElement>(null);
//   const layerRef = useRef<HTMLDivElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const barRef = useRef<HTMLDivElement>(null);

//   // Shared between the three.js loop and the scroll timelines.
//   const anim = useRef({
//     target: { ...POSES[0] },
//     cur: { ...POSES[0] },
//     intro: { v: 0 },
//   });

//   const [progress, setProgress] = useState(0);
//   const [ready, setReady] = useState(false);
//   const [gone, setGone] = useState(false);
//   const [stage, setStage] = useState(0);

//   /* ---------------------------- three.js scene ---------------------------- */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const layer = layerRef.current;
//     const root = rootRef.current;
//     if (!canvas || !layer || !root) return;

//     let disposed = false;

//     const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//     renderer.setClearColor(0x000000, 0);
//     renderer.outputColorSpace = THREE.SRGBColorSpace;
//     // Neutral keeps true colours (ACES was greying the bottle out).
//     renderer.toneMapping = THREE.NeutralToneMapping;
//     renderer.toneMappingExposure = 0.92;

//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 50);
//     camera.position.set(0, 0, CAM_Z);

//     // Studio reflections for the glass, no HDR download needed.
//     const pmrem = new THREE.PMREMGenerator(renderer);
//     const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
//     scene.environment = envTex;
//     scene.environmentIntensity = 0.75;

//     // Fixed, calm lighting. Nothing reacts to the pointer.
//     const key = new THREE.DirectionalLight(0xfff1cf, 1.5);
//     key.position.set(3, 4, 5);
//     const rim = new THREE.DirectionalLight(0xf6d77a, 1.0);
//     rim.position.set(-4, 2, -3);
//     scene.add(key, rim, new THREE.AmbientLight(0xffffff, 0.12));

//     const pivot = new THREE.Group();
//     pivot.rotation.order = "YXZ";
//     scene.add(pivot);

//     // Soft contact shadow
//     const shadowTex = makeShadowTexture();
//     const shadow = new THREE.Mesh(
//       new THREE.PlaneGeometry(1, 1),
//       new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0 })
//     );
//     shadow.renderOrder = -1;
//     scene.add(shadow);

//     // Load the bottle
//     const draco = new DRACOLoader();
//     draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
//     const loader = new GLTFLoader();
//     loader.setDRACOLoader(draco);
//     loader.setMeshoptDecoder(MeshoptDecoder);

//     loader.load(
//       modelUrl,
//       (gltf) => {
//         if (disposed) return;
//         const model = gltf.scene;
//         const box = new THREE.Box3().setFromObject(model);
//         const size = box.getSize(new THREE.Vector3());
//         const center = box.getCenter(new THREE.Vector3());
//         model.position.sub(center);

//         const holder = new THREE.Group();
//         holder.add(model);
//         holder.scale.setScalar(BOTTLE_HEIGHT / size.y);
//         pivot.add(holder);

//         model.traverse((o) => {
//           const m = o as THREE.Mesh;
//           if (!m.isMesh) return;
//           const mats = Array.isArray(m.material) ? m.material : [m.material];
//           mats.forEach((mat) => {
//             const std = mat as THREE.MeshStandardMaterial;
//             if ("envMapIntensity" in std) std.envMapIntensity = 1;
//           });
//         });

//         setProgress(100);
//         setReady(true);
//       },
//       (e) => {
//         if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
//       },
//       (err) => {
//         console.error("[PerfumeScroll] could not load", modelUrl, err);
//         setReady(true); // don't trap the user behind the loader
//       }
//     );

//     // Sizing
//     const resize = () => {
//       const w = layer.clientWidth;
//       const h = layer.clientHeight;
//       renderer.setSize(w, h, false);
//       camera.aspect = w / h;
//       camera.updateProjectionMatrix();
//     };
//     resize();
//     const ro = new ResizeObserver(resize);
//     ro.observe(layer);

//     // Only render while the component is on screen
//     let visible = true;
//     const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting), { threshold: 0 });
//     io.observe(root);

//     const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

//     const render = (t: number, deltaMs: number) => {
//       if (!visible) return;
//       const dt = Math.min(deltaMs / 1000, 0.05);
//       const k = 1 - Math.exp(-dt * 6);
//       const { cur, target, intro } = anim.current;

//       (Object.keys(cur) as (keyof Pose)[]).forEach((p) => {
//         cur[p] += (target[p] - cur[p]) * k;
//       });

//       const w = layer.clientWidth;
//       const h = layer.clientHeight;
//       const mobile = w < 768;
//       const halfW = tanHalf * CAM_Z * (w / h);
//       const xMul = mobile ? 0 : 1;
//       const yAdd = mobile ? 1.0 : 0;
//       const sMul = mobile ? 0.62 : 1;

//       const scale = cur.s * sMul * (0.8 + 0.2 * intro.v);
//       const px = cur.x * halfW * xMul;
//       const py = cur.y + yAdd + Math.sin(t * 1.1) * 0.06 - (1 - intro.v) * 1.2;

//       pivot.position.set(px, py, 0);
//       pivot.scale.setScalar(scale);
//       pivot.rotation.set(cur.rx, cur.ry + (1 - intro.v) * Math.PI, cur.rz);
//       pivot.visible = intro.v > 0.001;

//       // shadow sits under the bottle
//       const bottom = py - (BOTTLE_HEIGHT / 2) * scale - 0.1;
//       shadow.position.set(px, bottom, -0.6);
//       shadow.scale.set(2.6 * scale, 0.5 * scale, 1);
//       (shadow.material as THREE.MeshBasicMaterial).opacity = intro.v * 0.9;

//       renderer.render(scene, camera);
//     };
//     gsap.ticker.add(render);

//     return () => {
//       disposed = true;
//       gsap.ticker.remove(render);
//       ro.disconnect();
//       io.disconnect();
//       draco.dispose();
//       scene.traverse((o) => {
//         const m = o as THREE.Mesh;
//         if (!m.isMesh) return;
//         m.geometry?.dispose();
//         const mats = Array.isArray(m.material) ? m.material : [m.material];
//         mats.forEach((mat) => {
//           Object.values(mat).forEach((v) => {
//             if (v && (v as THREE.Texture).isTexture) (v as THREE.Texture).dispose();
//           });
//           mat.dispose();
//         });
//       });
//       shadowTex.dispose();
//       envTex.dispose();
//       pmrem.dispose();
//       renderer.dispose();
//     };
//   }, [modelUrl]);

//   /* ------------------- smooth scroll + scroll choreography ------------------ */
//   useEffect(() => {
//     const root = rootRef.current;
//     if (!root) return;

//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     let lenis: Lenis | null = null;
//     let raf: ((t: number) => void) | null = null;
//     if (smoothScroll && !reduce) {
//       lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
//       lenis.on("scroll", ScrollTrigger.update);
//       raf = (t: number) => lenis?.raf(t * 1000);
//       gsap.ticker.add(raf);
//       gsap.ticker.lagSmoothing(0);
//     }

//     const ctx = gsap.context(() => {
//       const stages = gsap.utils.toArray<HTMLElement>("[data-stage]", root);
//       const { target } = anim.current;

//       stages.forEach((el, i) => {
//         // active stage → rail + label
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top 55%",
//           end: "bottom 55%",
//           onToggle: (self) => self.isActive && setStage(i),
//         });

//         if (i === 0) return;

//         const st = { trigger: el, start: "top bottom", end: "top 30%", scrub: true };

//         // bottle: previous pose → this pose
//         gsap.fromTo(target, { ...POSES[i - 1] }, { ...POSES[i], ease: "none", immediateRender: false, scrollTrigger: st });

//         // page colour: previous → this
//         gsap.fromTo(
//           root,
//           { backgroundColor: BG[i - 1] },
//           { backgroundColor: BG[i], ease: "none", immediateRender: false, scrollTrigger: st }
//         );
//       });

//       // Giant outlined words drift sideways while their section passes
//       gsap.utils.toArray<HTMLElement>("[data-drift]", root).forEach((el) => {
//         const d = Number(el.dataset.drift) || 10;
//         gsap.fromTo(
//           el,
//           { xPercent: -d },
//           {
//             xPercent: d,
//             ease: "none",
//             scrollTrigger: { trigger: el.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
//           }
//         );
//       });

//       // Headline word reveals
//       gsap.utils.toArray<HTMLElement>("[data-reveal]", root).forEach((el) => {
//         const words = el.querySelectorAll("[data-word]");
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top 88%",
//           once: true,
//           onEnter: () =>
//             gsap.fromTo(
//               words,
//               { yPercent: 110, opacity: 1 },
//               { yPercent: 0, opacity: 1, duration: reduce ? 0 : 1.1, ease: "power4.out", stagger: 0.06 }
//             ),
//         });
//       });

//       // Fade-ups
//       gsap.utils.toArray<HTMLElement>("[data-fade]", root).forEach((el) => {
//         ScrollTrigger.create({
//           trigger: el,
//           start: "top 90%",
//           once: true,
//           onEnter: () =>
//             gsap.fromTo(
//               el,
//               { opacity: 0, y: 28 },
//               { opacity: 1, y: 0, duration: reduce ? 0 : 0.9, ease: "power3.out" }
//             ),
//         });
//       });

//       // Note chips pop in
//       gsap.utils.toArray<HTMLElement>("[data-chips]", root).forEach((wrap) => {
//         const chips = wrap.querySelectorAll("[data-chip]");
//         ScrollTrigger.create({
//           trigger: wrap,
//           start: "top 92%",
//           once: true,
//           onEnter: () =>
//             gsap.fromTo(
//               chips,
//               { opacity: 0, y: 16, scale: 0.9 },
//               { opacity: 1, y: 0, scale: 1, duration: reduce ? 0 : 0.7, ease: "back.out(1.7)", stagger: 0.09 }
//             ),
//         });
//       });

//       // Top progress line
//       if (barRef.current) {
//         gsap.to(barRef.current, {
//           scaleX: 1,
//           ease: "none",
//           scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: true },
//         });
//       }
//     }, root);

//     return () => {
//       ctx.revert();
//       if (raf) gsap.ticker.remove(raf);
//       lenis?.destroy();
//     };
//   }, [smoothScroll]);

//   /* ------------------------------ hero intro ------------------------------ */
//   useEffect(() => {
//     if (!ready) return;
//     const root = rootRef.current;
//     if (!root) return;
//     const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ delay: 0.25 });
//       tl.to(anim.current.intro, { v: 1, duration: reduce ? 0 : 2, ease: "power3.out" }, 0)
//         .fromTo(
//           "[data-hero-word]",
//           { yPercent: 110, opacity: 1 },
//           { yPercent: 0, opacity: 1, duration: reduce ? 0 : 1.2, ease: "power4.out", stagger: 0.07 },
//           0.3
//         )
//         .fromTo(
//           "[data-hero-fade]",
//           { opacity: 0, y: 24 },
//           { opacity: 1, y: 0, duration: reduce ? 0 : 1, ease: "power3.out", stagger: 0.12 },
//           0.9
//         );
//     }, root);

//     ScrollTrigger.refresh();
//     const hide = setTimeout(() => setGone(true), 900);
//     return () => {
//       clearTimeout(hide);
//       ctx.revert();
//     };
//   }, [ready]);

//   /* --------------------------------- UI ----------------------------------- */

//   const stageWrap = "relative flex min-h-svh items-end pb-20 md:items-center md:pb-24";
//   const stageStyle = { paddingTop: headerOffset + 40 };
//   const grid = "relative z-20 mx-auto grid w-full max-w-[84rem] grid-cols-12 px-6 md:px-12";
//   const left = "col-span-12 md:col-span-6 lg:col-span-5";
//   const right = "col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8";
//   const h2 = "font-serif font-medium leading-[0.96] tracking-[-0.03em] text-[clamp(2.6rem,5.6vw,5rem)]";
//   const h2Note = "mt-4 font-serif font-medium leading-[0.98] tracking-[-0.03em] text-[clamp(2.3rem,4.6vw,4.2rem)]";
//   const eyebrow = "mb-5 flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.24em]";
//   const para = "mt-6 max-w-lg text-lg font-medium leading-relaxed text-[#2B1D12] md:text-xl";

//   return (
//     <div
//       ref={rootRef}
//       className={`relative isolate overflow-x-clip text-[#3B2A1C] ${className}`}
//       style={{ backgroundColor: BG[0] }}
//     >
//       {/* Loader */}
//       {!gone && (
//         <div
//           className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-[#F2EBDB] transition-opacity duration-700 ${
//             ready ? "pointer-events-none opacity-0" : "opacity-100"
//           }`}
//         >
//           <span className="font-serif text-3xl tracking-[0.35em]">TAAORA</span>
//           <div className="h-px w-40 overflow-hidden bg-[#3B2A1C]/15">
//             <div className="h-full bg-[#EDB92E] transition-[width] duration-300" style={{ width: `${progress}%` }} />
//           </div>
//         </div>
//       )}

//       {/* Sticky 3D layer: stays on screen (below the site header) while the stages scroll over it */}
//       <div
//         ref={layerRef}
//         className="pointer-events-none sticky z-10 w-full"
//         style={{
//           top: headerOffset,
//           height: `calc(100svh - ${headerOffset}px)`,
//           marginBottom: `calc(${headerOffset}px - 100svh)`,
//         }}
//       >
//         <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

//         {/* progress line */}
//         <div className="absolute inset-x-0 top-0 h-[3px] bg-[#3B2A1C]/10">
//           <div ref={barRef} className="h-full origin-left scale-x-0 bg-[#EDB92E]" />
//         </div>

//         {/* stage label */}
//         <div className="absolute bottom-6 left-6 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] md:flex md:left-12">
//           <span>{String(stage + 1).padStart(2, "0")} / {String(STAGE_LABELS.length).padStart(2, "0")}</span>
//           <span className="h-px w-10 bg-[#3B2A1C]/40" />
//           <span>{STAGE_LABELS[stage]}</span>
//         </div>

//         {/* rail */}
//         <div className="absolute right-5 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
//           {STAGE_LABELS.map((l, i) => (
//             <span
//               key={l}
//               className={`block h-2 w-2 rounded-full transition-all duration-500 ${
//                 i === stage ? "scale-150 bg-[#3B2A1C]" : "bg-[#3B2A1C]/30"
//               }`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* ------------------------------ 0 · HERO ------------------------------ */}
//       <section data-stage className={stageWrap} style={stageStyle}>
//         <GiantWord drift={6}>TAAORA</GiantWord>
//         <div className={grid}>
//           <div className={left}>
//             <p data-hero-fade className={`${eyebrow} opacity-0`}>
//               <span className="h-px w-8 bg-[#3B2A1C]/50" /> Eau de Parfum · 30% concentration
//             </p>
//             <h1 className="font-serif text-[clamp(2.7rem,5.6vw,5.2rem)] font-medium leading-[0.98] tracking-[-0.03em]">
//               <Words hero text="Wear a fragrance that becomes your presence." />
//             </h1>
//             <div data-hero-fade className="mt-9 flex flex-wrap items-center gap-5 opacity-0">
//               <Link
//                 href={shopHref}
//                 className="rounded-full bg-[#EDB92E] px-8 py-4 text-base font-semibold text-[#2B1D12] transition hover:scale-[1.03]"
//               >
//                 Discover Imperial Wood
//               </Link>
//               <span className="text-base">
//                 <span className="text-lg font-semibold">₹1,099</span>{" "}
//                 <span className="opacity-60 line-through">₹1,499</span>
//                 <span className="ml-2 rounded-full bg-[#3B2A1C]/12 px-2.5 py-1 text-xs font-semibold">27% off</span>
//               </span>
//             </div>
//           </div>
//         </div>
//         <div
//           data-hero-fade
//           className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] opacity-0 md:flex md:right-14"
//         >
//           Scroll <span className="h-8 w-px animate-pulse bg-[#3B2A1C]/50" />
//         </div>
//       </section>

//       {/* ------------------------------ 1 · STORY ----------------------------- */}
//       <section data-stage className={stageWrap} style={stageStyle}>
//         <GiantWord drift={12}>SINGULAR</GiantWord>
//         <div className={grid}>
//           <div className={right}>
//             <p className={eyebrow} data-fade style={{ opacity: 0 }}>
//               <span className="h-px w-8 bg-[#3B2A1C]/50" /> About Taaora
//             </p>
//             <h2 className={h2}>
//               <Words text="One presence. Not a shelf of options." />
//             </h2>
//             <p data-fade style={{ opacity: 0 }} className={para}>
//               A fragrance shouldn&rsquo;t compete for attention across a dozen bottles. It should be singular,
//               considered and unmistakably yours. We make one fragrance, and we intend it to be the only one you need.
//             </p>
//             <dl data-fade style={{ opacity: 0 }} className="mt-9 flex gap-12">
//               <div>
//                 <dt className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">Concentration</dt>
//                 <dd className="mt-1 font-serif text-4xl font-medium">30%</dd>
//               </div>
//               <div>
//                 <dt className="text-xs font-semibold uppercase tracking-[0.22em] opacity-70">Made in</dt>
//                 <dd className="mt-1 font-serif text-4xl font-medium">India</dd>
//               </div>
//             </dl>
//           </div>
//         </div>
//       </section>

//       {/* ----------------------------- 2–4 · NOTES ---------------------------- */}
//       {NOTES.map((n, i) => (
//         <section key={n.no} data-stage className={stageWrap} style={stageStyle}>
//           <GiantWord drift={i % 2 ? -12 : 12}>{n.word}</GiantWord>
//           <div className={grid}>
//             <div className={i % 2 === 0 ? left : right}>
//               <p className={eyebrow} data-fade style={{ opacity: 0 }}>
//                 <span className="h-px w-8 bg-[#3B2A1C]/50" /> Three notes, one presence
//               </p>
//               <div className="flex items-end gap-5">
//                 <span className="font-serif text-8xl font-medium leading-none text-[#D99A06] md:text-9xl">{n.no}</span>
//                 <span className="pb-3 text-sm font-semibold uppercase tracking-[0.3em]">{n.label}</span>
//               </div>
//               <h2 className={h2Note}>
//                 <Words text={n.title} />
//               </h2>
//               <p data-fade style={{ opacity: 0 }} className={para}>
//                 {n.body}
//               </p>
//               <ul data-chips className="mt-8 flex flex-wrap gap-3">
//                 {n.chips.map((c) => (
//                   <li
//                     key={c}
//                     data-chip
//                     style={{ opacity: 0 }}
//                     className="rounded-full border border-[#3B2A1C]/35 bg-white/70 px-5 py-2.5 text-base font-medium backdrop-blur-sm"
//                   >
//                     {c}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </section>
//       ))}

//       {/* ------------------------------ 5 · CTA ------------------------------- */}
//       <section data-stage className={stageWrap} style={stageStyle}>
//         <GiantWord drift={8}>IMPERIAL</GiantWord>
//         <div className={grid}>
//           <div className={right}>
//             <p className={eyebrow} data-fade style={{ opacity: 0 }}>
//               <span className="h-px w-8 bg-[#3B2A1C]/50" /> Limited-time offer
//             </p>
//             <h2 className={h2}>
//               <Words text="Make it your signature." />
//             </h2>
//             <p data-fade style={{ opacity: 0 }} className={para}>
//               Imperial Wood is ready when you are. Save ₹400 today: now{" "}
//               <span className="font-bold">₹1,099</span> instead of ₹1,499.
//             </p>
//             <div data-fade style={{ opacity: 0 }} className="mt-9 flex flex-wrap gap-4">
//               <Link
//                 href={shopHref}
//                 className="rounded-full bg-[#EDB92E] px-8 py-4 text-base font-semibold text-[#2B1D12] transition hover:scale-[1.03]"
//               >
//                 Shop Imperial Wood
//               </Link>
//               <a
//                 href={whatsappHref}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="rounded-full border-2 border-[#3B2A1C]/50 px-8 py-4 text-base font-semibold transition hover:bg-[#3B2A1C] hover:text-[#F2EBDB]"
//               >
//                 Chat on WhatsApp
//               </a>
//             </div>
//             <ul
//               data-fade
//               style={{ opacity: 0 }}
//               className="mt-12 grid grid-cols-2 gap-x-8 gap-y-5 text-base"
//             >
//               <li><span className="font-serif text-3xl font-medium">4.9</span> <span className="opacity-75">/ 5 rating</span></li>
//               <li><span className="font-serif text-3xl font-medium">500+</span> <span className="opacity-75">verified reviews</span></li>
//               <li><span className="font-serif text-3xl font-medium">24h</span> <span className="opacity-75">to ship</span></li>
//               <li><span className="font-serif text-3xl font-medium">3–5</span> <span className="opacity-75">days delivery</span></li>
//             </ul>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }