/**
 * Fixed Human Reference Component
 *
 * Stays stationary in screen-space throughout scrolling.
 * Represents an average adult human (1.70 m / 5.58 ft).
 * Never resizes or distorts to accommodate comparison objects.
 */

import React from 'react';
import { HUMAN_HEIGHT_METERS } from '../data/heightData';
import { UnitSystem, formatHeight } from '../utils/formatters';

interface HumanReferenceProps {
  unit: UnitSystem;
  /** Optional mode toggle or highlight state */
  isHighlighted?: boolean;
  className?: string;
}

export const HumanReference: React.FC<HumanReferenceProps> = ({
  unit,
  isHighlighted = false,
  className = '',
}) => {
  const formattedHeight = formatHeight(HUMAN_HEIGHT_METERS, unit);

  return (
    <div
      className={`fixed bottom-8 left-6 md:left-12 z-40 pointer-events-none select-none transition-opacity duration-300 ${className}`}
      aria-label={`Fixed Human Reference: ${formattedHeight}`}
    >
      <div className="relative flex flex-col items-start">
        {/* Subtle glowing anchor box for dark backgrounds */}
        <div className="pointer-events-auto bg-[#0b0f19]/85 backdrop-blur-md border border-white/10 rounded-lg p-3 shadow-2xl transition-all duration-300 hover:border-cyan-500/40">
          {/* Label Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-cyan-300/90 uppercase">
              Fixed Datum
            </span>
          </div>

          <div className="flex items-end gap-3">
            {/* The canonical SVG human silhouette */}
            <div className="relative flex flex-col items-center">
              {/* Measurement top tick */}
              <div className="w-full flex items-center justify-between text-[9px] font-mono text-cyan-400/80 mb-0.5">
                <span className="h-[1px] w-2 bg-cyan-400/60" />
                <span>1.70m</span>
                <span className="h-[1px] w-2 bg-cyan-400/60" />
              </div>

              {/* Exact full-body human silhouette SVG (canonical height: 72px) */}
              <svg
                width="28"
                height="68"
                viewBox="0 0 100 240"
                className={`transition-colors duration-200 ${
                  isHighlighted ? 'text-cyan-300 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'text-slate-100'
                }`}
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M 50 18 C 58 18 64 24 64 33 C 64 42 58 48 50 48 C 42 48 36 42 36 33 C 36 24 42 18 50 18 Z
                         M 44 50 L 56 50 L 59 60 L 68 64 L 69 110 L 63 112 L 60 76 L 57 76 L 57 140 L 61 228 L 68 232 L 68 236 L 51 236 L 51 155 L 49 155 L 49 236 L 32 236 L 32 232 L 39 228 L 43 140 L 43 76 L 40 76 L 37 112 L 31 110 L 32 64 L 41 60 Z" />
              </svg>

              {/* Baseline indicator */}
              <div className="w-10 h-[2px] bg-cyan-400/80 shadow-[0_0_6px_rgba(56,189,248,0.8)] mt-0.5" />
            </div>

            {/* Typography metadata */}
            <div className="flex flex-col justify-end pb-0.5">
              <span className="text-xs font-semibold tracking-wider text-white">
                HUMAN
              </span>
              <span className="text-sm font-mono font-bold text-cyan-400 tabular-nums">
                {formattedHeight}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                1.0× Reference
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
