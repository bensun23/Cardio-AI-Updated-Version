import React from 'react';
import { ArrowRight, ShieldCheck, FileText, BarChart3, Activity } from 'lucide-react';

export default function Landing({ onStart }) {
  return (
    <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4 py-8 animate-fade-in relative z-10">
      
      {/* Floating Anatomical Heart Centrepiece */}
      <div className="relative mb-8 flex flex-col items-center justify-center">
        {/* Ambient Liquid Glows */}
        <div className="absolute w-72 h-72 rounded-full bg-cardio-crimson/20 dark:bg-cardio-red/25 blur-3xl pointer-events-none animate-pulse-subtle"></div>
        <div className="absolute w-44 h-44 rounded-full bg-cardio-maroon/30 blur-2xl pointer-events-none"></div>

        {/* Anatomical Heart Container with Double-Beat (Lub-Dub) Pulse */}
        <div className="relative w-56 h-56 md:w-64 md:h-64 animate-lub-dub flex items-center justify-center filter drop-shadow-[0_12px_24px_rgba(188,2,2,0.35)]">
          <svg
            viewBox="0 0 240 240"
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Soft Red Fill Gradient */}
              <linearGradient id="heartFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#BC0202" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#830000" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF0000" stopOpacity="0.2" />
              </linearGradient>

              {/* Crimson Outline Gradient */}
              <linearGradient id="heartStrokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="50%" stopColor="#BC0202" />
                <stop offset="100%" stopColor="#830000" />
              </linearGradient>

              {/* ECG Gradient */}
              <linearGradient id="ecgGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#BC0202" stopOpacity="0.1" />
                <stop offset="40%" stopColor="#FF0000" stopOpacity="0.9" />
                <stop offset="70%" stopColor="#BC0202" stopOpacity="1" />
                <stop offset="100%" stopColor="#830000" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            {/* Aorta Arch & Great Vessels (Top) */}
            <path
              d="M 108 52 C 108 30, 132 20, 150 28 C 164 34, 166 48, 164 64"
              fill="none"
              stroke="url(#heartStrokeGrad)"
              strokeWidth="5"
              strokeLinecap="round"
              className="animate-heart-draw"
            />
            {/* Brachiocephalic artery branch */}
            <path
              d="M 126 24 L 126 12 M 138 23 L 142 12 M 150 28 L 156 14"
              fill="none"
              stroke="#BC0202"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Superior Vena Cava (Top Right) */}
            <path
              d="M 80 34 L 80 65 C 80 72, 84 80, 92 85"
              fill="none"
              stroke="url(#heartStrokeGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              className="animate-heart-draw"
            />

            {/* Pulmonary Artery / Trunk */}
            <path
              d="M 130 65 C 130 55, 146 50, 156 55 L 170 60"
              fill="none"
              stroke="#830000"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Main Ventricle & Atria Body */}
            <path
              d="M 120 75 
                 C 145 68, 185 80, 182 125 
                 C 180 152, 148 188, 120 215 
                 C 92 188, 58 152, 58 120 
                 C 58 84, 95 68, 120 75 Z"
              fill="url(#heartFillGrad)"
              stroke="url(#heartStrokeGrad)"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-heart-draw"
            />

            {/* Interventricular Septum (Chamber divider groove) */}
            <path
              d="M 122 84 C 124 125, 120 160, 119 210"
              fill="none"
              stroke="rgba(188, 2, 2, 0.45)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />

            {/* Right Coronary Artery branch */}
            <path
              d="M 95 98 C 88 115, 85 130, 94 150 C 97 156, 106 168, 112 182"
              fill="none"
              stroke="#FF0000"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="animate-pulse"
            />

            {/* Left Anterior Descending (LAD) Coronary Artery */}
            <path
              d="M 135 102 C 146 118, 152 136, 144 155 C 138 168, 126 186, 121 202"
              fill="none"
              stroke="#FF0000"
              strokeWidth="2.2"
              strokeLinecap="round"
              className="animate-pulse"
            />
            {/* Small diagonal capillary branches */}
            <path
              d="M 143 124 L 155 130 M 140 145 L 148 152 M 89 120 L 80 126"
              fill="none"
              stroke="#BC0202"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Sweeping ECG Wave beneath the heart */}
        <div className="w-64 md:w-80 h-10 mt-2 relative overflow-hidden flex items-center justify-center">
          <svg viewBox="0 0 400 60" className="w-full h-full">
            <path
              d="M 0 30 L 60 30 L 75 30 L 85 15 L 95 48 L 105 5 L 115 42 L 125 30 L 155 30 L 170 20 L 185 30 L 260 30 L 275 30 L 285 15 L 295 48 L 305 5 L 315 42 L 325 30 L 355 30 L 370 20 L 385 30 L 400 30"
              fill="none"
              stroke="url(#ecgGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-ecg-dash"
              strokeDasharray="100 20"
            />
          </svg>
        </div>
      </div>

      {/* Main Title & Hero Messaging */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-4">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cardio-maroon via-cardio-crimson to-cardio-red">
          CardioAI
        </span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300 max-w-2xl mb-4">
        AI-Powered Clinical Cardiovascular Risk Assessment
      </p>

      {/* Overview Card: 13 Clinical Markers */}
      <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 md:p-8 max-w-3xl mb-10 text-left shadow-lg">
        <div className="flex items-center gap-2 mb-3">
          <Activity className="text-cardio-crimson dark:text-red-400" size={20} />
          <h2 className="text-base font-bold uppercase tracking-wider text-cardio-maroon dark:text-red-300">
            Clinical Diagnostic Scope
          </h2>
        </div>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          CardioAI evaluates <strong>13 core physiological & hemodynamic biomarkers</strong>—including patient age,
          resting blood pressure, serum cholesterol, resting electrocardiogram (ECG), max exercise heart rate, ST-segment depression,
          and chest pain presentation.
        </p>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-cardio-maroon/10 dark:border-white/10">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cardio-crimson/10 text-cardio-crimson dark:text-red-400 flex items-center justify-center shrink-0">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Stratified Risk</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Classified into Low, Moderate, or High likelihood.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cardio-crimson/10 text-cardio-crimson dark:text-red-400 flex items-center justify-center shrink-0">
              <BarChart3 size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">SHAP Explainability</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Exact mathematical factor contributions per patient.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-cardio-crimson/10 text-cardio-crimson dark:text-red-400 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">PDF Clinical Report</h4>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">Exportable assessment with tailored clinical guidance.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Button with Liquid Sheen */}
      <button
        type="button"
        onClick={onStart}
        className="group relative px-9 py-4 btn-crimson-cta text-white font-bold text-base md:text-lg rounded-2xl flex items-center justify-center gap-3 overflow-hidden shadow-liquid-glow"
      >
        <span className="relative z-10">Get Started</span>
        <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1.5 transition-transform" />
      </button>

      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-6 max-w-md">
        Intended for educational and preliminary screening analysis. Not a substitute for professional medical diagnosis.
      </p>
    </div>
  );
}
