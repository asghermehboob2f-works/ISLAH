'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface StepperHeaderProps {
  currentStep: number; // 1 to 6
  onStepClick?: (step: number) => void;
  reportType: 'civic' | 'environmental';
}

const STEPS = [
  { step: 1, title: 'Select Issue' },
  { step: 2, title: 'Upload Evidence' },
  { step: 3, title: 'Location' },
  { step: 4, title: 'Report Details' },
  { step: 5, title: 'Visibility/Emergency' },
  { step: 6, title: 'Review' }
];

export function StepperHeader({ currentStep, onStepClick, reportType }: StepperHeaderProps) {
  const isEnv = reportType === 'environmental';
  const activeColorClass = isEnv ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white';

  return (
    <div className="w-full font-sans">

      {/* Visual Stepper Pills for Desktop & Tablet — Single Line Forced */}
      <div className="hidden md:flex items-center justify-between border border-[--border] bg-[--bg-surface] p-2 sm:p-2.5 rounded-xl shadow-xs overflow-x-auto">
        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <React.Fragment key={s.step}>
              <button
                type="button"
                onClick={() => isCompleted && onStepClick && onStepClick(s.step)}
                disabled={!isCompleted}
                className={`flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${isActive
                    ? activeColorClass + ' shadow-xs'
                    : isCompleted
                      ? 'bg-[--bg-subtle] text-[--text-primary] hover:bg-[--border] cursor-pointer'
                      : 'text-[--text-secondary] opacity-50 bg-transparent cursor-not-allowed'
                  }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${isActive
                    ? 'bg-white text-slate-900'
                    : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[--bg-subtle] text-[--text-secondary] border border-[--border]'
                  }`}>
                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : s.step}
                </span>
                <span className="whitespace-nowrap">{s.title}</span>
              </button>

              {s.step < STEPS.length && (
                <div className={`h-0.5 min-w-[8px] flex-1 rounded shrink-0 ${s.step < currentStep ? (isEnv ? 'bg-emerald-500' : 'bg-blue-600') : 'bg-[--border]'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile Compact Stepper Indicator */}
      <div className="md:hidden bg-[--bg-surface] border border-[--border] p-3 rounded-xl shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-[--text-secondary] uppercase tracking-wider text-[10px]">
            Step {currentStep} of {STEPS.length}
          </span>
          <span className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${isEnv ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-blue-600/10 text-blue-600 dark:text-blue-400'}`}>
            {STEPS[currentStep - 1].title}
          </span>
        </div>

        <div className="w-full bg-[--bg-subtle] h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${isEnv ? 'bg-emerald-600' : 'bg-blue-600'}`}
            style={{ width: `${((currentStep) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

    </div>
  );
}
