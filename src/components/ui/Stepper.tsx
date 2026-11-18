import React from 'react';
import { Camera, Image as ImageIcon, Sparkles, Download, Check } from 'lucide-react';
import { AppStep } from '@/types';

interface StepperProps {
  currentStep: AppStep;
}

export const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  const steps: { id: AppStep; label: string; icon: React.ReactNode }[] = [
    { id: 'capture', label: 'Capture', icon: <Camera className="w-4 h-4" /> },
    { id: 'review', label: 'Review', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'editor', label: 'Customise', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'export', label: 'Export', icon: <Download className="w-4 h-4" /> },
  ];

  const getStepIndex = (step: AppStep) => {
    switch (step) {
      case 'capture':
        return 0;
      case 'review':
        return 1;
      case 'editor':
        return 2;
      case 'export':
        return 3;
      default:
        return -1;
    }
  };

  const currentIndex = getStepIndex(currentStep);
  if (currentIndex === -1) return null;

  return (
    <nav aria-label="Booth progress" className="w-full max-w-xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-pink/20 -z-0">
          <div
            className="h-full bg-pink-deep transition-all duration-300"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, idx) => {
          const isDone = idx < currentIndex;
          const isActive = idx === currentIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-display text-xs font-semibold transition-all duration-200 border-2 ${
                  isDone
                    ? 'bg-pink-deep text-white border-pink-deep'
                    : isActive
                    ? 'bg-surface text-pink-deep border-pink-deep shadow-booth scale-110'
                    : 'bg-surface text-muted border-pink/30'
                }`}
              >
                {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : step.icon}
              </div>
              <span
                className={`text-xs font-display mt-1.5 transition-colors whitespace-nowrap ${
                  isActive ? 'font-bold text-pink-deep' : 'text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
