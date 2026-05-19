'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { SlidersHorizontal, LayoutGrid, List, X, RefreshCcw, Loader2 } from 'lucide-react';
import clsx from 'clsx';

import { FilterSidebar, ActiveFilters, FilterOptions } from '@/src/components/shared/FilterSidebar';
import { ProductCard } from '@/src/components/shared/ProductLayout';
import { getProducts, getMenu, FormattedProduct, getCollectionProducts } from '@/src/lib/shopify';

// ─────────────────────────────────────────────────────────────────────────────

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

  const [dynamicFilters, setDynamicFilters] = useState<FilterOptions>({
    collections: [],
    styles: [],
    sizes: [],
    placements: [],
  });

  const [collectionMap, setCollectionMap] = useState<Record<string, string>>({});

  const categoryFromUrl = searchParams.get('category');

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    collections: categoryFromUrl && categoryFromUrl !== 'Shop All' ? [categoryFromUrl] : [],
    styles: searchParams.get('styles')?.split(',') || [],
    sizes: searchParams.get('sizes')?.split(',') || [],
    placements: searchParams.get('placements')?.split(',') || [],
  });

  // ── Load filter options ───────────────────────────────────────────────────
  useEffect(() => {
    async function loadFilterData() {
      try {
        const menuData = await getMenu('menu-custom');
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
              if (handle) urlMapping[item.title] = handle.split('?')[0].split('#')[0];
            }
          }
        };

        if (collectionsMenu?.items) collectionsMenu.items.forEach(processMenuItem);

        const hiddenCollections = ['Home page'];
        const validCollections = flatCategories.filter((t) => !hiddenCollections.includes(t));

        setCollectionMap(urlMapping);
        setDynamicFilters({ collections: validCollections, styles: [], sizes: [], placements: [] });
      } catch (err) {
        console.error('Failed to load filter data', err);
      }
    }
    loadFilterData();
  }, []);

  // ── Responsive items per page ─────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => setItemsPerPage(window.innerWidth < 1024 ? 9 : 12);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Build Shopify query ───────────────────────────────────────────────────
  const buildShopifyQuery = useCallback(() => {
    const queryParts: string[] = [];
    const buildGroup = (items: string[]) =>
      items.map((item) => `(tag:'${item}' OR "${item}")`).join(' OR ');

    if (activeFilters.collections.length > 0) {
      const cq = activeFilters.collections
        .map((item) => {
          const handle = collectionMap[item];
          return handle
            ? `(tag:'${handle}' OR tag:'${item}' OR "${handle}" OR "${item}")`
            : `(tag:'${item}' OR "${item}")`;
        })
        .join(' OR ');
      queryParts.push(`(${cq})`);
    }

    if (activeFilters.styles?.length > 0) queryParts.push(`(${buildGroup(activeFilters.styles)})`);
    if (activeFilters.placements?.length > 0) queryParts.push(`(${buildGroup(activeFilters.placements)})`);
    if (activeFilters.sizes?.length > 0) queryParts.push(`(${buildGroup(activeFilters.sizes)})`);

    return queryParts.length === 0 ? undefined : queryParts.join(' AND ');
  }, [activeFilters, collectionMap]);

  // ── Fetch products ────────────────────────────────────────────────────────
  const fetchProducts = useCallback(
    async (cursor: string | null = null) => {
      if (cursor) setIsLoadingMore(true);
      else setIsLoading(true);

      try {
        const selectedCollection = activeFilters.collections[0];
        const handle = collectionMap[selectedCollection];
        const isShopAll = activeFilters.collections.length === 0;
        const isPureCollection =
          activeFilters.collections.length === 1 &&
          activeFilters.styles.length === 0 &&
          activeFilters.sizes.length === 0 &&
          activeFilters.placements.length === 0;

        let result;
        if (!isShopAll && isPureCollection && handle) {
          result = await getCollectionProducts({ handle, first: itemsPerPage, after: cursor || undefined });
        } else {
          result = await getProducts({ query: buildShopifyQuery(), first: itemsPerPage, after: cursor || undefined });
        }

        if (cursor) {
          setProducts((prev) => [...prev, ...result.formattedData]);
        } else {
          setProducts(result.formattedData);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setPageInfo(result.pageInfo);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [buildShopifyQuery, itemsPerPage, activeFilters, collectionMap]
  );

  useEffect(() => { fetchProducts(null); }, [activeFilters, fetchProducts]);

  const handleLoadMore = () => {
    if (pageInfo.hasNextPage && !isLoadingMore) fetchProducts(pageInfo.endCursor);
  };

  // ── Category pill click ───────────────────────────────────────────────────
  const handleCategoryPillClick = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === 'Shop All') {
      params.delete('category');
      setActiveFilters((prev) => ({ ...prev, collections: [] }));
    } else {
      params.set('category', cat);
      setActiveFilters((prev) => ({ ...prev, collections: [cat] }));
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ── Toggle filter ─────────────────────────────────────────────────────────
  const toggleFilter = (group: keyof ActiveFilters | 'RESET', value?: string) => {
    if (group === 'RESET') {
      setActiveFilters({ collections: [], styles: [], sizes: [], placements: [] });
      router.push(pathname, { scroll: false });
      return;
    }
    if (!value) return;

    const currentGroup = activeFilters[group as keyof ActiveFilters] || [];
    const isSelected = currentGroup.includes(value);
    const newGroupState = isSelected
      ? currentGroup.filter((i: string) => i !== value)
      : [...currentGroup, value];
    const newState = { ...activeFilters, [group]: newGroupState };
    setActiveFilters(newState);

    const params = new URLSearchParams(searchParams.toString());
    if (newState.styles?.length > 0) params.set('styles', newState.styles.join(','));
    else params.delete('styles');
    if (newState.sizes?.length > 0) params.set('sizes', newState.sizes.join(','));
    else params.delete('sizes');
    if (newState.placements?.length > 0) params.set('placements', newState.placements.join(','));
    else params.delete('placements');

    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const activeFilterCount = Object.values(activeFilters).reduce((acc, arr) => acc + arr.length, 0);
  const pageTitle =
    activeFilters.collections.length === 1 ? activeFilters.collections[0] : 'Shop All';

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="bg-zinc-950 min-h-screen text-white selection:bg-[var(--color-brand-orange)] selection:text-black mt-25 overflow-x-hidden w-full">

      {/* ── Mobile drawer overlay ────────────────────────────────────────── */}
      <div
        className={clsx(
          'fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          isFilterDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setFilterDrawerOpen(false)}
      />

      {/* ── Mobile drawer panel ──────────────────────────────────────────── */}
      <div
        className={clsx(
          'fixed right-0 top-0 h-full w-[300px] bg-zinc-950 z-[70] shadow-2xl',
          'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:hidden',
          'border-l border-zinc-800',
          isFilterDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400">
              Refine
            </span>
            {activeFilterCount > 0 && (
              <span className="bg-[var(--color-brand-orange)] text-black text-[9px] font-black px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <button
              onClick={() => setFilterDrawerOpen(false)}
              className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors ml-auto"
            >
              <X className="w-4 h-4 text-zinc-400" />
            </button>
          </div>

          {/* Drawer filter content */}
          <div className="flex-1 overflow-y-auto [scrollbar-width:none] pb-6">
            <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
          </div>
        </div>
      </div>

      {/* ── Sticky category pill nav ─────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/60">
        <div className="container max-w-[1400px] mx-auto px-4 py-3.5 flex items-center justify-between gap-4">

          {/* Scrollable pill row */}
          <div className="flex-1 min-w-0 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex gap-2 w-max">
              <button
                onClick={() => handleCategoryPillClick('Shop All')}
                className={clsx(
                  'px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-lg transition-all duration-200 border',
                  activeFilters.collections.length === 0
                    ? 'bg-[var(--color-brand-orange)] text-black border-[var(--color-brand-orange)]'
                    : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-400 hover:text-zinc-200'
                )}
              >
                Shop All
              </button>

              {dynamicFilters.collections.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategoryPillClick(cat)}
                  className={clsx(
                    'px-4 py-2 text-[9px] font-black uppercase tracking-[0.2em] whitespace-nowrap rounded-lg transition-all duration-200 border',
                    activeFilters.collections.includes(cat)
                      ? 'bg-[var(--color-brand-orange)] text-black border-[var(--color-brand-orange)]'
                      : 'bg-transparent text-zinc-500 border-zinc-700 hover:border-zinc-400 hover:text-zinc-200'
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile filter trigger */}
          <button
            onClick={() => setFilterDrawerOpen(true)}
            className={clsx(
              'lg:hidden shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 border text-[9px] font-black uppercase tracking-[0.15em]',
              activeFilterCount > 0
                ? 'bg-[var(--color-brand-orange)] text-black border-[var(--color-brand-orange)]'
                : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            {activeFilterCount > 0 ? `Filters (${activeFilterCount})` : 'Filters'}
          </button>
        </div>
      </nav>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main className="container max-w-[1400px] mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Desktop sidebar ──────────────────────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-56 shrink-0">
            <div className="sticky top-[64px] max-h-[calc(100vh-80px)] overflow-y-auto [scrollbar-width:none] pb-6 pr-2">
              <div className="flex items-center justify-between mb-5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  Refine
                </span>
                {activeFilterCount > 0 && (
                  <span className="bg-[var(--color-brand-orange)] text-black text-[9px] font-black px-2 py-0.5 rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <div className="h-px bg-zinc-800 mb-4" />
              <FilterSidebar filters={dynamicFilters} activeFilters={activeFilters} onToggle={toggleFilter} />
            </div>
          </aside>

          {/* ── Product listing ───────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 relative min-h-[500px]">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-8 pb-5 border-b border-zinc-800/60">
              <div>
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
                  {pageTitle}
                </h1>
                {!isLoading && (
                  <p className="text-[11px] font-bold text-zinc-500 mt-1">
                    <span className="text-white font-black">{products.length}</span> results
                  </p>
                )}
                {isLoading && (
                  <div className="h-4 w-28 bg-zinc-800 rounded animate-pulse mt-1" />
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={clsx(
                    'p-2 rounded-lg transition-all duration-200',
                    viewMode === 'grid'
                      ? 'bg-[var(--color-brand-orange)] text-black shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-300'
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={clsx(
                    'p-2 rounded-lg transition-all duration-200',
                    viewMode === 'list'
                      ? 'bg-[var(--color-brand-orange)] text-black shadow-sm'
                      : 'text-zinc-600 hover:text-zinc-300'
                  )}
                  aria-label="List view"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* ── Loading skeleton ── */}
            {isLoading && (
              <div
                className={clsx(
                  'grid gap-5',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                    : 'grid-cols-1'
                )}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            )}

            {/* ── Product grid ── */}
            {!isLoading && products.length > 0 && (
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'w-full grid gap-5',
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  )}
                >
                  {products.map((item, index) => (
                    <ProductCard
                      key={`${item.id}-${index}`}
                      item={item}
                      viewMode={viewMode}
                      page="collections"
                      index={index}
                      priority={index <= 3}
                    />
                  ))}
                </div>

                {/* Load more */}
                {pageInfo.hasNextPage && (
                  <div className="mt-12 flex flex-col items-center gap-3">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      className={clsx(
                        'px-10 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.2em]',
                        'border border-zinc-700 text-zinc-400',
                        'hover:bg-[var(--color-brand-orange)] hover:border-[var(--color-brand-orange)] hover:text-black',
                        'transition-all duration-300 disabled:opacity-40 flex items-center gap-2.5'
                      )}
                    >
                      {isLoadingMore && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isLoadingMore ? 'Loading...' : 'Show More'}
                    </button>
                    {!isLoadingMore && (
                      <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                        {products.length} loaded
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && products.length === 0 && (
              <div className="py-24 text-center border border-dashed border-zinc-800 rounded-2xl flex flex-col items-center">
                <div className="w-14 h-14 bg-zinc-900 rounded-full flex items-center justify-center mb-5">
                  <RefreshCcw className="w-6 h-6 text-zinc-600" />
                </div>
                <p className="text-white font-black text-lg uppercase tracking-widest mb-2">
                  No Products Found
                </p>
                <p className="text-zinc-600 text-xs mb-8 max-w-xs mx-auto leading-relaxed">
                  We couldn't find anything matching your current filters.
                </p>
                <button
                  onClick={() => toggleFilter('RESET')}
                  className="px-8 py-3 bg-[var(--color-brand-orange)] text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:brightness-110 transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 animate-pulse">
      <div className="aspect-[4/5] bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-20 bg-zinc-800 rounded" />
        <div className="flex justify-between items-start gap-4">
          <div className="h-4 w-3/4 bg-zinc-800 rounded" />
          <div className="h-5 w-14 bg-zinc-800 rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-11 w-[88px] bg-zinc-800 rounded-full" />
          <div className="h-11 flex-1 bg-zinc-800 rounded-full" />
        </div>
        <div className="h-10 w-full bg-zinc-800 rounded-full" />
        <div className="flex gap-2 pt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-[18px] h-[18px] rounded-full bg-zinc-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page export ───────────────────────────────────────────────────────────────
export default function ShopAll() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center mt-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-[var(--color-brand-orange)] animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
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