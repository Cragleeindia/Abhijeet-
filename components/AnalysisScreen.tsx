
import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, LoaderIcon } from './icons';

const analysisSteps = [
  "Initializing analysis engine",
  "Detecting scene cuts & shot lengths",
  "Mapping audio beats & SFX markers",
  "Identifying transitions & effects",
  "Extracting on-screen text & captions",
  "Analyzing color grading & style",
  "Generating editable template",
];

const AnalysisScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prevStep => {
        if (prevStep < analysisSteps.length -1) {
          return prevStep + 1;
        }
        clearInterval(interval);
        return prevStep;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-8 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">Analyzing Your Reel...</h2>
      <p className="text-gray-400 mb-8">This will just take a moment.</p>
      
      <div className="w-full space-y-3">
        {analysisSteps.map((step, index) => (
          <div key={index} className="flex items-center space-x-3 transition-opacity duration-300" style={{ opacity: index <= currentStep ? 1 : 0.5 }}>
            {index < currentStep ? (
              <CheckCircleIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
            ) : (
              <LoaderIcon className="w-6 h-6 text-indigo-400 animate-spin flex-shrink-0" />
            )}
            <span className={`text-sm ${index <= currentStep ? 'text-gray-300' : 'text-gray-500'}`}>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalysisScreen;
