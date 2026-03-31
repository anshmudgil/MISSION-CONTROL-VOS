import React from 'react';
import { Command, Search, Pause } from 'lucide-react';

export function TopBar() {
  return (
    <header className="h-14 bg-bg-base border-b border-border-base flex items-center justify-between px-4 shrink-0 shadow-sm z-10 relative">
      <div className="flex items-center gap-3 font-medium text-text-base">
        <div className="w-7 h-7 rounded-md bg-bg-panel border border-border-base flex items-center justify-center shadow-elevation-card-rest">
          <Command size={14} className="text-text-muted" />
        </div>
        <span className="tracking-tight">Mission Control</span>
      </div>
      
      <div className="flex items-center gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-2 bg-bg-subtle border border-border-base rounded-md px-3 py-1.5 w-64 shadow-inner">
          <Search size={14} /> 
          <span className="flex-1 text-left">Search</span>
          <span className="text-[10px] border border-border-strong rounded px-1.5 py-0.5 font-mono bg-bg-panel">⌘K</span>
        </div>
        
        <button className="flex items-center gap-2 hover:text-text-base transition-colors px-2 py-1 rounded-md hover:bg-bg-panel">
          <Pause size={14} /> Pause
        </button>
        
        <button className="hover:text-text-base transition-colors px-2 py-1 rounded-md hover:bg-bg-panel">
          Ping H...
        </button>
      </div>
    </header>
  );
}
