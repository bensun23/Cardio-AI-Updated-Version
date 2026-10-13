import React, { useState } from 'react';
import { RefreshCw, Download, ShieldCheck, AlertTriangle, Activity, User, Calendar, Check, Loader2 } from 'lucide-react';
import RiskGauge from './RiskGauge';
import FeatureChart from './FeatureChart';

export default function ResultScreen({
  patient,
  prediction,
  onReevaluate,
  onDownloadReport,
  darkMode
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const { probability, risk_level, contributions } = prediction;
  const patientName = patient?.patient_name || 'Patient';

  const handleDownload = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      await onDownloadReport();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusBadge = () => {
    if (risk_level === 'High') {
      return {
        title: 'Elevated Warning',
        text: 'The model identified physiological and hemodynamic patterns consistent with cardiovascular disease. Immediate clinical consultation with a board-certified cardiologist is strongly recommended.',
        icon: <Activity size={26} className="text-white" />,
        color: '#FF0000',
        badgeBg: 'bg-cardio-red/10 border-cardio-red/30 text-cardio-red'
      };
    } else if (risk_level === 'Moderate') {
      return {
        title: 'Moderate Notice',
        text: 'Certain cardiovascular markers warrant close attention. We recommend discussing these findings with your primary physician to evaluate preventive adjustments.',
        icon: <AlertTriangle size={26} className="text-white" />,
        color: '#D97706',
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
      };
    } else {
      return {
        title: 'Optimal Range',
        text: 'The submitted metrics indicate an optimal cardiovascular profile with low statistical indicators of coronary artery disease. Maintain healthy lifestyle practices.',
        icon: <ShieldCheck size={26} className="text-white" />,
        color: '#059669',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
      };
    }
  };

  const badge = getStatusBadge();

  return (
    <div className="w-full max-w-5xl animate-fade-in my-6 space-y-8">
      
      {/* Patient Header Summary Bar */}
      <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-cardio-crimson dark:text-red-400 uppercase tracking-wider mb-1">
            <User size={15} />
            <span>Diagnostic Report For</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            {patientName}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <span>Age: {patient.age} yrs</span>
            <span>*</span>
            <span>Sex: {patient.sex === 1 ? 'Male' : 'Female'}</span>
            <span>*</span>
            <span>Resting BP: {patient.trestbps} mmHg</span>
            <span>*</span>
            <span>Cholesterol: {patient.chol} mg/dl</span>
          </div>
        </div>

        <div className={`px-4 py-2 rounded-2xl border text-xs font-bold tracking-wide flex items-center gap-2 ${badge.badgeBg}`}>
          <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: badge.color }}></span>
          <span>{risk_level.toUpperCase()} RISK CLASSIFICATION</span>
        </div>
      </div>

      {/* Top Grid: Gauge Card & Status / Actions Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Gauge Card (5 cols) */}
        <div className="lg:col-span-5 liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 flex flex-col justify-center items-center shadow-lg">
          <RiskGauge probability={probability} riskLevel={risk_level} />
        </div>

        {/* Status Breakdown & Actions (7 cols) */}
        <div className="lg:col-span-7 liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-cardio-maroon/10 dark:border-white/10">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ backgroundColor: badge.color }}
              >
                {badge.icon}
              </div>
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Model Interpretation
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                  {badge.title}
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {badge.text}
            </p>

            <div className="p-4 rounded-2xl neu-surface text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Confidence Metric:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  {(probability * 100).toFixed(1)}% class likelihood
                </span>
              </div>
              <div className="flex justify-between">
                <span>Model Architecture:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  100-Tree Balanced Random Forest
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 mt-6 border-t border-cardio-maroon/10 dark:border-white/10">
            <button
              type="button"
              onClick={onReevaluate}
              className="flex-1 py-3.5 neu-btn text-slate-700 dark:text-slate-200 font-bold text-sm rounded-2xl flex items-center justify-center gap-2"
            >
              <RefreshCw size={17} />
              <span>Modify Data / Re-evaluate</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 py-3.5 btn-crimson-cta text-white font-bold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-liquid-glow"
            >
              {isDownloading ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check size={17} className="text-green-300" />
                  <span>Report Downloaded!</span>
                </>
              ) : (
                <>
                  <Download size={17} />
                  <span>Download Medical PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feature Analysis Matrix (SHAP) Card */}
      <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 md:p-10 shadow-lg">
        <FeatureChart contributions={contributions} darkMode={darkMode} />
      </div>
    </div>
  );
}
