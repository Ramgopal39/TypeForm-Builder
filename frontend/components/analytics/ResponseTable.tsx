'use client';

import React from 'react';
import { FormResponseItem, QuestionItem } from '@/lib/api';

interface ResponseTableProps {
  questions: QuestionItem[];
  responses: FormResponseItem[];
  onSelectResponse: (item: FormResponseItem) => void;
}

export const ResponseTable: React.FC<ResponseTableProps> = ({
  questions,
  responses,
  onSelectResponse,
}) => {
  const getAnswerForQuestion = (response: FormResponseItem, questionId: number): string => {
    const answer = response.answers.find((a) => a.question_id === questionId);
    return answer ? answer.value : '-';
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  // Preview at most 3 questions
  const previewQuestions = [...questions].sort((a, b) => a.position - b.position).slice(0, 3);

  if (responses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center select-none bg-white border border-slate-100 rounded-3xl">
        <span className="text-sm font-bold text-slate-700">No submissions yet</span>
        <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
          Share your public form link with respondents to begin collecting answers.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-450 uppercase tracking-wider">
              <th className="py-4 px-6">Submission Date</th>
              {previewQuestions.map((q) => (
                <th key={q.id} className="py-4 px-6 truncate max-w-[200px]">
                  {q.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-650 font-medium">
            {responses.map((res) => (
              <tr
                key={res.id}
                onClick={() => onSelectResponse(res)}
                className="hover:bg-slate-50/50 cursor-pointer transition"
              >
                <td className="py-4 px-6 text-slate-800 font-semibold">
                  {formatDate(res.submitted_at)}
                </td>
                {previewQuestions.map((q) => (
                  <td key={q.id} className="py-4 px-6 truncate max-w-[200px] text-slate-500">
                    {getAnswerForQuestion(res, q.id)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default ResponseTable;
