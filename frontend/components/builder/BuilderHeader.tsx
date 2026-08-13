'use client';

import React from 'react';
import { 
  ArrowLeft, 
  Eye, 
  CloudLightning,
  CheckCircle,
  Loader2,
  Globe,
  EyeOff
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useRouter } from 'next/navigation';

interface BuilderHeaderProps {
  formId: number;
  title: string;
  isSaving: boolean;
  status: 'draft' | 'published';
  onPublishToggle: () => void;
}

export const BuilderHeader: React.FC<BuilderHeaderProps> = ({
  formId,
  title,
  isSaving,
  status,
  onPublishToggle,
}) => {
  const router = useRouter();
  const isPublished = status === 'published';

  const handlePreview = () => {
    // Open the respondent view in a new tab
    window.open(`/forms/${formId}`, '_blank');
  };

  return (
    <header className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-6 z-30 shrink-0 select-none">
      
      {/* Left side: Back to Workspace + Title + Autosave */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/')}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800 text-sm tracking-tight truncate max-w-[200px] sm:max-w-xs">
            {title}
          </span>
          
          {/* Status badge */}
          <Badge variant={isPublished ? 'success' : 'neutral'}>
            {isPublished ? 'Published' : 'Draft'}
          </Badge>

          {/* Autosave status indicator */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 ml-2">
            {isSaving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span>Saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right side: Preview + Publish controls */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          leftIcon={<Eye className="h-3.5 w-3.5" />}
          onClick={handlePreview}
        >
          Preview
        </Button>
        
        <Button
          variant={isPublished ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
          onClick={onPublishToggle}
        >
          {isPublished ? 'Unpublish' : 'Publish'}
        </Button>
      </div>

    </header>
  );
};
export default BuilderHeader;
