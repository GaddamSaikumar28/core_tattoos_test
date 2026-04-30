"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
// 1. Updated Import: Pulling in the specific new arrivals function
import { getHomePageNewArrivals, FormattedProduct } from '@/src/lib/shopify'; // Adjust path if necessary
import { useCart } from '@/src/context/CartContext'; // Adjust path if necessary

// Custom hook to trigger animations when elements scroll into view
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

// Extracted ProductCard to manage individual scroll reveal refs
const ProductCard = ({ product, index }: { product: FormattedProduct; index: number }) => {
  const [ref, isVisible] = useScrollReveal({ threshold: 0.1 });
  const { addToCart, isAddingToCart } = useCart();
  
  const variantId = product.checkout.defaultVariantId;
  const hasOldPrice = product.checkout.compareAtPrice && product.checkout.compareAtPrice > product.checkout.price;

  // Determine if the card is even (0, 2) or odd (1, 3)
  const isEven = index % 2 === 0;

  // Mobile: Even slides from left, Odd slides from right.
  // Desktop (md:): ALL cards override to slide from the left.
  const hiddenTransformClasses = isEven 
    ? '-translate-x-[100%] rotate-[15deg]' 
    : 'translate-x-[100%] -rotate-[15deg] md:-translate-x-[100%] md:rotate-[15deg]';
    
  // Adjust the transform origin
  const originClass = isEven
    ? 'origin-bottom-left'
    : 'origin-bottom-right md:origin-bottom-left';

  return (
    <div 
      ref={ref}
      className={`group flex flex-col gap-6  h-full transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${originClass} ${
        isVisible 
          ? 'opacity-100 translate-x-0 rotate-0' 
          : `opacity-0 ${hiddenTransformClasses}` 
      }`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900 rounded-lg">
        {/* Tags / Badges Overlay */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
              <div 
                key={0} 
                className="bg-black backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full border shadow-lg">
                  New Arrival
              </div>
        </div>
        
        {product.media.featuredImage ? (
          <Image
            src={product.media.featuredImage}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className={`object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
              isVisible ? 'scale-100 group-hover:scale-110 group-hover:opacity-80' : 'scale-[1.3]'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600 uppercase text-xs tracking-widest">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col gap-3 flex-grow mt-2 px-1 ">
        <div className="flex justify-between items-start gap-4">
          <h3 className="text-base md:text-lg font-semibold tracking-wide uppercase leading-snug text-gray-100">
            {product.title}
          </h3>
          
          {/* Pricing block */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[var(--color-brand-orange)] font-black text-xl md:text-2xl tracking-tight">
              ${product.checkout.price.toFixed(2)}
            </span>
            {hasOldPrice && (
              <span className="text-white text-15px line-through text-sm md:text-base font-medium mt-0.5">
                ${product.checkout.compareAtPrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button 
          disabled={!variantId || !product.inventory.availableForSale || isAddingToCart}
          onClick={(e) => {
            e.preventDefault();
            if (variantId) addToCart(variantId, 1);
          }}
          className="w-full rounded-full bg-transparent border border-white/20 text-white px-4 py-3 text-xs font-semibold tracking-widest hover:border-[var(--color-brand-orange)] hover:bg-[var(--color-brand-orange)] hover:text-black transition-all duration-300 uppercase mt-4 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
        >
          {product.inventory.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </div>
  );
};


export default function NewArrivals() {
  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Header animation hook
  const [headerRef, headerVisible] = useScrollReveal({ threshold: 0.1 });

  useEffect(() => {
    async function fetchNewArrivals() {
      try {
        setIsLoading(true);
        // 2. Updated Fetch Logic: Call the new dedicated collection fetcher
        const newArrivalsData = await getHomePageNewArrivals(4);
        setProducts(newArrivalsData);
      } catch (error) {
        console.error("Failed to fetch new arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchNewArrivals();
  }, []);

  return (
    <section className="bg-black text-white py-24 px-6 md:px-12 lg:px-24 w-full overflow-hidden  selection:bg-[var(--color-brand-orange)] selection:text-black">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-16 md:gap-24">
        
        {/* Header Section */}
        <div 
          ref={headerRef}
          className={`flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-white/10 pb-8 transition-all duration-[1200ms] ease-out ${
            headerVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
          }`}
        >
          <div className="flex flex-col gap-4 max-w-xl">
            <h2 className="text-4xl md:text-5xl lg:text-7xl text-[var(--color-brand-orange)] font-black uppercase tracking-tighter leading-none">
              New<br />Arrivals
            </h2>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
              Get the look without the commitment. Discover stunning, lifelike temporary body art that applies in seconds and lasts for days.
            </p>
          </div>
          
          <div>
            <Link 
              href="/new-arrivals"
              className="group flex items-center gap-3 text-[var(--color-brand-orange)] uppercase tracking-widest text-xs font-bold hover:text-white transition-colors duration-300"
            >
              View All New Arrivals
              <span className="bg-[var(--color-brand-orange)] text-black w-8 h-8 rounded-full flex justify-center items-center group-hover:bg-white group-hover:translate-x-2 transition-all duration-300">
              →
              </span>
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full aspect-[4/5] bg-white/5 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}