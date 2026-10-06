/**
 * Object Detail Panel
 * Editorial scientific presentation of current object's dimensions and context
 */

import React from 'react';
import { HeightComparisonItem, HUMAN_HEIGHT_METERS } from '../data/heightData';
import { UnitSystem, formatHeight, formatSecondaryHeight, calculateHumanRatio } from '../utils/formatters';
import { ExternalLink, ChevronLeft, ChevronRight, Info, Compass } from 'lucide-react';

interface ObjectDetailPanelProps {
  item: HeightComparisonItem;
  itemIndex: number;
  totalItems: number;
  unit: UnitSystem;
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const ObjectDetailPanel: React.FC<ObjectDetailPanelProps> = ({
  item,
  itemIndex,
  totalItems,
  unit,
  onPrev,
  onNext,
  className = '',
}) => {
  const formattedPrimary = formatHeight(item.heightMeters, unit);
  const formattedSecondary = formatSecondaryHeight(item.heightMeters, unit);
  const ratio = calculateHumanRatio(item.heightMeters);

  return (
    <div
      className={`bg-[#090d16]/90 backdrop-blur-xl border border-white/10 rounded-xl p-3.5 sm:p-4 md:p-4.5 shadow-2xl transition-all duration-300 max-w-md ${className}`}
      role="region"
      aria-label={`Details for ${item.name}`}
    >
      {/* Editorial Chapter Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono font-semibold text-cyan-400">
            {String(itemIndex + 1).padStart(2, '0')}.
          </span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
            {item.category}
          </span>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            disabled={itemIndex === 0}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Previous comparison"
            title="Previous comparison"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-mono text-slate-500 tabular-nums px-1">
            {itemIndex + 1}/{totalItems}
          </span>
          <button
            onClick={onNext}
            disabled={itemIndex === totalItems - 1}
            className="p-1 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 transition-colors cursor-pointer disabled:cursor-not-allowed"
            aria-label="Next comparison"
            title="Next comparison"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Title & Native Subtitle */}
      <div className="mb-2.5">
        <h2 className="text-xl sm:text-2xl font-display font-extrabold tracking-tight text-white leading-tight">
          {item.name}
        </h2>
        {item.nativeName && (
          <p className="text-[11px] font-mono text-slate-400 mt-0.5">
            {item.nativeName}
          </p>
        )}
      </div>

      {/* Large Numeric Height Readout & Calculated Human Scale Ratio */}
      <div className="grid grid-cols-2 gap-2.5 py-2.5 px-3 rounded-lg bg-white/5 border border-white/5 mb-2.5">
        <div>
          <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            Total Height / Elevation
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-cyan-300 tracking-tight tabular-nums">
            {formattedPrimary}
          </div>
          <div className="text-[10px] font-mono text-slate-400 tabular-nums">
            ≈ {formattedSecondary}
          </div>
        </div>

        <div className="border-l border-white/10 pl-3">
          <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-400 mb-0.5">
            Scale vs Human (1.70m)
          </span>
          <div className="text-xl sm:text-2xl font-mono font-extrabold text-amber-300 tracking-tight tabular-nums">
            ≈ {ratio}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            the height of an adult human
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-2.5">
        {item.description}
      </p>

      {/* Measurement Definition Callout */}
      <div className="text-xs text-slate-300 bg-cyan-950/30 border border-cyan-800/40 rounded-lg p-2.5 mb-2.5 space-y-1">
        <div className="flex items-center gap-1 text-cyan-300 font-mono font-semibold text-[10px]">
          <Info className="w-3 h-3 shrink-0" />
          <span>MEASUREMENT DEFINITION:</span>
        </div>
        <p className="text-[10px] text-slate-300 leading-normal">
          {item.heightDefinition}
        </p>
      </div>

      {/* Location & Featured Fact */}
      <div className="space-y-1.5 mb-2.5 text-[11px] font-mono text-slate-400 border-t border-white/5 pt-2">
        <div className="flex items-start gap-1">
          <Compass className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
          <span>{item.location}</span>
        </div>
        {item.featuredFact && (
          <p className="text-[10px] text-slate-300/80 italic font-sans leading-relaxed">
            "{item.featuredFact}"
          </p>
        )}
      </div>

      {/* Source Citation */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/10 pt-2">
        <span className="truncate pr-2">
          Source: <span className="text-slate-400">{item.sourceName}</span>
        </span>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
          title={`View official citation: ${item.sourceName}`}
        >
          <span>Verify</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
