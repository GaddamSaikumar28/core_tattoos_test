"use client";

import { useState } from "react";
import HeroContent from "./HeroContent";
import HeroCarousel from "./HeroCarousel";
import HeroMarquee from "./HeroMarquee";
import HeroBackground from "./HeroBackground";
import { FormattedProduct } from "@/src/lib/shopify";
// ─── Shared product type (exported for child components) ──────────────────────


interface HeroProps {
  initialProducts: FormattedProduct[];
}

export default function Hero({ initialProducts }: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = initialProducts[activeIndex] || initialProducts[0];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
      style={{ minHeight: "100dvh" }}
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
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none mix-blend-screen">
          <HeroBackground activeProduct={activeProduct} />
        </div>
      )}

      {/* ── Page shell ─────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 flex flex-col w-full mx-auto max-w-[1600px]"
        style={{ minHeight: "100dvh" }}
      >
        <div
          className="flex-1 flex flex-col lg:flex-row items-stretch
                     px-6 md:px-8 lg:px-12 xl:px-16
                     pt-[100px] pb-8
                     lg:pt-[120px] lg:pb-12"
        >
          {/* ── Left column: Typography + Stats ────────────────────────────── */}
          <div
            className="w-full lg:w-[45%] flex flex-col justify-center
                       py-8 lg:py-0 pr-0 lg:pr-8 xl:pr-12 z-20"
          >
            <HeroContent />
          </div>

          {/* ── Right column: Card Carousel ─────────────────────────────────── */}
          <div className="w-full lg:w-[55%] flex flex-col min-h-[500px] lg:min-h-0 relative z-10">
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