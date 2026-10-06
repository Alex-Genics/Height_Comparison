/**
 * Elevation Climb Experience
 * The scroll-driven height journey through all 28 comparison objects
 */

import React, { useRef, useEffect } from 'react';
import { HEIGHT_ITEMS, HeightComparisonItem } from '../data/heightData';
import { UnitSystem, formatHeight, calculateHumanRatio } from '../utils/formatters';
import { SilhouetteViewer } from './SilhouetteViewer';
import { ObjectDetailPanel } from './ObjectDetailPanel';
import { ArrowDown, ArrowUp, Compass } from 'lucide-react';

interface ElevationClimbExperienceProps {
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  unit: UnitSystem;
  viewMode: 'climb' | 'comparative';
}

export const ElevationClimbExperience: React.FC<ElevationClimbExperienceProps> = ({
  currentIndex,
  onSelectIndex,
  unit,
  viewMode,
}) => {
  const currentItem = HEIGHT_ITEMS[currentIndex];
  const containerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation: Arrow Up / Arrow Down or Left / Right
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (currentIndex < HEIGHT_ITEMS.length - 1) {
          e.preventDefault();
          onSelectIndex(currentIndex + 1);
        }
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentIndex > 0) {
          e.preventDefault();
          onSelectIndex(currentIndex - 1);
        }
      } else if (e.key === 'Home') {
        e.preventDefault();
        onSelectIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        onSelectIndex(HEIGHT_ITEMS.length - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, onSelectIndex]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-3rem)] flex flex-col justify-between items-center py-3.5 px-3 md:px-6 z-10"
    >
      {/* Dynamic Background Atmosphere Glow based on object altitude */}
      <div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 -z-10"
        style={{
          background:
            currentItem.heightMeters < 100
              ? 'radial-gradient(ellipse at 50% 90%, rgba(14, 165, 233, 0.08) 0%, rgba(6, 8, 14, 0.95) 100%)'
              : currentItem.heightMeters < 1000
              ? 'radial-gradient(ellipse at 50% 90%, rgba(56, 189, 248, 0.12) 0%, rgba(7, 10, 18, 0.98) 100%)'
              : currentItem.heightMeters < 15000
              ? 'radial-gradient(ellipse at 50% 90%, rgba(99, 102, 241, 0.14) 0%, rgba(5, 7, 15, 0.98) 100%)'
              : 'radial-gradient(ellipse at 50% 90%, rgba(168, 85, 247, 0.12) 0%, rgba(3, 3, 7, 1) 100%)',
        }}
      />

      {/* Main Exhibition Stage */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center my-auto">
        {/* Left / Center: Silhouette Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center order-2 lg:order-1">
          <SilhouetteViewer
            item={currentItem}
            viewMode={viewMode}
            scrollProgress={0}
            unit={unit}
          />
        </div>

        {/* Right Column: Editorial Scientific Information Panel */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
          <ObjectDetailPanel
            item={currentItem}
            itemIndex={currentIndex}
            totalItems={HEIGHT_ITEMS.length}
            unit={unit}
            onPrev={() => onSelectIndex(Math.max(0, currentIndex - 1))}
            onNext={() => onSelectIndex(Math.min(HEIGHT_ITEMS.length - 1, currentIndex + 1))}
            className="w-full"
          />
        </div>
      </div>

      {/* Bottom Horizontal Quick-Scrubber Timeline Bar */}
      <div className="w-full max-w-4xl mt-3 pt-2.5 border-t border-white/10 flex flex-col items-center gap-1.5 select-none">
        <div className="w-full flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-cyan-400 font-semibold">
            <span>01. HUMAN (1.70M)</span>
          </span>
          <span className="hidden sm:inline text-slate-500">
            Use keys [↑] [↓] or scroll wheel to ascend through scale
          </span>
          <span className="flex items-center gap-1 text-purple-400 font-semibold">
            <span>28. KÁRMÁN LINE (100 KM)</span>
          </span>
        </div>

        {/* Visual Progress Track */}
        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-sky-400 to-purple-500 transition-all duration-300 rounded-full"
            style={{
              width: `${((currentIndex + 1) / HEIGHT_ITEMS.length) * 100}%`,
            }}
          />
        </div>

        {/* Segmented clickable ticks */}
        <div className="w-full flex justify-between pt-0.5">
          {HEIGHT_ITEMS.map((item, idx) => {
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => onSelectIndex(idx)}
                className={`h-3.5 transition-all duration-200 cursor-pointer flex flex-col items-center group ${
                  isCurrent ? 'opacity-100 scale-125' : 'opacity-35 hover:opacity-80'
                }`}
                title={`${String(idx + 1).padStart(2, '0')}. ${item.name} (${formatHeight(
                  item.heightMeters,
                  unit
                )})`}
              >
                <span
                  className={`w-[1.5px] transition-all ${
                    isCurrent ? 'h-2.5 bg-cyan-400' : 'h-1.5 bg-slate-400 group-hover:h-2'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
