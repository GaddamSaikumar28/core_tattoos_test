'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, Eye, EyeOff } from "lucide-react"; 
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner"; 

export default function SignupPage() {
  // 1. Added confirmPassword to state
  const [formData, setFormData] = useState({ 
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  
  const [showPassword, setShowPassword] = useState(false); // 2. State for eye toggle
  const [acceptsMarketing, setAcceptsMarketing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();
  const shopifyAccountUrl = process.env.NEXT_PUBLIC_SHOPIFY_ACCOUNT_URL;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 3. Validation: Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    const success = await signup(
      formData.firstName, 
      formData.lastName, 
      formData.email, 
      formData.password, 
      acceptsMarketing
    );
    setIsSubmitting(false);
    if (success) {
      router.push("/account"); 
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center py-20 px-4 mt-16 md:mt-10 relative z-10 overflow-hidden">
      
      {/* Dynamic Background Flares */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FE8204]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#FE8204]/3 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Glassmorphic Workspace Form Card */}
      <div className="max-w-xl w-full bg-zinc-900/45 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] p-8 sm:p-12 border border-white/10 relative overflow-hidden">
        
        {/* Top edge gradient highlight */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Section Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2 leading-none">Create Account</h1>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Join our global creative ecosystem</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Identity Coordinates Block */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">First Name</label>
              <input 
                type="text" 
                name="firstName" 
                required 
                value={formData.firstName} 
                onChange={handleChange} 
                className="w-full h-14 bg-zinc-950/80 border border-white/5 rounded-xl px-4 text-white placeholder-zinc-600 focus:border-[#FE8204]/50 focus:ring-1 focus:ring-[#FE8204]/20 outline-none transition-all duration-300 font-medium text-sm shadow-inner" 
                placeholder="John" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">Last Name</label>
              <input 
                type="text" 
                name="lastName" 
                required 
                value={formData.lastName} 
                onChange={handleChange} 
                className="w-full h-14 bg-zinc-950/80 border border-white/5 rounded-xl px-4 text-white placeholder-zinc-600 focus:border-[#FE8204]/50 focus:ring-1 focus:ring-[#FE8204]/20 outline-none transition-all duration-300 font-medium text-sm shadow-inner" 
                placeholder="Doe" 
              />
            </div>
          </div>

          {/* Email Element */}
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full h-14 bg-zinc-950/80 border border-white/5 rounded-xl px-4 text-white placeholder-zinc-600 focus:border-[#FE8204]/50 focus:ring-1 focus:ring-[#FE8204]/20 outline-none transition-all duration-300 font-medium text-sm shadow-inner" 
              placeholder="you@example.com" 
            />
          </div>

          {/* Password Cryptology Matrix */}
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                required 
                minLength={8} 
                value={formData.password} 
                onChange={handleChange} 
                className="w-full h-14 bg-zinc-950/80 border border-white/5 rounded-xl pl-4 pr-12 text-white placeholder-zinc-600 focus:border-[#FE8204]/50 focus:ring-1 focus:ring-[#FE8204]/20 outline-none transition-all duration-300 font-medium text-sm shadow-inner" 
                placeholder="Minimum 8 characters" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors duration-200"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Verification Lock Row */}
          <div>
            <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-2.5">Confirm Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                name="confirmPassword" 
                required 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                className="w-full h-14 bg-zinc-950/80 border border-white/5 rounded-xl px-4 text-white placeholder-zinc-600 focus:border-[#FE8204]/50 focus:ring-1 focus:ring-[#FE8204]/20 outline-none transition-all duration-300 font-medium text-sm shadow-inner" 
                placeholder="Re-enter validation code" 
              />
            </div>
          </div>

          {/* Preference Checkboxes */}
          <div className="flex items-center gap-3 pt-2">
            <div className="relative flex items-center">
              <input 
                type="checkbox" 
                id="marketing" 
                checked={acceptsMarketing} 
                onChange={(e) => setAcceptsMarketing(e.target.checked)} 
                className="w-4 h-4 bg-zinc-950 text-[#FE8204] border-white/10 rounded cursor-pointer accent-[#FE8204] focus:ring-0 focus:ring-offset-0" 
              />
            </div>
            <label htmlFor="marketing" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest cursor-pointer select-none leading-none pt-0.5">
              Subscribe to operational updates and offers
            </label>
          </div>

          {/* Account Submittal Actions */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="w-full h-14 mt-4 bg-[#FE8204] text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(254,130,4,0.3)] hover:shadow-[0_0_30px_rgba(254,130,4,0.5)] hover:bg-[#ff952b] transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Initialize Registration"}
          </button>
        </form>

        {/* Dynamic Shopify Account Link Context */}
        {shopifyAccountUrl && (
          <div className="mb-8 mt-5">
            <a 
              href={shopifyAccountUrl}
              className="w-full h-14 bg-zinc-900 border border-white/5 text-zinc-300 hover:text-white rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all duration-300 flex items-center justify-center gap-3 shadow-md"
            >
              <ShoppingBag className="w-4 h-4" />
              Continue with Shop
            </a>
          </div>
        )}

        {/* Redirection Channels footer */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            Already registered?{" "}
            <Link href="/login" className="text-white hover:text-[#FE8204] transition-colors ml-1 font-black underline underline-offset-4 decoration-white/20 hover:decoration-[#FE8204]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}