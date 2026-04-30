
'use client';

import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

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
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
      
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
      
      {Object.values(activeFilters).some(arr => arr.length > 0) && (
        <button 
          onClick={() => onToggle('RESET')} 
          className="w-full py-3 rounded-xl bg-slate-950 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[var(--color-brand-orange)] transition-colors shadow-lg"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}

function FilterGroup({ title, items, activeItems, onToggle }: { title: string, items: string[], activeItems: string[], onToggle: (val: string) => void }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] border-b border-slate-200 pb-2">
        {title}
      </h4>
      <div className="space-y-3">
        {items.map((item) => {
          const isActive = activeItems.includes(item);
          return (
            <label key={item} className="flex items-center gap-3 cursor-pointer group select-none">
              <div 
                className={clsx(
                  "w-4 h-4 rounded-sm border transition-all flex items-center justify-center",
                  // Updated to Brand Orange
                  isActive ? "bg-[var(--color-brand-orange)] border-[var(--color-brand-orange)] text-white" : "border-slate-300 bg-white group-hover:border-slate-500"
                )}
              >
                <input 
                  type="checkbox" 
                  className="hidden" 
                  checked={isActive} 
                  onChange={() => onToggle(item)} 
                />
                {isActive && <Check className="w-3 h-3" strokeWidth={4} />}
              </div>
              <span className={clsx(
                "text-xs font-bold transition-colors uppercase tracking-widest line-clamp-1", 
                // Updated active text color
                isActive ? "text-[var(--color-brand-orange)]" : "text-slate-500 group-hover:text-slate-800"
              )}>
                {item}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}