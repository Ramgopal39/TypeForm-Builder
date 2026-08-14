'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getFormDetails, 
  getFormQuestions,
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  reorderQuestions,
  publishForm,
  unpublishForm,
  FormDetailResponse,
  QuestionItem
} from '@/lib/api';
import BuilderHeader from '@/components/builder/BuilderHeader';
import QuestionList from '@/components/builder/QuestionList';
import QuestionEditor from '@/components/builder/QuestionEditor';
import LivePreview from '@/components/builder/LivePreview';
import QuestionTypePicker from '@/components/builder/QuestionTypePicker';
import { useToast } from '@/components/ui/Toast';
import { Loader2 } from 'lucide-react';
import RespondentFormFlow from '@/components/respondent/RespondentFormFlow';

interface BuilderPageProps {
  params: Promise<{ id: string }>;
}

export default function BuilderPage({ params }: BuilderPageProps) {
  const resolvedParams = use(params);
  const formId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<FormDetailResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load form details and its questions on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }
    }

    const loadData = async () => {
      try {
        const formDetails = await getFormDetails(formId);
        setForm(formDetails);
        
        // Sort questions by position ascending
        const sortedQuestions = [...formDetails.questions].sort((a, b) => a.position - b.position);
        setQuestions(sortedQuestions);
        
        // Select first question by default if available
        if (sortedQuestions.length > 0) {
          setActiveQuestionId(sortedQuestions[0].id);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }
        toast.error('Failed to load form details from API.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [formId, router]);

  const activeQuestion = questions.find((q) => q.id === activeQuestionId) || null;

  // Handles updating the question state locally and queues debounced backend update
  const handleQuestionChange = (updatedFields: Partial<QuestionItem>) => {
    if (!activeQuestionId) return;

    // 1. Update local state immediately for a responsive, optimistic UI
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === activeQuestionId) {
          return { ...q, ...updatedFields };
        }
        return q;
      })
    );

    // 2. Queue autosave to backend
    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await updateQuestion(activeQuestionId, updatedFields);
      } catch (e) {
        toast.error('Autosave failed. Check backend connection.');
      } finally {
        setIsSaving(false);
      }
    }, 500); // 500ms debounce
  };

  // Add a new question to the list
  const handleAddQuestion = async (type: string) => {
    try {
      setLoading(true);
      const position = questions.length + 1;
      
      // Default settings based on type
      let settings: Record<string, any> = {};
      if (type === 'multiple_choice' || type === 'dropdown') {
        settings = { options: ['Option 1', 'Option 2'] };
      } else if (type === 'rating') {
        settings = { max_stars: 5 };
      }

      const newQ = await createQuestion(formId, {
        type,
        title: `Question ${position}`,
        required: false,
        position,
        settings,
      });

      setQuestions((prev) => [...prev, newQ]);
      setActiveQuestionId(newQ.id);
      toast.success('Question added successfully.');
    } catch (e) {
      toast.error('Failed to add question.');
    } finally {
      setLoading(false);
    }
  };

  // Duplicate an existing question
  const handleDuplicateQuestion = async (id: number) => {
    try {
      setLoading(true);
      const target = questions.find((q) => q.id === id);
      if (!target) return;

      const dupTitle = `${target.title} (Copy)`;
      const dupPosition = target.position + 1;

      // Duplicate question through backend
      const newQ = await createQuestion(formId, {
        type: target.type,
        title: dupTitle,
        required: target.required,
        settings: target.settings || {},
        position: dupPosition,
      });

      // Reload list to ensure positions are updated cleanly
      const refreshed = await getFormQuestions(formId);
      const sorted = [...refreshed].sort((a, b) => a.position - b.position);
      setQuestions(sorted);
      setActiveQuestionId(newQ.id);
      toast.success('Question duplicated.');
    } catch (e) {
      toast.error('Failed to duplicate question.');
    } finally {
      setLoading(false);
    }
  };

  // Delete an existing question
  const handleDeleteQuestion = async (id: number) => {
    try {
      setLoading(true);
      await deleteQuestion(id);

      const remaining = questions.filter((q) => q.id !== id);
      
      // Shift positions of remaining questions
      const updated = remaining.map((q, idx) => ({
        ...q,
        position: idx + 1,
      }));

      setQuestions(updated);
      
      // Select another question as active
      if (updated.length > 0) {
        // If deleted question was active, select the first in list
        if (activeQuestionId === id) {
          setActiveQuestionId(updated[0].id);
        }
      } else {
        setActiveQuestionId(null);
      }

      toast.success('Question deleted.');
    } catch (e) {
      toast.error('Failed to delete question.');
    } finally {
      setLoading(false);
    }
  };

  // Drag and drop reordering handler
  const handleReorderQuestions = async (orderedList: QuestionItem[]) => {
    // 1. Optimistic UI update
    setQuestions(orderedList);
    setIsSaving(true);
    
    try {
      const payload = orderedList.map((q) => ({
        id: q.id,
        position: q.position,
      }));
      await reorderQuestions(formId, payload);
    } catch (e) {
      toast.error('Failed to save question order.');
      // Revert from backend database if failure occurs
      const refreshed = await getFormQuestions(formId);
      setQuestions([...refreshed].sort((a, b) => a.position - b.position));
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle publish state
  const handlePublishToggle = async () => {
    if (!form) return;
    try {
      setLoading(true);
      if (form.status === 'published') {
        await unpublishForm(form.id);
        setForm((prev) => prev ? { ...prev, status: 'draft' } : null);
        toast.success('Form unpublished successfully.');
      } else {
        await publishForm(form.id);
        setForm((prev) => prev ? { ...prev, status: 'published' } : null);
        toast.success('Form published successfully! It is now live.');
      }
    } catch (e) {
      toast.error('Failed to toggle publish status.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !form) {
    return (
      <div className="h-screen w-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 text-slate-900 animate-spin" />
          <span className="text-sm font-semibold text-slate-600">Loading form builder...</span>
        </div>
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="h-screen flex flex-col bg-slate-50 overflow-hidden font-sans">
      
      {/* Top Header Controls */}
      <BuilderHeader
        formId={form.id}
        title={form.title}
        isSaving={isSaving}
        status={form.status}
        onPublishToggle={handlePublishToggle}
        onPreview={() => setPreviewOpen(true)}
      />

      {/* Split Builder Panels */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left: Reorderable list */}
        <QuestionList
          questions={questions}
          activeId={activeQuestionId}
          onSelectQuestion={setActiveQuestionId}
          onAddQuestion={() => setPickerOpen(true)}
          onDuplicateQuestion={handleDuplicateQuestion}
          onDeleteQuestion={handleDeleteQuestion}
          onReorderQuestions={handleReorderQuestions}
        />

        {/* Center: Editor workspace */}
        <QuestionEditor
          question={activeQuestion}
          onChange={handleQuestionChange}
        />

        {/* Right: Conversational live mockup preview */}
        <LivePreview question={activeQuestion} />

      </div>

      {/* Choice Selector Modal */}
      <QuestionTypePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectType={handleAddQuestion}
      />

      {/* Interactive Live Preview overlay */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade-in">
          <RespondentFormFlow
            questions={questions}
            formTitle={form.title}
            onSubmit={async () => {
              // Local preview only: resolve immediately without API write
              return;
            }}
            isSubmitLoading={false}
            onClose={() => setPreviewOpen(false)}
          />
        </div>
      )}

    </div>
  );
}
