"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Settings, Package } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface ProfileMenuProps {
  isLoggedIn: boolean;
  customer: any;
  logout: () => Promise<void>;
}

export default function ProfileMenu({ isLoggedIn, customer, logout }: ProfileMenuProps) {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileMenuOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  return (
    <div
      ref={profileMenuRef}
      className="pl-2 lg:pl-5 border-l border-white/10 flex items-center h-6 relative"
    >
      {/* Profile Toggle Button */}
      <button
        className={cn(
          "flex items-center justify-center p-2 rounded-full transition-all duration-300",
          isProfileMenuOpen ? "bg-white/10 text-white" : "text-white/70 hover:text-white hover:bg-white/5"
        )}
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        aria-label="Toggle profile menu"
      >
        <User className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-12 right-0 w-[280px] bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/5 shadow-2xl rounded-2xl z-50 overflow-hidden"
          >
            {isLoggedIn ? (
              <>
                {/* User Info Header */}
                <div className="p-5 bg-white/5 border-b border-white/5 flex items-center gap-4">
                  <div className="w-11 h-11 bg-[#FF5A24] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-[0_4px_12px_rgba(255,90,36,0.3)]">
                    {customer?.firstName?.charAt(0) || "U"}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[12px] font-medium text-white/50">Welcome back</span>
                    <span className="text-[15px] font-semibold text-white truncate">
                      {customer?.firstName} {customer?.lastName}
                    </span>
                  </div>
                </div>
                
                {/* Navigation Links */}
                <div className="p-2">
                  <Link
                    href="/account"
                    className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    Account Settings
                  </Link>
                  <Link
                    href="/account/orders"
                    className="flex items-center gap-3 px-4 py-2.5 text-[14px] font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <Package className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" strokeWidth={1.5} />
                    Order History
                  </Link>
                </div>
                
                {/* Logout Button */}
                <div className="p-2 border-t border-white/5 bg-black/20">
                  <button
                    className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-[14px] font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all group"
                    onClick={async () => {
                      await logout();
                      setIsProfileMenuOpen(false);
                    }}
                  >
                    <LogOut className="w-4 h-4 text-red-400/50 group-hover:text-red-400 transition-colors" strokeWidth={1.5} />
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Logged Out View - Premium Call to Action */}
                <div className="p-6">
                  <div className="text-center mb-6">
                    <h4 className="text-[16px] font-semibold text-white mb-1">My Account</h4>
                    <p className="text-[13px] text-white/50">Access orders & premium perks</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/login"
                      className="block w-full py-3 text-center bg-white text-black text-[14px] font-semibold rounded-full hover:bg-white/90 transition-all shadow-[0_4px_14px_rgba(255,255,255,0.1)] active:scale-[0.98]"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Log In
                    </Link>
                    <Link
                      href="/signup"
                      className="block w-full py-3 text-center bg-white/5 border border-white/10 text-white text-[14px] font-medium rounded-full hover:bg-white/10 transition-all active:scale-[0.98]"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Join Now
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}