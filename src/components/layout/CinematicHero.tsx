"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FormattedProduct } from "@/src/lib/shopify";

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
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function CinematicHero({ initialProducts }: HeroProps) {
  const carouselImages = useMemo(() => {
    const dynamicImages = (initialProducts || [])
      .map((product) => product.media?.featuredImage)
      .filter(
        (img): img is string =>
          typeof img === "string" && img.trim() !== ""
      );

    const baseImages = dynamicImages.length > 0 ? dynamicImages : fallbackImages;

    return baseImages.length < 8
      ? Array.from(
          { length: Math.max(10, baseImages.length * 2) },
          (_, i) => baseImages[i % baseImages.length]
        )
      : baseImages;
  }, [initialProducts]);

  return (
    <section
      className="relative w-full h-screen min-h-[660px] sm:min-h-[750px] md:min-h-[850px] bg-black overflow-hidden flex items-center justify-center isolate select-none"
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
        className="absolute top-16 sm:top-20 md:top-24 left-1/2 z-30 w-full px-4 pointer-events-none"
        style={{
          transform: "translateX(-50%) translateZ(100px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto pointer-events-auto">
          
          <motion.div variants={fadeUpVariants} className="flex flex-wrap justify-center gap-1.5 mb-3.5 md:mb-5">
            <div
              className="rounded-full px-2.5 py-1 md:px-3.5 md:py-1.5 border transition-colors duration-300 hover:bg-white/[0.02]"
              style={{
                borderColor: "rgba(255,122,0,0.2)",
                background: "rgba(255,122,0,0.04)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span
                className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]"
                style={{ color: BRAND_ORANGE }}
              >
                🔥 New Drop Live
              </span>
            </div>

            <div
              className="rounded-full px-2.5 py-1 md:px-3.5 md:py-1.5 border transition-colors duration-300 hover:bg-white/[0.05]"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                backdropFilter: "blur(12px)",
              }}
            >
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                ● Free Shipping $35+
              </span>
            </div>
          </motion.div>

          <motion.h1 
            variants={fadeUpVariants} 
            className="leading-[1.1] tracking-tighter text-xl sm:text-3xl md:text-5xl lg:text-6xl whitespace-nowrap"
          >
            <span className="text-white font-light mr-1.5 md:mr-3">
              Express Yourself
            </span>
            <span
              className="font-semibold drop-shadow-[0_2px_10px_rgba(255,122,0,0.15)] inline-block"
              style={{ color: BRAND_ORANGE }}
            >
              Fearlessly.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUpVariants}
            className="mt-3 md:mt-1 max-w-[280px] sm:max-w-md md:max-w-xl text-[10px] sm:text-xs md:text-sm font-normal leading-relaxed text-zinc-400 drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]"
          >
            Premium sticker tattoos that look and feel like real ink.
            <span className="text-zinc-100 font-medium"> No needles. No commitment.</span>{" "}
            Up to 14 days of breathtaking art on your skin.
          </motion.p>
        </div>
      </motion.div>

      {/* ── Optimized 3D Concave Carousel ── */}
      <div
        className="absolute top-[52%] sm:top-[53%] md:top-[54%] left-0 w-full flex items-center justify-center pointer-events-none z-10"
        style={{
          // Responsive perspective: smaller on mobile pulls the outer cards closer into the viewport width
          // perspective: "clamp(700px, 120vw, 1600px)",
          perspective: "clamp(850px, 120vw, 1600px)",
          transform: "translateZ(0)",
          willChange: "transform",
          transformStyle: "flat",
        }}
      >
        <div
          // Increased the base scale so cards appear larger on mobile screens
          //className="flex items-center justify-center scale-[0.75] xs:scale-[0.80] sm:scale-[0.85] md:scale-[0.95] lg:scale-[1] xl:scale-[1.05] transition-transform duration-500 ease-out"
          className="flex items-center justify-center scale-[0.85] xs:scale-[0.90] sm:scale-[0.95] md:scale-[1] lg:scale-[1.05] transition-transform duration-500 ease-out"
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
              duration: 55,
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
                <div
                  key={`${src}-${i}`}
                  // Taller and correctly narrowed for mobile to allow 5 cards to fit with a small gap
                  className="absolute w-[220px] h-[380px] xs:w-[240px] xs:h-[420px] sm:w-[280px] sm:h-[480px] p-2.5 group"
                  style={{
                    // Clamp dynamically controls the radius: ~360px on mobile, maxes at 620px on desktop
                    transform: `rotateY(${angle}deg) translateZ(calc(-1 * clamp(440px, 90vw, 620px)))`,
                    backfaceVisibility: "hidden",
                    transformStyle: "preserve-3d",
                    willChange: "transform",
                  }}
                >
                  <div className="absolute inset-0 bg-[#060606]/90 border border-white/[0.07] rounded-xl p-[4px] shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.05)] transition-all duration-500 group-hover:border-white/25 group-hover:shadow-[0_0_40px_rgba(255,122,0,0.15)] group-hover:-translate-y-2">
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-zinc-950">
                      <Image
                        src={src}
                        alt={`Cinematic artwork showcase ${i}`}
                        fill
                        priority={i < 3}
                        sizes="(max-width: 640px) 240px, 280px"
                        className="object-cover pointer-events-none transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.92] group-hover:brightness-100"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* ── CTA + Bottom Stats Dashboard Row ── */}
      <div 
        className="absolute bottom-15 sm:bottom-8 md:bottom-20 left-1/2 z-30 w-full px-5 pointer-events-none"
        style={{
          transform: "translateX(-50%) translateZ(120px)",
          transformStyle: "preserve-3d",
        }}
      >
        <div className="flex flex-col items-center pointer-events-auto max-w-xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/collections"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 md:px-6 md:py-3 text-[9px] md:text-[10px] uppercase tracking-[0.16em] font-black text-white transition-all duration-300 hover:scale-105 active:scale-98"
              style={{
                background: BRAND_ORANGE,
                boxShadow: "0 6px 28px rgba(255,122,0,0.35)",
              }}
            >
              Shop the Collection
              <ArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-4 md:mt-5 pt-3 md:pt-4 border-t border-white/[0.08] flex items-center justify-between w-full px-2"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center flex-1">
                <span
                  className="text-sm sm:text-lg md:text-xl font-extrabold tracking-tight"
                  style={{ color: BRAND_ORANGE }}
                >
                  {stat.value}
                </span>
                <span className="text-[7px] sm:text-[8.5px] md:text-[9px] uppercase tracking-[0.15em] text-zinc-500 font-medium mt-0.5 whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 md:h-44 bg-gradient-to-t from-black via-black/85 to-transparent pointer-events-none z-20" />
    </section>
  );
}