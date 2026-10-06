/**
 * WebGL Fallback Notification & Mode
 * Rendered when WebGL is not available on client device
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';

interface WebGLFallbackProps {
  onDismiss?: () => void;
}

export const WebGLFallback: React.FC<WebGLFallbackProps> = ({ onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-slate-900/95 border border-amber-500/30 text-slate-200 text-xs p-3 rounded-lg shadow-xl flex items-start gap-2.5 backdrop-blur-md">
      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-amber-200">2D Precision Mode Active</p>
        <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
          WebGL 3D acceleration is currently disabled or unsupported. High-precision vector SVG scale rendering is active.
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-500 hover:text-slate-300 ml-auto cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
};
