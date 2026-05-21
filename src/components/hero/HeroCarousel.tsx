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
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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

type Phase = "fall" | "expand" | "tilt" | "rotate";

// ─── Fallback card pool ───────────────────────────────────────────────────────
const FALLBACK_CARDS: CardData[] = [
  { id: "f1", title: "Celestial Serpent", handle: "celestial-serpent", theme: "Mystical",    price: "$28", badge: { label: "NEW",  color: "#FF7A00" }, image: "https://images.pexels.com/photos/2183130/pexels-photo-2183130.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f2", title: "Botanical Bloom",   handle: "botanical-bloom",   theme: "Floral",      price: "$16", badge: null,                               image: "https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f3", title: "Sacred Geometry",   handle: "sacred-geometry",   theme: "Minimalist",  price: "$24", badge: { label: "EXCL", color: "#7C3AED" }, image: "https://images.pexels.com/photos/3651820/pexels-photo-3651820.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f4", title: "Ink Heritage",      handle: "ink-heritage",      theme: "Tribal",      price: "$14", badge: null,                               image: "https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f5", title: "Dragon Soul",       handle: "dragon-soul",       theme: "Japanese",    price: "$32", badge: { label: "HOT",  color: "#EF4444" }, image: "https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f6", title: "Lunar Phase",       handle: "lunar-phase",       theme: "Cosmic",      price: "$20", badge: null,                               image: "https://images.pexels.com/photos/1070534/pexels-photo-1070534.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f7", title: "Obsidian Wave",     handle: "obsidian-wave",     theme: "Abstract",    price: "$22", badge: { label: "SALE", color: "#FF7A00" }, image: "https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id: "f8", title: "Crimson Koi",       handle: "crimson-koi",       theme: "Japanese",    price: "$30", badge: null,                               image: "https://images.pexels.com/photos/2759483/pexels-photo-2759483.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const SPARKLE_PATH = "M12,2 L16,9 L21,9 L16,15 L18,21 L12,17 L6,21 L8,15 L3,9 L8,9 Z";
const BLOB_PATH    = "M12,2 L17,4 L21,9 L21,14 L18,19 L13,22 L8,22 L4,19 L3,14 L7,4 Z";

function useWindowWidth() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth);
    fn();
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return width;
}

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={9} className={n <= rating ? "text-[#FF7A00] fill-[#FF7A00]" : "text-white/10 fill-white/10"} />
      ))}
    </div>
  );
}

function MorphingFAB({ isHovered, onHoverStart, onHoverEnd, onClick }: {
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}) {
  return (
    <motion.button
      aria-label="Tattoo Advisor"
      onClick={onClick}
      className="flex-shrink-0 flex items-center justify-center rounded-full bg-[#FF7A00] text-black relative overflow-hidden z-50"
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
        className="flex-shrink-0 flex items-center justify-center"
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

// ─── Config ───────────────────────────────────────────────────────────────────
const CARD_COUNT = 8;

interface CarouselConfig {
  cardW: number;
  cardH: number;
  radius: number;
  perspective: number;
  rotSpeed: number;
}

function getCfg(isMobile: boolean): CarouselConfig {
  if (isMobile) {
    // Tighter dimensions to fit securely within a 375px mobile viewport
    return { cardW: 150, cardH: 210, radius: 135, perspective: 900,  rotSpeed: 0.02 };
  }
  return   { cardW: 250, cardH: 400, radius: 380, perspective: 1200, rotSpeed: 0.02 };
}

// Sequence Timings
const T_EXPAND = 1800; // Start expanding after final card bounces
const T_TILT   = 2800; // Start backwards tilt
const T_ROTATE = 3600; // Begin continuous rotation

function ringTransform(angleRad: number, radius: number) {
  const cosA = Math.cos(angleRad);
  const sinA = Math.sin(angleRad);
  const x    = sinA * radius;
  const z    = cosA * radius - radius;
  const depth = (cosA + 1) / 2;
  const scale      = 0.55 + depth * 0.45;
  const opacity    = 0.22 + depth * 0.78;
  const brightness = 0.30 + depth * 0.75;
  const blur       = Math.max(0, (1 - depth) * 2.5);
  return { x, z, scale, opacity, brightness, blur };
}

const CSS_ID = "hero-carousel-styles";
function injectCarouselCSS() {
  if (typeof document === "undefined") return;
  if (document.getElementById(CSS_ID)) return;
  const el = document.createElement("style");
  el.id = CSS_ID;
  el.textContent = `
    @keyframes cardFall {
      0%   { transform: translateY(var(--fall-from)) rotateZ(var(--fall-rotZ)) scale(0.85); opacity: 0; }
      15%  { opacity: 1; }
      70%  { transform: translateY(12px) rotateZ(calc(var(--fall-rotZ) * 0.15)) scale(1.05); }
      85%  { transform: translateY(-4px) rotateZ(0deg) scale(0.98); }
      100% { transform: translateY(0px) translateZ(var(--stack-z-offset, 0px)) rotateZ(0deg) scale(1); }
    }
    @keyframes glintSweep {
      0%   { transform: translateX(-140%) skewX(-18deg); }
      100% { transform: translateX(260%) skewX(-18deg); }
    }
    .card-glint::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.18) 50%, transparent 60%);
      animation: glintSweep 3.8s ease-in-out infinite;
      animation-delay: 1.2s;
      pointer-events: none;
      border-radius: inherit;
    }
    @keyframes rippleExpand {
      0%   { transform: scale(0.1); opacity: 0.7; }
      100% { transform: scale(6);   opacity: 0; }
    }
    .expand-ripple {
      animation: rippleExpand 1.1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
  `;
  document.head.appendChild(el);
}

function CylinderCarousel({
  cards, onSlideChange, shouldReduceMotion, isMobile,
}: {
  cards: CardData[]; onSlideChange: (i: number) => void; shouldReduceMotion: boolean | null; isMobile: boolean;
}) {
  const cfg = getCfg(isMobile);

  const [phase, setPhase] = useState<Phase>(shouldReduceMotion ? "rotate" : "fall");
  const [logoVisible, setLogoVisible] = useState(false);
  const [showRipple, setShowRipple] = useState(false);

  const rotAngleRef    = useRef(0);
  const cylinderRef    = useRef<HTMLDivElement>(null);
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef   = useRef<HTMLDivElement>(null);
  const rafRef         = useRef<number>(0);
  const isDragging     = useRef(false);
  const dragStartX     = useRef(0);
  const dragStartAng   = useRef(0);
  const mouseParallax  = useRef({ x: 0, y: 0 });
  const phaseRef       = useRef<Phase>(shouldReduceMotion ? "rotate" : "fall");

  // Track animation start times for pure RAF interpolation
  const expandStartRef = useRef<number | null>(null);
  const tiltStartRef   = useRef<number | null>(null);

  useEffect(() => { phaseRef.current = phase; }, [phase]);

  const displayCards = useMemo(
    () => Array.from({ length: CARD_COUNT }, (_, i) => cards[i % cards.length]),
    [cards]
  );

  useEffect(() => { injectCarouselCSS(); }, []);

  // Timeline orchestrator
  useEffect(() => {
    if (shouldReduceMotion) {
      setPhase("rotate");
      setLogoVisible(true);
      return;
    }
    const t1 = setTimeout(() => { setPhase("expand"); setShowRipple(true); setTimeout(() => setShowRipple(false), 1200); }, T_EXPAND);
    const t2 = setTimeout(() => { setPhase("tilt"); }, T_TILT);
    const t3 = setTimeout(() => { setPhase("rotate"); setLogoVisible(true); }, T_ROTATE);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [shouldReduceMotion]);

  // Unified Physics / DOM Loop
  useEffect(() => {
    const stepDeg = 360 / CARD_COUNT;
    
    const loop = (ts: number) => {
      const currentPhase = phaseRef.current;
      
      // Calculate active progression multipliers
      let rMult = 1; // Radius multiplier (0 to 1)
      let currentTilt = 0; // Cylinder X tilt

      if (currentPhase === "fall") {
         rafRef.current = requestAnimationFrame(loop);
         return; // Let CSS keyframes do the work
      }

      // Expansion phase math
      if (currentPhase === "expand" || currentPhase === "tilt" || currentPhase === "rotate") {
        if (!expandStartRef.current) expandStartRef.current = ts;
        const pct = Math.min(1, (ts - expandStartRef.current) / 900);
        rMult = 1 - Math.pow(1 - pct, 4); // easeOutQuart
      }

      // Tilt phase math
      if (currentPhase === "tilt" || currentPhase === "rotate") {
        if (!tiltStartRef.current) tiltStartRef.current = ts;
        const pct = Math.min(1, (ts - tiltStartRef.current) / 1000);
        const ease = 1 - Math.pow(1 - pct, 3); // easeOutCubic
        currentTilt = -13 * ease;
      }

      // Rotate phase math
      if (!isDragging.current && currentPhase === "rotate") {
        // Delta time fallback isn't needed if we use constant increment, 
        // but can be added if framerate drops are severe.
        rotAngleRef.current += cfg.rotSpeed * 16.6; 
      }

      // Apply Parallax and Tilt to Cylinder
      const pxTilt = isMobile ? 0 : mouseParallax.current.y * 2.5;
      const pxShift = isMobile ? 0 : mouseParallax.current.x * 8;
      
      if (cylinderRef.current) {
        const totalTiltX = currentTilt + pxTilt;
        cylinderRef.current.style.transform = `rotateX(${totalTiltX}deg) translateX(${pxShift}px)`;
      }

      // Apply Matrix to Cards
      let frontIdx = -1;
      let frontDepth = -Infinity;
      const activeRadius = cfg.radius * rMult;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const stackZ = -(i * 1.5);
        const cardBaseDeg = i * stepDeg;
        const finalDeg = cardBaseDeg - rotAngleRef.current;
        const finalRad = (finalDeg * Math.PI) / 180;
        const normRad = ((finalRad + Math.PI) % (2 * Math.PI)) - Math.PI;
        
        const { x, z, scale, opacity, brightness, blur } = ringTransform(normRad, activeRadius);

        // Interpolate between stack position and ring position
        const currentX = x * rMult;
        const currentZ = (1 - rMult) * stackZ + (rMult) * z;

        el.style.transform = `translateX(${currentX}px) translateZ(${currentZ}px) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.filter = `brightness(${brightness}) blur(${blur}px)`;
        el.style.zIndex = String(Math.round((currentZ + cfg.radius) * 10));

        const cosA = Math.cos(normRad);
        const depth = (cosA + 1) / 2;
        if (depth > frontDepth) { frontDepth = depth; frontIdx = i; }
      });

      // Update Active Card Index natively
      const activeCard = Math.round((((rotAngleRef.current % 360) + 360) % 360) / stepDeg) % CARD_COUNT;
      onSlideChange(activeCard);

      // Handle Glint Target
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const isFront = i === frontIdx;
        const glintEl = el.querySelector(".card-glint-inner") as HTMLElement | null;
        if (glintEl) {
          glintEl.className = `card-glint-inner absolute inset-0 rounded-[inherit] overflow-hidden ${isFront ? "card-glint" : ""}`;
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); };
  }, [phase, cfg.radius, cfg.rotSpeed, isMobile, onSlideChange]);

  // Scroll to spin
  useEffect(() => {
    if (phase !== "rotate") return;
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      rotAngleRef.current += e.deltaY * 0.07;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [phase]);

  // Desktop Mouse Parallax
  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mouseParallax.current = { x: (e.clientX - cx) / cx, y: (e.clientY - cy) / cy };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  // Drag Interactions
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (phaseRef.current !== "rotate") return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartAng.current = rotAngleRef.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    rotAngleRef.current = dragStartAng.current - dx * 0.28;
  }, []);

  const onPointerUp = useCallback(() => { isDragging.current = false; }, []);

  const isInFall = phase === "fall";
  const fallFrom = isMobile ? "-110vh" : "-140vh";

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-center select-none"
      style={{ cursor: phase === "rotate" ? "grab" : "default" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* ── Phase Label ── */}
      <div className="absolute left-1/2 -translate-x-1/2 z-50 pointer-events-none text-center" style={{ top: isMobile ? "0px" : "12px" }}>
        <AnimatePresence mode="wait">
          {isInFall ? (
            <motion.p
              key="fall-label"
              className="text-white/60 font-extrabold uppercase tracking-[0.4em]"
              style={{ fontSize: isMobile ? "8px" : "10px" }}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.4 }}
            >
              WELCOME TO
            </motion.p>
          ) : (
            <motion.p
              key="rot-label"
              className="font-extrabold uppercase tracking-[0.3em] text-transparent bg-clip-text"
              style={{
                fontSize: isMobile ? "9px" : "11px",
                backgroundImage: "linear-gradient(90deg,#fff 0%,#FF7A00 50%,#fff 100%)",
              }}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              Unleash Your Style
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Expand Ripple Ring ── */}
      {showRipple && (
        <div
          className="absolute pointer-events-none z-40"
          style={{ width: `${cfg.cardW}px`, height: `${cfg.cardH}px`, borderRadius: "16px", border: "2px solid rgba(255,122,0,0.55)" }}
        >
          <div className="expand-ripple absolute inset-0 rounded-[inherit] border border-[rgba(255,122,0,0.4)]" />
        </div>
      )}

      {/* ── 3D Stage ── */}
      <div
        style={{
          width: "100%", height: "100%",
          perspective: `${cfg.perspective}px`,
          perspectiveOrigin: "50% 50%",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {/* CRITICAL FIX: cylinder wrapper is 0px by 0px.
            This ensures cards perfectly center no matter what dimensions the parent has. 
        */}
        <div ref={cylinderRef} style={{ position: "relative", width: "0px", height: "0px", transformStyle: "preserve-3d" }}>
          {displayCards.map((card, i) => {
            const stackZ = -(i * 1.5);
            const delay = i * 140; // Staggered drop

            return (
              <div
                key={`${card.id}-${i}`}
                ref={(el) => { cardRefs.current[i] = el; }}
                style={{
                  position: "absolute",
                  width: `${cfg.cardW}px`,
                  height: `${cfg.cardH}px`,
                  left: `${-cfg.cardW / 2}px`, // Anchored perfectly to the 0,0 center
                  top: `${-cfg.cardH / 2}px`,
                  borderRadius: isMobile ? "12px" : "16px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.12)",
                  willChange: "transform, opacity, filter",
                  backfaceVisibility: "hidden",
                  "--fall-from": fallFrom,
                  "--fall-rotZ": `${(i - CARD_COUNT / 2) * 3.5}deg`,
                  "--stack-z-offset": `${stackZ}px`,
                  animation: isInFall && !shouldReduceMotion
                    ? `cardFall 1.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms both`
                    : "none",
                  opacity: shouldReduceMotion ? 1 : undefined,
                } as React.CSSProperties}
              >
                <div className="relative w-full h-full">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    priority={i < 3}
                    className="object-cover"
                    sizes={isMobile ? "160px" : "210px"}
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)" }} />
                  <div className="card-glint-inner absolute inset-0 rounded-[inherit] overflow-hidden" />

                  {card.badge && (
                    <div className="absolute left-2 top-2 rounded-full px-2 py-[2px]" style={{ backgroundColor: `${card.badge.color}DD`, fontSize: "6.5px", fontWeight: 700, letterSpacing: "0.16em", color: "white", backdropFilter: "blur(6px)" }}>
                      {card.badge.label}
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-0.5 card-info-overlay" style={{ opacity: 0, transition: "opacity 0.35s ease", pointerEvents: "none" }}>
                    <span className="font-extrabold uppercase text-[#FF7A00]" style={{ fontSize: "6.5px", letterSpacing: "0.24em" }}>{card.theme}</span>
                    <p className="font-bold text-white truncate leading-snug m-0" style={{ fontSize: isMobile ? "11px" : "12px" }}>{card.title}</p>
                    <div className="flex items-center justify-between gap-1 pt-0.5">
                      <StarRating rating={5} />
                      <span className="font-semibold text-white" style={{ fontSize: "9px" }}>{card.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Logo ── */}
      <motion.div
        className="absolute pointer-events-none flex flex-col items-center gap-[5px]"
        style={{ bottom: isMobile ? "0px" : "10px" }}
        animate={{ opacity: logoVisible ? 1 : 0, y: logoVisible ? 0 : 10 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="font-black uppercase tracking-[0.55em] text-transparent bg-clip-text"
          style={{
            fontSize: isMobile ? "7px" : "8px",
            backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.35) 0%, #FF7A00 50%, rgba(255,255,255,0.35) 100%)",
          }}
        >
          INKSPIRE
        </span>
        <div style={{ width: "40px", height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,122,0,0.55), transparent)" }} />
      </motion.div>
    </div>
  );
}

export default function HeroCarousel({ products, activeIndex, onSlideChange }: HeroCarouselProps) {
  const shouldReduceMotion = useReducedMotion();
  const windowWidth        = useWindowWidth();
  const isMobile           = windowWidth > 0 && windowWidth < 1024;
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [fabHovered,    setFabHovered]    = useState(false);

  const allCards: CardData[] = useMemo(() => {
    const len = Math.max(8, products?.length || 0);
    return Array.from({ length: len }).map((_, i) => {
      const p = products?.[i];
      if (!p) return FALLBACK_CARDS[i % FALLBACK_CARDS.length];
      return {
        id:     p.id,
        title:  p.title,
        handle: p.handle,
        theme:  p.attributes?.themes?.[0] || p.attributes?.rawCollections?.[0] || "Design",
        price:  `${p.checkout?.currency || "$"}${Math.round(p.checkout?.price || 0)}`,
        badge:  p.styling?.badges?.[0] || null,
        image:  p.media?.featuredImage || FALLBACK_CARDS[i % FALLBACK_CARDS.length].image,
      };
    });
  }, [products]);

  const sharedCarousel = (
    <CylinderCarousel
      cards={allCards}
      onSlideChange={onSlideChange}
      shouldReduceMotion={shouldReduceMotion}
      isMobile={isMobile}
    />
  );

  const sharedControls = (
    <div className={`flex items-center gap-4 ${isMobile ? "justify-between px-3 w-full absolute bottom-0 pb-4" : "justify-end self-end pr-2 pb-4 lg:pb-0 lg:-mt-4"} z-50 pointer-events-auto`}>
      <motion.div
        className={`flex ${isMobile ? "items-center gap-2" : "flex-col items-center gap-1 cursor-default"}`}
        {...(isMobile
          ? { animate: { opacity: [0.3, 0.65, 0.3] }, transition: { repeat: Infinity, duration: 2.4, ease: "easeInOut" } }
          : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 4, duration: 0.8 } }
        )}
      >
        {isMobile ? (
          <>
            <svg width="16" height="12" viewBox="0 0 18 14" fill="none">
              <path d="M7 1L1 7L7 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 1L17 7L11 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-white/38">Drag to spin</span>
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

      <MorphingFAB
        isHovered={fabHovered}
        onHoverStart={() => setFabHovered(true)}
        onHoverEnd={() => setFabHovered(false)}
        onClick={() => setIsAdvisorOpen(true)}
      />
    </div>
  );

  return (
    <div className="relative flex h-full w-full flex-col justify-center">
      <div className="relative w-full h-full flex-1">
        {sharedCarousel}
      </div>
      {sharedControls}
      <TattooAdvisorModal isOpen={isAdvisorOpen} onClose={() => setIsAdvisorOpen(false)} />
    </div>
  );
}