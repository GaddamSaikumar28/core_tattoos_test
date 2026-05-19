
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { recoverPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await recoverPassword(email);
    setIsSubmitting(false);
    if (success) setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center py-20 px-4 mt-16 md:mt-0 relative overflow-hidden selection:bg-[#fe8204] selection:text-white">
      
      {/* Dynamic Background Premium Accent Core Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#fe8204] opacity-[0.04] blur-[150px] pointer-events-none z-0 rounded-full" />
      
      {/* Main Glassmorphic Wrapper Form Block */}
      <div className="relative z-10 max-w-md w-full bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)]">
        
        {/* Navigation Return Button */}
        <Link 
          href="/login" 
          className="group inline-flex items-center gap-2 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] mb-8 transition-colors duration-300"
        >
          <ArrowLeft className="w-4 h-4 text-zinc-500 group-hover:text-[#fe8204] group-hover:-translate-x-1 transition-all duration-300" /> 
          Back to Login
        </Link>

        {/* Conditional Stage Rendering Layouts */}
        {isSubmitted ? (
          <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in-95 duration-400">
            <div className="w-16 h-16 bg-[#fe8204]/10 border border-[#fe8204]/20 text-[#fe8204] rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
              </svg>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none">Check Your Email</h2>
            <p className="text-sm font-medium text-zinc-400 leading-relaxed max-w-xs mx-auto">
              We have dispatched critical passkey recovery updates over to <br />
              <span className="text-white font-black block mt-2 p-1.5 rounded-lg bg-zinc-950/60 border border-white/5 tracking-tight break-all">{email}</span>
            </p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Form Headers */}
            <div className="mb-8">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 leading-none">Reset Password</h1>
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-normal">Provide account email to authorize routing parameters</p>
            </div>

            {/* Account Recovery Inputs Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 group">
                <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-[0.15em] ml-1 group-focus-within:text-[#fe8204] transition-colors">
                  Email Address
                </label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-zinc-950/50 border border-white/5 rounded-2xl px-5 text-sm font-bold text-white outline-none focus:border-[#fe8204] focus:ring-1 focus:ring-[#fe8204] shadow-inner transition-all placeholder:text-zinc-700"
                  placeholder="you@example.com"
                />
              </div>

              {/* Action Interlock Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#fe8204] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ff952b] hover:shadow-[0_0_25px_rgba(254,130,4,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}