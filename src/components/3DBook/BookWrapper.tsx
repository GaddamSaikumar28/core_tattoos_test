
"use client";

import dynamic from "next/dynamic";
import type { TattooProduct } from "./UI";

// Dynamically import the 3D scene — must be client-only (WebGL)
const BookScene = dynamic(() => import("./index"), {
  ssr:     false,
  loading: () => <BookLoadingShell />,
});

// ─── Props ────────────────────────────────────────────────────────────────────
interface BookWrapperProps {
  products?: TattooProduct[];
}

// ─── Thin SSR-safe shell shown before JS hydrates ────────────────────────────
function BookLoadingShell() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,122,0,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Ink drop icon */}
      <div className="relative w-20 h-20 mb-6 z-10">
        <div
          className="absolute inset-0 rounded-full border border-[#FF7A00]/20 animate-ping"
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 40 40" className="w-10 h-10">
            <path
              d="M20 5 C20 5, 30 18, 30 24 C30 30, 25.5 35, 20 35 C14.5 35, 10 30, 10 24 C10 18, 20 5, 20 5Z"
              fill="#FF7A00"
            />
          </svg>
        </div>
      </div>

      <p
        className="text-[#FF7A00] text-xl z-10 tracking-[0.25em]"
        style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
      >
        JUST TATTOOS
      </p>
      <p className="text-white/30 text-xs tracking-widest mt-2 z-10">
        3D LOOKBOOK
      </p>
    </div>
  );
}

// ─── Wrapper (exported — import this in page.tsx) ─────────────────────────────
export default function BookWrapper({ products }: BookWrapperProps) {
  return <BookScene products={products} />;
}