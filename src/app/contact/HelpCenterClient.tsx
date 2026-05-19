"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, HelpCircle, Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function HelpCenterClient({ data }: { data: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      order: formData.get("order"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(data.successMessage);
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Premium Hero Section - adjusted padding for transparent header */}
      <div className="relative bg-zinc-950 pt-32 pb-16 sm:pt-40 sm:pb-24 border-b border-white/5 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-[#FE8204] opacity-5 blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-lg">
            <span className="text-zinc-300 text-[10px] font-black uppercase tracking-[0.2em]">
              Support Center
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter sm:text-5xl drop-shadow-xl">
            {data.heroTitle}
          </h1>
          <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto whitespace-pre-line font-medium leading-relaxed">
            {data.heroDescription}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          
          {/* Quick Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold text-zinc-100 mb-8">{data.contactTitle}</h2>
            
            {/* Card 1 */}
            <div className="group flex items-start gap-5 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="p-3 bg-zinc-800 border border-white/5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageSquare className="w-6 h-6 text-[#FE8204]" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-lg">Live Chat</h3>
                <p className="text-sm text-zinc-400 mt-1">{data.chatText}</p>
                <button 
                  onClick={() => window.dispatchEvent(new Event('open-chat'))} 
                  className="mt-3 text-sm font-bold text-white hover:text-[#FE8204] transition-colors flex items-center gap-1"
                >
                  Start a conversation &rarr;
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="group flex items-start gap-5 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="p-3 bg-zinc-800 border border-white/5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-[#FE8204]" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-lg">Email Support</h3>
                <p className="text-sm text-zinc-400 mt-1">Drop us a line anytime</p>
                <a href={`mailto:${data.email}`} className="mt-3 text-sm font-bold text-white hover:text-[#FE8204] transition-colors block">
                  {data.email}
                </a>
              </div>
            </div>

            {/* Card 3 */}
            <div className="group flex items-start gap-5 p-6 rounded-2xl bg-zinc-900 border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className="p-3 bg-zinc-800 border border-white/5 rounded-xl shrink-0 group-hover:scale-110 transition-transform duration-300">
                <HelpCircle className="w-6 h-6 text-[#FE8204]" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 text-lg">FAQ & Policies</h3>
                <p className="text-sm text-zinc-400 mt-1">Find answers instantly</p>
                <a href="/returns" className="mt-3 text-sm font-bold text-white hover:text-[#FE8204] transition-colors flex items-center gap-1">
                  Read our policies &rarr;
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-zinc-900 border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
              {/* Subtle decorative element for the form box */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <h2 className="text-3xl font-bold text-zinc-100 mb-8 relative z-10">{data.formTitle}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold tracking-wide text-zinc-400 mb-2 uppercase">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="block w-full rounded-xl border border-white/10 bg-zinc-950/50 text-white placeholder-zinc-600 focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] sm:text-sm py-3.5 px-4 shadow-inner transition-all outline-none" 
                      placeholder="Jane Doe" 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold tracking-wide text-zinc-400 mb-2 uppercase">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="block w-full rounded-xl border border-white/10 bg-zinc-950/50 text-white placeholder-zinc-600 focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] sm:text-sm py-3.5 px-4 shadow-inner transition-all outline-none" 
                      placeholder="jane@example.com" 
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-bold tracking-wide text-zinc-400 mb-2 uppercase">
                    Order Number <span className="text-zinc-600 font-normal normal-case tracking-normal">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    id="order" 
                    name="order" 
                    className="block w-full rounded-xl border border-white/10 bg-zinc-950/50 text-white placeholder-zinc-600 focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] sm:text-sm py-3.5 px-4 shadow-inner transition-all outline-none" 
                    placeholder="#1001" 
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold tracking-wide text-zinc-400 mb-2 uppercase">How can we help?</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    required 
                    className="block w-full rounded-xl border border-white/10 bg-zinc-950/50 text-white placeholder-zinc-600 focus:border-[#FE8204] focus:ring-1 focus:ring-[#FE8204] sm:text-sm py-3.5 px-4 shadow-inner transition-all outline-none resize-none" 
                    placeholder="Briefly describe your issue..." 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-full shadow-lg text-sm font-bold uppercase tracking-widest text-black bg-white hover:bg-[#FE8204] hover:text-white hover:shadow-[#FE8204]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-[#FE8204] transition-all duration-300 disabled:opacity-70 mt-8"
                >
                  {isSubmitting ? (
                    <Loader2 className="animate-spin h-5 w-5 text-white" />
                  ) : (
                    <>
                      <span className="mr-2">Send Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}