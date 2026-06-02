"use client";
 
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
 
interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
 
function AccordionItem({ title, isOpen, onToggle, children }: AccordionItemProps) {
  return (
    <div className="border-b border-white/[0.06] last:border-0">
 
      {/* ── Header button ─────────────────────────────────── */}
      <button
        onClick={onToggle}
        className="w-full py-3 flex items-center justify-between group outline-none"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 group-hover:text-white transition-colors duration-200">
          {title}
        </span>
 
        {/* Chevron rotates 180° when open */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-neutral-600 group-hover:text-neutral-300 transition-colors duration-200" />
        </motion.div>
      </button>
 
      {/* ── Collapsible body (height animation) ───────────── */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
 
export default AccordionItem;
 

