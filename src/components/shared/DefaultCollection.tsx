// 'use client';

// import React, { useState, useEffect, useCallback, Suspense } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
// import clsx from 'clsx';

// // Components
// import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
// import { ProductCard } from '@/src/components/shared/ProductLayout';
// import { getProducts, getCollectionProducts, getMenu, FormattedProduct } from '@/src/lib/shopify'; 

// interface DefaultCollectionProps {
//   handle: string; // Passed down from the switchboard (e.g., 'floral', 'animal')
// }

// // 1. The main content component containing the logic
// function DefaultCollectionContent({ handle }: DefaultCollectionProps) {
//   const router = useRouter();
//   const searchParams = useSearchParams();
  
//   const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
//   const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
//   const [itemsPerPage, setItemsPerPage] = useState(12);

//   const [products, setProducts] = useState<FormattedProduct[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null as string | null });
  
//   // STATE INITIALIZATION
//   const [collectionMap, setCollectionMap] = useState<Record<string, string>>({});
//   const [currentCollectionTitle, setCurrentCollectionTitle] = useState<string>('');
  
//   const [dynamicFilters, setDynamicFilters] = useState<FilterOptions>({
//     collections: [],
//     styles: [],
//     sizes: [],
//     placements: []
//   });

//   // 🚀 SEO FIX: Initialize active filters directly from the URL query parameters
//   const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
//     collections: [],
//     styles: searchParams.get('styles')?.split(',') || [],
//     sizes: searchParams.get('sizes')?.split(',') || [],
//     placements: searchParams.get('placements')?.split(',') || []
//   });

//   // FETCH MENU & MAP URL HANDLES
//   useEffect(() => {
//     async function loadFilterData() {
//       try {
//         const menuData = await getMenu('menu-custom');
        
//         const collectionsMenu = menuData?.items?.find((item: any) => 
//           item.title.toLowerCase() === 'collection' || item.title.toLowerCase() === 'collections'
//         );

//         const flatCategories: string[] = [];
//         const urlMapping: Record<string, string> = {};
//         let foundTitle = handle.replace(/-/g, ' '); 
        
//         const processMenuItem = (item: any) => {
//           if (item.items && item.items.length > 0) {
//             item.items.forEach(processMenuItem);
//           } else {
//             flatCategories.push(item.title);
//             if (item.url) {
//               const urlParts = item.url.split('/').filter(Boolean);
//               const mappedHandle = urlParts[urlParts.length - 1];
//               if (mappedHandle) {
//                 const cleanHandle = mappedHandle.split('?')[0].split('#')[0];
//                 urlMapping[item.title] = cleanHandle;
                
//                 if (cleanHandle === handle) {
//                   foundTitle = item.title;
//                 }
//               }
//             }
//           }
//         };

//         if (collectionsMenu && collectionsMenu.items) {
//           collectionsMenu.items.forEach(processMenuItem);
//         }

//         const hiddenCollections = ["Home page", "Sale", "New Arrivals"];
//         const validCollections = flatCategories.filter(title => !hiddenCollections.includes(title));

//         const findMenuItems = (title: string) => {
//           const section = menuData?.items?.find((item: any) => 
//             item.title.toLowerCase() === title.toLowerCase() || 
//             item.title.toLowerCase().includes(title.toLowerCase())
//           );
//           return section?.items?.map((i: any) => i.title) || [];
//         };

//         setCollectionMap(urlMapping);
//         setCurrentCollectionTitle(foundTitle);
        
//         setDynamicFilters({
//           collections: validCollections,
//           styles: findMenuItems('styles'),
//           sizes: findMenuItems('sizes'),
//           placements: findMenuItems('placements')
//         });

//         setActiveFilters(prev => ({ ...prev, collections: [foundTitle] }));

//       } catch (err) {
//         console.error("Failed to load filter data", err);
//       }
//     }
//     loadFilterData();
//   }, [handle]);

//   useEffect(() => {
//     const handleResize = () => setItemsPerPage(window.innerWidth < 1024 ? 9 : 12);
//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // HYBRID PRODUCT FETCHING LOGIC (SEO Optimized)
//   const fetchProducts = useCallback(async (cursor: string | null = null) => {
//     if (cursor) setIsLoadingMore(true);
//     else setIsLoading(true);

//     try {
//       const hasSecondaryFilters = 
//         activeFilters.styles.length > 0 || 
//         activeFilters.sizes.length > 0 || 
//         activeFilters.placements.length > 0;

//       let result;

//       if (!hasSecondaryFilters) {
//         result = await getCollectionProducts({
//           handle: handle, 
//           first: itemsPerPage,
//           after: cursor || undefined
//         });
//       } else {
//         const queryParts = [`collection:'${handle}'`];
//         const buildGroup = (items: string[]) => items.map(i => `(tag:'${i}' OR "${i}")`).join(' OR ');

//         if (activeFilters.styles.length > 0) queryParts.push(`(${buildGroup(activeFilters.styles)})`);
//         if (activeFilters.sizes.length > 0) queryParts.push(`(${buildGroup(activeFilters.sizes)})`);
//         if (activeFilters.placements.length > 0) queryParts.push(`(${buildGroup(activeFilters.placements)})`);

//         result = await getProducts({
//           query: queryParts.join(' AND '),
//           first: itemsPerPage,
//           after: cursor || undefined,
//           sortKey: 'CREATED_AT',
//           reverse: true
//         });
//       }
      
//       if (cursor) {
//         setProducts(prev => [...prev, ...result.formattedData]);
//       } else {
//         setProducts(result.formattedData);
//         // REMOVED window.scrollTo HERE TO STOP THE ANNOYING SCROLL JUMP ON FILTER CLICKS
//       }
//       setPageInfo(result.pageInfo);
//     } catch (error) {
//       console.error("Failed to fetch products", error);
//       if (!cursor) setProducts([]);
//     } finally {
//       setIsLoading(false);
//       setIsLoadingMore(false);
//     }
//   }, [handle, activeFilters, itemsPerPage]);

//   useEffect(() => {
//     fetchProducts(null);
//   }, [activeFilters, fetchProducts]);

//   // NAVIGATION & TOGGLE LOGIC
//   const handleCategoryPillClick = (cat: string) => {
//     if (cat === 'Shop All') {
//       router.push('/collections');
//     } else {
//       const targetHandle = collectionMap[cat];
//       if (targetHandle) {
//         router.push(`/collections/${targetHandle}`);
//       }
//     }
//   };

//   const toggleFilter = (group: keyof ActiveFilters | 'RESET', value?: string) => {
//     if (group === 'RESET') {
//       setActiveFilters(prev => ({ ...prev, styles: [], sizes: [], placements: [] }));
//       router.push(`/collections/${handle}`, { scroll: false }); // Reset URL
//       return;
//     }
    
//     if (group === 'collections' && value) {
//        handleCategoryPillClick(value);
//        return;
//     }

//     if (!value) return;

//     setActiveFilters(prev => {
//       const currentGroup = prev[group as keyof ActiveFilters] || [];
//       const isSelected = currentGroup.includes(value);
      
//       const newGroupState = isSelected 
//         ? currentGroup.filter((item: string) => item !== value) 
//         : [...currentGroup, value];

//       const newState = { ...prev, [group]: newGroupState };

//       // 🚀 SEO FIX: Push the active filters to the URL Query String
//       const params = new URLSearchParams(searchParams.toString());
      
//       if (newState.styles.length > 0) params.set('styles', newState.styles.join(','));
//       else params.delete('styles');
      
//       if (newState.sizes.length > 0) params.set('sizes', newState.sizes.join(','));
//       else params.delete('sizes');
      
//       if (newState.placements.length > 0) params.set('placements', newState.placements.join(','));
//       else params.delete('placements');
      
//       const queryString = params.toString();
//       router.push(queryString ? `?${queryString}` : `/collections/${handle}`, { scroll: false });

//       return newState;
//     });
//   };

//   return (
//     // 🚀 FIX: Added overflow-x-hidden w-full to prevent body stretching
//     <div className="bg-slate-50 min-h-screen text-slate-950 selection:bg-slate-900 selection:text-white mt-20 md:mt-20 overflow-x-hidden w-full">
      
//       {/* MOBILE DRAWER */}
//       <div className={clsx(
//         "fixed inset-0 z-[60] bg-slate-950/40 backdrop-blur-sm transition-opacity lg:hidden",
//         isFilterDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//       )} onClick={() => setFilterDrawerOpen(false)} />
      
//       <div className={clsx(
//         "fixed right-0 top-0 h-full w-[300px] bg-white z-[70] shadow-2xl transition-transform duration-500 lg:hidden border-l-2 border-slate-950",
//         isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"
//       )}>
//         <div className="p-6 h-full flex flex-col">
//           <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-slate-100 shrink-0">
//             <h2 className="text-[12px] font-black uppercase tracking-[0.2em]">Filters</h2>
//             <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//           <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
//             <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
//           </div>
//           <div className="p-6 border-t border-slate-100 bg-slate-50">
//                <button 
//                 onClick={() => setFilterDrawerOpen(false)}
//                 className="w-full py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl"
//                >
//                  Apply Filters
//                </button>
//             </div>
//         </div>
//       </div>

//       {/* TOP HORIZONTAL NAVIGATION PILLS */}
//       <nav className="sticky top-0 z-40 bg-white mt-5 border-b-2 border-slate-100">
//         <div className="container max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
//           <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
//             <button
//               onClick={() => handleCategoryPillClick('Shop All')}
//               className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 rounded-md bg-white text-slate-500 border-slate-200 hover:border-slate-950 hover:text-slate-950"
//             >
//               Shop All
//             </button>
            
//             {dynamicFilters.collections.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => handleCategoryPillClick(cat)}
//                 className={clsx(
//                   "px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border-2 rounded-md",
//                   activeFilters.collections.includes(cat)
//                     ? "bg-[var(--color-brand-orange)] text-white border-[var(--color-brand-orange)]" 
//                     : "bg-white text-slate-500 border-slate-200 hover:border-slate-950 hover:text-slate-950"
//                 )}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>

//           <button 
//             onClick={() => setFilterDrawerOpen(true)} 
//             className="lg:hidden shrink-0 p-2.5 bg-white border-2 border-slate-200 hover:border-slate-950 rounded-md text-slate-950 transition-colors"
//           >
//             <SlidersHorizontal className="w-4 h-4" />
//           </button>
//         </div>
//       </nav>

//       {/* MAIN CONTENT AREA */}
//       <main className="container max-w-[1400px] mx-auto px-4 py-12">
//         <div className="flex flex-col lg:flex-row gap-12">
          
//           {/* DESKTOP SIDEBAR */}
//           <aside className="hidden lg:block w-64 shrink-0">
//             <div className="sticky top-28 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-4 pr-6 border-r-2 border-slate-100">
//               <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-slate-950">
//                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Filters</span>
//                 {(activeFilters.styles.length > 0 || activeFilters.sizes.length > 0 || activeFilters.placements.length > 0) && (
//                   <button onClick={() => toggleFilter('RESET')} className="text-[10px] font-bold text-[var(--color-brand-orange)] uppercase hover:underline">
//                     Clear
//                   </button>
//                 )}
//               </div>
//               <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
//             </div>
//           </aside>

//           {/* PRODUCT LISTINGS */}
//           <div className="flex-1 min-w-0 relative min-h-[500px]">
//             <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-gray-100">
//               <div>
//                 <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight capitalize">
//                    {currentCollectionTitle || handle.replace(/-/g, ' ')}
//                 </h1>
//                 {!isLoading && (
//                   <p className="text-sm font-medium text-gray-500 mt-2">
//                     Showing <span className="text-gray-900 font-bold">{products.length}</span> Results
//                   </p>
//                 )}
//               </div>
              
//               <div className="flex items-center self-start sm:self-auto gap-1 bg-gray-50/80 border border-gray-200 p-1 rounded-xl shadow-sm">
//                 <button 
//                   onClick={() => setViewMode('grid')} 
//                   className={clsx("p-2.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-white text-[var(--color-brand-orange)] shadow-sm" : "text-gray-400 hover:text-gray-800")}
//                 >
//                   <LayoutGrid className="w-4 h-4" />
//                 </button>
//                 <button 
//                   onClick={() => setViewMode('list')} 
//                   className={clsx("p-2.5 rounded-lg transition-all", viewMode === 'list' ? "bg-white text-[var(--color-brand-orange)] shadow-sm" : "text-gray-400 hover:text-gray-800")}
//                 >
//                   <List className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>

//             {isLoading && (
//                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px] z-10 rounded-3xl">
//                   <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
//                </div>
//             )}

//             {!isLoading && products.length > 0 ? (
//               <div className="flex flex-col items-center">
//                 <div className={clsx(
//                   "w-full p-4 sm:p-6 lg:p-8 rounded-[2rem] border bg-black border-zinc-800 shadow-[inset_0_1px_4px_rgba(0,0,0,0.8)]",
//                   "grid gap-6 sm:gap-8",
//                   viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
//                 )}>
//                   {products.map((item, index) => (
//                     <ProductCard key={`${item.id}-${index}`} item={item} viewMode={viewMode} page="collections" index={index} priority={index <= 3} />
//                   ))}
//                 </div>

//                 {pageInfo.hasNextPage && (
//                    <div className="mt-12">
//                      <button
//                         onClick={() => fetchProducts(pageInfo.endCursor)}
//                         disabled={isLoadingMore}
//                         className="px-10 py-4 border-2 border-slate-900 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white transition-all disabled:opacity-50 flex items-center gap-3 rounded-md"
//                      >
//                         {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
//                         {isLoadingMore ? 'Loading...' : 'Show More'}
//                      </button>
//                    </div>
//                 )}
//               </div>
//             ) : (!isLoading && products.length === 0) ? (
//               <div className="py-24 text-center bg-gray-50/50 border border-dashed border-gray-300 rounded-3xl flex flex-col items-center justify-center">
//                 <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
//                   <RefreshCcw className="w-8 h-8 text-gray-400" />
//                 </div>
//                 <p className="text-gray-900 font-bold text-lg mb-2">No products found</p>
//                 <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting them to see more results.</p>
//                 <button 
//                   onClick={() => toggleFilter('RESET')} 
//                   className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-[var(--color-brand-orange)] transition-colors shadow-md"
//                 >
//                   Clear All Filters
//                 </button>
//               </div>
//             ) : null}

//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// // 2. Export the component wrapped in a Suspense boundary (Required by Next.js)
// export default function DefaultCollection({ handle }: DefaultCollectionProps) {
//   return (
//     <Suspense 
//       fallback={
//         <div className="min-h-screen bg-slate-50 flex items-center justify-center mt-20">
//           <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
//         </div>
//       }
//     >
//       <DefaultCollectionContent handle={handle} />
//     </Suspense>
//   );
// }






'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
import clsx from 'clsx';

// Components
import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
import { ProductCard } from '@/src/components/shared/ProductLayout';
import { getProducts, getCollectionProducts, getMenu, FormattedProduct } from '@/src/lib/shopify'; 

interface DefaultCollectionProps {
  handle: string; // Passed down from the switchboard (e.g., 'floral', 'animal')
}

// 1. The main content component containing the logic
function DefaultCollectionContent({ handle }: DefaultCollectionProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [products, setProducts] = useState<FormattedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageInfo, setPageInfo] = useState({ hasNextPage: false, endCursor: null as string | null });
  
  // STATE INITIALIZATION
  const [collectionMap, setCollectionMap] = useState<Record<string, string>>({});
  const [currentCollectionTitle, setCurrentCollectionTitle] = useState<string>('');
  
  const [dynamicFilters, setDynamicFilters] = useState<FilterOptions>({
    collections: [],
    styles: [],
    sizes: [],
    placements: []
  });

  // 🚀 SEO FIX: Initialize active filters directly from the URL query parameters
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    collections: [],
    styles: searchParams.get('styles')?.split(',') || [],
    sizes: searchParams.get('sizes')?.split(',') || [],
    placements: searchParams.get('placements')?.split(',') || []
  });

  // FETCH MENU & MAP URL HANDLES
  useEffect(() => {
    async function loadFilterData() {
      try {
        const menuData = await getMenu('menu-custom');
        
        const collectionsMenu = menuData?.items?.find((item: any) => 
          item.title.toLowerCase() === 'collection' || item.title.toLowerCase() === 'collections'
        );

        const flatCategories: string[] = [];
        const urlMapping: Record<string, string> = {};
        let foundTitle = handle.replace(/-/g, ' '); 
        
        const processMenuItem = (item: any) => {
          if (item.items && item.items.length > 0) {
            item.items.forEach(processMenuItem);
          } else {
            flatCategories.push(item.title);
            if (item.url) {
              const urlParts = item.url.split('/').filter(Boolean);
              const mappedHandle = urlParts[urlParts.length - 1];
              if (mappedHandle) {
                const cleanHandle = mappedHandle.split('?')[0].split('#')[0];
                urlMapping[item.title] = cleanHandle;
                
                if (cleanHandle === handle) {
                  foundTitle = item.title;
                }
              }
            }
          }
        };

        if (collectionsMenu && collectionsMenu.items) {
          collectionsMenu.items.forEach(processMenuItem);
        }

        const hiddenCollections = ["Home page", "Sale", "New Arrivals"];
        const validCollections = flatCategories.filter(title => !hiddenCollections.includes(title));

        const findMenuItems = (title: string) => {
          const section = menuData?.items?.find((item: any) => 
            item.title.toLowerCase() === title.toLowerCase() || 
            item.title.toLowerCase().includes(title.toLowerCase())
          );
          return section?.items?.map((i: any) => i.title) || [];
        };

        setCollectionMap(urlMapping);
        setCurrentCollectionTitle(foundTitle);
        
        setDynamicFilters({
          collections: validCollections,
          styles: findMenuItems('styles'),
          sizes: findMenuItems('sizes'),
          placements: findMenuItems('placements')
        });

        setActiveFilters(prev => ({ ...prev, collections: [foundTitle] }));

      } catch (err) {
        console.error("Failed to load filter data", err);
      }
    }
    loadFilterData();
  }, [handle]);

  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 1024 ? 9 : 12);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // HYBRID PRODUCT FETCHING LOGIC (SEO Optimized)
  const fetchProducts = useCallback(async (cursor: string | null = null) => {
    if (cursor) setIsLoadingMore(true);
    else setIsLoading(true);

    try {
      const hasSecondaryFilters = 
        activeFilters.styles.length > 0 || 
        activeFilters.sizes.length > 0 || 
        activeFilters.placements.length > 0;

      let result;

      if (!hasSecondaryFilters) {
        result = await getCollectionProducts({
          handle: handle, 
          first: itemsPerPage,
          after: cursor || undefined
        });
      } else {
        const queryParts = [`collection:'${handle}'`];
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
      
      if (cursor) {
        setProducts(prev => [...prev, ...result.formattedData]);
      } else {
        setProducts(result.formattedData);
      }
      setPageInfo(result.pageInfo);
    } catch (error) {
      console.error("Failed to fetch products", error);
      if (!cursor) setProducts([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [handle, activeFilters, itemsPerPage]);

  useEffect(() => {
    fetchProducts(null);
  }, [activeFilters, fetchProducts]);

  // NAVIGATION & TOGGLE LOGIC
  const handleCategoryPillClick = (cat: string) => {
    if (cat === 'Shop All') {
      router.push('/collections');
    } else {
      const targetHandle = collectionMap[cat];
      if (targetHandle) {
        router.push(`/collections/${targetHandle}`);
      }
    }
  };

  const toggleFilter = (group: keyof ActiveFilters | 'RESET', value?: string) => {
    if (group === 'RESET') {
      setActiveFilters(prev => ({ ...prev, styles: [], sizes: [], placements: [] }));
      router.push(`/collections/${handle}`, { scroll: false }); // Reset URL
      return;
    }
    
    if (group === 'collections' && value) {
       handleCategoryPillClick(value);
       return;
    }

    if (!value) return;

    setActiveFilters(prev => {
      const currentGroup = prev[group as keyof ActiveFilters] || [];
      const isSelected = currentGroup.includes(value);
      
      const newGroupState = isSelected 
        ? currentGroup.filter((item: string) => item !== value) 
        : [...currentGroup, value];

      const newState = { ...prev, [group]: newGroupState };

      // 🚀 SEO FIX: Push the active filters to the URL Query String
      const params = new URLSearchParams(searchParams.toString());
      
      if (newState.styles.length > 0) params.set('styles', newState.styles.join(','));
      else params.delete('styles');
      
      if (newState.sizes.length > 0) params.set('sizes', newState.sizes.join(','));
      else params.delete('sizes');
      
      if (newState.placements.length > 0) params.set('placements', newState.placements.join(','));
      else params.delete('placements');
      
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : `/collections/${handle}`, { scroll: false });

      return newState;
    });
  };

  return (
    // Replaced light theme with dark theme (bg-zinc-950, text-white)
    <div className="bg-zinc-950 min-h-screen text-white selection:bg-[var(--color-brand-orange)] selection:text-black mt-20 md:mt-20 overflow-x-hidden w-full">
      
      {/* MOBILE DRAWER */}
      <div className={clsx(
        "fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity lg:hidden",
        isFilterDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )} onClick={() => setFilterDrawerOpen(false)} />
      
      <div className={clsx(
        "fixed right-0 top-0 h-full w-[300px] bg-zinc-950 z-[70] shadow-2xl transition-transform duration-500 lg:hidden border-l border-white/10",
        isFilterDrawerOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 shrink-0">
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Filters</h2>
            <button onClick={() => setFilterDrawerOpen(false)} className="p-2 hover:bg-zinc-900 rounded-full transition-colors text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
            <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>
          <div className="p-6 border-t border-white/10 bg-zinc-950">
               <button 
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-4 bg-[var(--color-brand-orange)] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:brightness-110 transition-all"
               >
                 Apply Filters
               </button>
            </div>
        </div>
      </div>

      {/* TOP HORIZONTAL NAVIGATION PILLS */}
      <nav className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md mt-5 border-b border-white/5">
        <div className="container max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <button
              onClick={() => handleCategoryPillClick('Shop All')}
              className="px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border rounded-full bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
            >
              Shop All
            </button>
            
            {dynamicFilters.collections.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryPillClick(cat)}
                className={clsx(
                  "px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap border rounded-full",
                  activeFilters.collections.includes(cat)
                    ? "bg-[var(--color-brand-orange)] text-black border-[var(--color-brand-orange)]" 
                    : "bg-transparent text-zinc-400 border-white/10 hover:border-white/30 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setFilterDrawerOpen(true)} 
            className="lg:hidden shrink-0 p-2.5 bg-transparent border border-white/10 hover:border-white/30 rounded-full text-zinc-400 hover:text-white transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="container max-w-[1400px] mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-28 space-y-8 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pb-4 pr-4">
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-800/60">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Filters</span>
                {(activeFilters.styles.length > 0 || activeFilters.sizes.length > 0 || activeFilters.placements.length > 0) && (
                  <button onClick={() => toggleFilter('RESET')} className="text-[10px] font-bold text-[var(--color-brand-orange)] uppercase hover:text-white transition-colors">
                    Clear
                  </button>
                )}
              </div>
              <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
            </div>
          </aside>

          {/* PRODUCT LISTINGS */}
          <div className="flex-1 min-w-0 relative min-h-[500px]">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 pb-6 border-b border-zinc-800/60">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading text-white tracking-tight capitalize">
                   {currentCollectionTitle || handle.replace(/-/g, ' ')}
                </h1>
                {!isLoading && (
                  <p className="text-sm font-medium text-zinc-500 mt-2">
                    Showing <span className="text-white font-bold">{products.length}</span> Results
                  </p>
                )}
              </div>
              
              <div className="flex items-center self-start sm:self-auto gap-1 bg-zinc-900/50 border border-white/10 p-1 rounded-xl shadow-sm">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={clsx("p-2.5 rounded-lg transition-all", viewMode === 'grid' ? "bg-zinc-800 text-[var(--color-brand-orange)] shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={clsx("p-2.5 rounded-lg transition-all", viewMode === 'list' ? "bg-zinc-800 text-[var(--color-brand-orange)] shadow-sm" : "text-zinc-500 hover:text-zinc-300")}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoading && (
               <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/50 backdrop-blur-[2px] z-10 rounded-3xl">
                  <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
               </div>
            )}

            {!isLoading && products.length > 0 ? (
              <div className="flex flex-col items-center">
                {/* Simplified the container to match Shop All grid styling without the heavy light-theme border */}
                <div className={clsx(
                  "w-full",
                  "grid gap-6 sm:gap-8",
                  viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
                )}>
                  {products.map((item, index) => (
                    <ProductCard key={`${item.id}-${index}`} item={item} viewMode={viewMode} page="collections" index={index} priority={index <= 3} />
                  ))}
                </div>

                {pageInfo.hasNextPage && (
                   <div className="mt-16">
                     <button
                        onClick={() => fetchProducts(pageInfo.endCursor)}
                        disabled={isLoadingMore}
                        className="px-10 py-4 border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white hover:text-black rounded-full transition-all duration-300 disabled:opacity-50 flex items-center gap-3"
                     >
                        {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                        {isLoadingMore ? 'Loading...' : 'Show More'}
                     </button>
                   </div>
                )}
              </div>
            ) : (!isLoading && products.length === 0) ? (
              <div className="py-24 text-center bg-zinc-900/30 border border-dashed border-zinc-800 rounded-[2rem] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-4 border border-white/5">
                  <RefreshCcw className="w-8 h-8 text-zinc-500" />
                </div>
                <p className="text-white font-bold text-lg mb-2">No products found</p>
                <p className="text-zinc-500 text-sm mb-6 max-w-sm mx-auto">We couldn't find anything matching your current filters. Try adjusting them to see more results.</p>
                <button 
                  onClick={() => toggleFilter('RESET')} 
                  className="px-6 py-3 bg-[var(--color-brand-orange)] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full hover:brightness-110 transition-all shadow-md"
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

// 2. Export the component wrapped in a Suspense boundary (Required by Next.js)
export default function DefaultCollection({ handle }: DefaultCollectionProps) {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center mt-20">
          <Loader2 className="w-10 h-10 text-[var(--color-brand-orange)] animate-spin" />
        </div>
      }
    >
      <DefaultCollectionContent handle={handle} />
    </Suspense>
  );
}