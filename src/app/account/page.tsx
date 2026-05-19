"use client";

import { useAuth } from "@/src/context/AuthContext";
import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";

export default function AccountDashboard() {
  const { customer } = useAuth();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 mt-2">
      
      {/* Welcome Heading Section */}
      <div>
        <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-none">
          Welcome back, <span className="text-[#FE8204]">{customer?.firstName}</span>!
        </h1>
        <p className="text-base text-zinc-400 font-medium max-w-2xl leading-relaxed">
          From your personal dashboard you can instantly track recent orders, manage shipping and handling locations, and tweak account options.
        </p>
      </div>

      {/* Actionable Bento Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        
        {/* Recent Orders Action Card */}
        <div className="p-6 md:p-8 border border-white/5 rounded-2xl bg-zinc-900/30 backdrop-blur-md shadow-xl hover:border-white/20 transition-all duration-300 flex flex-col items-start group relative overflow-hidden">
          {/* Decorative Corner Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FE8204]/5 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 opacity-50 group-hover:opacity-100" />
          
          <div className="w-12 h-12 bg-[#FE8204]/10 border border-[#FE8204]/20 text-[#FE8204] rounded-xl flex items-center justify-center mb-6 shadow-md transition-transform duration-300 group-hover:scale-105">
            <Package className="w-5 h-5" />
          </div>
          
          <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">Recent Orders</h3>
          <p className="text-sm text-zinc-400 font-medium mb-6 leading-relaxed">
            Review delivery paths, update returns processing, or evaluate structural receipts from recent item checkouts.
          </p>
          
          <Link 
            href="/account/orders" 
            className="text-xs font-black uppercase tracking-[0.2em] text-[#FE8204] flex items-center gap-1.5 mt-auto hover:text-[#ff952b] transition-colors"
          >
            View Orders 
            <ArrowRight className="w-3.5 h-3.5 transform transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>
        </div>

        {/* Placeholder slot preserved for secondary custom extensions (e.g., Rewards, Wishlist) */}
        
      </div>
    </div>
  );
}