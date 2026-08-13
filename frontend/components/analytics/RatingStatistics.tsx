'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface RatingStatisticsProps {
  maxStars: number;
  answers: string[];
}

export const RatingStatistics: React.FC<RatingStatisticsProps> = ({
  maxStars,
  answers,
}) => {
  const totalAnswers = answers.length;

  // Filter numeric ratings
  const numericRatings = answers
    .map((a) => parseInt(a, 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= maxStars);

  const avgRating =
    numericRatings.length > 0
      ? (numericRatings.reduce((sum, val) => sum + val, 0) / numericRatings.length).toFixed(1)
      : '0.0';

  // Distribution counts
  const distribution = Array(maxStars).fill(0);
  numericRatings.forEach((rating) => {
    distribution[rating - 1]++;
  });

  return (
    <div className="flex flex-col sm:flex-row gap-6 sm:items-center justify-between select-none">
      
      {/* Big Average Display */}
      <div className="flex flex-col items-center justify-center shrink-0 p-4 border border-slate-100 rounded-2xl bg-slate-50/20 w-24">
        <Star className="h-6 w-6 text-amber-400 fill-current mb-1" />
        <span className="text-xl font-bold text-slate-800 font-mono leading-none">
          {avgRating}
        </span>
        <span className="text-[9px] font-bold text-slate-400 mt-1">
          out of {maxStars}
        </span>
      </div>

      {/* Distribution Bars */}
      <div className="flex-1 flex flex-col gap-2.5">
        {[...Array(maxStars)].map((_, idx) => {
          const starVal = maxStars - idx; // Render highest star first
          const count = distribution[starVal - 1] || 0;
          const percentage = totalAnswers > 0 ? Math.round((count / totalAnswers) * 100) : 0;

          return (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 w-3 shrink-0">
                {starVal}★
              </span>
              
              <div className="flex-1 h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <span className="text-[10px] font-bold text-slate-400 w-12 text-right font-mono">
                {count} ({percentage}%)
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
export default RatingStatistics;
