"use client";

import { motion, useReducedMotion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const DATA = [
  "/assets/hero/card1.png",
  "/assets/hero/card2.png",
  "/assets/hero/card3.png",
  "/assets/hero/card5.png",
  "/assets/hero/card6.png",
  "/assets/hero/card7.png",
  "/assets/hero/card8.png",
  "/assets/hero/card9.png",
];
const CAROUSEL_ITEMS = [...DATA, ...DATA];

const STATS = [
  { value: "50K+",    label: "Customers"  },
  { value: "14 Days", label: "Skin Wear"  },
  { value: "1000+",   label: "Designs"    },
  { value: "4.9★",   label: "Rating"     },
];

const MARQUEE = [
  "Premium Ink","✦","No Needles","✦","Up To 14 Days","✦",
  "Waterproof","✦","Skin Safe","✦","1000+ Designs","✦",
  "Premium Ink","✦","No Needles","✦","Up To 14 Days","✦",
  "Waterproof","✦","Skin Safe","✦","1000+ Designs","✦",
];

/* ─────────────────────────────────────────────────────────────
   LAYOUT STRATEGY
   ┌──────────────────────────────────┐  ← section h-[100dvh] relative
   │  [TOP OVERLAY z-20]              │     absolute top-0
   │    badges + headline + subtext   │
   │                                  │
   │  [CAROUSEL SCENE z-10]           │     absolute inset-0 (shifted down)
   │       3D rotating ring           │     centered via flex
   │                                  │
   │  [BOTTOM OVERLAY z-20]           │     absolute bottom-0
   │    marquee + CTA + stats         │
   └──────────────────────────────────┘
───────────────────────────────────────────────────────────── */

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,600;0,9..40,800;1,9..40,400&display=swap');

  /* ── Root tokens ──────────────────────────────────────────── */
  .hero-root {
    --accent:      #FF7A00;
    --accent-lt:   #FF9D3D;
    --accent-glow: rgba(255,122,0,0.28);
    --accent-dim:  rgba(255,122,0,0.09);
    /* Card size: big on every device */
    --cw: clamp(9rem, 20vw, 14rem);
    --ch-ratio: calc(10 / 6);                /* aspect 6:10 */
    --cgap: clamp(0.4rem, 0.6vw, 0.6rem);
    --persp: clamp(32rem, 52vw, 72rem);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Grain ────────────────────────────────────────────────── */
  .h-grain {
    position:absolute; inset:0; z-index:1; pointer-events:none;
    opacity:.3; mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size:200px 200px;
  }

  /* ── Atmospheric glow ─────────────────────────────────────── */
  .h-glow {
    position:absolute; inset:0; z-index:0; pointer-events:none;
    background:
      radial-gradient(ellipse 90% 50% at 50% 50%, rgba(255,122,0,0.09) 0%, transparent 68%),
      radial-gradient(ellipse 50% 35% at 50% 100%, rgba(255,122,0,0.07) 0%, transparent 65%),
      radial-gradient(ellipse 50% 35% at 50% 0%,   rgba(255,122,0,0.05) 0%, transparent 65%);
  }

  /* ── 3D Headline ─────────────────────────────────────────── */
  .h-title {
    font-family:'Bebas Neue',sans-serif;
    /* Reduced max font-size to prevent collision on PC */
    font-size: clamp(3rem, 7.5vw, 6rem);
    line-height:.87;
    letter-spacing:.01em;
    user-select:none;
  }
  .h-t1 {
    color:#fff;
    text-shadow:
      3px  3px 0 var(--accent),
      6px  6px 0 rgba(255,122,0,.5),
      10px 10px 0 rgba(255,122,0,.22),
      14px 14px 28px rgba(255,122,0,.15);
  }
  .h-t2 {
    color:var(--accent);
    text-shadow:
      3px  3px 0 #000,
      6px  6px 0 rgba(0,0,0,.55),
      0    0   55px rgba(255,122,0,.65);
  }
  .h-t3 {
    color:transparent;
    -webkit-text-stroke:2px rgba(255,255,255,.5);
    text-shadow:
      3px  3px 0 rgba(255,122,0,.8),
      6px  6px 0 rgba(255,122,0,.32),
      10px 10px 18px rgba(255,122,0,.18);
  }

  /* ── Badges ───────────────────────────────────────────────── */
  .h-badge {
    display:inline-flex; align-items:center; gap:.4rem;
    padding:.32rem .8rem;
    border-radius:9999px;
    font-size:clamp(.58rem,1.3vw,.7rem);
    font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
    border:1px solid;
  }
  .badge-fire { background:rgba(239,68,68,.1); color:#f87171; border-color:rgba(239,68,68,.28); }
  .badge-ship { background:rgba(34,197,94,.09); color:#4ade80; border-color:rgba(34,197,94,.28); }

  .pdot { position:relative; display:flex; width:6px; height:6px; flex-shrink:0; }
  .pdot::before {
    content:''; position:absolute; inset:0; border-radius:50%;
    background:#4ade80; opacity:.75;
    animation:pdPing 1.4s cubic-bezier(0,0,.2,1) infinite;
  }
  .pdot::after {
    content:''; position:relative; border-radius:50%;
    width:6px; height:6px; background:#22c55e;
  }
  @keyframes pdPing { 75%,100% { transform:scale(2.3); opacity:0; } }

  /* ── CAROUSEL SCENE ──────────────────────────────────────── */
  /* Shifted top slightly down to close the gap at bottom and allow header space */
  .h-scene {
    position:absolute; 
    top:clamp(2.5rem, 8vh, 6rem); left:0; right:0; bottom:0; 
    z-index:10;
    display:flex; align-items:center; justify-content:center;
    perspective:var(--persp);
    overflow:hidden;
    -webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 9%,#000 91%,transparent 100%);
    mask-image:         linear-gradient(90deg,transparent 0%,#000 9%,#000 91%,transparent 100%);
    pointer-events:none;
  }

  /* The ring: all cards stacked in grid-area 1/1, 3D-spread */
  .h-ring {
    display:grid; place-items:center;
    transform-style:preserve-3d;
    pointer-events:none;
  }

  .h-card {
    grid-area:1/1;
    position:relative;
    width:var(--cw);
    aspect-ratio:6/10;
    border-radius:clamp(.75rem,1.4vw,1.3rem);
    overflow:hidden;
    backface-visibility:hidden;
    -webkit-backface-visibility:hidden;
    box-shadow:
      0 6px 18px rgba(0,0,0,.55),
      0 24px 60px rgba(0,0,0,.75),
      0 0 0 1px rgba(255,255,255,.07),
      inset 0 1px 0 rgba(255,255,255,.13);
  }

  .h-shine {
    position:absolute; inset:0; z-index:2; pointer-events:none;
    background:linear-gradient(
      130deg,
      rgba(255,255,255,.1) 0%,
      rgba(255,255,255,.03) 35%,
      transparent 58%,
      rgba(0,0,0,.12) 100%
    );
  }

  /* ── TOP OVERLAY ─────────────────────────────────────────── */
  /* Sits in the dead space above the carousel ring */
  .h-top {
    position:absolute;
    top:0; left:0; right:0;
    z-index:20;
    display:flex; flex-direction:column; align-items:center;
    text-align:center;
    /* Added significant top padding specifically to clear the header */
    padding: clamp(5rem, 12vh, 7rem) clamp(1rem,5vw,3rem) 0;
    pointer-events:auto;
  }

  /* ── BOTTOM OVERLAY ──────────────────────────────────────── */
  /* Sits in the dead space below the carousel ring */
  .h-bot {
    position:absolute;
    bottom:0; left:0; right:0;
    z-index:20;
    display:flex; flex-direction:column; align-items:center;
    padding:0 clamp(1rem,5vw,3rem) clamp(.9rem,2.5vw,1.5rem);
    gap:clamp(.5rem,1.2vw,.9rem);
    pointer-events:auto;
  }

  /* ── CTA ─────────────────────────────────────────────────── */
  .h-cta {
    display:inline-flex; align-items:center; gap:.45rem;
    background:var(--accent); color:#000;
    font-family:'DM Sans',sans-serif;
    font-weight:800; text-transform:uppercase;
    letter-spacing:.12em;
    font-size:clamp(.72rem,1.7vw,.92rem);
    padding:clamp(.72rem,1.8vw,1rem) clamp(1.8rem,4.5vw,3rem);
    border-radius:9999px; text-decoration:none; position:relative;
    transition:transform .22s ease, box-shadow .22s ease;
    box-shadow:
      0 6px 22px var(--accent-glow),
      0 2px 4px rgba(0,0,0,.4),
      inset 0 1px 0 rgba(255,255,255,.35);
    overflow:hidden;
  }
  .h-cta::before {
    content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(130deg,rgba(255,255,255,.18) 0%,transparent 52%);
  }
  .h-cta:hover { transform:translateY(-3px) scale(1.04); box-shadow:0 14px 42px var(--accent-glow),0 4px 10px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.35); }
  .h-cta:active { transform:scale(.97); }
  .h-arrow { display:inline-block; transition:transform .2s; }
  .h-cta:hover .h-arrow { transform:translateX(4px); }

  /* ── Stats ───────────────────────────────────────────────── */
  .h-stats {
    display:flex; align-items:center; justify-content:center;
    gap:clamp(.7rem,2.5vw,1.5rem); flex-wrap:wrap; width:100%;
  }
  .h-stat { display:flex; flex-direction:column; align-items:center; }
  .h-sval {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(1.5rem,4vw,2.4rem);
    letter-spacing:.03em; color:#fff; line-height:1;
  }
  .h-slbl {
    font-size:clamp(.55rem,1.2vw,.68rem);
    color:rgba(255,255,255,.38);
    text-transform:uppercase; letter-spacing:.15em;
    font-weight:600; margin-top:.18rem;
  }
  .h-sep {
    width:1px; height:1.8rem;
    background:linear-gradient(to bottom,transparent,rgba(255,255,255,.18),transparent);
    flex-shrink:0;
  }

  /* ── Marquee ─────────────────────────────────────────────── */
  .h-mq-wrap { overflow:hidden; width:100%; }
  .h-mq-track {
    display:flex; width:max-content;
    animation:mScroll 16s linear infinite;
    gap:1.6rem;
  }
  @keyframes mScroll {
    from { transform:translateX(0); }
    to   { transform:translateX(-50%); }
  }
  .h-mq-item {
    font-family:'Bebas Neue',sans-serif;
    font-size:clamp(.68rem,1.3vw,.82rem);
    letter-spacing:.2em; color:rgba(255,255,255,.17);
    white-space:nowrap; flex-shrink:0;
  }
  .h-mq-dot { color:var(--accent); opacity:.45; }
`;

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */
export default function HeroCardCarousel() {
  const prefersReducedMotion = useReducedMotion();
  const N = CAROUSEL_ITEMS.length;

  /* Framer variants */
  const stagger: Variants = {
    hidden: {},
    show:   { transition: { staggerChildren: 0.1 } },
  };
  const up: Variants = {
    hidden:  { opacity: 0, y: 22 },
    show:    { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };
  const fadeIn: Variants = {
    hidden:  { opacity: 0 },
    show:    { opacity: 1, transition: { duration: 0.7, delay: 0.25 } },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/*
        SECTION = full viewport, no scroll, position:relative
        Everything inside is either absolute or doesn't overflow.
      */}
      <section
        className="hero-root relative w-full bg-black text-white overflow-hidden"
        style={{ height: "100dvh" }}
      >
        {/* ── Background atmosphere ── */}
        <div className="h-glow" />
        <div className="h-grain" />

        {/* ════════════════════════════════════════════════
            CAROUSEL SCENE
        ════════════════════════════════════════════════ */}
        <motion.div
          className="h-scene"
          variants={fadeIn}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="h-ring"
            animate={{ rotateY: [0, 360] }}
            transition={{
              duration: prefersReducedMotion ? 120 : 26,
              repeat:   Infinity,
              ease:     "linear",
            }}
          >
            {CAROUSEL_ITEMS.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="h-card"
                style={{
                  transform: `
                    rotateY(calc(${i} * 1turn / ${N}))
                    translateZ(calc(
                      -1 * (0.5 * var(--cw) + var(--cgap))
                         / tan(0.5 * 1turn / ${N})
                    ))
                  `,
                }}
              >
                <Image
                  src={src}
                  alt={`Showcase card ${(i % DATA.length) + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width:480px) 9rem, (max-width:768px) 11rem, 14rem"
                  priority={i < 7}
                />
                <div className="h-shine" />
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ════════════════════════════════════════════════
            TOP OVERLAY — dead zone above the rotating ring
        ════════════════════════════════════════════════ */}
        <motion.div
          className="h-top"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* 3D Staggered Headline */}
          <motion.h1
            variants={up}
            className="h-title uppercase w-full"
            style={{ marginBottom: "clamp(0.4rem,1vw,0.7rem)" }}
          >
            {/* Express Yourself grouped onto a single line */}
            <div 
              style={{ 
                display: "flex", 
                flexWrap: "wrap", 
                justifyContent: "center", 
                gap: "clamp(0.5rem, 1.5vw, 1.2rem)",
                transform: "translateX(clamp(-0.8rem,-2vw,-1.8rem))" 
              }}
            >
              <span className="h-t1">Express</span>
              <span className="h-t2">Yourself</span>
            </div>
            
            <span
              className="h-t3 block"
              style={{ transform: "translateX(clamp(0.8rem,2vw,1.8rem))" }}
            >
              Fearlessly.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={up}
            style={{
              fontSize: "clamp(0.72rem,1.6vw,0.9rem)",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "clamp(16rem,42vw,28rem)",
              lineHeight: 1.6,
            }}
          >
            Premium sticker tattoos that feel like real ink.{" "}
            <span style={{ color: "var(--accent-lt)", fontWeight: 600 }}>
              No needles. No commitment.
            </span>{" "}
            Up to 14 days on your skin.
          </motion.p>
        </motion.div>

        {/* ════════════════════════════════════════════════
            BOTTOM OVERLAY — dead zone below the rotating ring
        ════════════════════════════════════════════════ */}
        <motion.div
          className="h-bot"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Scrolling marquee */}
          <div className="h-mq-wrap">
            <div className="h-mq-track">
              {MARQUEE.map((item, i) => (
                <span
                  key={i}
                  className={`h-mq-item ${item === "✦" ? "h-mq-dot" : ""}`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* CTA button */}
          <Link href="/collections" className="h-cta">
            Shop the Collection
            <span className="h-arrow">→</span>
          </Link>

          {/* Stats */}
          <div className="h-stats">
            {STATS.map((s, idx) => (
              <div
                key={idx}
                style={{ display: "flex", alignItems: "center", gap: "clamp(.7rem,2.5vw,1.5rem)" }}
              >
                <div className="h-stat">
                  <span className="h-sval">{s.value}</span>
                  <span className="h-slbl">{s.label}</span>
                </div>
                {idx < STATS.length - 1 && <div className="h-sep" />}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </>
  );
}