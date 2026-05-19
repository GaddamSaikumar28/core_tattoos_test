"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface SplashScreenProps {
  logoUrl: string;
  leftImageUrl: string;
  rightImageUrl: string;
}

// --- Cinematic Framer Motion Variants ---
const backgroundVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { 
    opacity: 0, 
    scale: 1.05, // Slight zoom in as it fades out to reveal the app
    filter: 'blur(15px)', 
    transition: { duration: 1, ease: [0.25, 1, 0.5, 1] }
  }
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, filter: 'blur(20px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { 
      duration: 1.5, 
      ease: [0.16, 1, 0.3, 1], // Expo out
      delay: 0.2 
    } 
  }
};

// We treat the white-background images as physical floating "Cards"
const floatingCardLeft: Variants = {
  hidden: { opacity: 0, x: -80, y: 60, rotateZ: -25, rotateY: 30, scale: 0.6 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotateZ: -12, 
    rotateY: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 20, delay: 0.5 }
  },
  // Continuous floating animation after entering
  floating: {
    y: [0, -15, 0],
    rotateZ: [-12, -10, -12],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
  }
};

const floatingCardRight: Variants = {
  hidden: { opacity: 0, x: 80, y: 60, rotateZ: 25, rotateY: -30, scale: 0.6 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotateZ: 12, 
    rotateY: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 60, damping: 20, delay: 0.7 }
  },
  floating: {
    y: [0, -15, 0],
    rotateZ: [12, 10, 12],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
  }
};

const ambientGlowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: [0, 0.3, 0.15], 
    scale: 1.5,
    transition: { duration: 3, ease: "easeOut" }
  }
};

export default function SplashScreen({ logoUrl, leftImageUrl, rightImageUrl }: SplashScreenProps) {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');

    if (hasSeenSplash) {
      setShowIntro(false);
    } else {
      document.body.style.overflow = 'hidden'; // Lock scroll

      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
        document.body.style.overflow = ''; // Unlock scroll
      }, 4000); // Slightly longer for the cinematic effect to play out
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, []);

  if (!isMounted) {
    return <div suppressHydrationWarning className="fixed inset-0 z-[100] bg-zinc-950" />;
  }

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          variants={backgroundVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-hidden="true" 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 overflow-hidden pointer-events-auto selection:bg-transparent"
        >
          {/* Ambient Brand Core Glow */}
          <motion.div 
            variants={ambientGlowVariants}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] min-w-[500px] bg-[#FE8204]/20 rounded-full blur-[120px] pointer-events-none z-0"
          />

          {/* Cinematic Noise/Grain Overlay */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center perspective-[1000px]">
            
            {/* Top-Left Floating Art Card */}
            <motion.div 
              variants={floatingCardLeft}
              initial="hidden"
              animate={["visible", "floating"]}
              className="absolute top-[12%] left-[8%] md:top-[15%] md:left-[12%] lg:top-[18%] lg:left-[18%] z-10"
            >
              <div className="bg-white p-2 md:p-3 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] border border-white/20 transform-gpu overflow-hidden group">
                <Image 
                  src={leftImageUrl} 
                  alt=""
                  width={220}
                  height={220}
                  sizes="(max-width: 768px) 120px, 220px"
                  className="w-[120px] md:w-[160px] lg:w-[220px] xl:w-[260px] h-auto rounded-xl"
                  priority
                />
                {/* Glossy card overlay reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </div>
            </motion.div>

            {/* Dead-Center Cinematic Logo */}
            <motion.div 
              variants={logoVariants}
              className="relative z-20 flex flex-col items-center" 
            >
              <Image 
                src={logoUrl} 
                alt="Core Tattoos Logo"
                width={400}
                height={180}
                sizes="(max-width: 768px) 200px, 400px"
                className="w-[200px] sm:w-[280px] md:w-[320px] lg:w-[380px] xl:w-[420px] h-auto drop-shadow-[0_0_30px_rgba(254,130,4,0.3)]"
                priority
              />
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "60%", opacity: 1 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                className="h-px bg-gradient-to-r from-transparent via-[#FE8204]/50 to-transparent mt-6"
              />
            </motion.div>

            {/* Bottom-Right Floating Art Card */}
            <motion.div 
              variants={floatingCardRight}
              initial="hidden"
              animate={["visible", "floating"]}
              className="absolute bottom-[12%] right-[8%] md:bottom-[15%] md:right-[12%] lg:bottom-[18%] lg:right-[18%] z-10"
            >
              <div className="bg-white p-2 md:p-3 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] border border-white/20 transform-gpu overflow-hidden group">
                <Image 
                  src={rightImageUrl} 
                  alt="Butterfly Decoration Right"
                  width={220}
                  height={220}
                  sizes="(max-width: 768px) 120px, 220px"
                  className="w-[120px] md:w-[160px] lg:w-[220px] xl:w-[260px] h-auto rounded-xl scale-x-[-1]"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
              </div>
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}