"use client";

import { useState, useEffect, useRef, useCallback, Suspense} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Loader2,
  HelpCircle,
  Info,
  Sparkles,
  MessageCircleQuestion,
  Mail,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useCart } from "@/src/context/CartContext";
import { getCollectionNames, searchShopifyProducts } from "@/src/lib/shopify";
import { useAuth } from "@/src/context/AuthContext";
import { getMenu } from "@/src/lib/shopify"; // Adjust path if index.ts is elsewhere
import { useSearchParams } from "next/navigation";
interface MenuItem {
  id: string;
  title: string;
  url: string;
  items: MenuItem[];
}
interface HeaderProps {
  logoUrl?: string;
}
// Premium How it Works Data
const HOW_IT_WORKS_DATA = [
  {
    title: "How it works",
    description: "Learn the magic behind applying our tattoos.",
    href: "/how-it-works",
    icon: Sparkles,
  },
  {
    title: "Help & FAQ",
    description: "Quick answers to our most common questions.",
    href: "/help",
    icon: MessageCircleQuestion,
  },
  {
    title: "Help Center",
    description: "Comprehensive guides and customer support.",
    href: "/contact",
    icon: HelpCircle,
  },
  {
    title: "About us",
    description: "Our story, mission, and the team behind it all.",
    href: "/about",
    icon: Info,
  },
];

export interface ShopifyCollection {
  title: string;
  handle: string;
}

export interface SearchResult {
  id: string;
  handle: string;
  title: string;
  price: string;
  image: string;
  category?: string;
}

// Framer Motion Variants
const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 5,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

const drawerVariants: Variants = {
  hidden: { x: "-100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 35 },
  },
  exit: {
    x: "-100%",
    transition: { type: "spring", stiffness: 300, damping: 35 },
  },
};

// Custom Hook for Debouncing Search Inputs
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function HeaderContent({ logoUrl = '/assets/icons/DesktopLogo.svg' }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, setCartOpen } = useCart();
const searchParams = useSearchParams();
  // UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { customer, logout } = useAuth();
  const isLoggedIn = !!customer;

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Collections State
  const [collections, setCollections] = useState<ShopifyCollection[]>([]);
  const [isLoadingCollections, setIsLoadingCollections] = useState(true);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
 // const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // --- API Integrations ---
  useEffect(() => {
    const fetchCollections = async () => {
      const cached = sessionStorage.getItem("shopify_collections");
      if (cached) {
        setCollections(JSON.parse(cached));
        setIsLoadingCollections(false);
        return;
      }

      setIsLoadingCollections(true);
      try {
        const result = await getCollectionNames();
        setCollections(result || []);
        sessionStorage.setItem(
          "shopify_collections",
          JSON.stringify(result || []),
        );
      } catch (error) {
        console.error("Failed to fetch collection Names", error);
      } finally {
        setIsLoadingCollections(false);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    let isActive = true;

    const performSearch = async () => {
      const cleanQuery = debouncedSearchQuery.trim();
      // if (!debouncedSearchQuery.trim()) {
      //   setSearchResults([]);
      //   return;
      // }
      if (!cleanQuery) {
        setSearchResults([]);
        return;
      }


      setIsSearching(true);
      try {
        const results = await searchShopifyProducts(debouncedSearchQuery);
        // setSearchResults(results || []);
        if (isActive) {
          setSearchResults(results || []);
        }

      } catch (error) {
        console.error("Search failed", error);
        // setSearchResults([]);
        if (isActive) {
          setSearchResults([]);
        }

      } finally {
        // setIsSearching(false);
        if (isActive) {
          setIsSearching(false);
        }
      }
    };

    performSearch();
    return () => {
      isActive = false;
    };
    
  }, [debouncedSearchQuery]);

   useEffect(() => {
    async function fetchNav() {
      try {
        // 'main-menu' is Shopify's default handle for the header navigation
        const menuData = await getMenu('menu-custom');
        if (menuData?.items) {
          setMenuItems(menuData.items);
        }
        console.log("Fetched navigation menu:", menuData);
      } catch (error) {
        console.error("Failed to load navigation", error);
      }
    }
    fetchNav();
  }, []);

  const getRelativeUrl = useCallback((url: string) => {
    if (!url) return "#";
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search;
    } catch (e) {
      return url.startsWith('/') ? url : `/${url}`;
    }
  }, []);

  // --- Event Handlers ---
  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const handleMouseEnter = (navItem: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredNav(navItem);
    setActiveDropdown(navItem);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
      setActiveDropdown(null);
      setIsProfileMenuOpen(false);
    }, 150);
  };

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    // If the menu is open, and the click target is NOT inside our referenced div, close it
    if (
      isProfileMenuOpen &&
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target as Node)
    ) {
      setIsProfileMenuOpen(false);
    }
  };

  // Only attach the listener if the menu is open
  if (isProfileMenuOpen) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [isProfileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileDrawerOpen || isSearchOpen)
      document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileDrawerOpen, isSearchOpen]);

  useEffect(() => {
    closeSearch();
    setIsMobileDrawerOpen(false);
  }, [pathname, closeSearch]);

  // Close search on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  const isActive = (path: string) => pathname?.includes(path);
    const generateHref = (menuItem: any) => {
      if (!menuItem.url) return '#';
      
      const title = menuItem.title.toLowerCase();
      // 1. Strip the Shopify absolute domain so we only deal with relative paths
      let path = menuItem.url.replace(/^https?:\/\/[^\/]+/, '');

      // 2. FORCE CUSTOM NEXT.JS ROUTES FIRST
      // This ensures your specific page.tsx files get hit instead of generic Shopify pages
      if (title.includes('new arrival')) return '/new-arrivals';
      if (title === 'sale' || path.includes('/pages/sale')) return '/sale';
      
      // Map the (info) route group pages based on your screenshot
      if (title.includes('about') || path.includes('/about-us')) return '/about';
      if (title.includes('faq') || title.includes('help')) return '/help';
      if (title === 'how it works' || path.includes('how-it-works')) return '/how-it-works';
      if (title.includes('contact')) return '/contact';

      // 3. HANDLE COLLECTIONS AND FILTERS
      // We only do this if it didn't match a custom route above!
      if (menuItem.type === "COLLECTION") {
        return `/collections?category=${encodeURIComponent(menuItem.title)}`;
      }
      if (menuItem.type === "COLLECTIONS" || title === "collection") {
        return "/collections";
      }

      // 4. HANDLE EMPTY DROPDOWN TRIGGERS
      // (e.g., your parent "How It Works" menu item has url "https://checkout...#")
      if (path === '#' || path === '/#') return '#';

      // 5. DYNAMIC FALLBACK
      // If the client adds a completely new page or blog, just pass the clean path through.
      return path;
    };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 ease-in-out",
          isScrolled || isSearchOpen
            ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border-b border-gray-200"
            : "bg-white border-b border-transparent",
          isScrolled ? "h-16 md:h-20" : "h-18 md:h-24",
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-full relative">
          {/* ========================================== */}
          {/* DESKTOP VIEW                               */}
          {/* ========================================== */}
          <div className="hidden lg:flex items-center w-full h-full">
            <div className="flex-1 flex items-center justify-start">
              <Link
                href="/"
                className="relative z-50 flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] rounded-sm transition-transform hover:scale-[1.02]"
              >
                <Image
                  src={logoUrl}
                  alt="Just Tattoos"
                  width={140}
                  height={48}
                  className={cn(
                    "transition-all duration-300 w-auto h-auto max-w-[200px] xl:max-w-[240px]",
                    isScrolled ? "lg:h-7 xl:h-8" : "lg:h-8 xl:h-10",
                  )}
                  priority
                />
              </Link>
            </div>

{/* DYNAMIC DESKTOP NAVIGATION (Restored Premium Styling & Connected Routing) */}
<nav
  className="hidden md:flex h-full items-center justify-center gap-2"
  onMouseLeave={handleMouseLeave}
>
  {menuItems.map((item) => {

    // Check if "Sale" to apply red styling
    const isSale = item.title.toLowerCase() === "sale";
    
    // Check if this menu has deeper 3rd-level links (e.g., Collections -> Body Part -> Ankle)
    const hasDeepLinks = item.items?.some(
      (subItem) => subItem.items && subItem.items.length > 0
    );

    // HELPER: Map Shopify Collection links to our robust Next.js filter parameters
    // const generateHref = (menuItem: any) => {
    //   if (menuItem.type === "COLLECTION") {
    //     return `/collections?category=${encodeURIComponent(menuItem.title)}`;
    //   }
    //   if (menuItem.type === "COLLECTIONS" || menuItem.title.toLowerCase() === "collection") {
    //     return "/collections";
    //   }
    //   return getRelativeUrl(menuItem.url);
    // };

    // const generateHref = (menuItem: any) => {
    //   if (!menuItem.url) return '#';
      
    //   const title = menuItem.title.toLowerCase();
    //   // 1. Strip the Shopify absolute domain so we only deal with relative paths
    //   let path = menuItem.url.replace(/^https?:\/\/[^\/]+/, '');

    //   // 2. FORCE CUSTOM NEXT.JS ROUTES FIRST
    //   // This ensures your specific page.tsx files get hit instead of generic Shopify pages
    //   if (title.includes('new arrival')) return '/new-arrivals';
    //   if (title === 'sale' || path.includes('/pages/sale')) return '/sale';
      
    //   // Map the (info) route group pages based on your screenshot
    //   if (title.includes('about') || path.includes('/about-us')) return '/about';
    //   if (title.includes('faq') || title.includes('help')) return '/help';
    //   if (title === 'how it works' || path.includes('how-it-works')) return '/how-it-works';
    //   if (title.includes('contact')) return '/contact';

    //   // 3. HANDLE COLLECTIONS AND FILTERS
    //   // We only do this if it didn't match a custom route above!
    //   if (menuItem.type === "COLLECTION") {
    //     return `/collections?category=${encodeURIComponent(menuItem.title)}`;
    //   }
    //   if (menuItem.type === "COLLECTIONS" || title === "collection") {
    //     return "/collections";
    //   }

    //   // 4. HANDLE EMPTY DROPDOWN TRIGGERS
    //   // (e.g., your parent "How It Works" menu item has url "https://checkout...#")
    //   if (path === '#' || path === '/#') return '#';

    //   // 5. DYNAMIC FALLBACK
    //   // If the client adds a completely new page or blog, just pass the clean path through.
    //   return path;
    // };

    // Grab the current active category from the URL to highlight active sub-links
    const currentCategory = searchParams?.get("category");

    return (
      <div
        key={item.id}
        className="relative h-full flex items-center px-4 cursor-pointer"
        onMouseEnter={() => handleMouseEnter(item.id)}
      >
        {/* Hover Pill Background */}
        {hoveredNav === item.id && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-y-5 inset-x-0 bg-gray-100/80 rounded-full z-0"
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}

        {/* Top Level Nav Link */}
        {item.items && item.items.length > 0 ? (
          <span
            className={cn(
              "relative z-10 font-bold text-[14px] tracking-wider transition-colors flex items-center gap-1.5 uppercase",
              activeDropdown === item.id || isActive(getRelativeUrl(item.url))
                ? "text-[var(--color-brand-orange)]"
                : "text-gray-900"
            )}
          >
            {item.title}
            <ChevronDown
              className={cn(
                "w-4 h-4 transition-transform duration-300",
                activeDropdown === item.id && "rotate-180"
              )}
            />
          </span>
        ) : (
          <Link
            href={generateHref(item)}
            onClick={() => setActiveDropdown(null)}
            className={cn(
              "relative z-10 font-bold text-[14px] tracking-wider transition-colors flex items-center gap-1.5 uppercase",
              isActive(getRelativeUrl(item.url))
                ? isSale
                  ? "text-red-600"
                  : "text-[var(--color-brand-orange)]"
                : isSale
                ? "text-red-500"
                : "text-gray-900"
            )}
          >
            {item.title}
          </Link>
        )}

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeDropdown === item.id && item.items && item.items.length > 0 && (
            <motion.div
              variants={dropdownVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "absolute top-[calc(100%-8px)] left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-50 origin-top flex flex-col lg:flex-row cursor-default",
                hasDeepLinks ? "w-[90vw] max-w-[1000px]" : "w-[90vw] max-w-[600px]"
              )}
            >
              <div className="flex-1 flex flex-col h-full">
                <div className={cn("p-8 pr-4", !hasDeepLinks && "p-6")}>
                  <div className="mb-6 border-b border-gray-100 pb-2 flex items-center justify-between">
                    <h3 className="text-[var(--color-brand-orange)] text-[13px] font-bold tracking-widest uppercase">
                      Shop by {item.title}
                    </h3>
                    {/* Convenience link to view all */}
                    <Link
                      href={generateHref(item)}
                      onClick={() => setActiveDropdown(null)}
                      className="text-[11px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-wider"
                    >
                      View All →
                    </Link>
                  </div>

                  {hasDeepLinks ? (
                    /* --- MULTI-LEVEL GRID (e.g. Collections -> Styles -> Animal) --- */
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 max-h-[50vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-50 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
                      {item.items.map((subItem) => (
                        <div key={subItem.id} className="flex flex-col space-y-3">
                          {/* Level 2 Heading */}
                          <Link
                            href={generateHref(subItem)}
                            onClick={() => setActiveDropdown(null)}
                            className={cn(
                              "text-[14px] font-bold border-b border-gray-50 pb-1 transition-colors",
                              currentCategory === subItem.title 
                                ? "text-[var(--color-brand-orange)] border-[var(--color-brand-orange)]/20" 
                                : "text-gray-900 hover:text-[var(--color-brand-orange)]"
                            )}
                          >
                            {subItem.title}
                          </Link>
                          {/* Level 3 Links */}
                          {subItem.items && subItem.items.length > 0 && (
                            <div className="flex flex-col space-y-2 pl-1">
                              {subItem.items.map((subSubItem) => {
                                const isCurrentActive = currentCategory === subSubItem.title;
                                return (
                                  <Link
                                    key={subSubItem.id}
                                    href={generateHref(subSubItem)}
                                    onClick={() => setActiveDropdown(null)}
                                    className={cn(
                                      "text-[13px] font-medium transition-all duration-300 block py-0.5",
                                      isCurrentActive
                                        ? "text-[var(--color-brand-orange)] translate-x-1"
                                        : "text-gray-500 hover:text-[var(--color-brand-orange)] hover:translate-x-1"
                                    )}
                                  >
                                    {subSubItem.title}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* --- SINGLE-LEVEL GRID (e.g. How it Works -> Help Center) --- */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {item.items.map((subItem) => (
                        <Link
                          key={subItem.id}
                          href={generateHref(subItem)}
                          onClick={() => setActiveDropdown(null)}
                          className="group p-4 rounded-xl hover:bg-orange-50/50 transition-all duration-300 border border-transparent hover:border-orange-100 flex items-center gap-4"
                        >
                          <div>
                            <h4 className="text-[14px] font-bold text-gray-900 group-hover:text-[var(--color-brand-orange)] transition-colors flex items-center gap-1">
                              {subItem.title}
                            </h4>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Optional Footer Banner */}
                {!hasDeepLinks && item.title.toLowerCase().includes("how") && (
                  <div className="bg-gray-50 mt-auto px-8 py-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-[13px] font-medium text-gray-600">
                        Still have questions? We're here to help.
                      </span>
                    </div>
                    <Link
                      href="/contact"
                      onClick={() => setActiveDropdown(null)}
                      className="text-[13px] font-bold text-[var(--color-brand-orange)] hover:text-orange-600 hover:underline underline-offset-4 transition-all"
                    >
                      Contact Support →
                    </Link>
                  </div>
                )}
              </div>

              {/* Featured Art */}
              {hasDeepLinks && (
                <div className="hidden lg:flex w-[35%] bg-gray-50 items-center justify-center relative p-8">
                  <div className="relative w-full max-w-[220px] aspect-[3/4]">
                    <div className="absolute inset-0 bg-white border border-gray-200 rounded-xl shadow-lg rotate-6 translate-x-6 origin-bottom-right"></div>
                    <div className="absolute inset-0 bg-white border border-gray-200 rounded-xl shadow-lg -rotate-3 -translate-x-3 origin-bottom-left"></div>
                    <div className="absolute inset-0 bg-gray-900 rounded-xl shadow-xl flex items-center justify-center border-4 border-white overflow-hidden z-10">
                      <Image
                        src="/assets/images/Card1.png"
                        alt="Featured Nav Image"
                        fill
                        sizes="(max-width: 768px) 220px, 25vw"
                        className="object-cover"
                      />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  })}
</nav>

            {/* Right Side Icons */}
            <div className="flex-1 flex items-center justify-end gap-3 lg:gap-5">
              <button
                aria-label="Search"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="text-gray-900 hover:text-[var(--color-brand-orange)] p-2 rounded-full hover:bg-gray-50 transition-all"
              >
                {isSearchOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.8} />
                ) : (
                  <Search className="w-5 h-5" strokeWidth={1.8} />
                )}
              </button>

              <button
                aria-label="Cart"
                onClick={() => setCartOpen(true)}
                className="text-gray-900 hover:text-[var(--color-brand-orange)] p-2 rounded-full hover:bg-gray-50 transition-all relative group"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[var(--color-brand-orange)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm transform group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </button>

              <div 
              ref={profileMenuRef}
              className="pl-3 lg:pl-5 border-l border-gray-200 flex items-center gap-3 lg:gap-4 h-8 relative">
                <button
                  className="flex items-center gap-2 text-gray-900 hover:text-[var(--color-brand-orange)] p-2 rounded-full hover:bg-gray-50 transition-all"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <User className="w-5 h-5" strokeWidth={1.8} />
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-12 right-0 w-48 bg-white border border-gray-100 shadow-xl rounded-2xl py-2 z-50"
                    >
                      {isLoggedIn ? (
                        <>
                          <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                            <div className="w-10 h-10 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] rounded-full flex items-center justify-center font-black text-lg">
                              {customer?.firstName?.charAt(0) || "U"}
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-gray-900">
                                Welcome,
                              </p>
                              <p className="text-sm font-bold text-gray-600 truncate max-w-[140px]">
                                {customer?.firstName || "User"}!
                              </p>
                            </div>
                          </div>
                          <div className="p-2">
                            <Link
                              href="/account"
                              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-[var(--color-brand-orange)] rounded-xl transition-colors"
                            >
                              <User className="w-4 h-4" /> My Account
                            </Link>
                          </div>
                          <div className="p-2 border-t border-gray-100">
                            <button
                              className="flex items-center gap-3 px-4 py-3 w-full text-left text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              onClick={async () => {
                                await logout();
                                setIsProfileMenuOpen(false);
                              }}
                            >
                              <LogOut className="w-4 h-4" /> Log Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Update these links to point to the new pages instead of "/" */}
                          <div className="p-4 flex flex-col gap-3">
                            <Link
                              href="/login"
                              className="block w-full py-3 text-center bg-[var(--color-brand-orange)] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 shadow-md transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              Log In
                            </Link>
                            <Link
                              href="/signup"
                              className="block w-full py-3 text-center bg-white border border-gray-200 text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-gray-50 transition-colors"
                              onClick={() => setIsProfileMenuOpen(false)}
                            >
                              Create Account
                            </Link>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex lg:hidden items-center justify-between w-full h-full">
            <button
              onClick={() => {
                setIsMobileDrawerOpen(true);
                if (isSearchOpen) closeSearch();
              }}
              className="p-2 -ml-2 group flex items-center justify-center h-10 w-10"
              aria-label="Open Menu"
            >
              <div className="flex flex-col items-start justify-center gap-[5px] w-5">
                <span className="w-full h-[2px] bg-gray-900 rounded-full transition-all duration-300 group-hover:bg-[var(--color-brand-orange)]"></span>
                <span className="w-3/4 h-[2px] bg-gray-900 rounded-full transition-all duration-300 group-hover:w-full group-hover:bg-[var(--color-brand-orange)]"></span>
              </div>
            </button>

            {/* SMALLER LOGO */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 outline-none"
            >
              <Image
               src={logoUrl}

                alt="Just Tattoos"
                width={96}
                height={32}
                className={cn(
                  "transition-all duration-300 w-auto",
                  isScrolled ? "h-[18px]" : "h-5", // Visibly smaller logo
                )}
                priority
              />
            </Link>

            {/* REFINED RIGHT ICONS */}
            <div className="flex items-center gap-1 -mr-2">
              {/* <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-900 hover:text-[var(--color-brand-orange)] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" strokeWidth={1.8} />
              </button> */}
              <button
                onClick={() =>
                  isSearchOpen ? closeSearch() : setIsSearchOpen(true)
                }
                className="p-2 text-gray-900 hover:text-[var(--color-brand-orange)] transition-colors"
                aria-label="Search"
              >
                {isSearchOpen ? (
                  <X className="w-5 h-5" strokeWidth={1.8} />
                ) : (
                  <Search className="w-5 h-5" strokeWidth={1.8} />
                )}
              </button>
              <button
                onClick={() => setCartOpen(true)}
                className="p-2 text-gray-900 hover:text-[var(--color-brand-orange)] transition-colors relative"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" strokeWidth={1.8} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-0.5 bg-[var(--color-brand-orange)] text-white text-[9px] font-black w-[15px] h-[15px] flex items-center justify-center rounded-full shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* OPTIMIZED SHOPIFY SEARCH BAR               */}
        {/* ========================================== */}
        <AnimatePresence>
          {isSearchOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeSearch}
                className="fixed inset-0 bg-black/40 z-30 backdrop-blur-sm"
              />

              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-2xl overflow-visible z-40 rounded-b-2xl"
              >
                <button
                  onClick={closeSearch}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-gray-400 hover:text-black-500 hover:bg-black-50 rounded-full transition-all z-50 flex flex-col items-center group"
                  aria-label="Close search drawer"
                >
                  <X className="w-6 h-6" strokeWidth={5} />
                  {/* <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-red-500 mt-1 hidden sm:block">
                    Esc
                  </span> */}
                </button>

                <div className="max-w-[700px] mx-auto px-4 py-6 relative">
                  <div className="relative flex items-center w-full">
                    {isSearching ? (
                      <Loader2 className="absolute left-5 w-5 h-5 text-[var(--color-brand-orange)] animate-spin" />
                    ) : (
                      <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                    )}

                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search for products, styles, or collections..."
                      className="w-full pl-14 pr-12 py-4 bg-gray-50/50 border-2 border-gray-100 rounded-full focus:outline-none focus:border-[var(--color-brand-orange)] focus:bg-white text-gray-900 shadow-sm transition-all text-base font-medium placeholder:font-normal"
                      autoFocus
                    />

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}

                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 p-1.5 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Clear search text"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {searchQuery.trim().length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-[calc(100%+8px)] left-4 right-4 sm:left-0 sm:right-0 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden z-50"
                      >
                        {isSearching ? (
                          <div className="p-10 flex flex-col items-center justify-center text-center text-gray-500">
                            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[var(--color-brand-orange)]" />
                            <p className="font-medium">Searching store...</p>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="flex flex-col max-h-[50vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/80 sticky top-0 z-10 backdrop-blur-md">
                              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Products ({searchResults.length})
                              </span>
                            </div>
                            {searchResults.map((product) => (
                              <Link
                                key={product.id}
                                href={`/products/${product.handle}`}
                                onClick={closeSearch}
                                className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 group"
                              >
                                <div className="w-14 h-14 min-w-[56px] relative bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200 group-hover:border-[var(--color-brand-orange)]/50 transition-colors">
                                  <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill
                                    sizes="56px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1 flex flex-col">
                                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-[var(--color-brand-orange)] transition-colors">
                                    {product.title}
                                  </h4>
                                  {product.category && (
                                    <span className="text-xs text-gray-500 mt-0.5">
                                      {product.category}
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm font-black text-gray-900">
                                  ${product.price}
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="p-10 flex flex-col items-center justify-center text-center">
                            <Search className="w-10 h-10 text-gray-200 mb-3" />
                            <p className="text-gray-900 font-bold">
                              No results found for "{searchQuery}"
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              Check the spelling or try a different term.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 z-[60] md:hidden backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              // Increased width slightly for a more luxurious feel, added flex-col to enable sticky footer
              className="fixed top-0 left-0 bottom-0 w-[90%] max-w-[400px] bg-white z-[70] md:hidden flex flex-col shadow-2xl"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white z-10">
                <Image
                 src={logoUrl}
                  alt="Just Tattoos"
                  width={110}
                  height={36}
                  className="w-auto h-7"
                />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-2 bg-gray-50 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" strokeWidth={2} />
                </button>
              </div>

              {/* SCROLLABLE LINKS AREA */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                {/* DYNAMIC MOBILE LINKS AREA */}
              <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                <div className="flex flex-col px-6 pt-6">
                  {menuItems.map((item) => {
                    const isSale = item.title.toLowerCase() === "sale";
                    const hasDeepLinks = item.items && item.items.length > 0;

                    if (hasDeepLinks) {
                      return (
                        <div key={item.id} className="border-b border-gray-100">
                          <div className="w-full py-4 flex items-center justify-between group">
                            <Link
                              href={generateHref(item)}
                              className="text-[13px] font-black tracking-[0.15em] text-gray-900 flex-1 text-left hover:opacity-70 transition-opacity uppercase"
                              onClick={() => setIsMobileDrawerOpen(false)}
                            >
                              {item.title}
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setMobileExpanded(mobileExpanded === item.id ? null : item.id);
                              }}
                              className="p-2 -mr-2 flex items-center justify-center cursor-pointer"
                              aria-label={`Toggle ${item.title} menu`}
                            >
                              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300 text-gray-400 group-hover:text-gray-900", mobileExpanded === item.id && "rotate-180")} />
                            </button>
                          </div>

                          <AnimatePresence>
                            {mobileExpanded === item.id && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex flex-col gap-1">
                                  {item.items.map((subItem: any) => (
                                    <div key={subItem.id} className="flex flex-col">
                                      <Link
                                        href={generateHref(subItem)}
                                        className="text-gray-600 text-[14px] font-bold hover:bg-white hover:text-[var(--color-brand-orange)] hover:shadow-sm transition-all py-2.5 px-4 rounded-xl flex items-center justify-between"
                                        onClick={() => setIsMobileDrawerOpen(false)}
                                      >
                                        {subItem.title}
                                      </Link>
                                      
                                      {/* Third Level Deep Links (e.g. Body Part -> Ankle) */}
                                      {subItem.items && subItem.items.length > 0 && (
                                        <div className="flex flex-col pl-4 ml-4 border-l-2 border-gray-200/50 space-y-1 mt-1 mb-2">
                                          {subItem.items.map((subSubItem: any) => (
                                            <Link
                                              key={subSubItem.id}
                                              href={generateHref(subSubItem)}
                                              className="text-gray-500 text-[13px] font-medium hover:text-[var(--color-brand-orange)] py-1.5 px-2 rounded-lg transition-colors"
                                              onClick={() => setIsMobileDrawerOpen(false)}
                                            >
                                              {subSubItem.title}
                                            </Link>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    // Single Item Link (e.g. New Arrivals, Sale)
                    return (
                      <Link
                        key={item.id}
                        href={generateHref(item)}
                        className={cn(
                          "py-4 text-[13px] font-black tracking-[0.15em] border-b border-gray-100 flex items-center justify-between group uppercase",
                          isSale ? "text-red-500" : "text-gray-900"
                        )}
                        onClick={() => setIsMobileDrawerOpen(false)}
                      >
                        {item.title}
                        <span className={cn("opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all", isSale ? "text-red-500" : "text-[var(--color-brand-orange)]")}>
                          →
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
              </div>

              {/* STICKY FOOTER (Auth & Contact) */}
              <div className="mt-auto bg-gray-50 border-t border-gray-100 p-6">
                <div className="flex flex-col gap-3">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] rounded-full flex items-center justify-center font-black text-lg">
                          {customer?.firstName?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                            Logged in as
                          </p>
                          <p className="text-sm font-bold text-gray-900">
                            {customer?.firstName || "User"} {customer?.lastName}
                          </p>
                        </div>
                      </div>
                      <Link
                        href="/account"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-[var(--color-brand-orange)] transition-colors shadow-md"
                        onClick={() => setIsMobileDrawerOpen(false)}
                      >
                        <User className="w-4 h-4" /> My Account
                      </Link>
                      <button
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-transparent text-gray-500 hover:text-red-500 rounded-xl font-bold transition-colors"
                        // Changed from setIsLoggedIn(false) to await logout()
                        onClick={async () => {
                          await logout();
                          setIsMobileDrawerOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" /> Log Out
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Update these links to point to the new pages instead of "/" */}
                      <Link
                        href="/login"
                        className="flex justify-center items-center py-3.5 bg-[var(--color-brand-orange)] text-white rounded-xl font-bold hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20 uppercase tracking-widest text-xs"
                        onClick={() => setIsMobileDrawerOpen(false)}
                      >
                        Log In
                      </Link>
                      <Link
                        href="/signup"
                        className="flex justify-center items-center py-3.5 bg-white border border-gray-200 text-gray-900 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm uppercase tracking-widest text-xs"
                        onClick={() => setIsMobileDrawerOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function Header(props: HeaderProps) {
  return (
    // You can provide a basic skeleton or empty div as a fallback to prevent layout shift
    <Suspense fallback={<div className="h-16 md:h-20 w-full bg-white border-b border-gray-100 fixed top-0 z-50" />}>
      <HeaderContent {...props} />
    </Suspense>
  );
}