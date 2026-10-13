import React, { useEffect, useState } from 'react';

export default function RiskGauge({ probability, riskLevel }) {
  const [displayPct, setDisplayPct] = useState(0);
  const [needleAngle, setNeedleAngle] = useState(-90); // starts at far left (0%)

  const targetPct = Math.min(100, Math.max(0, probability * 100));
  // Needle maps 0% -> -90 deg, 100% -> +90 deg
  const targetAngle = -90 + (targetPct / 100) * 180;

  useEffect(() => {
    // Animate needle and percentage count-up
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutCubic
      const ease = 1 - Math.pow(1 - progress, 3);

      setDisplayPct(ease * targetPct);
      setNeedleAngle(-90 + ease * (targetAngle - -90));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [targetPct, targetAngle]);

  const riskColor =
    riskLevel === 'High'
      ? '#FF0000'
      : riskLevel === 'Moderate'
      ? '#D97706'
      : '#059669';

  return (
    <div className="flex flex-col items-center justify-center p-6 relative">
      <div className="relative w-64 h-36 flex items-center justify-center overflow-visible">
        <svg viewBox="0 0 200 120" className="w-full h-full drop-shadow-md overflow-visible">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="30%" stopColor="#10B981" />
              <stop offset="45%" stopColor="#D97706" />
              <stop offset="70%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#BC0202" />
              <stop offset="100%" stopColor="#FF0000" />
            </linearGradient>
            <filter id="needleGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={riskColor} floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Semicircle background track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            className="text-slate-200 dark:text-cardio-card/80"
            strokeLinecap="round"
          />

          {/* Color track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Zone boundary tick marks */}
          <circle cx="20" cy="100" r="3" fill="#059669" />
          <circle cx="180" cy="100" r="3" fill="#FF0000" />

          {/* Needle */}
          <g transform={`rotate(${needleAngle}, 100, 100)`} filter="url(#needleGlow)">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke={riskColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <polygon points="97,35 103,35 100,22" fill={riskColor} />
          </g>

          {/* Needle Pivot */}
          <circle cx="100" cy="100" r="10" fill="#830000" className="dark:fill-cardio-maroon" />
          <circle cx="100" cy="100" r="5" fill="#ffffff" />

          {/* Labels */}
          <text x="24" y="116" fontSize="9" fontWeight="700" fill="#059669">0% LOW</text>
          <text x="100" y="18" fontSize="9" fontWeight="700" fill="#D97706" textAnchor="middle">50% MOD</text>
          <text x="176" y="116" fontSize="9" fontWeight="700" fill="#FF0000" textAnchor="end">100% HIGH</text>
        </svg>
      </div>

      {/* Percentage Display with Risk Glow */}
      <div className="mt-4 text-center">
        <div className="flex items-baseline justify-center gap-1">
          <span
            className="text-5xl font-black tracking-tight"
            style={{ color: riskColor, textShadow: `0 0 24px ${riskColor}55` }}
          >
            {displayPct.toFixed(1)}
          </span>
          <span className="text-2xl font-bold text-slate-400">%</span>
        </div>
        <p className="text-xs uppercase tracking-widest font-semibold mt-1 text-slate-500 dark:text-slate-400">
          Estimated Risk Probability
        </p>
      </div>
    </div>
  );
}
