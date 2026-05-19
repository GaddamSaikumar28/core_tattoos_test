'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

export interface FilterOptions {
  collections: string[];
  styles: string[];
  sizes: string[];
  placements: string[];
}

export interface ActiveFilters {
  collections: string[];
  styles: string[];
  sizes: string[];
  placements: string[];
}

interface FilterSidebarProps {
  filters: FilterOptions;
  activeFilters: ActiveFilters;
  onToggle: (category: keyof FilterOptions | 'RESET', value?: string) => void;
}

export function FilterSidebar({ filters, activeFilters, onToggle }: FilterSidebarProps) {
  const hasAnyActive = Object.values(activeFilters).some((arr) => arr.length > 0);

  return (
    <div className="space-y-1">

      {filters.collections && filters.collections.length > 0 && (
        <FilterGroup
          title="Categories"
          items={filters.collections}
          activeItems={activeFilters.collections}
          onToggle={(v) => onToggle('collections', v)}
        />
      )}

      {filters.styles && filters.styles.length > 0 && (
        <FilterGroup
          title="Style"
          items={filters.styles}
          activeItems={activeFilters.styles}
          onToggle={(v) => onToggle('styles', v)}
        />
      )}

      {filters.sizes && filters.sizes.length > 0 && (
        <FilterGroup
          title="Size"
          items={filters.sizes}
          activeItems={activeFilters.sizes}
          onToggle={(v) => onToggle('sizes', v)}
        />
      )}

      {filters.placements && filters.placements.length > 0 && (
        <FilterGroup
          title="Placement"
          items={filters.placements}
          activeItems={activeFilters.placements}
          onToggle={(v) => onToggle('placements', v)}
        />
      )}

      {hasAnyActive && (
        <div className="pt-4">
          <button
            onClick={() => onToggle('RESET')}
            className="w-full py-2.5 rounded-lg border border-zinc-700 text-zinc-400 text-[9px] font-black uppercase tracking-[0.25em] hover:border-[var(--color-brand-orange)] hover:text-[var(--color-brand-orange)] transition-all duration-200"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Collapsible filter group — no max-height cap so all items always show ────
function FilterGroup({
  title,
  items,
  activeItems,
  onToggle,
}: {
  title: string;
  items: string[];
  activeItems: string[];
  onToggle: (val: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const activeCount = activeItems.length;

  return (
    <div className="border-b border-zinc-800/60 last:border-0">

      {/* Group header toggle */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className="w-full flex items-center justify-between py-3.5 group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 group-hover:text-zinc-200 transition-colors duration-150">
            {title}
          </span>
          {activeCount > 0 && (
            <span className="bg-[var(--color-brand-orange)] text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center leading-none shrink-0">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown
          className={clsx(
            'w-3.5 h-3.5 text-zinc-600 transition-transform duration-300 shrink-0',
            isOpen ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>

      {/* Items — rendered in DOM always, hidden via display so nothing is clipped */}
      <div className={clsx('pb-3', isOpen ? 'block' : 'hidden')}>
        <div className="space-y-0.5">
          {items.map((item) => {
            const isActive = activeItems.includes(item);
            return (
              <label
                key={item}
                className="flex items-center gap-3 px-1 py-2 rounded-lg cursor-pointer group/item hover:bg-zinc-800/40 transition-colors duration-150 select-none"
              >
                {/* Hidden native checkbox — keeps onChange logic identical to original */}
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isActive}
                  onChange={() => onToggle(item)}
                />

                {/* Custom checkbox */}
                <div
                  className={clsx(
                    'w-4 h-4 rounded-sm border flex items-center justify-center shrink-0 transition-all duration-150',
                    isActive
                      ? 'bg-[var(--color-brand-orange)] border-[var(--color-brand-orange)]'
                      : 'border-zinc-700 bg-transparent group-hover/item:border-zinc-500'
                  )}
                >
                  {isActive && (
                    <Check className="w-2.5 h-2.5 text-black" strokeWidth={3.5} />
                  )}
                </div>

                {/* Label text */}
                <span
                  className={clsx(
                    'text-[10px] font-bold uppercase tracking-widest leading-tight line-clamp-1 transition-colors duration-150',
                    isActive
                      ? 'text-[var(--color-brand-orange)]'
                      : 'text-zinc-500 group-hover/item:text-zinc-200'
                  )}
                >
                  {item}
                </span>
              </label>
            );
          })}
        </div>
      </div>

    </div>
  );
}