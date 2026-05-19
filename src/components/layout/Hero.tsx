"use client";
import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { FormattedProduct } from "@/src/lib/shopify";
import Link from "next/link";
const MotionLink = motion(Link);
interface HeroProps {
  initialProducts: FormattedProduct[];
}

interface CardConfig {
  id: number;
  heroRotate: number;
  heroX: number;
  heroY: number;
  circRotate: number;
  circX: number;
  circY: number;
  zIndex: number;
}

const deckConfig: CardConfig[] = [
  // Cards 1-4: Fanned out in hero state
  {
    id: 1,
    heroRotate: -2,
    heroX: 0,
    heroY: 0,
    circRotate: 0,
    circX: 0,
    circY: -220,
    zIndex: 40,
  },
  {
    id: 2,
    heroRotate: 6,
    heroX: 45,
    heroY: -5,
    circRotate: 45,
    circX: 156,
    circY: -156,
    zIndex: 30,
  },
  {
    id: 3,
    heroRotate: 14,
    heroX: 85,
    heroY: -10,
    circRotate: 90,
    circX: 220,
    circY: 0,
    zIndex: 20,
  },
  {
    id: 4,
    heroRotate: 22,
    heroX: 125,
    heroY: -10,
    circRotate: 135,
    circX: 156,
    circY: 156,
    zIndex: 10,
  },
  // Cards 5-8: Hidden directly behind Card 1 during initial state
  {
    id: 5,
    heroRotate: -2,
    heroX: 0,
    heroY: 0,
    circRotate: 180,
    circX: 0,
    circY: 220,
    zIndex: 5,
  },
  {
    id: 6,
    heroRotate: -2,
    heroX: 0,
    heroY: 0,
    circRotate: 225,
    circX: -156,
    circY: 156,
    zIndex: 4,
  },
  {
    id: 7,
    heroRotate: -2,
    heroX: 0,
    heroY: 0,
    circRotate: 270,
    circX: -220,
    circY: 0,
    zIndex: 3,
  },
  {
    id: 8,
    heroRotate: -2,
    heroX: 0,
    heroY: 0,
    circRotate: 315,
    circX: -156,
    circY: -156,
    zIndex: 2,
  },
];

const FACE_CARD_DROP_MS = 2500;
const POST_SETTLE_GAP_MS = 500;
const EXPAND_DELAY_MS = FACE_CARD_DROP_MS + POST_SETTLE_GAP_MS;

const TattooCard = ({
  card,
  isTopCard,
  isVisibleInHero,
  isScrolled,
  isExpanded,
  cardIsFalling,
  topCardReady,
  getCircPos,
  isDesktop,
  index,
}: any) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl =
    card.product?.media?.featuredImage ||
    card.product?.media?.gallery?.[0]?.url;
  const imageAlt = card.product?.title || `Tattoo Card ${card.id}`;
  return (
    <motion.div
      className="absolute inset-0 rounded-2xl md:rounded-[24px] overflow-hidden flex flex-col items-center justify-center bg-white border-2 border-[#111] shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
      style={{
        zIndex: isTopCard && cardIsFalling ? 9999 : card.zIndex,
        transformOrigin: "center",
      }}
      initial={
        isTopCard
          ? { x: 0, y: -800, opacity: 0, rotate: -20 }
          : { x: 0, y: 0, opacity: 0, rotate: 0 }
      }
      animate={
        isScrolled
          ? {
              x: getCircPos(card.circX),
              y: getCircPos(card.circY),
              rotate: card.circRotate,
              opacity: 1,
              scale: isDesktop ? 0.5 : 0.75,
            }
          : isExpanded
            ? {
                x: isDesktop ? card.heroX : card.heroX * 0.5,
                y: isDesktop ? card.heroY : card.heroY * 0.5,
                rotate: card.heroRotate,
                opacity: isVisibleInHero ? 1 : 0,
                scale: 1,
              }
            : isTopCard && topCardReady
              ? {
                  x: 0,
                  y: [-800, 0],
                  rotate: [-30, -2],
                  opacity: [0, 1],
                  scale: 1,
                }
              : {
                  x: 0,
                  y: isTopCard ? -800 : 0,
                  opacity: 0,
                  rotate: isTopCard ? -20 : 0,
                  scale: 1,
                }
      }
      transition={
        isScrolled
          ? { type: "spring", damping: 20, stiffness: 70, mass: 1 }
          : isExpanded
            ? {
                type: "spring",
                damping: 18,
                stiffness: 90,
                delay: isTopCard ? 0 : index * 0.08,
              }
            : isTopCard && topCardReady
              ? { duration: 2.5, ease: [0.25, 0.1, 0.25, 1] }
              : { duration: 0 }
      }
    >
      {!hasError ? (
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          onError={() => setHasError(true)}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-center px-4">
          <span className="font-bold text-xl text-gray-400">
            Card {card.id}
          </span>
        </div>
      )}
    </motion.div>
  );
};
export default function Hero({ initialProducts = [] }: HeroProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [topCardReady, setTopCardReady] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cardIsFalling, setCardIsFalling] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const cardsWithProducts = useMemo(() => {
    return deckConfig.map((card, index) => {
      if (initialProducts.length === 0) return { ...card, product: null };
      const product = initialProducts[index % initialProducts.length];
      return { ...card, product };
    });
  }, [initialProducts]);

  useEffect(() => {
    const hasSeenSplash =
      typeof window !== "undefined"
        ? sessionStorage.getItem("hasSeenSplash")
        : null;
    const initialDelay = hasSeenSplash ? 100 : 2800;

    const introTimer = setTimeout(() => {
      setShowIntro(false);
      setTimeout(() => {
        setTopCardReady(true);
        setCardIsFalling(true);
        setTimeout(() => setCardIsFalling(false), FACE_CARD_DROP_MS);
        setTimeout(() => setIsExpanded(true), EXPAND_DELAY_MS);
      }, 400);
    }, initialDelay);

    return () => clearTimeout(introTimer);
  }, []);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (!isExpanded) return;

      if (window.scrollY > 80) {
        setIsScrolled(true);
      } else if (window.scrollY < 30) {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isExpanded]);

  // Dramatically reduced mobile explosion radius (0.45) so cards stay in bounds
  const getCircPos = (val: number) => (isDesktop ? val : val * 0.75);

  return (
    <div className="relative w-full h-[150vh] bg-white">
      {/* Sticky container uses exactly 100vh so the bottom bar isn't forced off-screen */}
      <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col">
        <AnimatePresence>
          <motion.div
            className="relative z-10 flex flex-col h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* <main className="max-w-[1300px] mx-auto px-6 lg:px-12 w-full flex-grow flex flex-col md:flex-row items-center justify-center pt-2 md:pt-0 gap-8"> */}
            <main className="max-w-[1300px] mx-auto px-6 lg:px-12 w-full flex-grow flex flex-col md:flex-row items-center justify-center pt-2 md:pt-0 gap-3 md:gap-8">
              {/* Left Column: Text */}
              <motion.div
                className="w-full md:w-[55%] flex flex-col items-center md:items-start justify-center z-20 order-1"
                animate={{
                  opacity: isScrolled ? 0 : 1,
                  y: isScrolled ? -40 : 0,
                  filter: isScrolled ? "blur(10px)" : "blur(0px)",
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ pointerEvents: isScrolled ? "none" : "auto" }}
              >
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
                  className="w-full md:w-max flex flex-col text-center md:text-left relative z-30"
                >
                  {/* Removed whitespace-nowrap on mobile to prevent horizontal overflow constraints */}
                  <div
                    className="text-black text-[13vw] sm:text-[15vw] md:text-[72px] lg:text-[86px] xl:text-[100px] leading-[0.85] tracking-[-0.03em] uppercase sm:whitespace-nowrap"
                    style={{
                      fontFamily: "Almarena, sans-serif",
                      fontWeight: "800",
                    }}
                  >
                    REAL INK
                  </div>

                  <div
                    className="text-[#FE8204] text-[13vw] sm:text-[15vw] md:text-[72px] lg:text-[86px] xl:text-[100px] leading-[0.85] tracking-[-0.03em] uppercase sm:whitespace-nowrap mt-1 lg:mt-2 md:ml-[60px] lg:ml-[70px] xl:ml-[85px]"
                    style={{
                      fontFamily: "Almarena, sans-serif",
                      fontWeight: "800",
                    }}
                  >
                    YOUR WAY
                  </div>
                </motion.div>

                <motion.p
                  className="mt-6 md:mt-8 text-center md:text-left hidden md:block text-[#111]"
                  style={{
                    maxWidth: "520px",
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "500",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  <span className="text-[14px] lg:text-[16px] leading-[1.6]">
                    Get the authentic tattoo look without the needle or the
                    lifelong commitment. Our clinically tested, permanent ink
                    sinks into the top layer of your skin, fully developing into
                    a bold,
                  </span>
                  <span className="text-[#FE8204] text-[14px] lg:text-[16px] leading-[1.6] font-semibold">
                    {" "}
                    realistic design within 24 hours.
                  </span>
                </motion.p>

                {/* 1. Changed motion.button to motion.div so it's valid HTML */}
                <motion.div
                  className="relative mt-8 text-white rounded-full hidden md:flex font-bold uppercase tracking-widest text-[12px] lg:text-[14px] group overflow-hidden w-fit"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  <span className="absolute inset-0 bg-black"></span>
                  <span className="absolute inset-0 bg-[#FE8204] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>

                  {/* 2. Changed span to Link and added href */}
                  <Link
                    href="/collections"
                    className="relative z-10 flex items-center gap-4 px-7 py-3.5 lg:px-8 lg:py-4 cursor-pointer"
                  >
                    SHOP COLLECTIONS
                    <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </span>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Column: Scaled-down Card Deck */}
              <motion.div
                // className="w-[50%] md:w-[45%] h-[250px] md:h-[380px] lg:h-[420px] relative flex justify-center items-center order-2  md:mt-0"
                className="w-[50%] md:w-[45%] h-[220px] md:h-[380px] lg:h-[480px] relative flex justify-center items-center order-2 md:mt-0"
                animate={{
                  x: isScrolled && isDesktop ? "-61%" : "0%",
                  //   y: isScrolled ? 80 : 0,
                  y: isScrolled ? (isDesktop ? 20 : 80) : 0,
                }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Center "Real Tattoo Look" Logo - lowered z-index so cards overlay it appropriately */}
                <motion.div
                  className="absolute inset-0 mt-15 flex flex-col items-center justify-center pointer-events-none z-[35]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: isScrolled ? 1 : 0,
                    scale: isScrolled ? 1 : 0.5,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                    delay: isScrolled ? 0.15 : 0,
                  }}
                >
                  <span
                    className="text-[24px] md:text-[32px] leading-[1.1] tracking-widest text-black uppercase text-center"
                    style={{
                      fontFamily: "Almarena, sans-serif",
                      fontWeight: "800",
                    }}
                  >
                    REAL
                  </span>
                  <svg
                    className="my-1.5"
                    width="36"
                    height="36"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FE8204"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span
                    className="text-[24px] md:text-[32px] leading-[1.1] tracking-widest text-black uppercase text-center"
                    style={{
                      fontFamily: "Almarena, sans-serif",
                      fontWeight: "800",
                    }}
                  >
                    TATTOO
                    <br />
                    LOOK
                  </span>
                </motion.div>

                <div className="relative w-[180px] h-[250px] mt-15 md:w-[260px] md:h-[360px] lg:w-[320px] lg:h-[440px] flex justify-center items-center">
                  {cardsWithProducts.map((card, index) => {
                    const isTopCard = index === 0;
                    const isVisibleInHero = card.id <= 4;

                    return (
                      <TattooCard
                        key={card.id}
                        card={card}
                        index={index}
                        isTopCard={isTopCard}
                        isVisibleInHero={isVisibleInHero}
                        isScrolled={isScrolled}
                        isExpanded={isExpanded}
                        cardIsFalling={cardIsFalling}
                        topCardReady={topCardReady}
                        getCircPos={getCircPos}
                        isDesktop={isDesktop}
                      />
                    );
                  })}
                </div>
              </motion.div>

              {/* Mobile-only Body Copy */}
              <motion.div
                // className="w-full order-3 md:hidden flex flex-col items-center text-center px-4 pb-12 mt-4"

                className="w-full order-3 md:hidden flex flex-col items-center text-center px-4 mt-10"
                animate={{
                  opacity: isScrolled ? 0 : 1,
                  y: isScrolled ? 40 : 0,
                }}
                transition={{ duration: 0.6 }}
                style={{ pointerEvents: isScrolled ? "none" : "auto" }}
              >
                <motion.p
                  className="text-[#111]"
                  style={{
                    fontFamily: "Montserrat, sans-serif",
                    fontWeight: "500",
                  }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                >
                  <span className="text-[14px] leading-[1.6] ">
                    Get the authentic tattoo look without the needle or the
                    lifelong commitment. Our clinically tested, permanent ink
                    sinks into the top layer of your skin, fully developing into
                    a bold,{" "}
                  </span>
                  <span className="text-[#FE8204] text-[14px] leading-[1.6]">
                    realistic design within 24 hours.
                  </span>
                </motion.p>
                <MotionLink
                  href="/collections"
                  className="mt-8 bg-black text-white rounded-full px-8 py-4 flex items-center gap-4 font-bold uppercase tracking-widest text-[13px] hover:bg-gray-800 transition-colors group"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                >
                  SHOP COLLECTIONS
                  <span className="bg-white text-black rounded-full w-8 h-8 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </span>
                </MotionLink>
              </motion.div>
            </main>

            {/* Infinity Scroll Bar - Changed from fixed to absolute so it lives within the sticky section properly */}
            {isDesktop && (
              <motion.div
                className="absolute bottom-0 left-0 z-50 w-full h-14 md:h-16 bg-black flex-shrink-0 flex items-center overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{
                  y: isExpanded ? 0 : 50,
                  opacity: isScrolled ? 0 : isExpanded ? 1 : 0,
                  x: isScrolled ? "100%" : "0%",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <motion.div
                  className="flex whitespace-nowrap items-center h-full"
                  animate={{ x: ["0%", "-50%"] }}
                  transition={{
                    duration: 18,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  {[0, 1].map((i) => (
                    <span key={i} className="flex items-center h-full shrink-0">
                      {Array.from({ length: 10 }).map((_, j) => (
                        <span
                          key={j}
                          className="flex items-center justify-center px-4 h-full shrink-0"
                        >
                          <Image
                            src="/assets/icons/InfinityBar.svg"
                            alt="Infinity Logo"
                            // Set dimensions based on your largest breakpoint (md:h-6 = 24px)
                            // Next.js will use these to set the aspect ratio
                            width={100}
                            height={24}
                            // Use Tailwind to handle the actual responsive scaling
                            className="h-5 md:h-6 w-auto object-contain"
                            // Since this is a repeating decorative SVG, we can optimize it
                            priority={i === 0 && j < 5} // Load the first few immediately
                          />
                        </span>
                      ))}
                    </span>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
