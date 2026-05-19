"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/src/context/AuthContext';
import { toast } from 'sonner';

const NewsletterSection: React.FC = () => {
  const { customer, subscribeLoggedInUser, isLoading } = useAuth();
  
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Pre-fill email if user is logged in
  useEffect(() => {
    if (customer?.email) {
      setEmail(customer.email);
    }
  }, [customer]);

  // Safely check if the customer accepts marketing
  const isAlreadySubscribed = Boolean(customer?.acceptsMarketing);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);

    try {
      if (customer) {
        // --- LOGGED IN USER ---
        // Hits the Storefront API via Context to update the profile securely
        const success = await subscribeLoggedInUser();
        if (success) toast.success("Thanks for subscribing!");
      } else {
        // --- GUEST USER ---
        // Hits our secure Next.js API route to use the Admin API
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to subscribe');
        
        toast.success(data.message || 'Thanks for subscribing!');
        setEmail(''); // Clear input for guests
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent layout shift/flash while checking auth state - updated to match dark theme
  if (isLoading) return <div className="h-[400px] w-full bg-[#050505]"></div>;

  return (
    <section className="bg-[#050505] w-full py-16 md:py-24 px-4 md:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-[1312px] mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-16">
        
        {/* Left Column: Typography & Badges */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col w-full lg:w-1/2"
        >
          {/* Tag / Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#D4AF37]/30 bg-[#2A2000]/40 text-[#EBB94D] text-[10px] md:text-xs font-bold tracking-[0.15em] uppercase w-fit mb-6">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#EBB94D]">
              <path d="M12 2L13.1 9.9L21 11L13.1 12.1L12 20L10.9 12.1L3 11L10.9 9.9L12 2Z" fill="currentColor"/>
            </svg>
            Exclusive Access
          </div>

          {/* Heading */}
          <h2 className="text-5xl md:text-6xl lg:text-[72px] font-light text-white leading-[1.1] mb-6 tracking-tight">
            First to know.<br />
            First to wear.
          </h2>
          
          {/* Subheading */}
          <p className="text-sm md:text-base text-gray-400 font-normal leading-snug">
            New drops, exclusive designs, and 15% off your first order.
          </p>
        </motion.div>

        {/* Right Column: Form */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="w-full lg:w-1/2 flex flex-col lg:items-end"
        >
          <div className="w-full max-w-[600px]">
            <AnimatePresence mode="wait">
              {isAlreadySubscribed ? (
                /* --- STATE 1: ALREADY SUBSCRIBED --- */
                <motion.div 
                  key="subscribed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 bg-[#111111] px-6 py-5 rounded-[12px] border border-gray-800 shadow-sm w-full"
                >
                  <div className="h-12 w-12 rounded-full bg-[#FFC34A] flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-lg">You're all set!</p>
                    <p className="text-gray-400 text-sm">You are already subscribed to our newsletter.</p>
                  </div>
                </motion.div>
              ) : (
                /* --- STATE 2 & 3: FORM FOR GUESTS & UNSUBSCRIBED USERS --- */
                <motion.form 
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubscribe} 
                  className="flex flex-col gap-3 w-full"
                >
                  <div className="flex flex-col sm:flex-row w-full rounded-[10px] sm:rounded-[14px] overflow-hidden bg-[#111111] border border-gray-800 transition-colors focus-within:border-gray-600">
                    
                    <div className="relative flex-1 flex items-center">
                      {/* Mail Icon */}
                      <svg className="absolute left-5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                        readOnly={!!customer} // Lock input if logged in
                        placeholder="Enter your email address" 
                        required
                        className={`w-full h-[56px] md:h-[64px] bg-transparent pl-12 pr-4 text-sm md:text-base text-white outline-none placeholder:text-gray-600 ${
                          customer ? 'text-gray-500 cursor-not-allowed' : ''
                        }`}
                      />
                      
                      {customer && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-600 uppercase tracking-widest hidden sm:block">
                          Account Email
                        </span>
                      )}
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="h-[56px] md:h-[64px] px-8 bg-[#FFC34A] text-black font-medium text-sm md:text-base hover:bg-[#eab03e] transition-colors duration-300 shrink-0 flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : (
                        <>
                          Subscribe
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] md:text-xs text-gray-600 pl-1">
                    No spam, ever. Unsubscribe anytime. We respect your privacy.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
      </div>
    </section>
  );
};

export default NewsletterSection;