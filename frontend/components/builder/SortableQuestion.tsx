'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  GripVertical, 
  Trash2, 
  Copy, 
  Type, 
  AlignLeft, 
  ListTodo, 
  ChevronDownSquare, 
  Mail, 
  Binary, 
  ToggleLeft, 
  Star 
} from 'lucide-react';
import { QuestionItem } from '@/lib/api';

interface SortableQuestionProps {
  question: QuestionItem;
  index: number;
  isActive: boolean;
  onClick: () => void;
  onDuplicate: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const SortableQuestion: React.FC<SortableQuestionProps> = ({
  question,
  index,
  isActive,
  onClick,
  onDuplicate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'short_text': return Type;
      case 'long_text': return AlignLeft;
      case 'multiple_choice': return ListTodo;
      case 'dropdown': return ChevronDownSquare;
      case 'email': return Mail;
      case 'number': return Binary;
      case 'yes_no': return ToggleLeft;
      case 'rating': return Star;
      default: return Type;
    }
  };

  const Icon = getIcon(question.type);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`group flex items-center gap-2.5 p-3 rounded-xl border transition-all cursor-pointer select-none bg-white ${
        isActive
          ? 'border-slate-800 shadow-[0_4px_12px_rgba(0,0,0,0.03)] bg-slate-50/10'
          : 'border-slate-100 hover:border-slate-200 hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)]'
      }`}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        onClick={(e) => e.stopPropagation()}
        className="p-1 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing hover:bg-slate-50 rounded transition shrink-0"
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>

      {/* Index Number */}
      <span className="text-xs font-semibold text-slate-400 font-mono w-4 text-center shrink-0">
        {index}
      </span>

      {/* Question Type Icon */}
      <div className={`p-1.5 rounded-lg shrink-0 ${
        isActive ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100'
      } transition-colors`}>
        <Icon className="h-3.5 w-3.5" />
      </div>

      {/* Question Title */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-700 truncate">
          {question.title || <span className="text-slate-300 italic">Untitled question</span>}
        </span>
        {question.required && (
          <span className="text-rose-500 text-[10px] font-bold" title="Required">*</span>
        )}
      </div>

      {/* Quick Action Controls */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
        <button
          onClick={onDuplicate}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded transition"
          title="Duplicate question"
        >
          <Copy className="h-3 w-3" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded transition"
          title="Delete question"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>

    </div>
  );
};
export default SortableQuestion;
