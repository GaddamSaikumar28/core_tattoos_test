'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
import clsx from 'clsx';

import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
import { ProductCard } from '@/src/components/shared/ProductLayout';
import { getProducts, getMenu, FormattedProduct, getCollectionProducts } from '@/src/lib/shopify'; 

function ShopAllContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null as string | null });
  
  // 1. DYNAMIC FILTERS STATE
  const [dynamicFilters, setDynamicFilters] = useState<FilterOptions>({
    collections: [],
    styles: [],
    sizes: [],
    placements: []
  });

  // 🚀 FIX: State to secretly map "UI Titles" to "URL Handles" for the query
  const [collectionMap, setCollectionMap] = useState<Record<string, string>>({});

  const categoryFromUrl = searchParams.get('category');

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    collections: categoryFromUrl && categoryFromUrl !== 'Shop All' ? [categoryFromUrl] : [],
    styles: [],
    sizes: [],
    placements: []
  });

  // 2. FETCH ALL DYNAMIC DATA ON MOUNT
  useEffect(() => {
    async function loadFilterData() {
      try {
        const menuData = await getMenu('menu-custom');
        
        const collectionsMenu = menuData?.items?.find((item: any) => 
          item.title.toLowerCase() === 'collection' || item.title.toLowerCase() === 'collections'
        );

        const flatCategories: string[] = [];
        const urlMapping: Record<string, string> = {};
        
        // 🚀 FIX: Extract the deep sub-items AND map their title to their URL Handle
        const processMenuItem = (item: any) => {
          if (item.items && item.items.length > 0) {
            item.items.forEach(processMenuItem);
          } else {
            flatCategories.push(item.title);
            
            // Extract the handle from the URL (e.g. ".../collections/spine" -> "spine")
            if (item.url) {
              const urlParts = item.url.split('/').filter(Boolean);
              const handle = urlParts[urlParts.length - 1];
              if (handle) {
                // Clean off any accidental query params or hashes
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

        setCollectionMap(urlMapping); // Save the mapping for the query builder
        setDynamicFilters({
          collections: validCollections,
          styles: [], 
          sizes: [],  
          placements: [] 
        });

      } catch (err) {
        console.error("Failed to load filter data", err);
      }
    }
    loadFilterData();
  }, []);

  // Screen resize handler for pagination
  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 1024 ? 9 : 12);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  const buildShopifyQuery = useCallback(() => {
    const queryParts: string[] = [];
    
    const buildQueryGroup = (items: string[]) => {
      return items.map(item => `(tag:'${item}' OR "${item}")`).join(' OR ');
    };

    // 🚀 FIX: Build collection query using BOTH the Title and the URL Handle!
    if (activeFilters.collections.length > 0) {
      const collectionQueries = activeFilters.collections.map(item => {
        const handle = collectionMap[item];
        
        if (handle) {
          // If the menu title is "Bharath" but the URL handle is "nature",
          // This will brilliantly search for BOTH to guarantee we get the products
          return `(tag:'${handle}' OR tag:'${item}' OR "${handle}" OR "${item}")`;
        }
        
        return `(tag:'${item}' OR "${item}")`;
      }).join(' OR ');
      
      queryParts.push(`(${collectionQueries})`);
    }
    
    if (activeFilters.styles?.length > 0) {
      queryParts.push(`(${buildQueryGroup(activeFilters.styles)})`);
    }

    if (activeFilters.placements?.length > 0) {
      queryParts.push(`(${buildQueryGroup(activeFilters.placements)})`);
    }

    if (activeFilters.sizes?.length > 0) {
      queryParts.push(`(${buildQueryGroup(activeFilters.sizes)})`);
    }
    
    if (queryParts.length === 0) {
      return undefined;
    }
    
    console.log("Generated Shopify Query:", queryParts.join(' AND ')); // Debug log to verify the generated query
    return queryParts.join(' AND ');

  }, [activeFilters, collectionMap]); // <-- Added collectionMap as a dependency
const fetchProducts = useCallback(async (cursor: string | null = null) => {
  if (cursor) setIsLoadingMore(true);
  else setIsLoading(true);

  try {
    const selectedCollection = activeFilters.collections[0];
    const handle = collectionMap[selectedCollection];
    
    // 1. Check if we are in "Shop All" mode (no collection selected)
    const isShopAll = activeFilters.collections.length === 0;

    // 2. Check if we are in "Pure Collection" mode (one collection, no secondary filters)
    const isPureCollection = 
      activeFilters.collections.length === 1 && 
      activeFilters.styles.length === 0 && 
      activeFilters.sizes.length === 0 &&
      activeFilters.placements.length === 0;

    let result;

  
    if (!isShopAll && isPureCollection && handle) {
      //console.log(`Fetching strictly from collection: ${handle}`);
      result = await getCollectionProducts({
        handle: handle,
        first: itemsPerPage,
        after: cursor || undefined
      });
    } else {
     // console.log("Fetching via general search query (Shop All or Filtered)");
      const queryStr = buildShopifyQuery();
      result = await getProducts({
        query: queryStr,
        first: itemsPerPage,
        after: cursor || undefined
      });
    }

    if (cursor) {
      setProducts(prev => [...prev, ...result.formattedData]);
    } else {
      setProducts(result.formattedData);
      // Only scroll to top on fresh filter/category changes, not "Show More"
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setPageInfo(result.pageInfo);
  } catch (error) {
    console.error("Failed to fetch products", error);
  } finally {
    setIsLoading(false);
    setIsLoadingMore(false);
  }
}, [buildShopifyQuery, itemsPerPage, activeFilters, collectionMap]);
  
  useEffect(() => {
    fetchProducts(null);
  }, [activeFilters, fetchProducts]);

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && !isLoadingMore) {
      fetchProducts(pageInfo.endCursor);
    }
  };

  const handleCategoryPillClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'Shop All') {
      params.delete('category');
      setActiveFilters(prev => ({ ...prev, collections: [] }));
    } else {
      params.set('category', cat);
      setActiveFilters(prev => ({ ...prev, collections: [cat] }));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleFilter = (group: keyof ActiveFilters | 'RESET', value?: string) => {
    if (group === 'RESET') {
      setActiveFilters({ collections: [], styles: [], sizes: [], placements: [] });
      router.push(pathname, { scroll: false });
      return;
    }
    if (!value) return;

    setActiveFilters(prev => {
      const currentGroup = prev[group as keyof ActiveFilters] || [];
      const isSelected = currentGroup.includes(value);
      return {
        ...prev,
        [group]: isSelected 
          ? currentGroup.filter((item: string) => item !== value) 
          : [...currentGroup, value]
      };
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-950 selection:bg-slate-900 selection:text-white mt-20 md:mt-20">
      
      {/* MOBILE DRAWER */}
      <div className={clsx(
        "fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden",
        isFilterDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setFilterDrawerOpen(false)} />
      
      <div className={clsx(
        "fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl transition-transform duration-500 lg:hidden border-l-2 border-slate-950",
        isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-100 shrink-0">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em]">Filters</h2>
            <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
            <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>
        </div>
      </div>

      <nav className="sticky top-0 z-40 bg-white mt-5 border-b-2 border-slate-100">
        <div className="container max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => handleCategoryPillClick('Shop All')}
              className={clsx(
                "px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 rounded-md",
                activeFilters.collections.length === 0 
                  ? "bg-slate-950 text-white border-slate-950" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-950 hover:text-slate-950"
              )}
            >
              Shop All
            </button>
            
            {dynamicFilters.collections.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryPillClick(cat)}
                className={clsx(
                  "px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 rounded-md",
                  activeFilters.collections.includes(cat)
                    ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)]" 
                    : "bg-white text-slate-500 border-slate-200 hover:border-slate-950 hover:text-slate-950"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setFilterDrawerOpen(true)} 
            className="lg:hidden shrink-0 p-2.5 bg-white border-2 border-slate-200 hover:border-slate-950 rounded-md text-slate-950 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="container max-w-[1400px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-28 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-4 pr-6 border-r-2 border-slate-100">
              <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-950 mb-8 pb-4 border-b-2 border-slate-950">
                Filters
              </span>
              <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
            </div>
          </aside>

          {/* PRODUCT LISTINGS */}
          <div className="flex-1 min-w-0 relative min-h-[500px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-gray-100">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
                   {activeFilters.collections.length === 1 ? activeFilters.collections[0] : 'Shop All'}
                </h1>
                {!isLoading && (
                  <p className="text-sm font-medium text-gray-500 mt-2">
                    Showing <span className="text-gray-900 font-bold">{products.length}</span> Results
                  </p>
                )}
              </div>
              
              <div className="flex items-center self-start sm:self-auto gap-1 bg-gray-50/80 border border-gray-200 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={clsx("p-2.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-[var(--color-brand-orange)] shadow-sm" : "text-gray-400 hover:text-gray-800")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={clsx("p-2.5 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-[var(--color-brand-orange)] shadow-sm" : "text-gray-400 hover:text-gray-800")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-10 rounded-3xl">
                  <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
               </div>
            )}

            {!isLoading && products.length > 0 ? (
              <div className="flex flex-col items-center">
                <div className={clsx(
                  "w-full p-4 sm:p-6 lg:p-8 rounded-3xl border border-gray-100 bg-black shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)]",
                  "grid gap-6 sm:gap-8",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((item, index) => (
                    <ProductCard key={`${item.id}-${index}`} item={item} viewMode={viewMode} page="collections" index={index} priority={index <= 3} />
                  ))}
                </div>

                {pageInfo.hasNextPage && (
                   <div className="mt-12">
                     <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-10 py-4 rounded-xl font-bold text-sm uppercase tracking-widest text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-2"
                     >
                        {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
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
                  onClick={() => toggleFilter('RESET')} 
                  className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-brand-orange)] transition-colors shadow-md"
                >
                  Clear All Filters
                </button>
              </div>
            ) : null}

          </div>
        </div>
      </main>
    </div>
  );
}

export default function ShopAll() {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center mt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
            <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-950">
              Loading Collection...
            </span>
          </div>
        </div>
      }
    >
      <ShopAllContent />
    </Suspense>
  );
}