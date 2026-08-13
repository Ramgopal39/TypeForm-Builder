'use client';

import React from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { QuestionItem } from '@/lib/api';
import SortableQuestion from './SortableQuestion';

interface QuestionListProps {
  questions: QuestionItem[];
  activeId: number | null;
  onSelectQuestion: (id: number) => void;
  onAddQuestion: () => void;
  onDuplicateQuestion: (id: number) => void;
  onDeleteQuestion: (id: number) => void;
  onReorderQuestions: (orderedQuestions: QuestionItem[]) => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  activeId,
  onSelectQuestion,
  onAddQuestion,
  onDuplicateQuestion,
  onDeleteQuestion,
  onReorderQuestions,
}) => {
  // Setup pointer sensors to allow dragging with custom activation constraint (delay/distance)
  // This ensures click triggers selection correctly without starting immediate drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // drag must move at least 5px to start
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const reordered = [...questions];
    const [removed] = reordered.splice(oldIndex, 1);
    reordered.splice(newIndex, 0, removed);

    // Re-index positions sequentially
    const updated = reordered.map((q, idx) => ({
      ...q,
      position: idx + 1,
    }));

    onReorderQuestions(updated);
  };

  return (
    <div className="w-[300px] border-r border-slate-100 bg-white flex flex-col h-full shrink-0 select-none">
      {/* Title / Question Count header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Content
        </h3>
        <span className="text-[10px] bg-slate-50 text-slate-500 font-semibold px-2 py-0.5 rounded-full border border-slate-100">
          {questions.length} {questions.length === 1 ? 'question' : 'questions'}
        </span>
      </div>

      {/* Questions list container */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((question, idx) => (
              <SortableQuestion
                key={question.id}
                question={question}
                index={idx + 1}
                isActive={activeId === question.id}
                onClick={() => onSelectQuestion(question.id)}
                onDuplicate={(e) => {
                  e.stopPropagation();
                  onDuplicateQuestion(question.id);
                }}
                onDelete={(e) => {
                  e.stopPropagation();
                  onDeleteQuestion(question.id);
                }}
              />
            ))}
          </SortableContext>
        </DndContext>

        {/* Empty list indicator */}
        {questions.length === 0 && (
          <div className="flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl py-8 px-4 text-center mt-2 bg-slate-50/20">
            <span className="text-[11px] text-slate-400 font-medium leading-relaxed">
              No questions added yet.
            </span>
          </div>
        )}

        {/* Add Question Button */}
        <button
          onClick={onAddQuestion}
          className="mt-2 w-full py-2.5 px-4 rounded-xl border border-dashed border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1.5 transition text-xs font-semibold"
        >
          <Plus className="h-4 w-4" />
          <span>Add new question</span>
        </button>
      </div>

    </div>
  );
};
export default QuestionList;
