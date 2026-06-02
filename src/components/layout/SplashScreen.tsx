// "use client";

// import { useState, useEffect } from "react";
// import { motion, AnimatePresence, Variants, TargetAndTransition } from "framer-motion";
// import Image from "next/image";

// interface SplashScreenProps {
//   logoUrl: string;
//   leftImageUrl: string;
//   rightImageUrl: string;
// }

// // Fixed: Explicitly typed as a 4-element tuple for Framer Motion's easing
// const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

// const containerVariants: Variants = {
//   hidden: { opacity: 1 },
//   visible: { opacity: 1 },
//   exit: {
//     opacity: 0,
//     transition: { duration: 0.6, ease: easeOutExpo },
//   },
// };

// // Smooth, non-blur structural reveals
// const logoVariants: Variants = {
//   hidden: { opacity: 0, scale: 0.94, y: 5 },
//   visible: {
//     opacity: 1,
//     scale: 1,
//     y: 0,
//     transition: { duration: 1.2, ease: easeOutExpo, delay: 0.2 },
//   },
// };

// const leftButterflyVariants: Variants = {
//   hidden: { opacity: 0, x: -35, y: 20, rotate: -8 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     y: 0,
//     rotate: 0,
//     transition: { duration: 1.4, ease: easeOutExpo, delay: 0.5 },
//   },
// };

// const rightButterflyVariants: Variants = {
//   hidden: { opacity: 0, x: 35, y: 20, rotate: 8 },
//   visible: {
//     opacity: 1,
//     x: 0,
//     y: 0,
//     rotate: 0,
//     transition: { duration: 1.4, ease: easeOutExpo, delay: 0.6 },
//   },
// };

// // Fixed: Explicitly typed to satisfy the `animate` prop requirements
// const organicFloat: TargetAndTransition = {
//   y: [0, -8, 0],
//   transition: {
//     duration: 4.5,
//     repeat: Infinity,
//     ease: "easeInOut",
//   },
// };

// export default function SplashScreen({
//   logoUrl,
//   leftImageUrl,
//   rightImageUrl,
// }: SplashScreenProps) {
//   const [showIntro, setShowIntro] = useState<boolean>(false);
//   const [isMounted, setIsMounted] = useState<boolean>(false);

//   useEffect(() => {
//     setIsMounted(true);
//     const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

//     if (hasSeenSplash) return;

//     setShowIntro(true);
//     document.body.style.overflow = "hidden";

//     // Paced timing execution framework
//     const durationTimeout = setTimeout(() => {
//       setShowIntro(false);
//       sessionStorage.setItem("hasSeenSplash", "true");
//       window.dispatchEvent(new Event("splashComplete"));

//       setTimeout(() => {
//         document.body.style.overflow = "";
//       }, 600); // Wait precisely for exit animation lifecycle
//     }, 4000);

//     return () => {
//       clearTimeout(durationTimeout);
//       document.body.style.overflow = "";
//     };
//   }, []);

//   if (!isMounted || !showIntro) {
//     return null;
//   }

//   return (
//     <AnimatePresence>
//       {showIntro && (
//         <motion.div
//           key="core-splash-root"
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           exit="exit"
//           aria-hidden="true"
//           className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505] overflow-hidden select-none touch-none"
//           style={{ willChange: "opacity" }}
//         >
//           <div className="relative w-full h-full max-w-[1440px] mx-auto flex items-center justify-center px-4">
            
//             {/* Left Decor Layer */}
//             <motion.div
//               variants={leftButterflyVariants}
//               className="absolute top-[15%] left-[6%] sm:left-[10%] md:top-[18%]"
//               style={{ willChange: "transform, opacity" }}
//             >
//               <motion.div animate={organicFloat}>
//                 <Image
//                   src={leftImageUrl}
//                   alt=""
//                   width={220}
//                   height={220}
//                   sizes="(max-width: 768px) 90px, 220px"
//                   className="w-[90px] sm:w-[140px] md:w-[180px] xl:w-[220px] h-auto opacity-85"
//                   priority
//                 />
//               </motion.div>
//             </motion.div>

//             {/* Central Focal Point (Logo) */}
//             <motion.div 
//               variants={logoVariants} 
//               className="relative z-10 mx-auto"
//               style={{ willChange: "transform, opacity" }}
//             >
//               <Image
//                 src={logoUrl}
//                 alt="Logo"
//                 width={340}
//                 height={140}
//                 sizes="(max-width: 768px) 180px, 340px"
//                 className="w-[180px] sm:w-[240px] md:w-[290px] xl:w-[340px] h-auto"
//                 priority
//               />
//             </motion.div>

//             {/* Right Decor Layer */}
//             <motion.div
//               variants={rightButterflyVariants}
//               className="absolute bottom-[15%] right-[6%] sm:right-[10%] md:bottom-[18%]"
//               style={{ willChange: "transform, opacity" }}
//             >
//               <motion.div animate={organicFloat}>
//                 <Image
//                   src={rightImageUrl}
//                   alt=""
//                   width={220}
//                   height={220}
//                   sizes="(max-width: 768px) 90px, 220px"
//                   className="w-[90px] sm:w-[140px] md:w-[180px] xl:w-[220px] h-auto scale-x-[-1] opacity-85"
//                   priority
//                 />
//               </motion.div>
//             </motion.div>
            
//             {/* Ambient Background Radial Pass */}
//             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[35vw] md:h-[35vw] rounded-full bg-white/[0.025] blur-[90px] pointer-events-none z-0" />
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// }
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

// Fixed: Explicitly typed to satisfy the `animate` prop requirements
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
  const [showIntro, setShowIntro] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");

    if (hasSeenSplash) return;

    setShowIntro(true);
    document.body.style.overflow = "hidden";

    let isThreeReady = false;
    let isMinimumAnimationTimeMet = false;

    // Orchestrates the exact moment the splash screen should drop
    const attemptExit = () => {
      // Only lift the splash screen if BOTH requirements are met
      if (isThreeReady && isMinimumAnimationTimeMet) {
        setShowIntro(false);
        sessionStorage.setItem("hasSeenSplash", "true");
        window.dispatchEvent(new Event("splashComplete"));
        
        // Wait precisely for Framer Motion exit animation lifecycle
        setTimeout(() => {
          document.body.style.overflow = "";
        }, 600); 
      }
    };

    // 1. Enforce a minimum duration for visual branding continuity (2.5 seconds)
    const minTimer = setTimeout(() => {
      isMinimumAnimationTimeMet = true;
      attemptExit();
    }, 2500);

    // 2. Production fail-safe ceiling. Lift the screen no matter what after 6s.
    const failSafeTimer = setTimeout(() => {
      console.warn("Splash screen fallback triggered: WebGL context took too long.");
      isThreeReady = true;
      isMinimumAnimationTimeMet = true;
      attemptExit();
    }, 6000);

    // 3. Handle the incoming message from index.tsx (Three.js compilation complete)
    const handleThreeReady = () => {
      isThreeReady = true;
      attemptExit();
    };

    window.addEventListener("threeAssetPipelineReady", handleThreeReady);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(failSafeTimer);
      window.removeEventListener("threeAssetPipelineReady", handleThreeReady);
      document.body.style.overflow = "";
    };
  }, []);

  if (!isMounted || !showIntro) {
    return null;
  }

  return (
    <AnimatePresence>
      {showIntro && (
        <motion.div
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
            
            {/* Ambient Background Radial Pass */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] md:w-[35vw] md:h-[35vw] rounded-full bg-white/[0.025] blur-[90px] pointer-events-none z-0" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}