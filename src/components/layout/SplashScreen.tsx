"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants, TargetAndTransition } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  logoUrl: string;
  leftImageUrl: string;
  rightImageUrl: string;
}

// Fixed: Explicitly typed as a 4-element tuple for Framer Motion's easing
const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

// Smooth, non-blur structural reveals
const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 1.2, ease: easeOutExpo, delay: 0.2 },
  },
};

const leftButterflyVariants: Variants = {
  hidden: { opacity: 0, x: -35, y: 20, rotate: -8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 1.4, ease: easeOutExpo, delay: 0.5 },
  },
};

const rightButterflyVariants: Variants = {
  hidden: { opacity: 0, x: 35, y: 20, rotate: 8 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 1.4, ease: easeOutExpo, delay: 0.6 },
  },
};

const organicFloat: TargetAndTransition = {
  y: [0, -8, 0],
  transition: {
    duration: 4.5,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function SplashScreen({
  logoUrl,
  leftImageUrl,
  rightImageUrl,
}: SplashScreenProps) {
  // FIX 1: Set showIntro to TRUE initially. 
  // This ensures the server renders the splash screen first, hiding the main website content.
  const [showIntro, setShowIntro] = useState<boolean>(true);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    // If the user has already seen it on a previous page load, update state to false
    if (hasSeenSplash) {
      setShowIntro(false);
      return;
    }

    document.body.style.overflow = "hidden";

    // Orchestrates the exact moment the splash screen should drop
    const exitSplash = () => {
      setShowIntro(false);
      sessionStorage.setItem("hasSeenSplash", "true");
      window.dispatchEvent(new Event("splashComplete"));
      
      // Wait precisely for Framer Motion exit animation lifecycle
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 600); 
    };

    // FIX 2: Removed the forced 2.5-second waiting time.
    // Listen for the Three.js payload to finish and drop the splash screen INSTANTLY.
    const handleThreeReady = () => {
      exitSplash();
    };

    window.addEventListener("threeAssetPipelineReady", handleThreeReady);

    // Fail-safe: If WebGL fails or takes longer than 3 seconds, drop the screen anyway
    const failSafeTimer = setTimeout(() => {
      console.warn("Splash screen fallback triggered: WebGL context took too long.");
      exitSplash();
    }, 3000);

    return () => {
      clearTimeout(failSafeTimer);
      window.removeEventListener("threeAssetPipelineReady", handleThreeReady);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* FIX 3: This inline style connects with the script in your layout.tsx.
          If the user has already seen the splash screen, this instantly hides the component 
          before React even boots up, completely eliminating the annoying screen flash! */}
      <style dangerouslySetInnerHTML={{ __html: `
        html.splash-completed #core-splash-root {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}} />

      <AnimatePresence>
        {showIntro && (
          <motion.div
            id="core-splash-root"
            key="core-splash-root"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            aria-hidden="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden select-none touch-none"
            style={{ willChange: "opacity" }}
          >
            <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center px-4">
              
              {/* Left Decor Layer */}
              <motion.div
                variants={leftButterflyVariants}
                className="absolute top-[15%] left-[6%] sm:left-[10%] md:top-[18%]"
                style={{ willChange: "transform, opacity" }}
              >
                <motion.div animate={organicFloat}>
                  <Image
                    src={leftImageUrl}
                    alt=""
                    width={220}
                    height={220}
                    sizes="(max-width: 768px) 90px, 220px"
                    className="w-[90px] sm:w-[140px] md:w-[180px] xl:w-[220px] h-auto opacity-85"
                    priority
                  />
                </motion.div>
              </motion.div>

              {/* Central Focal Point (Logo) */}
              <motion.div 
                variants={logoVariants} 
                className="relative z-10 mx-auto"
                style={{ willChange: "transform, opacity" }}
              >
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={340}
                  height={140}
                  sizes="(max-width: 768px) 180px, 340px"
                  className="w-[180px] sm:w-[240px] md:w-[290px] xl:w-[340px] h-auto"
                  priority
                />
              </motion.div>

              {/* Right Decor Layer */}
              <motion.div
                variants={rightButterflyVariants}
                className="absolute bottom-[15%] right-[6%] sm:right-[10%] md:bottom-[18%]"
                style={{ willChange: "transform, opacity" }}
              >
                <motion.div animate={organicFloat}>
                  <Image
                    src={rightImageUrl}
                    alt=""
                    width={220}
                    height={220}
                    sizes="(max-width: 768px) 90px, 220px"
                    className="w-[90px] sm:w-[140px] md:w-[180px] xl:w-[220px] h-auto scale-x-[-1] opacity-85"
                    priority
                  />
                </motion.div>
              </motion.div>
              
              {/* FIX 4: Reduced blur from 90px to 40px to save GPU overhead and stop lag */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[35vw] md:h-[35vw] rounded-full bg-white/[0.025] blur-[40px] pointer-events-none z-0" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}