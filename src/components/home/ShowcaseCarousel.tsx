"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Loader2, Minus, Plus, X, RefreshCcw } from "lucide-react";
import clsx from "clsx";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct } from '@/src/lib/shopify';
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveTattoo from "../sections/InteractiveTattoo";

// --- Types ---
interface ShowcaseCarouselProps {
  overline: string;
  titleHighlight: string;
  titleMain: string;
  subtitle?: string;
  viewAllLink: string;
  fetchFunction: () => Promise<FormattedProduct[]>;
  mode: 'product' | 'collection';
}

// --- Scroll Reveal Hook ---
const useScrollReveal = (options = { threshold: 0.15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      options
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
};

// --- Icons ---
const StarIcon = () => (
  <svg className="w-3 h-3 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ArIcon = () => (
  <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const ChevronLeft = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
);

const ChevronRight = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
);

// --- Sub-Components ---
const CarouselCard = ({ item, mode, index, mobileHidden }: { item: FormattedProduct, mode: 'product' | 'collection', index: number, mobileHidden?: boolean }) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const { addToCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // States
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isArMode, setIsArMode] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasDiscount = item.checkout.compareAtPrice && item.checkout.compareAtPrice > item.checkout.price;
  const savedAmount = hasDiscount ? (item.checkout.compareAtPrice! - item.checkout.price) : 0;
  
  const rating = 4.8 + (Math.random() * 0.2); 
  const reviewCount = Math.floor(Math.random() * 5000) + 1000;
  const productUrl = `/products/${item.handle}`;
  
  const featuredImage = item.media.featuredImage || "/placeholder.png";
  const hoverImageSrc = item.media.hoverImage || featuredImage;
  const defaultVariant = item.allVariants?.[0];

  const isEven = index % 2 === 0;
  const hiddenClass = isEven
    ? "-translate-x-[100%] rotate-[15deg]"
    : "translate-x-[100%] -rotate-[15deg] md:-translate-x-[100%] md:rotate-[15deg]";
  const originClass = isEven
    ? "origin-bottom-left"
    : "origin-bottom-right md:origin-bottom-left";

  const handleQtyChange = (type: "increase" | "decrease") => {
    if (type === "decrease" && quantity > 1) setQuantity((q) => q - 1);
    if (type === "increase") setQuantity((q) => q + 1);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!defaultVariant?.variantId) {
      toast.error("Please select a valid option");
      return;
    }
    try {
      setIsAdding(true);
      await addToCart(defaultVariant.variantId, quantity);
    } catch (err) {
      console.error("Failed to add to cart", err);
    } finally {
      setIsAdding(false);
    }
  };

  // --- AR Camera Logic ---
  const handleARClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.media?.arOverlayImage) {
      setIsArMode(true);
    } else {
      toast.info("Stay tuned! AR Try-On for this product is coming soon.", {
        position: 'bottom-center',
        duration: 4000,
        style: { background: '#27272a', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
      });
    }
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isArMode) {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode } })
          .then((s) => {
            stream = s;
            if (videoRef.current) {
              videoRef.current.srcObject = s;
            }
          })
          .catch((err) => {
            console.error("Camera access denied or unavailable:", err);
            toast.error("Camera access is required for AR Try-On. Please check permissions.");
            setIsArMode(false);
          });
      } else {
        toast.error("Camera access is not supported by your browser or requires a secure connection (HTTPS).", {
          position: 'bottom-center'
        });
        setIsArMode(false);
      }
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isArMode, facingMode]);

  return (
    <>
      <div 
        ref={ref}
        className={clsx(
          mobileHidden ? "hidden md:flex" : "flex",
          "w-full max-w-[340px] md:max-w-none md:w-[280px] mx-auto md:mx-0 h-auto flex-shrink-0 group flex-col md:snap-start transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          originClass,
          isVisible ? "opacity-100 translate-x-0 rotate-0" : `opacity-0 ${hiddenClass}`
        )}
      >
        <Link href={productUrl} prefetch={false} className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-zinc-900 mb-4 shadow-[var(--shadow-card)] flex-shrink-0 block cursor-pointer">
          {item.media.featuredImage ? (
            <>
              <Image
                src={featuredImage}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 340px, 280px"
                className="object-cover transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:scale-105"
              />
              <Image
                src={hoverImageSrc}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 340px, 280px"
                loading="lazy"
                className="object-cover absolute inset-0 opacity-0 scale-100 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:scale-105"
              />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-600 uppercase text-xs tracking-widest">
              No Image
            </div>
          )}
        </Link>

        <div className="flex flex-col flex-grow px-1">
          <span className="text-[10px] text-[--color-text-secondary] uppercase tracking-[0.15em]">
            {item.attributes.rawCollections?.[0] || 'Exclusive Collection'}
          </span>
          
          <Link href={productUrl} prefetch={false} className="hover:text-[var(--color-brand-orange)] transition-colors inline-block cursor-pointer">
            <h3 className="text-white font-semibold text-base truncate tracking-wide">
              {item.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <span className="text-xs text-white font-medium ml-1">{rating.toFixed(1)}</span>
            <span className="text-xs text-[--color-text-secondary]">({reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex justify-between items-end mt-2 mb-3">
            {mode === 'product' ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-white font-bold text-lg leading-none">${item.checkout.price.toFixed(0)}</span>
                {hasDiscount && (
                  <>
                    <span className="text-[--color-text-secondary] text-sm line-through leading-none">${item.checkout.compareAtPrice?.toFixed(0)}</span>
                    <span className="text-green-500 text-xs font-semibold tracking-wide leading-none">Save ${savedAmount.toFixed(0)}</span>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-white font-bold text-lg tracking-wide leading-none">from ${item.checkout.price.toFixed(0)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-auto mb-4">
            <div className="flex items-center justify-between bg-zinc-800/80 border border-white/10 rounded-full px-2 w-[80px] shrink-0 h-[40px]">
              <button
                onClick={(e) => { e.preventDefault(); handleQtyChange("decrease"); }}
                className="p-1.5 text-white/40 hover:text-white transition-colors active:scale-90"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3 stroke-[2.5]" />
              </button>
              <span className="font-semibold text-white text-xs select-none tabular-nums">
                {quantity}
              </span>
              <button
                onClick={(e) => { e.preventDefault(); handleQtyChange("increase"); }}
                className="p-1.5 text-white/40 hover:text-white transition-colors active:scale-90"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!item.inventory?.availableForSale || !defaultVariant || isAdding}
              className="flex-1 rounded-full bg-[var(--color-brand-orange)] text-black h-[40px] text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !item.inventory?.availableForSale && item.inventory !== undefined ? (
                "Sold Out"
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 mb-[1px]" />
                  Add to Bag
                </>
              )}
            </button>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-white/5">
             <span className="text-[10px] text-[--color-text-secondary] tracking-wide">12-14 days</span>
             
             <button 
               onClick={handleARClick}
               className="flex items-center text-[--color-brand-purple-light] text-[10px] uppercase font-bold tracking-wider hover:brightness-125 transition-all cursor-pointer"
               aria-label="Try On AR"
             >
               <ArIcon />
               Try On AR
             </button>
          </div>
        </div>
      </div>

      {/* AR Camera Overlay Modal (Using React Portal & Framer Motion) */}
      {isMounted && createPortal(
        <AnimatePresence>
          {isArMode && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black flex flex-col"
            >
              {/* Overlay Navigation Header */}
              <div className="absolute top-0 left-0 right-0 z-[110] flex items-center justify-between px-4 py-6 bg-gradient-to-b from-black/80 to-transparent">
                <button
                  onClick={() => setIsArMode(false)}
                  className="h-11 px-4 bg-black/40 hover:bg-black/60 backdrop-blur-xl rounded-full flex items-center justify-center gap-2 text-white border border-white/10 transition-colors pointer-events-auto shadow-lg"
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

              <div className="relative w-full h-full overflow-hidden bg-zinc-900">
                {/* Live Camera Feed */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={clsx(
                    "absolute inset-0 w-full h-full object-cover scale-[1.02]",
                    facingMode === "user" ? "scale-x-[-1]" : ""
                  )}
                />
                
                {/* Interactive Tattoo Overlay Wrapper */}
                {item.media?.arOverlayImage && (
                  <div className="absolute inset-0 z-20">
                    <InteractiveTattoo
                      src={item.media.arOverlayImage}
                      videoRef={videoRef}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

// --- Main Component ---
export default function ShowcaseCarousel({
  overline,
  titleHighlight,
  titleMain,
  subtitle,
  viewAllLink,
  fetchFunction,
  mode
}: ShowcaseCarouselProps) {
  
  const [items, setItems] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleMobileCount, setVisibleMobileCount] = useState(6);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await fetchFunction();
        setItems(data);
      } catch (error) {
        console.error(`Failed to fetch ${mode} data:`, error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [fetchFunction, mode]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300; 
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-[--color-bg-base] w-full py-20 px-6 md:px-12 lg:px-24 overflow-hidden selection:bg-[--color-brand-orange] selection:text-black">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-10">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex flex-col max-w-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-8 h-[1px] bg-[#FFD700]"></div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#FFD700]">
                {overline}
              </span>
            </div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-[4rem] text-white leading-none">
            {titleHighlight} <span className="text-[var(--color-brand-orange)]">{titleMain}</span>
            </h2>
            
            {subtitle && (
              <p className="mt-4 text-[--color-brand-orange] text-sm md:text-base max-w-md">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-6 self-start md:self-end mt-4 md:mt-0">
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => scroll('left')}
                className="w-10 h-10 rounded-full border border-white/10 flex justify-center items-center text-white hover:border-[var(--color-brand-orange)] hover:text-[--color-brand-orange] transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="w-10 h-10 rounded-full border border-white/10 flex justify-center items-center text-white hover:border-[var(--color-brand-orange)] hover:text-[--color-brand-orange] transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight />
              </button>
            </div>
            <Link 
              href={viewAllLink}
              className="flex items-center gap-2 text-[#FFD700] text-xs font-bold uppercase tracking-widest hover:text-white transition-colors group"
            >
              View All <span className="text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex flex-col md:flex-row items-center md:items-stretch gap-12 md:gap-6 overflow-hidden md:overflow-x-auto md:overflow-y-hidden md:snap-x md:snap-mandatory pb-8 pt-4 -mx-6 px-6 md:-mx-12 md:px-12 lg:-mx-24 lg:px-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {isLoading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="w-full max-w-[340px] md:max-w-none md:w-[280px] mx-auto md:mx-0 h-auto min-h-[400px] flex-shrink-0 flex flex-col md:snap-start">
                <div className="w-full aspect-[4/5] bg-white/5 animate-pulse rounded-[1.5rem] mb-4"></div>
                <div className="flex flex-col flex-grow gap-2 px-1">
                  <div className="w-1/3 h-3 bg-white/5 animate-pulse rounded"></div>
                  <div className="w-2/3 h-5 bg-white/5 animate-pulse rounded"></div>
                  <div className="w-1/2 h-4 bg-white/5 animate-pulse rounded mt-2"></div>
                  <div className="w-full h-8 bg-white/5 animate-pulse rounded mt-auto"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {items.map((item, index) => (
                <CarouselCard 
                  key={item.id} 
                  item={item} 
                  mode={mode} 
                  index={index} 
                  mobileHidden={index >= visibleMobileCount} 
                />
              ))}

              {items.length > visibleMobileCount && (
                <button
                  onClick={() => setVisibleMobileCount(prev => prev + 6)}
                  className="md:hidden w-full max-w-[340px] mx-auto mt-4 rounded-full bg-transparent border border-white/20 text-white px-4 py-3.5 text-xs font-bold tracking-widest hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all duration-300 uppercase"
                >
                  Show More
                </button>
              )}
            </>
          )}
        </div>

      </div>
    </section>
  );
}