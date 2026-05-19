
import { useState, useEffect } from 'react';
import { Variants } from "framer-motion";

export const generateHref = (menuItem: any) => {
      if (!menuItem.url) return '#';
      
      const title = menuItem.title.toLowerCase();
      // 1. Strip the Shopify absolute domain so we only deal with relative paths
      let path = menuItem.url.replace(/^https?:\/\/[^\/]+/, '');

      // 2. FORCE CUSTOM NEXT.JS ROUTES FIRST
      // This ensures your specific page.tsx files get hit instead of generic Shopify pages
      if (title.includes('new-arrival') || path.includes('/pages/new-arrival') || title.includes('new arrival')) return '/collections/new-arrival';
      if (title === 'sale' || path.includes('/pages/sale')) return '/collections/sale';
      
      // Map the (info) route group pages based on your screenshot
      if (title.includes('about') || path.includes('/about-us')) return '/about';
      if (title.includes('faq') || title.includes('help')) return '/help';
      if (title === 'how it works' || path.includes('how-it-works')) return '/how-it-works';
      if (title.includes('contact')) return '/contact';

      // 3. HANDLE COLLECTIONS AND FILTERS
      // We only do this if it didn't match a custom route above!
      if (menuItem.type === "COLLECTION") {
        const urlParts = menuItem.url.split('/').filter(Boolean);
        const handle = urlParts[urlParts.length - 1].split('?')[0].split('#')[0];
      
        return `/collections/${handle}`;
      }
      if (menuItem.type === "COLLECTIONS" || title === "collection") {
        return "/collections";
      }

      // 4. HANDLE EMPTY DROPDOWN TRIGGERS
      if (path === '#' || path === '/#') return '#';

      // 5. DYNAMIC FALLBACK
      return path;
};

// FIX: Removed useCallback. It's now a standard arrow function.
export const getRelativeUrl = (url: string) => {
    if (!url) return "#";
    try {
      const parsed = new URL(url);
      return parsed.pathname + parsed.search;
    } catch (e) {
      return url.startsWith('/') ? url : `/${url}`;
    }
};

// This is perfectly fine because it's a custom hook (starts with "use")
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 400, damping: 30, mass: 0.8 },
  },
  exit: {
    opacity: 0,
    y: 5,
    scale: 0.98,
    filter: "blur(4px)",
    transition: { duration: 0.15, ease: "easeOut" },
  },
};