'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- Types ---
interface Testimonial {
  name: string;
  text: string;
}

interface TestimonialCardProps {
  item: Testimonial;
  isMobile?: boolean;
}

// --- Data ---
const row1: Testimonial[] = [
  {
    name: 'Jordan Miller',
    text: '"This ink looks so real! It lasted ten full days through gym sessions. Love it. 10/10."',
  },
  {
    name: 'Sarah Laurent',
    text: '"Perfect for testing my sleeve idea. Super easy to apply and the color is very deep."',
  },
  {
    name: 'Chris Peterson',
    text: '"Best temporary tattoo I ever tried. People thought it was permanent. Total winner."',
  },
];

const row2: Testimonial[] = [
  {
    name: 'Elena Rodriguez',
    text: '"The mystery gift was a great surprise. High quality art that fades away naturally"',
  },
  {
    name: 'Blake Thompson',
    text: '"No needles, no pain, just style. It developed perfectly in one day. Highly suggest."',
  },
  {
    name: 'Maya Whitestone',
    text: '"Finally, a tattoo with zero regret. My friends are obsessed with the matte finish."',
  },
];

const allTestimonials: Testimonial[] = [...row1, ...row2];

// --- Reusable Components ---
const FiveStars: React.FC = () => (
  <div className="flex gap-1.5 overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 20 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="drop-shadow-[0_0_8px_var(--color-brand-orange)]"
      >
        <path
          d="M10 0L12.2451 6.90983H19.5106L13.6327 11.1803L15.8779 18.0902L10 13.8197L4.12215 18.0902L6.36729 11.1803L0.489435 6.90983H7.75486L10 0Z"
          fill="var(--color-brand-orange)"
        />
      </svg>
    ))}
  </div>
);

const TestimonialCard: React.FC<TestimonialCardProps> = ({ item, isMobile = false }) => {
  const initial = item.name ? item.name.charAt(0).toUpperCase() : '';

  return (
    <motion.div
      whileHover={!isMobile ? { y: -8, scale: 1.02 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative bg-[#0a0a0a] rounded-[24px] border border-gray-800 hover:border-[var(--color-brand-orange)]/50 transition-colors duration-500 overflow-hidden group flex flex-col justify-between gap-6 ${
        isMobile ? 'min-w-full px-6 py-8' : 'w-[420px] p-8 shrink-0'
      }`}
    >
      {/* Subtle Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-orange)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

      {/* Decorative Quote Watermark */}
      <div className="absolute -top-4 right-4 text-9xl font-serif text-white/[0.02] group-hover:text-[var(--color-brand-orange)]/[0.05] transition-colors duration-500 select-none pointer-events-none leading-none">
        "
      </div>

      <div className="relative z-10 flex flex-col gap-6">
        <FiveStars />
        <p className="text-gray-300 font-light text-base md:text-lg leading-relaxed italic">
          {item.text}
        </p>
      </div>

      <div className="relative z-10 flex items-center gap-4 mt-4 pt-6 border-t border-gray-800/50">
        <div className="w-12 h-12 rounded-full bg-[var(--color-brand-orange)]/10 border border-[var(--color-brand-orange)]/30 flex items-center justify-center text-[var(--color-brand-orange)] font-bold text-xl shrink-0 shadow-[0_0_15px_rgba(255,122,0,0.1)]">
          {initial}
        </div>
        <div className="flex flex-col">
          <h4 className="text-white font-medium text-base tracking-wide">{item.name}</h4>
          <span className="text-gray-500 text-xs uppercase tracking-widest mt-0.5">Verified Ink</span>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Component ---
export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    if (currentIndex < allTestimonials.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <section className="relative w-full bg-[#050505] py-20 md:py-32 overflow-hidden selection:bg-[var(--color-brand-orange)] selection:text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1000px] bg-[var(--color-brand-orange)] opacity-[0.02] blur-[150px] pointer-events-none rounded-full"></div>

      {/* Header */}
      <div className="px-4 md:px-16 mb-16 md:mb-20 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase mb-6">
            Real Stories
          </div>
          <h2 className="text-white font-light text-4xl md:text-6xl tracking-tight leading-tight">
            Ink that leaves a <br className="hidden md:block" />
            <span className="text-[var(--color-brand-orange)] font-normal italic">lasting impression.</span>
          </h2>
        </motion.div>
      </div>

      {/* --- DESKTOP VIEW (Continuous Marquee) --- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="hidden md:flex flex-col gap-8 w-full group/marquee relative"
      >
        <style>
          {`
            @keyframes marqueeLeft {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            @keyframes marqueeRight {
              0% { transform: translateX(-50%); }
              100% { transform: translateX(0); }
            }
            .animate-marquee-left {
              animation: marqueeLeft 45s linear infinite;
            }
            .animate-marquee-right {
              animation: marqueeRight 45s linear infinite;
            }
            .group\\/marquee:hover .animate-marquee-left,
            .group\\/marquee:hover .animate-marquee-right {
              animation-play-state: paused;
            }
          `}
        </style>

        {/* Gradient Edges to fade out cards beautifully */}
        <div className="absolute inset-y-0 left-0 w-[15%] bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-[15%] bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>

        {/* Top Row: Moves Right to Left */}
        <div className="flex w-max animate-marquee-right gap-8 pl-8">
          {[...row1, ...row1, ...row1].map((item, index) => (
            <TestimonialCard key={`row1-${index}`} item={item} />
          ))}
        </div>

        {/* Bottom Row: Moves Left to Right */}
        <div className="flex w-max animate-marquee-left gap-8 pl-8">
          {[...row2, ...row2, ...row2].map((item, index) => (
            <TestimonialCard key={`row2-${index}`} item={item} />
          ))}
        </div>
      </motion.div>

      {/* --- MOBILE VIEW (Interactive Carousel) --- */}
      <div className="flex md:hidden flex-col w-full px-4 relative z-10">
        {/* Carousel Track */}
        <div className="overflow-hidden w-full rounded-[24px] touch-pan-y">
          <motion.div
            className="flex gap-4"
            animate={{ x: `calc(-${currentIndex * 100}% - ${currentIndex * 16}px)` }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {allTestimonials.map((item, index) => (
              <TestimonialCard key={`mobile-${index}`} item={item} isMobile={true} />
            ))}
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mt-8 w-full px-2">
          {/* Pagination Dots */}
          <div className="flex gap-2">
            {allTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-500 ${
                  currentIndex === index
                    ? 'bg-[var(--color-brand-orange)] w-8'
                    : 'bg-gray-800 w-2 hover:bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Arrow Buttons */}
          <div className="flex gap-3">
            <button
              onClick={prevSlide}
              disabled={currentIndex === 0}
              aria-label="Previous testimonial"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentIndex === 0
                  ? 'bg-[#111111] border border-gray-800 text-gray-700 cursor-not-allowed'
                  : 'bg-[#111111] border border-gray-600 text-white hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] active:scale-95'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M15 18L9 12L15 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button
              onClick={nextSlide}
              disabled={currentIndex === allTestimonials.length - 1}
              aria-label="Next testimonial"
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentIndex === allTestimonials.length - 1
                  ? 'bg-[#111111] border border-gray-800 text-gray-700 cursor-not-allowed'
                  : 'bg-[#111111] border border-gray-600 text-white hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] active:scale-95'
              }`}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 18L15 12L9 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}