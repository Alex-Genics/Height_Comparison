/**
 * Top Navigation Bar
 * Follows the 3-Zone Top Bar Contract
 */

import React from 'react';
import { UnitSystem } from '../utils/formatters';
import { Layers, ArrowUpDown, Compass } from 'lucide-react';

interface TopNavProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  currentIndex: number;
  totalItems: number;
  currentCategory: string;
  onOpenDirectory: () => void;
  onResetToTop: () => void;
  viewMode: 'climb' | 'comparative';
  onToggleViewMode: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  unit,
  onToggleUnit,
  currentIndex,
  totalItems,
  currentCategory,
  onOpenDirectory,
  onResetToTop,
  viewMode,
  onToggleViewMode,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#07090e]/85 backdrop-blur-md border-b border-white/10 px-4 md:px-8 flex items-center justify-between transition-colors">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3">
        <button
          onClick={onResetToTop}
          className="group text-left text-lg md:text-xl font-display font-extrabold tracking-wider text-white hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap"
          title="Return to origin"
        >
          HEIGHTS
          <span className="hidden sm:inline-block ml-2 text-[10px] font-mono font-normal tracking-widest text-slate-400 uppercase">
            Human Scale
          </span>
        </button>
      </div>

      {/* Zone 2: Navigation & Progress Telemetry */}
      <div className="hidden lg:flex items-center gap-6 text-xs text-slate-300 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">CATEGORY:</span>
          <span className="text-slate-200 uppercase tracking-wider">{currentCategory}</span>
        </div>
        <span aria-hidden="true" className="text-slate-700">|</span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">PROGRESS:</span>
          <span className="text-cyan-400 tabular-nums">
            {currentIndex + 1} / {totalItems}
          </span>
        </div>
      </div>

      {/* Zone 3: Functional Interactive Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* View Mode Toggle */}
        <button
          onClick={onToggleViewMode}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all cursor-pointer whitespace-nowrap"
          title={viewMode === 'climb' ? 'Switch to Side-by-Side Scale' : 'Switch to Vertical Elevation Climb'}
        >
          <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">
            {viewMode === 'climb' ? '1:1 Climb Mode' : 'Comparative Lens'}
          </span>
        </button>

        {/* Unit Toggle: Metric / Imperial */}
        <button
          onClick={onToggleUnit}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-semibold rounded border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all cursor-pointer whitespace-nowrap"
          title="Toggle Metric (Meters) and Imperial (Feet)"
        >
          <span className={unit === 'metric' ? 'text-cyan-400 font-bold' : 'text-slate-400'}>M</span>
          <span className="text-slate-600">/</span>
          <span className={unit === 'imperial' ? 'text-cyan-400 font-bold' : 'text-slate-400'}>FT</span>
        </button>

        {/* Directory / All Objects Modal */}
        <button
          onClick={onOpenDirectory}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 transition-all cursor-pointer whitespace-nowrap"
          title="Open Comparison Catalog"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Directory</span>
          <span className="sm:hidden font-mono">{currentIndex + 1}/{totalItems}</span>
        </button>
      </div>
    </header>
  );
};
