'use client';

import React, { useState } from 'react';
import { QuestionItem } from '@/lib/api';
import { Star, Check } from 'lucide-react';

interface LivePreviewProps {
  question: QuestionItem | null;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ question }) => {
  const [mockSelected, setMockSelected] = useState<string | null>(null);
  const [mockRating, setMockRating] = useState<number>(0);
  const [mockHoverRating, setMockHoverRating] = useState<number>(0);

  if (!question) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col items-center justify-center p-8 select-none">
        <div className="border border-slate-200/80 rounded-2xl p-6 bg-white shadow-sm max-w-sm w-full text-center">
          <p className="text-xs text-slate-400 font-medium">
            Active preview canvas
          </p>
          <p className="text-[10px] text-slate-300 mt-1">
            Visual mockup updates as you adjust settings.
          </p>
        </div>
      </div>
    );
  }

  // Format type settings options
  const settings = question.settings || {};
  const options = settings.options || ['Option 1', 'Option 2'];

  return (
    <div className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-8 overflow-y-auto select-none">
      
      {/* Phone/Tablet-like canvas box */}
      <div className="max-w-xl w-full py-12 px-6 flex flex-col gap-6">
        
        {/* Index and Question title block */}
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2.5">
            <span className="text-sm font-semibold text-slate-500 font-mono mt-1 shrink-0">
              1 →
            </span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">
                {question.title || <span className="text-slate-350 italic">Untitled question</span>}
                {question.required && (
                  <span className="text-rose-500 text-sm ml-1" title="Required">*</span>
                )}
              </h2>
              {question.description && (
                <p className="text-xs text-slate-400 font-medium mt-1.5 leading-relaxed">
                  {question.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic responder elements */}
        <div className="pl-7 mt-2">
          
          {/* 1. Short Text / Email / Number */}
          {(question.type === 'short_text' || question.type === 'email' || question.type === 'number') && (
            <div className="flex flex-col gap-3 max-w-sm">
              <input
                type="text"
                disabled
                placeholder={
                  question.type === 'email' 
                    ? 'name@example.com' 
                    : question.type === 'number' 
                    ? 'Enter a number...' 
                    : 'Type your answer here...'
                }
                className="w-full text-lg border-b border-slate-200 py-2 focus:outline-none bg-transparent placeholder-slate-300 font-medium"
              />
              <span className="text-[10px] text-slate-400 font-bold self-start mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Press Enter ↵
              </span>
            </div>
          )}

          {/* 2. Long Text */}
          {question.type === 'long_text' && (
            <div className="flex flex-col gap-3 max-w-md">
              <textarea
                disabled
                placeholder="Type your paragraph response here..."
                rows={3}
                className="w-full text-lg border-b border-slate-200 py-2 focus:outline-none bg-transparent resize-none placeholder-slate-300 font-medium"
              />
              <span className="text-[10px] text-slate-400 font-bold self-start mt-1 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Press Enter ↵
              </span>
            </div>
          )}

          {/* 3. Yes / No */}
          {question.type === 'yes_no' && (
            <div className="flex items-center gap-3">
              {['Yes', 'No'].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMockSelected(val)}
                  className={`w-28 py-3 rounded-xl border font-bold text-sm flex items-center justify-between px-4 transition-all duration-150 ${
                    mockSelected === val
                      ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50'
                  }`}
                >
                  <span>{val}</span>
                  <div className={`h-5 w-5 rounded-md border text-[10px] flex items-center justify-center font-bold font-mono ${
                    mockSelected === val ? 'border-slate-700 bg-slate-800' : 'border-slate-150 bg-slate-50 text-slate-400'
                  }`}>
                    {val.charAt(0)}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 4. Multiple Choice / Dropdown */}
          {(question.type === 'multiple_choice' || question.type === 'dropdown') && (
            <div className="flex flex-col gap-2 max-w-sm">
              {options.map((opt: string, idx: number) => {
                const labelLetter = String.fromCharCode(65 + idx);
                const isSelected = mockSelected === opt;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setMockSelected(opt)}
                    className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-3 px-4 text-left transition-all duration-150 ${
                      isSelected
                        ? 'border-slate-800 bg-slate-900 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`h-5.5 w-5.5 rounded border text-[10px] flex items-center justify-center font-bold font-mono shrink-0 ${
                      isSelected ? 'border-slate-700 bg-slate-800' : 'border-slate-150 bg-slate-50 text-slate-400'
                    }`}>
                      {labelLetter}
                    </span>
                    <span className="flex-1 truncate">{opt}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* 5. Rating Stars */}
          {question.type === 'rating' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1.5">
                {[...Array(settings.max_stars || 5)].map((_, idx) => {
                  const starVal = idx + 1;
                  const isLit = (mockHoverRating || mockRating) >= starVal;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onMouseEnter={() => setMockHoverRating(starVal)}
                      onMouseLeave={() => setMockHoverRating(0)}
                      onClick={() => setMockRating(starVal)}
                      className={`p-1.5 rounded-xl transition ${
                        isLit ? 'text-amber-400 scale-105' : 'text-slate-200 hover:text-slate-300'
                      }`}
                    >
                      <Star className="h-8 w-8 fill-current" />
                    </button>
                  );
                })}
              </div>
              {mockRating > 0 && (
                <span className="text-[10px] text-slate-400 font-bold">
                  Selected Rating: {mockRating} / {settings.max_stars || 5}
                </span>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
export default LivePreview;
