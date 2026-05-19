"use client";

import { motion } from "framer-motion";

// ─── Marquee items ────────────────────────────────────────────────────────────
const ITEMS = [
  "Plant-Based",  "No Pain",     "Realistic Ink", "Cruelty Free",
  "Metallic Finish", "Easy Apply", "1000+ Designs", "14-Day Wear",
  "Waterproof",   "Non-Toxic",   "Vegan Formula", "Kid Safe",
];

// ─── Separator dot with orange glow pulse (Phase 2) ───────────────────────────
function Dot() {
  return (
    <motion.span
      className="inline-block rounded-full flex-shrink-0 mx-[24px]"
      style={{
        width: "4px",
        height: "4px",
        backgroundColor: "var(--color-brand-orange)",
        verticalAlign: "middle",
      }}
      animate={{
        boxShadow: [
          "0 0 4px rgba(255,122,0,0.3)",
          "0 0 12px rgba(255,122,0,0.7)",
          "0 0 4px rgba(255,122,0,0.3)",
        ],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
    />
  );
}

// ─── Marquee item with hover lift ─────────────────────────────────────────────
function MarqueeItem({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center">
      <motion.span
        style={{
          fontFamily: "var(--font-montserrat)",
          fontSize: "9px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.24em",
          color: "var(--color-text-secondary)",
          cursor: "default",
          display: "inline-block",
        }}
        whileHover={{ color: "var(--color-brand-orange)", y: -1 }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.span>
      <Dot />
    </span>
  );
}

// ─── HeroMarquee ──────────────────────────────────────────────────────────────
// Phase 5: The strip scrolls via the animate-marquee CSS class.
// Its speed is controlled by --marquee-speed CSS var, which HeroCarousel's
// scroll handler sets dynamically (faster scroll = faster marquee).
// Fallback speed: 22s (set as default in globals.css / style below).
export default function HeroMarquee() {
  return (
    <motion.div
      className="relative w-full overflow-hidden z-20"
      style={{
        borderTop: "1px solid var(--color-border)",
        backgroundColor: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(16px)",
        paddingTop: "12px",
        paddingBottom: "12px",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.85, ease: [0.19, 1, 0.22, 1] }}
    >
      {/* Left edge fade */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10"
        style={{
          width: "100px",
          background:
            "linear-gradient(to right, var(--color-bg-base), transparent)",
        }}
      />
      {/* Right edge fade */}
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10"
        style={{
          width: "100px",
          background:
            "linear-gradient(to left, var(--color-bg-base), transparent)",
        }}
      />

      {/*
        animate-marquee is defined in globals.css as an infinite translateX loop.
        We override its animationDuration via the --marquee-speed CSS var,
        which HeroCarousel's wheel handler updates on-the-fly.
        Fallback: 22s.
      */}
      <div
        className="animate-marquee flex w-max items-center whitespace-nowrap"
        style={{
          willChange: "transform",
          animationDuration: "var(--marquee-speed, 22s)",
        }}
      >
        {/* Strip 1 */}
        {ITEMS.map((item, i) => (
          <MarqueeItem key={`a-${i}`} label={item} />
        ))}
        {/* Strip 2 — seamless loop duplicate */}
        {ITEMS.map((item, i) => (
          <MarqueeItem key={`b-${i}`} label={item} />
        ))}
      </div>
    </motion.div>
  );
}