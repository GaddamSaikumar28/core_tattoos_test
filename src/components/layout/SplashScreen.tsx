"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// FIXED: Explicitly typed as a 4-element tuple to resolve the TypeScript Easing compilation error
const luxuryEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function SplashScreen() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setShowIntro(false);
      return;
    }

    document.body.style.overflow = "hidden";

    // TIMELINE CALCULATION (Slower, premium pacing):
    // Spin (3.0s) -> Text Reveal (1.8s) -> Hold & Appreciate (2.0s) = 6.8 seconds total display time
    const completeTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("hasSeenSplash", "true");
      window.dispatchEvent(new Event("splashComplete"));
      // Let the 1.0-second exit fade animation finish completely before releasing scroll
      const scrollTimer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 1000); 
      
      return () => clearTimeout(scrollTimer);
    }, 6800);

    return () => {
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isMounted) {
    return <div suppressHydrationWarning className="fixed inset-0 z-[100] bg-[#050505]" />;
  }

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="jt-splash"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.02, // Ultra-subtle elegant scale out
            filter: "blur(15px)",
            transition: { duration: 1.0, ease: luxuryEase }, // Silky smooth 1-second fade out
          }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] overflow-hidden select-none pointer-events-auto"
        >
          {/* Ambient Background Glow - Breathes outward as the logo expands */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0.2 }}
            animate={{ scale: 1.5, opacity: 0.5 }}
            transition={{ duration: 4.0, delay: 2.8, ease: luxuryEase }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF7A00]/5 rounded-full blur-[120px] pointer-events-none"
          />

          {/* Core Logo Container */}
          <div className="relative flex flex-col items-center justify-center">
            
            {/* The Morphing Typographic Element */}
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 720 }}
              transition={{
                duration: 3.0, // Slowed down significantly for a weighted, deliberate rotation
                ease: luxuryEase,
              }}
              className="flex items-center justify-center text-white text-6xl sm:text-7xl font-black tracking-normal"
              style={{
                fontFamily: "'Bebas Neue', 'Impact', sans-serif",
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              {/* Anchor Letter: J */}
              <span className="text-[#FF7A00] inline-block">J</span>

              {/* 'UST ' Content Container */}
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 1.8, delay: 2.9, ease: luxuryEase }} // Smooth, unhurried width expansion
                className="overflow-hidden inline-block whitespace-pre text-white"
                style={{ willChange: "width, opacity" }}
              >
                UST{" "}
              </motion.span>

              {/* Anchor Letter: T */}
              {/* Perfectly centered during rotation; spacing is cleanly handled by the whitespace above */}
              <span className="text-[#FF7A00] inline-block">T</span>

              {/* 'ATTOOS' Content Container */}
              <motion.span
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ duration: 1.8, delay: 3.0, ease: luxuryEase }} // Staggered by 0.1s after 'UST' for natural flow
                className="overflow-hidden inline-block whitespace-nowrap text-white"
                style={{ willChange: "width, opacity" }}
              >
                ATTOOS
              </motion.span>
            </motion.div>

            {/* Accent Line - Unrolls symmetrically from the center */}
            <div className="h-[2px] mt-6 w-full max-w-[260px] relative overflow-hidden">
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.4 }}
                transition={{ duration: 2.0, delay: 3.4, ease: luxuryEase }} // Follows behind the expanding text beautifully
                className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FF7A00] to-transparent origin-center"
                style={{ willChange: "transform" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}