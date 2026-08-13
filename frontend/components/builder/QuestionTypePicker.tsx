'use client';

import React from 'react';
import Modal from '@/components/ui/Modal';
import { 
  Type, 
  AlignLeft, 
  ListTodo, 
  ChevronDownSquare, 
  Mail, 
  Binary, 
  ToggleLeft, 
  Star 
} from 'lucide-react';

interface QuestionTypePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: string) => void;
}

export const QuestionTypePicker: React.FC<QuestionTypePickerProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  const types = [
    {
      id: 'short_text',
      title: 'Short text',
      desc: 'For names, URLs, or brief text responses',
      icon: Type,
      color: 'bg-blue-50 text-blue-500'
    },
    {
      id: 'long_text',
      title: 'Long text',
      desc: 'For feedback, paragraphs, or reviews',
      icon: AlignLeft,
      color: 'bg-indigo-50 text-indigo-500'
    },
    {
      id: 'multiple_choice',
      title: 'Multiple choice',
      desc: 'Allow users to select from a list of options',
      icon: ListTodo,
      color: 'bg-emerald-50 text-emerald-500'
    },
    {
      id: 'dropdown',
      title: 'Dropdown',
      desc: 'Clean select list for multiple choices',
      icon: ChevronDownSquare,
      color: 'bg-teal-50 text-teal-500'
    },
    {
      id: 'email',
      title: 'Email',
      desc: 'Validates formatting for contact details',
      icon: Mail,
      color: 'bg-rose-50 text-rose-500'
    },
    {
      id: 'number',
      title: 'Number',
      desc: 'Restricts entry to valid numerical values',
      icon: Binary,
      color: 'bg-amber-50 text-amber-500'
    },
    {
      id: 'yes_no',
      title: 'Yes / No',
      desc: 'A binary choice format with smooth buttons',
      icon: ToggleLeft,
      color: 'bg-cyan-50 text-cyan-500'
    },
    {
      id: 'rating',
      title: 'Rating',
      desc: 'Star rating scale for reviews and feedback',
      icon: Star,
      color: 'bg-violet-50 text-violet-500'
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose a question type">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 max-h-[400px] overflow-y-auto pr-1">
        {types.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              onClick={() => {
                onSelectType(type.id);
                onClose();
              }}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-left transition-all duration-150 group"
            >
              <div className={`h-9 w-9 rounded-lg ${type.color} flex items-center justify-center shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-semibold text-slate-800 text-xs tracking-tight group-hover:text-slate-900">
                  {type.title}
                </h5>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  {type.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
export default QuestionTypePicker;
