"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Minus,
  X,
  Star,
  Droplets,
  ShieldCheck,
  Loader2,
  Clock,
  Sparkles,
  ShoppingBag,
  AlertCircle,
  Camera,
  Box,
  Heart,
  Lock,
  Truck,
  RotateCcw,
  Leaf,
  Focus,
  Navigation,
  RefreshCcw,
} from "lucide-react";
import clsx from "clsx";

import { TattooProductDetailProps } from "./types";
import { useProductDetail } from "./useProductDetail";
import InteractiveTattoo from "./InteractiveTattoo";
import AccordionItem from "./AccordionItem";

// Bypass React's strict custom element checks for Model Viewer.
const ModelViewer = "model-viewer" as any;

// =========================================================
export default function TattooProductDetail({ product }: TattooProductDetailProps) {

  // Pull everything from the completely upgraded hook
  const {
    models, sortedSwatches, standardImages, angleViews,
    isMounted,
    viewState, setViewState,
    activeSkinTone, setActiveSkinTone,
    currentImageSrc, thumbnails,
    isZoomed, setIsZoomed,
    isCameraAROpen, setIsCameraAROpen,
    modelViewerRef, videoRef,
    modelLoaded,
    facingMode, handleSwitchCamera,
    activeAccordion,
    isWishlisted, setIsWishlisted,
    quantity, isAdding, isBuyingNow,
    variants, selectedVariant, setSelectedVariant,
    price, compareAtPrice, isOnSale, discount, savingsAmount,
    viewingNow, stockLevel, soldThisWeek, scarcityPct,
    handleQuantityChange,
    handleAddToCart,
    handleBuyNow,
    handleTriggerAR,
    toggleAccordion,
  } = useProductDetail(product);

  // Prevent SSR/hydration mismatch — render nothing until client-mounted.
  if (!isMounted) return null;

  // =========================================================
  return (
    <div className="bg-[#080808] min-h-screen pt-[130px] lg:pt-[150px] pb-12 selection:bg-[#fe8204] selection:text-white">
      <div className="container max-w-[1400px] mx-auto px-4 lg:px-8">

        {/* ══════════════════════════════════════════════════
            BREADCRUMBS
        ══════════════════════════════════════════════════ */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-8">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span className="text-neutral-700">/</span>
          <a href="/collections/" className="hover:text-white transition-colors">Shop All</a>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-400 truncate max-w-[160px] sm:max-w-none">{product.title}</span>
        </nav>

        {/* ══════════════════════════════════════════════════
            TWO-COLUMN GRID
        ══════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 xl:gap-20 items-start">

          {/* ════════════════════════════════════════════════
              LEFT — MEDIA VIEWER
          ════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-28 min-w-0">

            {/* ── MAIN CANVAS ─────────────────────────────── */}
            <div className="relative w-full aspect-[4/5] rounded-3xl bg-[#0d0d0d] border border-white/[0.06] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

              {/* ── Floating top row: social proof + wishlist ─ */}
              <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2.5">

                  {/* Live viewer count */}
                  <div className="bg-black/70 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10 w-fit shadow-lg pointer-events-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                    <span className="text-[10px] font-semibold text-neutral-300">
                      {viewingNow.toLocaleString()} viewing now
                    </span>
                  </div>

                  {/* "Limited Drop" pill + product badges */}
                  <div className="flex flex-col gap-1.5">
                    <div className="bg-[#fe8204] text-black px-3.5 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] uppercase w-fit shadow-[0_4px_14px_rgba(254,130,4,0.35)] pointer-events-auto">
                      Limited Drop
                    </div>
                    {product.styling?.badges?.filter(Boolean).map((badge: any, i: number) => (
                      <span
                        key={i}
                        className="px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-black rounded-full shadow-sm w-fit pointer-events-auto"
                        style={{ backgroundColor: badge.color || "#fff" }}
                      >
                        {badge.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Wishlist toggle */}
                <button
                  onClick={() => setIsWishlisted((w) => !w)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg pointer-events-auto"
                >
                  <Heart
                    className={clsx(
                      "w-4 h-4 transition-all duration-300",
                      isWishlisted ? "fill-[#fe8204] text-[#fe8204]" : "text-white",
                    )}
                  />
                </button>
              </div>

              {/* ── DYNAMIC MEDIA PANEL ───────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewState.type + (viewState.type === "gallery" || viewState.type === "angle" ? viewState.index : "")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  // className="relative w-full h-full"
                  className="relative w-full aspect-square md:aspect-[4/5] overflow-hidden rounded-2xl bg-neutral-900/40"
                >
                  {/* ── 3D Model panel ────────────────────── */}
                  {viewState.type === "3d" && (
                    <div className="absolute inset-0 w-full h-full">
                      {!modelLoaded && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#0d0d0d]">
                          <Loader2 className="w-8 h-8 text-[#fe8204] animate-spin" />
                        </div>
                      )}
                      <ModelViewer
                        ref={modelViewerRef}
                        src={viewState.source.sources?.find((s: any) => s.format === "glb")?.url}
                        ios-src={viewState.source.sources?.find((s: any) => s.format === "usdz")?.url}
                        alt="3D product model"
                        ar="true"
                        ar-modes="webxr scene-viewer quick-look"
                        camera-controls="true"
                        auto-rotate="true"
                        rotation-per-second="30deg"
                        shadow-intensity="1"
                        environment-image="neutral"
                        style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
                      >
                        <button slot="ar-button" className="hidden">AR</button>
                      </ModelViewer>
                    </div>
                  )}

                  {/* ── 2D Image panel (skin-tone, gallery, or angle) */}
                  {(viewState.type === "skintone" || viewState.type === "gallery" || viewState.type === "angle") && (
                    <div
                      className="absolute inset-0 w-full h-full cursor-zoom-in"
                      onClick={() => setIsZoomed(true)}
                    >
                      <Image
                        src={currentImageSrc}
                        alt={product.title}
                        fill
                        priority
                        className="object-cover object-center"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Bottom vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* ── SCARCITY PROGRESS BAR ─────────────────── */}
              <div className="absolute bottom-[68px] left-5 right-5 z-20 pointer-events-none">
                <div className="flex justify-between text-[10px] font-semibold text-neutral-500 mb-1.5">
                  <span>{soldThisWeek.toLocaleString()} sold this week</span>
                  <span className="text-[#fe8204]">Only {stockLevel} left!</span>
                </div>
                <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scarcityPct}%` }}
                    transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#fe8204] to-[#ffb347] rounded-full"
                  />
                </div>
              </div>

              {/* ── BOTTOM ACTION ROW: AR button + zoom ───── */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
                <button
                  onClick={handleTriggerAR}
                  className="flex items-center gap-2.5 px-6 py-3 bg-black/60 hover:bg-black/90 backdrop-blur-xl border border-white/15 rounded-full text-white text-[10px] font-black uppercase tracking-widest transition-all duration-300 hover:border-[#fe8204]/50 shadow-lg"
                >
                  <Camera className="w-3.5 h-3.5 text-[#fe8204]" />
                  {viewState.type === "3d" ? "AR View" : "Try On"}
                </button>

                {(viewState.type === "skintone" || viewState.type === "gallery" || viewState.type === "angle") && (
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="w-11 h-11 bg-black/60 hover:bg-black/90 backdrop-blur-xl border border-white/15 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg"
                    aria-label="Zoom image"
                  >
                    <Focus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
            {/* END MAIN CANVAS */}

            {/* ── THUMBNAIL STRIP + SKIN-TONE SWATCHES ROW ─ */}
            {(thumbnails.length > 1 || sortedSwatches.length > 0) && (
              // <div className="flex flex-row items-center gap-6 overflow-x-auto no-scrollbar pb-2 mt-2 w-full">
                <div className="flex flex-row items-center gap-6 overflow-x-auto no-scrollbar pb-2 mt-2 w-full max-w-full">
                {/* Left: thumbnail buttons */}
                {thumbnails.length > 1 && (
                  <div className="flex flex-row gap-3 shrink-0">
                    {thumbnails.map((thumb: any, idx: number) => {
                      const isActive =
                        (thumb.type === "3d" && viewState.type === "3d") ||
                        (thumb.type === "skintone" && viewState.type === "skintone") ||
                        (thumb.type === "gallery" && viewState.type === "gallery" && viewState.index === thumb.index); 
                        // ||
                        // (thumb.type === "angle" && viewState.type === "angle" && viewState.index === thumb.index);

                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            setViewState(
                              (thumb.type === "gallery")
                                ? { type: thumb.type, source: thumb.source, index: thumb.index }
                                : { type: thumb.type as any, source: thumb.source },
                            )
                          }
                          className={clsx(
                            "relative w-[72px] h-[90px] shrink-0 rounded-2xl overflow-hidden bg-[#111] border transition-all duration-300",
                            isActive
                              ? "border-[#fe8204] shadow-[0_0_15px_rgba(254,130,4,0.3)]"
                              : "border-white/[0.05] hover:border-white/20 opacity-50 hover:opacity-100",
                          )}
                        >
                          {/* 3D icon overlay */}
                          {thumb.type === "3d" && (
                            <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center gap-1.5">
                              <Box className="w-4 h-4 text-[#fe8204]" />
                              <span className="text-[7px] font-black text-white uppercase tracking-wider">3D</span>
                            </div>
                          )}

                          {/* Angle view overlay */}
                          {/* {thumb.type === "angle" && (
                            <div className="absolute inset-0 bg-black/20 z-10 flex flex-col items-center justify-end pb-2 pointer-events-none">
                              <div className="bg-black/60 rounded-full px-2 py-0.5 text-[8px] font-bold text-white flex items-center gap-1 backdrop-blur-md border border-white/10">
                                <Navigation className="w-2 h-2 text-[#fe8204]" />
                                {thumb.source.degree}°
                              </div>
                            </div>
                          )} */}

                          <Image
                            src={thumb.thumbUrl}
                            alt="Thumbnail"
                            fill
                            className="object-cover"
                            sizes="72px"
                          />
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Right: skin-tone swatch circles (dynamically sorted) */}
                {sortedSwatches.length > 0 && (
                  <div className="flex flex-row items-center gap-3.5 shrink-0 ml-2 border-l border-white/10 pl-6">
                    {sortedSwatches.map((swatch: any) => (
                      <button
                        key={swatch.hexCode}
                        onClick={() => {
                          setActiveSkinTone(swatch.hexCode);
                          setViewState({ type: "skintone", source: swatch });
                        }}
                        className={clsx(
                          "w-8 h-8 rounded-full border-2 transition-all duration-300",
                          activeSkinTone === swatch.hexCode
                            ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                            : "border-transparent hover:scale-110 hover:border-white/30 opacity-50 hover:opacity-100",
                        )}
                        style={{ backgroundColor: swatch.hexCode }}
                        aria-label={`Skin tone ${swatch.hexCode}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* END THUMBNAIL STRIP */}

          </div>
          {/* END LEFT COLUMN */}

          {/* ════════════════════════════════════════════════
              RIGHT — PRODUCT INFO
          ════════════════════════════════════════════════ */}
          <div className="flex flex-col py-2">

            {/* ── HEADER: vendor · stars · title · description */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">

                {/* Vendor + color-type pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-black text-[#fe8204] uppercase tracking-[0.15em] bg-[#fe8204]/10 px-2.5 py-1 rounded-md border border-[#fe8204]/15">
                    {product.vendor}
                  </span>
                  {product.styling?.tattooColorType && (
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] bg-white/[0.04] px-2.5 py-1 rounded-md border border-white/5">
                      {product.styling.tattooColorType}
                    </span>
                  )}
                </div>

                {/* Star rating */}
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#fe8204] text-[#fe8204]" />
                  ))}
                  <span className="text-[10px] text-neutral-400 font-bold ml-1.5">4.9 (3,241)</span>
                </div>
              </div>

              <h1 className="text-[34px] md:text-[42px] lg:text-[46px] font-bold text-white leading-[1.05] tracking-tight mb-3">
                {product.title}
              </h1>
              <p className="text-[14px] text-neutral-400 leading-relaxed font-medium line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* ── TRUST MICRO-BADGES ───────────────────────── */}
            <div className="flex items-center justify-between pb-5 mb-5 border-b border-white/[0.06]">
              {[
                { icon: Lock, label: "Secure Pay" },
                { icon: Truck, label: "Ships in 24h" },
                { icon: RotateCcw, label: "Free Returns" },
                { icon: Leaf, label: "Plant-Based" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-neutral-500">
                  <badge.icon className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* ── PRICE & INVENTORY STATUS ─────────────────── */}
            <div className="mb-5 pb-5 border-b border-white/[0.06]">
              {isOnSale && (
                <div className="mb-2">
                  <span className="inline-block bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase border border-emerald-500/15">
                    Save ${savingsAmount}
                  </span>
                </div>
              )}

              <div className="flex items-end gap-4 flex-wrap">
                <span className="text-[48px] font-bold text-white tracking-tight leading-none">
                  ${price.toFixed(2)}
                </span>
                {isOnSale && (
                  <span className="bg-red-500/10 text-red-400 px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-md mb-2 border border-red-500/15">
                    {discount}% OFF
                  </span>
                )}
              </div>

              {/* Stock status */}
              <div className="mt-2.5">
                {stockLevel > 0 && stockLevel < 10 ? (
                  <div className="flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Low Stock — Only {stockLevel} left!
                    </span>
                  </div>
                ) : product.inventory?.inStock ? (
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    ✓ In Stock & Ready to Ship
                  </span>
                ) : null}
              </div>
            </div>

            {/* ── VARIANT SELECTOR ─────────────────────────── */}
            {variants.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                    Select Option
                  </h3>
                  {selectedVariant && !selectedVariant.availableForSale && (
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                      Out of Stock
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((v) => (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        "px-5 py-3.5 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all duration-200 border-2",
                        selectedVariant?.variantId === v.variantId
                          ? "border-[#fe8204] bg-[#fe8204]/10 text-[#fe8204] shadow-[0_0_15px_rgba(254,130,4,0.15)]"
                          : "border-white/5 bg-transparent text-neutral-400 hover:border-white/20 hover:text-white",
                      )}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── FEATURE GRID (4 icons) ────────────────────── */}
            <div className="grid grid-cols-2 gap-3 mb-5 pb-5 border-b border-white/[0.06]">
              {[
                { icon: Droplets, text: "Waterproof 12–14 Days" },
                { icon: Clock, text: "Lasts 1–2 Weeks" },
                { icon: ShieldCheck, text: "Skin Safe Formula" },
                { icon: Sparkles, text: "Realistic Look" },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors"
                >
                  <feat.icon className="w-4 h-4 text-[#fe8204] shrink-0" />
                  <span className="text-[11px] font-semibold text-neutral-300">{feat.text}</span>
                </div>
              ))}
            </div>

            {/* ── TATTOO SPECS ROW ──────────────────────────── */}
            {(product.attributes?.placements?.length > 0 || product.styling?.tattooColorType) && (
              <div className="flex items-center justify-between py-4 border-b border-white/[0.06] mb-4">
                {product.styling?.tattooColorType && (
                  <>
                    <div className="text-left flex-1">
                      <span className="block text-[#fe8204] text-[13px] font-semibold mb-1">
                        {product.styling.tattooColorType}
                      </span>
                      <span className="block text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Style</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                  </>
                )}
                <div className="text-center flex-1">
                  <span className="block text-[#fe8204] text-[13px] font-semibold mb-1">12–14 Days</span>
                  <span className="block text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Duration</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-right flex-1">
                  <span className="block text-[#fe8204] text-[13px] font-semibold mb-1">Plant-Based</span>
                  <span className="block text-[9px] text-neutral-600 uppercase tracking-widest font-bold">Formula</span>
                </div>
              </div>
            )}

            {/* ── QUANTITY + CTA BUTTONS ───────────────────── */}
            <div className="flex flex-col gap-3 mb-6">

              {/* Row: quantity stepper + Add to Cart */}
              <div className="flex items-stretch gap-3">

                {/* Quantity stepper */}
                <div className="flex items-center justify-between border border-white/10 bg-white/[0.02] rounded-2xl h-[60px] w-[140px] shrink-0">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-1 h-[60px] border-2 border-white text-white rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-white"
                >
                  {isAdding
                    ? <Loader2 className="w-4 h-4 animate-spin" />
                    : <ShoppingBag className="w-4 h-4" />
                  }
                  Add to Cart
                </button>
              </div>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow || !selectedVariant?.availableForSale}
                className="w-full h-[60px] bg-[#fe8204] text-black rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-[#e07103] transition-colors duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(254,130,4,0.25)] disabled:opacity-40"
              >
                {isBuyingNow && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedVariant?.availableForSale ? "Buy It Now →" : "Out of Stock"}
              </button>

              {/* AR Try-On button (only if overlay image exists) */}
              {product.media?.arOverlayImage && (
                <button
                  onClick={() => setIsCameraAROpen(true)}
                  className="w-full h-[56px] bg-transparent border border-[#fe8204]/30 text-[#fe8204] hover:bg-[#fe8204]/10 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2.5 mt-2"
                >
                  <Camera className="w-4 h-4" />
                  Try On with AR Camera
                </button>
              )}
            </div>

            {/* ── ACCORDION PANELS ─────────────────────────── */}
            <div className="border-t border-white/[0.06] mt-2">

              {/* Description */}
              <AccordionItem
                title="Description"
                isOpen={activeAccordion === "description"}
                onToggle={() => toggleAccordion("description")}
              >
                <div
                  className="prose prose-sm prose-invert max-w-none text-neutral-400 font-medium leading-relaxed text-[14px]"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </AccordionItem>

              {/* Tattoo Details */}
              <AccordionItem
                title="Tattoo Details"
                isOpen={activeAccordion === "details"}
                onToggle={() => toggleAccordion("details")}
              >
                <div className="space-y-3">
                  {product.attributes?.themes?.length > 0 && (
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1.5">Themes</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.themes.map((theme: string, i: number) => (
                          <span key={i} className="bg-white/[0.04] text-neutral-300 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase border border-white/[0.05]">
                            {theme}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.placements?.length > 0 && (
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1.5">Best Placements</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.placements.map((p: string, i: number) => (
                          <span key={i} className="bg-white/[0.04] text-neutral-300 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase border border-white/[0.05]">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.tags?.length > 0 && (
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2.5">Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.attributes.tags.map((tag: string, i: number) => (
                          <span key={i} className="border border-white/10 text-neutral-500 px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>

              {/* How To Apply */}
              <AccordionItem
                title="How To Apply"
                isOpen={activeAccordion === "apply"}
                onToggle={() => toggleAccordion("apply")}
              >
                <ol className="space-y-3 text-[13px] text-neutral-400 font-medium list-decimal pl-4 leading-relaxed">
                  <li>Ensure your skin is clean, dry, and free of makeup or lotions.</li>
                  <li>Remove the clear protective top sheet.</li>
                  <li>Press the tattoo design firmly onto your skin.</li>
                  <li>Hold a wet cloth or sponge against the back for 30 seconds.</li>
                  <li>Gently peel off the paper backing. Let it dry!</li>
                </ol>
              </AccordionItem>

              {/* Shipping & Returns */}
              <AccordionItem
                title="Shipping & Returns"
                isOpen={activeAccordion === "shipping"}
                onToggle={() => toggleAccordion("shipping")}
              >
                <p className="text-[13px] text-neutral-400 font-medium leading-relaxed">
                  Orders process within 1–2 business days. Free shipping on orders over $50.
                  Not completely satisfied? We accept returns within 30 days of purchase for a full refund.
                </p>
              </AccordionItem>
            </div>
            {/* END ACCORDION PANELS */}

          </div>
          {/* END RIGHT COLUMN */}

        </div>
        {/* END TWO-COLUMN GRID */}

      </div>

      {/* ══════════════════════════════════════════════════════
          ZOOM LIGHTBOX MODAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isZoomed && (viewState.type === "skintone" || viewState.type === "gallery" || viewState.type === "angle") && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              className="absolute top-7 right-7 z-10 w-12 h-12 bg-white/5 hover:bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-colors border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Full-size image */}
            <div className="relative flex items-center justify-center w-full h-full max-h-[88vh]">
              <Image
                src={currentImageSrc}
                alt={product.title}
                width={1400}
                height={1400}
                className="w-auto h-full max-h-full object-contain rounded-2xl drop-shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
                priority
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════
          2D CAMERA AR MODAL  (WebRTC Virtual Try-On)
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCameraAROpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col overflow-hidden"
          >
            {/* ── AR Modal Header ───────────────────────────── */}
            <div className="absolute top-0 left-0 w-full h-[88px] bg-gradient-to-b from-black/90 to-transparent z-50 flex items-center justify-between px-6 pt-safe pointer-events-none">

              <button
                onClick={() => setIsCameraAROpen(false)}
                className="px-5 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center gap-2 text-white border border-white/10 transition-colors pointer-events-auto shadow-lg"
              >
                <X className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
              </button>

              <span className="text-white font-black uppercase tracking-[0.3em] text-[10px] drop-shadow-md">
                Studio AR
              </span>

              <button
                onClick={handleSwitchCamera}
                className="w-11 h-11 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/10 transition-colors pointer-events-auto shadow-lg"
                aria-label="Switch Camera"
              >
                <RefreshCcw className="w-4 h-4" />
              </button>

            </div>

            {/* ── Live camera feed ──────────────────────────── */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={clsx(
                "absolute inset-0 w-full h-full object-cover",
                facingMode === "user" ? "scale-x-[-1]" : ""
              )}
            />

            {/* ── Interactive tattoo overlay ────────────────── */}
            {product.media?.arOverlayImage && (
              <InteractiveTattoo
                src={product.media.arOverlayImage}
                videoRef={videoRef}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}