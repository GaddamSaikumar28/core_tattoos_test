

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, ShoppingBag } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const shopifyAccountUrl = process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(email, password);
    setIsSubmitting(false);
    if (success) {
      router.push("/account"); // Or redirect to checkout/home
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-20 px-4 mt-16 md:mt-10 relative overflow-hidden selection:bg-[#FE8204] selection:text-white">
      
      {/* Immersive Ambient Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[500px] bg-[#FE8204] opacity-[0.08] blur-[120px] pointer-events-none z-0 rounded-full" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800 opacity-[0.2] blur-[100px] pointer-events-none z-0" />

      {/* Main Glassmorphic Login Card */}
      <div className="relative z-10 max-w-md w-full bg-zinc-900/70 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 border border-white/10 shadow-2xl shadow-black/50">
        
        {/* Header */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
            <div className="w-4 h-4 bg-[#FE8204] rounded-full shadow-[0_0_15px_#FE8204]" />
          </div> */}
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">Welcome Back</h1>
          <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em]">Sign in to your account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="group">
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2 group-focus-within:text-[#FE8204] transition-colors">
              Email Address
            </label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-14 bg-zinc-950/50 border border-white/10 rounded-xl px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] focus:-translate-y-0.5 transition-all duration-300 shadow-inner"
              placeholder="you@example.com"
            />
          </div>

          {/* Password Input */}
          <div className="group">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest group-focus-within:text-[#FE8204] transition-colors">
                Password
              </label>
              <Link href="/forgot-password" className="text-[10px] font-bold text-zinc-500 hover:text-[#FE8204] hover:underline uppercase tracking-widest transition-colors">
                Forgot?
              </Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 bg-zinc-950/50 border border-white/10 rounded-xl px-5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] focus:-translate-y-0.5 transition-all duration-300 shadow-inner"
              placeholder="••••••••"
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full h-14 mt-2 bg-[#FE8204] text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#ff952b] hover:shadow-[0_0_25px_rgba(254,130,4,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Shopify Integration */}
        {shopifyAccountUrl && (
          <div className="mt-6">
            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">Or</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>
            <a 
              href={shopifyAccountUrl}
              className="w-full h-14 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-[#5a31f4] hover:border-[#5a31f4] hover:shadow-[0_0_25px_rgba(90,49,244,0.4)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
            >
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              Continue with Shop
            </a>
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Don't have an account?{" "}
            <Link href="/signup" className="text-white hover:text-[#FE8204] transition-colors ml-2 font-black border-b border-transparent hover:border-[#FE8204] pb-0.5">
              Create one
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}