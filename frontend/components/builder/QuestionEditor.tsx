'use client';

import React, { useState } from 'react';
import { QuestionItem } from '@/lib/api';
import QuestionSettings from './QuestionSettings';
import QuestionTypePicker from './QuestionTypePicker';
import { 
  Settings2, 
  HelpCircle, 
  Type, 
  AlignLeft, 
  ListTodo, 
  ChevronDownSquare, 
  Mail, 
  Binary, 
  ToggleLeft, 
  Star,
  ChevronDown
} from 'lucide-react';

interface QuestionEditorProps {
  question: QuestionItem | null;
  onChange: (updatedFields: Partial<QuestionItem>) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onChange,
}) => {
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!question) {
    return (
      <div className="flex-1 bg-white flex flex-col items-center justify-center p-8 text-center select-none border-r border-slate-100">
        <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 text-slate-400">
          <Settings2 className="h-5 w-5 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-slate-700">No question selected</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-[200px] leading-relaxed">
          Select a question from the sidebar list to start editing its settings.
        </p>
      </div>
    );
  }

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

  const getTypeLabel = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const Icon = getIcon(question.type);

  return (
    <div className="flex-1 bg-white border-r border-slate-100 flex flex-col h-full overflow-hidden">
      
      {/* Editor top utilities */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 select-none">
        
        {/* Type Selector Dropdown */}
        <button
          onClick={() => setPickerOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition text-xs font-semibold text-slate-700"
        >
          <div className="p-1 rounded bg-slate-100 text-slate-600">
            <Icon className="h-3.5 w-3.5" />
          </div>
          <span>{getTypeLabel(question.type)}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-400 ml-1" />
        </button>

        {/* Required switch */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Required
          </span>
          <button
            onClick={() => onChange({ required: !question.required })}
            className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
              question.required ? 'bg-slate-900' : 'bg-slate-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${
                question.required ? 'transform translate-x-4' : ''
              }`}
            />
          </button>
        </div>

      </div>

      {/* Editor Main Form fields */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">
        
        {/* Question Title input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="q-title" className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            Question Title
          </label>
          <input
            id="q-title"
            type="text"
            value={question.title}
            onChange={(e) => onChange({ title: e.target.value })}
            className="w-full text-base font-bold text-slate-800 placeholder-slate-300 focus:outline-none border-b border-transparent focus:border-slate-200 pb-1"
            placeholder="Type your question here..."
          />
        </div>

        {/* Question Help text input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="q-desc" className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
            Description / Help Text
          </label>
          <input
            id="q-desc"
            type="text"
            value={question.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
            className="w-full text-xs text-slate-600 placeholder-slate-350 focus:outline-none border-b border-transparent focus:border-slate-150 pb-1"
            placeholder="e.g. Please enter your work email..."
          />
        </div>

        <div className="h-[1px] bg-slate-100 my-2" />

        {/* Type settings (Choice list, Star count selector) */}
        <QuestionSettings
          type={question.type}
          settings={question.settings || null}
          onChange={(newSettings) => onChange({ settings: newSettings })}
        />

      </div>

      {/* Modal Picker */}
      <QuestionTypePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelectType={(newType) => onChange({ type: newType })}
      />

    </div>
  );
};
export default QuestionEditor;
