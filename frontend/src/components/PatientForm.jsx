import React, { useState } from 'react';
import {
  User,
  Activity,
  Stethoscope,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Check,
  ChevronDown,
  Info,
  AlertCircle
} from 'lucide-react';

// Plain-language medical tooltips for clinical fields
const MEDICAL_TOOLTIPS = {
  patient_name: 'Official legal name or anonymized identifier for the medical record.',
  age: 'Patient chronological age in complete years (18 to 100).',
  sex: 'Biological sex assigned at birth, relevant to baseline hormone and vascular profiles.',
  fbs: 'Measurement of whether fasting blood glucose exceeds 120 mg/dl (indicator of diabetic stress).',
  trestbps: 'Resting systolic arterial pressure measured on admission in mm Hg.',
  chol: 'Total serum cholesterol concentration in blood (LDL + HDL + triglycerides/5).',
  cp: 'Clinical manifestation of angina: Typical, Atypical, Non-anginal, or Asymptomatic.',
  exang: 'Whether physical exercise provokes chest discomfort or myocardial ischemia.',
  thalach: 'Highest cardiac pulse rate achieved during exercise treadmill or stress testing.',
  restecg: 'Resting 12-lead electrocardiogram: normal rhythm vs. ST-T wave abnormalities.',
  oldpeak: 'Magnitude of ST-segment depression induced by exercise relative to resting baseline.',
  slope: 'Directional slope of the ST segment during peak exercise stress (Upsloping, Flat, Downsloping).',
  ca: 'Number of major coronary blood vessels (0-4) visible with fluoroscopy calcification.',
  thal: 'Thallium myocardial perfusion scan: normal blood flow vs. fixed or reversible ischemia defect.'
};

// Reusable Accessible Segmented Toggle Component with visible SELECTED & UNSELECTED states
function SegmentedToggle({
  label,
  name,
  options,
  currentValue,
  onChange,
  hint,
  tooltip,
  selectedText
}) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <label className="text-sm font-semibold text-text-mainLight dark:text-text-mainDark">
            {label}
          </label>
          {tooltip && (
            <div className="relative inline-flex items-center">
              <button
                type="button"
                onMouseEnter={() => setShowTip(true)}
                onMouseLeave={() => setShowTip(false)}
                onFocus={() => setShowTip(true)}
                onBlur={() => setShowTip(false)}
                className="text-text-mutedLight dark:text-text-mutedDark hover:text-primary transition-colors focus:outline-none"
                aria-label={`Info about ${label}`}
              >
                <Info size={14} />
              </button>
              {showTip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-base-dark text-white text-[11px] leading-tight shadow-xl z-30 pointer-events-none border border-white/10 animate-fade-in">
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
        <span className="text-[12px] font-bold text-primary dark:text-primary-light">
          {selectedText}
        </span>
      </div>

      {/* Segmented Control Track */}
      <div
        role="radiogroup"
        aria-label={label}
        className="grid grid-cols-2 p-1.5 rounded-2xl neu-inset gap-2 bg-[#DEE7F4] dark:bg-[#182035]"
      >
        {options.map((opt) => {
          const isSelected = currentValue === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(name, opt.value)}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                isSelected
                  ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_16px_rgba(79,124,255,0.45)]'
                  : 'neu-btn text-text-mutedLight dark:text-text-mutedDark hover:text-text-mainLight dark:hover:text-text-mainDark'
              }`}
            >
              {isSelected && <Check size={15} className="stroke-[3] shrink-0" />}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {hint && (
        <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
          {hint}
        </span>
      )}
    </div>
  );
}

// Reusable Field Tooltip Wrapper
function FieldHeader({ label, required, technicalCode, tooltip, rangePill }) {
  const [showTip, setShowTip] = useState(false);

  return (
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-sm font-semibold text-text-mainLight dark:text-text-mainDark">
          {label} {required && <span className="text-risk-high">*</span>}
        </label>
        {technicalCode && (
          <span className="text-[11px] font-mono text-text-mutedLight dark:text-text-mutedDark">
            ({technicalCode})
          </span>
        )}
        {tooltip && (
          <div className="relative inline-flex items-center">
            <button
              type="button"
              onMouseEnter={() => setShowTip(true)}
              onMouseLeave={() => setShowTip(false)}
              onFocus={() => setShowTip(true)}
              onBlur={() => setShowTip(false)}
              className="text-text-mutedLight dark:text-text-mutedDark hover:text-primary transition-colors focus:outline-none"
              aria-label={`Info about ${label}`}
            >
              <Info size={14} />
            </button>
            {showTip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2.5 rounded-xl bg-base-dark text-white text-[11px] leading-tight shadow-xl z-30 pointer-events-none border border-white/10 animate-fade-in">
                {tooltip}
              </div>
            )}
          </div>
        )}
      </div>

      {rangePill && (
        <span className="px-2 py-0.5 rounded-full neu-surface text-[11.5px] font-bold text-text-mutedLight dark:text-text-mutedDark">
          {rangePill}
        </span>
      )}
    </div>
  );
}

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

  // Validation function identical to previous rules
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

  // Age slider filled percentage
  const agePercent = Math.min(100, Math.max(0, ((formData.age - 18) / (100 - 18)) * 100));

  return (
    <div className="w-full max-w-5xl animate-fade-in my-6 space-y-8">
      
      {/* Header Banner */}
      <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-primary dark:text-primary-light tracking-tight">
            Clinical Diagnostic Parameters
          </h2>
          <p className="text-sm font-medium text-text-mutedLight dark:text-text-mutedDark mt-1">
            Enter verified patient measurements to evaluate cardiovascular risk with ML explainability.
          </p>
        </div>

        {/* Status chip */}
        <div
          className={`flex items-center gap-2 self-start sm:self-auto px-4 py-2 rounded-2xl border text-xs font-bold tracking-wide transition-all ${
            isValid
              ? 'bg-risk-low/10 border-risk-low/40 text-risk-low'
              : 'bg-risk-high/10 border-risk-high/40 text-risk-high'
          }`}
        >
          {isValid ? (
            <>
              <CheckCircle2 size={16} className="text-risk-low" />
              <span>All 13 Parameters Valid</span>
            </>
          ) : (
            <>
              <AlertCircle size={16} className="text-risk-high" />
              <span>{Object.keys(errors).length} Parameter(s) Need Correction</span>
            </>
          )}
        </div>
      </div>

      {backendError && (
        <div className="p-4 bg-risk-high/10 border border-risk-high/30 rounded-2xl flex items-start gap-3 text-risk-high text-sm">
          <AlertTriangle size={20} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Validation or Server Notice</p>
            <p className="text-xs mt-0.5 leading-relaxed">{backendError}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* SECTION 1 CARD: Demographics & Medical History */}
        <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-primary/20 dark:border-white/10">
            <div className="w-9 h-9 rounded-xl neu-surface flex items-center justify-center text-primary">
              <User size={19} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-mainLight dark:text-text-mainDark">
                Section 1: Demographics & Medical History
              </h3>
              <p className="text-xs text-text-mutedLight dark:text-text-mutedDark">
                Baseline patient profile and metabolic risk factors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Patient Name */}
            <div className="flex flex-col">
              <FieldHeader
                label="Patient Name"
                required={true}
                technicalCode={null}
                tooltip={MEDICAL_TOOLTIPS.patient_name}
                rangePill="2 - 60 chars"
              />
              <div className="relative">
                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  onBlur={() => handleBlur('patient_name')}
                  placeholder="e.g. Alex Mercer"
                  className={`neu-inset w-full p-3.5 rounded-xl text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                    touched.patient_name && errors.patient_name
                      ? 'border-2 border-risk-high'
                      : 'border border-transparent'
                  }`}
                />
                {touched.patient_name && !errors.patient_name && (
                  <Check size={16} className="absolute right-3.5 top-4 text-risk-low pointer-events-none" />
                )}
              </div>
              <div className="min-h-[20px] mt-1">
                {touched.patient_name && errors.patient_name ? (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.patient_name}
                  </span>
                ) : (
                  <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                    Used for clinical report personalization
                  </span>
                )}
              </div>
            </div>

            {/* Patient Age Slider with Filled Progress */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm font-semibold text-text-mainLight dark:text-text-mainDark">
                    Patient Age <span className="text-risk-high">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-text-mutedLight dark:text-text-mutedDark">(age)</span>
                  <div className="relative inline-flex items-center">
                    <Info size={14} className="text-text-mutedLight dark:text-text-mutedDark" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-black text-xs shadow-md">
                    {formData.age} yrs
                  </span>
                  <span className="px-2 py-0.5 rounded-full neu-surface text-[11.5px] font-bold text-text-mutedLight dark:text-text-mutedDark">
                    18 - 100
                  </span>
                </div>
              </div>

              {/* Slider Track with Dynamic Fill */}
              <div className="relative pt-2 pb-1">
                <input
                  type="range"
                  name="age"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  onBlur={() => handleBlur('age')}
                  style={{
                    background: `linear-gradient(to right, #4F7CFF 0%, #8B5CF6 ${agePercent}%, rgba(120,150,200,0.2) ${agePercent}%, rgba(120,150,200,0.2) 100%)`
                  }}
                  className="w-full h-2.5 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[11px] font-semibold text-text-mutedLight dark:text-text-mutedDark mt-1.5">
                  <span>18 yrs</span>
                  <span>59 yrs</span>
                  <span>100 yrs</span>
                </div>
              </div>

              <div className="min-h-[20px] mt-1">
                {touched.age && errors.age && (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.age}
                  </span>
                )}
              </div>
            </div>

            {/* Biological Sex (Segmented Control) */}
            <SegmentedToggle
              label="Biological Sex"
              name="sex"
              options={[
                { value: 1, label: 'Male' },
                { value: 0, label: 'Female' }
              ]}
              currentValue={formData.sex}
              onChange={handleToggle}
              hint="Cardiovascular baseline cohort indicator"
              tooltip={MEDICAL_TOOLTIPS.sex}
              selectedText={`Selected: ${formData.sex === 1 ? 'Male' : 'Female'}`}
            />

            {/* Fasting Blood Sugar (Segmented Control) */}
            <SegmentedToggle
              label="Fasting Blood Sugar > 120 mg/dl"
              name="fbs"
              options={[
                { value: 1, label: 'Yes (> 120)' },
                { value: 0, label: 'No (≤ 120)' }
              ]}
              currentValue={formData.fbs}
              onChange={handleToggle}
              hint="Marker for metabolic stress and glycemic control"
              tooltip={MEDICAL_TOOLTIPS.fbs}
              selectedText={`Selected: ${formData.fbs === 1 ? 'Yes (> 120 mg/dl)' : 'No (≤ 120 mg/dl)'}`}
            />

          </div>
        </div>

        {/* SECTION 2 CARD: Hemodynamics & Vitals */}
        <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-primary/20 dark:border-white/10">
            <div className="w-9 h-9 rounded-xl neu-surface flex items-center justify-center text-primary">
              <Activity size={19} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-mainLight dark:text-text-mainDark">
                Section 2: Hemodynamics & Vitals
              </h3>
              <p className="text-xs text-text-mutedLight dark:text-text-mutedDark">
                Arterial pressures, lipid concentration, and symptomatic chest pain
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Resting Blood Pressure */}
            <div className="flex flex-col">
              <FieldHeader
                label="Resting Blood Pressure"
                required={true}
                technicalCode="trestbps"
                tooltip={MEDICAL_TOOLTIPS.trestbps}
                rangePill="80 - 220"
              />
              <div className="relative">
                <input
                  type="number"
                  name="trestbps"
                  min="80"
                  max="220"
                  value={formData.trestbps}
                  onChange={handleChange}
                  onBlur={() => handleBlur('trestbps')}
                  className={`neu-inset w-full p-3.5 pr-20 rounded-xl text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                    touched.trestbps && errors.trestbps
                      ? 'border-2 border-risk-high'
                      : 'border border-transparent'
                  }`}
                />
                <span className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg text-xs font-bold neu-surface text-primary dark:text-primary-light pointer-events-none">
                  mmHg
                </span>
              </div>
              <div className="min-h-[20px] mt-1">
                {touched.trestbps && errors.trestbps ? (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.trestbps}
                  </span>
                ) : (
                  <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                    Systolic pressure measured at rest
                  </span>
                )}
              </div>
            </div>

            {/* Serum Cholesterol */}
            <div className="flex flex-col">
              <FieldHeader
                label="Serum Cholesterol"
                required={true}
                technicalCode="chol"
                tooltip={MEDICAL_TOOLTIPS.chol}
                rangePill="100 - 600"
              />
              <div className="relative">
                <input
                  type="number"
                  name="chol"
                  min="100"
                  max="600"
                  value={formData.chol}
                  onChange={handleChange}
                  onBlur={() => handleBlur('chol')}
                  className={`neu-inset w-full p-3.5 pr-20 rounded-xl text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                    touched.chol && errors.chol
                      ? 'border-2 border-risk-high'
                      : 'border border-transparent'
                  }`}
                />
                <span className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg text-xs font-bold neu-surface text-primary dark:text-primary-light pointer-events-none">
                  mg/dl
                </span>
              </div>
              <div className="min-h-[20px] mt-1">
                {touched.chol && errors.chol ? (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.chol}
                  </span>
                ) : (
                  <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                    Total circulating serum lipids
                  </span>
                )}
              </div>
            </div>

            {/* Chest Pain Type (Custom Dropdown) */}
            <div className="flex flex-col">
              <FieldHeader
                label="Chest Pain Type"
                required={false}
                technicalCode="cp"
                tooltip={MEDICAL_TOOLTIPS.cp}
                rangePill="4 Categories"
              />
              <div className="relative">
                <select
                  name="cp"
                  value={formData.cp}
                  onChange={handleChange}
                  className="neu-inset w-full p-3.5 pr-10 rounded-xl text-xs sm:text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer appearance-none hover:border-primary/50 transition-all"
                >
                  <option value={0} className="bg-[#141B30] text-slate-100 py-2">Typical Angina (0)</option>
                  <option value={1} className="bg-[#141B30] text-slate-100 py-2">Atypical Angina (1)</option>
                  <option value={2} className="bg-[#141B30] text-slate-100 py-2">Non-anginal Pain (2)</option>
                  <option value={3} className="bg-[#141B30] text-slate-100 py-2">Asymptomatic (3)</option>
                </select>
                <ChevronDown size={17} className="absolute right-3.5 top-4 text-primary pointer-events-none" />
              </div>
              <div className="min-h-[20px] mt-1">
                <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                  Clinical symptom pattern
                </span>
              </div>
            </div>

            {/* Exercise Induced Angina (Segmented Control) */}
            <SegmentedToggle
              label="Exercise Induced Angina"
              name="exang"
              options={[
                { value: 1, label: 'Yes (Induced)' },
                { value: 0, label: 'No (None)' }
              ]}
              currentValue={formData.exang}
              onChange={handleToggle}
              hint="Cardiac pain triggered by physical exertion"
              tooltip={MEDICAL_TOOLTIPS.exang}
              selectedText={`Selected: ${formData.exang === 1 ? 'Yes (Induced)' : 'No (None)'}`}
            />

          </div>
        </div>

        {/* SECTION 3 CARD: Cardiac Diagnostic Tests */}
        <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-3 border-b border-primary/20 dark:border-white/10">
            <div className="w-9 h-9 rounded-xl neu-surface flex items-center justify-center text-primary">
              <Stethoscope size={19} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-text-mainLight dark:text-text-mainDark">
                Section 3: Cardiac Diagnostic Tests
              </h3>
              <p className="text-xs text-text-mutedLight dark:text-text-mutedDark">
                Electrocardiographic markers, chronotropic capacity, and fluoroscopy
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Max Heart Rate */}
            <div className="flex flex-col">
              <FieldHeader
                label="Max Heart Rate"
                required={true}
                technicalCode="thalach"
                tooltip={MEDICAL_TOOLTIPS.thalach}
                rangePill="60 - 220"
              />
              <div className="relative">
                <input
                  type="number"
                  name="thalach"
                  min="60"
                  max="220"
                  value={formData.thalach}
                  onChange={handleChange}
                  onBlur={() => handleBlur('thalach')}
                  className={`neu-inset w-full p-3.5 pr-18 rounded-xl text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                    touched.thalach && errors.thalach
                      ? 'border-2 border-risk-high'
                      : 'border border-transparent'
                  }`}
                />
                <span className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg text-xs font-bold neu-surface text-primary dark:text-primary-light pointer-events-none">
                  bpm
                </span>
              </div>
              <div className="min-h-[20px] mt-1">
                {touched.thalach && errors.thalach ? (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.thalach}
                  </span>
                ) : (
                  <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                    Peak exercise stress pulse
                  </span>
                )}
              </div>
            </div>

            {/* Resting ECG Result (Dropdown) */}
            <div className="flex flex-col">
              <FieldHeader
                label="Resting ECG Result"
                required={true}
                technicalCode="restecg"
                tooltip={MEDICAL_TOOLTIPS.restecg}
                rangePill="0 - 2"
              />
              <div className="relative">
                <select
                  name="restecg"
                  value={formData.restecg}
                  onChange={handleChange}
                  className="neu-inset w-full p-3.5 pr-10 rounded-xl text-xs sm:text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer appearance-none hover:border-primary/50 transition-all"
                >
                  <option value={0} className="bg-[#141B30] text-slate-100 py-2">Normal (0)</option>
                  <option value={1} className="bg-[#141B30] text-slate-100 py-2">ST-T Wave Abnormality (1)</option>
                  <option value={2} className="bg-[#141B30] text-slate-100 py-2">Left Ventricular Hypertrophy (2)</option>
                </select>
                <ChevronDown size={17} className="absolute right-3.5 top-4 text-primary pointer-events-none" />
              </div>
              <div className="min-h-[20px] mt-1">
                <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                  Resting cardiac electrical vector
                </span>
              </div>
            </div>

            {/* ST Depression */}
            <div className="flex flex-col">
              <FieldHeader
                label="ST Depression"
                required={true}
                technicalCode="oldpeak"
                tooltip={MEDICAL_TOOLTIPS.oldpeak}
                rangePill="0.0 - 7.0"
              />
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  name="oldpeak"
                  min="0.0"
                  max="7.0"
                  value={formData.oldpeak}
                  onChange={handleChange}
                  onBlur={() => handleBlur('oldpeak')}
                  className={`neu-inset w-full p-3.5 pr-14 rounded-xl text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                    touched.oldpeak && errors.oldpeak
                      ? 'border-2 border-risk-high'
                      : 'border border-transparent'
                  }`}
                />
                <span className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg text-xs font-bold neu-surface text-primary dark:text-primary-light pointer-events-none">
                  mm
                </span>
              </div>
              <div className="min-h-[20px] mt-1">
                {touched.oldpeak && errors.oldpeak ? (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.oldpeak}
                  </span>
                ) : (
                  <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                    Stress ST depression relative to rest
                  </span>
                )}
              </div>
            </div>

            {/* ST Slope (Dropdown) */}
            <div className="flex flex-col">
              <FieldHeader
                label="ST Slope"
                required={false}
                technicalCode="slope"
                tooltip={MEDICAL_TOOLTIPS.slope}
                rangePill="0 - 2"
              />
              <div className="relative">
                <select
                  name="slope"
                  value={formData.slope}
                  onChange={handleChange}
                  className="neu-inset w-full p-3.5 pr-10 rounded-xl text-xs sm:text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer appearance-none hover:border-primary/50 transition-all"
                >
                  <option value={0} className="bg-[#141B30] text-slate-100 py-2">Upsloping (0)</option>
                  <option value={1} className="bg-[#141B30] text-slate-100 py-2">Flat (1)</option>
                  <option value={2} className="bg-[#141B30] text-slate-100 py-2">Downsloping (2)</option>
                </select>
                <ChevronDown size={17} className="absolute right-3.5 top-4 text-primary pointer-events-none" />
              </div>
              <div className="min-h-[20px] mt-1">
                <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                  Peak exercise ST vector
                </span>
              </div>
            </div>

            {/* Major Vessels (0-4) */}
            <div className="flex flex-col">
              <FieldHeader
                label="Major Vessels (0-4)"
                required={true}
                technicalCode="ca"
                tooltip={MEDICAL_TOOLTIPS.ca}
                rangePill="0 - 4"
              />
              <div className="relative">
                <input
                  type="number"
                  name="ca"
                  min="0"
                  max="4"
                  value={formData.ca}
                  onChange={handleChange}
                  onBlur={() => handleBlur('ca')}
                  className={`neu-inset w-full p-3.5 pr-18 rounded-xl text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none transition-all ${
                    touched.ca && errors.ca
                      ? 'border-2 border-risk-high'
                      : 'border border-transparent'
                  }`}
                />
                <span className="absolute right-3 top-2.5 px-2.5 py-1 rounded-lg text-xs font-bold neu-surface text-primary dark:text-primary-light pointer-events-none">
                  vessels
                </span>
              </div>
              <div className="min-h-[20px] mt-1">
                {touched.ca && errors.ca ? (
                  <span className="text-risk-high text-xs font-semibold flex items-center gap-1">
                    <AlertCircle size={13} /> {errors.ca}
                  </span>
                ) : (
                  <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                    Colored by fluoroscopy
                  </span>
                )}
              </div>
            </div>

            {/* Thalassemia Scan (Dropdown) */}
            <div className="flex flex-col">
              <FieldHeader
                label="Thalassemia"
                required={false}
                technicalCode="thal"
                tooltip={MEDICAL_TOOLTIPS.thal}
                rangePill="4 States"
              />
              <div className="relative">
                <select
                  name="thal"
                  value={formData.thal}
                  onChange={handleChange}
                  className="neu-inset w-full p-3.5 pr-10 rounded-xl text-xs sm:text-sm font-semibold text-text-mainLight dark:text-text-mainDark focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer appearance-none hover:border-primary/50 transition-all"
                >
                  <option value={0} className="bg-[#141B30] text-slate-100 py-2">Normal / Null (0)</option>
                  <option value={1} className="bg-[#141B30] text-slate-100 py-2">Fixed Defect (1)</option>
                  <option value={2} className="bg-[#141B30] text-slate-100 py-2">Normal Blood Flow (2)</option>
                  <option value={3} className="bg-[#141B30] text-slate-100 py-2">Reversible Defect (3)</option>
                </select>
                <ChevronDown size={17} className="absolute right-3.5 top-4 text-primary pointer-events-none" />
              </div>
              <div className="min-h-[20px] mt-1">
                <span className="text-[12px] text-text-mutedLight dark:text-text-mutedDark">
                  Thallium perfusion scintigraphy
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* SUBMIT ACTION CARD */}
        <div className="liquid-glass liquid-glass-specular rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm sm:text-base font-bold text-text-mainLight dark:text-text-mainDark">
              Verification Status
            </h4>
            <p className="text-xs sm:text-sm font-medium text-text-mutedLight dark:text-text-mutedDark">
              {isValid ? (
                <span className="text-risk-low font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                  <Check size={16} className="stroke-[3]" /> All diagnostic bounds verified. Ready for inference.
                </span>
              ) : (
                <span className="text-risk-high font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                  <AlertCircle size={16} /> Complete or correct highlighted fields above to continue.
                </span>
              )}
            </p>
          </div>

          <div className="relative w-full sm:w-auto">
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              title={!isValid ? 'Complete all required fields within allowed limits' : 'Submit for risk inference'}
              className={`w-full sm:w-auto px-10 py-4.5 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-glow-primary ${
                !isValid || isSubmitting
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                  : 'btn-gradient-cta text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <span>Analyze Pulse</span>
              <ChevronRight size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
