import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const STATUS_MESSAGES = [
  'Reading patient vitals...',
  'Standardizing clinical parameters...',
  'Running Random Forest risk model...',
  'Computing SHAP factor impact matrix...',
  'Finalizing clinical classification...'
];

export default function LoadingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-fade-in">
      <div className="liquid-glass liquid-glass-specular rounded-3xl p-8 sm:p-12 max-w-md w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Glowing Red Fluid Blob */}
        <div className="absolute w-48 h-48 rounded-full bg-cardio-crimson/25 blur-3xl animate-blob-float pointer-events-none"></div>

        {/* Pulsing Heart Animation */}
        <div className="relative w-32 h-32 flex items-center justify-center mb-6">
          <Heart
            className="w-20 h-20 text-cardio-crimson animate-lub-dub drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]"
            fill="currentColor"
          />
          <div className="absolute inset-0 border-2 border-dashed border-cardio-red/30 rounded-full animate-spin" style={{ animationDuration: '8s' }}></div>
        </div>

        {/* Sweeping ECG Rhythm Line */}
        <div className="w-56 h-8 mb-4 overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 300 50" className="w-full h-full">
            <path
              d="M 0 25 L 50 25 L 60 10 L 70 40 L 80 5 L 90 35 L 100 25 L 170 25 L 180 10 L 190 40 L 200 5 L 210 35 L 220 25 L 300 25"
              fill="none"
              stroke="#FF0000"
              strokeWidth="3"
              strokeLinecap="round"
              className="animate-ecg-dash"
              strokeDasharray="80 20"
            />
          </svg>
        </div>

        {/* Rotating Status Indicator */}
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 min-h-[28px] transition-all">
          {STATUS_MESSAGES[statusIndex]}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Processing real-time inference on tree ensemble
        </p>

        {/* Progress bar */}
        <div className="w-48 h-1.5 rounded-full neu-inset mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cardio-maroon via-cardio-crimson to-cardio-red w-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
