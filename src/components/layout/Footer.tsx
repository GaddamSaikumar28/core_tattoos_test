"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner"; // Added sonner for toast notifications

// --- Props Interface ---
interface FooterProps {
  logoUrl: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
}

// --- Data Structures ---
const FOOTER_LINKS = [
  {
    title: "Shop",
    links: [
      { name: "Tattoos", href: "/collections" },
      { name: "New Arrival", href: "/new-arrivals" },
      { name: "Sale", href: "/sale" },
    ],
  },
  {
    title: "About",
    links: [
      { name: "About us", href: "/about" },
      { name: "How it works", href: "/how-it-works" },
      { name: "Contact us", href: "/contact" },
      { name: "Blogs", href: "/blogs" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { name: "Tracking", href: "/tracking" },
      { name: "Shipping", href: "/shipping" },
      { name: "Help & FAQ", href: "/faq" },
      { name: "Returns", href: "/returns" },
    ],
  },
];

const PAYMENT_METHODS = [
  { name: "Visa", src: "/assets/icons/payments/visa.svg" },
  { name: "Mastercard", src: "/assets/icons/payments/master-card.svg" },
  { name: "PayPal", src: "/assets/icons/payments/paypal.svg" },
  { name: "Apple Pay", src: "/assets/icons/payments/apple-pay.svg" },
  { name: "Google Pay", src: "/assets/icons/payments/google-pay.svg" },
  { name: "AMEX", src: "/assets/icons/payments/amex.svg" },
  { name: "Discouver", src: "/assets/icons/payments/discover.svg" },
];

export default function Footer({ logoUrl, socialLinks }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Subscription Logic & State ---
  const { customer, subscribeLoggedInUser } = useAuth();
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
        const success = await subscribeLoggedInUser();
        if (success) toast.success("Thanks for subscribing!");
      } else {
        // --- GUEST USER ---
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

  const SOCIAL_ICONS = [
    { name: "Instagram", href: socialLinks.instagram, path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
    { name: "Twitter", href: socialLinks.twitter, path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" },
    { name: "Facebook", href: socialLinks.facebook, path: "M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" },
    { name: "YouTube", href: socialLinks.youtube, path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  ];

  return (
    <footer className="relative w-full bg-[var(--color-secondary)] text-[var(--color-white)] pt-20 pb-6 overflow-hidden selection:bg-[var(--color-brand-orange)] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 relative z-10">
        
        {/* TOP SECTION: Newsletter & Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 mb-24"
        >
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
                JOIN <span className="text-[var(--color-brand-orange)]">US.</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                Subscribe for exclusive drops, early access to new collections, and the latest in temporary tattoo artistry.
              </p>
            </div>
            
            {/* Conditional Rendering for Newsletter State */}
            {isAlreadySubscribed ? (
              <div className="flex items-center gap-4 bg-white/5 px-5 py-3.5 rounded-2xl max-w-md border border-white/10 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-[var(--color-brand-orange)] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-base">You're all set!</p>
                  <p className="text-gray-400 text-sm">Already subscribed to our newsletter.</p>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleSubscribe} 
                className="relative max-w-md flex items-center"
                aria-label="Newsletter Subscription"
              >
                <input 
                  type="email" 
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  readOnly={!!customer} // Lock input if logged in
                  placeholder="Enter your email" 
                  className={`w-full bg-white/5 border border-white/10 rounded-full py-4 pl-6 pr-14 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-brand-orange)] focus:ring-1 focus:ring-[var(--color-brand-orange)] transition-all ${
                    customer ? 'text-gray-400 cursor-not-allowed' : ''
                  }`}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  aria-label="Subscribe"
                  className="absolute right-2 p-2.5 bg-[var(--color-brand-orange)] text-white rounded-full hover:bg-white hover:text-[var(--color-secondary)] transition-colors duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-5 h-5" />
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Navigation Columns */}
          <nav 
            className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12"
            aria-label="Footer Navigation"
          >
            {FOOTER_LINKS.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h3 className="text-[var(--color-white)] text-sm md:text-base font-bold uppercase tracking-widest mb-6">
                  {section.title}
                </h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="group relative text-gray-400 hover:text-white text-sm md:text-base transition-colors duration-300 w-fit block"
                      >
                        {link.name}
                        {/* High-end CSS Underline Effect */}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[var(--color-brand-orange)] transition-all duration-300 ease-out group-hover:w-full"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </motion.div>

        {/* MIDDLE SECTION: Logo & Payment Methods */}
        <div className="py-10 flex flex-col items-center justify-center border-b border-white/10 gap-8">
          <div className="flex flex-col items-center gap-3">
            {/* Dynamic Logo with Brand Color Filter */}
            <Image 
                src={logoUrl} 
                alt="Core Tattoos Logo" 
                width={160} 
                height={50} 
                className="opacity-100"
                style={{ filter: "invert(58%) sepia(85%) saturate(1835%) hue-rotate(359deg) brightness(101%) contrast(106%)" }}
            />
            <span className="text-[10px] text-center uppercase tracking-[0.4em] text-gray-500">
                Premium Temporary Art
            </span>
          </div>

         
          <div className="flex bg-white rounded-2xl border border-gray-100 p-4 flex-wrap justify-center items-center gap-4 md:gap-6 shadow-sm">
            {PAYMENT_METHODS.map((payment) => (
              <div 
                key={payment.name} 
                className="flex items-center justify-center transition-transform hover:scale-110 duration-300"
                title={`Pay with ${payment.name}`}
              >
                <Image 
                  src={payment.src} 
                  alt={payment.name} 
                  width={64}  
                  height={40}
                  className="w-auto h-7 md:h-8 object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION: Legal & Utilities */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 relative z-20">
          
          {/* Dynamic Social Icons */}
          <div className="flex items-center gap-4">
            {SOCIAL_ICONS.map((social) => (
              <a 
                key={social.name}
                href={social.href} 
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow us on ${social.name}`}
                className="group p-2 rounded-full border border-white/10 bg-white/5 hover:bg-[var(--color-brand-orange)] hover:border-[var(--color-brand-orange)] hover:-translate-y-1 transition-all duration-300"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-4 h-4 fill-gray-400 group-hover:fill-white transition-colors duration-300"
                  aria-hidden="true"
                >
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>

          {/* Copyright & Links */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-[12px] text-gray-500">
            <p>© {new Date().getFullYear()} Core Tattoos. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link>
              <Link href="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link>
            </div>
          </div>

          {/* Scroll to Top FAB */}
          <button 
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-[var(--color-brand-orange)] hover:border-[var(--color-brand-orange)] transition-all duration-300"
          >
            <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>
      </div>

      {/* BACKGROUND BRAND WATERMARK */}
      <div className="absolute bottom-[-10%] left-0 w-full overflow-hidden flex justify-center pointer-events-none select-none z-0 opacity-[0.03]">
        <span className="font-black text-[13vw] leading-none whitespace-nowrap text-white">
          JUST TATTOOS
        </span>
      </div>
    </footer>
  );
}