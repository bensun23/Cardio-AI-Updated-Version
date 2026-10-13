import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { BarChart3, ChevronDown, ChevronUp } from 'lucide-react';

const FEATURE_UNITS = {
  age: 'years',
  trestbps: 'mmHg',
  chol: 'mg/dl',
  thalach: 'bpm',
  oldpeak: 'mm',
  ca: 'vessels'
};

const CustomTooltip = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isIncreasing = data.impact >= 0;
    const unit = FEATURE_UNITS[data.feature] || '';

    return (
      <div className={`p-3 rounded-2xl shadow-xl border text-xs max-w-xs ${
        darkMode ? 'bg-base-cardDark border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <p className="font-bold text-sm mb-1 text-primary dark:text-primary-light">{data.label}</p>
        <div className="flex items-center justify-between gap-4 py-1 border-b border-white/10">
          <span className="text-text-mutedLight dark:text-text-mutedDark">Patient Value:</span>
          <span className="font-semibold">{data.value} {unit}</span>
        </div>
        <div className="flex items-center justify-between gap-4 py-1 border-b border-white/10">
          <span className="text-text-mutedLight dark:text-text-mutedDark">SHAP Contribution:</span>
          <span className={`font-bold ${isIncreasing ? 'text-risk-high' : 'text-primary'}`}>
            {data.impact > 0 ? `+${data.impact.toFixed(4)}` : data.impact.toFixed(4)}
          </span>
        </div>
        <p className="mt-1.5 text-[11px] leading-tight text-text-mutedLight dark:text-text-mutedDark">
          {isIncreasing
            ? 'Pushes the prediction towards higher heart disease risk.'
            : 'Pushes the prediction towards lower heart disease risk.'}
        </p>
      </div>
    );
  }
  return null;
};

export default function FeatureChart({ contributions, darkMode }) {
  const [showAll, setShowAll] = useState(false);

  if (!contributions || contributions.length === 0) {
    return null;
  }

  // Display top 8 or all 13
  const visibleData = showAll ? contributions : contributions.slice(0, 8);

  // Reverse for natural top-to-bottom reading in horizontal BarChart
  const chartData = [...visibleData].reverse();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-secondary" size={22} />
            <h3 className="text-lg md:text-xl font-bold tracking-tight">
              Dynamic Feature Impact Matrix (SHAP)
            </h3>
          </div>
          <p className="text-xs text-text-mutedLight dark:text-text-mutedDark mt-1">
            Calculated in real-time from the Random Forest model for this specific patient.
          </p>
        </div>

        {/* Legend: rose-pink for increases risk, ice blue for reduces risk */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-risk-high inline-block shadow-sm"></span>
            <span className="text-risk-high">Increases risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-primary inline-block shadow-sm"></span>
            <span className="text-primary dark:text-primary-light">Reduces risk</span>
          </div>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 30, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
              stroke={darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(80,110,160,0.1)'}
            />
            <XAxis
              type="number"
              domain={['auto', 'auto']}
              tick={{ fill: darkMode ? '#8899B5' : '#506280', fontSize: 11 }}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <YAxis
              dataKey="label"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? '#F1F5F9' : '#162038', fontSize: 12, fontWeight: 500 }}
              width={140}
            />
            <ReferenceLine x={0} stroke={darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(79,124,255,0.5)'} strokeWidth={1.5} />
            <Tooltip
              content={<CustomTooltip darkMode={darkMode} />}
              cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(79,124,255,0.04)' }}
            />
            <Bar
              dataKey="impact"
              radius={[4, 4, 4, 4]}
              barSize={18}
              animationDuration={1300}
              animationEasing="ease-out"
            >
              {chartData.map((entry, index) => {
                const isIncreasing = entry.impact >= 0;
                // Rose-pink for increases risk, ice blue for reduces risk
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isIncreasing ? '#FF5D8F' : '#4F7CFF'}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {contributions.length > 8 && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="neu-btn px-5 py-2 rounded-xl text-xs font-semibold text-primary dark:text-primary-light hover:text-secondary transition-all flex items-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp size={16} /> Show Top 8 Features
              </>
            ) : (
              <>
                <ChevronDown size={16} /> Show All 13 Features
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
