"use client";

import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "14",   label: "Days Wear" },
  { value: "1000+",label: "Designs" },
  { value: "4.9",  label: "Avg Rating" },
];

function RevealLine({
  children,
  delay = 0,
  className = "",
  style = {},
  startAnimation,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  startAnimation: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  // FIX: Animation remains hidden until startAnimation flips true
  const initialVariants = shouldReduceMotion ? { opacity: 0 } : { y: "105%", opacity: 0 };
  const animateVariants = startAnimation 
    ? { y: "0%", opacity: 1 } 
    : initialVariants;

  return (
    <div style={{ overflow: "hidden", ...style }} className={className}>
      <motion.div
        initial={initialVariants}
        animate={animateVariants}
        transition={{
          duration: 0.92,
          delay: startAnimation ? delay : 0,
          ease: [0.19, 1, 0.22, 1], // fast buttery-smooth snap
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function HeroContent({ startAnimation }: { startAnimation: boolean }) {
  const shouldReduceMotion = useReducedMotion();

  // Reusable variant logic for general elements
  const initialY = shouldReduceMotion ? 0 : 14;
  
  return (
    <div className="flex flex-col gap-5 lg:gap-6 relative z-20">

      {/* ── Badges ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-center gap-2"
        initial={{ opacity: 0, y: initialY }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: initialY }}
        transition={{ duration: 0.6, delay: startAnimation ? 0.08 : 0, ease: [0.19, 1, 0.22, 1] }}
      >
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-[6px]"
          style={{
            border: "1px solid rgba(255,122,0,0.30)",
            backgroundColor: "rgba(255,122,0,0.08)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.div
            animate={shouldReduceMotion ? {} : { scale: [1, 1.28, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <Flame size={10} style={{ color: "var(--color-brand-orange)", fill: "var(--color-brand-orange)" }} />
          </motion.div>
          <span className="font-sans text-[8px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-brand-orange)]">
            New Drop Live
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-[6px]"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
          }}
        >
          <motion.span
            className="inline-block rounded-full w-[6px] h-[6px] bg-emerald-400 shrink-0"
            animate={shouldReduceMotion ? {} : { opacity: [1, 0.3, 1], scale: [1, 0.82, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <span className="font-sans text-[8px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-text-primary)]">
            Free Shipping $35+
          </span>
        </div>
      </motion.div>

      {/* ── Headline — Phase 1 Masking Text Reveal ─────────────────────────── */}
      <div className="flex flex-col gap-0">
        <RevealLine delay={0.24} startAnimation={startAnimation}>
          <h3 className="font-heading text-[var(--color-text-primary)] mb-[-0.04em] text-[clamp(2rem,6vw+1rem,4.5rem)] leading-[0.9]">
            Express
          </h3>
        </RevealLine>

        <RevealLine delay={0.37} startAnimation={startAnimation}>
          <h3 className="font-heading text-[var(--color-brand-orange)] mb-[-0.04em] text-[clamp(2rem,6vw+1rem,4.5rem)] leading-[0.9]">
            Yourself
          </h3>
        </RevealLine>

        <RevealLine delay={0.5} startAnimation={startAnimation}>
          <h3 className="font-heading text-[var(--color-brand-orange)] mb-0 text-[clamp(2rem,6vw+1rem,4.5rem)] leading-[0.9]">
            Fearlessly.
          </h3>
        </RevealLine>
      </div>

      {/* ── Subtext ────────────────────────────────────────────────────────── */}
      <motion.p
        className="max-w-[380px] mb-0 leading-[1.65] text-[13px] text-[var(--color-text-secondary)]"
        initial={{ opacity: 0, y: 12 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.8, delay: startAnimation ? 0.64 : 0, ease: [0.19, 1, 0.22, 1] }}
      >
        Premium sticker tattoos that look and feel like real ink.{" "}
        <strong className="font-semibold text-[var(--color-text-primary)]">
          No needles. No commitment.
        </strong>{" "}
        Up to 14 days of breathtaking art on your skin.
      </motion.p>

      {/* ── CTA Button ─────────────────────────────────────────────────────── */}
      <motion.div
        className="pt-1"
        initial={{ opacity: 0, y: 14 }}
        animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
        transition={{ duration: 0.8, delay: startAnimation ? 0.77 : 0, ease: [0.19, 1, 0.22, 1] }}
      >
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 group rounded-full transition-all duration-300 hover:brightness-110 bg-[var(--color-brand-orange)] text-white py-[0.8rem] px-[1.6rem] text-[10px] uppercase tracking-[0.15em] font-extrabold shadow-[0_0_28px_rgba(255,122,0,0.35)]"
        >
          Shop the Collection
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-5 mt-2 border-t border-[var(--color-border)]"
        initial={{ opacity: 0 }}
        animate={startAnimation ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: startAnimation ? 0.94 : 0 }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col gap-0.5"
            initial={{ opacity: 0, y: 12 }}
            animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: 0.72,
              delay: startAnimation ? 0.94 + i * 0.09 : 0,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <span className="font-heading leading-none text-[clamp(1.4rem,2.5vw,1.8rem)] font-extrabold mb-[2px] uppercase text-[var(--color-brand-orange)]">
              {stat.value}
            </span>
            <span className="font-sans text-[8px] font-bold uppercase tracking-[0.2em] text-[var(--color-text-secondary)]">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}