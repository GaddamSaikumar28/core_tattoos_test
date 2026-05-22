"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, X } from "lucide-react";

// Context & Utils
import { cn } from "@/src/lib/utils";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import { getMenu } from "@/src/lib/shopify";

// Types
import { MenuItem } from "./header.types";

// Child Components
import DesktopNav from "./DesktopNav";
import MobileDrawer from "./MobileDrawer";
import SearchOverlay from "./SearchOverlay";
import ProfileMenu from "./ProfileMenu";

interface HeaderProps {
  // IMPORTANT: Ensure this logo is white/light for the dark theme
  logoUrl?: string; 
}

function HeaderContent({ logoUrl = "/assets/icons/DesktopLogo-Light.svg" }: HeaderProps) {
  const pathname = usePathname();
  
  // Global Contexts
  const { cartCount, setCartOpen } = useCart();
  const { customer, logout } = useAuth();
  const isLoggedIn = !!customer;

  // Global UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Data States
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // --- API Integrations ---
  useEffect(() => {
    async function fetchNav() {
      try {
        const menuData = await getMenu("menu-custom");
        if (menuData?.items) {
          setMenuItems(menuData.items);
        }
      } catch (error) {
        console.error("Failed to load navigation", error);
      }
    }
    fetchNav();
  }, []);

  // --- Event Handlers & Effects ---
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  // Handle Scroll styling
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling
  useEffect(() => {
    if (isMobileDrawerOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen, isSearchOpen]);

  // Close overlays on route change
  useEffect(() => {
    closeSearch();
    setIsMobileDrawerOpen(false);
  }, [pathname, closeSearch]);

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 ease-out",
          // Premium Transition: Generous padding when at top, ultra-blurred dark glass when scrolled
          isScrolled || isSearchOpen
            ? "bg-black/70 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border-b border-white/5 py-3 md:py-4"
            : "bg-transparent border-b border-transparent py-5 md:py-8"
        )}
      >
        <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 w-full flex items-center justify-between">
          
          {/* ========================================== */}
          {/* DESKTOP VIEW                               */}
          {/* ========================================== */}
          <div className="hidden lg:flex items-center justify-between w-full">
            
            {/* Logo Area */}
            <div className="flex-1 flex items-center justify-start">
              <Link
                href="/"
                className="relative z-50 flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-sm transition-transform hover:scale-[1.02]"
              >
                <Image
                  src={logoUrl}
                  alt="Store Logo"
                  width={140}
                  height={48}
                  className={cn(
                    "transition-all duration-500 w-auto h-auto max-w-[180px] xl:max-w-[200px]",
                    isScrolled ? "lg:h-5 xl:h-6" : "lg:h-6 xl:h-7" // Scaled elegantly
                  )}
                  priority
                />
              </Link>
            </div>

            {/* Extracted Desktop Navigation (Centered) */}
            <div className="flex-shrink-0 flex justify-center">
               <DesktopNav menuItems={menuItems} />
            </div>

            {/* Right Side Actions & Icons */}
            <div className="flex-1 flex items-center justify-end gap-5 xl:gap-7">
              
              {/* Refined Custom Tattoo Button (Matches Mockup) */}
              <Link 
                href="/" 
                className="hidden xl:flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 backdrop-blur-sm group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)] animate-pulse"></span>
                <span className="text-[13px] tracking-wide font-medium text-white/90 group-hover:text-white">
                  Custom Tattoo
                </span>
              </Link>

              {/* Minimalist Icons */}
              <div className="flex items-center gap-2">
                <button
                  aria-label="Search"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300"
                >
                  {isSearchOpen ? (
                    <X className="w-5 h-5" strokeWidth={1.5} />
                  ) : (
                    <Search className="w-5 h-5" strokeWidth={1.5} />
                  )}
                </button>

                <button
                  aria-label="Cart"
                  onClick={() => setCartOpen(true)}
                  className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/5 transition-all duration-300 relative group"
                >
                  <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-0.5 right-0.5 bg-[#FF5A24] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md transform group-hover:scale-110 transition-transform">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Extracted Profile Menu */}
              <ProfileMenu 
                isLoggedIn={isLoggedIn} 
                customer={customer} 
                logout={logout} 
              />
            </div>
          </div>

          {/* ========================================== */}
          {/* MOBILE VIEW                                */}
          {/* ========================================== */}
          <div className="flex lg:hidden items-center justify-between w-full">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(true);
                if (isSearchOpen) closeSearch();
              }}
              className="p-2 -ml-2 group flex items-center justify-center h-10 w-10"
              aria-label="Open Menu"
            >
              <div className="flex flex-col items-start justify-center gap-[5px] w-5">
                <span className="w-full h-[1.5px] bg-white rounded-full transition-all duration-300 group-hover:bg-[#FF5A24]"></span>
                <span className="w-3/4 h-[1.5px] bg-white rounded-full transition-all duration-300 group-hover:w-full group-hover:bg-[#FF5A24]"></span>
              </div>
            </button>

            {/* Centered Mobile Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 outline-none"
            >
              <Image
                src={logoUrl}
                alt="Store Logo"
                width={100}
                height={32}
                className={cn(
                  "transition-all duration-500 w-auto",
                  isScrolled ? "h-[16px]" : "h-[20px]"
                )}
                priority
              />
            </Link>

            {/* Mobile Right Icons */}
            <div className="flex items-center gap-1 -mr-2">
              <button
                onClick={() => (isSearchOpen ? closeSearch() : setIsSearchOpen(true))}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Search"
              >
                {isSearchOpen ? (
                  <X className="w-[20px] h-[20px]" strokeWidth={1.5} />
                ) : (
                  <Search className="w-[20px] h-[20px]" strokeWidth={1.5} />
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-white/70 hover:text-white transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-[20px] h-[20px]" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0 bg-[#FF5A24] text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Extracted Overlays & Drawers */}
        <SearchOverlay 
          isSearchOpen={isSearchOpen} 
          closeSearch={closeSearch} 
        />
      </header>

      <MobileDrawer
        menuItems={menuItems}
        isMobileDrawerOpen={isMobileDrawerOpen}
        setIsMobileDrawerOpen={setIsMobileDrawerOpen}
        logoUrl={logoUrl}
        isLoggedIn={isLoggedIn}
        customer={customer}
        logout={logout}
      />
    </>
  );
}

// Ensure the suspense boundary stays intact for Next.js rendering optimization
// Fallback is transparent so it seamlessly reveals the Hero background beneath it
export default function Header(props: HeaderProps) {
  return (
    <Suspense
      fallback={
        <div className="py-8 w-full bg-transparent fixed top-0 z-50 pointer-events-none" />
      }
    >
      <HeaderContent {...props} />
    </Suspense>
  );
}