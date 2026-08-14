'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/Toast';
import { 
  FileText, 
  Settings, 
  LayoutTemplate, 
  BarChart3, 
  ChevronDown, 
  FolderClosed,
  HelpCircle,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab = 'forms' }) => {
  const router = useRouter();
  const toast = useToast();

  const menuItems = [
    { id: 'forms', label: 'My Workspace', icon: FolderClosed },
    { id: 'templates', label: 'Templates', icon: LayoutTemplate },
    { id: 'responses', label: 'Results', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-100 bg-white flex flex-col h-full shrink-0">
      {/* Workspace Selector / Brand */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 transition">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-xs font-bold text-white leading-none">
            T
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-slate-800 tracking-tight leading-snug">My Workspace</span>
            <span className="text-[10px] text-slate-400 font-medium leading-none">Free Plan</span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-slate-400" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-6 flex flex-col gap-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = 
            item.id.toLowerCase() === currentTab.toLowerCase() ||
            item.label.toLowerCase() === currentTab.toLowerCase();
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'forms') {
                  router.push('/');
                } else if (item.id === 'templates') {
                  toast.info('Templates library is coming soon! Start by creating a blank form.');
                } else if (item.id === 'responses') {
                  toast.info('Select a form from your workspace and click "View Responses" to analyze analytics.');
                } else if (item.id === 'settings') {
                  toast.info('Workspace settings are coming soon.');
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive 
                  ? 'bg-slate-100 text-slate-900' 
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/60'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-slate-900' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Profile Info */}
      <div className="p-4 border-t border-slate-100 flex flex-col gap-4">
        <div className="flex items-center justify-between text-slate-400">
          <button className="flex items-center gap-2 hover:text-slate-600 transition text-xs font-medium">
            <HelpCircle className="h-4 w-4" />
            <span>Help & Support</span>
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 font-mono">
            JD
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold text-slate-800 leading-none truncate">John Doe</span>
            <span className="text-[10px] text-slate-400 font-medium truncate mt-0.5">john@example.com</span>
          </div>
          <button className="ml-auto text-slate-400 hover:text-slate-600 transition p-1 hover:bg-slate-50 rounded-lg">
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;
