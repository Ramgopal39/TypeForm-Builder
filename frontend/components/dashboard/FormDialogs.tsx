'use client';

import React, { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

interface CreateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => Promise<void>;
  isLoading?: boolean;
}

export const CreateFormDialog: React.FC<CreateFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Reset fields when opened/closed
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Form title is required');
      return;
    }
    setError('');
    try {
      await onSubmit(title.trim(), description.trim());
      onClose();
    } catch (e) {
      setError('Failed to create form. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a new form">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="form-title" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Title
          </label>
          <input
            id="form-title"
            type="text"
            placeholder="e.g. Customer Satisfaction Survey"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl transition duration-150 text-slate-800"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="form-desc" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Description (Optional)
          </label>
          <textarea
            id="form-desc"
            placeholder="Provide context for respondents..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            rows={3}
            className="px-3.5 py-2 text-sm border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl transition duration-150 resize-none text-slate-800"
          />
        </div>

        {error && (
          <span className="text-xs font-medium text-rose-500">{error}</span>
        )}

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            Create form
          </Button>
        </div>
      </form>
    </Modal>
  );
};


interface RenameFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentTitle: string;
  onSubmit: (title: string) => Promise<void>;
  isLoading?: boolean;
}

export const RenameFormDialog: React.FC<RenameFormDialogProps> = ({
  isOpen,
  onClose,
  currentTitle,
  onSubmit,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
      setError('');
    }
  }, [isOpen, currentTitle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Form title is required');
      return;
    }
    setError('');
    try {
      await onSubmit(title.trim());
      onClose();
    } catch (e) {
      setError('Failed to rename form. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename form">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="rename-title" className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            New Title
          </label>
          <input
            id="rename-title"
            type="text"
            placeholder="e.g. Customer Satisfaction Survey"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            className="px-3.5 py-2 text-sm border border-slate-200 focus:border-slate-400 focus:outline-none rounded-xl transition duration-150 text-slate-800"
          />
        </div>

        {error && (
          <span className="text-xs font-medium text-rose-500">{error}</span>
        )}

        <div className="flex items-center justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
