import React from 'react';
import { SectionId } from '../types';
import { 
  LayoutGrid, Bot, FileText, CheckCircle, Crown, Calendar, 
  Folder, Brain, Users, Building, Users2, Server, Radar, 
  Factory, GitMerge, MessageSquare, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeSection: SectionId;
  onSelectSection: (section: SectionId) => void;
}

export function Sidebar({ activeSection, onSelectSection }: SidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'tasks', label: 'Tasks Board', icon: CheckCircle },
    { id: 'content-pipeline', label: 'Content Pipeline', icon: GitMerge },
    { id: 'ai-team', label: 'AI Team', icon: Bot },
    { id: 'council', label: 'Council', icon: Crown },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="w-56 bg-bg-base border-r border-border-base h-full flex flex-col shrink-0">
      <div className="flex-1 py-4 px-2 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-150 border",
                isActive 
                  ? "bg-bg-panel text-text-base font-medium border-border-base shadow-elevation-card-rest" 
                  : "text-text-muted border-transparent hover:text-text-base hover:bg-bg-panel/50"
              )}
            >
              <Icon size={16} className={cn(isActive ? "text-text-base" : "text-text-muted")} />
              {item.label}
            </button>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-border-base flex items-center justify-center">
        <div className="w-8 h-8 rounded-full bg-bg-panel border border-border-base flex items-center justify-center text-text-muted font-bold">
          N
        </div>
      </div>
    </div>
  );
}
