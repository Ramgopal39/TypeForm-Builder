'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getFormDetails, 
  getFormResponses, 
  exportResponsesCSV,
  FormDetailResponse, 
  FormResponseItem, 
  QuestionItem 
} from '@/lib/api';
import ResponseTable from '@/components/analytics/ResponseTable';
import ResponseDetail from '@/components/analytics/ResponseDetail';
import QuestionStatistics from '@/components/analytics/QuestionStatistics';
import Sidebar from '@/components/dashboard/Sidebar';
import { useToast } from '@/components/ui/Toast';
import { 
  Loader2, 
  ArrowLeft, 
  BarChart3, 
  Table2,
  Download
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface ResponsesPageProps {
  params: Promise<{ id: string }>;
}

export default function ResponsesPage({ params }: ResponsesPageProps) {
  const resolvedParams = use(params);
  const formId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const toast = useToast();

  const [form, setForm] = useState<FormDetailResponse | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [responses, setResponses] = useState<FormResponseItem[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'submissions' | 'summary'>('submissions');
  
  const [selectedResponse, setSelectedResponse] = useState<FormResponseItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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
        const [formDetails, responsesData] = await Promise.all([
          getFormDetails(formId),
          getFormResponses(formId),
        ]);
        setForm(formDetails);
        setQuestions(formDetails.questions);
        setResponses(responsesData);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          router.push('/login');
          return;
        }
        toast.error('Failed to load responses data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [formId, router]);

  const handleSelectResponse = (res: FormResponseItem) => {
    setSelectedResponse(res);
    setIsDetailOpen(true);
  };

  const handleExportCSV = async () => {
    if (responses.length === 0 || !form) return;

    try {
      const blob = await exportResponsesCSV(formId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${form.title.replace(/\s+/g, '_')}_Responses.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Responses exported successfully as CSV!');
    } catch {
      toast.error('Failed to export responses.');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen bg-slate-50 select-none">
        <Sidebar currentTab="Results" />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 text-slate-900 animate-spin" />
            <span className="text-sm font-semibold text-slate-600">Loading responses...</span>
          </div>
        </main>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex h-screen w-screen bg-slate-50 select-none">
        <Sidebar currentTab="Results" />
        <main className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-xl font-bold text-slate-800">Form not found</h2>
            <p className="text-xs text-slate-400 mt-2">The requested responses directory is unavailable.</p>
          </div>
        </main>
      </div>
    );
  }

  const responseCount = responses.length;

  return (
    <div className="flex h-screen w-screen bg-slate-50/50 font-sans overflow-hidden">
      
      {/* Sidebar navigation */}
      <Sidebar currentTab="Results" />

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-8 shrink-0 select-none">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
              title="Back to Dashboard"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="h-4 w-[1px] bg-slate-200" />
            <div className="flex flex-col gap-0.5">
              <h1 className="text-sm font-bold text-slate-800 leading-none truncate max-w-xs sm:max-w-md">
                {form.title}
              </h1>
              <span className="text-[10px] text-slate-400 font-bold">
                {responseCount} response{responseCount !== 1 ? 's' : ''} total
              </span>
            </div>
          </div>

          {/* CSV Export Button */}
          {responseCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={handleExportCSV}
            >
              Export CSV
            </Button>
          )}
        </header>

        {/* Inner Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-6">
          
          {/* Tab Selection Switcher */}
          <div className="flex border-b border-slate-100 gap-6 select-none shrink-0">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'submissions'
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
            >
              <Table2 className="h-3.5 w-3.5" />
              Submissions
            </button>
            <button
              onClick={() => setActiveTab('summary')}
              className={`pb-3 text-xs font-bold flex items-center gap-2 border-b-2 transition ${
                activeTab === 'summary'
                  ? 'border-slate-800 text-slate-800'
                  : 'border-transparent text-slate-450 hover:text-slate-700'
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Summary & Stats
            </button>
          </div>

          {/* Active Tab Screen */}
          <div className="flex-1">
            {activeTab === 'submissions' ? (
              <ResponseTable
                questions={questions}
                responses={responses}
                onSelectResponse={handleSelectResponse}
              />
            ) : (
              <div className="max-w-2xl">
                <QuestionStatistics
                  questions={questions}
                  responses={responses}
                />
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Selected Submission Drawer Modal */}
      <ResponseDetail
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        response={selectedResponse}
        questions={questions}
      />

    </div>
  );
}
