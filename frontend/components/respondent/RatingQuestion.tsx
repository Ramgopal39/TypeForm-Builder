'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface RatingQuestionProps {
  value: string;
  onChange: (val: string) => void;
  onAdvance: () => void;
  settings?: Record<string, any> | null;
}

export const RatingQuestion: React.FC<RatingQuestionProps> = ({
  value,
  onChange,
  onAdvance,
  settings,
}) => {
  const maxStars = settings?.max_stars || 5;
  const currentRating = value ? parseInt(value, 10) : 0;
  const [hoverRating, setHoverRating] = useState<number>(0);

  const handleSelect = (val: number) => {
    onChange(String(val));
    // Auto advance after 250ms for visual feedback
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

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= maxStars) {
        handleSelect(num);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [maxStars]);

  return (
    <div className="flex flex-col gap-3 select-none mt-2">
      <div className="flex items-center gap-2">
        {[...Array(maxStars)].map((_, idx) => {
          const starVal = idx + 1;
          const isLit = (hoverRating || currentRating) >= starVal;
          return (
            <button
              key={idx}
              type="button"
              onMouseEnter={() => setHoverRating(starVal)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleSelect(starVal)}
              className={`p-2 rounded-2xl transition hover:bg-slate-50 ${
                isLit ? 'text-amber-400 scale-105' : 'text-slate-200 hover:text-slate-350'
              }`}
            >
              <Star className="h-10 w-10 fill-current" />
            </button>
          );
        })}
      </div>
      
      {/* Keyboard hints */}
      <span className="text-[10px] text-slate-400 font-bold self-start mt-2 bg-slate-50 border border-slate-100 rounded-lg px-2 py-0.5">
        Press keys 1 to {maxStars} to select rating
      </span>
    </div>
  );
};
export default RatingQuestion;
