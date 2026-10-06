/**
 * Type declarations for A-Frame in TypeScript and React 19 JSX
 */

import React from 'react';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'a-scene': any;
        'a-entity': any;
        'a-camera': any;
        'a-plane': any;
        'a-box': any;
        'a-sphere': any;
        'a-cylinder': any;
        'a-sky': any;
        'a-light': any;
        'a-assets': any;
        'a-asset-item': any;
        'a-image': any;
        'a-text': any;
        'a-cursor': any;
      }
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any;
      'a-entity': any;
      'a-camera': any;
      'a-plane': any;
      'a-box': any;
      'a-sphere': any;
      'a-cylinder': any;
      'a-sky': any;
      'a-light': any;
      'a-assets': any;
      'a-asset-item': any;
      'a-image': any;
      'a-text': any;
      'a-cursor': any;
    }
  }

  interface Window {
    AFRAME: any;
  }
  const AFRAME: any;
}

export {};
