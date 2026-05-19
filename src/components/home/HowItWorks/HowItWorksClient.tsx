'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

type StepData = {
  title: string;
  description: string;
  image: { url: string; alt: string; width: number; height: number } | null;
};

type HowItWorksData = {
  tagText: string;
  subtitle: string;
  titleWhite: string;
  titleColored: string;
  buttonText: string;
  buttonLink: string;
  steps: StepData[];
};

// Generic icons array to cycle through based on step index (matching the design vibes)
const StepIcons = [
  <svg key="1" className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  <svg key="2" className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
  <svg key="3" className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  <svg key="4" className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
];

export default function HowItWorksClient({ data }: { data: HowItWorksData }) {
  return (
    <section className="w-full bg-[#0a0a0a] text-white py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* === HEADER === */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 relative z-10">
          
          {/* Left Side: Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-5 max-w-xl"
          >
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/5 self-start">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-500">
                {data.tagText}
              </span>
            </div>

            {/* Subtitle */}
            <p className="text-neutral-400 text-sm md:text-base leading-relaxed">
              {data.subtitle}
            </p>

            {/* Main Title */}
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mt-2">
              {data.titleWhite} <span className="text-orange-500">{data.titleColored}</span>
            </h2>
          </motion.div>

          {/* Right Side: Button */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link 
              href={data.buttonLink}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full border border-yellow-500/30 bg-[#111] hover:bg-yellow-500/10 text-yellow-500 font-medium transition-all duration-300 group"
            >
              {data.buttonText}
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </Link>
          </motion.div>
        </div>

        {/* === CARDS GRID === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {data.steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative flex flex-col bg-[#121212] border border-white/5 rounded-[2rem] p-4 group hover:border-white/10 transition-colors"
            >
              {/* Image Container with seamless bottom fade */}
              <div className="relative w-full aspect-square md:aspect-[4/5] rounded-[1.5rem] overflow-hidden bg-neutral-900 mb-6">
                {step.image && (
                  <Image 
                    src={step.image.url}
                    alt={step.image.alt || step.title}
                    fill
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                )}
                
                {/* Gradient overlay to blend image into card background */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#121212] to-transparent" />

                {/* Number Overlay (Giant 01, 02...) */}
                <div className="absolute top-4 left-6 mix-blend-overlay opacity-40 group-hover:opacity-60 transition-opacity">
                  <span className="text-7xl font-extralight tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-transparent">
                    0{index + 1}
                  </span>
                </div>

                {/* Top Right Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center">
                  {StepIcons[index] || StepIcons[0]}
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col px-2 pb-4">
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>

              {/* Decorative Arrow Pointing to Next Step (Hidden on mobile & last card) */}
              {index < data.steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 z-20 text-neutral-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}