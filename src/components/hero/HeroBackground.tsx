


"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FormattedProduct } from "@/src/lib/shopify";

interface HeroBackgroundProps {
  activeProduct: FormattedProduct | null | undefined;
}

export default function HeroBackground({ activeProduct }: HeroBackgroundProps) {
  // Safe extraction supporting both direct string URLs and nested Shopify object schemas
  const imageUrl = 
    typeof activeProduct?.media?.featuredImage === "string"
      ? activeProduct.media.featuredImage
      : (activeProduct?.media?.featuredImage as any)?.url || 
        (activeProduct as any)?.featuredImage?.url || 
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

  return (
    <div 
      className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
      style={{ backgroundColor: "var(--color-bg-base, #0A0A0A)" }}
    >
      
      {/* ── Dynamic Ambient Lighting Matrix ──────────────────────────────── */}
      {/* mode="popLayout" delivers seamless asset crossfades within the same coordinate spaces */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={activeProduct?.id || "fallback-bg"}
          initial={{ opacity: 0, scale: 1.45 }}
          animate={{ opacity: 1, scale: 1.5 }}
          exit={{ opacity: 0, scale: 1.52 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          {/* Heavy blur combined with increased saturation allows the underlying product hues 
              to softly cut through the dark cinematic overlay shields.
          */}
          <Image
            src={imageUrl}
            alt="Background ambient illumination"
            fill
            className="object-cover blur-[100px] md:blur-[130px] opacity-[0.45] saturate-[1.6]"
            priority
            quality={25} // Low compression target optimizes weight without sacrificing blurred fidelity
          />
        </motion.div>
      </AnimatePresence>

      {/* ── Premium Lens Overlay Shields ─────────────────────────────────── */}

      {/* 1. Vertical Vignette Mask (Blends context lines into headers/footers) */}
      <div 
        className="absolute inset-0 z-10 bg-gradient-to-b"
        style={{
          backgroundImage: `linear-gradient(to bottom, var(--color-bg-base, #0A0A0A) 0%, rgba(0,0,0,0.2) 35%, rgba(0,0,0,0.2) 65%, var(--color-bg-base, #0A0A0A) 100%)`
        }}
      />
      
      {/* 2. Left-Weighted Typography High-Contrast Radial Gradient */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          backgroundImage: `radial-gradient(ellipse at left, var(--color-bg-base, #0A0A0A) 0%, rgba(10,10,10,0.5) 45%, transparent 75%)`
        }}
      />

      {/* 3. Velvet Micro-Grain Film Overlay Layer (Deters rendering artifact banding) */}
      <div 
        className="absolute inset-0 z-20 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
    </div>
  );
}