'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  FolderPlus, 
  FileText,
  HelpCircle,
  TrendingUp,
  Award,
  Filter
} from 'lucide-react';
import { 
  getForms, 
  createForm, 
  updateForm, 
  deleteForm, 
  duplicateForm, 
  publishForm, 
  unpublishForm 
} from '@/lib/api';
import Sidebar from '@/components/dashboard/Sidebar';
import FormCard, { FormItem } from '@/components/dashboard/FormCard';
import { CreateFormDialog, RenameFormDialog } from '@/components/dashboard/FormDialogs';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const router = useRouter();
  const [forms, setForms] = useState<FormItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Action States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<FormItem | null>(null);
  
  // Async status indicators
  const [modalLoading, setModalLoading] = useState(false);

  const toast = useToast();

  const fetchFormsData = async () => {
    try {
      const data = await getForms();
      // Sort forms by updated_at descending by default
      data.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
      setForms(data);
    } catch (err) {
      toast.error('Failed to load forms from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormsData();
  }, []);

  const handleCreateForm = async (title: string, description: string) => {
    setModalLoading(true);
    try {
      const newForm = await createForm(title, description);
      toast.success(`Form "${newForm.title}" created successfully!`);
      await fetchFormsData();
    } catch (err) {
      toast.error('Could not create form.');
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handleRenameForm = async (newTitle: string) => {
    if (!selectedForm) return;
    setModalLoading(true);
    try {
      await updateForm(selectedForm.id, { title: newTitle });
      toast.success(`Form renamed to "${newTitle}"`);
      await fetchFormsData();
    } catch (err) {
      toast.error('Failed to rename form.');
      throw err;
    } finally {
      setModalLoading(false);
    }
  };

  const handleDuplicateForm = async (form: FormItem) => {
    try {
      toast.info(`Duplicating "${form.title}"...`);
      const duplicated = await duplicateForm(form.id);
      toast.success(`Successfully duplicated as "${duplicated.title}"`);
      await fetchFormsData();
    } catch (err) {
      toast.error('Failed to duplicate form.');
    }
  };

  const handleDeleteForm = async () => {
    if (!selectedForm) return;
    setModalLoading(true);
    try {
      await deleteForm(selectedForm.id);
      toast.success(`Form "${selectedForm.title}" deleted.`);
      setIsDeleteOpen(false);
      setSelectedForm(null);
      await fetchFormsData();
    } catch (err) {
      toast.error('Failed to delete form.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleTogglePublish = async (form: FormItem) => {
    try {
      if (form.status === 'published') {
        await unpublishForm(form.id);
        toast.success(`"${form.title}" is now unpublished.`);
      } else {
        await publishForm(form.id);
        toast.success(`"${form.title}" is now published!`);
      }
      await fetchFormsData();
    } catch (err) {
      toast.error('Failed to update form publication status.');
    }
  };

  const handleNavigateToBuilder = (id: number) => {
    router.push(`/forms/${id}/builder`);
  };

  const handleNavigateToResponses = (id: number) => {
    toast.info(`Responses Dashboard (Step 5) for Form #${id} is coming soon!`);
  };

  // Filter forms based on search query
  const filteredForms = forms.filter(form => 
    form.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (form.description && form.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Sidebar navigation */}
      <Sidebar currentTab="forms" />

      {/* Main Workspace Panel */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        
        {/* Workspace Top Header */}
        <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-150 focus:border-slate-300 focus:outline-none rounded-xl text-sm transition text-slate-800 bg-slate-50/50 hover:bg-slate-50/80"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setIsCreateOpen(true)}
            >
              Create form
            </Button>
          </div>
        </header>

        {/* Dashboard Content Body */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          
          {/* Welcome Banner */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Forms</h2>
              <p className="text-slate-400 text-sm mt-1">Manage and publish your conversational surveys.</p>
            </div>
            
            {/* Quick Metrics */}
            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Total Forms</span>
                  <span className="text-sm font-semibold text-slate-800 mt-1 leading-none">{forms.length}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-xl px-4 py-2 flex items-center gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Award className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">Responses</span>
                  <span className="text-sm font-semibold text-slate-800 mt-1 leading-none">
                    {forms.reduce((acc, curr) => acc + curr.response_count, 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Skeletons Loader State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i} 
                  className="bg-white rounded-xl border border-slate-100 p-5 min-h-[170px] flex flex-col justify-between animate-pulse"
                >
                  <div>
                    <div className="h-4 bg-slate-100 rounded-md w-2/3" />
                    <div className="h-3 bg-slate-50 rounded-md w-1/2 mt-2" />
                    <div className="h-5 bg-slate-100 rounded-full w-20 mt-4" />
                  </div>
                  <div className="border-t border-slate-50 pt-3 mt-4 flex justify-between items-center">
                    <div className="h-2.5 bg-slate-50 rounded-md w-1/4" />
                    <div className="h-6 bg-slate-100 rounded-md w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredForms.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl bg-white p-12 text-center max-w-lg mx-auto mt-12"
            >
              <div className="h-16 w-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                <FolderPlus className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Create your first form</h3>
              <p className="text-slate-400 text-sm mt-2 max-w-sm leading-relaxed">
                {searchQuery 
                  ? "We couldn't find any forms matching your search criteria. Try a different query." 
                  : "Gather feedback, collect job applications, or launch surveys with our slide-by-slide responder."}
              </p>
              
              {!searchQuery && (
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="mt-6"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create form
                </Button>
              )}
            </motion.div>
          ) : (
            /* Forms Grid view */
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredForms.map((form) => (
                  <motion.div
                    key={form.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <FormCard
                      form={form}
                      onRename={(f) => {
                        setSelectedForm(f);
                        setIsRenameOpen(true);
                      }}
                      onDuplicate={handleDuplicateForm}
                      onDelete={(f) => {
                        setSelectedForm(f);
                        setIsDeleteOpen(true);
                      }}
                      onTogglePublish={handleTogglePublish}
                      onNavigateToBuilder={handleNavigateToBuilder}
                      onNavigateToResponses={handleNavigateToResponses}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

        </div>

      </main>

      {/* --- Action Dialog Modals --- */}
      
      {/* Create Dialog */}
      <CreateFormDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateForm}
        isLoading={modalLoading}
      />

      {/* Rename Dialog */}
      <RenameFormDialog
        isOpen={isRenameOpen}
        onClose={() => {
          setIsRenameOpen(false);
          setSelectedForm(null);
        }}
        currentTitle={selectedForm?.title || ''}
        onSubmit={handleRenameForm}
        isLoading={modalLoading}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedForm(null);
        }}
        onConfirm={handleDeleteForm}
        title="Delete this form?"
        description={`This action cannot be undone. All responses associated with "${selectedForm?.title || 'this form'}" will be permanently removed.`}
        confirmText="Delete form"
        isDanger={true}
        isLoading={modalLoading}
      />

    </div>
  );
}
