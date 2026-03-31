import React from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

export function Calendar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  // Mock events
  const events = [
    { day: 1, title: 'Velocity OS Update', type: 'product', time: '10:00 AM' },
    { day: 2, title: 'CRO Insight Post', type: 'content', time: '09:00 AM' },
    { day: 3, title: 'YouTube Publish', type: 'content', time: '12:00 PM' },
    { day: 4, title: 'Client Sync', type: 'agency', time: '02:00 PM' },
    { day: 5, title: 'Weekly Reflection', type: 'content', time: '04:00 PM' },
    { day: 1, title: 'Data Sync Cron', type: 'automation', time: '12:00 AM' },
  ];

  const getEventColor = (type: string) => {
    switch(type) {
      case 'product': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'content': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'agency': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'automation': return 'bg-ink/10 text-ink/60 border-ink/20';
      default: return 'bg-ink/10 text-ink/60 border-ink/20';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-ink">March 2026</h2>
          <div className="flex items-center gap-1 bg-card border border-line rounded-lg p-1">
            <button className="p-1 hover:bg-panel rounded text-ink/60 hover:text-ink transition-colors"><ChevronLeft size={16} /></button>
            <button className="p-1 hover:bg-panel rounded text-ink/60 hover:text-ink transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-card border border-line rounded-lg p-1">
          {['Month', 'Week', 'Day'].map(view => (
            <button key={view} className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${view === 'Week' ? 'bg-panel text-ink' : 'text-ink/60 hover:text-ink'}`}>
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] font-mono uppercase tracking-wider">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500" /> Velocity OS</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> Content</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-purple-500" /> Agency</div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-ink/40" /> Automations</div>
      </div>

      {/* Calendar Grid (Mock Week View) */}
      <div className="flex-1 bg-card border border-line rounded-xl overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-line bg-panel/50">
          {days.map((day, i) => (
            <div key={day} className="p-3 text-center border-r border-line last:border-r-0">
              <span className="text-xs font-medium text-ink/60 uppercase">{day}</span>
              <div className="text-lg font-semibold text-ink mt-1">{i + 1}</div>
            </div>
          ))}
        </div>
        
        <div className="flex-1 grid grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="border-r border-line last:border-r-0 p-2 flex flex-col gap-2 min-h-[200px]">
              {events.filter(e => e.day === i + 1).map((event, j) => (
                <div key={j} className={`p-2 rounded border text-xs flex flex-col gap-1 cursor-pointer hover:opacity-80 transition-opacity ${getEventColor(event.type)}`}>
                  <span className="font-semibold truncate">{event.title}</span>
                  <span className="text-[10px] opacity-80 font-mono">{event.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
