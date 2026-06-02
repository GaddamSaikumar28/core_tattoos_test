"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { X, ChevronDown, LogOut, Sparkles } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { generateHref } from "./header.util";
import { MenuItem } from "./header.types";

interface MobileDrawerProps {
  menuItems: MenuItem[];
  isMobileDrawerOpen: boolean;
  setIsMobileDrawerOpen: (isOpen: boolean) => void;
  logoUrl: string;
  isLoggedIn: boolean;
  customer: any;
  logout: () => Promise<void>;
}

const drawerVariants: Variants = {
  hidden: { x: "-100%" },
  visible: { 
    x: 0, 
    transition: { 
      type: "spring", 
      damping: 25, 
      stiffness: 200,
      staggerChildren: 0.1 
    } 
  },
  exit: { 
    x: "-100%", 
    transition: { ease: "easeInOut", duration: 0.3 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function MobileDrawer({
  menuItems,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  logoUrl,
  isLoggedIn,
  customer,
  logout,
}: MobileDrawerProps) {
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {isMobileDrawerOpen && (
        <>
          {/* Backdrop: Premium Dark Glass Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-[60] lg:hidden backdrop-blur-sm"
          />

          {/* Drawer: Sleek Dark Container */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[380px] bg-[#0A0A0A]/95 backdrop-blur-3xl z-[70] lg:hidden flex flex-col shadow-2xl border-r border-white/5"
          >
            {/* HEADER */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={100}
                  height={30}
                  className="w-auto h-5 object-contain"
                />
              ) : (
                <span className="font-semibold text-lg text-white">Logo</span>
              )}
              
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white rounded-full transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* NAVIGATION */}
            <div className="flex-1 overflow-y-auto custom-scrollbar py-4">
              <nav className="flex flex-col px-6 space-y-1">
                {menuItems.map((item) => {
                  const itemTitleLower = item.title.toLowerCase();
                  const isSale = itemTitleLower === "sale";
                  const isAIStudio = itemTitleLower.includes("ai");
                  const hasDeepLinks = item.items && item.items.length > 0;

                  return (
                    <motion.div variants={itemVariants} key={item.id} className="flex flex-col">
                      <div className={cn(
                        "flex items-center justify-between py-3.5 border-b border-white/5 group",
                        mobileExpanded === item.id && "border-transparent"
                      )}>
                        <Link
                          href={generateHref(item)}
                          prefetch={true}
                          className={cn(
                            "text-[16px] font-medium capitalize flex items-center gap-2.5 transition-colors",
                            isAIStudio ? "text-purple-400" : 
                            isSale ? "text-[#FF5A24]" : "text-white/90 hover:text-white"
                          )}
                          onClick={() => setIsMobileDrawerOpen(false)}
                        >
                          {isAIStudio && <Sparkles className="w-4 h-4" />}
                          {item.title}
                        </Link>
                        
                        {hasDeepLinks && (
                          <button
                            onClick={() => setMobileExpanded(mobileExpanded === item.id ? null : item.id)}
                            className={cn(
                              "p-2 rounded-full bg-transparent hover:bg-white/5 transition-all flex items-center justify-center",
                              mobileExpanded === item.id && "bg-white/5 text-[#FF5A24]"
                            )}
                            aria-label={`Expand ${item.title}`}
                          >
                            <ChevronDown className={cn("w-5 h-5 text-white/50 transition-transform duration-300", mobileExpanded === item.id && "rotate-180 text-[#FF5A24]")} strokeWidth={1.5} />
                          </button>
                        )}
                      </div>

                      {/* SUBMENU ACCORDION */}
                      <AnimatePresence>
                        {hasDeepLinks && mobileExpanded === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-1 mb-5 ml-2 pl-4 border-l border-white/10 flex flex-col gap-5 py-2">
                              {item.items.map((subItem: any) => (
                                <div key={subItem.id} className="flex flex-col gap-2.5">
                                  <Link
                                    href={generateHref(subItem)}
                                    className="text-[15px] font-medium text-white hover:text-[#FF5A24] transition-colors"
                                    onClick={() => setIsMobileDrawerOpen(false)}
                                  >
                                    {subItem.title}
                                  </Link>
                                  {subItem.items?.map((deepLink: any) => (
                                    <Link
                                      key={deepLink.id}
                                      href={generateHref(deepLink)}
                                      className="text-[14px] text-white/60 hover:text-white transition-colors py-1"
                                      onClick={() => setIsMobileDrawerOpen(false)}
                                    >
                                      {deepLink.title}
                                    </Link>
                                  ))}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* FOOTER */}
            <div className="p-6 bg-black/40 border-t border-white/5">
              <div className="flex flex-col gap-4">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
                      <div className="w-11 h-11 bg-[#FF5A24] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                        {customer?.firstName?.charAt(0) || "U"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium text-white/50 uppercase tracking-wider">Welcome back</span>
                        <span className="text-[15px] font-semibold text-white">{customer?.firstName || "User"}</span>
                      </div>
                    </div>
                    <button
                      onClick={async () => { await logout(); setIsMobileDrawerOpen(false); }}
                      className="w-full py-3.5 rounded-full text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 border border-transparent hover:border-white/10"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="py-3.5 bg-white text-black text-[14px] font-semibold rounded-full text-center shadow-[0_4px_14px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="py-3.5 bg-white/5 border border-white/10 text-white text-[14px] font-semibold rounded-full text-center hover:bg-white/10 active:scale-95 transition-all"
                    >
                      Join
                    </Link>
                  </div>
                )}
                
                <Link 
                  href="/contact" 
                  className="mt-2 text-center text-[12px] font-medium text-white/40 hover:text-white transition-colors"
                  onClick={() => setIsMobileDrawerOpen(false)}
                >
                  Need help? Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}