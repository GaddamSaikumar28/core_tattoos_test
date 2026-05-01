"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ShoppingCart, Loader2, Minus, Plus } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import { toast } from "sonner";
import { useCart } from "@/src/context/CartContext";
import { FormattedProduct, Variant } from "@/src/lib/shopify";

// 1. Hook (Unchanged)
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

interface ProductCardProps {
  item: FormattedProduct;
  viewMode: "grid" | "list";
  page: string;
  index: number;
  priority?: boolean;
}

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

  const currentPrice = selectedVariant
    ? Number(selectedVariant.price)
    : Number(item.checkout.price);
  const originalPrice = selectedVariant?.compareAtPrice
    ? Number(selectedVariant.compareAtPrice)
    : null;
  const hasDiscount = originalPrice !== null && originalPrice > currentPrice;

  const image = item.media.featuredImage || "/placeholder.png";
  const hoverImage = item.media.hoverImage || image;

  const slug = encodeURIComponent(item.slug.toLowerCase().replace(/\s+/g, "-"));
  //const productUrl = `/${page}/${slug}`;
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
    <div
      ref={ref}
      className={clsx(
        "group flex transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)]",
        "h-full", // Added: Ensures card takes full height of the parent container
        originClass,
        isVisible
          ? "opacity-100 translate-x-0 rotate-0"
          : `opacity-0 ${hiddenTransformClasses}`,
        isList
          ? "flex-row h-auto gap-4 sm:gap-6 items-center sm:items-stretch"
          : "flex-col gap-4 sm:gap-5",
      )}
    >
      {/* 1. Image Area */}
      <div
        className={clsx(
          "relative bg-zinc-900 rounded-lg overflow-hidden shrink-0",
          isList
            ? "w-[40%] sm:w-60 aspect-[4/5] sm:aspect-square"
            : "w-full aspect-[4/5]",
        )}
      >
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex flex-col gap-2">
          {displayBadge && (
            <div
              key={0}
              className="bg-black backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/10 shadow-lg"
            >
              {displayBadge.label}
            </div>
          )}
        </div>

        <Link
          href={productUrl}
          prefetch={false}
          className="absolute inset-0 block w-full h-full z-20 cursor-pointer"
        >
          <Image
            src={image}
            alt={mainAltText}
            //alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Optimized sizes
            priority={priority}
            //sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-0 group-hover:scale-110"
          />
          <Image
            src={hoverImage}
            //alt={`${item.title} alternate view`}
            alt={mainAltText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy" // Hover images should always be lazy
            //sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover absolute inset-0 opacity-0 scale-100 transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:opacity-80 group-hover:scale-110"
          />
        </Link>
      </div>

      {/* 2. Content Area */}
      <div
        className={clsx(
          "flex flex-col flex-grow min-w-0", // flex-grow is critical here
          isList ? "justify-center py-2 pr-2 sm:pr-4" : "",
        )}
      >
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            {item.attributes.themes?.[0] && (
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 tracking-widest uppercase truncate block">
                {item.attributes.themes[0]}
              </span>
            )}
            <Link href={productUrl} prefetch={false}>
              <h3
                className={clsx(
                  "font-semibold tracking-wide uppercase text-gray-100 leading-snug hover:text-white transition-colors line-clamp-2",
                  isList ? "text-sm sm:text-lg" : "text-base md:text-lg",
                )}
              >
                {item.title}
              </h3>
            </Link>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[var(--color-brand-orange)] font-black text-lg sm:text-xl md:text-2xl tracking-tight">
              ${currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-white/50 line-through text-xs sm:text-sm md:text-base font-medium mt-0.5">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        <Link
          href={productUrl}
          prefetch={false}
          className="text-[10px] sm:text-xs font-bold text-gray-400 hover:text-white uppercase tracking-widest transition-colors inline-flex items-center gap-1.5 w-fit mt-2 sm:mt-3"
        >
          View Details{" "}
          <span className="group-hover:translate-x-1 transition-transform duration-300">
            →
          </span>
        </Link>

        {/* 3. Controls Block - The "Spring" */}
        <div
          className={clsx(
            "flex flex-col",
            // Added: mt-auto pushes this entire block to the bottom of the card
            "mt-auto", 
            isList ? "gap-2.5 sm:gap-3 pt-4 sm:pt-6" : "gap-3 pt-5",
          )}
        >
          {variants.length > 1 && (
            <div className="relative w-full">
              <select
                className="w-full appearance-none bg-zinc-900/40 text-white border border-white/20 rounded-full py-2.5 sm:py-3 pl-4 sm:pl-5 pr-10 text-[11px] sm:text-xs font-semibold tracking-widest uppercase outline-none cursor-pointer hover:border-white/40 focus:border-[var(--color-brand-orange)] transition-colors"
                value={selectedVariant ? selectedVariant.variantId : ""}
                onChange={(e) =>
                  setSelectedVariant(
                    variants.find((v) => v.variantId === e.target.value) ||
                      null,
                  )
                }
              >
                <option value="" disabled>
                  Select Option
                </option>
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

          <div
            className={clsx(
              "flex gap-2 sm:gap-3",
              isList ? "flex-wrap xl:flex-nowrap" : "flex-row",
            )}
          >
            <div className="flex items-center justify-between bg-zinc-900/40 border border-white/20 rounded-full px-2 w-[90px] sm:w-[100px] shrink-0 h-[42px] sm:h-[48px]">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange("decrease");
                }}
                className="p-1.5 text-white/50 hover:text-white transition-colors active:scale-90"
              >
                <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>

              <span className="font-semibold text-white text-xs sm:text-sm select-none">
                {quantity}
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleQuantityChange("increase");
                }}
                className="p-1.5 text-white/50 hover:text-white transition-colors active:scale-90"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={
                !item.inventory.availableForSale || !selectedVariant || isAdding
              }
              className="flex-1 rounded-full bg-transparent border border-white/20 text-white px-4 h-[42px] sm:h-[48px] text-[11px] sm:text-xs font-semibold tracking-widest hover:border-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)] hover:text-black transition-all duration-300 uppercase flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-white/20 disabled:hover:text-white"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : !item.inventory.availableForSale ? (
                "Sold Out"
              ) : (
                <>
                  Add to Cart{" "}
                  <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-[2px]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}