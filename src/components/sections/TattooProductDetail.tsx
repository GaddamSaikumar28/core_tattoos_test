"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Plus,
  Minus,
  ZoomIn,
  X,
  Star,
  Droplets,
  ChevronDown,
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
} from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct, Variant } from "@/src/lib/shopify";

// Bypass React's strict custom element checks for Model Viewer
const ModelViewer = "model-viewer" as any;

interface TattooProductDetailProps {
  product: FormattedProduct;
}

// =========================================================
// TOUCH GESTURE HELPERS (for 2D AR Overlay)
// =========================================================
const getDistance = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAngle = (touches: React.TouchList) => {
  const dx = touches[0].clientX - touches[1].clientX;
  const dy = touches[0].clientY - touches[1].clientY;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};

// =========================================================
// INTERACTIVE 2D AR TATTOO OVERLAY
// =========================================================
const InteractiveTattoo = ({ src }: { src: string }) => {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1, rotate: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const pinchRef = useRef({ initialDist: 0, initialScale: 1, initialAngle: 0, initialRotate: 0 });
  const dragRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, initialX: transform.x, initialY: transform.y };
      setIsDragging(true);
    } else if (e.touches.length === 2) {
      pinchRef.current = { initialDist: getDistance(e.touches), initialScale: transform.scale, initialAngle: getAngle(e.touches), initialRotate: transform.rotate };
    }
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - dragRef.current.startX;
      const dy = e.touches[0].clientY - dragRef.current.startY;
      setTransform((prev) => ({ ...prev, x: dragRef.current.initialX + dx, y: dragRef.current.initialY + dy }));
    } else if (e.touches.length === 2) {
      const scaleDelta = getDistance(e.touches) / pinchRef.current.initialDist;
      const angleDelta = getAngle(e.touches) - pinchRef.current.initialAngle;
      setTransform((prev) => ({ ...prev, scale: pinchRef.current.initialScale * scaleDelta, rotate: pinchRef.current.initialRotate + angleDelta }));
    }
  };

  const onTouchEnd = () => setIsDragging(false);

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden pointer-events-none">
      <div
        className="pointer-events-auto touch-none"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform: `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale}) rotate(${transform.rotate}deg)`, transformOrigin: "center center" }}
      >
        <Image
          src={src}
          alt="AR Tattoo Overlay"
          width={350}
          height={350}
          draggable={false}
          className="w-auto h-auto max-w-[350px] opacity-90 mix-blend-multiply drop-shadow-2xl filter contrast-125"
        />
      </div>
    </div>
  );
};

// =========================================================
// VIEW STATE TYPE
// =========================================================
type ViewState =
  | { type: "3d"; source: any }
  | { type: "skintone"; source: any }
  | { type: "gallery"; source: any; index: number };

// =========================================================
// MAIN COMPONENT
// =========================================================
export default function TattooProductDetail({ product }: TattooProductDetailProps) {
  const { addToCart, buyNow } = useCart();
  // console.log(product,"in the product detail page");
  // ── Data Parsing ──────────────────────────────────────────
  const models = product.media?.models || [];
  const swatches = product.skinToneSwatches || [];
  const rawGallery = product.media?.gallery || [];
  const featuredUrl = product.media?.featuredImage;

  const swatchUrls = swatches.map((s: any) => s.imageUrl);
  const filteredGallery = rawGallery.filter(
    (img: any) => img.url !== featuredUrl && !swatchUrls.includes(img.url),
  );
  const standardImages = [
    ...(featuredUrl ? [{ url: featuredUrl, altText: product.title }] : []),
    ...filteredGallery,
  ];

  const getInitialViewState = (): ViewState => {
    if (models.length > 0) return { type: "3d", source: models[0] };
    if (swatches.length > 0) return { type: "skintone", source: swatches[0] };
    if (standardImages.length > 0) return { type: "gallery", source: standardImages[0], index: 0 };
    return { type: "gallery", source: { url: "/placeholder.png" }, index: 0 };
  };

  // ── State ──────────────────────────────────────────────────
  const [isMounted, setIsMounted] = useState(false);
  const [viewState, setViewState] = useState<ViewState>(getInitialViewState());
  const [activeSkinTone, setActiveSkinTone] = useState<string | null>(swatches[0]?.hexCode || null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  // 3D & AR
  const [modelLoaded, setModelLoaded] = useState(false);
  const [arSupported, setArSupported] = useState(false);
  const [isCameraAROpen, setIsCameraAROpen] = useState(false);
  const modelViewerRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cart & Variants
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const variants = product.allVariants || [];
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.find((v) => v.availableForSale) || variants[0] || null,
  );

  // Pricing
  const price = selectedVariant ? Number(selectedVariant.price) : product.checkout.price;
  const compareAtPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : product.checkout.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  const discount =
    product.checkout.discountPercentage ||
    (isOnSale && compareAtPrice > 0 ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0);
  const savingsAmount = isOnSale ? (compareAtPrice - price).toFixed(0) : 0;

  // Social Proof / Scarcity
  const viewingNow = useMemo(() => Math.floor(Math.random() * (3000 - 1500 + 1) + 1500), []);
  const stockLevel = product.inventory?.stockLevel ?? 153;
  const soldThisWeek = Math.max(100, 1000 - stockLevel);
  const scarcityPct = Math.min((soldThisWeek / (soldThisWeek + stockLevel)) * 100, 95);

  // Thumbnails
  const thumbnails: any[] = [];
  if (models.length > 0) {
    thumbnails.push({ type: "3d", thumbUrl: standardImages[0]?.url || "/placeholder.png", source: models[0] });
  }
  if (swatches.length > 0) {
    const activeSwatch = swatches.find((s: any) => s.hexCode === activeSkinTone) || swatches[0];
    thumbnails.push({ type: "skintone", thumbUrl: activeSwatch.imageUrl, source: activeSwatch });
  }
  standardImages.forEach((img, index) => {
    thumbnails.push({ type: "gallery", thumbUrl: img.url || "/placeholder.png", source: img, index });
  });

  // ── Effects ───────────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
    if (models.length > 0) {
      import("@google/model-viewer").then(() => {
        customElements.whenDefined("model-viewer").then(() => {
          const mv = modelViewerRef.current as any;
          if (mv) {
            mv.addEventListener("load", () => setModelLoaded(true));
            if (typeof mv.canActivateAR !== "undefined") setArSupported(mv.canActivateAR);
          }
        });
      });
    }
  }, [models]);

  useEffect(() => {
    document.body.style.overflow = isZoomed || isCameraAROpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isZoomed, isCameraAROpen]);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const startCamera = async () => {
      if (!isCameraAROpen || !videoRef.current) return;
      if (!navigator?.mediaDevices?.getUserMedia) {
        toast.error("Camera access requires a secure connection (HTTPS).");
        setIsCameraAROpen(false);
        return;
      }
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (videoRef.current) videoRef.current.srcObject = activeStream;
      } catch {
        toast.error("Unable to access camera. Please check permissions.");
        setIsCameraAROpen(false);
      }
    };
    startCamera();
    return () => { if (activeStream) activeStream.getTracks().forEach((t) => t.stop()); };
  }, [isCameraAROpen]);

  // ── Handlers ──────────────────────────────────────────────
  const handleQuantityChange = (type: "increase" | "decrease") => {
    setQuantity((prev) => (type === "increase" ? prev + 1 : prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.variantId) return toast.error("Please select an option");
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.variantId, quantity);
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.variantId) return toast.error("Please select an option");
    setIsBuyingNow(true);
    try {
      const checkoutUrl = await buyNow(selectedVariant.variantId, quantity);
      if (checkoutUrl) window.location.href = checkoutUrl;
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleTriggerAR = () => {
    if (viewState.type === "3d") {
      const mv = modelViewerRef.current as any;
      if (mv?.canActivateAR) {
        mv.activateAR();
      } else {
        toast.error("3D AR is not supported on this device.");
      }
    } else {
      if (product.media?.arOverlayImage) {
        setIsCameraAROpen(true);
      } else {
        toast.info("Stay tuned! AR Try-On for this product is coming soon.", {
          position: "bottom-center",
          duration: 4000,
          style: { background: "#111", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" },
        });
      }
    }
  };

  const toggleAccordion = (id: string) => setActiveAccordion((prev) => (prev === id ? null : id));

  if (!isMounted) return null;

  // ── Current image src for modals ──────────────────────────
  const currentImageSrc =
    viewState.type === "skintone" ? viewState.source.imageUrl : viewState.source.url;

  return (
    <div className="bg-[#080808] min-h-screen pt-[130px] lg:pt-[150px] pb-12 selection:bg-[#fe8204] selection:text-white font-sans">
      <div className="container max-w-[1400px] mx-auto px-4 lg:px-8">

        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-neutral-600 mb-8">
          <a href="/" className="hover:text-white transition-colors">Home</a>
          <span className="text-neutral-700">/</span>
          <a href="/collections/" className="hover:text-white transition-colors">Shop All</a>
          <span className="text-neutral-700">/</span>
          <span className="text-neutral-400 truncate max-w-[160px] sm:max-w-none">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 xl:gap-20 items-start">

          {/* ══════════════════════════════════════════════════
              LEFT — MEDIA VIEWER
          ══════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-5 lg:sticky lg:top-28">

            {/* ── Main Canvas ─────────────────────────────── */}
            <div className="relative w-full aspect-[4/5] rounded-3xl bg-[#0d0d0d] border border-white/[0.06] overflow-hidden shadow-[0_32px_80px_rgba(0,0,0,0.6)]">

              {/* ── Top floating row: social proof + wishlist ─ */}
              <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start pointer-events-none">
                <div className="flex flex-col gap-2.5">
                  {/* Live viewers badge */}
                  <div className="bg-black/70 backdrop-blur-md rounded-full px-3.5 py-2 flex items-center gap-2 border border-white/10 w-fit shadow-lg pointer-events-auto">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#4ade80]" />
                    <span className="text-[10px] font-semibold text-neutral-300">{viewingNow.toLocaleString()} viewing now</span>
                  </div>
                  {/* Limited drop + product badges */}
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
                {/* Wishlist */}
                <button
                  onClick={() => setIsWishlisted((w) => !w)}
                  className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors shadow-lg pointer-events-auto"
                >
                  <Heart className={clsx("w-4 h-4 transition-all duration-300", isWishlisted ? "fill-[#fe8204] text-[#fe8204]" : "text-white")} />
                </button>
              </div>

              {/* ── Dynamic media ─────────────────────────── */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewState.type + (viewState.type === "gallery" ? viewState.index : "")}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative w-full h-full"
                >
                  {/* 3D Model */}
                  {viewState.type === "3d" && (
                    <div className="w-full h-full">
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

                  {/* 2D Image (skin tone or gallery) */}
                  {(viewState.type === "skintone" || viewState.type === "gallery") && (
                    <div
                      className="w-full h-full cursor-zoom-in"
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

              {/* Bottom vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-transparent to-transparent opacity-80 pointer-events-none" />

              {/* ── Scarcity bar ────────────────────────── */}
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

              {/* ── Bottom action row: AR + Zoom ─────────── */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
                <button
                  onClick={handleTriggerAR}
                  className="flex items-center gap-2.5 px-5 py-2.5 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 rounded-full text-white text-[11px] font-bold uppercase tracking-widest transition-all duration-300 hover:border-[#fe8204]/50"
                >
                  <Camera className="w-3.5 h-3.5 text-[#fe8204]" />
                  {viewState.type === "3d" ? "AR View" : "Try On"}
                </button>

                {(viewState.type === "skintone" || viewState.type === "gallery") && (
                  <button
                    onClick={() => setIsZoomed(true)}
                    className="w-10 h-10 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/15 rounded-full flex items-center justify-center text-white transition-all duration-300"
                    aria-label="Zoom image"
                  >
                    <Focus className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* ── Skin-tone swatch bar ─────────────────────── */}
            {swatches.length > 0 && (
              <div className="flex items-center justify-center gap-4">
                <span className="text-[9px] font-bold tracking-[0.15em] uppercase text-neutral-600 shrink-0">Skin Tone</span>
                <div className="flex items-center gap-2.5">
                  {swatches.map((swatch: any) => (
                    <button
                      key={swatch.hexCode}
                      onClick={() => {
                        setActiveSkinTone(swatch.hexCode);
                        setViewState({ type: "skintone", source: swatch });
                      }}
                      className={clsx(
                        "w-7 h-7 rounded-full border-2 transition-all duration-300",
                        activeSkinTone === swatch.hexCode
                          ? "border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.2)]"
                          : "border-transparent hover:scale-110 hover:border-white/40 opacity-60 hover:opacity-100",
                      )}
                      style={{ backgroundColor: swatch.hexCode }}
                      aria-label={`Skin tone ${swatch.hexCode}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Thumbnails strip ──────────────────────────── */}
            {thumbnails.length > 1 && (
              <div className="flex flex-row gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {thumbnails.map((thumb: any, idx: number) => {
                  const isActive =
                    (thumb.type === "3d" && viewState.type === "3d") ||
                    (thumb.type === "skintone" && viewState.type === "skintone") ||
                    (thumb.type === "gallery" && viewState.type === "gallery" && viewState.index === thumb.index);

                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setViewState(
                          thumb.type === "gallery"
                            ? { type: "gallery", source: thumb.source, index: thumb.index }
                            : { type: thumb.type as any, source: thumb.source },
                        )
                      }
                      className={clsx(
                        "relative w-[72px] h-[90px] shrink-0 rounded-xl overflow-hidden bg-[#111] border-2 transition-all duration-300",
                        isActive
                          ? "border-[#fe8204] shadow-[0_0_12px_rgba(254,130,4,0.25)]"
                          : "border-white/[0.07] hover:border-white/20 opacity-60 hover:opacity-100",
                      )}
                    >
                      {thumb.type === "3d" && (
                        <div className="absolute inset-0 bg-black/50 z-10 flex flex-col items-center justify-center gap-1">
                          <Box className="w-4 h-4 text-[#fe8204]" />
                          <span className="text-[7px] font-black text-white uppercase tracking-wider">3D</span>
                        </div>
                      )}
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
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT — PRODUCT INFO
          ══════════════════════════════════════════════════ */}
          <div className="flex flex-col py-2">

            {/* ── Header ──────────────────────────────────── */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[9px] font-black text-[#fe8204] uppercase tracking-[0.15em] bg-[#fe8204]/10 px-2.5 py-1 rounded-md border border-[#fe8204]/15">
                    {product.vendor}
                  </span>
                  {product.styling?.tattooColorType && (
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.15em] bg-white/[0.06] px-2.5 py-1 rounded-md border border-white/10">
                      {product.styling.tattooColorType}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-[#fe8204] text-[#fe8204]" />
                  ))}
                  <span className="text-[10px] text-neutral-500 font-semibold ml-1.5">4.9 (3,241)</span>
                </div>
              </div>

              <h1 className="text-[32px] md:text-[40px] lg:text-[42px] font-bold text-white leading-[1.1] tracking-tight mb-2">
                {product.title}
              </h1>

              {/* Short description */}
              <p className="text-[14px] text-neutral-500 leading-relaxed font-medium line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* ── Trust micro-badges ───────────────────────── */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
              {[
                { icon: Lock, label: "Secure Pay" },
                { icon: Truck, label: "Ships in 24h" },
                { icon: RotateCcw, label: "Free Returns" },
                { icon: Leaf, label: "Plant-Based" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-neutral-600">
                  <badge.icon className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{badge.label}</span>
                </div>
              ))}
            </div>

            {/* ── Price & Inventory ────────────────────────── */}
            <div className="mb-4 pb-4 border-b border-white/[0.06]">
              {isOnSale && (
                <div className="mb-1.5">
                  <span className="inline-block bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide border border-emerald-500/15">
                    Save ${savingsAmount}
                  </span>
                </div>
              )}
              <div className="flex items-end gap-4 flex-wrap">
                <span className="text-[44px] font-bold text-white tracking-tight leading-none">
                  ${price.toFixed(2)}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-2xl font-medium text-neutral-600 line-through mb-1">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-500/15 text-red-400 px-3 py-1 text-[11px] font-black uppercase tracking-widest rounded-full mb-1.5 border border-red-500/20">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <div className="mt-1.5">
                {stockLevel > 0 && stockLevel < 10 ? (
                  <div className="flex items-center gap-1.5 text-red-400">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      Low Stock — Only {stockLevel} left!
                    </span>
                  </div>
                ) : product.inventory?.inStock ? (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                    ✓ In Stock & Ready to Ship
                  </span>
                ) : null}
              </div>
            </div>

            {/* ── Variants ─────────────────────────────────── */}
            {variants.length > 1 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Select Option
                  </h3>
                  {selectedVariant && !selectedVariant.availableForSale && (
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Out of Stock</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((v) => (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        "px-5 py-3 rounded-xl text-[12px] font-bold uppercase tracking-wider transition-all duration-200 border-2",
                        selectedVariant?.variantId === v.variantId
                          ? "border-[#fe8204] bg-[#fe8204] text-black shadow-[0_0_18px_rgba(254,130,4,0.25)]"
                          : "border-white/10 bg-transparent text-neutral-400 hover:border-white/30 hover:text-white",
                      )}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Feature grid ─────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-white/[0.06]">
              {[
                { icon: Droplets, text: "Waterproof 12–14 Days" },
                { icon: Clock, text: "Lasts 1–2 Weeks" },
                { icon: ShieldCheck, text: "Skin Safe Formula" },
                { icon: Sparkles, text: "Realistic Look" },
              ].map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
                >
                  <feat.icon className="w-4 h-4 text-[#fe8204] shrink-0" />
                  <span className="text-[11px] font-semibold text-neutral-300">{feat.text}</span>
                </div>
              ))}
            </div>

            {/* ── Tattoo specs row ─────────────────────────── */}
            {(product.attributes?.placements?.length > 0 || product.styling?.tattooColorType) && (
              <div className="flex items-center justify-between py-4 border-b border-white/[0.06] mb-2">
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

            {/* ── Quantity + CTA ───────────────────────────── */}
            <div className="flex flex-col gap-2 mb-5">

              {/* Row: qty selector + add to cart */}
              <div className="flex items-stretch gap-3">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-white/10 bg-white/[0.03] rounded-xl h-[56px] w-[130px] shrink-0">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="w-12 h-full flex items-center justify-center text-neutral-500 hover:text-white transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-1 h-[56px] border-2 border-white text-white rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
                  Add to Cart
                </button>
              </div>

              {/* Buy now */}
              <button
                onClick={handleBuyNow}
                disabled={isBuyingNow || !selectedVariant?.availableForSale}
                className="w-full h-[56px] bg-[#fe8204] text-black rounded-xl text-[13px] font-black uppercase tracking-widest hover:bg-[#e07103] transition-colors duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(254,130,4,0.25)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isBuyingNow && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedVariant?.availableForSale ? "Buy It Now →" : "Out of Stock"}
              </button>

              {/* AR Camera try-on (always visible if overlay exists) */}
              {product.media?.arOverlayImage && (
                <button
                  onClick={() => setIsCameraAROpen(true)}
                  className="w-full h-[52px] bg-transparent border border-[#fe8204]/30 text-[#fe8204] hover:bg-[#fe8204]/8 rounded-xl text-[12px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2.5"
                >
                  <Camera className="w-4 h-4" />
                  Try On with AR Camera
                </button>
              )}
            </div>

            {/* ── Accordions ───────────────────────────────── */}
            <div className="border-t border-white/[0.06]">
              <AccordionItem
                title="Description"
                isOpen={activeAccordion === "description"}
                onToggle={() => toggleAccordion("description")}
              >
                <div
                  className="prose prose-sm prose-invert max-w-none text-neutral-500 font-medium leading-relaxed text-[14px]"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </AccordionItem>

              <AccordionItem
                title="Tattoo Details"
                isOpen={activeAccordion === "details"}
                onToggle={() => toggleAccordion("details")}
              >
                <div className="space-y-2">
                  {product.attributes?.themes?.length > 0 && (
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1">Themes</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.themes.map((theme: string, i: number) => (
                          <span key={i} className="bg-white/[0.06] text-neutral-300 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase border border-white/[0.06]">{theme}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.placements?.length > 0 && (
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-1">Best Placements</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.placements.map((p: string, i: number) => (
                          <span key={i} className="bg-white/[0.06] text-neutral-300 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase border border-white/[0.06]">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.tags?.length > 0 && (
                    <div>
                      <span className="block text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-2.5">Tags</span>
                      <div className="flex flex-wrap gap-1.5">
                        {product.attributes.tags.map((tag: string, i: number) => (
                          <span key={i} className="border border-white/10 text-neutral-500 px-2.5 py-1 rounded text-[10px] font-bold uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>

              <AccordionItem
                title="How To Apply"
                isOpen={activeAccordion === "apply"}
                onToggle={() => toggleAccordion("apply")}
              >
                <ol className="space-y-3 text-[13px] text-neutral-500 font-medium list-decimal pl-4 leading-relaxed">
                  <li>Ensure your skin is clean, dry, and free of makeup or lotions.</li>
                  <li>Remove the clear protective top sheet.</li>
                  <li>Press the tattoo design firmly onto your skin.</li>
                  <li>Hold a wet cloth or sponge against the back for 30 seconds.</li>
                  <li>Gently peel off the paper backing. Let it dry!</li>
                </ol>
              </AccordionItem>

              <AccordionItem
                title="Shipping & Returns"
                isOpen={activeAccordion === "shipping"}
                onToggle={() => toggleAccordion("shipping")}
              >
                <p className="text-[13px] text-neutral-500 font-medium leading-relaxed">
                  Orders process within 1–2 business days. Free shipping on orders over $50.
                  Not completely satisfied? We accept returns within 30 days of purchase for a full refund.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          ZOOM MODAL
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isZoomed && (viewState.type === "skintone" || viewState.type === "gallery") && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              className="absolute top-7 right-7 z-10 w-12 h-12 bg-white/[0.07] hover:bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
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
          2D CAMERA AR MODAL (WebRTC Virtual Try-On)
      ══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isCameraAROpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center overflow-hidden"
          >
            <button
              onClick={() => setIsCameraAROpen(false)}
              className="absolute top-7 right-7 z-50 w-12 h-12 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/15 hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Live feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Interactive tattoo overlay */}
            {product.media?.arOverlayImage && (
              <InteractiveTattoo src={product.media.arOverlayImage} />
            )}

            {/* HUD instructions */}
            <div className="absolute bottom-12 left-0 w-full z-20 flex justify-center pointer-events-none">
              <div className="bg-black/70 backdrop-blur-md border border-white/15 px-6 py-3 rounded-full flex items-center gap-2.5 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-[#fe8204]" />
                <p className="text-white text-[10px] font-bold tracking-widest uppercase">
                  Point camera at skin · Pinch to resize · Drag to reposition
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// ACCORDION COMPONENT
// =========================================================
function AccordionItem({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
      <button
        onClick={onToggle}
        className="w-full py-3 flex items-center justify-between group outline-none"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 group-hover:text-white transition-colors duration-200">
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors duration-200" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}