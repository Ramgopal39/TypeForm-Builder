'use client';

import React, { useEffect } from 'react';
import { Check } from 'lucide-react';

interface ChoiceQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onAdvance: () => void;
  settings?: Record<string, any> | null;
}

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({
  value,
  onChange,
  onAdvance,
  settings,
}) => {
  const options = settings?.options || ['Option 1', 'Option 2'];

  const handleSelect = (val: string) => {
    onChange(val);
    setTimeout(() => {
      onAdvance();
    }, 250);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      // Convert pressed key to letter character
      const pressedKey = e.key.toUpperCase();
      if (pressedKey.length === 1) {
        const charCode = pressedKey.charCodeAt(0);
        // Map character code to corresponding option index (e.g. A = 65, B = 66...)
        const idx = charCode - 65;
        if (idx >= 0 && idx < options.length) {
          handleSelect(options[idx]);
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [options]);

  return (
    <div className="flex flex-col gap-2.5 max-w-sm w-full select-none mt-2">
      {options.map((opt: string, idx: number) => {
        const letter = String.fromCharCode(65 + idx);
        const isSelected = value === opt;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => handleSelect(opt)}
            className={`w-full py-3 rounded-2xl border-2 text-xs font-semibold flex items-center gap-4 px-4 text-left transition-all duration-150 ${
              isSelected
                ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span className={`h-6 w-6 rounded-md border text-[10px] flex items-center justify-center font-bold font-mono shrink-0 ${
              isSelected ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              {letter}
            </span>
            <span className="flex-1 truncate">{opt}</span>
            {isSelected && <Check className="h-4 w-4 text-white shrink-0" />}
          </button>
        );
      })}
    </div>
  );
};
export default ChoiceQuestion;
