"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants, TargetAndTransition } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  logoUrl: string;
  leftImageUrl: string;
  rightImageUrl: string;
}

// --- Technical Functionality ---
// Deep, cinematic easing curve for luxury feel
const luxuryEase: [number, number, number, number] = [0.25, 1, 0.5, 1];

// --- Framer Motion Variants (Dark Theme Optimized) ---
const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: {
    opacity: 0,
    scale: 1.05, // Slightly deeper scale-out for a cinematic fade
    filter: "blur(20px)", // Heavier blur as it fades into the dark site
    transition: { duration: 1.2, ease: luxuryEase }, 
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, filter: "blur(15px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.8, ease: luxuryEase, delay: 0.2 },
  },
};

// Butterflies emerge from the shadows smoothly
const butterflyLeftVariants: Variants = {
  hidden: { opacity: 0, x: -50, y: 50, rotate: -20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 35, damping: 20, delay: 0.8 },
  },
};

const butterflyRightVariants: Variants = {
  hidden: { opacity: 0, x: 50, y: 50, rotate: 20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 35, damping: 20, delay: 1.0 },
  },
};

// Continuous floating effect for the butterflies once they land
// Fixed TypeScript error by explicitly typing as TargetAndTransition
const floatAnimation: TargetAndTransition = {
  y: [0, -12, 0], // Smooth medium-slow travel distance
  transition: {
    duration: 5, // Slowed down for a beautiful, organic breathing effect
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function SplashScreen({
  logoUrl,
  leftImageUrl,
  rightImageUrl,
}: SplashScreenProps) {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) {
      setShowIntro(false);
      return;
    }

    // Lock scrolling while splash is active
    document.body.style.overflow = "hidden";

    // 6.8 second premium pacing timeline
    const completeTimer = setTimeout(() => {
      setShowIntro(false);
      sessionStorage.setItem("hasSeenSplash", "true");
      window.dispatchEvent(new Event("splashComplete"));
      
      // Let the exit fade animation finish completely before releasing scroll
      const scrollTimer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 1200);

      return () => clearTimeout(scrollTimer);
    }, 6800);

    return () => {
      clearTimeout(completeTimer);
      document.body.style.overflow = "";
    };
  }, []);

  // Anti-flash hydration guard (Now optimized for a dark theme)
  if (!isMounted) {
    return (
      <div
        suppressHydrationWarning
        className="fixed inset-0 z-[100] bg-[#050505]"
      />
    );
  }

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          key="jt-splash"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-hidden="true"
          // Ultra-dark background: #050505 gives a richer OLED-style black than standard black
          className="splash-wrapper fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] overflow-hidden pointer-events-auto select-none"
        >
          <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">
            
            {/* Top-Left Butterfly */}
            <motion.div
              variants={butterflyLeftVariants}
              className="absolute top-[10%] left-[5%] md:top-[12%] md:left-[8%] lg:top-[15%] lg:left-[10%]"
            >
              <motion.div animate={floatAnimation}>
                <Image
                  src={leftImageUrl}
                  alt=""
                  width={240}
                  height={240}
                  sizes="(max-width: 768px) 100px, 240px"
                  // Added a subtle white/gray drop shadow to separate from the black background
                  className="w-[100px] md:w-[150px] lg:w-[200px] xl:w-[240px] h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Dead-Center Logo */}
            <motion.div variants={logoVariants} className="relative z-10">
              <Image
                src={logoUrl}
                alt="Core Tattoos Logo"
                width={360}
                height={150}
                sizes="(max-width: 768px) 180px, 360px"
                className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]"
                priority
              />
            </motion.div>

            {/* Bottom-Right Butterfly */}
            <motion.div
              variants={butterflyRightVariants}
              className="absolute bottom-[10%] right-[5%] md:bottom-[15%] md:right-[8%] lg:bottom-[18%] lg:right-[10%]"
            >
              <motion.div animate={floatAnimation}>
                <Image
                  src={rightImageUrl}
                  alt="Butterfly Decoration Right"
                  width={240}
                  height={240}
                  sizes="(max-width: 768px) 100px, 240px"
                  className="w-[100px] md:w-[150px] lg:w-[200px] xl:w-[240px] h-auto scale-x-[-1] drop-shadow-[0_0_15px_rgba(255,255,255,0.08)]"
                  priority
                />
              </motion.div>
            </motion.div>
            
            {/* Optional: Subtle ambient radial glow behind the logo to create depth on black */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] rounded-full bg-white/5 blur-[100px] pointer-events-none z-0" />

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}