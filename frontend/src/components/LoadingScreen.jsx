import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';

const STATUS_MESSAGES = [
  'Reading vitals',
  'Running risk model',
  'Computing factor impact',
  'Preparing your report'
];

export default function LoadingScreen() {
  const [statusIndex, setStatusIndex] = useState(0);
  const [progress, setProgress] = useState(12);

  // Crossfade status messages every 900ms
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % STATUS_MESSAGES.length);
    }, 900);
    return () => clearInterval(statusInterval);
  }, []);

  // Smooth circular progress arc easing out near 90%
  useEffect(() => {
    const startTime = performance.now();
    const duration = 1600; // ms

    const animateProgress = (currentTime) => {
      const elapsed = currentTime - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutExpo curve targeting ~92%
      const currentVal = 10 + (82 * (1 - Math.pow(2, -10 * t)));
      setProgress(Math.min(94, currentVal));

      if (t < 1) {
        requestAnimationFrame(animateProgress);
      }
    };

    const animId = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Circumference of r=58 circle is ~364.4
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-dark/50 backdrop-blur-2xl animate-fade-in transition-all">
      <div className="liquid-glass liquid-glass-specular rounded-3xl p-8 sm:p-12 max-w-md w-full flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        
        {/* Ambient Refraction Blobs */}
        <div className="absolute w-52 h-52 rounded-full bg-primary/20 blur-3xl animate-blob-float pointer-events-none"></div>
        <div className="absolute w-48 h-48 rounded-full bg-secondary/20 blur-3xl animate-blob-float pointer-events-none" style={{ animationDelay: '3s' }}></div>

        {/* Central Glass Orb System */}
        <div className="relative w-64 h-64 flex items-center justify-center mb-6">
          
          {/* Ring 1 (Inner, Blue, 6s orbit) */}
          <div className="absolute w-44 h-44 rounded-full border border-primary/30 animate-orbit-1">
            <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary shadow-glow-primary"></span>
          </div>

          {/* Ring 2 (Middle, Violet, 10s reverse orbit) */}
          <div className="absolute w-52 h-52 rounded-full border border-secondary/30 animate-orbit-2">
            <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-secondary shadow-glow-secondary"></span>
          </div>

          {/* Ring 3 (Outer, Rose-Pink, 14s orbit) */}
          <div className="absolute w-60 h-60 rounded-full border border-risk-high/20 animate-orbit-3">
            <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-risk-high shadow-glow-high"></span>
          </div>

          {/* SVG Circular Progress Arc around Orb */}
          <svg className="absolute w-36 h-36 -rotate-90 pointer-events-none" viewBox="0 0 130 130">
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F7CFF" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
            {/* Background track */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-white/10 dark:text-white/5"
            />
            {/* Filling progress arc */}
            <circle
              cx="65"
              cy="65"
              r={radius}
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="4.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeOffset}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Central Glass Orb containing Pulsing Heart & Glowing ECG */}
          <div className="relative w-28 h-28 rounded-full liquid-glass flex items-center justify-center shadow-glow-primary overflow-hidden border border-white/60 dark:border-white/20">
            
            {/* Pulsing Heart inside Orb */}
            <Heart
              className="w-12 h-12 text-primary animate-lub-dub drop-shadow-[0_0_16px_rgba(79,124,255,0.7)]"
              fill="currentColor"
            />

            {/* Glowing ECG line running across the orb */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
              <svg viewBox="0 0 120 40" className="w-full h-full">
                <path
                  d="M 0 20 L 25 20 L 32 8 L 40 32 L 48 3 L 56 28 L 64 20 L 120 20"
                  fill="none"
                  stroke="#FF5D8F"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  className="animate-ecg-dash"
                  strokeDasharray="60 15"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Crossfading Status Text every ~900ms */}
        <div className="h-8 flex items-center justify-center">
          <h3
            key={statusIndex}
            className="text-lg font-bold text-text-mainLight dark:text-text-mainDark animate-fade-in tracking-tight"
          >
            {STATUS_MESSAGES[statusIndex]}...
          </h3>
        </div>

        <p className="text-xs text-text-mutedLight dark:text-text-mutedDark mt-1">
          Evaluating mathematical tree contributions ({Math.round(progress)}%)
        </p>

        {/* Minimal Progress Bar */}
        <div className="w-44 h-1.5 rounded-full neu-inset mt-5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-risk-high transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
