

"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

interface SplashScreenProps {
  logoUrl: string;
  leftImageUrl: string;
  rightImageUrl: string;
}

// --- Framer Motion Variants ---
const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1 },
  exit: { 
    opacity: 0, 
    // Adds a subtle blur out effect to the whole container on exit
    filter: 'blur(10px)', 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } // Custom modern cubic-bezier ease
  }
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.85, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 1.2, ease: "easeOut", delay: 0.2 } 
  }
};

const butterflyLeftVariants: Variants = {
  hidden: { opacity: 0, x: -40, y: 40, rotate: -15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotate: 0,
    // Spring physics make it feel organic, like it's settling into place
    transition: { type: "spring", stiffness: 45, damping: 15, delay: 0.6 }
  }
};

const butterflyRightVariants: Variants = {
  hidden: { opacity: 0, x: 40, y: 40, rotate: 15 },
  visible: { 
    opacity: 1, 
    x: 0, 
    y: 0, 
    rotate: 0,
    transition: { type: "spring", stiffness: 45, damping: 15, delay: 0.8 }
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
      // Lock scrolling while splash is active
      document.body.style.overflow = 'hidden';

      const timer = setTimeout(() => {
        setShowIntro(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
        document.body.style.overflow = ''; // Unlock scroll
      }, 3500); 
      
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, []);

  // Anti-flash hydration guard
  if (!isMounted) {
    return <div suppressHydrationWarning className="fixed inset-0 z-[100] bg-[var(--color-white)]" />;
  }
  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          aria-hidden="true" // Screen-reader optimization for decorative screens
          // pointer-events-auto during animation, then none so it doesn't block the site while exiting
          className=" splash-wrapper fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-white)] overflow-hidden pointer-events-auto"
        >
          <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center">
            
            {/* Top-Left Butterfly */}
            <motion.div 
              variants={butterflyLeftVariants}
              className="absolute top-[8%] left-[5%] md:top-[9%] md:left-[5%] lg:top-[10%] lg:left-[7%]"
            >
              <Image 
                src={leftImageUrl} 
                alt=""
                width={240}
                height={240}
                sizes="(max-width: 768px) 100px, 240px"
                className="w-[100px] md:w-[150px] lg:w-[200px] xl:w-[240px] h-auto drop-shadow-sm"
                priority
              />
            </motion.div>

            {/* Dead-Center Logo */}
            <motion.div 
              variants={logoVariants}
              className="relative z-10" 
            >
              <Image 
                src={logoUrl} 
                alt="Core Tattoos Logo"
                width={360}
                height={150}
                sizes="(max-width: 768px) 180px, 360px"
                className="w-[180px] sm:w-[240px] md:w-[280px] lg:w-[320px] xl:w-[360px] h-auto drop-shadow-md"
                priority
              />
            </motion.div>

            {/* Bottom-Right Butterfly */}
            <motion.div 
              variants={butterflyRightVariants}
              className="absolute bottom-[8%] right-[5%] md:bottom-[12%] md:right-[8%] lg:bottom-[15%] lg:right-[12%]"
            >
              <Image 
                src={rightImageUrl} 
                alt="Butterfly Decoration Right"
                width={240}
                height={240}
                sizes="(max-width: 768px) 100px, 240px"
                className="w-[100px] md:w-[150px] lg:w-[200px] xl:w-[240px] h-auto scale-x-[-1] drop-shadow-sm"
                priority
              />
            </motion.div>
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}