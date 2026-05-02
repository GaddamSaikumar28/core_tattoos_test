"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// PROD FIX: This clean alias bypasses Vercel's strict JSX element checks 
// without needing ugly React.createElement hacks or .d.ts files.
const ModelViewer = "model-viewer" as any;

// Configuration for Demo Assets (Production-ready URLs)
const assetsForDemo = [
  {
    name: "Robot (Cyber Vibe)",
    glb: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    usdz: undefined
  },
  {
    name: "Astronaut (Scale Demo)",
    glb: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    usdz: "https://modelviewer.dev/shared-assets/models/Astronaut.usdz"
  },
 {
    name: "The Duck (Small Prop)",
    glb: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/Duck/glTF-Binary/Duck.glb",
    usdz: undefined
  }
];

export default function TattooPDP() {
  const [isMounted, setIsMounted] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Sterling Silver");
  const [expandedSection, setExpandedSection] = useState<string | null>("why");
  
  // 3D & AR States
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [arSupported, setArSupported] = useState(false);
  const modelViewerRef = useRef<HTMLElement>(null);
  
  // Simulated skin tones
  const skinTones = ["#f8d9c8", "#e4bca2", "#c6967a", "#8e583e", "#4a2d1d"];
  const [activeSkinTone, setActiveSkinTone] = useState(skinTones[1]);

  // Manage selected assets
  const [selectedAssetIndex, setSelectedAssetIndex] = useState(0);
  const currentAsset = assetsForDemo[selectedAssetIndex];

  useEffect(() => {
    setIsMounted(true);
    
    // Load model-viewer script dynamically (Removed duplicate <Script> tag)
    const loadModelViewer = async () => {
      try {
        await import("@google/model-viewer");
        
        // Wait for the browser to register the custom element
        await customElements.whenDefined('model-viewer');

        if (modelViewerRef.current) {
          const mv = modelViewerRef.current as any;
          
          // Attach events securely
          mv.addEventListener("load", handleModelLoad);
          mv.addEventListener("error", handleModelError);
          
          // Securely check AR support
          if (typeof mv.canActivateAR !== "undefined") {
            setArSupported(mv.canActivateAR);
          }
        }
      } catch (error) {
        console.error("Failed to load model-viewer:", error);
        setModelError("3D engine failed to initialize. Please refresh.");
      }
    };

    loadModelViewer();

    return () => {
      if (modelViewerRef.current) {
        modelViewerRef.current.removeEventListener("load", handleModelLoad);
        modelViewerRef.current.removeEventListener("error", handleModelError);
      }
    };
  }, []);

  const handleModelLoad = () => {
    setModelLoaded(true);
    setModelError(null);
  };

  const handleModelError = () => {
    setModelError("Failed to render the 3D mesh.");
    setModelLoaded(false);
  };

  const handleARClick = () => {
    if (modelViewerRef.current) {
      const mv = modelViewerRef.current as any;
      if (mv.canActivateAR) {
        mv.activateAR();
      } else {
        alert("AR is not supported on your current device/browser.");
      }
    }
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12 px-4 md:px-8 mt-10 font-sans selection:bg-white/20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
        
        {/* LEFT COLUMN: 3D Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full aspect-[4/5] md:aspect-square rounded-2xl overflow-hidden shadow-2xl transition-colors duration-500"
          style={{ backgroundColor: activeSkinTone }}
        >
          {modelError && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
              <p className="text-red-400 text-center font-semibold mb-4">{modelError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-white text-black rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Reboot Engine
              </button>
            </div>
          )}

          {/* Loading Spinner */}
          {!modelLoaded && !modelError && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-sm">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-xs tracking-widest uppercase font-bold text-white/80">Loading Mesh...</p>
              </div>
            </div>
          )}

          {/* Clean JSX Usage (No React.createElement) */}
          <ModelViewer
            ref={modelViewerRef}
            src={currentAsset.glb}
            ios-src={currentAsset.usdz}
            alt={`3D product model - ${currentAsset.name}`}
            ar="true"
            ar-modes="webxr scene-viewer quick-look"
            camera-controls="true"
            auto-rotate={isAutoRotate ? "true" : undefined}
            rotation-per-second="30deg"
            shadow-intensity="1"
            environment-image="neutral"
            exposure="1.2"
            interaction-prompt="none"
            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
          >
            <button slot="ar-button" className="hidden">AR</button>
          </ModelViewer>

          {/* Skin Tone & 360 Controls Overlay */}
          <div className="absolute bottom-8 left-0 w-full flex flex-col items-center justify-center space-y-4 pointer-events-none z-30">
            
            {/* Skin Tone Toggle */}
            <div className="pointer-events-auto flex flex-col items-center">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full mb-2">
                Skin Tone Toggle
              </span>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-xl p-2 rounded-full border border-white/30 shadow-lg">
                {skinTones.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setActiveSkinTone(hex)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      activeSkinTone === hex ? "border-white scale-110" : "border-transparent hover:scale-105"
                    }`}
                    style={{ backgroundColor: hex }}
                    aria-label={`Set skin tone to ${hex}`}
                  />
                ))}
              </div>
            </div>

            {/* Vibe Check / 360 Toggle */}
            <button
              onClick={() => setIsAutoRotate(!isAutoRotate)}
              className="pointer-events-auto flex flex-col items-center group"
            >
              <span className="text-[10px] font-bold tracking-widest uppercase bg-black/40 backdrop-blur-md text-white px-3 py-1 rounded-full mb-1 transition-colors group-hover:bg-black/60">
                Vibe Check
              </span>
              <div className="flex items-center gap-1 text-black bg-white/50 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isAutoRotate ? "animate-spin" : ""}>
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
                360° {isAutoRotate ? "ON" : "OFF"}
              </div>
            </button>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Product Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex flex-col w-full max-w-md"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase mb-2">
            Just Tattoos Metallic Temporary Tattoo Sleeve
          </h1>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex text-[#fe8204]">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-neutral-400 font-medium">(4.8) 12K+ reviews</span>
          </div>
          
          <div className="text-xl font-bold mb-1">$24 <span className="text-sm font-normal text-neutral-400 ml-1">or 4 interest-free payments.</span></div>
          
          <div className="flex items-center gap-2 text-sm text-red-400 font-medium mb-8">
            <span>🔥</span> Only 14 remaining in stock. <span className="text-neutral-400">Added 8 times in the last hour.</span>
          </div>

          <div className="mb-6">
            <div className="text-sm font-bold mb-2">Size:</div>
            <div className="flex gap-2 mb-2">
              {["S", "M", "L", "CUSTOM"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-full border text-sm font-semibold transition-colors ${
                    selectedSize === size
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-white border-white/20 hover:border-white/50"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            <p className="text-sm text-neutral-400">Large (4" x 5") - Perfect for forearm or thigh.</p>
          </div>

          <div className="mb-8">
            <div className="flex gap-2">
              {["Sterling Silver", "Matte Black", "Deep Indigo"].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${
                    selectedColor === color
                      ? "bg-white/10 border-white text-white"
                      : "bg-transparent border-white/20 text-neutral-400 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Asset Switcher */}
          <div className="mb-8 bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-3">Demo Switcher of 3D models</div>
            <div className="flex flex-wrap gap-2">
              {assetsForDemo.map((asset, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAssetIndex(index)}
                  className={`px-4 py-2 rounded-full border text-xs font-semibold transition-colors ${
                    selectedAssetIndex === index
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "bg-transparent text-white border-white/20 hover:border-white/50"
                  }`}
                >
                  {asset.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-8">
            <button className="w-full bg-gradient-to-r from-gray-200 via-white to-gray-200 text-black font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:opacity-90 transition-opacity">
              Add to Bag — $24
            </button>
            <button 
              onClick={handleARClick}
              disabled={!modelLoaded || !arSupported}
              className={`w-full font-bold py-4 rounded-full uppercase tracking-widest text-sm transition-colors ${
                modelLoaded && arSupported
                  ? "bg-transparent border border-white text-white hover:bg-white/5"
                  : "bg-transparent border border-white/30 text-white/50 cursor-not-allowed"
              }`}
            >
              {!modelLoaded ? "Loading AR..." : !arSupported ? "AR Not Available" : "Try on Now (AR)"}
            </button>
          </div>

          {/* Accordions */}
          <div className="border-t border-white/10 divide-y divide-white/10">
            <div className="py-4">
              <button 
                onClick={() => setExpandedSection(expandedSection === "why" ? null : "why")}
                className="flex items-center justify-between w-full text-left uppercase text-sm font-bold tracking-widest"
              >
                Why You'll Love It
                <span className="text-xl font-light">{expandedSection === "why" ? "−" : "+"}</span>
              </button>
              <AnimatePresence>
                {expandedSection === "why" && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-4 space-y-2 text-sm text-neutral-400">
                      <li className="flex items-center gap-2">✨ Realistic Metallic Finish</li>
                      <li className="flex items-center gap-2">💧 Waterproof & Gym-Proof</li>
                      <li className="flex items-center gap-2">⏱️ Lasts 10-14 Days</li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Guide & Shipping Accordions */}
            <div className="py-4">
              <button onClick={() => setExpandedSection(expandedSection === "guide" ? null : "guide")} className="flex items-center justify-between w-full text-left uppercase text-sm font-bold tracking-widest">
                Application Guide
                <span className="text-xl font-light">{expandedSection === "guide" ? "−" : "+"}</span>
              </button>
            </div>
            <div className="py-4">
              <button onClick={() => setExpandedSection(expandedSection === "shipping" ? null : "shipping")} className="flex items-center justify-between w-full text-left uppercase text-sm font-bold tracking-widest">
                Shipping & Returns
                <span className="text-xl font-light">{expandedSection === "shipping" ? "−" : "+"}</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}