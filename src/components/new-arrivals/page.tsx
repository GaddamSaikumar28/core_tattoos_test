'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Components
import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
import { ProductCard } from '@/src/components/shared/ProductLayout';
import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';
import { getProducts, getCollectionProducts, getMenu, FormattedProduct } from '@/src/lib/shopify'; 

export default function NewArrivalsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [itemsPerPage] = useState(12);

  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null as string | null });
  const [bannerImage, setBannerImage] = useState<string>('/assets/images/temporary_tattoos.webp');
  // 1. STATE INITIALIZATION
  const [collectionMap, setCollectionMap] = useState<Record<string, string>>({});
  
  const [dynamicFilters, setDynamicFilters] = useState<FilterOptions>({
    collections: [],
    styles: [],
    sizes: [],
    placements: []
  });

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    collections: [], 
    styles: [],
    sizes: [],
    placements: []
  });

  // 2. FETCH ALL DYNAMIC DATA (Collections, Styles, Sizes, Placements)
  useEffect(() => {
    async function loadFilterData() {
      try {
        const menuData = await getMenu('menu-custom');
        
        // --- A. Process Collections ---
        const collectionsMenu = menuData?.items?.find((item: any) => 
          item.title.toLowerCase() === 'collection' || item.title.toLowerCase() === 'collections'
        );

        const flatCategories: string[] = [];
        const urlMapping: Record<string, string> = {};
        
        const processMenuItem = (item: any) => {
          if (item.items && item.items.length > 0) {
            item.items.forEach(processMenuItem);
          } else {
            flatCategories.push(item.title);
            if (item.url) {
              const urlParts = item.url.split('/').filter(Boolean);
              const handle = urlParts[urlParts.length - 1];
              if (handle) {
                const cleanHandle = handle.split('?')[0].split('#')[0];
                urlMapping[item.title] = cleanHandle;
              }
            }
          }
        };

        if (collectionsMenu && collectionsMenu.items) {
          collectionsMenu.items.forEach(processMenuItem);
        }

        const hiddenCollections = ["Home page"];
        const validCollections = flatCategories.filter(title => !hiddenCollections.includes(title));

        // --- B. Process Secondary Filters ---
        const findMenuItems = (title: string) => {
          const section = menuData?.items?.find((item: any) => 
            item.title.toLowerCase() === title.toLowerCase() || 
            item.title.toLowerCase().includes(title.toLowerCase())
          );
          return section?.items?.map((i: any) => i.title) || [];
        };

        // Update State
        setCollectionMap(urlMapping);
        setDynamicFilters({
          collections: validCollections,
          styles: findMenuItems('styles'),
          sizes: findMenuItems('sizes'),
          placements: findMenuItems('placements')
        });

      } catch (err) {
        console.error("Failed to load filter data", err);
      }
    }
    loadFilterData();
  }, []);

  // 3. HYBRID PRODUCT FETCHING LOGIC
  // const fetchProducts = useCallback(async (cursor: string | null = null) => {
  //   if (cursor) setIsLoadingMore(true);
  //   else setIsLoading(true);

  //   try {
  //     const hasSecondaryFilters = 
  //       activeFilters.styles.length > 0 || 
  //       activeFilters.sizes.length > 0 || 
  //       activeFilters.placements.length > 0;

  //     // 🚀 LOGIC HUB: Determine Base Collection
  //     // If user selected a collection in the sidebar, use its mapped handle. 
  //     // Otherwise, default strictly to 'new-arrivals'.
  //     const selectedCollection = activeFilters.collections[0];
  //     const baseHandle = (selectedCollection && collectionMap[selectedCollection]) 
  //       ? collectionMap[selectedCollection] 
  //       : 'new-arrival';

  //     let result;

  //     if (!hasSecondaryFilters) {
  //       // SCENARIO A: Strict Collection Fetch
  //       result = await getCollectionProducts({
  //         handle: baseHandle, 
  //         first: itemsPerPage,
  //         after: cursor || undefined
  //       });
  //     } else {
  //       // SCENARIO B: Filtered Search Query within the target collection
  //       const queryParts = [`collection:'${baseHandle}'`];
  //       const buildGroup = (items: string[]) => items.map(i => `(tag:'${i}' OR "${i}")`).join(' OR ');

  //       if (activeFilters.styles.length > 0) queryParts.push(`(${buildGroup(activeFilters.styles)})`);
  //       if (activeFilters.sizes.length > 0) queryParts.push(`(${buildGroup(activeFilters.sizes)})`);
  //       if (activeFilters.placements.length > 0) queryParts.push(`(${buildGroup(activeFilters.placements)})`);

  //       result = await getProducts({
  //         query: queryParts.join(' AND '),
  //         first: itemsPerPage,
  //         after: cursor || undefined,
  //         sortKey: 'CREATED_AT',
  //         reverse: true
  //       });
  //     }
  //     console.log("Fetched Products Result: in new arrivals", result);
  //     if (cursor) {
  //       setProducts(prev => [...prev, ...result.formattedData]);
  //     } else {
  //       setProducts(result.formattedData);
  //       if (!cursor) window.scrollTo({ top: 0, behavior: 'smooth' });
  //     }
  //     setPageInfo(result.pageInfo);
  //   } catch (error) {
  //     console.error("Failed to fetch products", error);
  //     if (!cursor) setProducts([]);
  //   } finally {
  //     setIsLoading(false);
  //     setIsLoadingMore(false);
  //   }
  // }, [activeFilters, itemsPerPage, collectionMap]);
// 3. HYBRID PRODUCT FETCHING LOGIC
  const fetchProducts = useCallback(async (cursor: string | null = null) => {
    if (cursor) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const hasSecondaryFilters = 
        activeFilters.styles.length > 0 || 
        activeFilters.sizes.length > 0 || 
        activeFilters.placements.length > 0;

      const selectedCollection = activeFilters.collections[0];
      const baseHandle = (selectedCollection && collectionMap[selectedCollection]) 
        ? collectionMap[selectedCollection] 
        : 'new-arrival';

      let result;

      if (!hasSecondaryFilters) {
        // SCENARIO A: Strict Collection Fetch
        result = await getCollectionProducts({
          handle: baseHandle, 
          first: itemsPerPage,
          after: cursor || undefined
        });

        // UPDATE BANNER IMAGE IF IT EXISTS
        if (!cursor && result.collectionImage?.url) {
          setBannerImage(result.collectionImage.url);
        } else if (!cursor && !result.collectionImage?.url) {
          // Fallback if the collection has no specific image
          setBannerImage('/assets/images/temporary_tattoos.webp'); 
        }

      } else {
        // SCENARIO B: Filtered Search Query within the target collection
        const queryParts = [`collection:'${baseHandle}'`];
        const buildGroup = (items: string[]) => items.map(i => `(tag:'${i}' OR "${i}")`).join(' OR ');

        if (activeFilters.styles.length > 0) queryParts.push(`(${buildGroup(activeFilters.styles)})`);
        if (activeFilters.sizes.length > 0) queryParts.push(`(${buildGroup(activeFilters.sizes)})`);
        if (activeFilters.placements.length > 0) queryParts.push(`(${buildGroup(activeFilters.placements)})`);

        result = await getProducts({
          query: queryParts.join(' AND '),
          first: itemsPerPage,
          after: cursor || undefined,
          sortKey: 'CREATED_AT',
          reverse: true
        });
      }
      
     // console.log("Fetched Products Result: in new arrivals", result);
      
      if (cursor) {
        setProducts(prev => [...prev, ...result.formattedData]);
      } else {
        setProducts(result.formattedData);
        // REMOVED window.scrollTo HERE TO STOP THE ANNOYING SCROLL JUMP
      }
      setPageInfo(result.pageInfo);
    } catch (error) {
      console.error("Failed to fetch products", error);
      if (!cursor) setProducts([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [activeFilters, itemsPerPage, collectionMap]);

  useEffect(() => {
    fetchProducts(null);
  }, [activeFilters, fetchProducts]);

  // 4. TOGGLE LOGIC
  const handleToggleFilter = (group: keyof ActiveFilters | 'RESET', value?: string) => {
    if (group === 'RESET') {
      setActiveFilters({ collections: [], styles: [], sizes: [], placements: [] });
      return;
    }
    if (!value) return;

    setActiveFilters(prev => {
      // Collections should behave like radio buttons (only one active at a time usually)
      if (group === 'collections') {
        const isSelected = prev.collections.includes(value);
        return { ...prev, collections: isSelected ? [] : [value] };
      }

      // Checkboxes for everything else
      const current = prev[group] || [];
      const isSelected = current.includes(value);
      return {
        ...prev,
        [group]: isSelected ? current.filter(i => i !== value) : [...current, value]
      };
    });
  };

  const activeFiltersCount = 
    activeFilters.collections.length + 
    activeFilters.styles.length + 
    activeFilters.sizes.length + 
    activeFilters.placements.length;

  return (
    <div className="bg-slate-50 min-h-screen mt-20">
      <SharedHeroBanner 
        title="NEW ARRIVALS"
        image={bannerImage}
        mobileImage={bannerImage} 
        textColor="var(--color-brand-orange)"
      />

      <main className="container max-w-[1400px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-4 pr-6 border-r-2 border-slate-100">
              <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-950">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filters</span>
                {activeFiltersCount > 0 && (
                  <button onClick={() => handleToggleFilter('RESET')} className="text-[10px] font-bold text-[var(--color-brand-orange)] uppercase hover:underline">
                    Clear
                  </button>
                )}
              </div>
              <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={handleToggleFilter} />
            </div>
          </aside>

          {/* PRODUCT LISTINGS */}
          <div className="flex-grow relative min-h-[500px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">
                  {activeFilters.collections.length > 0 ? activeFilters.collections[0] : 'The Latest Drops'}
                </h2>
                {!isLoading && (
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
                    {products.length} Fresh Designs Found
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setFilterDrawerOpen(true)} 
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-xl"
                >
                  <SlidersHorizontal className="w-3 h-3" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                </button>
                <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
                  <button onClick={() => setViewMode('grid')} className={clsx("p-2 rounded-lg transition-all", viewMode === 'grid' ? "bg-slate-100 text-[var(--color-brand-orange)]" : "text-slate-400")}><LayoutGrid className="w-4 h-4" /></button>
                  <button onClick={() => setViewMode('list')} className={clsx("p-2 rounded-lg transition-all", viewMode === 'list' ? "bg-slate-100 text-[var(--color-brand-orange)]" : "text-slate-400")}><List className="w-4 h-4" /></button>
                </div>
              </div>
            </div>

            {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-10">
                  <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
               </div>
            )}

            {!isLoading && products.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className={clsx(
                  "w-full p-4 sm:p-8 rounded-[2rem] border bg-black border-zinc-800 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]",
                  "grid gap-6 sm:gap-8",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((item, idx) => (
                    <ProductCard key={item.id} item={item} viewMode={viewMode} page="new-arrivals" index={idx} />
                  ))}
                </div>

                {pageInfo.hasNextPage && (
                  <div className="mt-12">
                    <button 
                      onClick={() => fetchProducts(pageInfo.endCursor)} 
                      disabled={isLoadingMore} 
                      className="px-10 py-4 border-2 border-slate-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-3"
                    >
                      {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isLoadingMore ? 'Loading...' : 'Show More'}
                    </button>
                  </div>
                )}
              </div>
            ) : !isLoading && (
              <div className="py-24 text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCcw className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-black text-slate-900 uppercase tracking-widest">No matching designs</p>
                <button onClick={() => handleToggleFilter('RESET')} className="mt-4 text-[var(--color-brand-orange)] text-[10px] font-black uppercase tracking-widest hover:underline">
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE DRAWER */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end lg:hidden">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setFilterDrawerOpen(false)} />
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center p-6 border-b-2 border-slate-100">
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Filters</h2>
               <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                 <X className="w-5 h-5" />
               </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={handleToggleFilter} />
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50">
               <button 
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl"
               >
                 Apply Filters
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}