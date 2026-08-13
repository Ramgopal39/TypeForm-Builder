'use client';

import React, { useEffect, useRef } from 'react';

interface EmailQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
}

export const EmailQuestion: React.FC<EmailQuestionProps> = ({
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
    <div className="flex flex-col gap-2 max-w-lg w-full">
      <input
        ref={inputRef}
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="name@example.com"
        className="w-full text-xl sm:text-2xl border-b border-slate-350 focus:border-slate-800 py-2.5 focus:outline-none bg-transparent placeholder-slate-300 font-semibold text-slate-800 transition"
      />
    </div>
  );
};
export default EmailQuestion;
