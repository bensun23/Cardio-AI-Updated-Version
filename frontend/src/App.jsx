import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import Landing from './components/Landing';
import PatientForm from './components/PatientForm';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const [step, setStep] = useState('landing'); // 'landing' | 'form' | 'loading' | 'result'
  const [formData, setFormData] = useState({
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

  const [prediction, setPrediction] = useState(null);
  const [backendError, setBackendError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dark Mode with persistence in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Form submission with enforced 1.5s minimum display time
  const handleFormSubmit = async (dataToSubmit) => {
    setFormData(dataToSubmit);
    setBackendError(null);
    setIsSubmitting(true);
    setStep('loading');

    const minDisplayTime = new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const fetchPromise = fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit)
      });

      // Wait for both real API response and 1.5s minimum display time
      const [response] = await Promise.all([fetchPromise, minDisplayTime]);

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Prediction request failed. Please check inputs.');
      }

      setPrediction(result);
      setStep('result');
    } catch (err) {
      console.error(err);
      setBackendError(err.message);
      setStep('form');
    } finally {
      setIsSubmitting(false);
    }
  };

  // PDF report download
  const handleDownloadReport = async () => {
    if (!prediction) return;

    try {
      const response = await fetch('/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_name: formData.patient_name || 'Patient',
          patient: formData,
          probability: prediction.probability,
          risk_level: prediction.risk_level,
          contributions: prediction.contributions
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to generate medical PDF report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const safeName = (formData.patient_name || 'Patient').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
      a.href = url;
      a.download = `CardioAI_Report_${safeName}_${prediction.risk_level}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert('Could not download PDF report: ' + err.message);
      throw err;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans transition-colors duration-500">
      
      {/* Background Slow-Moving Blurred Blue & Violet Liquid Blobs */}
      <div className="fixed top-[-10%] left-[-5%] w-[34rem] h-[34rem] rounded-full bg-primary/15 dark:bg-primary/20 blur-3xl pointer-events-none animate-blob-float"></div>
      <div
        className="fixed bottom-[-10%] right-[-5%] w-[38rem] h-[38rem] rounded-full bg-secondary/15 dark:bg-secondary/20 blur-3xl pointer-events-none animate-blob-float"
        style={{ animationDelay: '4s' }}
      ></div>
      <div
        className="fixed top-[40%] right-[10%] w-72 h-72 rounded-full bg-primary-light/10 dark:bg-primary-light/15 blur-2xl pointer-events-none animate-blob-float"
        style={{ animationDelay: '8s' }}
      ></div>

      {/* Subtle Noise Texture */}
      <div
        className="fixed inset-0 opacity-[0.02] dark:opacity-[0.035] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")'
        }}
      ></div>

      {/* Navigation Header */}
      <header className="relative z-20 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep('landing')}
          className="flex items-center gap-2.5 text-primary dark:text-primary-light font-black tracking-tight group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform">
            <Activity size={22} className="animate-pulse" />
          </div>
          <span className="text-xl md:text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
            CardioAI
          </span>
        </button>

        <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      </header>

      {/* Main Content Viewport */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 pb-16 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        {step === 'landing' && <Landing onStart={() => setStep('form')} />}

        {step === 'form' && (
          <PatientForm
            onSubmit={handleFormSubmit}
            initialData={formData}
            backendError={backendError}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 'loading' && <LoadingScreen />}

        {step === 'result' && prediction && (
          <ResultScreen
            patient={formData}
            prediction={prediction}
            onReevaluate={() => setStep('form')}
            onDownloadReport={handleDownloadReport}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;
