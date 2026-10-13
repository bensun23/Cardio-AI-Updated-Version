import React, { useEffect, useState } from 'react';

export default function RiskGauge({ probability, riskLevel }) {
  const [displayPct, setDisplayPct] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(-90); // starts at far left (0%)

  const targetPct = Math.min(100, Math.max(0, probability * 100));
  // Needle maps 0% -> -90 deg, 100% -> +90 deg
  const targetAngle = -90 + (targetPct / 100) * 180;

  useEffect(() => {
    // Ease-out with subtle overshoot (custom cubic back-ease)
    const duration = 1400; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Ease-out with slight overshoot
      const s = 0.55; // subtle overshoot coefficient
      const t = progress - 1;
      const ease = t * t * ((s + 1) * t + s) + 1;

      // Bound final settled value at 1.0
      const boundedEase = progress >= 1 ? 1 : ease;

      setDisplayPct(Math.min(100, Math.max(0, boundedEase * targetPct)));
      setNeedleAngle(-90 + boundedEase * (targetAngle - -90));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetPct, targetAngle]);

  const riskColor =
    riskLevel === 'High'
      ? '#FF5D8F'
      : riskLevel === 'Moderate'
      ? '#F5B83D'
      : '#22C7A9';

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <div className="relative w-64 h-36 flex items-center justify-center overflow-visible">
        <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22C7A9" />
              <stop offset="28%" stopColor="#22C7A9" />
              <stop offset="45%" stopColor="#F5B83D" />
              <stop offset="70%" stopColor="#F5B83D" />
              <stop offset="85%" stopColor="#FF5D8F" />
              <stop offset="100%" stopColor="#FF5D8F" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={riskColor} floodOpacity="0.65" />
            </filter>
          </defs>

          {/* Semicircle background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-slate-300/40 dark:text-base-cardDark"
            strokeLinecap="round"
          />

          {/* Color track with Low/Moderate/High zones */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Zone boundary indicators */}
          <circle cx="20" cy="100" r="3" fill="#22C7A9" />
          <circle cx="180" cy="100" r="3" fill="#FF5D8F" />

          {/* Needle with slight overshoot motion */}
          <g transform={`rotate(${needleAngle}, 100, 100)`} filter="url(#needleGlow)">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="26"
              stroke={riskColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <polygon points="96,34 104,34 100,20" fill={riskColor} />
          </g>

          {/* Needle Pivot */}
          <circle cx="100" cy="100" r="10" fill="#4F7CFF" className="dark:fill-primary" />
          <circle cx="100" cy="100" r="5" fill="#ffffff" />

          {/* Labels */}
          <text x="24" y="116" fontSize="9" fontWeight="700" fill="#22C7A9">0% LOW</text>
          <text x="100" y="18" fontSize="9" fontWeight="700" fill="#F5B83D" textAnchor="middle">50% MOD</text>
          <text x="176" y="116" fontSize="9" fontWeight="700" fill="#FF5D8F" textAnchor="end">100% HIGH</text>
        </svg>
      </div>

      {/* Percentage Display with Risk Color Glow */}
      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span
            className="text-5xl font-black tracking-tight"
            style={{ color: riskColor, textShadow: `0 0 24px ${riskColor}60` }}
          >
            {displayPct.toFixed(1)}
          </span>
          <span className="text-2xl font-bold text-text-mutedLight dark:text-text-mutedDark">%</span>
        </div>
        <p className="text-xs uppercase tracking-widest font-semibold mt-1 text-text-mutedLight dark:text-text-mutedDark">
          Estimated Risk Probability
        </p>
      </div>
    </div>
  );
}
