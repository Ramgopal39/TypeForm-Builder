'use client';

import React from 'react';
import { QuestionItem } from '@/lib/api';
import TextQuestion from './TextQuestion';
import LongTextQuestion from './LongTextQuestion';
import EmailQuestion from './EmailQuestion';
import NumberQuestion from './NumberQuestion';
import YesNoQuestion from './YesNoQuestion';
import RatingQuestion from './RatingQuestion';
import ChoiceQuestion from './ChoiceQuestion';
import DropdownQuestion from './DropdownQuestion';

interface QuestionRendererProps {
  question: QuestionItem;
  value: string;
  onChange: (val: string) => void;
  onAdvance: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  onAdvance,
  onKeyDown,
}) => {
  const { type, settings } = question;

  switch (type) {
    case 'short_text':
      return (
        <TextQuestion
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );
    
    case 'long_text':
      return (
        <LongTextQuestion
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );

    case 'email':
      return (
        <EmailQuestion
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );

    case 'number':
      return (
        <NumberQuestion
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      );

    case 'yes_no':
      return (
        <YesNoQuestion
          value={value}
          onChange={onChange}
          onAdvance={onAdvance}
        />
      );

    case 'rating':
      return (
        <RatingQuestion
          value={value}
          onChange={onChange}
          onAdvance={onAdvance}
          settings={settings}
        />
      );

    case 'multiple_choice':
      return (
        <ChoiceQuestion
          value={value}
          onChange={onChange}
          onAdvance={onAdvance}
          settings={settings}
        />
      );

    case 'dropdown':
      return (
        <DropdownQuestion
          value={value}
          onChange={onChange}
          onAdvance={onAdvance}
          settings={settings}
        />
      );

    default:
      return (
        <div className="text-rose-500 font-bold text-sm">
          Unknown question type: {type}
        </div>
      );
  }
};
export default QuestionRenderer;
