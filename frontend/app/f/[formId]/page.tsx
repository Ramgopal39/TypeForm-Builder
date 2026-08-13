'use client';

import React, { useState, useEffect, use } from 'react';
import { 
  getFormDetails, 
  submitFormResponse, 
  FormDetailResponse, 
  QuestionItem 
} from '@/lib/api';
import RespondentFormFlow from '@/components/respondent/RespondentFormFlow';
import { useToast } from '@/components/ui/Toast';
import { Loader2, Lock } from 'lucide-react';

interface RespondentPageProps {
  params: Promise<{ formId: string }>;
}

export default function RespondentPage({ params }: RespondentPageProps) {
  const resolvedParams = use(params);
  const formId = parseInt(resolvedParams.formId, 10);
  const toast = useToast();

  const [form, setForm] = useState<FormDetailResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load Form details on mount
  useEffect(() => {
    const loadForm = async () => {
      try {
        const formDetails = await getFormDetails(formId);
        setForm(formDetails);
        const sorted = [...formDetails.questions].sort((a, b) => a.position - b.position);
        setQuestions(sorted);
      } catch (err) {
        toast.error('Failed to load this form.');
      } finally {
        setLoading(false);
      }
    };
    loadForm();
  }, [formId]);

  // Submit all answers to backend API
  const handleSubmit = async (answersData: Record<number, string>) => {
    setSubmitting(true);
    try {
      const answersPayload = questions.map((q) => ({
        question_id: q.id,
        value: answersData[q.id] || '',
      }));
      await submitFormResponse(formId, answersPayload);
    } catch (e) {
      toast.error('Failed to submit response. Please try again.');
      throw e; // Propagate to let RespondentFormFlow know submission failed
    } finally {
      setSubmitting(false);
    }
  };

  // Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center select-none">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-slate-900 animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Loading form...</span>
        </div>
      </div>
    );
  }

  // Not Found Screen
  if (!form) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center p-6 text-center select-none animate-fade-in">
        <div className="max-w-md">
          <h2 className="text-xl font-bold text-slate-800 animate-slide-up">Form not found</h2>
          <p className="text-xs text-slate-400 mt-2">The form link you opened is invalid or does not exist.</p>
        </div>
      </div>
    );
  }

  // Inactive Draft Mode Screen
  if (form.status !== 'published') {
    return (
      <div className="h-screen w-screen bg-white flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
        <div className="flex flex-col items-center max-w-sm">
          <div className="h-12 w-12 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl flex items-center justify-center mb-4 animate-scale-in">
            <Lock className="h-5 w-5 animate-pulse" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">This form is currently closed</h1>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The creator hasn't published this form yet or has set it back to draft mode. Please contact the form owner for access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <RespondentFormFlow
      questions={questions}
      formTitle={form.title}
      onSubmit={handleSubmit}
      isSubmitLoading={submitting}
    />
  );
}
