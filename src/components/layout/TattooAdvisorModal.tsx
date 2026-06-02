"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Wand2, Download, Loader2 } from "lucide-react";

interface TattooAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUICK_PROMPTS = [
  "Bold animals & wildlife",
  "Elegant & feminine vibes",
  "Spiritual & mystical concepts",
  "Nature & botanical patterns",
  "Minimalist & geometric linework",
  "Strong, fierce & powerful"
];

export default function TattooAdvisorModal({ isOpen, onClose }: TattooAdvisorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleGenerate();
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    setGeneratedImage(null);

    const systemPrompt = `A high quality, professional tattoo design concept based on the following personality and style description: "${prompt}". Clean white background, high contrast, perfect for a tattoo stencil. Photorealistic ink presentation.`;

    try {
      const response = await fetch('/api/generate-tattoo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: systemPrompt, provider: 'huggingface' }), 
      });

      const data = await response.json();

      if (data.success && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else {
        setError(data.error || "Failed to generate design. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Check your network.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container - Locked dimensions for outer shell */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-2xl sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[92vh] md:max-h-[85vh] md:h-[650px]"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-[#FF7A00]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none z-0" />

            {/* Global Close Button (Anchored to the fixed outer shell) */}
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-zinc-400 hover:text-white bg-zinc-900/80 backdrop-blur-sm border border-white/10 rounded-full z-[60] transition-all hover:scale-105 active:scale-95 shadow-lg"
              aria-label="Close configuration window"
            >
              <X className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            {/* Inner Scroll Wrapper (Scrolls on Mobile, Fixed on Desktop) */}
            <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto md:overflow-hidden relative z-10 custom-scrollbar">
              
              {/* Left Column: Input Panel */}
              <div className="w-full md:w-1/2 p-5 sm:p-7 md:p-8 flex flex-col h-fit md:h-full md:overflow-y-auto border-b md:border-b-0 md:border-r border-white/5 bg-zinc-950/40 custom-scrollbar">
                
                <div className="flex justify-between items-start mb-4 sm:mb-6 pr-10 md:pr-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#FF7A00]" /> AI Tattoo Advisor
                    </h2>
                    <p className="text-[9px] sm:text-[10px] text-[#FF7A00] font-black uppercase tracking-[0.2em] mt-1">
                      Powered by JT Intelligence
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 font-medium mb-5 sm:mb-6 leading-relaxed">
                  Tell me about yourself — your personality, style, or energy. I will customize the perfect tattoo design concepts matched specifically to you.
                </p>

                <div className="flex flex-col space-y-5 sm:space-y-6 flex-1">
                  <div className="space-y-2 group flex flex-col flex-1 min-h-[140px] md:min-h-[160px]">
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 group-focus-within:text-[#FF7A00] transition-colors">
                      Your Style & Personality
                    </label>
                    <div className="relative flex-1">
                      <textarea
                        required
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="E.g. I'm bold, love wolves and dark energy, I want something that makes a statement..."
                        className="w-full h-full min-h-[120px] p-3.5 sm:p-4 bg-zinc-900/40 border border-white/5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-white outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] resize-none transition-all shadow-inner placeholder:text-zinc-600 custom-scrollbar"
                      />
                      <div className="absolute bottom-2.5 right-3.5 text-[9px] font-bold text-zinc-600 hidden sm:block">
                        Ctrl+Enter to send
                      </div>
                    </div>
                  </div>

                  {/* Quick Prompt Selector Chips */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 mb-2 block">
                      Quick Prompts
                    </label>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {QUICK_PROMPTS.map((chip, idx) => (
                        <button
                          key={idx}
                          onClick={() => setPrompt(chip)}
                          className="px-2.5 py-1.5 bg-zinc-900/60 border border-white/5 hover:border-[#FF7A00]/40 hover:bg-[#FF7A00]/5 text-zinc-400 hover:text-white text-[10px] sm:text-[11px] font-bold rounded-full transition-all duration-200"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                      {error}
                    </p>
                  )}

                  {/* Engine Generation Trigger Button */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-[#FF7A00] text-black rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col items-center justify-center gap-0.5 shadow-[0_0_20px_rgba(255,122,0,0.2)] hover:shadow-[0_0_30px_rgba(255,122,0,0.4)] hover:bg-[#ff8f24] transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none mt-auto"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-5 h-5 animate-spin text-black mb-0.5" />
                    ) : (
                      <span className="text-xs sm:text-sm font-black tracking-tight">Find My Perfect Tattoos</span>
                    )}
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-widest opacity-80">
                      {isGenerating ? "Analyzing your energy..." : "AI matches from 1,000+ curated designs"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right Column: Dynamic Art Canvas */}
              <div className="w-full md:w-1/2 bg-zinc-900/30 p-5 sm:p-7 md:p-8 flex flex-col relative h-[350px] sm:h-[450px] md:h-full flex-shrink-0">
                <div className="flex-1 flex items-center justify-center relative w-full h-full rounded-xl sm:rounded-2xl overflow-hidden bg-zinc-950/80 border border-white/5 shadow-inner">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-3 text-zinc-500 p-4">
                      <Loader2 className="w-7 h-7 animate-spin text-[#FF7A00]" />
                      <span className="text-[9px] font-black uppercase tracking-widest animate-pulse text-zinc-400 text-center">
                        Forging your artwork concept...
                      </span>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative w-full h-full group animate-fadeIn">
                      <img 
                        src={generatedImage} 
                        alt="AI Generated Tattoo Concept Artwork" 
                        className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-105"
                        loading="lazy"
                      />
                      <a 
                        href={generatedImage} 
                        download="jt-tattoo-concept.jpg"
                        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-zinc-950/90 backdrop-blur-md text-white px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest border border-white/10 shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 hover:bg-[#FF7A00] hover:text-black flex items-center gap-2"
                      >
                        <Download className="w-3 h-3" /> Save Concept
                      </a>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 sm:gap-3 text-zinc-600 text-center px-4 sm:px-6 py-8">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-1">
                        <Wand2 className="w-5 h-5 text-zinc-500" />
                      </div>
                      <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-400">
                        Awaiting Analysis
                      </p>
                      <p className="text-[11px] font-medium text-zinc-500 max-w-[240px] leading-relaxed">
                        Share your vision on the left panel to see your personalized digital stencil concept materialize here.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}