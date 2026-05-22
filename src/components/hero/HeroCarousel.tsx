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

// ─── Fallback cards ───────────────────────────────────────────────────────────
const FALLBACK_CARDS: CardData[] = [
  { id:"f1", title:"Celestial Serpent", handle:"celestial-serpent", theme:"Mystical",   price:"$28", badge:{label:"NEW",  color:"#FF7A00"}, image:"https://images.pexels.com/photos/2183130/pexels-photo-2183130.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f2", title:"Botanical Bloom",   handle:"botanical-bloom",   theme:"Floral",     price:"$16", badge:null,                            image:"https://images.pexels.com/photos/1374128/pexels-photo-1374128.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f3", title:"Sacred Geometry",   handle:"sacred-geometry",   theme:"Minimalist", price:"$24", badge:{label:"EXCL", color:"#7C3AED"}, image:"https://images.pexels.com/photos/3651820/pexels-photo-3651820.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f4", title:"Ink Heritage",      handle:"ink-heritage",      theme:"Tribal",     price:"$14", badge:null,                            image:"https://images.pexels.com/photos/2109099/pexels-photo-2109099.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f5", title:"Dragon Soul",       handle:"dragon-soul",       theme:"Japanese",   price:"$32", badge:{label:"HOT",  color:"#EF4444"}, image:"https://images.pexels.com/photos/1194420/pexels-photo-1194420.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f6", title:"Lunar Phase",       handle:"lunar-phase",       theme:"Cosmic",     price:"$20", badge:null,                            image:"https://images.pexels.com/photos/1070534/pexels-photo-1070534.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f7", title:"Obsidian Wave",     handle:"obsidian-wave",     theme:"Abstract",   price:"$22", badge:{label:"SALE", color:"#FF7A00"}, image:"https://images.pexels.com/photos/3617500/pexels-photo-3617500.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { id:"f8", title:"Crimson Koi",       handle:"crimson-koi",       theme:"Japanese",   price:"$30", badge:null,                            image:"https://images.pexels.com/photos/2759483/pexels-photo-2759483.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const SPARKLE_PATH = "M12,2 L16,9 L21,9 L16,15 L18,21 L12,17 L6,21 L8,15 L3,9 L8,9 Z";
const BLOB_PATH    = "M12,2 L17,4 L21,9 L21,14 L18,19 L13,22 L8,22 L4,19 L3,14 L7,4 Z";

const CARD_COUNT = 8;

// ─── Carousel config per breakpoint ──────────────────────────────────────────
function getCfg(isMobile: boolean) {
  return isMobile
    ? { cardW: 168, cardH: 248, radius: 155, perspective: 820,  rotSpeed: 0.022 }
    : { cardW: 280, cardH: 420, radius: 420, perspective: 1200, rotSpeed: 0.018 };
}

// ─── Timeline (ms from RAF start) ─────────────────────────────────────────────
const FALL_STAGGER  = 120;   // ms between each card's fall start
const FALL_DUR      = 900;   // ms for a single card to fall
const EXPAND_START  = 1800;  // ms — just after last card lands
const EXPAND_DUR    = 900;   // ms to fan out
const TILT_START    = 2400;  // ms — overlaps end of expand for fluidity
const TILT_DUR      = 900;   // ms to reach final tilt
const SPIN_START    = 2600;  // ms — auto-spin starts (overlap with tilt for smoothness)

// ─── Pure math helpers ────────────────────────────────────────────────────────
function easeOutQuart(t: number) { return 1 - Math.pow(1 - t, 4); }
function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeOutExpo(t: number)  { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function clamp01(t: number)      { return Math.max(0, Math.min(1, t)); }

function progress(elapsed: number, start: number, dur: number) {
  return clamp01((elapsed - start) / dur);
}

function ringPos(angleRad: number, radius: number) {
  const cosA  = Math.cos(angleRad);
  const sinA  = Math.sin(angleRad);
  const depth = (cosA + 1) / 2;
  return {
    x:          sinA * radius,
    z:          cosA * radius - radius,
    scale:      0.58 + depth * 0.42,
    opacity:    0.25 + depth * 0.75,
    brightness: 0.32 + depth * 0.72,
    blur:       Math.max(0, (1 - depth) * 2.2),
  };
}

// ─── useWindowWidth (undefined until measured → no SSR flash) ─────────────────
function useWindowWidth(): number | undefined {
  const [w, setW] = useState<number | undefined>(undefined);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    fn();
    window.addEventListener("resize", fn, { passive: true });
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

// ─── StarRating ───────────────────────────────────────────────────────────────
function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-[2px]">
      {[1,2,3,4,5].map(n => (
        <Star key={n} size={9}
          className={n <= rating ? "text-[#FF7A00] fill-[#FF7A00]" : "text-white/10 fill-white/10"} />
      ))}
    </div>
  );
}

// ─── MorphingFAB ──────────────────────────────────────────────────────────────
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
        transition={isHovered
          ? { duration: 0.4, ease: "easeOut" }
          : { repeat: Infinity, duration: 9, ease: "linear" }}
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

// ─── CardInner ────────────────────────────────────────────────────────────────
function CardInner({ card, isMobile }: { card: CardData; isMobile: boolean }) {
  return (
    <div className="relative w-full h-full">
      <Image
        src={card.image}
        alt={card.title}
        fill
        className="object-cover"
        sizes={isMobile ? "168px" : "280px"}
        draggable={false}
      />
      <div className="absolute inset-0" style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 55%)",
      }} />
      {card.badge && (
        <div className="absolute left-2 top-2 rounded-full px-2 py-[2px]" style={{
          backgroundColor: `${card.badge.color}DD`,
          fontSize: "6.5px", fontWeight: 700,
          letterSpacing: "0.16em", color: "white",
          backdropFilter: "blur(6px)",
        }}>
          {card.badge.label}
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 p-3 flex flex-col gap-0.5" style={{ pointerEvents: "none" }}>
        <span style={{ fontSize:"6.5px", fontWeight:700, letterSpacing:"0.24em", textTransform:"uppercase", color:"#FF7A00" }}>
          {card.theme}
        </span>
        <p className="font-bold text-white truncate leading-snug m-0" style={{ fontSize: isMobile ? "11px" : "12px" }}>
          {card.title}
        </p>
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <StarRating rating={5} />
          <span className="font-semibold text-white" style={{ fontSize: "9px" }}>{card.price}</span>
        </div>
      </div>
    </div>
  );
}

// ─── CylinderCarousel — the engine ───────────────────────────────────────────
function CylinderCarousel({ cards, onSlideChange, reduceMotion, isMobile }: {
  cards: CardData[];
  onSlideChange: (i: number) => void;
  reduceMotion: boolean;
  isMobile: boolean;
}) {
  const cfg = useMemo(() => getCfg(isMobile), [isMobile]);

  const cardRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const cylinderRef  = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const rotAngle      = useRef(0);
  const isDragging    = useRef(false);
  const dragStartX    = useRef(0);
  const dragStartAng  = useRef(0);
  const mouseParallax = useRef({ x: 0, y: 0 });
  const lastActive    = useRef(-1);
  const onChangeRef   = useRef(onSlideChange);
  useEffect(() => { onChangeRef.current = onSlideChange; }, [onSlideChange]);

  const displayCards = useMemo(
    () => Array.from({ length: CARD_COUNT }, (_, i) => cards[i % cards.length]),
    [cards]
  );

  useEffect(() => {
    let startTs: number | null = null;
    let lastTs: number | null = null; // FIX: Added lastTs tracker for dynamic framerates (120hz)
    const stepDeg = 360 / CARD_COUNT;

    const fallFromY = isMobile ? -480 : -720;
    const fallRotZ  = Array.from({ length: CARD_COUNT }, (_, i) => (i - CARD_COUNT / 2) * 3.0);

    const loop = (ts: number) => {
      if (!startTs) startTs = ts;
      if (!lastTs) lastTs = ts;
      
      const elapsed = ts - startTs;
      
      // FIX: Calculate actual time passed between frames (capped at 100ms)
      const dt = Math.min(ts - lastTs, 100); 
      lastTs = ts;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        const fallStart = i * FALL_STAGGER;
        const fallEnd   = fallStart + FALL_DUR;
        const t         = clamp01((elapsed - fallStart) / FALL_DUR);
        const landed    = elapsed >= fallEnd;

        if (!landed) {
          const te   = easeOutExpo(t);
          const tRot = easeOutCubic(t);

          const currentY    = fallFromY * (1 - te);
          const currentRotZ = fallRotZ[i] * (1 - tRot);
          const currentS    = 0.82 + 0.18 * te;
          const currentOp   = Math.min(1, t * 4);

          el.style.transform = `translateY(${currentY}px) rotateZ(${currentRotZ}deg) scale(${currentS})`;
          el.style.opacity   = String(currentOp);
          el.style.filter    = "";
          el.style.zIndex    = String(100 - i);
          return;
        }

        const expandT  = easeOutQuart(progress(elapsed, EXPAND_START, EXPAND_DUR));
        const rMult    = expandT;

        const tiltT  = easeOutCubic(progress(elapsed, TILT_START, TILT_DUR));
        const tiltX  = isMobile ? 0 : -13 * tiltT;

        const cardBaseDeg = i * stepDeg;
        const finalDeg    = cardBaseDeg - rotAngle.current;
        const finalRad    = (finalDeg * Math.PI) / 180;
        const normRad     = ((finalRad + Math.PI) % (2 * Math.PI)) - Math.PI;

        const ring = ringPos(normRad, cfg.radius * Math.max(rMult, 0.001));

        if (elapsed < EXPAND_START) {
          const stackZ = -(i * 1.5);
          el.style.transform = `translateX(0px) translateZ(${stackZ}px) scale(1)`;
          el.style.opacity   = "1";
          el.style.filter    = "";
          el.style.zIndex    = String(CARD_COUNT - i);
          return;
        }

        const stackZ   = -(i * 1.5);
        const currentX = ring.x * rMult;
        const currentZ = stackZ * (1 - rMult) + ring.z * rMult;

        el.style.transform = `translateX(${currentX}px) translateZ(${currentZ}px) scale(${ring.scale})`;
        el.style.opacity   = String(0.25 + (ring.opacity - 0.25) * rMult + (1 - rMult) * 0.75);
        el.style.filter    = `brightness(${ring.brightness}) blur(${ring.blur * rMult}px)`;
        el.style.zIndex    = String(Math.round((currentZ + cfg.radius) * 10 + 1000));
      });

      // FIX: Apply rotation based on exact Delta Time (dt) rather than hardcoded 16.67ms
      if (!isDragging.current && elapsed >= SPIN_START) {
        rotAngle.current += cfg.rotSpeed * dt;
      }

      if (cylinderRef.current) {
        const tiltT  = easeOutCubic(progress(elapsed, TILT_START, TILT_DUR));
        const tiltX  = isMobile ? 0 : -13 * tiltT;
        const pxTilt = isMobile ? 0 : mouseParallax.current.y * 2.2;
        const pxShift= isMobile ? 0 : mouseParallax.current.x * 7;
        cylinderRef.current.style.transform = `rotateX(${tiltX + pxTilt}deg) translateX(${pxShift}px)`;
      }

      if (elapsed >= SPIN_START) {
        const active = Math.round((((rotAngle.current % 360) + 360) % 360) / stepDeg) % CARD_COUNT;
        if (lastActive.current !== active) {
          lastActive.current = active;
          onChangeRef.current(active);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      startTs = performance.now() - (SPIN_START + 5000);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cfg.radius, cfg.rotSpeed, isMobile, reduceMotion]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      rotAngle.current += e.deltaY * 0.06;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      mouseParallax.current = {
        x: (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2),
        y: (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2),
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [isMobile]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartAng.current = rotAngle.current;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStartX.current;
    rotAngle.current = dragStartAng.current - dx * (isMobile ? 0.38 : 0.28);
  }, [isMobile]);

  // FIX: Properly handle PointerUp to release Pointer Capture memory leak
  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    try {
      if (e.pointerId) {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      }
    } catch (err) {
      // Ignore DOM errors if element unmounted during drag
    }
  }, []);

  const makeRef = useCallback((i: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[i] = el;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center select-none"
      style={{ cursor: "grab", touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onPointerCancel={onPointerUp} // FIX: Ensures carousel doesn't freeze when touch is interrupted by mobile OS
    >
      <div style={{
        width: "100%", height: "100%",
        perspective: `${cfg.perspective}px`,
        perspectiveOrigin: "50% 50%",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div
          ref={cylinderRef}
          style={{
            position: "relative",
            width: "0px", height: "0px",
            transformStyle: "preserve-3d",
          }}
        >
          {displayCards.map((card, i) => (
            <div
              key={`card-${i}`}
              ref={makeRef(i)}
              style={{
                position: "absolute",
                width:  `${cfg.cardW}px`,
                height: `${cfg.cardH}px`,
                left:   `${-cfg.cardW / 2}px`,
                top:    `${-cfg.cardH / 2}px`,
                borderRadius: isMobile ? "12px" : "16px",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.12)",
                willChange: "transform, opacity, filter",
                backfaceVisibility: "hidden",
                transform: `translateY(${isMobile ? -480 : -720}px) scale(0.82)`,
                opacity: "0",
              }}
            >
              <CardInner card={card} isMobile={isMobile} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── HeroCarousel — public export ─────────────────────────────────────────────
export default function HeroCarousel({ products, activeIndex, onSlideChange }: HeroCarouselProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const windowWidth  = useWindowWidth();

  const [mounted, setMounted]           = useState(false);
  const [isAdvisorOpen, setAdvisorOpen] = useState(false);
  const [fabHovered, setFabHovered]     = useState(false);
  const [showHint, setShowHint]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const t = setTimeout(() => setShowHint(true), SPIN_START + 400);
    return () => clearTimeout(t);
  }, [mounted]);

  const isMobile = windowWidth !== undefined ? windowWidth < 1024 : undefined;

  const allCards: CardData[] = useMemo(() => {
    const len = Math.max(CARD_COUNT, products?.length ?? 0);
    return Array.from({ length: len }, (_, i) => {
      const p = products?.[i];
      if (!p) return FALLBACK_CARDS[i % FALLBACK_CARDS.length];
      return {
        id:     p.id,
        title:  p.title,
        handle: p.handle,
        theme:  p.attributes?.themes?.[0] ?? p.attributes?.rawCollections?.[0] ?? "Design",
        price:  `${p.checkout?.currency ?? "$"}${Math.round(p.checkout?.price ?? 0)}`,
        badge:  p.styling?.badges?.[0] ?? null,
        image:  p.media?.featuredImage ?? FALLBACK_CARDS[i % FALLBACK_CARDS.length].image,
      };
    });
  }, [products]);

  if (!mounted || isMobile === undefined) {
    return <div className="relative flex h-full w-full flex-col justify-center bg-transparent pointer-events-none" />;
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-center">

      <div className="relative w-full flex-1 min-h-0">
        <CylinderCarousel
          cards={allCards}
          onSlideChange={onSlideChange}
          reduceMotion={reduceMotion}
          isMobile={isMobile}
        />
      </div>

      <div className={[
        "flex items-center gap-4 z-50 pointer-events-auto",
        isMobile
          ? "justify-between px-4 w-full pb-3 pt-2"
          : "justify-end self-end pr-2 pb-4",
      ].join(" ")}>

        <AnimatePresence>
          {showHint && (
            <motion.div
              className={`flex ${isMobile ? "items-center gap-2" : "flex-col items-center gap-1"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isMobile ? [0, 0.55, 0] : 0.55 }}
              exit={{ opacity: 0 }}
              transition={isMobile
                ? { duration: 2.4, repeat: 3, ease: "easeInOut" }
                : { duration: 0.8 }}
            >
              {isMobile ? (
                <>
                  <svg width="16" height="12" viewBox="0 0 18 14" fill="none">
                    <path d="M7 1L1 7L7 13"  stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M11 1L17 7L11 13" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.2em] text-white/40">
                    Drag to spin
                  </span>
                </>
              ) : (
                <>
                  <span className="text-[7.5px] font-bold uppercase tracking-[0.28em] text-white/45">
                    Drag or Scroll
                  </span>
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  >
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