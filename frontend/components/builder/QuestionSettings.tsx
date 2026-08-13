'use client';

import React from 'react';
import ChoiceEditor from './ChoiceEditor';
import { Star } from 'lucide-react';

interface QuestionSettingsProps {
  type: string;
  settings: Record<string, any> | null;
  onChange: (settings: Record<string, any>) => void;
}

export const QuestionSettings: React.FC<QuestionSettingsProps> = ({
  type,
  settings,
  onChange,
}) => {
  const currentSettings = settings || {};

  // For multiple choice and dropdown, render the ChoiceEditor
  if (type === 'multiple_choice' || type === 'dropdown') {
    const options = currentSettings.options || ['Option 1', 'Option 2'];
    return (
      <ChoiceEditor
        options={options}
        onChange={(newOptions) => {
          onChange({ ...currentSettings, options: newOptions });
        }}
      />
    );
  }

  // For rating, render the Star rating scale config
  if (type === 'rating') {
    const maxStars = currentSettings.max_stars || 5;
    return (
      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          <Star className="h-3.5 w-3.5" />
          <span>Rating settings</span>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="rating-scale" className="text-xs text-slate-500 font-medium">
            Scale Max:
          </label>
          <select
            id="rating-scale"
            value={maxStars}
            onChange={(e) => {
              onChange({ ...currentSettings, max_stars: parseInt(e.target.value, 10) });
            }}
            className="px-2.5 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg text-slate-700 bg-white"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }

  // Default no settings needed view
  return (
    <div className="mt-2 py-3 px-4 rounded-xl border border-slate-100 bg-slate-50/30 text-center select-none">
      <span className="text-[10px] text-slate-400 font-medium italic">
        No extra configurations required for this question type.
      </span>
    </div>
  );
};
export default QuestionSettings;
