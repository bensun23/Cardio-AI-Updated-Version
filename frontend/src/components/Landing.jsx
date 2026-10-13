import React, { useState, useRef } from 'react';
import { ArrowRight, ShieldCheck, FileText, BarChart3, Activity } from 'lucide-react';

export default function Landing({ onStart }) {
  // Magnetic hover effect state
  const [btnPos, setBtnPos] = useState({ x: 0, y: 0 });
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    // Subtly follow cursor with 12% spring dampening
    const deltaX = (e.clientX - centerX) * 0.14;
    const deltaY = (e.clientY - centerY) * 0.14;
    setBtnPos({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setBtnPos({ x: 0, y: 0 });
  };

  // Letter-by-letter title
  const titleLetters = "CardioAI".split("");

  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-8 animate-fade-in relative z-10">
      
      {/* Centerpiece: Anatomical Heart Hero with Concentric Ripples */}
      <div className="relative mb-10 flex flex-col items-center justify-center">
        
        {/* Concentric Glass Ripple Rings expanding outward on each beat */}
        <div className="absolute w-56 h-56 rounded-full border border-primary/20 dark:border-primary/30 animate-ripple pointer-events-none"></div>
        <div className="absolute w-56 h-56 rounded-full border border-secondary/20 dark:border-secondary/30 animate-ripple pointer-events-none" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute w-56 h-56 rounded-full border border-risk-high/15 dark:border-risk-high/20 animate-ripple pointer-events-none" style={{ animationDelay: '0.8s' }}></div>

        {/* Pulsing Glow behind heart shifting between blue, violet, and hint of rose-pink on pulse */}
        <div className="absolute w-52 h-52 rounded-full rounded-full animate-glow-shift pointer-events-none"></div>

        {/* Anatomical Heart Container with Double-Beat (Lub-Dub) Pulse */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 animate-lub-dub flex items-center justify-center filter drop-shadow-[0_16px_32px_rgba(79,124,255,0.3)]">
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Blue-to-Violet Stroke Gradient */}
              <linearGradient id="heartGradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F7CFF" />
                <stop offset="50%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>

              {/* Soft Glass-Like Gradient Fill */}
              <linearGradient id="heartGlassFill" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.32" />
                <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.25" />
                <stop offset="80%" stopColor="#FF5D8F" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#4F7CFF" stopOpacity="0.28" />
              </linearGradient>

              {/* Glowing ECG Gradient */}
              <linearGradient id="ecgHeroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4F7CFF" stopOpacity="0.1" />
                <stop offset="35%" stopColor="#4F7CFF" stopOpacity="1" />
                <stop offset="60%" stopColor="#8B5CF6" stopOpacity="1" />
                <stop offset="75%" stopColor="#FF5D8F" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
              </linearGradient>

              {/* Blood Particle Glow */}
              <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#FF5D8F" floodOpacity="0.8" />
              </filter>
            </defs>

            {/* STAGE 1: Outline (Draws First) */}
            <path
              d="M 120 75 
                 C 145 68, 185 80, 182 125 
                 C 180 152, 148 188, 120 215 
                 C 92 188, 58 152, 58 120 
                 C 58 84, 95 68, 120 75 Z"
              fill="url(#heartGlassFill)"
              stroke="url(#heartGradientStroke)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-draw-outline animate-fill-heart"
            />

            {/* STAGE 2: Chambers & Internal Grooves (Staggered Draw) */}
            {/* Interventricular Septum (Chamber divider groove) */}
            <path
              d="M 122 84 C 124 125, 120 160, 119 210"
              fill="none"
              stroke="url(#heartGradientStroke)"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              className="animate-draw-chambers"
            />
            {/* Right Atrium contour curve */}
            <path
              d="M 68 100 C 72 118, 76 138, 86 156"
              fill="none"
              stroke="url(#heartGradientStroke)"
              strokeWidth="2"
              className="animate-draw-chambers"
            />
            {/* Left Ventricle muscle curve */}
            <path
              d="M 170 105 C 168 132, 154 158, 138 184"
              fill="none"
              stroke="url(#heartGradientStroke)"
              strokeWidth="2"
              className="animate-draw-chambers"
            />

            {/* STAGE 3: Vessels & Arteries (Staggered Draw) */}
            {/* Aorta Arch & Great Vessels (Top) */}
            <path
              d="M 108 52 C 108 30, 132 20, 150 28 C 164 34, 166 48, 164 64"
              fill="none"
              stroke="url(#heartGradientStroke)"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-draw-vessels"
            />
            {/* Brachiocephalic branch vessels */}
            <path
              d="M 126 24 L 126 12 M 138 23 L 142 12 M 150 28 L 156 14"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="animate-draw-vessels"
            />

            {/* Superior Vena Cava */}
            <path
              d="M 80 34 L 80 65 C 80 72, 84 80, 92 85"
              fill="none"
              stroke="url(#heartGradientStroke)"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-draw-vessels"
            />

            {/* Pulmonary Artery / Trunk */}
            <path
              d="M 130 65 C 130 55, 146 50, 156 55 L 170 60"
              fill="none"
              stroke="#4F7CFF"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-draw-vessels"
            />

            {/* Right Coronary Artery branch */}
            <path
              d="M 95 98 C 88 115, 85 130, 94 150 C 97 156, 106 168, 112 182"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="animate-draw-vessels"
            />

            {/* Left Anterior Descending (LAD) Coronary Artery */}
            <path
              d="M 135 102 C 146 118, 152 136, 144 155 C 138 168, 126 186, 121 202"
              fill="none"
              stroke="#4F7CFF"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="animate-draw-vessels"
            />

            {/* Blood Cell-like Particles drifting along vessel paths */}
            <circle cx="0" cy="0" r="2.8" fill="#FF5D8F" filter="url(#particleGlow)" className="particle-drift-1" />
            <circle cx="0" cy="0" r="2.2" fill="#7298FF" filter="url(#particleGlow)" className="particle-drift-2" />
            <circle cx="0" cy="0" r="2.5" fill="#A78BFA" filter="url(#particleGlow)" className="particle-drift-3" />
          </svg>
        </div>

        {/* Sweeping ECG Wave beneath the heart, spiking in sync with heart beat */}
        <div className="w-64 md:w-80 h-10 mt-1 relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 60" className="w-full h-full">
            <path
              d="M 0 30 L 60 30 L 75 30 L 85 14 L 95 50 L 105 4 L 115 44 L 125 30 L 155 30 L 170 20 L 185 30 L 260 30 L 275 30 L 285 14 L 295 50 L 305 4 L 315 44 L 325 30 L 355 30 L 370 20 L 385 30 L 400 30"
              fill="none"
              stroke="url(#ecgHeroGrad)"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg-dash"
              strokeDasharray="110 20"
            />
          </svg>
        </div>
      </div>

      {/* Letter-by-Letter Title Reveal */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4 flex items-center justify-center">
        {titleLetters.map((char, index) => (
          <span
            key={index}
            className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-fade-in"
            style={{
              animationDelay: `${0.2 + index * 0.08}s`,
              animationFillMode: 'both'
            }}
          >
            {char}
          </span>
        ))}
      </h1>

      {/* Tagline */}
      <p
        className="text-lg sm:text-xl md:text-2xl font-semibold text-text-mutedLight dark:text-text-mutedDark max-w-2xl mb-8 animate-fade-in"
        style={{ animationDelay: '0.9s', animationFillMode: 'both' }}
      >
        AI-Powered Clinical Cardiovascular Risk Assessment
      </p>

      {/* 3-Chip Row: "13 Clinical Markers", "Explainable Risk Score", "Instant PDF Report" */}
      <div
        className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-10 max-w-2xl animate-fade-in"
        style={{ animationDelay: '1.1s', animationFillMode: 'both' }}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl neu-surface text-xs font-bold text-primary dark:text-primary-light">
          <Activity size={16} />
          <span>13 Clinical Markers</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl neu-surface text-xs font-bold text-secondary dark:text-secondary-light">
          <BarChart3 size={16} />
          <span>Explainable Risk Score</span>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl neu-surface text-xs font-bold text-risk-high dark:text-risk-highLight">
          <FileText size={16} />
          <span>Instant PDF Report</span>
        </div>
      </div>

      {/* Overview Container */}
      <div
        className="liquid-glass liquid-glass-specular rounded-3xl p-6 md:p-8 max-w-3xl mb-10 text-left shadow-lg animate-fade-in"
        style={{ animationDelay: '1.3s', animationFillMode: 'both' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity className="text-primary" size={20} />
          <h2 className="text-xs font-bold uppercase tracking-wider text-primary dark:text-primary-light">
            Diagnostic Scope & Engine
          </h2>
        </div>
        <p className="text-sm md:text-base text-text-mutedLight dark:text-text-mutedDark leading-relaxed">
          CardioAI computes individualized heart disease probabilities across demographic, hemodynamic,
          and electrophysiological indicators—including resting blood pressure, cholesterol, resting ECG patterns,
          ST depression, and chest pain presentation—paired with live mathematical SHAP explainability.
        </p>
      </div>

      {/* "Get Started" Liquid-Glass Neumorphic Pill with Magnetic Hover & Shine */}
      <div
        className="relative"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <button
          ref={btnRef}
          type="button"
          onClick={onStart}
          style={{
            transform: `translate(${btnPos.x}px, ${btnPos.y}px)`,
            transition: btnPos.x === 0 ? 'transform 0.4s ease' : 'none'
          }}
          className="group relative px-10 py-4 btn-gradient-cta text-white font-bold text-base md:text-lg rounded-full flex items-center justify-center gap-3 overflow-hidden shadow-glow-primary focus:outline-none focus:ring-4 focus:ring-primary/40"
        >
          <span className="relative z-10">Get Started</span>
          <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
        </button>
      </div>

      <p
        className="text-[11px] text-text-mutedLight dark:text-text-mutedDark mt-6 max-w-md animate-fade-in"
        style={{ animationDelay: '1.6s', animationFillMode: 'both' }}
      >
        Intended for educational and clinical preliminary screening. Not a certified medical diagnosis.
      </p>
    </div>
  );
}
