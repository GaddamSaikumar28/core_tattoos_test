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

// ─── Masking text-reveal wrapper (Phase 1) ────────────────────────────────────
// overflow:hidden on the container acts as the clip mask.
// The child slides up from translateY(105%) to 0 with the specified cubic-bezier.
function RevealLine({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div style={{ overflow: "hidden", ...style }} className={className}>
      <motion.div
        initial={shouldReduceMotion ? {} : { y: "105%", opacity: 0 }}
        animate={{ y: "0%", opacity: 1 }}
        transition={{
          duration: 0.92,
          delay,
          ease: [0.19, 1, 0.22, 1], // fast buttery-smooth snap
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function HeroContent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="flex flex-col gap-5 lg:gap-6 relative z-20">

      {/* ── Badges ─────────────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-center gap-2"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.08, ease: [0.19, 1, 0.22, 1] }}
      >
        {/* Badge 1 — New Drop Live */}
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
            <Flame
              size={10}
              style={{
                color: "var(--color-brand-orange)",
                fill: "var(--color-brand-orange)",
              }}
            />
          </motion.div>
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "8px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--color-brand-orange)",
            }}
          >
            New Drop Live
          </span>
        </div>

        {/* Badge 2 — Free Shipping */}
        <div
          className="flex items-center gap-1.5 rounded-full px-3 py-[6px]"
          style={{
            border: "1px solid rgba(255,255,255,0.12)",
            backgroundColor: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* Pulsing live dot */}
          <motion.span
            className="inline-block rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#34d399",
              flexShrink: 0,
            }}
            animate={
              shouldReduceMotion ? {} : { opacity: [1, 0.3, 1], scale: [1, 0.82, 1] }
            }
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <span
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "8px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "var(--color-text-primary)",
            }}
          >
            Free Shipping $35+
          </span>
        </div>
      </motion.div>

      {/* ── Headline — Phase 1 Masking Text Reveal ─────────────────────────── */}
      {/* Each line slides up independently through its own overflow:hidden mask,
          staggered via the delay prop on RevealLine. */}
      <div className="flex flex-col" style={{ gap: 0 }}>
        <RevealLine delay={0.24}>
          <h3
            className="font-heading"
            style={{
              color: "var(--color-text-primary)",
              marginBottom: "-0.04em",
              fontSize: "clamp(2rem, 6vw + 1rem, 4.5rem)",
              lineHeight: 0.9,
            }}
          >
            Express
          </h3>
        </RevealLine>

        <RevealLine delay={0.37}>
          <h3
            className="font-heading"
            style={{
              color: "var(--color-brand-orange)",
              marginBottom: "-0.04em",
              fontSize: "clamp(2rem, 6vw + 1rem, 4.5rem)",
              lineHeight: 0.9,
            }}
          >
            Yourself
          </h3>
        </RevealLine>

        <RevealLine delay={0.5}>
          <h3
            className="font-heading"
            style={{
              color: "var(--color-brand-orange)",
              marginBottom: 0,
              fontSize: "clamp(2rem, 6vw + 1rem, 4.5rem)",
              lineHeight: 0.9,
            }}
          >
            Fearlessly.
          </h3>
        </RevealLine>
      </div>

      {/* ── Subtext ────────────────────────────────────────────────────────── */}
      <motion.p
        className="max-w-[380px]"
        style={{
          marginBottom: 0,
          lineHeight: 1.65,
          fontSize: "13px",
          color: "var(--color-text-secondary)",
        }}
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.64, ease: [0.19, 1, 0.22, 1] }}
      >
        Premium sticker tattoos that look and feel like real ink.{" "}
        <strong style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
          No needles. No commitment.
        </strong>{" "}
        Up to 14 days of breathtaking art on your skin.
      </motion.p>

      {/* ── CTA Button ─────────────────────────────────────────────────────── */}
      <motion.div
        className="pt-1"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.77, ease: [0.19, 1, 0.22, 1] }}
      >
        <Link
          href="/collections"
          className="inline-flex items-center gap-2 group rounded-full transition-all duration-300 hover:brightness-110"
          style={{
            backgroundColor: "var(--color-brand-orange)",
            color: "#FFFFFF",
            paddingTop: "0.8rem",
            paddingBottom: "0.8rem",
            paddingLeft: "1.6rem",
            paddingRight: "1.6rem",
            fontSize: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 800,
            boxShadow: "0 0 28px rgba(255,122,0,0.35)",
          }}
        >
          Shop the Collection
          <ArrowRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </motion.div>

      {/* ── Stats Row ──────────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-wrap items-start gap-x-8 gap-y-4 pt-5 mt-2"
        style={{ borderTop: "1px solid var(--color-border)" }}
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.94 }}
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            className="flex flex-col gap-0.5"
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.72,
              delay: 0.94 + i * 0.09,
              ease: [0.19, 1, 0.22, 1],
            }}
          >
            <span
              className="font-heading leading-none"
              style={{
                fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
                fontWeight: 800,
                marginBottom: "2px",
                textTransform: "uppercase",
                color: "var(--color-brand-orange)",
              }}
            >
              {stat.value}
            </span>
            <span
              style={{
                fontFamily: "var(--font-montserrat)",
                fontSize: "8px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.2em",
                color: "var(--color-text-secondary)",
              }}
            >
              {stat.label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}