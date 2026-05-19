
'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/src/context/CartContext';
import { CartItem } from '@/src/lib/shopify';

export function CartDrawer() {
  const { 
    isCartOpen, 
    setCartOpen, 
    cart, 
    cartCount, 
    isCartLoading 
  } = useCart();

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isCartOpen]);

  // Use Shopify's native, secure checkout URL
  const handleCheckout = () => {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  };

  const isEmpty = !cart || cart.lines.length === 0;
  const subtotal = cart?.cost?.subtotalAmount?.amount || '0.00';
  const currency = cart?.cost?.subtotalAmount?.currencyCode || 'USD';

  return (
    <AnimatePresence>
      {/* Dark Blur Backdrop */}
      {isCartOpen && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setCartOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
        />
      )}

      {/* Glassmorphic Drawer */}
      {isCartOpen && (
        <motion.div
          key="drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-[100dvh] w-full max-w-md bg-zinc-950/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)] border-l border-white/10 z-[110] flex flex-col overflow-hidden"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FE8204]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

          {/* Drawer Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/5 bg-zinc-950/50 backdrop-blur-md z-10 shrink-0">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-white" />
              <h2 className="text-lg font-black uppercase tracking-widest text-white leading-none mt-0.5">Your Cart</h2>
              {cartCount > 0 && (
                <span className="bg-[#FE8204]/10 border border-[#FE8204]/20 text-[#FE8204] shadow-[0_0_10px_rgba(254,130,4,0.2)] text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full ml-1">
                  {cartCount}
                </span>
              )}
            </div>
            <button
              onClick={() => setCartOpen(false)}
              className="p-2 text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 rounded-xl transition-all duration-300 hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-zinc-950/30">
            {isCartLoading ? (
              <div className="h-full flex flex-col items-center justify-center space-y-4">
                <Loader2 className="w-10 h-10 text-[#FE8204] animate-spin drop-shadow-[0_0_15px_rgba(254,130,4,0.5)]" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] animate-pulse">Loading Workspace...</p>
              </div>
            ) : isEmpty ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-5">
                <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center border border-white/5 shadow-inner">
                  <ShoppingBag className="w-10 h-10 text-zinc-700" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tighter">Your cart is empty</h3>
                  <p className="text-zinc-500 mt-2 text-xs font-medium max-w-[250px] mx-auto">No items in the active session. Browse collections to add pieces.</p>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-4 px-8 py-4 bg-zinc-900 text-white font-black rounded-xl hover:bg-[#FE8204] hover:shadow-[0_0_20px_rgba(254,130,4,0.3)] transition-all duration-300 text-[11px] uppercase tracking-[0.2em] border border-white/5 hover:border-[#FE8204]/50"
                >
                  Initialize Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.lines.map((line) => (
                  <CartLineItem key={line.id} line={line} />
                ))}
              </div>
            )}
          </div>

          {/* Footer Summary */}
          {!isEmpty && (
            <div className="border-t border-white/10 p-6 bg-zinc-950/90 backdrop-blur-xl shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.5)] z-10 flex flex-col gap-4 shrink-0 relative">
              {/* Subtle top edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="flex justify-between items-end mb-1">
                <span className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em]">Subtotal</span>
                <span className="font-black text-3xl text-[#FE8204] tracking-tighter drop-shadow-[0_0_15px_rgba(254,130,4,0.2)]">
                  {currency === 'USD' ? '$' : ''}{subtotal}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-2 leading-relaxed">
                Shipping, taxes, and discounts <br/> calculated at checkout.
              </p>
              
              {/* Primary Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#FE8204] text-white py-4.5 rounded-xl font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(254,130,4,0.3)] hover:shadow-[0_0_30px_rgba(254,130,4,0.5)] hover:bg-[#ff952b] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>

              {/* Secondary View Full Cart Link */}
              <Link
                href="/cart"
                onClick={() => setCartOpen(false)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-white py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center transition-all duration-300"
              >
                View Full Cart
              </Link>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// =========================================================
// SUB-COMPONENT: Single Cart Line Item 
// =========================================================
function CartLineItem({ line }: { line: CartItem }) {
  const { updateQuantity, removeLineItem } = useCart();
  const product = line.merchandise.product;
  const image = product.featuredImage?.url || '/placeholder.png';
  
  // Shopify returns "Default Title" if a product has no variants. We hide it.
  const variantTitle = line.merchandise.title === "Default Title" ? null : line.merchandise.title;
  const price = line.cost.totalAmount.amount;
  const currency = line.cost.totalAmount.currencyCode;

  return (
    <div className="flex gap-4 p-4 bg-zinc-900/40 backdrop-blur-md rounded-2xl border border-white/5 shadow-lg relative group transition-all duration-300 hover:border-white/15 hover:bg-zinc-900/60">
      
      {/* Image */}
      <div className="relative w-20 h-24 bg-zinc-950 rounded-xl overflow-hidden shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
        <Image 
          src={image} 
          alt={product.title} 
          fill 
          sizes="80px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Image Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50" />
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 justify-between py-0.5">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h4 className="text-sm font-black text-white leading-tight uppercase tracking-tight line-clamp-2">
              {product.title}
            </h4>
            {variantTitle && (
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mt-1.5">{variantTitle}</p>
            )}
          </div>
          <button 
            onClick={() => removeLineItem(line.id)}
            className="text-zinc-600 hover:text-red-400 hover:bg-red-400/10 p-1.5 rounded-lg transition-all duration-300 shrink-0"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center bg-zinc-950 border border-white/10 rounded-lg p-0.5 shadow-inner">
            <button 
              onClick={() => updateQuantity(line.id, line.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-white rounded-md transition-all duration-200"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-white">
              {line.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(line.id, line.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:bg-zinc-800 hover:text-white rounded-md transition-all duration-200"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price */}
          <div className="text-sm font-black text-white tracking-tight">
            {currency === 'USD' ? '$' : ''}{Number(price).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}