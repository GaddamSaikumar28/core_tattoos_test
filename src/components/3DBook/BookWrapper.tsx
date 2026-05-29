"use client";

import dynamic from "next/dynamic";
import type { TattooProduct } from "./UI";

const BookScene = dynamic(() => import("./index"), {
  ssr:     false,
  loading: () => <BookLoadingShell />,
});

interface BookWrapperProps {
  products?: TattooProduct[];
}

function BookLoadingShell() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-[#050505] relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(255,122,0,0.08) 0%, transparent 70%)",
        }}
      />

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
    </div>
  );
}

export default function BookWrapper({ products }: BookWrapperProps) {
  return <BookScene products={products} />;
}