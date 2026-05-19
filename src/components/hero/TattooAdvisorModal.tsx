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
  "I'm bold and love animals",
  "Elegant and feminine vibes ✨",
  "Into spiritual & mystical things",
  "Love nature and botanicals",
  "Minimalist & geometric style",
  "Strong, fierce & powerful ⚔️"
];

export default function TattooAdvisorModal({ isOpen, onClose }: TattooAdvisorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
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

    // Highly optimized system prompt instructing the AI to generate a tattoo based on user personality
    const systemPrompt = `A high quality, professional tattoo design concept based on the following personality and style description: "${prompt}". Clean white background, high contrast, perfect for a tattoo stencil. Photorealistic ink presentation.`;

    try {
      // Connects to the exact API route structure you provided earlier
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-[900px] bg-zinc-950 border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Left: Input Form (Based on PDF) */}
            <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto custom-scrollbar border-r border-white/5 bg-zinc-950/50 relative z-10">
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FF7A00]" /> AI Tattoo Advisor
                  </h2>
                  <p className="text-[10px] text-[#FF7A00] font-black uppercase tracking-[0.2em] mt-1">Powered by JT Intelligence</p>
                </div>
                <button onClick={onClose} className="md:hidden p-2 text-zinc-500 hover:text-white bg-zinc-900 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-zinc-400 font-medium mb-8 leading-relaxed">
                Tell me about yourself — your personality, style, occasion, or what you're feeling. I'll analyse your energy and recommend the perfect tattoo designs, with full explanations for why each one is right for you.
              </p>

              <div className="flex-1 flex flex-col space-y-6">
                <div className="space-y-2 group flex-1 flex flex-col">
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
                      className="w-full h-full min-h-[120px] p-4 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm font-medium text-white outline-none focus:border-[#FF7A00] focus:ring-1 focus:ring-[#FF7A00] resize-none transition-all shadow-inner placeholder:text-zinc-600"
                    />
                    <div className="absolute bottom-3 right-4 text-[10px] font-bold text-zinc-600">
                      Ctrl+Enter to send
                    </div>
                  </div>
                </div>

                {/* Quick Prompts Chips */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 mb-2 block">
                    Quick Prompts
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {QUICK_PROMPTS.map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(chip)}
                        className="px-3 py-1.5 bg-zinc-900 border border-white/5 hover:border-[#FF7A00]/50 hover:bg-[#FF7A00]/10 text-zinc-300 hover:text-white text-[11px] font-bold rounded-full transition-all duration-300"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-xs font-bold bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                  </p>
                )}

                {/* Submit Button */}
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-[#FF7A00] text-black rounded-xl p-4 flex flex-col items-center justify-center gap-1 shadow-[0_0_20px_rgba(255,122,0,0.3)] hover:shadow-[0_0_30px_rgba(255,122,0,0.5)] hover:bg-[#ff8f24] transition-all duration-300 disabled:opacity-50 mt-4"
                >
                  {isGenerating ? (
                    <Loader2 className="w-6 h-6 animate-spin text-black mb-1" />
                  ) : (
                    <span className="text-sm font-black tracking-tight">Find My Perfect Tattoos</span>
                  )}
                  <span className="text-[9px] font-bold uppercase tracking-widest opacity-80">
                    {isGenerating ? "Analysing your energy..." : "AI matches from 1,000+ curated designs - Personalised for you"}
                  </span>
                </button>
              </div>
            </div>

            {/* Right: Output Display Area */}
            <div className="w-full md:w-1/2 bg-zinc-900/80 p-8 flex flex-col relative min-h-[400px] md:min-h-full">
              <button onClick={onClose} className="hidden md:flex absolute top-6 right-6 p-2 text-zinc-500 hover:text-white bg-zinc-950 border border-white/5 rounded-full z-10 transition-colors">
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 flex items-center justify-center relative w-full h-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 shadow-inner">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4 text-zinc-500">
                    <Loader2 className="w-8 h-8 animate-spin text-[#FF7A00]" />
                    <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Generating your match...</span>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full min-h-[300px] group">
                    <img 
                      src={generatedImage} 
                      alt="AI Generated Tattoo" 
                      className="w-full h-full object-cover rounded-2xl" 
                    />
                    <a 
                      href={generatedImage} 
                      download="jt-tattoo-concept.jpg"
                      className="absolute bottom-4 right-4 bg-zinc-950/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF7A00] hover:text-black flex items-center gap-2"
                    >
                      <Download className="w-3 h-3" /> Save Concept
                    </a>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-zinc-600 text-center px-6">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-2">
                      <Wand2 className="w-6 h-6 text-zinc-700" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
                    <p className="text-[11px] font-medium max-w-[220px]">
                      Share your vision on the left to see your personalized AI tattoo concept appear here.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}