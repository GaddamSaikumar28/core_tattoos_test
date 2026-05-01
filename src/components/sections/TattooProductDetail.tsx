"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { 
  Plus, Minus, ZoomIn, X, Star,
  Droplets, ChevronDown, ShieldCheck, Loader2,
  Clock, Sparkles, ShoppingBag, Info, AlertCircle
} from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import { useCart } from '@/src/context/CartContext';
import { FormattedProduct, Variant } from '@/src/lib/shopify';

interface TattooProductDetailProps {
  product: FormattedProduct;
}

export default function TattooProductDetail({ product }: TattooProductDetailProps) {
  const { addToCart, buyNow } = useCart();
  
  // UI States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('description');
  
  // Cart States
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Variant State
  const variants = product.allVariants || [];
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.find(v => v.availableForSale) || variants[0] || null
  );

  // Derived Values from your robust mapper
  const price = selectedVariant ? Number(selectedVariant.price) : product.checkout.price;
  const compareAtPrice = selectedVariant?.compareAtPrice ? Number(selectedVariant.compareAtPrice) : product.checkout.compareAtPrice;
  const isOnSale = compareAtPrice && compareAtPrice > price;
  
  // Utilize the pre-calculated discount percentage or fallback
  const discount = product.checkout.discountPercentage || (isOnSale ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0);

  // Media (Using mapped gallery array)
  const images = product.media?.gallery?.length > 0 
    ? product.media.gallery 
    : [{ url: product.media?.featuredImage || '/assets/images/placeholder-tattoo.png', altText: product.title }];

  // Lock body scroll when Zoom Modal is open
  useEffect(() => {
    if (isZoomed) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isZoomed]);

  // Handlers
  const handleQuantityChange = (type: 'increase' | 'decrease') => {
    setQuantity(prev => {
      if (type === 'increase') return prev + 1;
      return prev > 1 ? prev - 1 : 1;
    });
  };

  const handleAddToCart = async () => {
    if (!selectedVariant?.variantId) {
      toast.error("Please select an option");
      return;
    }
    
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.variantId, quantity);
      toast.success("Added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!selectedVariant?.variantId) {
      toast.error("Please select an option");
      return;
    }
    
    setIsBuyingNow(true);
    try {
      const checkoutUrl = await buyNow(selectedVariant.variantId, quantity);
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error("Buy now error:", error);
    } finally {
      setIsBuyingNow(false);
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-20 selection:bg-[#fe8204] selection:text-white">
      <div className="container max-w-[1400px] mx-auto px-4">
        
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 lg:mb-8">
          <a href="/" className="hover:text-gray-900 transition-colors">Home</a>
          <span>/</span>
          <a href="/collections/" className="hover:text-gray-900 transition-colors">Shop ALL</a>
          <span>/</span>
          <span className="text-gray-900 truncate max-w-[150px] sm:max-w-none">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 xl:gap-16">
          
          {/* ========================================================= */}
          {/* LEFT: IMAGE GALLERY (Thumbnails at Bottom, Reduced Height)*/}
          {/* ========================================================= */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:h-fit">
            
            {/* Main Image Viewer */}
            <div className="relative w-full aspect-square md:aspect-[4/3] max-h-[500px] rounded-2xl bg-[#0a0a0a] border border-gray-100 overflow-hidden flex items-center justify-center group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full p-6 md:p-8"
                >
                  <Image 
                    src={images[activeImageIndex].url} 
                    alt={images[activeImageIndex].altText || product.title}
                    fill
                    priority = {true}
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"

                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Badges Overlay (Safely utilizing the mapper's output) */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.styling?.badges?.filter(Boolean).map((badge: any, i: number) => (
                  <span 
                    key={i} 
                    className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white rounded-md shadow-sm"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>

              {/* Magnifier / Zoom Button */}
              <button 
                onClick={() => setIsZoomed(true)}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                aria-label="Zoom image"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Horizontal Thumbnails at Bottom */}
            {images.length > 1 && (
              <div className="flex flex-row gap-3 overflow-x-auto no-scrollbar pb-2">
                {images.map((img, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={clsx(
                      "relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-[#0a0a0a] border-2 transition-all duration-300",
                      activeImageIndex === index ? "border-[#fe8204]" : "border-transparent hover:border-gray-400"
                    )}
                  >
                    <Image 
                      src={img.url} 
                      alt={img.altText || `Thumbnail ${index + 1}`} 
                      fill 
                      className="object-contain p-2"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* RIGHT: PRODUCT INFO (Maximized Data Display)              */}
          {/* ========================================================= */}
          <div className="flex flex-col py-2">
            
            {/* Vendor, Type & Stars */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-black text-[#fe8204] uppercase tracking-widest bg-[#fe8204]/10 px-2.5 py-1 rounded-md">
                  {product.vendor}
                </span>
                {product.styling?.tattooColorType && (
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-gray-100 px-2.5 py-1 rounded-md">
                    {product.styling.tattooColorType}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-gray-900 leading-[1.1] mb-4">
                {product.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1 text-[#fe8204]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pt-0.5">
                  4.9 (120 Reviews)
                </p>
              </div>
            </div>
            
            {/* Price & Inventory Alert */}
            <div className="mb-8 border-b border-gray-100 pb-8">
              <div className="flex items-end gap-4 mb-2">
                <span className="text-3xl font-black text-gray-900 tracking-tight">
                  ${price.toFixed(2)}
                </span>
                {isOnSale && (
                  <>
                    <span className="text-xl font-bold text-gray-400 line-through mb-0.5">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                    <span className="bg-red-100 text-red-600 px-2.5 py-1 text-xs font-black uppercase tracking-widest rounded-md mb-1.5">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Dynamic Inventory Notice from Mapper */}
              {product.inventory?.stockLevel > 0 && product.inventory.stockLevel < 10 ? (
                <div className="flex items-center gap-1.5 text-red-500 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-[11px] font-bold uppercase tracking-widest">
                    Low Stock: Only {product.inventory.stockLevel} left!
                  </span>
                </div>
              ) : product.inventory?.inStock ? (
                <span className="text-[11px] font-bold uppercase tracking-widest text-green-600 mt-2 block">
                  ✓ In Stock & Ready to Ship
                </span>
              ) : null}
            </div>

            {/* Variants (Size/Style Selection Pills) */}
            {variants.length > 1 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-gray-900">Select Option</h3>
                  {selectedVariant && !selectedVariant.availableForSale && (
                     <span className="text-xs font-bold text-red-500 uppercase tracking-widest">Out of Stock</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {variants.map((v) => (
                    <button
                      key={v.variantId}
                      onClick={() => setSelectedVariant(v)}
                      className={clsx(
                        "px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 border-2",
                        selectedVariant?.variantId === v.variantId 
                          ? "border-[#fe8204] bg-[#fe8204] text-white shadow-md" 
                          : "border-gray-200 bg-white text-gray-900 hover:border-gray-900"
                      )}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Features */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Droplets, text: "Waterproof" },
                { icon: Clock, text: "Lasts 1-2 Weeks" },
                { icon: ShieldCheck, text: "Skin Safe" },
                { icon: Sparkles, text: "Realistic Look" }
              ].map((feat, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <feat.icon className="w-5 h-5 text-[#fe8204]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-700">{feat.text}</span>
                </div>
              ))}
            </div>

            {/* Action Area (Quantity + Buttons) */}
            <div className="flex flex-col gap-4 mb-12">
              <div className="flex flex-col sm:flex-row items-stretch gap-4">
                
                {/* Quantity Selector */}
                <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl bg-white h-[60px] w-full sm:w-[140px] shrink-0">
                  <button 
                    onClick={() => handleQuantityChange('decrease')} 
                    className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-base font-black text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange('increase')} 
                    className="w-12 h-full flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedVariant?.availableForSale}
                  className="flex-1 h-[60px] border-2 p-5 border-gray-900 bg-white text-gray-900 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingBag className="w-5 h-5" />}
                  Add to Cart
                </button>
              </div>

              {/* Buy Now */}
              <button 
                onClick={handleBuyNow}
                disabled={isBuyingNow || !selectedVariant?.availableForSale}
                className="w-full h-[60px] bg-[#fe8204] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#e07103] transition-colors duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#fe8204]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBuyingNow ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {selectedVariant?.availableForSale ? "Buy It Now" : "Out of Stock"}
              </button>
            </div>

            {/* Accordions (Maximizing mapped data) */}
            <div className="border-t-2 border-gray-100">
              <AccordionItem 
                title="Description" 
                isOpen={activeAccordion === 'description'} 
                onToggle={() => toggleAccordion('description')}
              >
                <div 
                  className="prose prose-sm prose-gray max-w-none text-gray-600 font-medium leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }}
                />
              </AccordionItem>

              {/* Specific Product Attributes extracted from mapper */}
              <AccordionItem 
                title="Tattoo Details" 
                isOpen={activeAccordion === 'details'} 
                onToggle={() => toggleAccordion('details')}
              >
                <div className="space-y-4">
                  {product.attributes?.themes?.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Themes</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.themes.map((theme, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-[11px] font-bold uppercase">{theme}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.placements?.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Best Placements</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.placements.map((placement, i) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-[11px] font-bold uppercase">{placement}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {product.attributes?.tags?.length > 0 && (
                    <div>
                      <span className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tags</span>
                      <div className="flex flex-wrap gap-2">
                        {product.attributes.tags.map((tag, i) => (
                          <span key={i} className="bg-white border border-gray-200 text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </AccordionItem>
              
              <AccordionItem 
                title="How To Apply" 
                isOpen={activeAccordion === 'apply'} 
                onToggle={() => toggleAccordion('apply')}
              >
                <ol className="space-y-3 text-sm text-gray-600 font-medium list-decimal pl-4">
                  <li>Ensure your skin is clean, dry, and free of makeup or lotions.</li>
                  <li>Remove the clear protective top sheet.</li>
                  <li>Press the tattoo design firmly onto your skin.</li>
                  <li>Hold a wet cloth or sponge against the back of the tattoo for 30 seconds.</li>
                  <li>Gently peel off the paper backing. Let it dry!</li>
                </ol>
              </AccordionItem>

              <AccordionItem 
                title="Shipping & Returns" 
                isOpen={activeAccordion === 'shipping'} 
                onToggle={() => toggleAccordion('shipping')}
              >
                <p className="text-sm text-gray-600 font-medium leading-relaxed">
                  Orders process within 1-2 business days. Free shipping on orders over $50. 
                  Not completely satisfied? We accept returns within 30 days of purchase for a full refund.
                </p>
              </AccordionItem>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAGNIFIER / ZOOM MODAL                                    */}
      {/* ========================================================= */}
      {/* <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed mt-20 inset-0 z-[100] bg-black/95 flex flex-col overflow-y-auto cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              className="fixed top-6 right-6 z-[101] w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="min-h-screen w-full flex items-center justify-center mt-50 px-10 p-4 py-20">
              <Image 
                src={images[activeImageIndex].url} 
                alt={images[activeImageIndex].altText || product.title}
                width={1200}
                height={1200}
                className="w-auto max-w-full mt-20 h-auto max-h-none object-contain rounded-xl"
                onClick={(e) => e.stopPropagation()} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            // 1. z-[9999] ensures it sits above ANY global header.
            // 2. Removed mt-20 and overflow-y-auto to lock it to the viewport perfectly.
            className="fixed inset-0 z-[9999] bg-black/95 flex flex-col items-center justify-center p-4 md:p-8 mt-20 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); setIsZoomed(false); }}
              // Changed to absolute positioning relative to the fixed modal container
              className="absolute top-6 right-6 md:top-8 md:right-8 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Container constraints dynamically adjust based on the viewport */}
            <div className="relative flex items-center justify-center w-full h-full max-h-[85vh]">
              <Image 
                src={images[activeImageIndex].url} 
                alt={images[activeImageIndex].altText || product.title}
                width={1200}
                height={1200}
                // h-full and object-contain will natively scale the Next.js image to fit the container bounds
                className="w-auto h-full max-h-full object-contain rounded-xl drop-shadow-2xl cursor-default"
                onClick={(e) => e.stopPropagation()}
                //priority // Recommended for LCP images inside modals
                priority={true}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =========================================================
// CLEAN ACCORDION COMPONENT
// =========================================================
function AccordionItem({ title, isOpen, onToggle, children }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b-2 border-gray-100 last:border-0">
      <button 
        onClick={onToggle}
        className="w-full py-6 flex items-center justify-between group outline-none"
      >
        <span className="text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-[#fe8204] transition-colors">
          {title}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-[#fe8204] transition-colors" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}