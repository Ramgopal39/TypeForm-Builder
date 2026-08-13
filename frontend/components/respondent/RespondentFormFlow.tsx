'use client';

import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import QuestionTransition from './QuestionTransition';
import QuestionRenderer from './QuestionRenderer';
import ThankYouScreen from './ThankYouScreen';
import { 
  ChevronUp, 
  ChevronDown, 
  CornerDownLeft,
  AlertCircle,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { QuestionItem } from '@/lib/api';

interface RespondentFormFlowProps {
  questions: QuestionItem[];
  formTitle: string;
  onSubmit: (answers: Record<number, string>) => Promise<void>;
  isSubmitLoading: boolean;
  onClose?: () => void; // Provided in preview mode to close the previewer
}

export const RespondentFormFlow: React.FC<RespondentFormFlowProps> = ({
  questions,
  formTitle,
  onSubmit,
  isSubmitLoading,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[currentIdx] || null;

  // Validate the current slide
  const validateCurrentQuestion = (): boolean => {
    if (!currentQuestion) return true;

    const val = answers[currentQuestion.id] || '';

    // 1. Required validation
    if (currentQuestion.required && !val.trim()) {
      setError('This field is required');
      return false;
    }

    // Skip validation for empty, non-required fields
    if (!val.trim()) {
      setError(null);
      return true;
    }

    // 2. Email format validation
    if (currentQuestion.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setError('Please enter a valid email address');
        return false;
      }
    }

    // 3. Number format validation
    if (currentQuestion.type === 'number') {
      if (isNaN(Number(val))) {
        setError('Please enter a valid number');
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleNext = async () => {
    // Validate current slide first
    if (!validateCurrentQuestion()) return;

    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setError(null);
    } else {
      // Last slide, submit form answers
      try {
        await onSubmit(answers);
        setSubmitted(true);
      } catch {
        // Parent component handles showing error toast
      }
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setError(null);
    }
  };

  const handleValueChange = (val: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
    setError(null); // Clear error on change
  };

  // Handle global keyboard listeners
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      // Ignore keys if form is already submitted or is loading
      if (submitted || isSubmitLoading) return;

      const activeEl = document.activeElement;
      const isInputFocused = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      if (e.key === 'Enter') {
        // If textarea is focused, Enter adds newline, Ctrl+Enter advances
        if (currentQuestion?.type === 'long_text' && isInputFocused && !e.ctrlKey) {
          return;
        }
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' && !isInputFocused) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown' && !isInputFocused) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeys);
    };
  }, [questions, currentIdx, answers, submitted, isSubmitLoading]);

  // Thank You Screen
  if (submitted) {
    return (
      <div className="relative h-full w-full">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition select-none"
          >
            <X className="h-3.5 w-3.5" />
            Exit Preview
          </button>
        )}
        <ThankYouScreen formTitle={formTitle} />
      </div>
    );
  }

  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? ((currentIdx + 1) / totalQuestions) * 100 : 0;
  const isLastQuestion = currentIdx === totalQuestions - 1;

  return (
    <div className="h-full w-full bg-white flex flex-col justify-between overflow-hidden relative font-sans">
      
      {/* Top progress indicator */}
      <ProgressBar progress={progressPercent} />

      {/* Exit Preview float button for creators */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition select-none"
        >
          <X className="h-3.5 w-3.5" />
          Exit Preview
        </button>
      )}

      {/* Main Slide-by-slide body */}
      <div className="flex-1 flex items-center justify-center">
        {totalQuestions > 0 ? (
          <QuestionTransition activeId={currentQuestion.id}>
            <div className="flex items-start gap-2.5">
              <span className="text-sm font-semibold text-slate-400 font-mono mt-1 shrink-0">
                {currentIdx + 1} →
              </span>
              <div className="flex-1">
                {/* Question title */}
                <h1 className="text-xl sm:text-2xl font-bold text-slate-850 tracking-tight leading-tight">
                  {currentQuestion.title}
                  {currentQuestion.required && (
                    <span className="text-rose-500 text-sm ml-1" title="Required">*</span>
                  )}
                </h1>
                
                {/* Description helper text */}
                {currentQuestion.description && (
                  <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1.5 leading-relaxed">
                    {currentQuestion.description}
                  </p>
                )}

                {/* Subcomponent Inputs */}
                <div className="mt-6">
                  <QuestionRenderer
                    question={currentQuestion}
                    value={answers[currentQuestion.id] || ''}
                    onChange={handleValueChange}
                    onAdvance={handleNext}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                  />
                </div>

                {/* Validation error message */}
                {error && (
                  <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-rose-500 select-none">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Action Button & Keyboard Hint */}
                {!['yes_no', 'rating', 'multiple_choice', 'dropdown'].includes(currentQuestion.type) && (
                  <div className="flex items-center gap-3 mt-6 select-none">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleNext}
                      isLoading={isSubmitLoading}
                    >
                      {isLastQuestion ? 'Submit' : 'OK'}
                    </Button>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-0.5">
                      press <span className="font-bold">Enter</span>
                      <CornerDownLeft className="h-2.5 w-2.5" />
                    </span>
                  </div>
                )}
              </div>
            </div>
          </QuestionTransition>
        ) : (
          <div className="text-center p-6 select-none">
            <h3 className="text-sm font-bold text-slate-700">Empty Form</h3>
            <p className="text-xs text-slate-400 mt-1">This form doesn't contain any questions yet.</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation controls */}
      <div className="h-14 border-t border-slate-100 px-6 flex items-center justify-end gap-2 bg-slate-50/20 shrink-0 select-none">
        
        {/* Progress Text */}
        <span className="text-[10px] font-bold text-slate-400 font-mono mr-3">
          {currentIdx + 1} of {totalQuestions}
        </span>

        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="p-1.5 rounded-lg border border-slate-150 hover:bg-slate-50 text-slate-650 disabled:opacity-30 disabled:hover:bg-transparent transition"
          title="Previous question (Arrow Up)"
        >
          <ChevronUp className="h-4 w-4" />
        </button>

        <button
          onClick={handleNext}
          disabled={totalQuestions === 0}
          className="p-1.5 rounded-lg border border-slate-150 hover:bg-slate-50 text-slate-650 disabled:opacity-30 disabled:hover:bg-transparent transition"
          title={isLastQuestion ? 'Submit answers' : 'Next question (Arrow Down)'}
        >
          <ChevronDown className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
};
export default RespondentFormFlow;
