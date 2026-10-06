/**
 * A-Frame 1.8.0 3D Visualization Layer
 *
 * Provides the immersive 3D WebGL environment:
 * - Orthographic-aligned camera setup for true proportional height comparison
 * - Shared ground baseline and laser elevation datum marks
 * - Persistent human reference entity
 * - Comparison object entity with dynamic silhouette texture
 * - Atmospheric sky and volumetric lighting
 */

import React, { useEffect, useRef, useState } from 'react';
import { HeightComparisonItem, HUMAN_HEIGHT_METERS } from '../data/heightData';
import {
  registerAFrameComponents,
  renderSvgToCanvas,
  getHumanSilhouetteTexture,
} from './aframe/aframeComponents';

interface AFrameSceneProps {
  currentItem: HeightComparisonItem;
  viewMode: 'climb' | 'comparative';
  scrollRatio: number;
  onWebGLUnavailable?: () => void;
}

export const AFrameScene: React.FC<AFrameSceneProps> = ({
  currentItem,
  viewMode,
  scrollRatio,
  onWebGLUnavailable,
}) => {
  const sceneRef = useRef<any>(null);
  const cameraElRef = useRef<any>(null);
  const comparisonElRef = useRef<any>(null);
  const [objectTexture, setObjectTexture] = useState<string>('');
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // Initialize A-Frame components once
  useEffect(() => {
    try {
      // Test WebGL support
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        if (onWebGLUnavailable) onWebGLUnavailable();
        return;
      }
      registerAFrameComponents();
    } catch (e) {
      console.warn('WebGL initialization check:', e);
      setWebGLSupported(false);
      if (onWebGLUnavailable) onWebGLUnavailable();
    }
  }, [onWebGLUnavailable]);

  // Generate crisp silhouette texture whenever currentItem changes
  useEffect(() => {
    try {
      const tex = renderSvgToCanvas(
        currentItem.svgPath,
        currentItem.svgDetails,
        currentItem.viewBox,
        512,
        1024,
        '#ffffff',
        currentItem.accentColor
      );
      setObjectTexture(tex);
    } catch (err) {
      console.error('Failed to generate silhouette texture:', err);
    }
  }, [currentItem]);

  // Update comparison entity and camera smoothly
  useEffect(() => {
    if (!comparisonElRef.current) return;
    const compEl = comparisonElRef.current;

    // Update comparison object component properties
    compEl.setAttribute('comparison-object', {
      objectId: currentItem.id,
      heightMeters: currentItem.heightMeters,
      aspectRatio: currentItem.aspectRatio,
      textureSrc: objectTexture,
      accentColor: currentItem.accentColor,
    });

    // Camera positioning based on view mode and item height
    if (cameraElRef.current) {
      const cam = cameraElRef.current;
      const h = currentItem.heightMeters;

      if (viewMode === 'comparative') {
        // Fit both human (at x=-2) and object (at x=3) in orthographic-style framing
        // Center vertical camera at h/2, distance proportional to height
        const targetY = Math.max(1.8, h * 0.48);
        const targetZ = Math.max(5.5, h * 1.35);
        cam.setAttribute('position', `0.5 ${targetY} ${targetZ}`);
      } else {
        // 1:1 Climb mode: camera elevates as user scrolls through the structure
        const targetY = 1.2 + scrollRatio * Math.max(h * 0.9, 2);
        const targetZ = Math.max(4.5, Math.min(18, h * 0.35));
        cam.setAttribute('position', `0.5 ${targetY} ${targetZ}`);
      }
    }
  }, [currentItem, objectTexture, viewMode, scrollRatio]);

  if (!webGLSupported) {
    return null;
  }

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      {/* A-Frame scene */}
      <a-scene
        ref={sceneRef}
        embedded
        vr-mode-ui="enabled: false"
        renderer="antialias: true; alpha: true; precision: medium;"
        className="w-full h-full"
      >
        {/* Assets preload */}
        <a-assets>
          <img id="human-tex" src={getHumanSilhouetteTexture()} alt="human" />
        </a-assets>

        {/* Ambient & directional lighting for atmospheric clarity */}
        <a-light type="ambient" color="#334155" intensity="1.2"></a-light>
        <a-light
          type="directional"
          color="#94a3b8"
          position="-2 10 5"
          intensity="1.0"
        ></a-light>
        <a-light
          type="point"
          color={currentItem.accentColor}
          position={`1 ${Math.min(10, currentItem.heightMeters)} 3`}
          intensity="0.8"
        ></a-light>

        {/* Camera Entity */}
        <a-entity
          ref={cameraElRef}
          position="0.5 1.5 5.5"
          camera="fov: 48; near: 0.1; far: 50000"
          wasd-controls="enabled: false"
          look-controls="enabled: false"
        ></a-entity>

        {/* Ground grid / laser baseline */}
        <a-entity position="0 0 0">
          {/* Main baseline laser line */}
          <a-plane
            width="200"
            height="0.08"
            position="0 0 0"
            material="color: #38bdf8; opacity: 0.7; shader: flat; side: double;"
          ></a-plane>
          {/* Subtle ground plane */}
          <a-plane
            width="200"
            height="100"
            rotation="-90 0 0"
            position="0 -0.05 0"
            material="color: #070a12; opacity: 0.95; shader: flat;"
          ></a-plane>
        </a-entity>

        {/* Human Reference Entity anchored at x = -2.2 in 3D world space */}
        <a-entity
          id="human-ref-entity"
          position="-2.2 0 0"
          human-reference="height: 1.70; color: #38bdf8"
        ></a-entity>

        {/* Comparison Object Entity positioned at x = 2.0 in 3D world space */}
        <a-entity
          ref={comparisonElRef}
          id="comparison-object-entity"
          position="2.0 0 0"
          comparison-object
        ></a-entity>
      </a-scene>
    </div>
  );
};
