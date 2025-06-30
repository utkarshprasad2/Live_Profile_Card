'use client';

import { useState } from 'react';
import { Settings, Eye, Type, Zap } from 'lucide-react';
import { useAccessibility } from './AccessibilityProvider';

export default function AccessibilityControls() {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    highContrast, 
    toggleHighContrast, 
    reducedMotion, 
    toggleReducedMotion, 
    fontSize, 
    setFontSize 
  } = useAccessibility();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <Settings className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 w-64">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
            Accessibility Settings
          </h3>
          
          <div className="space-y-4">
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">High Contrast</span>
              </div>
              <button
                onClick={toggleHighContrast}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  highContrast ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                aria-label={`${highContrast ? 'Disable' : 'Enable'} high contrast`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Reduced Motion Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Reduced Motion</span>
              </div>
              <button
                onClick={toggleReducedMotion}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  reducedMotion ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
                aria-label={`${reducedMotion ? 'Disable' : 'Enable'} reduced motion`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Size Controls */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Type className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Font Size</span>
              </div>
              <div className="flex space-x-2">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      fontSize === size
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    aria-label={`Set font size to ${size}`}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 