/**
 * High-Precision Silhouette Viewer
 * Renders the accurate mathematical silhouette comparison
 */

import React, { useMemo } from 'react';
import { HeightComparisonItem, HUMAN_HEIGHT_METERS } from '../data/heightData';
import { UnitSystem, formatHeight, calculateHumanRatio } from '../utils/formatters';

interface SilhouetteViewerProps {
  item: HeightComparisonItem;
  viewMode: 'climb' | 'comparative';
  scrollProgress: number; // 0 to 1 inside current item or global scroll
  unit: UnitSystem;
}

export const SilhouetteViewer: React.FC<SilhouetteViewerProps> = ({
  item,
  viewMode,
  scrollProgress,
  unit,
}) => {
  const ratio = calculateHumanRatio(item.heightMeters);
  const formattedObjHeight = formatHeight(item.heightMeters, unit);
  const formattedHumanHeight = formatHeight(HUMAN_HEIGHT_METERS, unit);

  // Calculate comparative scale heights
  // For comparative view, we fit the object in the viewport container (e.g. max height 540px)
  // and scale the human alongside it
  const maxContainerHeight = 520;
  const objectDisplayHeight = maxContainerHeight;
  const objectDisplayWidth = Math.min(
    480,
    Math.max(60, objectDisplayHeight * item.aspectRatio)
  );

  // Relative human pixel height in comparative view
  // clamp minimum human height to 4px with a magnifier marker if tiny
  const humanComparativeHeight = Math.max(
    3,
    (HUMAN_HEIGHT_METERS / item.heightMeters) * objectDisplayHeight
  );

  return (
    <div className="relative w-full h-[620px] flex items-end justify-center select-none overflow-hidden px-4">
      {/* Background horizontal laser reference lines */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
        {/* Object Apex Reference Line */}
        <div
          className="absolute left-0 right-0 border-b border-dashed flex items-center justify-between px-6 z-10 transition-all duration-300"
          style={{
            bottom: `${objectDisplayHeight + 20}px`,
            borderColor: item.accentColor,
            opacity: 0.6,
          }}
        >
          <span
            className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 border"
            style={{ color: item.accentColor, borderColor: `${item.accentColor}40` }}
          >
            APEX: {formattedObjHeight}
          </span>
          <span
            className="text-[10px] font-mono tracking-widest hidden sm:inline"
            style={{ color: item.accentColor }}
          >
            {item.name.toUpperCase()} · PEAK DATUM
          </span>
        </div>

        {/* 1.70m Human Reference Laser Line */}
        <div
          className="absolute left-0 right-0 border-b border-cyan-500/40 flex items-center justify-between px-6 z-10"
          style={{
            bottom: `${humanComparativeHeight + 20}px`,
          }}
        >
          <span className="text-[9px] font-mono text-cyan-400 bg-black/70 px-1.5 py-0.5 rounded border border-cyan-500/30">
            HUMAN DATUM ({formattedHumanHeight})
          </span>
          <span className="text-[9px] font-mono text-cyan-500/60 hidden sm:inline">
            1.70 M STANDING BASELINE
          </span>
        </div>
      </div>

      {/* Main Ground Baseline Line */}
      <div className="absolute bottom-[20px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.8)] z-20" />
      <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 z-20">
        GROUND BASELINE · 0.0 M
      </div>

      {/* Stage: Side-by-side Human and Comparative Object */}
      <div className="relative z-10 flex items-end gap-8 sm:gap-16 mb-[22px]">
        {/* Human Silhouette in Comparative Proportions */}
        <div className="flex flex-col items-center">
          {/* Zoomed callout indicator if human is very small */}
          {humanComparativeHeight < 24 && (
            <div className="mb-2 flex flex-col items-center animate-pulse">
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40 whitespace-nowrap">
                Human: 1.70m
              </span>
              <div className="w-[1px] h-3 bg-cyan-400" />
            </div>
          )}

          {/* Scaled Human Silhouette */}
          <div
            className="flex items-end justify-center transition-all duration-300"
            style={{
              height: `${humanComparativeHeight}px`,
              width: `${Math.max(4, humanComparativeHeight * 0.42)}px`,
            }}
          >
            <svg
              viewBox="0 0 100 240"
              className="w-full h-full text-cyan-400 drop-shadow-[0_0_4px_rgba(56,189,248,0.6)]"
              fill="currentColor"
            >
              <path d="M 50 18 C 58 18 64 24 64 33 C 64 42 58 48 50 48 C 42 48 36 42 36 33 C 36 24 42 18 50 18 Z
                       M 44 50 L 56 50 L 59 60 L 68 64 L 69 110 L 63 112 L 60 76 L 57 76 L 57 140 L 61 228 L 68 232 L 68 236 L 51 236 L 51 155 L 49 155 L 49 236 L 32 236 L 32 232 L 39 228 L 43 140 L 43 76 L 40 76 L 37 112 L 31 110 L 32 64 L 41 60 Z" />
            </svg>
          </div>

          <span className="text-[10px] font-mono text-cyan-400 mt-1">1.70m</span>
        </div>

        {/* The Comparative Silhouette */}
        <div
          className="relative flex flex-col items-center transition-all duration-500"
          style={{
            height: `${objectDisplayHeight}px`,
            width: `${objectDisplayWidth}px`,
          }}
        >
          {/* Subtle gradient highlight */}
          <div
            className="w-full h-full relative"
            style={{
              filter: `drop-shadow(0 0 18px ${item.accentColor}33)`,
            }}
          >
            <svg
              viewBox={item.viewBox}
              className="w-full h-full text-white transition-all duration-300"
              fill="currentColor"
              preserveAspectRatio="xMidYMax meet"
            >
              <path d={item.svgPath} />
              {item.svgDetails && (
                <path
                  d={item.svgDetails}
                  fill="none"
                  stroke={item.accentColor}
                  strokeWidth="1.5"
                />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
