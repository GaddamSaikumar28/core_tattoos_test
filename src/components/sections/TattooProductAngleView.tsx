"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Box,
  RotateCcw,
  RotateCw,
  Maximize,
  Play,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RefreshCcw,
  Search,
} from "lucide-react";
import clsx from "clsx";
import { FormattedProduct } from "@/src/lib/shopify";

interface TattooProductAngleViewProps {
  product: FormattedProduct;
}

export default function TattooProductAngleView({ product }: TattooProductAngleViewProps) {
  // ── 1. Advanced Fallback & Data Prep ──────────────────────────
  const angleViews = useMemo(() => {
    const rawAngles = product.media?.angleViews || [];
    
    // If we have actual Shopify metaobject angles, sort and use them
    if (rawAngles.length > 0) {
      return [...rawAngles].sort((a, b) => a.degree - b.degree);
    }

    // FALLBACK: Generate dummy 360 views using the gallery or featured image
    const gallery = product.media?.gallery || [];
    const fallbackImg = product.media?.featuredImage || "/placeholder.png";
    const dummyFrameCount = Math.max(gallery.length, 8); // At least 8 frames for smooth feel

    return Array.from({ length: dummyFrameCount }).map((_, i) => {
      // Loop through available gallery images, or use the single fallback
      const imgUrl = gallery[i % gallery.length]?.url || fallbackImg;
      const degree = Math.round((360 / dummyFrameCount) * i);
      return {
        name: `Angle ${degree}°`,
        degree: degree,
        imageUrl: imgUrl,
      };
    });
  }, [product]);

  // ── 2. State Management ──────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isRotating, setIsRotating] = useState(false);
  
  // Placements state (Dynamic from data)
  const placements = product.attributes?.placements || [];
  const [activePlacement, setActivePlacement] = useState(placements[0] || "");

  const dragStartX = useRef<number | null>(null);
  const currentView = angleViews[currentIndex];

  // ── 3. Drag & Interaction Logic ──────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only allow rotation drag if we are NOT zoomed in
    if (zoomLevel === 100) {
      setIsRotating(true);
      dragStartX.current = e.clientX;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isRotating || dragStartX.current === null || zoomLevel > 100) return;

    const deltaX = e.clientX - dragStartX.current;
    const sensitivity = 12; // Pixels required to trigger frame change

    if (Math.abs(deltaX) > sensitivity) {
      if (deltaX > 0) {
        // Drag right -> rotate left (decrease index)
        setCurrentIndex((prev) => (prev === 0 ? angleViews.length - 1 : prev - 1));
      } else {
        // Drag left -> rotate right (increase index)
        setCurrentIndex((prev) => (prev === angleViews.length - 1 ? 0 : prev + 1));
      }
      dragStartX.current = e.clientX; // Reset start for continuous rotation
    }
  };

  const handlePointerUp = () => {
    setIsRotating(false);
    dragStartX.current = null;
  };

  const handleManualRotate = (direction: "left" | "right") => {
    if (direction === "left") {
      setCurrentIndex((prev) => (prev === 0 ? angleViews.length - 1 : prev - 1));
    } else {
      setCurrentIndex((prev) => (prev === angleViews.length - 1 ? 0 : prev + 1));
    }
  };

  // Preload next/prev images for smoother UX
  useEffect(() => {
    const preloadImg = (index: number) => {
      const img = new window.Image();
      img.src = angleViews[index]?.imageUrl;
    };
    preloadImg((currentIndex + 1) % angleViews.length);
    preloadImg(currentIndex === 0 ? angleViews.length - 1 : currentIndex - 1);
  }, [currentIndex, angleViews]);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-[#050505] py-12 lg:py-16 relative overflow-hidden border-t border-white/[0.04]"
    >
      <div className="container max-w-[1400px] mx-auto px-4 lg:px-8">
        
        {/* ── HEADER ────────────────────────────────────────── */}
        <div className="mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#fe8204]/20 bg-[#fe8204]/10 text-[#fe8204] text-[9px] font-bold uppercase tracking-widest mb-4">
            <Box className="w-3.5 h-3.5" />
            3D Experience
          </div>
          <h2 className="text-[36px] md:text-[48px] lg:text-[64px] font-black text-white leading-none tracking-tight uppercase">
            View From <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fe8204] to-[#ffb347]">Every Angle</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8 xl:gap-12 items-start">
          
          {/* ══════════════════════════════════════════════════
              LEFT — INTERACTIVE VIEWER
          ══════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-6 relative">
            
            {/* Top Tabs (Placements) - Conditionally rendered if data exists */}
            {placements.length > 0 && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 flex justify-center gap-1.5 p-1 bg-[#111]/80 backdrop-blur-md rounded-full border border-white/[0.06]">
                {placements.slice(0, 3).map((placement: string) => (
                  <button
                    key={placement}
                    onClick={() => setActivePlacement(placement)}
                    className={clsx(
                      "px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all duration-300",
                      activePlacement === placement
                        ? "bg-[#fe8204] text-black shadow-[0_0_15px_rgba(254,130,4,0.3)]"
                        : "bg-transparent text-neutral-500 hover:text-white"
                    )}
                  >
                    {placement}
                  </button>
                ))}
              </div>
            )}

            {/* Viewport Container */}
            <div 
              className={clsx(
                "relative w-full aspect-square md:aspect-[4/4.5] bg-[#0a0a0a] rounded-3xl border border-white/[0.06] shadow-2xl overflow-hidden select-none",
                zoomLevel > 100 ? "cursor-grab active:cursor-grabbing touch-pan-x touch-pan-y" : "cursor-ew-resize touch-none"
              )}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
            >
              {/* UI Corner Brackets (Glowing yellow/orange) */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#fe8204]/80 rounded-tl-xl z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(254,130,4,0.4)]" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#fe8204]/80 rounded-tr-xl z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(254,130,4,0.4)]" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#fe8204]/80 rounded-bl-xl z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(254,130,4,0.4)]" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#fe8204]/80 rounded-br-xl z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(254,130,4,0.4)]" />

              {/* Top Drag/Pan Indicator Pill */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none transition-all duration-300">
                <div className="bg-[#fe8204] text-black px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-[0_4px_14px_rgba(254,130,4,0.35)]">
                  {zoomLevel > 100 ? <Maximize className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {zoomLevel > 100 ? "Drag to Pan" : "Drag to Rotate"}
                </div>
              </div>

              {/* Dynamic Images (With Pan Support if Zoomed) */}
              <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                <motion.div
                  drag={zoomLevel > 100}
                  dragConstraints={{ left: -300, right: 300, top: -300, bottom: 300 }}
                  dragElastic={0.1}
                  className="w-full h-full relative flex items-center justify-center"
                  animate={{ scale: zoomLevel / 100 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {angleViews.map((view, idx) => (
                    <Image
                      key={idx}
                      src={view.imageUrl}
                      alt={`${product.title} - ${view.name}`}
                      fill
                      priority={idx === 0 || idx === currentIndex}
                      draggable={false}
                      className={clsx(
                        "object-cover object-center absolute inset-0 pointer-events-none",
                        // Instant switch if dragging for true 360 feel, soft fade if clicking arrows
                        idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
                        isRotating ? "transition-none" : "transition-opacity duration-200"
                      )}
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  ))}
                </motion.div>
              </div>

              {/* Faded Vignette Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.4)_100%)] z-10" />

              {/* Bottom Rotation Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-8 pointer-events-auto">
                <button 
                  onClick={() => handleManualRotate("left")}
                  className="text-[#fe8204] hover:text-white transition-colors hover:scale-110 active:scale-95 p-2"
                  disabled={zoomLevel > 100}
                >
                  <RotateCcw className={clsx("w-5 h-5", zoomLevel > 100 && "opacity-30")} />
                </button>
                <span className="text-[14px] font-black text-white w-10 text-center tabular-nums drop-shadow-md">
                  {currentView?.degree || 0}°
                </span>
                <button 
                  onClick={() => handleManualRotate("right")}
                  className="text-[#fe8204] hover:text-white transition-colors hover:scale-110 active:scale-95 p-2"
                  disabled={zoomLevel > 100}
                >
                  <RotateCw className={clsx("w-5 h-5", zoomLevel > 100 && "opacity-30")} />
                </button>
              </div>
            </div>

            <p className="text-center text-neutral-500 text-[13px] font-medium max-w-md mx-auto leading-relaxed px-4">
              Drag to rotate, pinch or slide to zoom. See exactly how full-sleeve and large tattoos wrap your body before you commit.
            </p>
          </div>

          {/* ══════════════════════════════════════════════════
              RIGHT — CONTROLS & FEATURES
          ══════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-4">
            
            {/* Zoom Slider Panel */}
            <div className="bg-[#0a0a0a] border border-white/[0.04] rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[11px] font-bold text-neutral-400">
                <span>Zoom Level</span>
                <span className="text-[#fe8204]">{zoomLevel}%</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-neutral-500 shrink-0 border border-white/5">
                  <Search className="w-3.5 h-3.5" />
                </div>
                
                <input 
                  type="range"
                  min="100"
                  max="300"
                  step="10"
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/[0.08] rounded-full appearance-none outline-none accent-[#fe8204] cursor-pointer hover:bg-white/[0.15] transition-colors"
                  style={{
                    background: `linear-gradient(to right, #fe8204 0%, #fe8204 ${(zoomLevel - 100) / 2}%, rgba(255,255,255,0.08) ${(zoomLevel - 100) / 2}%, rgba(255,255,255,0.08) 100%)`
                  }}
                />
                
                <div className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-neutral-500 shrink-0 border border-white/5">
                  <ZoomIn className="w-3.5 h-3.5" />
                </div>

                <button 
                  onClick={() => setZoomLevel(100)}
                  className="w-8 h-8 rounded-full bg-white/[0.03] flex items-center justify-center text-neutral-400 hover:text-white hover:bg-white/[0.1] transition-all ml-1 border border-white/10 hover:border-white/20 active:scale-95"
                  title="Reset Zoom"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div className="flex flex-col gap-3">
              {[
                { 
                  title: "Full 360° Rotation", 
                  desc: "Interact with every angle of your design in stunning detail with drag-to-rotate.", 
                  icon: RefreshCcw,
                },
                { 
                  title: "True-to-Size Preview", 
                  desc: "See accurate sizing on a real body model to choose the perfect dimensions.", 
                  icon: Maximize, 
                },
                { 
                  title: "Live AR Try-On", 
                  desc: "Use your camera to see the tattoo on your actual skin in real time.", 
                  icon: Play, 
                },
                { 
                  title: "Full Sleeve Wrap", 
                  desc: "Preview how large sleeve designs flow and wrap around the entire arm.", 
                  icon: Sparkles, 
                },
              ].map((feat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 p-4 rounded-2xl bg-[#0a0a0a] border border-white/[0.04] hover:border-[#fe8204]/20 transition-colors group cursor-default"
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-transparent">
                    <feat.icon className="w-5 h-5 text-[#fe8204] drop-shadow-[0_0_8px_rgba(254,130,4,0.4)]" />
                  </div>
                  <div className="flex flex-col gap-1.5 justify-center">
                    <h4 className="text-[13px] font-bold text-neutral-200 group-hover:text-white transition-colors">{feat.title}</h4>
                    <p className="text-[12px] font-medium text-neutral-500 leading-relaxed pr-2">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="mt-2 w-full h-[56px] bg-gradient-to-r from-[#ffb347] to-[#fe8204] text-black rounded-xl text-[14px] font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(254,130,4,0.25)] relative overflow-hidden group">
              {/* Shine effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              <Sparkles className="w-4 h-4" />
              Launch Full AR Studio
            </button>

          </div>
        </div>
      </div>
    </motion.section>
  );
}