import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { BarChart3, ChevronDown, ChevronUp, Info } from 'lucide-react';

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
      <div className={`p-3 rounded-xl shadow-xl border text-xs max-w-xs ${
        darkMode ? 'bg-cardio-card border-white/10 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <p className="font-bold text-sm mb-1 text-cardio-crimson dark:text-red-400">{data.label}</p>
        <div className="flex items-center justify-between gap-4 py-1 border-b border-white/10">
          <span className="text-slate-400">Patient Value:</span>
          <span className="font-semibold">{data.value} {unit}</span>
        </div>
        <div className="flex items-center justify-between gap-4 py-1 border-b border-white/10">
          <span className="text-slate-400">SHAP Impact:</span>
          <span className={`font-bold ${isIncreasing ? 'text-cardio-red' : 'text-risk-reduce'}`}>
            {data.impact > 0 ? `+${data.impact.toFixed(4)}` : data.impact.toFixed(4)}
          </span>
        </div>
        <p className="mt-1.5 text-[11px] leading-tight text-slate-400">
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

  // In horizontal BarChart with vertical layout, chart expects rows
  // We reverse for natural top-to-bottom reading of highest impacts
  const chartData = [...visibleData].reverse();

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="text-cardio-crimson dark:text-red-400" size={22} />
            <h3 className="text-lg md:text-xl font-bold tracking-tight">
              Dynamic Feature Impact Matrix (SHAP)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculated in real-time from the Random Forest model for this specific patient.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-cardio-crimson inline-block shadow-sm"></span>
            <span className="text-cardio-maroon dark:text-red-300">Increases risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-risk-reduce inline-block shadow-sm"></span>
            <span className="text-teal-700 dark:text-teal-300">Reduces risk</span>
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
              stroke={darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(131,0,0,0.08)'}
            />
            <XAxis
              type="number"
              domain={['auto', 'auto']}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
              tickFormatter={(v) => v.toFixed(2)}
            />
            <YAxis
              dataKey="label"
              type="category"
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? '#FEECE8' : '#2A1B1B', fontSize: 12, fontWeight: 500 }}
              width={140}
            />
            <ReferenceLine x={0} stroke={darkMode ? 'rgba(255,255,255,0.3)' : '#830000'} strokeWidth={1.5} />
            <Tooltip
              content={<CustomTooltip darkMode={darkMode} />}
              cursor={{ fill: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(131,0,0,0.04)' }}
            />
            <Bar
              dataKey="impact"
              radius={[4, 4, 4, 4]}
              barSize={18}
              animationDuration={1200}
            >
              {chartData.map((entry, index) => {
                const isIncreasing = entry.impact >= 0;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isIncreasing ? '#BC0202' : '#0D9488'}
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
            className="neu-btn px-5 py-2 rounded-xl text-xs font-semibold text-cardio-crimson dark:text-red-400 hover:text-cardio-red transition-all flex items-center gap-2"
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
