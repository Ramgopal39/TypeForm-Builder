'use client';

import React, { useEffect, useRef } from 'react';

interface NumberQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
}

export const NumberQuestion: React.FC<NumberQuestionProps> = ({
  value,
  onChange,
  onKeyDown,
  autoFocus = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  return (
    <div className="flex flex-col gap-2 max-w-sm w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          // Allow digits, decimal dots, minus signs, and empty values
          const clean = e.target.value.replace(/[^0-9.-]/g, '');
          onChange(clean);
        }}
        onKeyDown={onKeyDown}
        placeholder="Enter a number..."
        className="w-full text-xl sm:text-2xl border-b border-slate-350 focus:border-slate-800 py-2.5 focus:outline-none bg-transparent placeholder-slate-300 font-semibold text-slate-800 transition"
      />
    </div>
  );
};
export default NumberQuestion;
