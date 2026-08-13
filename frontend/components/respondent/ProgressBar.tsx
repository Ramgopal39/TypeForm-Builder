'use client';

import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const percentage = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] bg-slate-100 z-50 overflow-hidden select-none">
      <div
        className="h-full bg-slate-900 transition-all duration-300 ease-out rounded-r-full"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
export default ProgressBar;
