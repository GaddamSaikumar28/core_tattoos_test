

"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

// 1. Define a strict interface for Props
export interface SharedHeroBannerProps {
  image?: string;
  mobileImage?: string;
  title?: string;
  textColor?: string;
  useMobileImage?: boolean;
  priority?: boolean; // Important for LCP (Largest Contentful Paint) optimization
}

// 2. Define Animation Variants
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12, 
      delayChildren: 0.1,
    },
  },
};

const textVariants: Variants = {
  hidden: { y: '105%' }, 
  visible: {
    y: '0%',
    transition: {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1], // Custom cubic-bezier for a premium, snappy feel
    },
  },
};

const imageFadeVariants: Variants = {
  hidden: { opacity: 0, scale: 1.05 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1.4, ease: "easeOut" } 
  }
};

export default function SharedHeroBanner({
  image = "/assets/images/NewArrivalsHeroDesktop.png",
  mobileImage = "/assets/images/temporary_tattoos.webp",
  title = "NEW ARRIVALS",
  textColor = "#FFFFFF",
  useMobileImage = true,
  priority = true,
}: SharedHeroBannerProps) {
  
  // Memoize the word splitting so it doesn't recalculate on every render
  const words = useMemo(() => title.split(' '), [title]);

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden bg-gray-900">
      <div className="absolute inset-0 max-w-[1440px] mx-auto relative w-full h-full">
        
        {/* --- Background Images with smooth scale-in --- */}
        <motion.div
          variants={imageFadeVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Mobile Image */}
          {useMobileImage && (
            <div className="block md:hidden relative w-full h-full">
              <Image
                src={mobileImage}
                alt={`${title} mobile`}
                fill
                priority={priority}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 10vw"
              />
            </div>
          )}

          {/* Desktop Image */}
          <div className={`${useMobileImage ? 'hidden md:block' : 'block'} relative w-full h-full`}>
            <Image
              src={image}
              alt={`${title} desktop`}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 1440px) 100vw, 1440px"
            />
            {/* Subtle overlay gradient to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* --- Animated Text Overlay Container --- */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="
            absolute flex flex-col 
            bottom-12 left-6 
            md:bottom-20 md:left-12 lg:left-20 
            z-10 pointer-events-none
          "
        >
          {words.map((word, index) => (
            <div key={`${word}-${index}`} className="overflow-hidden pb-1 md:pb-1">
              <motion.h2
                variants={textVariants}
                className="font-black uppercase text-[7vw] md:text-[70px] lg:text-[70px] leading-[0.85] tracking-tighter m-0 p-0"
                style={{ color: textColor }}
              >
                {word}
              </motion.h2>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}