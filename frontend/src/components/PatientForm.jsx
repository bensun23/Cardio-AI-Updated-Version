import React, { useState, useId } from 'react';
import { User, Activity, Stethoscope, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';

const RANGES = {
  patient_name: { min: 2, max: 60, label: 'Patient Name' },
  age: { min: 18, max: 100, unit: 'yrs', label: 'Age' },
  trestbps: { min: 80, max: 220, unit: 'mmHg', label: 'Resting Blood Pressure' },
  chol: { min: 100, max: 600, unit: 'mg/dl', label: 'Serum Cholesterol' },
  thalach: { min: 60, max: 220, unit: 'bpm', label: 'Max Heart Rate' },
  oldpeak: { min: 0.0, max: 7.0, unit: 'mm', label: 'ST Depression (Oldpeak)' },
  ca: { min: 0, max: 4, unit: 'vessels', label: 'Major Vessels (0-4)' },
};

export default function PatientForm({ onSubmit, initialData, backendError, isSubmitting }) {
  const [formData, setFormData] = useState(initialData || {
    patient_name: 'Alex Mercer',
    age: 52,
    sex: 1,
    cp: 0,
    trestbps: 125,
    chol: 212,
    fbs: 0,
    restecg: 1,
    thalach: 168,
    exang: 0,
    oldpeak: 1.0,
    slope: 2,
    ca: 0,
    thal: 2
  });

  const [touched, setTouched] = useState({});

  // Validation function
  const validate = () => {
    const errors = {};

    // Patient Name
    if (!formData.patient_name || formData.patient_name.trim().length < 2) {
      errors.patient_name = 'Patient name must be at least 2 characters';
    } else if (formData.patient_name.length > 60) {
      errors.patient_name = 'Patient name must not exceed 60 characters';
    }

    // Age
    if (isNaN(formData.age) || formData.age < 18 || formData.age > 100) {
      errors.age = 'Age must be between 18 and 100 years';
    }

    // Resting BP
    if (isNaN(formData.trestbps) || formData.trestbps < 80 || formData.trestbps > 220) {
      errors.trestbps = 'Resting BP must be between 80 and 220 mmHg';
    }

    // Cholesterol
    if (isNaN(formData.chol) || formData.chol < 100 || formData.chol > 600) {
      errors.chol = 'Cholesterol must be between 100 and 600 mg/dl';
    }

    // Max Heart Rate
    if (isNaN(formData.thalach) || formData.thalach < 60 || formData.thalach > 220) {
      errors.thalach = 'Max heart rate must be between 60 and 220 bpm';
    }

    // Oldpeak
    if (isNaN(formData.oldpeak) || formData.oldpeak < 0.0 || formData.oldpeak > 7.0) {
      errors.oldpeak = 'ST depression must be between 0.0 and 7.0';
    }

    // Major Vessels
    if (isNaN(formData.ca) || formData.ca < 0 || formData.ca > 4) {
      errors.ca = 'Major vessels must be between 0 and 4';
    }

    return errors;
  };

  const errors = validate();
  const isValid = Object.keys(errors).length === 0;

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const parsed = type === 'number' || type === 'range' ? (value === '' ? '' : parseFloat(value)) : value;
    setFormData(prev => ({ ...prev, [name]: parsed }));
  };

  const handleToggle = (name, val) => {
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || isSubmitting) return;
    onSubmit(formData);
  };

  return (
    <div className="w-full max-w-4xl liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 md:p-10 animate-fade-in my-6">
      <div className="mb-8 border-b border-cardio-maroon/10 dark:border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-cardio-maroon dark:text-red-400 tracking-tight">
            Clinical Diagnostic Parameters
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter verified patient measurements to evaluate cardiovascular risk.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-full neu-surface text-cardio-crimson dark:text-red-300">
          <CheckCircle2 size={14} className={isValid ? 'text-green-500' : 'text-slate-400'} />
          <span>{isValid ? 'All parameters valid' : 'Complete required fields'}</span>
        </div>
      </div>

      {backendError && (
        <div className="mb-6 p-4 bg-cardio-red/10 border border-cardio-red/30 rounded-2xl flex items-start gap-3 text-cardio-red text-sm">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Validation or Server Notice</p>
            <p className="text-xs mt-0.5 leading-relaxed">{backendError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: Patient Profile & Demographics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cardio-maroon dark:text-red-300 font-bold text-sm tracking-wide uppercase">
            <User size={18} className="text-cardio-crimson dark:text-cardio-red" />
            <span>Section 1: Demographics & History</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Patient Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Patient Name <span className="text-cardio-red">*</span>
              </label>
              <input
                type="text"
                name="patient_name"
                value={formData.patient_name}
                onChange={handleChange}
                onBlur={() => handleBlur('patient_name')}
                placeholder="e.g. Alex Mercer"
                className={`neu-inset p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none transition-all ${
                  touched.patient_name && errors.patient_name ? 'border border-cardio-red' : ''
                }`}
              />
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">2 - 60 characters</span>
                {touched.patient_name && errors.patient_name && (
                  <span className="text-cardio-red font-semibold">{errors.patient_name}</span>
                )}
              </div>
            </div>

            {/* Age */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Age ({formData.age} yrs) <span className="text-cardio-red">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Range: 18 - 100</span>
              </div>
              <input
                type="range"
                name="age"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                onBlur={() => handleBlur('age')}
                className="w-full mt-2"
              />
              {touched.age && errors.age && (
                <span className="text-cardio-red text-[11px] font-semibold">{errors.age}</span>
              )}
            </div>

            {/* Sex */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Biological Sex <span className="text-cardio-red">*</span>
              </label>
              <div className="flex gap-2 p-1 rounded-2xl neu-inset">
                <button
                  type="button"
                  onClick={() => handleToggle('sex', 1)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.sex === 1
                      ? 'bg-cardio-crimson text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Male (1)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle('sex', 0)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.sex === 0
                      ? 'bg-cardio-crimson text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Female (0)
                </button>
              </div>
              <span className="text-[11px] text-slate-400">Cardiovascular baseline cohort</span>
            </div>

            {/* Fasting Blood Sugar */}
            <div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Fasting Blood Sugar &gt; 120 mg/dl
              </label>
              <div className="flex gap-2 p-1 rounded-2xl neu-inset">
                <button
                  type="button"
                  onClick={() => handleToggle('fbs', 1)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.fbs === 1
                      ? 'bg-cardio-crimson text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Yes (&gt; 120 mg/dl)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle('fbs', 0)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.fbs === 0
                      ? 'bg-cardio-crimson text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  No (&le; 120 mg/dl)
                </button>
              </div>
              <span className="text-[11px] text-slate-400">Indicator for insulin resistance</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Vitals & Symptoms */}
        <div className="space-y-4 pt-4 border-t border-cardio-maroon/10 dark:border-white/10">
          <div className="flex items-center gap-2 text-cardio-maroon dark:text-red-300 font-bold text-sm tracking-wide uppercase">
            <Activity size={18} className="text-cardio-crimson dark:text-cardio-red" />
            <span>Section 2: Vitals & Clinical Symptoms</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Resting BP */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Resting Blood Pressure <span className="text-cardio-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="trestbps"
                  min="80"
                  max="220"
                  value={formData.trestbps}
                  onChange={handleChange}
                  onBlur={() => handleBlur('trestbps')}
                  className={`neu-inset w-full p-3 pr-14 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none ${
                    touched.trestbps && errors.trestbps ? 'border border-cardio-red' : ''
                  }`}
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">mmHg</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Allowed: 80 - 220</span>
                {touched.trestbps && errors.trestbps && (
                  <span className="text-cardio-red font-semibold">{errors.trestbps}</span>
                )}
              </div>
            </div>

            {/* Cholesterol */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Serum Cholesterol <span className="text-cardio-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="chol"
                  min="100"
                  max="600"
                  value={formData.chol}
                  onChange={handleChange}
                  onBlur={() => handleBlur('chol')}
                  className={`neu-inset w-full p-3 pr-14 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none ${
                    touched.chol && errors.chol ? 'border border-cardio-red' : ''
                  }`}
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">mg/dl</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Allowed: 100 - 600</span>
                {touched.chol && errors.chol && (
                  <span className="text-cardio-red font-semibold">{errors.chol}</span>
                )}
              </div>
            </div>

            {/* Chest Pain Type */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Chest Pain Type (cp)
              </label>
              <select
                name="cp"
                value={formData.cp}
                onChange={handleChange}
                className="neu-inset p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none cursor-pointer"
              >
                <option value={0}>0: Typical Angina</option>
                <option value={1}>1: Atypical Angina</option>
                <option value={2}>2: Non-anginal Pain</option>
                <option value={3}>3: Asymptomatic</option>
              </select>
              <span className="text-[11px] text-slate-400">Clinical presentation</span>
            </div>

            {/* Exercise Induced Angina */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Exercise Induced Angina
              </label>
              <div className="flex gap-2 p-1 rounded-2xl neu-inset">
                <button
                  type="button"
                  onClick={() => handleToggle('exang', 1)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.exang === 1
                      ? 'bg-cardio-crimson text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Yes (1)
                </button>
                <button
                  type="button"
                  onClick={() => handleToggle('exang', 0)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.exang === 0
                      ? 'bg-cardio-crimson text-white shadow-md'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  No (0)
                </button>
              </div>
              <span className="text-[11px] text-slate-400">Ischemic stress sign</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: Cardiac Diagnostic Tests */}
        <div className="space-y-4 pt-4 border-t border-cardio-maroon/10 dark:border-white/10">
          <div className="flex items-center gap-2 text-cardio-maroon dark:text-red-300 font-bold text-sm tracking-wide uppercase">
            <Stethoscope size={18} className="text-cardio-crimson dark:text-cardio-red" />
            <span>Section 3: Cardiac Diagnostic Tests</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Max Heart Rate */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Max Heart Rate (thalach) <span className="text-cardio-red">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="thalach"
                  min="60"
                  max="220"
                  value={formData.thalach}
                  onChange={handleChange}
                  onBlur={() => handleBlur('thalach')}
                  className={`neu-inset w-full p-3 pr-14 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none ${
                    touched.thalach && errors.thalach ? 'border border-cardio-red' : ''
                  }`}
                />
                <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-bold">bpm</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Allowed: 60 - 220</span>
                {touched.thalach && errors.thalach && (
                  <span className="text-cardio-red font-semibold">{errors.thalach}</span>
                )}
              </div>
            </div>

            {/* Resting ECG (The Missing Dropdown Restored!) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Resting ECG Results (restecg) <span className="text-cardio-red">*</span>
              </label>
              <select
                name="restecg"
                value={formData.restecg}
                onChange={handleChange}
                className="neu-inset p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none cursor-pointer"
              >
                <option value={0}>0: Normal</option>
                <option value={1}>1: ST-T Wave Abnormality</option>
                <option value={2}>2: Left Ventricular Hypertrophy</option>
              </select>
              <span className="text-[11px] text-slate-400">Resting electrical signal</span>
            </div>

            {/* ST Depression (Oldpeak) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                ST Depression (oldpeak) <span className="text-cardio-red">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                name="oldpeak"
                min="0.0"
                max="7.0"
                value={formData.oldpeak}
                onChange={handleChange}
                onBlur={() => handleBlur('oldpeak')}
                className={`neu-inset p-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none ${
                  touched.oldpeak && errors.oldpeak ? 'border border-cardio-red' : ''
                }`}
              />
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Allowed: 0.0 - 7.0</span>
                {touched.oldpeak && errors.oldpeak && (
                  <span className="text-cardio-red font-semibold">{errors.oldpeak}</span>
                )}
              </div>
            </div>

            {/* Slope of Peak ST Segment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Peak ST Slope (slope)
              </label>
              <select
                name="slope"
                value={formData.slope}
                onChange={handleChange}
                className="neu-inset p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none cursor-pointer"
              >
                <option value={0}>0: Upsloping</option>
                <option value={1}>1: Flat</option>
                <option value={2}>2: Downsloping</option>
              </select>
              <span className="text-[11px] text-slate-400">Exercise stress vector</span>
            </div>

            {/* Number of Major Vessels */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Major Vessels Flourosopy (ca) <span className="text-cardio-red">*</span>
              </label>
              <input
                type="number"
                name="ca"
                min="0"
                max="4"
                value={formData.ca}
                onChange={handleChange}
                onBlur={() => handleBlur('ca')}
                className={`neu-inset p-3 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none ${
                  touched.ca && errors.ca ? 'border border-cardio-red' : ''
                }`}
              />
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Allowed: 0 - 4 vessels</span>
                {touched.ca && errors.ca && (
                  <span className="text-cardio-red font-semibold">{errors.ca}</span>
                )}
              </div>
            </div>

            {/* Thalassemia / Stress Result */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Thalassemia (thal)
              </label>
              <select
                name="thal"
                value={formData.thal}
                onChange={handleChange}
                className="neu-inset p-3 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-cardio-crimson/50 focus:outline-none cursor-pointer"
              >
                <option value={0}>0: Normal / Null</option>
                <option value={1}>1: Fixed Defect</option>
                <option value={2}>2: Normal Blood Flow</option>
                <option value={3}>3: Reversible Defect</option>
              </select>
              <span className="text-[11px] text-slate-400">Thallium myocardial scan</span>
            </div>
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="pt-6 border-t border-cardio-maroon/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 order-2 sm:order-1 text-center sm:text-left">
            {!isValid ? (
              <span className="text-cardio-red font-semibold">
                Please correct out-of-range values before initiating analysis.
              </span>
            ) : (
              'All parameters verified. Ready for Random Forest inference.'
            )}
          </p>

          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full sm:w-auto px-9 py-4 btn-crimson-cta text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 shadow-liquid-glow order-1 sm:order-2"
          >
            <span>Analyze Pulse</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
