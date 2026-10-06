/**
 * HEIGHTS: Human scale. Extraordinary heights.
 * Main Application Orchestrator
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HEIGHT_ITEMS, HeightComparisonItem } from './data/heightData';
import { UnitSystem } from './utils/formatters';
import { TopNav } from './components/TopNav';
import { HeroSection } from './components/HeroSection';
import { HumanReference } from './components/HumanReference';
import { ScaleRuler } from './components/ScaleRuler';
import { ElevationClimbExperience } from './components/ElevationClimbExperience';
import { ObjectListModal } from './components/ObjectListModal';
import { AFrameScene } from './components/AFrameScene';
import { WebGLFallback } from './components/WebGLFallback';

export default function App() {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [unit, setUnit] = useState<UnitSystem>('metric');
  const [viewMode, setViewMode] = useState<'climb' | 'comparative'>('comparative');
  const [isDirectoryOpen, setIsDirectoryOpen] = useState<boolean>(false);
  const [webGLUnavailable, setWebGLUnavailable] = useState<boolean>(false);
  const [showFallbackNotice, setShowFallbackNotice] = useState<boolean>(false);

  const currentItem = HEIGHT_ITEMS[currentIndex];
  const lastScrollTimeRef = useRef<number>(0);

  // Toggle unit system
  const handleToggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'metric' ? 'imperial' : 'metric'));
  }, []);

  // Toggle view mode
  const handleToggleViewMode = useCallback(() => {
    setViewMode((prev) => (prev === 'comparative' ? 'climb' : 'comparative'));
  }, []);

  // Start exploring from hero section
  const handleStartExploring = useCallback(() => {
    setHasStarted(true);
    setCurrentIndex(1); // Jump to first comparison (Basketball Hoop)
  }, []);

  // Reset to top hero
  const handleResetToTop = useCallback(() => {
    setCurrentIndex(0);
    setHasStarted(false);
  }, []);

  // Wheel scroll event listener for smooth elevation stepping
  useEffect(() => {
    if (!hasStarted) return;

    const handleWheel = (e: WheelEvent) => {
      // Don't intercept if directory modal is open
      if (isDirectoryOpen) return;

      const now = performance.now();
      // Throttle wheel steps so user doesn't jump 10 items in 1 millisecond
      if (now - lastScrollTimeRef.current < 260) return;

      if (Math.abs(e.deltaY) > 28) {
        lastScrollTimeRef.current = now;
        if (e.deltaY > 0) {
          // Scroll down -> ascend to taller object
          setCurrentIndex((prev) => Math.min(HEIGHT_ITEMS.length - 1, prev + 1));
        } else {
          // Scroll up -> descend to shorter object or back to hero
          setCurrentIndex((prev) => {
            if (prev === 0) {
              setHasStarted(false);
              return 0;
            }
            return Math.max(0, prev - 1);
          });
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [hasStarted, isDirectoryOpen]);

  // Touch gesture support for mobile devices
  const touchStartY = useRef<number>(0);
  useEffect(() => {
    if (!hasStarted) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isDirectoryOpen) return;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0) {
          // Swiped up -> ascend
          setCurrentIndex((prev) => Math.min(HEIGHT_ITEMS.length - 1, prev + 1));
        } else {
          // Swiped down -> descend
          setCurrentIndex((prev) => {
            if (prev === 0) {
              setHasStarted(false);
              return 0;
            }
            return Math.max(0, prev - 1);
          });
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [hasStarted, isDirectoryOpen]);

  return (
    <div className="relative min-h-screen w-full bg-[#06080d] text-[#e5e8f0] flex flex-col font-sans overflow-x-hidden select-none">
      {/* 3D A-Frame Visualization Layer */}
      <AFrameScene
        currentItem={currentItem}
        viewMode={viewMode}
        scrollRatio={currentIndex / (HEIGHT_ITEMS.length - 1)}
        onWebGLUnavailable={() => {
          setWebGLUnavailable(true);
          setShowFallbackNotice(true);
        }}
      />

      {/* Top Navigation Bar */}
      <TopNav
        unit={unit}
        onToggleUnit={handleToggleUnit}
        currentIndex={currentIndex}
        totalItems={HEIGHT_ITEMS.length}
        currentCategory={currentItem.category}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onResetToTop={handleResetToTop}
        viewMode={viewMode}
        onToggleViewMode={handleToggleViewMode}
      />

      {/* Persistent Scale Ruler & Altitude Display (when in exploration mode) */}
      {hasStarted && (
        <ScaleRuler
          currentAltitudeMeters={currentItem.heightMeters}
          unit={unit}
        />
      )}

      {/* Stationary Fixed Human Reference (1.70m) */}
      <HumanReference
        unit={unit}
        isHighlighted={currentIndex === 0}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 w-full pt-16 flex flex-col justify-center">
        {!hasStarted ? (
          <HeroSection
            unit={unit}
            onStartExploring={handleStartExploring}
          />
        ) : (
          <ElevationClimbExperience
            currentIndex={currentIndex}
            onSelectIndex={setCurrentIndex}
            unit={unit}
            viewMode={viewMode}
          />
        )}
      </main>

      {/* Object Directory Catalog Modal */}
      <ObjectListModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        currentIndex={currentIndex}
        onSelectIndex={(index) => {
          setCurrentIndex(index);
          setHasStarted(true);
        }}
        unit={unit}
      />

      {/* WebGL Fallback Notification if needed */}
      {showFallbackNotice && (
        <WebGLFallback onDismiss={() => setShowFallbackNotice(false)} />
      )}
    </div>
  );
}
