/**
 * Object Directory Modal
 * Full catalog of all 28 height comparisons with search and instant navigation
 */

import React, { useState, useMemo } from 'react';
import { HEIGHT_ITEMS, HeightComparisonItem } from '../data/heightData';
import { UnitSystem, formatHeight, calculateHumanRatio } from '../utils/formatters';
import { X, Search, ChevronRight } from 'lucide-react';

interface ObjectListModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  unit: UnitSystem;
}

export const ObjectListModal: React.FC<ObjectListModalProps> = ({
  isOpen,
  onClose,
  currentIndex,
  onSelectIndex,
  unit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    set.add('All');
    HEIGHT_ITEMS.forEach((item) => set.add(item.category));
    return Array.from(set);
  }, []);

  // Filtered items
  const filteredItems = useMemo(() => {
    return HEIGHT_ITEMS.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.nativeName && item.nativeName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="directory-title"
    >
      <div className="relative w-full max-w-3xl max-h-[82vh] bg-[#090d16] border border-white/10 rounded-xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 id="directory-title" className="text-lg font-display font-bold text-white">
              Scale Directory
            </h2>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">
              28 verified height comparisons from human scale to outer space
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close directory"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="p-3 border-b border-white/5 space-y-2.5 bg-white/[0.02]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, location, or landmark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0c101c] border border-white/10 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono transition-colors"
            />
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Item List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-slate-500 font-mono text-xs">
              No comparisons match your criteria.
            </div>
          ) : (
            filteredItems.map((item) => {
              const originalIndex = HEIGHT_ITEMS.findIndex((i) => i.id === item.id);
              const isSelected = originalIndex === currentIndex;
              const formatted = formatHeight(item.heightMeters, unit);
              const ratio = calculateHumanRatio(item.heightMeters);

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectIndex(originalIndex);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
                      : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[11px] font-mono font-semibold text-slate-500 tabular-nums w-5">
                      {String(originalIndex + 1).padStart(2, '0')}.
                    </span>

                    {/* Mini Silhouette Thumbnail */}
                    <div className="w-7 h-7 flex items-center justify-center bg-black/40 rounded border border-white/5 p-0.5 shrink-0">
                      <svg
                        viewBox={item.viewBox}
                        className="w-full h-full text-slate-200"
                        fill="currentColor"
                      >
                        <path d={item.svgPath} />
                      </svg>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-white">
                          {item.name}
                        </span>
                        {item.isAltitudeReference && (
                          <span className="text-[9px] font-mono text-cyan-400">
                            [Atmospheric Datum]
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.category} · {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right shrink-0">
                    <div>
                      <div className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
                        {formatted}
                      </div>
                      <div className="text-[10px] font-mono text-amber-300 tabular-nums">
                        ≈ {ratio}
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
