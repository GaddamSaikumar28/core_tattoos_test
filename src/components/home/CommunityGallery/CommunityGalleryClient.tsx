
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type GalleryImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type GalleryData = {
  tagText: string;
  tagLink: string;
  subtitle: string;
  titleWhite: string;
  titleColored: string;
  footerText: string;
  buttonText: string;
  buttonLink: string;
  images: GalleryImage[];
};

// We define 3 explicit columns with exact indices and mathematically balanced aspect ratios.
// Using 'flex-1' on the last item guarantees a perfectly flush bottom line across all 3 columns.
const COLUMN_LAYOUTS = [
  {
    id: 'col-1',
    slots: [
      { index: 0, className: "aspect-[5/6]" },
      { index: 1, className: "aspect-[5/9]" },
      { index: 2, className: "flex-1 min-h-[250px]" }, // Stretches to align bottoms
    ],
  },
  {
    id: 'col-2',
    slots: [
      { index: 3, className: "aspect-[5/4]" },
      { index: 4, className: "aspect-[10/7]" },
      { index: 5, className: "aspect-[5/9]" },
      { index: 6, className: "flex-1 min-h-[200px]" }, // Stretches to align bottoms
    ],
  },
  {
    id: 'col-3',
    slots: [
      { index: 7, className: "aspect-[5/9]" },
      { index: 8, className: "aspect-square" },
      { index: 9, className: "aspect-[5/4]" },
      { index: 10, className: "flex-1 min-h-[200px]" }, // Stretches to align bottoms
    ],
  },
];

export default function CommunityGalleryClient({ data }: { data: GalleryData }) {
  // Maintain exactly 11 active slots
  const [activeSlots, setActiveSlots] = useState<GalleryImage[]>([]);

  useEffect(() => {
    if (data.images && data.images.length > 0) {
      setActiveSlots(data.images.slice(0, 11));
    }
  }, [data.images]);

  // Blink and Change Animation Logic
  useEffect(() => {
    if (data.images.length <= 11) return;

    const interval = setInterval(() => {
      setActiveSlots((prev) => {
        const nextSlots = [...prev];
        const activeUrls = new Set(nextSlots.map(img => img?.url));
        
        const availableImages = data.images.filter(img => !activeUrls.has(img.url));
        
        if (availableImages.length > 0) {
          const randomSlotIdx = Math.floor(Math.random() * 11);
          const randomNewImage = availableImages[Math.floor(Math.random() * availableImages.length)];
          
          nextSlots[randomSlotIdx] = randomNewImage;
        }
        return nextSlots;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [data.images]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 80, damping: 20 } 
    },
  };

  return (
    <section className="w-full bg-[#050505] text-white py-24 px-4 md:px-8 overflow-hidden font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-col gap-14">
        
        {/* === HEADER SECTION === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-5"
        >
          <Link href={data.tagLink} target="_blank" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1a0a12] border border-[#3a1525] hover:bg-[#250d18] transition-colors group">
            <svg className="w-4 h-4 text-[#e1306c] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#e1306c]">{data.tagText}</span>
          </Link>

          <p className="max-w-md text-[15px] text-neutral-400 font-normal leading-relaxed mt-1">
            {data.subtitle.split('@justtattoos').map((part, i, arr) => 
               i < arr.length - 1 ? <span key={i}>{part}<span className="text-[#e1306c] hover:underline cursor-pointer transition-all">@justtattoos</span></span> : part
            )}
          </p>

          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-black tracking-tighter mt-2 uppercase leading-none">
            {data.titleWhite} <span className="text-[#f97316]">{data.titleColored}</span>
          </h2>
        </motion.div>

        {/* === MASONRY GALLERY (EXPLICIT GRID) === */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          // items-stretch ensures all 3 columns reach the exact same height 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch"
        >
          {COLUMN_LAYOUTS.map((col) => (
            <div key={col.id} className="flex flex-col gap-5 h-full">
              {col.slots.map(({ index, className }) => {
                const image = activeSlots[index];
                if (!image) return null;

                return (
                  <motion.div 
                    key={`slot-${index}`} 
                    variants={itemVariants}
                    className={`relative rounded-[20px] overflow-hidden group bg-neutral-900 cursor-crosshair ${className}`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={image.url}
                        initial={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
                        animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                        exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.95 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image 
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          priority={index < 4} 
                        />
                      </motion.div>
                    </AnimatePresence>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-10" />
                  </motion.div>
                );
              })}
            </div>
          ))}
        </motion.div>

        {/* === FOOTER SECTION === */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col items-center text-center gap-8 mt-6"
        >
          <div className="flex items-center justify-center gap-2.5 text-neutral-500 text-[13px] font-medium tracking-wide">
            <span className="text-yellow-500 text-base">✨</span>
            <p>{data.footerText}</p>
          </div>
          
          <Link href={data.buttonLink}>
            <motion.button 
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              className="px-10 py-4 bg-[#facc15] hover:bg-[#eab308] text-black text-sm font-bold tracking-wide rounded-full shadow-[0_0_30px_rgba(250,204,21,0.15)] hover:shadow-[0_0_40px_rgba(250,204,21,0.3)] transition-all"
            >
              {data.buttonText}
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
}