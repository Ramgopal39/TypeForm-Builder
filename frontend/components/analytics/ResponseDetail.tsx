'use client';

import React from 'react';
import { FormResponseItem, QuestionItem } from '@/lib/api';
import Modal from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

interface ResponseDetailProps {
  isOpen: boolean;
  onClose: () => void;
  response: FormResponseItem | null;
  questions: QuestionItem[];
}

export const ResponseDetail: React.FC<ResponseDetailProps> = ({
  isOpen,
  onClose,
  response,
  questions,
}) => {
  if (!response) return null;

  const getAnswerForQuestion = (questionId: number): string => {
    const answer = response.answers.find((a) => a.question_id === questionId);
    return answer ? answer.value : '';
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const sortedQuestions = [...questions].sort((a, b) => a.position - b.position);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submission Detail"
    >
      <div className="flex flex-col gap-4 select-none max-h-[70vh] overflow-y-auto pr-1">
        <div className="text-[10px] text-slate-400 font-bold border-b border-slate-50 pb-2">
          Submitted: {formatDate(response.submitted_at)}
        </div>

        <div className="flex flex-col gap-5 mt-2">
          {sortedQuestions.map((q, idx) => {
            const answerVal = getAnswerForQuestion(q.id);
            return (
              <div key={q.id} className="flex flex-col gap-1.5">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {idx + 1}. {q.title}
                  </span>
                  <Badge variant="neutral">
                    {q.type.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5 text-xs text-slate-700 font-semibold leading-relaxed break-words min-h-[36px]">
                  {answerVal.trim() ? answerVal : <span className="text-slate-350 italic">No answer provided</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
export default ResponseDetail;
