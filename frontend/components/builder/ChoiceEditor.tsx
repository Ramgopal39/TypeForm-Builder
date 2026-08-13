'use client';

import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, List } from 'lucide-react';

interface ChoiceEditorProps {
  options: string[];
  onChange: (options: string[]) => void;
}

export const ChoiceEditor: React.FC<ChoiceEditorProps> = ({
  options = [],
  onChange,
}) => {
  
  const handleOptionChange = (idx: number, newVal: string) => {
    const updated = [...options];
    updated[idx] = newVal;
    onChange(updated);
  };

  const handleAddOption = () => {
    const nextNum = options.length + 1;
    onChange([...options, `Option ${nextNum}`]);
  };

  const handleDeleteOption = (idx: number) => {
    // Keep at least one option to maintain schema integrity
    if (options.length <= 1) return;
    const updated = options.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const moveOption = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === options.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const updated = [...options];
    
    // Swap options
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
        <List className="h-3.5 w-3.5" />
        <span>Choices</span>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2">
            
            {/* Index label */}
            <span className="text-[10px] font-bold text-slate-400 font-mono w-5 text-right shrink-0">
              {String.fromCharCode(65 + idx)}.
            </span>

            {/* Input field */}
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-slate-200 focus:border-slate-400 focus:outline-none rounded-lg transition text-slate-700 bg-white"
              placeholder={`Option ${idx + 1}`}
            />

            {/* Reorder actions */}
            <div className="flex shrink-0">
              <button
                type="button"
                onClick={() => moveOption(idx, 'up')}
                disabled={idx === 0}
                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20 disabled:hover:text-slate-400 hover:bg-slate-50 rounded"
                title="Move up"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => moveOption(idx, 'down')}
                disabled={idx === options.length - 1}
                className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-20 disabled:hover:text-slate-400 hover:bg-slate-50 rounded"
                title="Move down"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </div>

            {/* Delete action */}
            <button
              type="button"
              onClick={() => handleDeleteOption(idx)}
              disabled={options.length <= 1}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50/50 rounded transition disabled:opacity-20 disabled:hover:text-slate-400 shrink-0"
              title="Delete option"
            >
              <Trash2 className="h-3 w-3" />
            </button>

          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddOption}
        className="mt-1 self-start flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-200 hover:border-slate-350 text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Option</span>
      </button>

    </div>
  );
};
export default ChoiceEditor;
