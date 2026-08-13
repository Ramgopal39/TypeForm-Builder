'use client';

import React, { useEffect, useRef } from 'react';

interface LongTextQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  autoFocus?: boolean;
}

export const LongTextQuestion: React.FC<LongTextQuestionProps> = ({
  value,
  onChange,
  onKeyDown,
  autoFocus = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Advancing on Ctrl+Enter is typical for textareas to prevent blocking simple newlines
    if (e.key === 'Enter' && e.ctrlKey && onKeyDown) {
      onKeyDown(e);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-xl w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your paragraph response here..."
        rows={4}
        className="w-full text-xl border-b border-slate-350 focus:border-slate-800 py-2.5 focus:outline-none bg-transparent resize-none placeholder-slate-300 font-semibold text-slate-800 transition"
      />
      <span className="text-[10px] text-slate-400 font-bold self-start mt-1">
        Press Ctrl + Enter to submit/continue
      </span>
    </div>
  );
};
export default LongTextQuestion;
