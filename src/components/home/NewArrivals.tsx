'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Components
import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
import { ProductCard } from '@/src/components/shared/ProductLayout';
import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';
import { getProducts, getCollectionProducts, FormattedProduct } from '@/src/lib/shopify'; 

const STATIC_FILTER_OPTIONS = {
  styles: ['Traditional', 'Fine Line', 'Blackwork', 'Geometric', 'Dotwork', 'Japanese', 'Realism', 'Minimalist'],
  sizes: ['Tiny (1x1)', 'Small (2x2)', 'Medium (4x4)', 'Large (6x8)', 'Sleeve (10x6)'],
  placements: ['Forearm', 'Calf', 'Chest', 'Neck', 'Wrist', 'Spine', 'Any']
};

export default function NewArrivalsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [itemsPerPage] = useState(12);

  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null as string | null });

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    collections: [], 
    styles: [],
    sizes: [],
    placements: []
  });

  const [availableFilters] = useState<FilterOptions>({
    collections: [], 
    styles: STATIC_FILTER_OPTIONS.styles,
    sizes: STATIC_FILTER_OPTIONS.sizes,
    placements: STATIC_FILTER_OPTIONS.placements
  });

  const fetchProducts = useCallback(async (cursor?: string | null, isLoadMore = false) => {
    if (isLoadMore) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      // 🚀 NEW LOGIC: Check if we have sidebar filters active
      const hasActiveFilters = 
        activeFilters.styles.length > 0 || 
        activeFilters.sizes.length > 0 || 
        activeFilters.placements.length > 0;

      let result;

      if (!hasActiveFilters) {
        // 1. PURE COLLECTION MODE: Fetch exactly what's in the 'new-arrivals' collection
        // This solves the issue of getting random products that just have "new" in the title
        result = await getCollectionProducts({
          handle: 'new-arrivals',
          first: itemsPerPage,
          after: cursor ?? undefined
        });
      } else {
        // 2. FILTERED MODE: Use the search query to combine collection + tags
        let queryParts = [`collection:'new-arrivals'`]; 

        if (activeFilters.styles.length > 0) {
          queryParts.push(`(${activeFilters.styles.map(s => `tag:'${s}'`).join(' OR ')})`);
        }
        if (activeFilters.sizes.length > 0) {
          queryParts.push(`(${activeFilters.sizes.map(s => `tag:'${s}'`).join(' OR ')})`);
        }
        if (activeFilters.placements.length > 0) {
          queryParts.push(`(${activeFilters.placements.map(p => `tag:'${p}'`).join(' OR ')})`);
        }

        result = await getProducts({ 
          first: itemsPerPage, 
          after: cursor ?? undefined,
          query: queryParts.join(' AND '),
          sortKey: 'CREATED_AT',
          reverse: true 
        });
      }

      if (isLoadMore) {
        setProducts(prev => [...prev, ...result.formattedData]);
      } else {
        setProducts(result.formattedData);
        if (!isLoadMore) window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setPageInfo(result.pageInfo);

    } catch (error) {
      console.error("Failed to fetch new arrivals:", error);
      if (!isLoadMore) setProducts([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [itemsPerPage, activeFilters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleToggleFilter = (category: keyof FilterOptions | 'RESET', value?: string) => {
    if (category === 'RESET') {
      setActiveFilters({ collections: [], styles: [], sizes: [], placements: [] });
      return;
    }
    if (!value) return;

    setActiveFilters(prev => {
      const current = prev[category as keyof ActiveFilters];
      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && pageInfo.endCursor) {
      fetchProducts(pageInfo.endCursor, true);
    }
  };

  const activeFiltersCount = 
    activeFilters.styles.length + 
    activeFilters.sizes.length + 
    activeFilters.placements.length;

  return (
    <div className="bg-slate-50 min-h-screen mt-20 md:mt-20 pb-20">
      
      <SharedHeroBanner 
        title="NEW ARRIVALS"
        image="/assets/images/temporary_tattoos.webp"
        mobileImage="/assets/images/temporary_tattoos.webp"
        useMobileImage={true}
        textColor="var(--color-brand-orange)"
      />

      <main className="container max-w-[1400px] mx-auto px-4 mt-12 md:mt-20">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
              The Latest Drops
            </h1>
            {!isLoading && (
              <p className="text-sm font-medium text-gray-500 mt-2">
                Showing <span className="text-gray-900 font-bold">{products.length}</span> Results
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilterDrawerOpen(true)} 
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-slate-200 text-slate-950 text-sm font-bold rounded-xl hover:border-slate-950 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            <div className="flex items-center gap-1 bg-gray-100/50 border border-gray-200 p-1 rounded-xl">
              <button 
                onClick={() => setViewMode('grid')} 
                className={clsx("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-[var(--color-brand-orange)] shadow-sm" : "text-gray-400 hover:text-gray-800")}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setViewMode('list')} 
                className={clsx("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-[var(--color-brand-orange)] shadow-sm" : "text-gray-400 hover:text-gray-800")}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-4 pr-6 border-r-2 border-slate-100">
               <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-950">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-950">
                  Filters
                </span>
                {activeFiltersCount > 0 && (
                  <button onClick={() => handleToggleFilter('RESET')} className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-brand-orange)] hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <FilterSidebar filters={availableFilters} activeFilters={activeFilters} onToggle={handleToggleFilter} />
            </div>
          </aside>

          {/* PRODUCT LISTINGS */}
          <div className="flex-grow relative min-h-[500px]">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-10 rounded-3xl">
                <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
              </div>
            ) : products.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className={clsx(
                  "w-full p-4 sm:p-6 lg:p-8 rounded-3xl border border-gray-100 bg-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]",
                  "grid gap-6 sm:gap-8",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((product, index) => (
                    <ProductCard 
                      key={`${product.id}-${index}`} 
                      item={product} 
                      viewMode={viewMode} 
                      page="new-arrivals" 
                      index={index} 
                    />
                  ))}
                </div>

                {pageInfo.hasNextPage && (
                   <div className="mt-12">
                     <button 
                       onClick={handleLoadMore}
                       disabled={isLoadingMore}
                       className="px-10 py-4 rounded-xl text-sm font-bold uppercase tracking-widest text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                     >
                        {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoadingMore ? 'Loading...' : 'Show More'}
                     </button>
                   </div>
                )}
              </div>
            ) : (
              <div className="py-24 text-center bg-gray-50/50 border border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <RefreshCcw className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-bold text-lg mb-2">No products found</p>
                <button 
                  onClick={() => handleToggleFilter('RESET')} 
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-brand-orange)] transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE DRAWER (Reuse layout from Shop All) */}
      {isFilterDrawerOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm lg:hidden" onClick={() => setFilterDrawerOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl lg:hidden border-l-2 border-slate-950 flex flex-col">
            <div className="p-6 flex items-center justify-between border-b-2 border-slate-100 shrink-0">
              <h2 className="text-[12px] font-black uppercase tracking-[0.2em]">Filters</h2>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <FilterSidebar filters={availableFilters} activeFilters={activeFilters} onToggle={handleToggleFilter} />
            </div>
            <div className="p-6 border-t-2 border-slate-100 bg-slate-50 flex flex-col gap-3">
               <button 
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-[var(--color-brand-orange)] transition-colors shadow-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}