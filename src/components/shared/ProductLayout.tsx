// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { ChevronDown, ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
// import clsx from "clsx";
// import Image from "next/image";
// import { toast } from "sonner";
// import { useCart } from "@/src/context/CartContext";
// import { FormattedProduct, Variant } from "@/src/lib/shopify";

// // --- Icons (from ShowcaseCarousel) ---
// const StarIcon = () => (
//   <svg className="w-3 h-3 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
//     <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//   </svg>
// );

// const ArIcon = () => (
//   <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
//   </svg>
// );

// // --- Hook (Unchanged) ---
// const useScrollReveal = (options = { threshold: 0.15 }) => {
//   const ref = useRef<HTMLDivElement>(null);
//   const [isVisible, setIsVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(([entry]) => {
//       if (entry.isIntersecting) {
//         setIsVisible(true);
//         observer.unobserve(entry.target);
//       }
//     }, options);

//     if (ref.current) observer.observe(ref.current);
//     return () => {
//       if (ref.current) observer.unobserve(ref.current);
//     };
//   }, [options]);

//   return [ref, isVisible] as const;
// };

// // --- Types ---
// interface ProductCardProps {
//   item: FormattedProduct;
//   viewMode: "grid" | "list";
//   page: string;
//   index: number;
//   priority?: boolean;
// }
// const getDeterministicMockData = (id: string) => {
//   let hash = 0;
//   for (let i = 0; i < id.length; i++) {
//     hash = id.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const positiveHash = Math.abs(hash);
  
//   return { 
//     rating: 4.8 + ((positiveHash % 20) / 100),
//     reviewCount: 1000 + (positiveHash % 5000)
//   };
// };

// export function ProductCard({ item, viewMode, page, index , priority = false }: ProductCardProps) {
//   const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

//   const isList = viewMode === "list";
//   const variants = item.allVariants || [];

//   const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
//     variants.length > 0 ? variants[0] : null,
//   );

//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);
//   const { addToCart } = useCart();

//   // Price calculations
//   const currentPrice = selectedVariant
//     ? Number(selectedVariant.price)
//     : Number(item.checkout.price);
//   const originalPrice = selectedVariant?.compareAtPrice
//     ? Number(selectedVariant.compareAtPrice)
//     : null;
//   const hasDiscount = originalPrice !== null && originalPrice > currentPrice;
//   const savedAmount = hasDiscount ? (originalPrice! - currentPrice) : 0;

//   // Mock data for showcase design replica
//   // const rating = 4.8 + (Math.random() * 0.2); 
//   // const reviewCount = Math.floor(Math.random() * 5000) + 1000;
//   const { rating, reviewCount } = getDeterministicMockData(item.id);

//   const image = item.media.featuredImage || "/placeholder.png";
//   const hoverImage = item.media.hoverImage || image;

//   const productUrl = `/products/${item.handle}`;
//   const displayBadge = item.styling.badges?.[0];

//   const handleQuantityChange = (type: "increase" | "decrease") => {
//     if (type === "decrease" && quantity > 1) setQuantity((q) => q - 1);
//     if (type === "increase") setQuantity((q) => q + 1);
//   };

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.preventDefault();
//     if (!selectedVariant?.variantId) {
//       toast.error("Please select a valid option");
//       return;
//     }
//     try {
//       setIsAdding(true);
//       await addToCart(selectedVariant.variantId, quantity);
//     } catch (error) {
//       console.error("Failed to add to cart", error);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleARClick = (e: React.MouseEvent) => {
//     e.preventDefault();
//     // Add your AR logic/modal trigger here
//     toast.success("AR View triggered!");
//   };

//   const isEven = index % 2 === 0;
//   const hiddenTransformClasses = isEven
//     ? "-translate-x-[100%] rotate-[15deg]"
//     : "translate-x-[100%] -rotate-[15deg] md:-translate-x-[100%] md:rotate-[15deg]";

//   const originClass = isEven
//     ? "origin-bottom-left"
//     : "origin-bottom-right md:origin-bottom-left";

//   const mainAltText = item.title 
//     ? `${item.title} high-quality temporary tattoo design`
//     : 'Realistic temporary tattoo design on white background';

//   return (
//     <div
//       ref={ref}
//       className={clsx(
//         "group flex transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
//         "h-full", // Ensures card takes full height of the parent container
//         originClass,
//         isVisible
//           ? "opacity-100 translate-x-0 rotate-0"
//           : `opacity-0 ${hiddenTransformClasses}`,
//         isList
//           ? "flex-row h-auto gap-4 sm:gap-6 items-center sm:items-stretch"
//           : "flex-col", // Removed gap to control spacing inside content area like Showcase
//       )}
//     >
//       {/* 1. Image Area (Showcase Styling) */}
//       <Link
//         href={productUrl}
//         prefetch={false}
//         className={clsx(
//           "relative bg-zinc-900 rounded-[1.5rem] overflow-hidden shrink-0 shadow-[var(--shadow-card)] block cursor-pointer",
//           isList
//             ? "w-[40%] sm:w-60 aspect-[4/5] sm:aspect-square"
//             : "w-full aspect-[4/5] mb-4", // mb-4 mimics Showcase
//         )}
//       >
//         <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex flex-col gap-2">
//           {displayBadge && (
//             <div className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
//               {displayBadge.label}
//             </div>
//           )}
//         </div>

//         <Image
//           src={image}
//           alt={mainAltText}
//           fill
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           priority={priority}
//           className="object-cover transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:scale-105"
//         />
//         <Image
//           src={hoverImage}
//           alt={mainAltText}
//           fill
//           sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//           loading="lazy"
//           className="object-cover absolute inset-0 opacity-0 scale-100 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:scale-105"
//         />
//       </Link>

//       {/* 2. Content Area (Showcase Styling) */}
//       <div
//         className={clsx(
//           "flex flex-col flex-grow min-w-0 px-1",
//           isList ? "justify-center py-2 pr-2 sm:pr-4" : "",
//         )}
//       >
//         <span className="text-[10px] text-[--color-text-secondary] uppercase tracking-[0.15em]">
//           {item.attributes.themes?.[0] || 'Exclusive Collection'}
//         </span>
        
//         {/* Clickable Title for View Details redirect */}
//         <Link href={productUrl} prefetch={false} className="hover:text-[var(--color-brand-orange)] transition-colors mt-0.5 inline-block cursor-pointer">
//           <h3 className="text-white font-semibold text-base truncate tracking-wide">
//             {item.title}
//           </h3>
//         </Link>

//         {/* Rating Row */}
//         <div className="flex items-center gap-1.5 mt-0.5">
//           <div className="flex">
//             {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
//           </div>
//           <span className="text-xs text-white font-medium ml-1">{rating.toFixed(1)}</span>
//           <span className="text-xs text-[--color-text-secondary]">({reviewCount.toLocaleString()})</span>
//         </div>

//         {/* Price Row */}
//         <div className="flex justify-between items-end mt-2 mb-3">
//           <div className="flex flex-wrap items-center gap-2">
//             <span className="text-white font-bold text-lg leading-none">${currentPrice.toFixed(0)}</span>
//             {hasDiscount && (
//               <>
//                 <span className="text-[--color-text-secondary] text-sm line-through leading-none">${originalPrice.toFixed(0)}</span>
//                 <span className="text-green-500 text-xs font-semibold tracking-wide leading-none">Save ${savedAmount.toFixed(0)}</span>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Controls Block (Pushed to bottom) */}
//         <div className="flex flex-col mt-auto gap-3">
          
//           {/* Variant Dropdown styled for dark theme */}
//           {variants.length > 1 && (
//             <div className="relative w-full">
//               <select
//                 className="w-full appearance-none bg-zinc-800/80 text-white border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-[11px] font-semibold tracking-widest uppercase outline-none cursor-pointer hover:border-white/30 focus:border-[var(--color-brand-orange)] transition-colors"
//                 value={selectedVariant ? selectedVariant.variantId : ""}
//                 onChange={(e) =>
//                   setSelectedVariant(
//                     variants.find((v) => v.variantId === e.target.value) || null,
//                   )
//                 }
//               >
//                 <option value="" disabled>Select Option</option>
//                 {variants.map((v) => (
//                   <option key={v.variantId} value={v.variantId}>
//                     {v.title}
//                   </option>
//                 ))}
//               </select>
//               <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
//                 <ChevronDown className="w-4 h-4 stroke-[2.5]" />
//               </div>
//             </div>
//           )}

//           {/* Counter & Add to Bag (Showcase Styling) */}
//           <div className="flex gap-2 mb-4">
//             <div className="flex items-center justify-between bg-zinc-800/80 border border-white/10 rounded-full px-2 w-[80px] shrink-0 h-[40px]">
//               <button
//                 onClick={(e) => { e.preventDefault(); handleQuantityChange("decrease"); }}
//                 className="p-1.5 text-white/40 hover:text-white transition-colors active:scale-90"
//                 aria-label="Decrease quantity"
//               >
//                 <Minus className="w-3 h-3 stroke-[2.5]" />
//               </button>
//               <span className="font-semibold text-white text-xs select-none tabular-nums">
//                 {quantity}
//               </span>
//               <button
//                 onClick={(e) => { e.preventDefault(); handleQuantityChange("increase"); }}
//                 className="p-1.5 text-white/40 hover:text-white transition-colors active:scale-90"
//                 aria-label="Increase quantity"
//               >
//                 <Plus className="w-3 h-3 stroke-[2.5]" />
//               </button>
//             </div>

//             <button
//               onClick={handleAddToCart}
//               disabled={!item.inventory?.availableForSale || !selectedVariant || isAdding}
//               className="flex-1 rounded-full bg-[var(--color-brand-orange)] text-black h-[40px] text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
//             >
//               {isAdding ? (
//                 <Loader2 className="w-4 h-4 animate-spin" />
//               ) : !item.inventory?.availableForSale ? (
//                 "Sold Out"
//               ) : (
//                 <>
//                   <ShoppingCart className="w-3.5 h-3.5 mb-[1px]" />
//                   Add to Bag
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Footer info (Shipping & Clickable AR) */}
//         <div className="flex justify-between items-center pt-3 border-t border-white/5">
//            <span className="text-[10px] text-[--color-text-secondary] tracking-wide">12-14 days</span>
           
//            <button 
//              onClick={handleARClick}
//              className="flex items-center text-[--color-brand-purple-light] text-[10px] uppercase font-bold tracking-wider hover:brightness-125 transition-all cursor-pointer"
//              aria-label="Try On AR"
//            >
//              <ArIcon />
//              Try On AR
//            </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ShoppingCart, Loader2, Minus, Plus, X } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct, Variant } from "@/src/lib/shopify";

// --- Icons (from ShowcaseCarousel) ---
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

// --- Hook (Unchanged) ---
const useScrollReveal = (options = { threshold: 0.15 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [options]);

  return [ref, isVisible] as const;
};

// --- Types ---
interface ProductCardProps {
  item: FormattedProduct;
  viewMode: "grid" | "list";
  page: string;
  index: number;
  priority?: boolean;
}

const getDeterministicMockData = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);
  
  return { 
    rating: 4.8 + ((positiveHash % 20) / 100),
    reviewCount: 1000 + (positiveHash % 5000)
  };
};

export function ProductCard({ item, viewMode, page, index , priority = false }: ProductCardProps) {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });

  const isList = viewMode === "list";
  const variants = item.allVariants || [];

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.length > 0 ? variants[0] : null,
  );

  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  // AR States
  const [isArMode, setIsArMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Price calculations
  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(item.checkout.price);
  const originalPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : null;
  const hasDiscount = originalPrice !== null && originalPrice > currentPrice;
  const savedAmount = hasDiscount ? (originalPrice! - currentPrice) : 0;

  // Mock data for showcase design replica
  const { rating, reviewCount } = getDeterministicMockData(item.id);

  const image = item.media.featuredImage || "/placeholder.png";
  const hoverImage = item.media.hoverImage || image;

  const productUrl = `/products/${item.handle}`;
  const displayBadge = item.styling.badges?.[0];

  const handleQuantityChange = (type: "increase" | "decrease") => {
    if (type === "decrease" && quantity > 1) setQuantity((q) => q - 1);
    if (type === "increase") setQuantity((q) => q + 1);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!selectedVariant?.variantId) {
      toast.error("Please select a valid option");
      return;
    }
    try {
      setIsAdding(true);
      await addToCart(selectedVariant.variantId, quantity);
    } catch (error) {
      console.error("Failed to add to cart", error);
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

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isArMode) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
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
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isArMode]);

  const isEven = index % 2 === 0;
  const hiddenTransformClasses = isEven
    ? "-translate-x-[100%] rotate-[15deg]"
    : "translate-x-[100%] -rotate-[15deg] md:-translate-x-[100%] md:rotate-[15deg]";

  const originClass = isEven
    ? "origin-bottom-left"
    : "origin-bottom-right md:origin-bottom-left";

  const mainAltText = item.title 
    ? `${item.title} high-quality temporary tattoo design`
    : 'Realistic temporary tattoo design on white background';

  return (
    <>
      <div
        ref={ref}
        className={clsx(
          "group flex transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
          "h-full", 
          originClass,
          isVisible
            ? "opacity-100 translate-x-0 rotate-0"
            : `opacity-0 ${hiddenTransformClasses}`,
          isList
            ? "flex-row h-auto gap-4 sm:gap-6 items-center sm:items-stretch"
            : "flex-col", 
        )}
      >
        {/* 1. Image Area (Showcase Styling) */}
        <Link
          href={productUrl}
          prefetch={false}
          className={clsx(
            "relative bg-zinc-900 rounded-[1.5rem] overflow-hidden shrink-0 shadow-[var(--shadow-card)] block cursor-pointer",
            isList
              ? "w-[40%] sm:w-60 aspect-[4/5] sm:aspect-square"
              : "w-full aspect-[4/5] mb-4", 
          )}
        >
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex flex-col gap-2">
            {displayBadge && (
              <div className="bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                {displayBadge.label}
              </div>
            )}
          </div>

          <Image
            src={image}
            alt={mainAltText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={priority}
            className="object-cover transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:scale-105"
          />
          <Image
            src={hoverImage}
            alt={mainAltText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            className="object-cover absolute inset-0 opacity-0 scale-100 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-100 group-hover:scale-105"
          />
        </Link>

        {/* 2. Content Area (Showcase Styling) */}
        <div
          className={clsx(
            "flex flex-col flex-grow min-w-0 px-1",
            isList ? "justify-center py-2 pr-2 sm:pr-4" : "",
          )}
        >
          <span className="text-[10px] text-[--color-text-secondary] uppercase tracking-[0.15em]">
            {item.attributes.themes?.[0] || 'Exclusive Collection'}
          </span>
          
          <Link href={productUrl} prefetch={false} className="hover:text-[var(--color-brand-orange)] transition-colors mt-0.5 inline-block cursor-pointer">
            <h3 className="text-white font-semibold text-base truncate tracking-wide">
              {item.title}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
            </div>
            <span className="text-xs text-white font-medium ml-1">{rating.toFixed(1)}</span>
            <span className="text-xs text-[--color-text-secondary]">({reviewCount.toLocaleString()})</span>
          </div>

          <div className="flex justify-between items-end mt-2 mb-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-white font-bold text-lg leading-none">${currentPrice.toFixed(0)}</span>
              {hasDiscount && (
                <>
                  <span className="text-[--color-text-secondary] text-sm line-through leading-none">${originalPrice.toFixed(0)}</span>
                  <span className="text-green-500 text-xs font-semibold tracking-wide leading-none">Save ${savedAmount.toFixed(0)}</span>
                </>
              )}
            </div>
          </div>

          {/* Controls Block */}
          <div className="flex flex-col mt-auto gap-3">
            
            {variants.length > 1 && (
              <div className="relative w-full">
                <select
                  className="w-full appearance-none bg-zinc-800/80 text-white border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-[11px] font-semibold tracking-widest uppercase outline-none cursor-pointer hover:border-white/30 focus:border-[var(--color-brand-orange)] transition-colors"
                  value={selectedVariant ? selectedVariant.variantId : ""}
                  onChange={(e) =>
                    setSelectedVariant(
                      variants.find((v) => v.variantId === e.target.value) || null,
                    )
                  }
                >
                  <option value="" disabled>Select Option</option>
                  {variants.map((v) => (
                    <option key={v.variantId} value={v.variantId}>
                      {v.title}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
                  <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                </div>
              </div>
            )}

            <div className="flex gap-2 mb-4">
              <div className="flex items-center justify-between bg-zinc-800/80 border border-white/10 rounded-full px-2 w-[80px] shrink-0 h-[40px]">
                <button
                  onClick={(e) => { e.preventDefault(); handleQuantityChange("decrease"); }}
                  className="p-1.5 text-white/40 hover:text-white transition-colors active:scale-90"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3 stroke-[2.5]" />
                </button>
                <span className="font-semibold text-white text-xs select-none tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); handleQuantityChange("increase"); }}
                  className="p-1.5 text-white/40 hover:text-white transition-colors active:scale-90"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!item.inventory?.availableForSale || !selectedVariant || isAdding}
                className="flex-1 rounded-full bg-[var(--color-brand-orange)] text-black h-[40px] text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
              >
                {isAdding ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : !item.inventory?.availableForSale ? (
                  "Sold Out"
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5 mb-[1px]" />
                    Add to Bag
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer info (Shipping & Clickable AR) */}
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

      {/* AR Camera Overlay Modal */}
      {isArMode && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in fade-in duration-300">
          <div className="absolute top-4 right-4 z-[110]">
            <button
              onClick={() => setIsArMode(false)}
              className="w-12 h-12 bg-black/40 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/20 hover:bg-black/60 transition-colors"
              aria-label="Close AR Mode"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="relative w-full h-full overflow-hidden bg-zinc-900">
            {/* Live Camera Feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-[1.02]" 
            />
            
            {/* Transparent Tattoo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
              {item.media?.arOverlayImage && (
                <Image
                  src={item.media.arOverlayImage}
                  alt="AR Overlay"
                  width={350}
                  height={350}
                  className="object-contain drop-shadow-2xl opacity-90 mix-blend-multiply filter contrast-125"
                />
              )}
            </div>

            {/* Instruction Overlay */}
            <div className="absolute bottom-12 left-0 right-0 text-center pointer-events-none flex flex-col items-center gap-2">
               <p className="text-white text-xs font-bold tracking-widest bg-black/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 uppercase shadow-xl">
                  Point Camera At Your Body
               </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}