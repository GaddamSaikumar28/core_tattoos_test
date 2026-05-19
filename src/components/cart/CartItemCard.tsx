
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { CartItem } from '@/src/lib/shopify'; // Adjust this import path if your index.ts is located elsewhere

interface CartItemCardProps {
  item: CartItem;
  compact?: boolean; // True for Drawer, False for Full Page
}

export function CartItemCard({ item, compact = false }: CartItemCardProps) {
  const { updateQuantity, removeLineItem } = useCart();

  // 1. Safely destructure the nested Shopify GraphQL data
  const { merchandise, cost, quantity, id: lineId } = item;
  const { product, title: variantTitle } = merchandise;
  
  // 2. Format Data Variables
  const imageUrl = product.featuredImage?.url || '/assets/images/placeholder.png';
  const productTitle = product.title;
  const productHandle = product.handle;
  
  // Shopify assigns "Default Title" to products without specific variants. We hide it for a cleaner UI.
  const displayVariantTitle = variantTitle !== "Default Title" ? variantTitle : null;
  
  const price = parseFloat(cost.totalAmount.amount).toFixed(2);
  const currency = cost.totalAmount.currencyCode === 'USD' ? '$' : cost.totalAmount.currencyCode + ' ';

  return (
    <div 
      className={`flex gap-4 group transition-all duration-300 ${
        compact 
          ? 'py-4 border-b border-white/5 last:border-0' 
          : 'p-4 sm:p-5 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg hover:border-white/15 hover:bg-zinc-900/60'
      }`}
    >
      {/* --- Image Section --- */}
      <Link 
        href={`/collections/${productHandle}`} 
        className="relative shrink-0 overflow-hidden rounded-xl bg-zinc-950 border border-white/5 group-hover:border-white/10 transition-colors block"
      >
        <div className={`${compact ? 'w-20 h-24' : 'w-24 h-24 sm:w-32 sm:h-32'} relative`}>
          <Image
            src={imageUrl}
            alt={product.featuredImage?.altText || productTitle}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100px, 150px"
          />
          {/* Subtle Dark Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 z-10 pointer-events-none" />
        </div>
      </Link>

      {/* --- Content Section --- */}
      <div className="flex flex-col flex-grow justify-between py-0.5">
        
        {/* Top Row: Title & Price */}
        <div className="flex justify-between items-start gap-3">
          <div className="flex flex-col">
            <Link 
              href={`/tattoos/${productHandle}`} 
              className="font-black text-white text-sm sm:text-base leading-tight uppercase tracking-tight hover:text-[#FE8204] transition-colors line-clamp-2"
            >
              {productTitle}
            </Link>
            {displayVariantTitle && (
              <span className="text-[10px] sm:text-xs text-zinc-500 mt-1.5 font-black uppercase tracking-widest bg-zinc-950/50 inline-block px-2.5 py-1 rounded-md w-fit border border-white/10 shadow-inner">
                {displayVariantTitle}
              </span>
            )}
          </div>
          <p className="font-black text-white whitespace-nowrap text-sm sm:text-base tracking-tight drop-shadow-sm">
            {currency}{price}
          </p>
        </div>

        {/* Bottom Row: Controls & Delete */}
        <div className="flex items-end sm:items-center justify-between mt-3 sm:mt-4">
          
          {/* Quantity Controls */}
          <div className="flex items-center border border-white/10 rounded-lg bg-zinc-950 p-0.5 shadow-inner">
            <button
              onClick={() => updateQuantity(lineId, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all active:scale-95"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center text-sm font-bold text-white select-none">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(lineId, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-all active:scale-95"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => removeLineItem(lineId)}
            className="group/remove flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-95"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4 transition-transform group-hover/remove:scale-110" />
            {!compact && <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline pt-0.5">Remove</span>}
          </button>
          
        </div>
      </div>
    </div>
  );
}