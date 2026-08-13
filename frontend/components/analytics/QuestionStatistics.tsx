'use client';

import React from 'react';
import { FormResponseItem, QuestionItem } from '@/lib/api';
import ChoiceStatistics from './ChoiceStatistics';
import RatingStatistics from './RatingStatistics';
import { Badge } from '@/components/ui/Badge';

interface QuestionStatisticsProps {
  questions: QuestionItem[];
  responses: FormResponseItem[];
}

export const QuestionStatistics: React.FC<QuestionStatisticsProps> = ({
  questions,
  responses,
}) => {
  const getAnswersForQuestion = (questionId: number): string[] => {
    return responses
      .map((r) => r.answers.find((a) => a.question_id === questionId)?.value)
      .filter((val): val is string => val !== undefined && val !== null && val.trim() !== '');
  };

  const sortedQuestions = [...questions].sort((a, b) => a.position - b.position);

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none bg-white border border-slate-100 rounded-3xl">
        <span className="text-sm font-bold text-slate-700">No submissions yet</span>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Aggregated statistics will appear once respondents submit answers to your form.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 select-none">
      {sortedQuestions.map((q, idx) => {
        const answers = getAnswersForQuestion(q.id);
        const totalCount = answers.length;

        // Render number aggregations
        const renderNumberStats = () => {
          const numbers = answers.map((a) => Number(a)).filter((n) => !isNaN(n));
          if (numbers.length === 0) {
            return <div className="text-slate-400 text-xs italic">No numeric data submitted.</div>;
          }

          const sum = numbers.reduce((a, b) => a + b, 0);
          const avg = (sum / numbers.length).toFixed(1);
          const min = Math.min(...numbers);
          const max = Math.max(...numbers);

          return (
            <div className="grid grid-cols-3 gap-4 text-center mt-1">
              <div className="flex flex-col gap-0.5 border border-slate-100 rounded-2xl py-2 bg-slate-50/10">
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Average</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{avg}</span>
              </div>
              <div className="flex flex-col gap-0.5 border border-slate-100 rounded-2xl py-2 bg-slate-50/10">
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Min</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{min}</span>
              </div>
              <div className="flex flex-col gap-0.5 border border-slate-100 rounded-2xl py-2 bg-slate-50/10">
                <span className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Max</span>
                <span className="text-sm font-bold text-slate-800 font-mono">{max}</span>
              </div>
            </div>
          );
        };

        // Render text submissions preview list
        const renderTextPreviewList = () => {
          const previewList = answers.slice(0, 3);
          return (
            <div className="flex flex-col gap-2 mt-1">
              <span className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                Latest Answers ({answers.length} total)
              </span>
              <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto">
                {previewList.map((ans, aIdx) => (
                  <div
                    key={aIdx}
                    className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-650 truncate max-w-full"
                    title={ans}
                  >
                    {ans}
                  </div>
                ))}
                {answers.length > 3 && (
                  <span className="text-[9px] text-slate-400 italic font-bold mt-0.5">
                    + {answers.length - 3} more answers (view in Submissions tab)
                  </span>
                )}
              </div>
            </div>
          );
        };

        return (
          <div key={q.id} className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            
            {/* Header info */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-50 pb-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-slate-850 leading-tight">
                  {idx + 1}. {q.title}
                </h3>
                <span className="text-[9px] text-slate-400 font-bold">
                  {totalCount} response{totalCount !== 1 ? 's' : ''} ({Math.round((totalCount / responses.length) * 100)}% fill rate)
                </span>
              </div>
              <Badge variant="neutral">
                {q.type.replace('_', ' ')}
              </Badge>
            </div>

            {/* Body aggregations based on type */}
            <div>
              {q.type === 'multiple_choice' || q.type === 'dropdown' ? (
                <ChoiceStatistics
                  options={q.settings?.options || []}
                  answers={answers}
                />
              ) : q.type === 'yes_no' ? (
                <ChoiceStatistics
                  options={['Yes', 'No']}
                  answers={answers}
                />
              ) : q.type === 'rating' ? (
                <RatingStatistics
                  maxStars={q.settings?.max_stars || 5}
                  answers={answers}
                />
              ) : q.type === 'number' ? (
                renderNumberStats()
              ) : (
                renderTextPreviewList()
              )}
            </div>

          </div>
        );
      })}
    </div>
  );
};
export default QuestionStatistics;
