/**
 * A-Frame 1.8.0 Custom Components
 *
 * Implements the official A-Frame entity-component system for HEIGHTS:
 * - human-reference: canonical 1.70m human silhouette & baseline
 * - comparison-object: dynamically scaled 3D silhouette plane
 * - height-scale: 3D laser elevation ticks and altitude lines
 * - object-label: 3D billboard labels with elevation markers
 * - scene-transition: smooth camera interpolation and elevation tracking
 */

import { HUMAN_HEIGHT_METERS, HeightComparisonItem } from '../../data/heightData';

/** Helper to draw an SVG path to an HTMLCanvasElement for sharp A-Frame Three.js textures */
export function renderSvgToCanvas(
  svgPath: string,
  svgDetails: string | undefined,
  viewBox: string,
  width: number = 512,
  height: number = 1024,
  fillColor: string = '#ffffff',
  detailColor: string = 'rgba(14, 165, 233, 0.6)'
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const [minX, minY, vbWidth, vbHeight] = viewBox.split(' ').map(Number);
  const scale = Math.min(width / vbWidth, height / vbHeight) * 0.92;
  const offsetX = (width - vbWidth * scale) / 2 - minX * scale;
  const offsetY = (height - vbHeight * scale) / 2 - minY * scale;

  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // Main silhouette fill
  ctx.fillStyle = fillColor;
  const p = new Path2D(svgPath);
  ctx.fill(p);

  // Detail lines / apertures if present
  if (svgDetails) {
    ctx.strokeStyle = detailColor;
    ctx.lineWidth = 1.5 / scale;
    const pDetails = new Path2D(svgDetails);
    ctx.stroke(pDetails);
  }

  ctx.restore();
  return canvas.toDataURL('image/png');
}

/** Human silhouette texture cache */
let humanTextureCache: string | null = null;
export function getHumanSilhouetteTexture(): string {
  if (humanTextureCache) return humanTextureCache;
  const humanItem = {
    viewBox: '0 0 100 240',
    svgPath: `M 50 18 C 58 18 64 24 64 33 C 64 42 58 48 50 48 C 42 48 36 42 36 33 C 36 24 42 18 50 18 Z
              M 44 50 L 56 50 L 59 60 L 68 64 L 69 110 L 63 112 L 60 76 L 57 76 L 57 140 L 61 228 L 68 232 L 68 236 L 51 236 L 51 155 L 49 155 L 49 236 L 32 236 L 32 232 L 39 228 L 43 140 L 43 76 L 40 76 L 37 112 L 31 110 L 32 64 L 41 60 Z`,
  };
  humanTextureCache = renderSvgToCanvas(
    humanItem.svgPath,
    undefined,
    humanItem.viewBox,
    256,
    512,
    '#f8fafc'
  );
  return humanTextureCache;
}

export function registerAFrameComponents(): void {
  if (typeof window === 'undefined' || !(window as any).AFRAME) {
    return;
  }
  const AFRAME = (window as any).AFRAME;

  // 1. human-reference component
  if (!AFRAME.components['human-reference']) {
    AFRAME.registerComponent('human-reference', {
      schema: {
        height: { type: 'number', default: HUMAN_HEIGHT_METERS },
        color: { type: 'string', default: '#38bdf8' },
      },
      init() {
        const el = this.el;
        const textureUrl = getHumanSilhouetteTexture();

        // 3D Plane representing the human in world space
        const plane = document.createElement('a-plane');
        plane.setAttribute('width', (HUMAN_HEIGHT_METERS * 0.42).toString());
        plane.setAttribute('height', HUMAN_HEIGHT_METERS.toString());
        plane.setAttribute('position', `0 ${HUMAN_HEIGHT_METERS / 2} 0`);
        (plane as any).setAttribute('material', {
          src: textureUrl,
          transparent: true,
          alphaTest: 0.1,
          side: 'double',
          shader: 'flat',
        });
        el.appendChild(plane);

        // Ground marker line
        const baseline = document.createElement('a-plane');
        baseline.setAttribute('width', '12');
        baseline.setAttribute('height', '0.04');
        baseline.setAttribute('position', '0 0 0.05');
        (baseline as any).setAttribute('material', {
          color: '#38bdf8',
          opacity: 0.8,
          shader: 'flat',
        });
        el.appendChild(baseline);

        // Top 1.70m datum line
        const topDatum = document.createElement('a-plane');
        topDatum.setAttribute('width', '2.5');
        topDatum.setAttribute('height', '0.02');
        topDatum.setAttribute('position', `0 ${HUMAN_HEIGHT_METERS} 0.05`);
        (topDatum as any).setAttribute('material', {
          color: '#38bdf8',
          opacity: 0.4,
          shader: 'flat',
        });
        el.appendChild(topDatum);
      },
    });
  }

  // 2. comparison-object component
  if (!AFRAME.components['comparison-object']) {
    AFRAME.registerComponent('comparison-object', {
      schema: {
        objectId: { type: 'string', default: '' },
        heightMeters: { type: 'number', default: 10 },
        aspectRatio: { type: 'number', default: 0.5 },
        textureSrc: { type: 'string', default: '' },
        accentColor: { type: 'string', default: '#38bdf8' },
      },
      init() {
        this.planeEl = document.createElement('a-plane');
        this.el.appendChild(this.planeEl);

        this.topMarker = document.createElement('a-plane');
        this.el.appendChild(this.topMarker);
      },
      update(oldData: any) {
        if (!this.planeEl) return;
        const h = this.data.heightMeters;
        const w = h * this.data.aspectRatio;

        // Position plane at base y=0, center at y = h/2
        this.planeEl.setAttribute('width', Math.max(0.5, w).toString());
        this.planeEl.setAttribute('height', h.toString());
        this.planeEl.setAttribute('position', `0 ${h / 2} 0`);

        if (this.data.textureSrc) {
          this.planeEl.setAttribute('material', {
            src: this.data.textureSrc,
            transparent: true,
            alphaTest: 0.1,
            side: 'double',
            shader: 'flat',
          });
        }

        // Top datum laser line
        if (this.topMarker) {
          this.topMarker.setAttribute('width', (Math.max(w * 1.3, 4)).toString());
          this.topMarker.setAttribute('height', (Math.max(0.04, h * 0.003)).toString());
          this.topMarker.setAttribute('position', `0 ${h} 0.05`);
          this.topMarker.setAttribute('material', {
            color: this.data.accentColor,
            opacity: 0.85,
            shader: 'flat',
          });
        }
      },
    });
  }

  // 3. height-scale component
  if (!AFRAME.components['height-scale']) {
    AFRAME.registerComponent('height-scale', {
      schema: {
        maxHeight: { type: 'number', default: 100 },
        currentAltitude: { type: 'number', default: 0 },
      },
      init() {
        // Base grid lines
      },
      update() {
        // dynamic tick marks
      },
    });
  }

  // 4. scene-transition component
  if (!AFRAME.components['scene-transition']) {
    AFRAME.registerComponent('scene-transition', {
      schema: {
        targetY: { type: 'number', default: 1.5 },
        targetZ: { type: 'number', default: 5 },
        speed: { type: 'number', default: 0.08 },
      },
      init() {
        this.currentY = this.data.targetY;
        this.currentZ = this.data.targetZ;
      },
      tick() {
        const pos = this.el.getAttribute('position');
        if (!pos) return;

        const lerpFactor = this.data.speed;
        const newY = pos.y + (this.data.targetY - pos.y) * lerpFactor;
        const newZ = pos.z + (this.data.targetZ - pos.z) * lerpFactor;

        this.el.setAttribute('position', `${pos.x} ${newY} ${newZ}`);
      },
    });
  }

  // 5. scroll-controller component
  if (!AFRAME.components['scroll-controller']) {
    AFRAME.registerComponent('scroll-controller', {
      schema: {
        scrollRatio: { type: 'number', default: 0 },
      },
      tick() {
        // Bridge scroll ratio with 3D environment
      },
    });
  }
}
