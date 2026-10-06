/**
 * Hero Section: "HOW TALL IS TALL?"
 * Introduction to the vertical journey of human scale
 */

import React from 'react';
import { UnitSystem, formatHeight } from '../utils/formatters';
import { HUMAN_HEIGHT_METERS } from '../data/heightData';
import { ChevronDown, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  unit: UnitSystem;
  onStartExploring: () => void;
  backdropUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  unit,
  onStartExploring,
  backdropUrl,
}) => {
  const formattedHumanHeight = formatHeight(HUMAN_HEIGHT_METERS, unit);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 pt-20 pb-8 overflow-hidden bg-[#06080d]">
      {/* Optional atmospheric backdrop image */}
      {backdropUrl && (
        <div
          className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-screen pointer-events-none"
          style={{ backgroundImage: `url(${backdropUrl})` }}
        />
      )}

      {/* Atmospheric radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-cyan-600/10 rounded-full blur-[110px] pointer-events-none" />

      {/* Hero Typography */}
      <div className="relative z-10 max-w-3xl text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-400/90">
          <span className="w-1.5 h-[1px] bg-cyan-400" />
          Vertical Scale Exploration
          <span className="w-1.5 h-[1px] bg-cyan-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.05] text-balance">
          HOW TALL IS TALL?
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-300 font-light tracking-wide max-w-xl mx-auto text-balance">
          One human. A world of extraordinary scale.
        </p>

        <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed pt-1">
          From the basketball hoop above your head to ancient pyramids, megatall skyscrapers, Earth’s highest mountain peaks, and the cosmic boundary of space.
        </p>
      </div>

      {/* The Central Human Silhouette Anchor Preview scaled to 75% */}
      <div className="relative z-10 flex flex-col items-center my-4 group">
        {/* Vertical measurement guide line */}
        <div className="relative flex flex-col items-center">
          <span className="text-[10px] font-mono text-cyan-400/90 mb-0.5 tracking-wider">
            {formattedHumanHeight}
          </span>
          <div className="w-18 h-[1px] bg-cyan-500/50" />

          {/* Canonical 1.70m silhouette scaled to 82px (vs 110px) */}
          <div className="relative py-1.5">
            <svg
              width="33"
              height="82"
              viewBox="0 0 100 240"
              className="text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105"
              fill="currentColor"
            >
              <path d="M 50 18 C 58 18 64 24 64 33 C 64 42 58 48 50 48 C 42 48 36 42 36 33 C 36 24 42 18 50 18 Z
                       M 44 50 L 56 50 L 59 60 L 68 64 L 69 110 L 63 112 L 60 76 L 57 76 L 57 140 L 61 228 L 68 232 L 68 236 L 51 236 L 51 155 L 49 155 L 49 236 L 32 236 L 32 232 L 39 228 L 43 140 L 43 76 L 40 76 L 37 112 L 31 110 L 32 64 L 41 60 Z" />
            </svg>
          </div>

          <div className="w-24 h-[1.5px] bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]" />
          <span className="text-[9px] font-mono tracking-widest text-slate-400 mt-1 uppercase">
            Human Baseline Datum
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 flex flex-col items-center gap-2.5">
        <button
          onClick={onStartExploring}
          className="group flex items-center gap-2.5 px-6 py-3 bg-white text-[#06080d] hover:bg-cyan-300 text-xs font-mono font-bold tracking-wider rounded-lg transition-all duration-300 shadow-[0_0_18px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(56,189,248,0.4)] cursor-pointer"
        >
          <span>START EXPLORING</span>
          <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-1" />
        </button>

        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 animate-bounce">
          <ChevronDown className="w-3 h-3 text-cyan-400" />
          Scroll to ascend through scale
        </span>
      </div>
    </section>
  );
};
