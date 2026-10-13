import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      className="p-3 rounded-2xl neu-btn text-primary hover:text-secondary transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {darkMode ? (
        <Sun size={20} className="text-risk-moderate animate-pulse" />
      ) : (
        <Moon size={20} className="text-primary" />
      )}
    </button>
  );
}
