"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import { Star, ChevronDown } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { FormattedProduct } from "@/src/lib/shopify";
import TattooAdvisorModal from "./TattooAdvisorModal";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HeroCarouselProps {
  products: FormattedProduct[];
  activeIndex: number;
  onSlideChange: (index: number) => void;
}

interface CardData {
  id: string;
  title: string;
  handle: string;
  theme: string;
  price: string;
  badge: { label: string; color: string } | null;
  image: string;
}

// ─── Fallback Data ────────────────────────────────────────────────────────────
const FALLBACK_CARDS: CardData[] = [
  { id: "f1", title: "Celestial Serpent", handle: "celestial-serpent", theme: "Mystical", price: "$28", badge: { label: "NEW", color: "#FF7A00" }, image: "https://images.pexels.com/photos/2183130/pexels-photo-2183130.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f2", title: "Botanical Bloom", handle: "botanical-bloom", theme: "Floral", price: "$16", badge: null, image: "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f3", title: "Sacred Geometry", handle: "sacred-geometry", theme: "Minimalist", price: "$24", badge: { label: "EXCL", color: "#7C3AED" }, image: "https://images.pexels.com/photos/3651820/pexels-photo-3651820.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f4", title: "Ink Heritage", handle: "ink-heritage", theme: "Tribal", price: "$14", badge: null, image: "https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f5", title: "Dragon Soul", handle: "dragon-soul", theme: "Japanese", price: "$32", badge: { label: "HOT", color: "#EF4444" }, image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f6", title: "Lunar Phase", handle: "lunar-phase", theme: "Cosmic", price: "$20", badge: null, image: "https://images.pexels.com/photos/1070534/pexels-photo-1070534.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f7", title: "Obsidian Wave", handle: "obsidian-wave", theme: "Abstract", price: "$22", badge: { label: "SALE", color: "#FF7A00" }, image: "https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f8", title: "Crimson Koi", handle: "crimson-koi", theme: "Japanese", price: "$30", badge: null, image: "https://images.pexels.com/photos/2759483/pexels-photo-2759483.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const SPARKLE_PATH = "M12,2 L16,9 L21,9 L16,15 L18,21 L12,17 L6,21 L8,15 L3,9 L8,9 Z";
const BLOB_PATH = "M12,2 L17,4 L21,9 L21,14 L18,19 L13,22 L8,22 L4,19 L3,14 L7,4 Z";

const CARD_COUNT = 8;

// ─── Configuration & Math Helpers ─────────────────────────────────────────────
function getCfg(isMobile: boolean) {
  return isMobile
    ? { cardW: 168, cardH: 248, radius: 155, perspective: 820, rotSpeed: 0.022 }
    : { cardW: 240, cardH: 360, radius: 320, perspective: 1200, rotSpeed: 0.018 }; 
}

const FALL_STAGGER = 120;
const FALL_DUR = 900;
const EXPAND_START = 1800;
const EXPAND_DUR = 900;
const TILT_START = 2400;
const TILT_DUR = 900;
const SPIN_START = 2600;

function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeOutExpo(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function clamp01(t: number) { return Math.max(0, Math.min(1, t)); }
function progress(elapsed: number, start: number, dur: number) {
  return clamp01((elapsed - start) / dur);
}

function ringPos(angleRad: number, radius: number) {
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);
  const depth = (cosA + 1) / 2;
  return {
    x: sinA * radius,
    z: cosA * radius - radius,
    scale: 0.58 + depth * 0.42,
    opacity: 0.25 + depth * 0.75,
    brightness: 0.32 + depth * 0.72,
    blur: Math.max(0, (1 - depth) * 2.2),
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

// ─── Components ───────────────────────────────────────────────────────────────
function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={9}
          className={n <= rating ? "text-[#FF7A00] fill-[#FF7A00]" : "text-white/10 fill-white/10"}
        />
      ))}
    </div>
  );
}

function MorphingFAB({ isHovered, onHoverStart, onHoverEnd, onClick }: {
  isHovered: boolean; onHoverStart: () => void; onHoverEnd: () => void; onClick: () => void;
}) {
  return (
    <motion.button
      aria-label="Tattoo Advisor"
      onClick={onClick}
      className="relative z-50 flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FF7A00] text-black"
      style={{
        height: "52px",
        boxShadow: isHovered
          ? "0 0 56px rgba(255,122,0,0.85), 0 0 100px rgba(255,122,0,0.4)"
          : "0 0 22px rgba(255,122,0,0.38)",
      }}
      initial={{ opacity: 0, scale: 0, width: "52px" }}
      animate={{ opacity: 1, scale: 1, width: isHovered ? "190px" : "52px" }}
      transition={{ type: "spring", stiffness: 320, damping: 30 }}
      whileTap={{ scale: 0.91 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <motion.div
        className="flex flex-shrink-0 items-center justify-center"
        style={{ width: "52px", height: "52px" }}
        animate={{ rotate: isHovered ? 0 : 360 }}
        transition={isHovered ? { duration: 0.4, ease: "easeOut" } : { repeat: Infinity, duration: 9, ease: "linear" }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <motion.path
            fill="currentColor"
            animate={{ d: isHovered ? BLOB_PATH : SPARKLE_PATH }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          />
        </svg>
      </motion.div>
      <AnimatePresence>
        {isHovered && (
          <motion.span
            className="whitespace-nowrap pr-4 text-[9px] font-extrabold uppercase tracking-[0.15em] text-black"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -6 }}
            transition={{ duration: 0.2, delay: 0.12 }}
          >
            Tattoo Advisor
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function CardInner({ card, isMobile }: { card: CardData; isMobile: boolean }) {
  return (
    <div className="relative h-full w-full pointer-events-none">
      <Image src={card.image} alt={card.title} fill className="object-cover" sizes={isMobile ? "168px" : "280px"} draggable={false} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
      {card.badge && (
        <div className="absolute left-2 top-2 rounded-full px-2 py-[2px] text-[6.5px] font-bold tracking-[0.16em] text-white backdrop-blur-md"
          style={{ backgroundColor: `${card.badge.color}DD` }}>
          {card.badge.label}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-0.5 p-3">
        <span className="text-[6.5px] font-bold uppercase tracking-[0.24em] text-[#FF7A00]">{card.theme}</span>
        <p className="m-0 truncate font-bold leading-snug text-white" style={{ fontSize: isMobile ? "11px" : "12px" }}>{card.title}</p>
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <StarRating rating={5} />
          <span className="text-[9px] font-semibold text-white">{card.price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Core Cylinder Carousel ───────────────────────────────────────────────────
function CylinderCarousel({ cards, onSlideChange, reduceMotion, isMobile }: {
  cards: CardData[]; onSlideChange: (i: number) => void; reduceMotion: boolean; isMobile: boolean;
}) {
  const cfg = useMemo(() => getCfg(isMobile), [isMobile]);
  const stepDeg = 360 / CARD_COUNT;

  const cylinderRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const dragX = useMotionValue(0);
  const autoRotation = useRef(0);
  const isDragging = useRef(false);
  const mouseParallax = useRef({ x: 0, y: 0 });
  const lastActive = useRef(-1);

  const displayCards = useMemo(() => Array.from({ length: CARD_COUNT }, (_, i) => cards[i % cards.length]), [cards]);

  // Handle Wheel Scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      autoRotation.current += e.deltaY * 0.06;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Handle Parallax
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      mouseParallax.current = {
        x: (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  // Animation Loop
  useAnimationFrame((time, delta) => {
    const elapsed = reduceMotion ? time + SPIN_START + 5000 : time;
    const dt = Math.min(delta, 100);

    // 1. Calculate Rotation
    if (!isDragging.current && elapsed >= SPIN_START) {
      autoRotation.current += cfg.rotSpeed * dt;
    }
    
    const currentDragOffset = dragX.get() * (isMobile ? 0.38 : 0.28);
    const totalRotation = autoRotation.current - currentDragOffset;

    const fallFromY = isMobile ? -480 : -720;
    const fallRotZ = Array.from({ length: CARD_COUNT }, (_, i) => (i - CARD_COUNT / 2) * 3.0);

    // 2. Update Cards Style Directly
    cardRefs.current.forEach((el, i) => {
      if (!el) return;

      const fallStart = i * FALL_STAGGER;
      const fallEnd = fallStart + FALL_DUR;
      const t = clamp01((elapsed - fallStart) / FALL_DUR);
      const landed = elapsed >= fallEnd;

      if (!landed) {
        const te = easeOutExpo(t);
        const tRot = easeOutCubic(t);
        const currentY = fallFromY * (1 - te);
        const currentRotZ = fallRotZ[i] * (1 - tRot);
        
        el.style.transform = `translateY(${currentY}px) rotateZ(${currentRotZ}deg) scale(${0.82 + 0.18 * te})`;
        el.style.opacity = String(Math.min(1, t * 4));
        el.style.zIndex = String(100 - i);
        return;
      }

      const expandT = easeOutQuart(progress(elapsed, EXPAND_START, EXPAND_DUR));
      const cardBaseDeg = i * stepDeg;
      const finalDeg = cardBaseDeg - totalRotation;
      const finalRad = (finalDeg * Math.PI) / 180;
      const normRad = ((finalRad + Math.PI) % (2 * Math.PI)) - Math.PI;

      const ring = ringPos(normRad, cfg.radius * Math.max(expandT, 0.001));
      const stackZ = -(i * 1.5);

      if (elapsed < EXPAND_START) {
        el.style.transform = `translateX(0px) translateZ(${stackZ}px) scale(1)`;
        el.style.opacity = "1";
        el.style.zIndex = String(CARD_COUNT - i);
        return;
      }

      const currentX = ring.x * expandT;
      const currentZ = stackZ * (1 - expandT) + ring.z * expandT;

      el.style.transform = `translateX(${currentX}px) translateZ(${currentZ}px) scale(${ring.scale})`;
      el.style.opacity = String(0.25 + (ring.opacity - 0.25) * expandT + (1 - expandT) * 0.75);
      el.style.filter = `brightness(${ring.brightness}) blur(${ring.blur * expandT}px)`;
      el.style.zIndex = String(Math.round((currentZ + cfg.radius) * 10 + 1000));
    });

    // 3. Apply Tilt & Parallax to Container
    if (cylinderRef.current) {
      const tiltT = easeOutCubic(progress(elapsed, TILT_START, TILT_DUR));
      const tiltX = isMobile ? 0 : -13 * tiltT;
      const pxTilt = isMobile ? 0 : mouseParallax.current.y * 2.2;
      const pxShift = isMobile ? 0 : mouseParallax.current.x * 7;
      cylinderRef.current.style.transform = `rotateX(${tiltX + pxTilt}deg) translateX(${pxShift}px)`;
    }

    // 4. Update Active Index (Optimized with setTimeout to stop mobile layout engine lock-ups)
    if (elapsed >= SPIN_START) {
      const active = Math.round((((totalRotation % 360) + 360) % 360) / stepDeg) % CARD_COUNT;
      if (lastActive.current !== active) {
        lastActive.current = active;
        setTimeout(() => {
          onSlideChange(active);
        }, 0);
      }
    }
  });

  return (
    <motion.div
      ref={containerRef}
      className="relative flex h-full w-full cursor-grab items-center justify-center active:cursor-grabbing"
      style={{ touchAction: "pan-y" }} // Allows standard vertical page scrolling, captures horizontal gestures
      onPanStart={() => {
        isDragging.current = true;
      }}
      onPan={(e, info) => {
        // Updates the motion value tracking without shifting the visual container DOM element
        dragX.set(info.offset.x);
      }}
      onPanEnd={(e, info) => {
        isDragging.current = false;
        autoRotation.current -= info.offset.x * (isMobile ? 0.38 : 0.28);
        dragX.set(0);
      }}
    >
      <div className="flex h-full w-full items-center justify-center" style={{ perspective: `${cfg.perspective}px` }}>
        <div ref={cylinderRef} className="relative h-0 w-0" style={{ transformStyle: "preserve-3d" }}>
          {displayCards.map((card, i) => (
            <div
              key={`card-${i}`}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute overflow-hidden border border-white/10 shadow-xl will-change-transform"
              style={{
                width: `${cfg.cardW}px`,
                height: `${cfg.cardH}px`,
                left: `${-cfg.cardW / 2}px`,
                top: `${-cfg.cardH / 2}px`,
                borderRadius: isMobile ? "12px" : "16px",
                backfaceVisibility: "hidden",
                opacity: 0,
              }}
            >
              <CardInner card={card} isMobile={isMobile} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function HeroCarousel({ products, activeIndex, onSlideChange }: HeroCarouselProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const isMobile = useIsMobile();
  
  const [mounted, setMounted] = useState(false);
  const [isAdvisorOpen, setAdvisorOpen] = useState(false);
  const [fabHovered, setFabHovered] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setShowHint(true), SPIN_START + 400);
    return () => clearTimeout(t);
  }, [mounted]);

  const allCards: CardData[] = useMemo(() => {
    const len = Math.max(CARD_COUNT, products?.length ?? 0);
    return Array.from({ length: len }, (_, i) => {
      const p = products?.[i];
      if (!p) return FALLBACK_CARDS[i % FALLBACK_CARDS.length];
      return {
        id: p.id,
        title: p.title,
        handle: p.handle,
        theme: p.attributes?.themes?.[0] ?? p.attributes?.rawCollections?.[0] ?? "Design",
        price: `${p.checkout?.currency ?? "$"}${Math.round(p.checkout?.price ?? 0)}`,
        badge: p.styling?.badges?.[0] ?? null,
        image: p.media?.featuredImage ?? FALLBACK_CARDS[i % FALLBACK_CARDS.length].image,
      };
    });
  }, [products]);

  if (!mounted || isMobile === undefined) {
    return <div className="pointer-events-none relative flex h-full w-full flex-col justify-center bg-transparent" />;
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      
      <div className="relative min-h-0 w-full flex-1">
        <CylinderCarousel
          cards={allCards}
          onSlideChange={onSlideChange}
          reduceMotion={reduceMotion}
          isMobile={isMobile}
        />
      </div>

      <div className={`pointer-events-auto z-50 flex items-center gap-4 ${
          isMobile 
            ? "relative w-full justify-between px-4 pb-3 pt-2" 
            : "absolute bottom-6 right-8 justify-end"
      }`}>
        <AnimatePresence>
          {showHint && (
            <motion.div
              className={`flex ${isMobile ? "items-center gap-2" : "flex-col items-center gap-1"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isMobile ? [0, 0.55, 0] : 0.55 }}
              exit={{ opacity: 0 }}
              transition={isMobile ? { duration: 2.4, repeat: 3, ease: "easeInOut" } : { duration: 0.8 }}
            >
              {isMobile ? (
                <>
                  <svg width="16" height="12" viewBox="0 0 18 14" fill="none">
                    <path d="M7 1L1 7L7 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M11 1L17 7L11 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-white/40">Drag to spin</span>
                </>
              ) : (
                <>
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.28em] text-white/45">Drag or Scroll</span>
                  <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
                    <ChevronDown size={13} strokeWidth={2.5} className="text-white/45" />
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <MorphingFAB
          isHovered={fabHovered}
          onHoverStart={() => setFabHovered(true)}
          onHoverEnd={() => setFabHovered(false)}
          onClick={() => setAdvisorOpen(true)}
        />
      </div>

      <TattooAdvisorModal isOpen={isAdvisorOpen} onClose={() => setAdvisorOpen(false)} />
    </div>
  );
}