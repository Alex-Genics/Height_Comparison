/**
 * Scale Ruler & Atmospheric Elevation Indicator
 * Displays the continuous altitude tape, tick markers, and atmospheric strata
 */

import React from 'react';
import { UnitSystem, formatHeight, getAtmosphericLayer } from '../utils/formatters';

interface ScaleRulerProps {
  currentAltitudeMeters: number;
  unit: UnitSystem;
  className?: string;
}

export const ScaleRuler: React.FC<ScaleRulerProps> = ({
  currentAltitudeMeters,
  unit,
  className = '',
}) => {
  const layer = getAtmosphericLayer(currentAltitudeMeters);
  const formattedAlt = formatHeight(currentAltitudeMeters, unit);

  return (
    <div
      className={`fixed top-14 right-3 sm:right-6 z-40 pointer-events-none select-none flex flex-col items-end ${className}`}
      aria-label="Altitude Telemetry"
    >
      {/* Current Altitude Box */}
      <div className="bg-[#090d16]/85 backdrop-blur-md border border-white/10 rounded-lg p-2.5 shadow-xl flex flex-col items-end">
        <div className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest text-slate-400">
          <span>Target Elevation</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>

        <div className="text-lg sm:text-xl font-mono font-extrabold text-cyan-300 tabular-nums">
          {formattedAlt}
        </div>

        {/* Atmospheric Layer Tag */}
        <div className="mt-1 pt-1 border-t border-white/5 text-right">
          <div
            className="text-[9px] font-mono font-semibold uppercase tracking-wider"
            style={{ color: layer.color }}
          >
            {layer.name}
          </div>
          <div className="hidden sm:block text-[8px] text-slate-400 font-sans max-w-[170px] leading-tight mt-0.5">
            {layer.desc}
          </div>
        </div>
      </div>
    </div>
  );
};
