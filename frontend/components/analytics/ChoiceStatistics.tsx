'use client';

import React from 'react';

interface ChoiceStatisticsProps {
  options: string[];
  answers: string[];
}

export const ChoiceStatistics: React.FC<ChoiceStatisticsProps> = ({
  options,
  answers,
}) => {
  const totalAnswers = answers.length;

  // Calculate counts
  const counts = options.reduce((acc, opt) => {
    acc[opt] = 0;
    return acc;
  }, {} as Record<string, number>);

  answers.forEach((ans) => {
    if (counts[ans] !== undefined) {
      counts[ans]++;
    }
  });

  return (
    <div className="flex flex-col gap-3 select-none">
      {options.map((opt, idx) => {
        const count = counts[opt] || 0;
        const percentage = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;

        return (
          <div key={idx} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="truncate max-w-[240px]">{opt}</span>
              <span className="text-slate-400 font-mono">
                {count} ({percentage}%)
              </span>
            </div>
            
            {/* Horizontal progress bar */}
            <div className="h-2 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default ChoiceStatistics;
