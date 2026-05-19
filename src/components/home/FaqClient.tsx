"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// Adjust this interface based on your actual data structure
interface FaqItem {
  question: string;
  answer: string;
}

interface FaqData {
  headerText: string;
  headerHighlight: string;
  subheading: string;
  supportTitle: string;
  supportDescription: string;
  supportButtonLink: string;
  supportButtonText: string;
  faqs: FaqItem[];
}

export default function FaqClient({ data }: { data: FaqData }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1312px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-24 items-start relative z-10">
      
      {/* ================= LEFT COLUMN: Header & CTA ================= */}
      <div className="w-full lg:w-5/12 lg:sticky lg:top-32 flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--color-brand-orange)]/30 bg-[var(--color-brand-orange)]/10 text-[var(--color-brand-orange)] text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase w-fit mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-brand-orange)]">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            Help & Support
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-[56px] font-light text-white leading-[1.1] tracking-tight">
            {data.headerText} <br className="hidden lg:block" />
            <span className="text-[var(--color-brand-orange)] font-normal italic pr-2">{data.headerHighlight}</span>
          </h2>
          
          <p className="text-gray-400 mt-6 text-base md:text-lg leading-relaxed whitespace-pre-line max-w-[400px]">
            {data.subheading}
          </p>
          
          {/* Support CTA Card */}
          <div className="mt-10 p-8 bg-[#111111] border border-gray-800 rounded-[20px] shadow-2xl relative overflow-hidden group">
            {/* Hover Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-brand-orange)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <h4 className="font-semibold text-white mb-3 text-lg">
                {data.supportTitle}
              </h4>
              <p className="text-sm text-gray-400 mb-8 whitespace-pre-line leading-relaxed">
                {data.supportDescription}
              </p>
              <Link href={data.supportButtonLink} className="block w-full sm:w-max">
                <button className="w-full sm:w-auto bg-[var(--color-brand-orange)] text-black h-[52px] px-8 rounded-full font-semibold text-sm transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_#FF7A004D] flex items-center justify-center gap-2">
                  {data.supportButtonText}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= RIGHT COLUMN: Accordion Items ================= */}
      <div className="w-full lg:w-7/12 flex flex-col gap-3 md:gap-4 lg:pt-4">
        {data.faqs.map((faq: FaqItem, index: number) => {
          const isOpen = openIndex === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              className={`bg-[#111111] border rounded-[16px] overflow-hidden transition-all duration-300 ${
                isOpen ? 'border-gray-600 shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'border-gray-800 hover:border-gray-700'
              }`}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between px-6 py-5 md:px-8 md:py-6 text-left group gap-4 focus:outline-none"
              >
                <h3 className={`font-medium text-base md:text-lg transition-colors duration-300 pr-4 ${
                  isOpen ? 'text-[var(--color-brand-orange)]' : 'text-gray-200 group-hover:text-white'
                }`}>
                  {faq.question}
                </h3>
                
                {/* Refined Plus/Minus Icon */}
                <div className={`relative w-10 h-10 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isOpen ? 'bg-[var(--color-brand-orange)]/10 border-[var(--color-brand-orange)]/30' : 'bg-transparent border-gray-700 group-hover:border-gray-500 group-hover:bg-gray-800/50'
                }`}>
                  {/* Horizontal Line */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute w-3.5 h-[1.5px] rounded-full transition-colors duration-300 ${isOpen ? 'bg-[var(--color-brand-orange)]' : 'bg-gray-400 group-hover:bg-white'}`}
                  />
                  {/* Vertical Line */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 90, opacity: isOpen ? 0 : 1 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className={`absolute w-3.5 h-[1.5px] rounded-full transition-colors duration-300 ${isOpen ? 'bg-[var(--color-brand-orange)]' : 'bg-gray-400 group-hover:bg-white'}`}
                  />
                </div>
              </button>

              {/* Animated Answer Body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0">
                      <div className="w-full h-[1px] bg-gray-800/50 mb-4"></div>
                      <p className="text-gray-400 text-sm md:text-base leading-relaxed pr-2 md:pr-12 whitespace-pre-line">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      
    </div>
  );
}