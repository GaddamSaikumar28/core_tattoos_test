"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { FormattedProduct } from "@/src/lib/shopify";

import TattooAdvisorModal from "./TattooAdvisorModal"; 

interface HeroProps {
  initialProducts: FormattedProduct[];
}

const BRAND_ORANGE = "#ff7a00";

const STATS = [
  { value: "50K+", label: "Happy Customers" },
  { value: "14 Days", label: "Wear Time" },
  { value: "1000+", label: "Designs" },
  { value: "4.9", label: "Avg Rating" },
];

const fallbackImages = [
  "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5f1?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506260408121-e353d10b87c7?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1471922694854-ff1b63b20054?q=80&w=800&auto=format&fit=crop&sat=-100",
  "https://images.unsplash.com/photo-1445116572660-236099ec97a0?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?q=80&w=800&auto=format&fit=crop&sat=-100",
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

// Isolated Card component to prevent parent re-renders during loading updates
function CarouselCard({ src, index, angle }: { src: string; index: number; angle: number }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      // INCREASED BASE MOBILE CARD SIZES HERE
      className="absolute w-[220px] h-[380px] xs:w-[240px] xs:h-[420px] sm:w-[260px] sm:h-[450px] md:w-[280px] md:h-[480px] p-2.5 group"
      style={{
        transform: `rotateY(${angle}deg) translateZ(calc(-1 * clamp(400px, 85vw, 620px)))`,
        backfaceVisibility: "hidden",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      <div className="absolute inset-0 bg-[#060606]/90 border border-white/[0.07] rounded-xl p-[4px] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:border-white/25 group-hover:shadow-[0_0_40px_rgba(255,122,0,0.15)] group-hover:-translate-y-2">
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-950 flex items-center justify-center">
          
          {/* Smooth shimmering overlay skeleton + spinner loader */}
          <AnimatePresence mode="wait">
            {!isLoaded && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950 border border-white/5"
              >
                {/* Pulse background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                <Loader2 className="w-5 h-5 animate-spin text-zinc-700 relative z-20" style={{ color: `${BRAND_ORANGE}aa` }} />
              </motion.div>
            )}
          </AnimatePresence>

          <Image
            src={src}
            alt={`Cinematic artwork showcase ${index}`}
            fill
            priority={index < 4}
            sizes="(max-width: 640px) 220px, (max-width: 768px) 240px, 280px"
            onLoad={() => setIsLoaded(true)}
            className={`object-cover pointer-events-none transition-all duration-700 ease-out group-hover:scale-105 filter group-hover:brightness-100 ${
              isLoaded ? "brightness-[0.92] scale-100 opacity-100" : "brightness-50 scale-95 opacity-0"
            }`}
          />
        </div>
      </div>
    </div>
  );
}

export default function CinematicHero({ initialProducts }: HeroProps) {
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);

  const carouselImages = useMemo(() => {
    const dynamicImages = (initialProducts || [])
      .map((product) => product.media?.featuredImage)
      .filter((img): img is string => typeof img === "string" && img.trim() !== "");

    const baseImages = dynamicImages.length > 0 ? dynamicImages : fallbackImages;

    // Expand the pool if there are few images to maintain a clean 3D ring shape
    return baseImages.length < 8
      ? Array.from(
          { length: Math.max(10, baseImages.length * 2) },
          (_, i) => baseImages[i % baseImages.length]
        )
      : baseImages;
  }, [initialProducts]);

  return (
    <>
      <section
        className="relative w-full h-screen min-h-[650px] sm:min-h-[800px] bg-black overflow-hidden flex items-center justify-center isolate select-none"
        style={{ contain: "layout paint style" }}
      >
        {/* Premium Ambient Glow Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] h-[55vh] bg-white/[0.015] blur-[140px] rounded-full pointer-events-none z-0" />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[30vh] blur-[100px] rounded-full pointer-events-none z-0 opacity-40" 
          style={{ backgroundColor: `${BRAND_ORANGE}10` }}
        />

        {/* ── Top Content Wrapper ── */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          // INCREASED TOP POSITIONING MARGINALLY TO CLOSE GAP
          className="absolute top-[12%] sm:top-[14%] left-1/2 z-30 w-full px-4 pointer-events-none"
          style={{
            transform: "translateX(-50%) translateZ(100px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto pointer-events-auto">
            <motion.h1 
              variants={fadeUpVariants} 
              // INCREASED MOBILE TEXT SIZES (text-4xl -> text-5xl)
              className="leading-[1.1] tracking-tighter text-5xl sm:text-6xl md:text-6xl lg:text-7xl"
            >
              <span className="text-white font-light block md:inline-block md:mr-3">
                Express Yourself
              </span>
              <span
                className="font-semibold drop-shadow-[0_2px_10px_rgba(255,122,0,0.15)] block md:inline-block mt-1 md:mt-0"
                style={{ color: BRAND_ORANGE }}
              >
                Fearlessly.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUpVariants}
              // INCREASED MOBILE TEXT SIZE (text-xs -> text-sm)
              className=" max-w-sm sm:max-w-lg md:max-w-2xl text-sm sm:text-base font-normal leading-relaxed text-zinc-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
            >
              Premium tattoos with a real ink feel.
              <span className="text-zinc-100 font-medium block sm:inline"> No needles, zero commitment. </span>
              Lasts up to 14 days.
            </motion.p>

            {/* NEW: STYLISH PILL BADGE TO FILL VERTICAL MOBILE GAP */}
            <motion.div 
              variants={fadeUpVariants} 
              className="mt-6 md:mt-8 flex justify-center"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md shadow-xl">
                <div className="relative flex items-center justify-center w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full animate-ping opacity-75" style={{ backgroundColor: BRAND_ORANGE }}></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ backgroundColor: BRAND_ORANGE }}></span>
                </div>
                <span className="text-[10px] sm:text-xs text-zinc-300 uppercase tracking-widest font-medium">
                  New Drops Added Weekly
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Optimized 3D Concave Carousel ── */}
        <div
          className="absolute top-[50%] left-0 w-full flex items-center justify-center pointer-events-none z-10"
          style={{
            perspective: "clamp(800px, 110vw, 1600px)",
            transform: "translateZ(0)",
            willChange: "transform",
            transformStyle: "flat",
          }}
        >
          <div
            // INCREASED MOBILE SCALES TO FILL MORE SPACE
            className="flex items-center justify-center scale-[0.85] xs:scale-[0.90] sm:scale-[0.95] md:scale-[1] transition-transform duration-500 ease-out"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <motion.div
              className="relative flex items-center justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
                transform: "translateZ(0)",
              }}
              animate={{ rotateY: -360 }}
              transition={{
                duration: 65, 
                ease: "linear",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              {carouselImages.map((src, i) => {
                const totalCards = carouselImages.length;
                const theta = 360 / totalCards;
                const angle = i * theta;

                return (
                  <CarouselCard 
                    key={`${src}-${i}`} 
                    src={src} 
                    index={i} 
                    angle={angle} 
                  />
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* ── CTA + Bottom Stats Dashboard Row ── */}
        <div 
          // ADJUSTED BOTTOM POSITIONING TO PULL CONTENT UP SLIGHTLY ON MOBILE
          className="absolute bottom-[8%] sm:bottom-[9%] left-1/2 z-30 w-full px-5 pointer-events-none"
          style={{
            transform: "translateX(-50%) translateZ(120px)",
            transformStyle: "preserve-3d",
          }}
        >
          <div className="flex flex-col items-center pointer-events-auto max-w-xl mx-auto">
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 md:px-8 md:py-4 text-[11px] md:text-xs uppercase tracking-[0.16em] font-black text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg group"
                style={{
                  background: BRAND_ORANGE,
                  boxShadow: "0 6px 28px rgba(255,122,0,0.35)",
                }}
              >
                Shop the Collection
                <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mt-6 md:mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between w-full px-2"
            >
              {STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center text-center flex-1">
                  <span
                    className="text-sm sm:text-base md:text-xl font-extrabold tracking-tight"
                    style={{ color: BRAND_ORANGE }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[7px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-1 whitespace-nowrap">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-24 md:h-44 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-20" />

        {/* ── Floating Action Button (Tattoo Advisor) ── */}
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9, duration: 0.6, type: "spring", stiffness: 180 }}
          onClick={() => setIsAdvisorOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-[60] flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full text-black transition-all duration-300 hover:scale-110 active:scale-95 group"
          style={{
            backgroundColor: BRAND_ORANGE,
            boxShadow: "0 0 25px rgba(255,122,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)",
          }}
          aria-label="Open AI Tattoo Advisor"
        >
          <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:rotate-12" />
          <div className="absolute inset-0 rounded-full border border-[#ff7a00] animate-ping opacity-30 pointer-events-none" />
        </motion.button>
      </section>

      <TattooAdvisorModal 
        isOpen={isAdvisorOpen} 
        onClose={() => setIsAdvisorOpen(false)} 
      />
    </>
  );
}