"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { updateCustomerProfile } from "@/src/lib/shopify";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const { customer } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [formData, setFormData] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    password: "", // Only sent if user wants to change it
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const token = Cookies.get("shopify_customer_token");
      if (!token) throw new Error("Authentication error");

      // Construct update payload
      const updatePayload: any = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      };

      // Only add password if they typed a new one
      if (formData.password.trim().length > 0) {
        if (formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters");
        }
        updatePayload.password = formData.password;
      }

      const response = await updateCustomerProfile(token, updatePayload);
      
      // If updating email/password changes the token, update the cookie
      if (response.newToken) {
        Cookies.set("shopify_customer_token", response.newToken, { expires: 14 });
      }

      toast.success("Profile updated successfully! Refreshing...");
      setTimeout(() => window.location.reload(), 1500); // Reload to sync context

    } catch (error: any) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mt-6 space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dynamic Background Flare */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#FE8204]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Page Title Context Frame */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Account Settings</h1>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">Configure your profile attributes and security credentials</p>
      </div>
      
      {/* Premium Glassmorphic Configuration Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 md:p-8 shadow-xl">
        
        {/* Profile Attributes Subsection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 group-focus-within:text-[#FE8204] transition-colors">
              First Name
            </label>
            <input 
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full h-14 px-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] transition-all shadow-inner placeholder:text-zinc-600"
              required
            />
          </div>
          
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 group-focus-within:text-[#FE8204] transition-colors">
              Last Name
            </label>
            <input 
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full h-14 px-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] transition-all shadow-inner placeholder:text-zinc-600"
              required
            />
          </div>
        </div>

        {/* Communication Layer Component */}
        <div className="space-y-2 group">
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 group-focus-within:text-[#FE8204] transition-colors">
            Email Address
          </label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full h-14 px-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] transition-all shadow-inner placeholder:text-zinc-600"
            required
          />
        </div>

        {/* Security Parameters Boundary */}
        <div className="pt-6 border-t border-white/5 space-y-6">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Security</h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">Maintain control over access keys linked to your profile</p>
          </div>
          
          <div className="space-y-2 group">
            <label className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500 ml-1 group-focus-within:text-[#FE8204] transition-colors">
              New Password (leave blank to keep current)
            </label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
              className="w-full h-14 px-5 bg-zinc-900/50 border border-white/5 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] transition-all shadow-inner placeholder:text-zinc-600"
            />
          </div>
        </div>

        {/* Core Submission Interface */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full sm:w-auto inline-flex items-center justify-center h-12 gap-2.5 px-8 bg-[#FE8204] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#ff952b] hover:shadow-[0_0_20px_rgba(254,130,4,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 shadow-lg"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}