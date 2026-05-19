"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

// ============================================================================
// DYNAMIC DATA DEFINITION (Shopify Metaobject Structure)
// Map this to your Shopify Metaobjects for easy updates via the Shopify Admin
// ============================================================================
export interface TattooDevelopmentStage {
  id: string;
  hour: number;
  label: string;
  title: string;
  description: string;
  developmentPercentage: number;
  imageUrl: string;
}

const DEVELOPMENT_STAGES: TattooDevelopmentStage[] = [
  {
    id: "stage-0",
    hour: 0,
    label: "0H",
    title: "Clear Application",
    description: "Apply with water. The design is barely visible—just a faint outline resting on the top layer of your skin.",
    developmentPercentage: 0,
    imageUrl: "/assets/tattoos/stage-0h.jpg", // Replace with your AI generated 0H image
  },
  {
    id: "stage-6",
    hour: 6,
    label: "6H",
    title: "Light Brown Tint",
    description: "The plant-based formula begins to oxidize with your skin's natural proteins, creating a light brown appearance.",
    developmentPercentage: 40,
    imageUrl: "/assets/tattoos/stage-6h.jpg", // Replace with your AI generated 6H image
  },
  {
    id: "stage-12",
    hour: 12,
    label: "12H",
    title: "Dark Development",
    description: "Color deepens significantly as the formula sinks into the epidermis. Starting to look like fresh, bold ink.",
    developmentPercentage: 70,
    imageUrl: "/assets/tattoos/stage-12h.jpg", // Replace with your AI generated 12H image
  },
  {
    id: "stage-24",
    hour: 24,
    label: "24H",
    title: "Full Black Ink",
    description: "Complete transformation. Indistinguishable from permanent tattoo ink. Waterproof and ready to last 1-2 weeks.",
    developmentPercentage: 100,
    imageUrl: "/assets/tattoos/stage-24h.jpg", // Replace with your AI generated 24H image
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function Advanced24HourReveal() {
  const [sliderValue, setSliderValue] = useState(50);
  const [activeStageIndex, setActiveStageIndex] = useState(3); // Default to 24H
  
  // Update active text stage based on slider position
  useEffect(() => {
    if (sliderValue < 25) setActiveStageIndex(0);
    else if (sliderValue < 50) setActiveStageIndex(1);
    else if (sliderValue < 85) setActiveStageIndex(2);
    else setActiveStageIndex(3);
  }, [sliderValue]);

  const activeStage = DEVELOPMENT_STAGES[activeStageIndex];

  return (
    <section className="w-full bg-zinc-950 text-white py-20 md:py-32 overflow-hidden relative selection:bg-[#FE8204] selection:text-white">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FE8204] opacity-[0.03] blur-[150px] pointer-events-none z-0 rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          
          {/* ============================================================== */}
          {/* LEFT: INTERACTIVE IMAGE SLIDER                                */}
          {/* ============================================================== */}
          <div className="relative w-full aspect-[4/5] md:aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] group">
            
            {/* Base Image (24H - Full Ink) */}
            <div className="absolute inset-0">
              <Image 
                src={DEVELOPMENT_STAGES[3].imageUrl} 
                alt="24 Hour Full Ink" 
                fill 
                className="object-cover"
                priority
              />
            </div>

            {/* Overlay Image (0H - Fresh Apply) clipped by slider */}
            <div 
              className="absolute inset-0 will-change-transform"
              style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
            >
              <Image 
                src={DEVELOPMENT_STAGES[0].imageUrl} 
                alt="Fresh Apply" 
                fill 
                className="object-cover"
                priority
              />
            </div>

            {/* Top Labels */}
            <div className="absolute top-6 left-6 bg-zinc-950/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full z-20 shadow-lg">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300">Fresh Apply</span>
            </div>
            <div className="absolute top-6 right-6 bg-[#FE8204]/90 backdrop-blur-md border border-[#FE8204]/50 px-4 py-2 rounded-full z-20 shadow-[0_0_20px_rgba(254,130,4,0.4)]">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Full Ink (24H)</span>
            </div>

            {/* Slider Handle UI */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-[#FE8204] z-20 shadow-[0_0_15px_rgba(254,130,4,0.6)] pointer-events-none"
              style={{ left: `${sliderValue}%`, transform: 'translateX(-50%)' }}
            >
              {/* Center Grab Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-14 bg-[#FE8204] rounded-xl flex items-center justify-center shadow-xl border border-white/20 transition-transform group-hover:scale-110">
                <div className="flex gap-1">
                  <div className="w-1 h-5 bg-white/80 rounded-full" />
                  <div className="w-1 h-5 bg-white/80 rounded-full" />
                </div>
              </div>

              {/* Bottom Percentage Indicator */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-[#FE8204] text-white px-4 py-2 rounded-full text-xs font-black tracking-widest shadow-lg">
                {sliderValue}%
              </div>
            </div>

            {/* Hidden Native Range Input for perfect drag accessibility */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderValue} 
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              aria-label="Drag to see tattoo development process"
            />
          </div>

          {/* ============================================================== */}
          {/* RIGHT: CONTENT & TIMELINE                                      */}
          {/* ============================================================== */}
          <div className="flex flex-col justify-center">
            
            {/* Header Content */}
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-white/5 mb-6">
                <Clock className="w-4 h-4 text-[#FE8204]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Time-Release Technology
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-[1.1]">
                Watch It <br/><span className="text-[#FE8204]">Develop</span>
              </h2>
              <p className="text-base md:text-lg text-zinc-400 font-medium leading-relaxed max-w-xl">
                Our revolutionary plant-based formula doesn't just sit on your skin—it gradually sinks into your epidermis, developing from nearly invisible to deep, realistic ink over 24 hours.
              </p>
            </div>

            {/* Dynamic Interactive Timeline */}
            <div className="relative pt-8 pb-12">
              
              {/* Timeline Track */}
              <div className="absolute top-12 left-0 right-0 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  className="absolute top-0 left-0 bottom-0 bg-[#FE8204]"
                  initial={{ width: 0 }}
                  animate={{ width: `${activeStage.developmentPercentage}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                />
              </div>

              {/* Timeline Nodes */}
              <div className="flex justify-between relative z-10 mb-12">
                {DEVELOPMENT_STAGES.map((stage, index) => {
                  const isActive = index <= activeStageIndex;
                  return (
                    <button
                      key={stage.id}
                      onClick={() => setSliderValue(stage.developmentPercentage)}
                      className="flex flex-col items-center gap-3 group outline-none"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] transition-all duration-500 ${isActive ? 'bg-[#FE8204] text-white shadow-[0_0_15px_rgba(254,130,4,0.5)] scale-110' : 'bg-zinc-900 text-zinc-600 border border-white/10 group-hover:bg-zinc-800'}`}>
                        {stage.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Stage Text (Crossfade Animation) */}
              <div className="bg-zinc-900/50 backdrop-blur-sm border border-white/5 rounded-3xl p-6 min-h-[160px] relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col h-full"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">
                        {activeStage.title}
                      </h3>
                      <span className="text-[#FE8204] font-black text-sm">{activeStage.developmentPercentage}%</span>
                    </div>
                    <p className="text-zinc-400 font-medium text-sm leading-relaxed">
                      {activeStage.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* CTA */}
            <div>
              <button className="group inline-flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-white hover:text-[#FE8204] transition-colors">
                See the science behind it 
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}