'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MoreHorizontal, 
  Edit3, 
  Copy, 
  Trash2, 
  Globe, 
  EyeOff, 
  FileEdit, 
  BarChart3,
  Calendar
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export interface FormItem {
  id: number;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  response_count: number;
}

interface FormCardProps {
  form: FormItem;
  onRename: (form: FormItem) => void;
  onDuplicate: (form: FormItem) => void;
  onDelete: (form: FormItem) => void;
  onTogglePublish: (form: FormItem) => void;
  onNavigateToBuilder: (id: number) => void;
  onNavigateToResponses: (id: number) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  onRename,
  onDuplicate,
  onDelete,
  onTogglePublish,
  onNavigateToBuilder,
  onNavigateToResponses,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-100 hover:border-slate-200/80 hover:shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all p-5 flex flex-col justify-between min-h-[170px] relative">
      
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 
              onClick={() => onNavigateToBuilder(form.id)}
              className="text-base font-semibold text-slate-800 hover:text-slate-900 leading-tight truncate cursor-pointer pr-4"
            >
              {form.title}
            </h4>
            {form.description ? (
              <p className="text-xs text-slate-400 mt-1 truncate max-w-[90%]">
                {form.description}
              </p>
            ) : (
              <p className="text-xs text-slate-300 mt-1 italic">No description</p>
            )}
          </div>

          {/* Settings Menu Button */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onRename(form);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Rename
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(form);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onTogglePublish(form);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  {form.status === 'published' ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Globe className="h-3.5 w-3.5" />
                      Publish
                    </>
                  )}
                </button>
                <div className="h-[1px] bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(form);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 mt-4">
          <Badge variant={form.status === 'published' ? 'success' : 'neutral'}>
            {form.status === 'published' ? 'Published' : 'Draft'}
          </Badge>
          <span className="text-xs text-slate-400 font-medium">
            {form.response_count} {form.response_count === 1 ? 'response' : 'responses'}
          </span>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-4">
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
          <Calendar className="h-3 w-3 shrink-0" />
          <span>{formatDate(form.updated_at)}</span>
        </span>
        
        <div className="flex gap-2">
          <button
            onClick={() => onNavigateToResponses(form.id)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
            title="View Responses"
          >
            <BarChart3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onNavigateToBuilder(form.id)}
            className="p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition flex items-center gap-1 text-xs font-semibold"
            title="Edit Form"
          >
            <FileEdit className="h-3.5 w-3.5" />
            <span>Edit</span>
          </button>
        </div>
      </div>

    </div>
  );
};
export default FormCard;
