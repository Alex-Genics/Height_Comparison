/**
 * Mathematical & Formatting Utilities for HEIGHTS
 */

import { HUMAN_HEIGHT_METERS } from '../data/heightData';

export type UnitSystem = 'metric' | 'imperial';

/** Format height in current unit system */
export function formatHeight(meters: number, unit: UnitSystem = 'metric'): string {
  if (unit === 'imperial') {
    const feet = meters * 3.28084;
    if (feet >= 5280) {
      const miles = feet / 5280;
      return `${miles.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} MI`;
    }
    return `${feet.toLocaleString('en-US', { minimumFractionDigits: feet < 20 ? 1 : 0, maximumFractionDigits: 1 })} FT`;
  }

  // Metric
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toLocaleString('en-US', { minimumFractionDigits: km < 10 ? 2 : 1, maximumFractionDigits: 2 })} KM`;
  }
  return `${meters.toLocaleString('en-US', { minimumFractionDigits: meters < 10 ? 2 : meters < 100 ? 1 : 0, maximumFractionDigits: 2 })} M`;
}

/** Format secondary unit for dual display */
export function formatSecondaryHeight(meters: number, primaryUnit: UnitSystem): string {
  const secondaryUnit = primaryUnit === 'metric' ? 'imperial' : 'metric';
  return formatHeight(meters, secondaryUnit);
}

/** Calculate exact ratio compared to the 1.70m human */
export function calculateHumanRatio(meters: number): string {
  const ratio = meters / HUMAN_HEIGHT_METERS;
  if (ratio < 1.05) return '1.0×';
  if (ratio < 10) return `${ratio.toFixed(2)}×`;
  if (ratio < 100) return `${ratio.toFixed(1)}×`;
  if (ratio < 1000) return `${Math.round(ratio).toLocaleString('en-US')}×`;
  return `${(ratio / 1000).toFixed(1)}k×`;
}

/** Determine atmosphere layer name for a given altitude */
export function getAtmosphericLayer(meters: number): { name: string; color: string; desc: string } {
  if (meters < 12000) {
    return {
      name: 'Troposphere (Ground – 12 km)',
      color: '#38bdf8',
      desc: 'Contains 80% of atmospheric mass and virtually all earthly weather.',
    };
  } else if (meters < 50000) {
    return {
      name: 'Stratosphere (12 – 50 km)',
      color: '#818cf8',
      desc: 'Contains the ozone layer; dry and calm, home to supersonic flight.',
    };
  } else if (meters < 85000) {
    return {
      name: 'Mesosphere (50 – 85 km)',
      color: '#c084fc',
      desc: 'Meteors burn upon entry; temperatures drop to –90°C.',
    };
  } else if (meters <= 100000) {
    return {
      name: 'Thermosphere / Kármán Line (85 – 100+ km)',
      color: '#f43f5e',
      desc: 'Edge of space. Auroras glow here as solar radiation ionizes thin atmospheric gases.',
    };
  }
  return {
    name: 'Outer Space / Exosphere',
    color: '#a855f7',
    desc: 'Vacuum of space beyond the 100 km Kármán line boundary.',
  };
}
