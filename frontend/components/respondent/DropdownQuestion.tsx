'use client';

import React from 'react';

interface DropdownQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onAdvance: () => void;
  settings?: Record<string, any> | null;
}

export const DropdownQuestion: React.FC<DropdownQuestionProps> = ({
  value,
  onChange,
  onAdvance,
  settings,
}) => {
  const options = settings?.options || ['Option 1', 'Option 2'];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    onChange(val);
    if (val) {
      setTimeout(() => {
        onAdvance();
      }, 300);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm w-full select-none mt-2">
      <select
        value={value}
        onChange={handleChange}
        className="w-full text-base font-semibold px-4 py-3 border-2 border-slate-100 focus:border-slate-800 focus:outline-none rounded-2xl text-slate-700 bg-white shadow-sm transition"
      >
        <option value="">Select an option...</option>
        {options.map((opt: string, idx: number) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};
export default DropdownQuestion;
