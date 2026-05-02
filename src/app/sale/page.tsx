'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Components
import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
import { getProducts, getCollectionProducts, getMenu, FormattedProduct } from '@/src/lib/shopify'; 
import { ProductCard } from '@/src/components/shared/ProductLayout';
import SharedHeroBanner from '@/src/components/layout/SharedHeroBanner';

export default function SalePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [itemsPerPage] = useState(12);

  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null as string | null });
  const [bannerImage, setBannerImage] = useState<string>('/assets/images/SaleBanner.png');
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

  // 2. FETCH ALL DYNAMIC DATA
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

  // 3. HYBRID PRODUCT FETCHING WITH FALLBACK LOGIC
  // 3. HYBRID PRODUCT FETCHING WITH FALLBACK LOGIC
  const fetchProducts = useCallback(async (cursor: string | null = null) => {
    if (cursor) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const hasFilters = 
        activeFilters.collections.length > 0 ||
        activeFilters.styles.length > 0 || 
        activeFilters.sizes.length > 0 || 
        activeFilters.placements.length > 0;

      let result;

      if (!hasFilters) {
        // SCENARIO A: Strict 'Sale' Collection Fetch
        result = await getCollectionProducts({
          handle: 'sale', 
          first: itemsPerPage,
          after: cursor || undefined
        });
       // console.log("Fetched collection products for 'sale' high ", result.collectionImage);
        // UPDATE BANNER IMAGE IF IT EXISTS
        if (!cursor && result.collectionImage?.url) {
          setBannerImage(result.collectionImage.url);
        } else if (!cursor && !result.collectionImage?.url) {
          // Fallback if the collection has no specific image
          setBannerImage('/assets/images/SaleBanner.png'); 
        }

        // 🚨 FALLBACK: If 'sale' is empty or doesn't exist, fetch general products
        if (result.formattedData.length === 0 && !cursor) {
            console.warn("Sale collection is empty. Falling back to all products.");
            result = await getProducts({ first: itemsPerPage });
        }

      } else {
        // SCENARIO B: Filtered Search Query within 'Sale'
        const queryParts = [`collection:'sale'`];
        const buildGroup = (items: string[]) => items.map(i => `(tag:'${i}' OR "${i}")`).join(' OR ');

        // If a collection is selected, intersect it with the sale query
        if (activeFilters.collections.length > 0) {
            const selectedCol = activeFilters.collections[0];
            const handle = collectionMap[selectedCol];
            if (handle) {
                queryParts.push(`(tag:'${handle}' OR tag:'${selectedCol}' OR "${handle}")`);
            }
        }

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

        // 🚨 FALLBACK: If the filtered sale query returns nothing, try fetching just the filters without the 'sale' restriction
        if (result.formattedData.length === 0 && !cursor) {
            console.warn("Filtered sale query is empty. Falling back to general filtered products.");
            const fallbackQuery = queryParts.filter(part => part !== `collection:'sale'`).join(' AND ');
            result = await getProducts({
                query: fallbackQuery || undefined,
                first: itemsPerPage
            });
        }
      }

      //console.log("Fetched products: in sale", result.formattedData);
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
  // const fetchProducts = useCallback(async (cursor: string | null = null) => {
  //   if (cursor) setIsLoadingMore(true);
  //   else setIsLoading(true);

  //   try {
  //     const hasFilters = 
  //       activeFilters.collections.length > 0 ||
  //       activeFilters.styles.length > 0 || 
  //       activeFilters.sizes.length > 0 || 
  //       activeFilters.placements.length > 0;

  //     let result;

  //     if (!hasFilters) {
  //       // SCENARIO A: Strict 'Sale' Collection Fetch
  //       result = await getCollectionProducts({
  //         handle: 'sale', 
  //         first: itemsPerPage,
  //         after: cursor || undefined
  //       });

  //       // 🚨 FALLBACK: If 'sale' is empty or doesn't exist, fetch general products
  //       if (result.formattedData.length === 0 && !cursor) {
  //           console.warn("Sale collection is empty. Falling back to all products.");
  //           result = await getProducts({ first: itemsPerPage });
  //       }

  //     } else {
  //       // SCENARIO B: Filtered Search Query within 'Sale'
  //       const queryParts = [`collection:'sale'`];
  //       const buildGroup = (items: string[]) => items.map(i => `(tag:'${i}' OR "${i}")`).join(' OR ');

  //       // If a collection is selected, intersect it with the sale query
  //       if (activeFilters.collections.length > 0) {
  //           const selectedCol = activeFilters.collections[0];
  //           const handle = collectionMap[selectedCol];
  //           if (handle) {
  //               queryParts.push(`(tag:'${handle}' OR tag:'${selectedCol}' OR "${handle}")`);
  //           }
  //       }

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

  //       // 🚨 FALLBACK: If the filtered sale query returns nothing, try fetching just the filters without the 'sale' restriction
  //       if (result.formattedData.length === 0 && !cursor) {
  //           console.warn("Filtered sale query is empty. Falling back to general filtered products.");
  //           const fallbackQuery = queryParts.filter(part => part !== `collection:'sale'`).join(' AND ');
  //           result = await getProducts({
  //               query: fallbackQuery || undefined,
  //               first: itemsPerPage
  //           });
  //       }
  //     }

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
      // Collections should behave like radio buttons
      if (group === 'collections') {
        const isSelected = prev.collections.includes(value);
        return { ...prev, collections: isSelected ? [] : [value] };
      }

      // Everything else allows multi-select
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
    <div className="bg-white min-h-screen mt-18 md:mt-0 pb-20">
      
      {/* PREMIUM HERO BANNER */}
      <SharedHeroBanner
        // image="/assets/images/SaleBanner.png" 
        // mobileImage="/assets/images/SaleMobileBackground.png" 
        image={bannerImage} 
        mobileImage={bannerImage} 
        title="FLASH SALE"
        textColor="#FF3366" 
      />

      {/* MAIN CONTENT AREA */}
      <div className="container max-w-[1400px] mx-auto px-4 mt-12 md:mt-20">
        
        {/* Desktop Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setFilterDrawerOpen(true)} 
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-[#FF3366] transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
            <p className="hidden lg:block text-sm font-bold text-gray-400 uppercase tracking-widest">
              {isLoading ? 'Loading...' : `${products.length} Products Found`}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setViewMode('grid')} 
              className={clsx("p-2 rounded-xl transition-all", viewMode === 'grid' ? "bg-gray-100 text-[#FF3366]" : "text-gray-400 hover:text-gray-900")}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')} 
              className={clsx("p-2 rounded-xl transition-all", viewMode === 'list' ? "bg-gray-100 text-[#FF3366]" : "text-gray-400 hover:text-gray-900")}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-[260px] shrink-0 sticky top-32 h-fit">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[13px] font-black uppercase tracking-widest text-gray-900">Filters</h2>
              {activeFiltersCount > 0 && (
                <button onClick={() => handleToggleFilter('RESET')} className="text-[10px] font-bold uppercase tracking-widest text-[#FF3366] hover:underline">
                  Clear All
                </button>
              )}
            </div>
            <FilterSidebar 
              filters={dynamicFilters} 
              activeFilters={activeFilters} 
              onToggle={handleToggleFilter} 
            />
          </div>

          {/* PRODUCT GRID */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="w-full py-32 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-[#FF3366] mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Sale Items...</p>
              </div>
            ) : (!isLoading && products.length > 0) ? (
              <div className="flex flex-col items-center">
                <div className={clsx(
                  "w-full p-4 sm:p-6 lg:p-8 rounded-3xl border bg-black border-zinc-800 shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]",
                  "grid gap-6 sm:gap-8",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((item, index) => (
                    <ProductCard 
                      key={`${item.id}-${index}`} 
                      item={item} 
                      viewMode={viewMode} 
                      page="sale" 
                      index={index} 
                    />
                  ))}
                </div>

                {pageInfo.hasNextPage && (
                   <div className="mt-12">
                     <button
                        onClick={() => fetchProducts(pageInfo.endCursor)}
                        disabled={isLoadingMore}
                        className="px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                     >
                        {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoadingMore ? 'Loading...' : 'Show More'}
                     </button>
                   </div>
                )}
              </div>
            ) : (!isLoading && products.length === 0) ? (
              <div className="py-24 text-center bg-gray-50/50 border border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <RefreshCcw className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-bold text-lg mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting them to see more results.</p>
                <button 
                  onClick={() => handleToggleFilter('RESET')} 
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-[#FF3366] transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setFilterDrawerOpen(false)} 
          />
          <div className="relative w-[85%] max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Filters</h2>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-2 bg-gray-50 text-gray-500 hover:text-gray-900 rounded-full transition-colors">
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              <FilterSidebar 
                filters={dynamicFilters} 
                activeFilters={activeFilters} 
                onToggle={handleToggleFilter} 
              />
            </div>
            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
              <button 
                onClick={() => handleToggleFilter('RESET')}
                className="flex-1 py-4 border border-gray-200 text-gray-900 text-[13px] font-black uppercase tracking-widest rounded-xl bg-white hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button 
                onClick={() => setFilterDrawerOpen(false)}
                className="flex-[2] py-4 bg-gray-900 text-white text-[13px] font-black uppercase tracking-widest rounded-xl hover:bg-[#FF3366] shadow-xl transition-all"
              >
                Apply ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}