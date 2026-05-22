"use client";

import { useState } from "react";
import HeroContent from "./HeroContent";
import HeroCarousel from "./HeroCarousel";
import HeroMarquee from "./HeroMarquee";
import HeroBackground from "./HeroBackground";
import { FormattedProduct } from "@/src/lib/shopify";

interface HeroProps {
  initialProducts: FormattedProduct[];
}

export default function Hero({ initialProducts }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = initialProducts[activeIndex] || initialProducts[0];

  return (
    <section
      /* FIX: Changed style={{ minHeight: "100dvh" }} to match the exact 
        tailwinds classes used in HeroSkeleton (h-[100dvh] min-h-[800px])
      */
      className="relative w-full h-[100dvh] min-h-[800px] overflow-hidden bg-[#0A0A0A] flex flex-col justify-center"
    >
      {/* ── LAYER 1: Raw Background Image ──────────────────────────────────── */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat pointer-events-none brightness-[0.45] contrast-[1.05] scale-105"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/34859828/pexels-photo-34859828.jpeg?cs=srgb&dl=pexels-ray-suarez-624980841-34859828.jpg&fm=jpg')`,
        }}
      />

      {/* ── LAYER 2: Dark Vignette Gradient ────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/40 via-transparent to-[#0A0A0A] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0A0A0A_95%)] pointer-events-none" />

      {/* ── LAYER 3: Dynamic Ambient Glow ──────────────────────────────────── */}
      {activeProduct && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen transition-opacity duration-700">
          <HeroBackground activeProduct={activeProduct} />
        </div>
      )}

      {/* ── Page shell ─────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col flex-1 w-full mx-auto max-w-[1600px] h-full justify-center">
        <div
          className="flex-1 flex flex-col lg:flex-row items-center justify-center 
                     px-4 md:px-8 lg:px-12 xl:px-16 
                    pt-[130px] lg:pt-[120px] pb-8 lg:pb-12"
        >
          {/* ── Left column: Typography + Stats ── */}
          <div
            className="
              order-2 lg:order-1
              w-full lg:w-[45%] flex flex-col justify-center
              mt-2 lg:mt-0 z-20
            "
          >
            <HeroContent />
          </div>

          <div
            className="
              order-1 lg:order-2
              w-full lg:w-[55%] flex flex-col relative z-10
              h-[55dvh] lg:h-auto lg:min-h-[600px] lg:self-stretch items-center justify-center
              mt-20 lg:mt-0
            "
          >
            <HeroCarousel
              products={initialProducts}
              activeIndex={activeIndex}
              onSlideChange={setActiveIndex}
            />
          </div>
        </div>

        {/* ── Marquee pinned to bottom ─────────────────────────────────────── */}
        <div className="mt-auto z-20 relative">
          <HeroMarquee />
        </div>
      </div>
    </section>
  );
}