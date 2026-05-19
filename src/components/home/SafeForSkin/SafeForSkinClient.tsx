'use client';

import { motion, Variants } from 'framer-motion';
import React from 'react';

type Feature = { title: string; subtitle: string; icon: string; colorClass: string };
type Ingredient = { name: string; description: string };
type Stat = { value: string; title: string; subtitle: string; colorClass: string };

type SafeForSkinData = {
  tagText: string;
  titleWhite: string;
  titleColored: string;
  description: string;
  formulaTitle: string;
  complianceText: string;
  features: Feature[];
  ingredients: Ingredient[];
  stats: Stat[];
};

// SVG Icon Map based on the wireframe
const IconMap: Record<string, React.ReactNode> = {
  leaf: <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />,
  water: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0 0v-5m0 0H9m3 0h3" />,
  clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  shield: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
  heart: <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />,
  flask: <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />,
  medal: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />,
  check: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
};

export default function SafeForSkinClient({ data }: { data: SafeForSkinData }) {
  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemFade: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <section className="w-full bg-[#0a0a0a] text-white py-24 px-4 md:px-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto flex flex-col gap-20">
        
        {/* === HEADER === */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col gap-4 max-w-xl">
            <motion.div variants={itemFade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 self-start">
              <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {IconMap.shield}
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-widest text-green-500">{data.tagText}</span>
            </motion.div>
            
            <motion.h2 variants={itemFade} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mt-2">
              {data.titleWhite} <span className="text-orange-500">{data.titleColored}</span>
            </motion.h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="max-w-lg flex flex-col gap-6 text-neutral-400 leading-relaxed font-light mt-4 lg:mt-0">
            {data.description.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </motion.div>
        </div>

        {/* === FEATURES GRID (8 ITEMS) === */}
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.features.map((item, idx) => (
            <motion.div key={idx} variants={itemFade} className="bg-[#121212] border border-white/5 rounded-[1.5rem] p-6 flex flex-col items-center text-center group hover:bg-[#151515] hover:border-white/10 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                <svg className={`w-6 h-6 ${item.colorClass}`} fill="none" strokeWidth={1.5} viewBox="0 0 24 24" stroke="currentColor">
                  {IconMap[item.icon] || IconMap.check}
                </svg>
              </div>
              <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
              <p className="text-xs text-neutral-500">{item.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* === BOTTOM SECTION (FORMULA & STATS) === */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Our Formula */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-5 relative bg-gradient-to-br from-[#1a1710] to-[#0f0e0b] border border-yellow-500/10 rounded-[2rem] p-8 md:p-10 overflow-hidden">
            <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
              <svg className="w-96 h-96 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
                {IconMap.check}
              </svg>
            </div>
            
            <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80 mb-2 block">What's Inside</span>
            <h3 className="text-3xl font-bold text-white mb-6">{data.formulaTitle}</h3>
            
            <div className="flex flex-col gap-6">
              {data.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)] shrink-0" />
                  <div>
                    <h5 className="text-sm font-medium text-white mb-1">{ing.name}</h5>
                    <p className="text-xs text-neutral-400 leading-relaxed">{ing.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Stats & Compliance */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="lg:col-span-7 flex flex-col gap-4">
            {data.stats.map((stat, idx) => (
              <motion.div key={idx} variants={itemFade} className="bg-[#121212] border border-white/5 rounded-[1.5rem] p-6 md:p-8 flex items-center gap-6 md:gap-8 hover:border-white/10 transition-colors">
                <span className={`text-5xl md:text-6xl font-black tracking-tighter ${stat.colorClass}`}>
                  {stat.value}
                </span>
                <div className="flex flex-col">
                  <h5 className="text-base md:text-lg font-medium text-white">{stat.title}</h5>
                  <p className="text-xs md:text-sm text-neutral-500 mt-1">{stat.subtitle}</p>
                </div>
              </motion.div>
            ))}

            {/* Compliance Banner */}
            <motion.div variants={itemFade} className="mt-2 bg-[#081510] border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">
              <svg className="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {IconMap.check}
              </svg>
              <p className="text-sm text-green-500/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.complianceText }} />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}