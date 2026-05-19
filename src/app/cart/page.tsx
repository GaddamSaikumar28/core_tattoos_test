
'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Loader2, Lock } from 'lucide-react';
import { useCart } from '@/src/context/CartContext';
import { CartItemCard } from '@/src/components/cart/CartItemCard'; // Adjust path if needed

export default function CartPage() {
  const { cart, cartCount, isCartLoading } = useCart();

  // Safely extract cart data from the Shopify structure
  const cartItems = cart?.lines || [];
  const subtotal = cart?.cost?.subtotalAmount?.amount ? parseFloat(cart.cost.subtotalAmount.amount).toFixed(2) : '0.00';
  const total = cart?.cost?.totalAmount?.amount ? parseFloat(cart.cost.totalAmount.amount).toFixed(2) : '0.00';
  const currencyCode = cart?.cost?.subtotalAmount?.currencyCode || 'USD';
  const currencySymbol = currencyCode === 'USD' ? '$' : `${currencyCode} `;
  
  // Shopify generates a secure checkout URL for each cart
  const checkoutUrl = cart?.checkoutUrl || '#';

  // --- Loading State ---
  if (isCartLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FE8204]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
        <Loader2 className="w-12 h-12 text-[#FE8204] animate-spin mb-4 drop-shadow-[0_0_15px_rgba(254,130,4,0.5)]" />
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] animate-pulse">Loading Workspace...</p>
      </div>
    );
  }

  // --- Empty Cart State ---
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FE8204]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 p-12 md:p-20 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-2xl w-full">
          <div className="w-24 h-24 bg-zinc-950/80 rounded-full flex items-center justify-center mb-8 shadow-inner border border-white/5 relative group">
            <ShoppingBag className="w-10 h-10 text-zinc-600 group-hover:text-[#FE8204] transition-colors duration-500 drop-shadow-md" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter uppercase leading-none">Your Cart is Empty</h1>
          <p className="text-zinc-400 mb-10 max-w-sm text-sm font-medium leading-relaxed">
            The workspace is currently clear. Browse our collections and add items to begin the checkout sequence.
          </p>
          <Link 
            href="/tattoos" 
            className="bg-[#FE8204] text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_20px_rgba(254,130,4,0.3)] hover:shadow-[0_0_30px_rgba(254,130,4,0.5)] hover:bg-[#ff952b] hover:-translate-y-1"
          >
            Initialize Shopping
          </Link>
        </div>
      </div>
    );
  }

  // --- Populated Cart State ---
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 mt-9 animate-in fade-in duration-500 relative z-10">
      
      {/* Ambient Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FE8204]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      {/* Page Header */}
      <div className="flex items-end justify-between mb-8 sm:mb-10 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">Cart</h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mt-2">Active Session Elements</p>
        </div>
        <span className="bg-zinc-900/80 text-zinc-300 font-black px-4 py-1.5 rounded-full text-[10px] uppercase tracking-widest border border-white/10 shadow-sm shrink-0">
          {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
        </span>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 relative">
        
        {/* Left Side: Cart Items List */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
          {cartItems.map((item) => (
            <CartItemCard 
              key={item.id} // item.id is the Shopify line item ID, perfectly unique
              item={item} 
              compact={false} 
            />
          ))}
        </div>

        {/* Right Side: Sticky Order Summary */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] p-8 lg:sticky lg:top-32 border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.7)] relative overflow-hidden">
            
            {/* Subtle inner top glow for depth */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 border-b border-white/5 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-8 text-sm font-bold">
              <div className="flex justify-between text-zinc-400 items-center">
                <span>Subtotal</span>
                <span className="text-white">{currencySymbol}{subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-400 items-center">
                <span>Shipping</span>
                <span className="text-[10px] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md shadow-sm">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-zinc-400 items-center">
                <span>Estimated Tax</span>
                <span className="text-white">Included</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-end">
              <span className="text-sm font-black text-white uppercase tracking-widest">Total</span>
              <span className="text-3xl font-black text-[#FE8204] tracking-tight drop-shadow-[0_0_15px_rgba(254,130,4,0.2)]">
                {currencySymbol}{total}
              </span>
            </div>

            {/* Note: We use a standard <a> tag here because checkoutUrl redirects to Shopify's external domain */}
            <a 
              href={checkoutUrl}
              className="w-full bg-[#FE8204] text-white py-4 sm:py-4.5 rounded-xl text-xs font-black uppercase tracking-[0.15em] flex items-center justify-center gap-2.5 shadow-[0_0_20px_rgba(254,130,4,0.3)] hover:shadow-[0_0_30px_rgba(254,130,4,0.5)] hover:bg-[#ff952b] transition-all duration-300 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 mb-5"
            >
              <Lock className="w-4 h-4" />
              Secure Checkout
            </a>
            
            <Link 
              href="/tattoos"
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors py-3 rounded-xl hover:bg-white/5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
            </Link>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950/50 p-3.5 rounded-xl border border-white/5 shadow-inner">
                <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Secure Checkout by Shopify</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950/50 p-3.5 rounded-xl border border-white/5 shadow-inner">
                <div className="bg-blue-500/10 p-2 rounded-lg shrink-0">
                  <Truck className="w-4 h-4 text-blue-400" />
                </div>
                <span>Fast & Reliable Shipping</span>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}