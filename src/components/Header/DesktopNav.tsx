
"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail, Sparkles } from "lucide-react";

// Adjust these import paths based on your actual file structure
import { cn } from "@/src/lib/utils";
import { MenuItem } from "./header.types";
import { generateHref, getRelativeUrl, dropdownVariants } from "./header.util";

interface DesktopNavProps {
  menuItems: MenuItem[];
  closeProfileMenu?: () => void;
}

export default function DesktopNav({ menuItems, closeProfileMenu }: DesktopNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to check if a path is currently active
  const isActive = (path: string) => pathname?.includes(path);

  const handleMouseEnter = (navItem: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredNav(navItem);
    setActiveDropdown(navItem);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNav(null);
      setActiveDropdown(null);
      if (closeProfileMenu) {
        closeProfileMenu();
      }
    }, 150);
  };

  return (
    <nav
      className="hidden md:flex h-full items-center justify-center gap-6 lg:gap-8"
      onMouseLeave={handleMouseLeave}
    >
      {menuItems.map((item) => {
        // Design Logic Checks
        const itemTitleLower = item.title.toLowerCase();
        const isSale = itemTitleLower === "sale";
        const isAIStudio = itemTitleLower.includes("ai"); // Check for AI Studio
        const isCurrentActive = isActive(getRelativeUrl(item.url));

        // Check if this menu has deeper 3rd-level links
        const hasDeepLinks = item.items?.some(
          (subItem) => subItem.items && subItem.items.length > 0
        );
        
        // Grab the current active category from the URL
        const currentCategory = searchParams?.get("category");

        return (
          <div
            key={item.id}
            className="relative h-full flex items-center cursor-pointer"
            onMouseEnter={() => handleMouseEnter(item.id)}
          >
            {/* Top Level Nav Link/Trigger */}
            {item.items && item.items.length > 0 ? (
              <span
                className={cn(
                  "relative z-10 font-medium text-[14px] lg:text-[15px] transition-colors duration-300 flex items-center gap-1.5 capitalize",
                  activeDropdown === item.id || isCurrentActive
                    ? isAIStudio 
                      ? "text-purple-400"
                      : "text-white" 
                    : isAIStudio
                      ? "text-purple-500 hover:text-purple-400" 
                      : "text-white/70 hover:text-white"
                )}
              >
                {isAIStudio && <Sparkles className="w-3.5 h-3.5" />}
                {item.title}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300 opacity-70",
                    activeDropdown === item.id && "rotate-180"
                  )}
                  strokeWidth={2}
                />
                
                {/* Active/Sale Orange Dot Indicator (Top Right) */}
                {isCurrentActive && (
                   <motion.div 
                     layoutId="active-dot" 
                     className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF5A24] shadow-[0_0_8px_rgba(255,90,36,0.8)]" 
                   />
                )}
              </span>
            ) : (
              <Link
                href={generateHref(item)}
                prefetch={true}
                onClick={() => setActiveDropdown(null)}
                className={cn(
                  "relative z-10 font-medium text-[14px] lg:text-[15px] transition-colors duration-300 flex items-center gap-1.5 capitalize",
                  isCurrentActive
                    ? isSale
                      ? "text-[#FF5A24]" 
                      : "text-white" 
                    : isSale
                      ? "text-[#FF5A24]/80 hover:text-[#FF5A24]" 
                      : "text-white/70 hover:text-white"
                )}
              >
                {item.title}

                {/* Active/Sale Orange Dot Indicator (Top Right) */}
                {isCurrentActive && (
                   <motion.div 
                     layoutId="active-dot" 
                     className="absolute -top-1 -right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF5A24] shadow-[0_0_8px_rgba(255,90,36,0.8)]" 
                   />
                )}
              </Link>
            )}

            {/* Mega Menu Dropdown (Dark Theme Upgraded) */}
            <AnimatePresence>
              {activeDropdown === item.id && item.items && item.items.length > 0 && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "absolute top-[calc(100%+20px)] left-1/2 -translate-x-1/2 bg-[#0A0A0A]/95 backdrop-blur-3xl rounded-2xl shadow-2xl border border-white/5 overflow-hidden z-50 origin-top flex flex-col lg:flex-row cursor-default",
                    hasDeepLinks ? "w-[90vw] max-w-[1000px]" : "w-[90vw] max-w-[600px]"
                  )}
                >
                  <div className="flex-1 flex flex-col h-full">
                    <div className={cn("p-8 pr-4", !hasDeepLinks && "p-6")}>
                      <div className="mb-6 border-b border-white/10 pb-3 flex items-center justify-between">
                        <h3 className="text-[#FF5A24] text-[11px] font-bold tracking-[0.2em] uppercase">
                          Shop by {item.title}
                        </h3>
                        <Link
                          href={generateHref(item)}
                          onClick={() => setActiveDropdown(null)}
                          prefetch={true}
                          className="text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-[0.2em] transition-colors"
                        >
                          View All →
                        </Link>
                      </div>

                      {hasDeepLinks ? (
                        /* --- MULTI-LEVEL GRID (Dark Theme Scrollbars & Borders) --- */
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 max-h-[50vh] overflow-y-auto pr-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#444] transition-colors">
                          {item.items.map((subItem: any) => (
                            <div key={subItem.id} className="flex flex-col space-y-3">
                              {/* Level 2 Heading */}
                              <Link
                                href={generateHref(subItem)}
                                onClick={() => setActiveDropdown(null)}
                                className={cn(
                                  "text-[14px] font-semibold border-b border-white/5 pb-1 transition-colors",
                                  currentCategory === subItem.title
                                    ? "text-[#FF5A24] border-[#FF5A24]/30"
                                    : "text-white/90 hover:text-[#FF5A24]"
                                )}
                              >
                                {subItem.title}
                              </Link>
                              {/* Level 3 Links */}
                              {subItem.items && subItem.items.length > 0 && (
                                <div className="flex flex-col space-y-2 pl-1 pt-1">
                                  {subItem.items.map((subSubItem: any) => {
                                    const isCurrentSubActive =
                                      currentCategory === subSubItem.title;
                                    return (
                                      <Link
                                        key={subSubItem.id}
                                        href={generateHref(subSubItem)}
                                        onClick={() => setActiveDropdown(null)}
                                        className={cn(
                                          "text-[13px] font-normal transition-all duration-300 block py-0.5",
                                          isCurrentSubActive
                                            ? "text-[#FF5A24] translate-x-1"
                                            : "text-white/60 hover:text-white hover:translate-x-1"
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
                        /* --- SINGLE-LEVEL GRID --- */
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                          {item.items.map((subItem: any) => (
                            <Link
                              key={subItem.id}
                              href={generateHref(subItem)}
                              onClick={() => setActiveDropdown(null)}
                              className="group p-4 rounded-xl hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 flex items-center gap-4"
                            >
                              <div>
                                <h4 className="text-[14px] font-medium text-white/90 group-hover:text-[#FF5A24] transition-colors flex items-center gap-1">
                                  {subItem.title}
                                </h4>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Optional Footer Banner (Dark Theme) */}
                    {!hasDeepLinks && item.title.toLowerCase().includes("how") && (
                      <div className="bg-black/40 mt-auto px-8 py-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-white/50" />
                          <span className="text-[13px] font-medium text-white/50">
                            Still have questions? We're here to help.
                          </span>
                        </div>
                        <Link
                          href="/contact"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[12px] font-bold text-[#FF5A24] hover:brightness-125 transition-all"
                        >
                          Contact Support →
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Featured Art (Dark Theme Polaroid Effect) */}
                  {hasDeepLinks && (
                    <div className="hidden lg:flex w-[35%] bg-black/40 items-center justify-center relative p-8 border-l border-white/5">
                      <div className="relative w-full max-w-[220px] aspect-[3/4]">
                        <div className="absolute inset-0 bg-[#1A1A1A] border border-[#333] rounded-xl shadow-lg rotate-6 translate-x-6 origin-bottom-right transition-transform group-hover:rotate-12 duration-500"></div>
                        <div className="absolute inset-0 bg-[#222] border border-[#333] rounded-xl shadow-lg -rotate-3 -translate-x-3 origin-bottom-left transition-transform group-hover:-rotate-6 duration-500"></div>
                        <div className="absolute inset-0 bg-black rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] flex items-center justify-center border border-[#333] overflow-hidden z-10">
                          <Image
                            src="/assets/images/Card1.webp"
                            alt="Featured Nav Image"
                            fill
                            sizes="(max-width: 768px) 220px, 25vw"
                            className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-700 ease-out"
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
  );
}