"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader2, ArrowRight } from "lucide-react";

// Adjust these import paths based on your actual file structure
import { SearchResult } from "./header.types";
import { searchShopifyProducts } from "@/src/lib/shopify";
import { useDebounce } from "./header.util";

interface SearchOverlayProps {
  isSearchOpen: boolean;
  closeSearch: () => void;
}

export default function SearchOverlay({ isSearchOpen, closeSearch }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 400);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let isActive = true;

    const performSearch = async () => {
      const cleanQuery = debouncedSearchQuery.trim();
      if (!cleanQuery) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchShopifyProducts(debouncedSearchQuery);
        if (isActive) {
          setSearchResults(results || []);
        }
      } catch (error) {
        console.error("Search failed", error);
        if (isActive) {
          setSearchResults([]);
        }
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    };

    performSearch();

    return () => {
      isActive = false;
    };
  }, [debouncedSearchQuery]);

  // Clear search query when the overlay is closed
  useEffect(() => {
    if (!isSearchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          {/* Premium Dark Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={closeSearch}
            className="fixed inset-0 bg-black/60 z-[80] backdrop-blur-md"
          />

          {/* Sleek Search Drawer */}
          <motion.div
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
            className="fixed top-0 left-0 w-full bg-[#0A0A0A]/95 backdrop-blur-3xl border-b border-white/5 shadow-2xl z-[90] pb-8 pt-4 sm:pt-8"
          >
            {/* Close Button */}
            <button
              onClick={closeSearch}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 p-2.5 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all z-[100] flex items-center justify-center group"
              aria-label="Close search drawer"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" strokeWidth={1.5} />
            </button>

            <div className="max-w-[800px] mx-auto px-6 pt-12 sm:pt-4 relative">
              {/* Premium Search Input Area */}
              <div className="relative flex items-center w-full group">
                {isSearching ? (
                  <Loader2 className="absolute left-6 w-5 h-5 text-[#FF5A24] animate-spin" strokeWidth={2} />
                ) : (
                  <Search className="absolute left-6 w-5 h-5 text-white/40 group-focus-within:text-[#FF5A24] transition-colors" strokeWidth={2} />
                )}

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, collections, or styles..."
                  className="w-full pl-16 pr-14 py-4 sm:py-5 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-[#FF5A24]/50 focus:bg-white/10 focus:shadow-[0_0_30px_rgba(255,90,36,0.1)] text-white transition-all text-[16px] sm:text-[18px] font-medium placeholder:text-white/30"
                  autoFocus
                />

                {/* Clear Input Button */}
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-5 p-1.5 text-white/40 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Clear search text"
                    >
                      <X className="w-4 h-4" strokeWidth={2} />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="absolute top-[calc(100%+16px)] left-4 right-4 sm:left-0 sm:right-0 bg-[#0A0A0A]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden z-[100]"
                  >
                    {isSearching ? (
                      <div className="p-12 flex flex-col items-center justify-center text-center">
                        <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#FF5A24]" />
                        <p className="text-[14px] font-medium text-white/50">Searching...</p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="flex flex-col max-h-[60vh] overflow-y-auto custom-scrollbar pr-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#333] [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#444]">
                        
                        <div className="px-6 py-4 border-b border-white/5 bg-black/40 sticky top-0 z-10 backdrop-blur-md flex justify-between items-center">
                          <span className="text-[13px] font-medium text-white/50 uppercase tracking-wider">
                            Top Results ({searchResults.length})
                          </span>
                        </div>

                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.handle}`}
                            onClick={closeSearch}
                            className="flex items-center gap-5 p-4 mx-2 my-1 hover:bg-white/5 rounded-xl transition-all group"
                          >
                            <div className="w-16 h-16 min-w-[64px] relative bg-[#1A1A1A] rounded-xl overflow-hidden shrink-0 border border-white/5 group-hover:border-white/20 transition-colors">
                              <Image
                                src={product.image}
                                alt={product.title}
                                fill
                                sizes="64px"
                                className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-center">
                              <h4 className="text-[15px] font-medium text-white/90 group-hover:text-white transition-colors line-clamp-1">
                                {product.title}
                              </h4>
                              {product.category && (
                                <span className="text-[13px] text-white/40 font-normal mt-0.5">
                                  {product.category}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 pl-4 border-l border-white/5">
                              <div className="text-[15px] font-semibold text-[#FF5A24]">
                                ${product.price}
                              </div>
                              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-[#FF5A24] group-hover:translate-x-1 transition-all" />
                            </div>
                          </Link>
                        ))}
                        
                        {/* View All Results Footer */}
                        <div className="p-4 border-t border-white/5 bg-black/40">
                           <Link 
                             href={`/search?q=${encodeURIComponent(searchQuery)}`}
                             onClick={closeSearch}
                             className="w-full py-3 flex items-center justify-center text-[14px] font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                           >
                              View All Results
                           </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-16 flex flex-col items-center justify-center text-center">
                        <Search className="w-12 h-12 text-white/10 mb-5" strokeWidth={1} />
                        <p className="text-[16px] font-medium text-white">
                          No matches found
                        </p>
                        <p className="text-[14px] text-white/50 mt-2 max-w-sm">
                          We couldn't find anything matching "<span className="text-white">{searchQuery}</span>". Try adjusting your keywords.
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}