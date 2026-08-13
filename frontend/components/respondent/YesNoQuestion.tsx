'use client';

import React, { useEffect } from 'react';

interface YesNoQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onAdvance: () => void;
}

export const YesNoQuestion: React.FC<YesNoQuestionProps> = ({
  value,
  onChange,
  onAdvance,
}) => {
  const handleSelect = (val: string) => {
    onChange(val);
    // Auto advance after 250ms for visual feedback
    setTimeout(() => {
      onAdvance();
    }, 250);
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      // Only capture keyboard shortcut if not typing in a input/textarea
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'y' || e.key === 'Y') {
        handleSelect('Yes');
      } else if (e.key === 'n' || e.key === 'N') {
        handleSelect('No');
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  return (
    <div className="flex items-center gap-4 mt-2 select-none">
      {['Yes', 'No'].map((choice) => {
        const isSelected = value === choice;
        const letter = choice.charAt(0);
        return (
          <button
            key={choice}
            type="button"
            onClick={() => handleSelect(choice)}
            className={`w-32 py-4 rounded-2xl border-2 font-bold text-base flex flex-col items-center justify-center gap-3 transition-all duration-150 ${
              isSelected
                ? 'border-slate-800 bg-slate-900 text-white shadow-md'
                : 'border-slate-100 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{choice}</span>
            <div className={`h-6 w-6 rounded-md border text-[10px] flex items-center justify-center font-bold font-mono ${
              isSelected ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              {letter}
            </div>
          </button>
        );
      })}
    </div>
  );
};
export default YesNoQuestion;
