"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronDown } from "lucide-react";
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useReducedMotion,
  PanInfo,
} from "framer-motion";

import { FormattedProduct } from "@/src/lib/shopify";
import { Variants } from "framer-motion";
import TattooAdvisorModal from "./TattooAdvisorModal";
// ─── Types ─────────────────────────────────────────────────────────────────────
interface HeroCarouselProps {
  products: FormattedProduct[];
  activeIndex: number;
  onSlideChange: (index: number) => void;
}

// ─── Fallback card pool ────────────────────────────────────────────────────────
const FALLBACK_CARDS = [
  {
    id: "f1",
    title: "Celestial Serpent",
    handle: "celestial-serpent",
    theme: "Mystical",
    price: "$28",
    badge: { label: "NEW", color: "#FF7A00" },
    image:
      "https://images.pexels.com/photos/2183130/pexels-photo-2183130.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f2",
    title: "Botanical Bloom",
    handle: "botanical-bloom",
    theme: "Floral",
    price: "$16",
    badge: null,
    image:
      "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f3",
    title: "Sacred Geometry",
    handle: "sacred-geometry",
    theme: "Minimalist",
    price: "$24",
    badge: { label: "EXCLUSIVE", color: "#7C3AED" },
    image:
      "https://images.pexels.com/photos/3651820/pexels-photo-3651820.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f4",
    title: "Ink Heritage",
    handle: "ink-heritage",
    theme: "Tribal",
    price: "$14",
    badge: null,
    image:
      "https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f5",
    title: "Dragon Soul",
    handle: "dragon-soul",
    theme: "Japanese",
    price: "$32",
    badge: { label: "HOT", color: "#EF4444" },
    image:
      "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f6",
    title: "Lunar Phase",
    handle: "lunar-phase",
    theme: "Cosmic",
    price: "$20",
    badge: null,
    image:
      "https://images.pexels.com/photos/1070534/pexels-photo-1070534.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f7",
    title: "Obsidian Wave",
    handle: "obsidian-wave",
    theme: "Abstract",
    price: "$22",
    badge: { label: "SALE", color: "#FF7A00" },
    image:
      "https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    id: "f8",
    title: "Crimson Koi",
    handle: "crimson-koi",
    theme: "Japanese",
    price: "$30",
    badge: null,
    image:
      "https://images.pexels.com/photos/2759483/pexels-photo-2759483.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

// ─── Desktop fan-out slot positions ───────────────────────────────────────────
// Cards 1, 2, 3 fan out into foreground; Card 4 is visible to the right
const SLOTS = [
  {
    pos: { left: "0%", top: "0%" },
    width: "clamp(160px, 25vw, 210px)",
    rotate: -12,
    zIndex: 10,
  },
  {
    pos: { left: "22%", top: "5%" },
    width: "clamp(180px, 18vw, 240px)",
    rotate: -3,
    zIndex: 20,
  },
  {
    pos: { left: "45%", top: "10%" },
    width: "clamp(200px, 21vw, 290px)",
    rotate: 2,
    zIndex: 30,
  },
  {
    pos: { right: "0%", top: "5%" },
    width: "clamp(165px, 16vw, 220px)",
    rotate: 12,
    zIndex: 15,
  },
];

// ─── Mobile stacked layout ─────────────────────────────────────────────────────
// Card 1 fully visible; Cards 2 & 3 peek from underneath with offset/scale/opacity
const MOBILE_SLOTS = [
  { translateX: 0, translateY: 0, scale: 1, rotate: 0, zIndex: 30, opacity: 1 },
  {
    translateX: 10,
    translateY: 20,
    scale: 0.93,
    rotate: 3,
    zIndex: 20,
    opacity: 0.72,
  },
  {
    translateX: 18,
    translateY: 36,
    scale: 0.86,
    rotate: 6,
    zIndex: 10,
    opacity: 0.48,
  },
];

// ─── Depth-of-field ghost stack (behind Card 3 on desktop) ────────────────────
const GHOST_SLOTS = Array.from({ length: 8 }).map((_, i) => ({
  left: `calc(45% + ${i * 1.8}px)`,
  top: `calc(10% + ${i * 4}px)`,
  rotate: 2 + i * 1.4,
  scale: 1 - i * 0.04,
  opacity: Math.max(0, 0.22 - i * 0.022),
  blur: `${4 + i * 3.5}px`,
  blurHovered: `${8 + i * 5}px`,
  zIndex: 5 - i,
  width: "clamp(200px, 21vw, 290px)",
}));

// ─── SVG paths for FAB morphing: Sparkle ↔ Blob ───────────────────────────────
// Both use identical command structure: M + 9L + Z (10 vertices)
// so Framer Motion can interpolate between them.
const SPARKLE_PATH =
  "M12,2 L16,9 L21,9 L16,15 L18,21 L12,17 L6,21 L8,15 L3,9 L8,9 Z";
const BLOB_PATH =
  "M12,2 L17,4 L21,9 L21,14 L18,19 L13,22 L8,22 L4,19 L3,14 L7,4 Z";

// ─── Hook: reactive window width ──────────────────────────────────────────────
function useWindowWidth() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const update = () => setWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return width;
}

// ─── Star Rating ──────────────────────────────────────────────────────────────
function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={9}
          className={
            n <= rating
              ? "text-[#FF7A00] fill-[#FF7A00]"
              : "text-white/10 fill-white/10"
          }
        />
      ))}
    </div>
  );
}

// ─── SVG Morphing FAB ─────────────────────────────────────────────────────────
// Idle: slow-spinning sparkle icon
// Hover: morphs to organic blob + expands to show "Upload Your Design" CTA
function MorphingFAB({
  isHovered,
  onHoverStart,
  onHoverEnd,
  onClick,
}: {
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      aria-label="Tattoo Advisor"
      onClick={onClick}
      className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#FF7A00] text-black relative overflow-hidden"
      style={{
        height: "56px",
        boxShadow: isHovered
          ? "0 0 56px rgba(255,122,0,0.85), 0 0 100px rgba(255,122,0,0.4)"
          : "0 0 24px rgba(255,122,0,0.4)",
      }}
      animate={{ width: isHovered ? "200px" : "56px" }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileTap={{ scale: 0.91 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      {/* Icon container — idle slow spin, stops on hover */}
      <motion.div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: "56px", height: "56px" }}
        animate={{ rotate: isHovered ? 0 : 360 }}
        transition={
          isHovered
            ? { duration: 0.4, ease: "easeOut" }
            : { repeat: Infinity, duration: 9, ease: "linear" }
        }
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <motion.path
            fill="currentColor"
            animate={{ d: isHovered ? BLOB_PATH : SPARKLE_PATH }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          />
        </svg>
      </motion.div>

      {/* Expanded label — revealed on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="whitespace-nowrap pr-5 text-[9px] font-extrabold uppercase tracking-[0.15em] text-black"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.22, delay: 0.14 }}
          >
            Tattoo Advisor
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Desktop FloatingCard ─────────────────────────────────────────────────────
// Phase 1: Entrance deal animation
// Phase 2: Trigonometric floating (unique per card)
// Phase 3: Repulsion physics + glow pulsing
// Phase 4: Peel-off exit animation (swapDirection controls direction)
function FloatingCard({
  card,
  slot,
  index,
  isActive,
  isHovered,
  hoveredIndex,
  onHover,
  onLeave,
  enterDelay,
  shouldReduceMotion,
  swapDirection,
}: {
  card: any;
  slot: (typeof SLOTS)[number];
  index: number;
  isActive: boolean;
  isHovered: boolean;
  hoveredIndex: number | null;
  onHover: (i: number) => void;
  onLeave: () => void;
  enterDelay: number;
  shouldReduceMotion: boolean | null;
  swapDirection: number;
}) {
  // ── Phase 2: Trigonometric floating ────────────────────────────────────
  const floatY = useMotionValue(0);
  const floatX = useMotionValue(0);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);

  // Unique frequency/amplitude/phase per card for asynchronous floating
  const freq = 0.00085 + index * 0.00016;
  const ampY = 5.5 + index * 1.6;
  const ampX = 3 + index * 0.9;
  const ampRot = 0.55 + index * 0.16;
  const phaseOffset = (index / SLOTS.length) * Math.PI * 2;

  useEffect(() => {
    if (shouldReduceMotion) return;
    const tick = (ts: number) => {
      if (!startTimeRef.current) startTimeRef.current = ts;
      const t = ts - startTimeRef.current;
      floatY.set(Math.sin(t * freq + phaseOffset) * ampY);
      floatX.set(Math.cos(t * freq * 0.72 + phaseOffset) * ampX);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [shouldReduceMotion]);

  // ── Phase 3: Repulsion physics ──────────────────────────────────────────
  let repulseX = 0;
  let repulseRot = 0;
  if (hoveredIndex !== null && hoveredIndex !== index) {
    const dist = index - hoveredIndex;
    if (Math.abs(dist) === 1) {
      repulseX = dist * 22;
      repulseRot = dist * 5;
    } else if (Math.abs(dist) === 2) {
      repulseX = dist * 9;
      repulseRot = dist * 2.5;
    }
  }

  const isRepulsed = hoveredIndex !== null && hoveredIndex !== index;
  const hoverScale = isHovered ? 1.08 : isRepulsed ? 0.97 : 1;
  const hoverRotate = isHovered
    ? 0
    : slot.rotate + (hoveredIndex !== null ? repulseRot : 0);
  const hoverZ = isHovered ? 50 : isActive ? 45 : slot.zIndex;

  // ── Phase 2: Glow pulsing on active card (4s infinite loop) ────────────
  const glowVariants: Variants = {
    idle: {
      boxShadow: isActive
        ? "0 24px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,122,0,0.3)"
        : "0 12px 36px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06)",
    },
    pulse: {
      boxShadow: [
        "0 24px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,122,0,0.3), 0 0 32px rgba(255,122,0,0.12)",
        "0 24px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,122,0,0.55), 0 0 56px rgba(255,122,0,0.32)",
        "0 24px 48px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,122,0,0.3), 0 0 32px rgba(255,122,0,0.12)",
      ],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      className="absolute block group cursor-pointer will-change-transform"
      style={{
        ...slot.pos,
        width: slot.width,
        zIndex: hoverZ,
        x: floatX,
        y: floatY,
      }}
      // ── Phase 1: Entrance deal from bottom-right ────────────────────
      initial={
        shouldReduceMotion
          ? { opacity: 1, scale: 1, rotate: slot.rotate }
          : {
              opacity: 0,
              scale: 0.55,
              x: 240,
              y: 300,
              rotate: slot.rotate + 22,
            }
      }
      animate={{
        opacity: 1,
        scale: hoverScale,
        x: isHovered ? 0 : repulseX,
        y: 0,
        rotate: hoverRotate,
      }}
      // ── Phase 4: Peel-off exit animation ───────────────────────────
      exit={
        shouldReduceMotion
          ? { opacity: 0, transition: { duration: 0.2 } }
          : swapDirection > 0
            ? {
                // Forward: front card peels toward viewer (scale up + opacity 0)
                opacity: 0,
                scale: 1.65,
                y: -80,
                filter: "blur(8px)",
                transition: {
                  duration: 0.48,
                  ease: [0.36, 0, 0.66, -0.56],
                },
              }
            : {
                // Backward: card recedes to the back of the deck
                opacity: 0,
                scale: 0.45,
                y: 80,
                x: 60,
                transition: { duration: 0.38, ease: "easeIn" },
              }
      }
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : {
              opacity: { duration: 0.5, delay: enterDelay },
              scale: {
                type: "spring",
                stiffness: 175,
                damping: 22,
                delay: enterDelay,
              },
              x:
                isHovered || hoveredIndex !== null
                  ? { type: "spring", stiffness: 280, damping: 30 }
                  : {
                      type: "spring",
                      stiffness: 115,
                      damping: 18,
                      delay: enterDelay,
                    },
              y: {
                type: "spring",
                stiffness: 115,
                damping: 18,
                delay: enterDelay,
              },
              rotate: { type: "spring", stiffness: 210, damping: 26 },
            }
      }
      onHoverStart={() => onHover(index)}
      onHoverEnd={onLeave}
    >
      <Link href={`/products/${card.handle}`} className="block">
        {/* ── Phase 2: Glow pulse wrapper ──────────────────────────── */}
        <motion.div
          className="relative w-full aspect-[2/3] overflow-hidden rounded-[22px]"
          variants={glowVariants}
          animate={isActive ? "pulse" : "idle"}
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            priority={index < 3}
            className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.08]"
            sizes="(max-width: 1024px) 30vw, 20vw"
          />

          {/* ── Phase 3: Deep blur on non-focused cards during hover ── */}
          {hoveredIndex !== null && !isHovered && (
            <motion.div
              className="absolute inset-0 z-30 rounded-[22px]"
              initial={{
                backdropFilter: "blur(0px)",
                backgroundColor: "transparent",
              }}
              animate={{
                backdropFilter: `blur(${Math.abs(index - (hoveredIndex ?? 0)) * 3}px)`,
                backgroundColor: "rgba(0,0,0,0.18)",
              }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* ── Phase 3: Orange backdrop glow on hovered card ────────── */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 z-30 rounded-[22px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                background:
                  "radial-gradient(ellipse at center bottom, rgba(255,122,0,0.22) 0%, transparent 70%)",
              }}
            />
          )}

          {/* Badge — with glow pulse (Phase 2) */}
          {card.badge && (
            <div
              className="absolute left-3 top-3 z-20 rounded-full px-2.5 py-[3px] text-[7.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md"
              style={{
                backgroundColor: card.badge.color
                  ? `${card.badge.color}E0`
                  : "rgba(255,255,255,0.15)",
              }}
            >
              <motion.span
                animate={{
                  opacity: [1, 0.65, 1],
                  textShadow: [
                    `0 0 8px ${card.badge.color || "#FF7A00"}55`,
                    `0 0 22px ${card.badge.color || "#FF7A00"}99`,
                    `0 0 8px ${card.badge.color || "#FF7A00"}55`,
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block" }}
              >
                {card.badge.label}
              </motion.span>
            </div>
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/25 to-transparent z-10" />

          {/* Card info */}
          <div className="absolute inset-x-0 bottom-0 z-20 p-4 flex flex-col gap-1">
            <span className="text-[8px] font-extrabold uppercase tracking-[0.26em] text-[#FF7A00] drop-shadow-md">
              {card.theme}
            </span>
            <p className="text-[13px] font-bold leading-snug text-white tracking-wide truncate m-0 drop-shadow-md">
              {card.title}
            </p>
            <div className="flex items-center justify-between gap-1 pt-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <StarRating rating={5} />
              <span className="text-[11px] font-semibold text-white">
                {card.price}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// ─── Mobile Stacked Card ──────────────────────────────────────────────────────
// Slot 0 = front (fully visible), slots 1+2 = peeping from underneath
function MobileStackCard({
  card,
  slotIndex,
  enterDelay,
  shouldReduceMotion,
  swapDirection,
}: {
  card: any;
  slotIndex: number;
  enterDelay: number;
  shouldReduceMotion: boolean | null;
  swapDirection: number;
}) {
  const slot = MOBILE_SLOTS[Math.min(slotIndex, MOBILE_SLOTS.length - 1)];
  const isTop = slotIndex === 0;

  return (
    <motion.div
      className="absolute inset-x-0 cursor-pointer"
      style={{
        zIndex: slot.zIndex,
        transformOrigin: "bottom center",
        top: 0,
      }}
      initial={
        shouldReduceMotion
          ? {}
          : { opacity: 0, y: 80, scale: 0.8, rotate: slot.rotate }
      }
      animate={{
        opacity: slot.opacity,
        x: slot.translateX,
        y: slot.translateY,
        scale: slot.scale,
        rotate: slot.rotate,
      }}
      exit={
        shouldReduceMotion
          ? { opacity: 0 }
          : isTop
            ? swapDirection > 0
              ? {
                  // Peel toward viewer
                  opacity: 0,
                  scale: 1.5,
                  y: -90,
                  filter: "blur(6px)",
                  transition: { duration: 0.42, ease: [0.36, 0, 0.66, -0.56] },
                }
              : {
                  opacity: 0,
                  x: 120,
                  rotate: 20,
                  transition: { duration: 0.38, ease: "easeIn" },
                }
            : { opacity: 0, scale: 0.75, transition: { duration: 0.28 } }
      }
      transition={{
        type: "spring",
        stiffness: 180,
        damping: 26,
        delay: enterDelay,
      }}
    >
      <Link href={`/products/${card.handle}`} className="block">
        <div
          className="relative w-full aspect-[2/3] overflow-hidden rounded-[24px]"
          style={{
            boxShadow: isTop
              ? "0 28px 56px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,122,0,0.3)"
              : "0 8px 20px rgba(0,0,0,0.55)",
          }}
        >
          <Image
            src={card.image}
            alt={card.title}
            fill
            priority={slotIndex === 0}
            className="object-cover"
            sizes="80vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/25 to-transparent z-10" />

          {card.badge && isTop && (
            <div
              className="absolute left-3 top-3 z-20 rounded-full px-2.5 py-[3px] text-[7.5px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md"
              style={{ backgroundColor: `${card.badge.color}E0` }}
            >
              <motion.span
                animate={{ opacity: [1, 0.65, 1] }}
                transition={{ repeat: Infinity, duration: 4 }}
                style={{ display: "inline-block" }}
              >
                {card.badge.label}
              </motion.span>
            </div>
          )}

          {isTop && (
            <div className="absolute inset-x-0 bottom-0 z-20 p-4 flex flex-col gap-1">
              <span className="text-[8px] font-extrabold uppercase tracking-[0.26em] text-[#FF7A00] drop-shadow-md">
                {card.theme}
              </span>
              <p className="text-[13px] font-bold leading-snug text-white tracking-wide truncate m-0 drop-shadow-md">
                {card.title}
              </p>
              <div className="flex items-center justify-between gap-1 pt-1">
                <StarRating rating={5} />
                <span className="text-[11px] font-semibold text-white">
                  {card.price}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function HeroCarousel({
  products,
  activeIndex,
  onSlideChange,
}: HeroCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const windowWidth = useWindowWidth();
  // Wait for hydration (windowWidth === 0) before choosing layout
  const isMobile = windowWidth > 0 && windowWidth < 1024;
 const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  // ── Normalize card data from props or fallbacks ───────────────────────────
  const allCards = Array.from({
    length: Math.max(8, products?.length || 0),
  }).map((_, i) => {
    const p = products?.[i];
    if (!p) return FALLBACK_CARDS[i % FALLBACK_CARDS.length];
    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      theme:
        p.attributes?.themes?.[0] ||
        p.attributes?.rawCollections?.[0] ||
        "Design",
      price: `${p.checkout?.currency || "$"}${Math.round(
        p.checkout?.price || 0,
      )}`,
      badge: p.styling?.badges?.[0] || null,
      image:
        p.media?.featuredImage ||
        FALLBACK_CARDS[i % FALLBACK_CARDS.length].image,
    };
  });

  // ── Deck state ────────────────────────────────────────────────────────────
  const [deckStart, setDeckStart] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapDirection, setSwapDirection] = useState<number>(1);
  const [fabHovered, setFabHovered] = useState(false);

  // Desktop: 4 visible cards + ghost stack
  const visibleCards = Array.from({ length: 4 }).map(
    (_, i) => allCards[(deckStart + i) % allCards.length],
  );
  const ghostCards = Array.from({
    length: Math.min(4, allCards.length - 4),
  }).map((_, i) => allCards[(deckStart + 4 + i) % allCards.length]);

  // Mobile: 3 stacked cards
  const mobileCards = Array.from({ length: 3 }).map(
    (_, i) => allCards[(deckStart + i) % allCards.length],
  );

  // ── Swap trigger (shared between scroll and touch) ────────────────────────
  const triggerSwap = useCallback(
    (dir: number) => {
      if (isSwapping) return;
      setSwapDirection(dir);
      setIsSwapping(true);
      setDeckStart((prev) => (prev + dir + allCards.length) % allCards.length);
      onSlideChange(
        (deckStart + (dir > 0 ? 0 : allCards.length - 1)) % allCards.length,
      );
      setTimeout(() => setIsSwapping(false), 680);
    },
    [isSwapping, allCards.length, deckStart, onSlideChange],
  );

  // ── Phase 4 & 5: Scroll wheel handler (desktop only) ─────────────────────
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAccum = useRef(0);
  const marqueeResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      scrollAccum.current += e.deltaY;

      // Phase 5: Bind marquee speed to scroll velocity
      const velocity = Math.abs(e.deltaY);
      const speedMultiplier = Math.min(4.5, 1 + velocity / 55);
      const marqueeMs = Math.max(3.5, 22 / speedMultiplier);
      document.documentElement.style.setProperty(
        "--marquee-speed",
        `${marqueeMs}s`,
      );
      if (marqueeResetTimer.current) clearTimeout(marqueeResetTimer.current);
      marqueeResetTimer.current = setTimeout(() => {
        document.documentElement.style.setProperty("--marquee-speed", "22s");
      }, 320);

      const THRESHOLD = 80;
      if (Math.abs(scrollAccum.current) >= THRESHOLD) {
        const dir = scrollAccum.current > 0 ? 1 : -1;
        scrollAccum.current = 0;
        triggerSwap(dir);
      }
    },
    [triggerSwap],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isMobile) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel, isMobile]);

  // ── Mobile drag/pan handler ───────────────────────────────────────────────
  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      const { offset, velocity } = info;
      const swipeX = Math.abs(offset.x) > 55 || Math.abs(velocity.x) > 280;
      const swipeUp = offset.y < -55 || velocity.y < -280;

      if (swipeX) {
        // Horizontal swipe — left = advance, right = go back
        triggerSwap(offset.x < 0 ? 1 : -1);
      } else if (swipeUp) {
        // Upward swipe also advances
        triggerSwap(1);
      }
    },
    [triggerSwap],
  );

  // ── Phase 3: Cursor-tracking parallax (desktop only) ─────────────────────
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 60, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (shouldReduceMotion || isMobile) return;
    const onMouseMove = (e: MouseEvent) => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      rawRotateY.set(((e.clientX - cx) / (rect.width / 2)) * 6);
      rawRotateX.set(-((e.clientY - cy) / (rect.height / 2)) * 4);
    };
    const onMouseLeave = () => {
      rawRotateX.set(0);
      rawRotateY.set(0);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    const el = wrapperRef.current;
    el?.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      el?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [shouldReduceMotion, isMobile]);

  // ─── DESKTOP RENDER ──────────────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div
        ref={containerRef}
        className="flex h-full flex-col justify-between py-6 lg:py-0"
      >
        {/* Phase 3: 3D Tilt wrapper */}
        <motion.div
          ref={wrapperRef}
          className="relative flex-1 w-full overflow-visible select-none mt-4 lg:mt-6"
          style={{
            minHeight: "clamp(420px, 60vh, 600px)",
            rotateX: shouldReduceMotion ? 0 : rotateX,
            rotateY: shouldReduceMotion ? 0 : rotateY,
            transformStyle: "preserve-3d",
            perspective: 1200,
          }}
        >
          {/* Phase 2 & 3: Ghost depth-of-field stack (Cards 5–12) */}
          <AnimatePresence>
            {ghostCards.map((ghost, i) => {
              const g = GHOST_SLOTS[i];
              // Deep blur when any front card is hovered (Phase 3)
              const activeBlur = hoveredIndex !== null ? g.blurHovered : g.blur;
              return (
                <motion.div
                  key={`ghost-${ghost.id}-${deckStart}-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    left: g.left,
                    top: g.top,
                    width: g.width,
                    zIndex: g.zIndex,
                  }}
                  initial={{ opacity: 0, scale: g.scale * 0.75 }}
                  animate={{ opacity: g.opacity, scale: g.scale }}
                  exit={{ opacity: 0, scale: g.scale * 0.65 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    className="relative w-full aspect-[2/3] overflow-hidden rounded-[22px]"
                    style={{
                      transform: `rotate(${g.rotate}deg)`,
                      filter: `blur(${activeBlur})`,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
                      transition: "filter 0.4s ease",
                    }}
                  >
                    <Image
                      src={ghost.image}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="15vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-black/20" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Phase 1–4: Visible fan cards */}
          <AnimatePresence mode="popLayout">
            {visibleCards.map((card, i) => (
              <FloatingCard
                key={`${card.id}-${deckStart}-${i}`}
                card={card}
                slot={SLOTS[i]}
                index={i}
                isActive={activeIndex === i || hoveredIndex === i}
                isHovered={hoveredIndex === i}
                hoveredIndex={hoveredIndex}
                onHover={(idx) => {
                  setHoveredIndex(idx);
                  onSlideChange(idx);
                }}
                onLeave={() => setHoveredIndex(null)}
                enterDelay={shouldReduceMotion ? 0 : 0.28 + i * 0.13}
                shouldReduceMotion={shouldReduceMotion}
                swapDirection={swapDirection}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Phase 5: Controls row — scroll hint + SVG morphing FAB */}
        <div className="flex items-center justify-end gap-5 self-end pr-2 pb-4 lg:pb-0 lg:-mt-6 relative z-50">
          <motion.div
            className="flex flex-col items-center gap-1.5 cursor-default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <span className="text-[8px] font-bold uppercase tracking-[0.28em] text-white/50">
              Scroll to Shop
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
            >
              <ChevronDown
                size={14}
                strokeWidth={2.5}
                className="text-white/50"
              />
            </motion.div>
          </motion.div>

          {/* Phase 5: SVG Morphing FAB */}
          <MorphingFAB
            isHovered={fabHovered}
            onHoverStart={() => setFabHovered(true)}
            onHoverEnd={() => setFabHovered(false)}
            onClick={() => setIsAdvisorOpen(true)}
          />
          <TattooAdvisorModal isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
        </div>
      </div>
    );
  }

  // ─── MOBILE RENDER ───────────────────────────────────────────────────────
  // Stacked layout, touch/swipe gestures, no parallax
  return (
    <div className="flex h-full flex-col justify-between py-4 gap-4">
      {/* Drag-enabled card area */}
      <motion.div
        className="relative flex-1 w-full select-none mx-auto"
        style={{
          minHeight: "clamp(320px, 55vh, 500px)",
          maxWidth: "290px",
        }}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="popLayout">
          {mobileCards.map((card, i) => (
            <MobileStackCard
              key={`mobile-${card.id}-${deckStart}-${i}`}
              card={card}
              slotIndex={i}
              enterDelay={shouldReduceMotion ? 0 : i * 0.09}
              shouldReduceMotion={shouldReduceMotion}
              swapDirection={swapDirection}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Swipe hint + FAB row */}
      <div className="flex items-center justify-between px-2">
        <motion.div
          className="flex items-center gap-2"
          animate={{ opacity: [0.4, 0.75, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        >
          {/* Animated swipe arrows */}
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <motion.path
              d="M7 1L1 7L7 13"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M11 1L17 7L11 13"
              stroke="rgba(255,255,255,0.45)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white/40">
            Swipe to browse
          </span>
        </motion.div>

        <MorphingFAB
          isHovered={fabHovered}
          onHoverStart={() => setFabHovered(true)}
          onHoverEnd={() => setFabHovered(false)}
          onClick={() => setIsAdvisorOpen(true)}
        />
      </div>
    </div>
  );
}
