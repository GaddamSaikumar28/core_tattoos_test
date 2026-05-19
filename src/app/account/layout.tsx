"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { User, Package, Settings, LogOut, Loader2, MapPin } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/account", icon: User },
  { name: "Order History", href: "/account/orders", icon: Package },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Settings", href: "/account/settings", icon: Settings },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { customer, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !customer) {
      router.push("/login");
    }
  }, [customer, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <Loader2 className="w-8 h-8 animate-spin text-[#FE8204]" />
      </div>
    );
  }

  if (!customer) return null; // Will redirect via useEffect

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden selection:bg-[#FE8204] selection:text-white">
      
      {/* Dynamic Background Glow */}
      <div className="absolute top-40 left-1/4 w-full max-w-3xl h-[600px] bg-[#FE8204] opacity-[0.03] blur-[150px] pointer-events-none z-0 rounded-full" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-18 mt-20 flex flex-col md:flex-row gap-8 lg:gap-12">
        
        {/* Premium Glassmorphic Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-zinc-900/50 backdrop-blur-2xl rounded-[2rem] p-6 border border-white/10 shadow-xl shadow-black/40">
            
            {/* Profile Brief Card */}
            <div className="mb-8 flex items-center md:flex-col md:items-start gap-4 md:gap-0">
              <div className="w-14 h-14 bg-zinc-800 border border-white/10 text-[#FE8204] rounded-full flex items-center justify-center font-black text-xl md:mb-4 shadow-inner shadow-black/50">
                {customer?.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight truncate max-w-[180px]">
                  {customer?.firstName} {customer?.lastName}
                </h2>
                <p className="text-xs text-zinc-500 truncate max-w-[180px] mt-0.5">{customer?.email}</p>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex flex-col gap-1.5">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 uppercase tracking-wider group",
                      isActive 
                        ? "bg-[#FE8204]/10 text-[#FE8204] border border-[#FE8204]/20 shadow-[0_0_20px_rgba(254,130,4,0.05)]" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <Icon className={clsx(
                      "w-4 h-4 transition-transform duration-300", 
                      isActive ? "text-[#FE8204]" : "text-zinc-500 group-hover:text-white group-hover:scale-110"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all duration-300 uppercase tracking-wider mt-4 border-t border-white/5 pt-6"
              >
                <LogOut className="w-4 h-4 text-red-400/70" />
                Log Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content Area Container */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}