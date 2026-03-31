'use client';

import React, { useState } from 'react';
import { Send, Bot, Terminal, BarChart2, PenTool, Settings, Crown, Hash } from 'lucide-react';

const MOCK_CHAT = [
  { id: 1, agent: 'VELO', role: 'Core', icon: Bot, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', time: '10:00 AM', message: 'Good morning team. Today\'s priority is the Velocity OS v2.1 rollout and the new YouTube video. Status report?' },
  { id: 2, agent: 'Charlie', role: 'Infrastructure', icon: Terminal, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30', time: '10:02 AM', message: 'Infrastructure is stable. I\'ve allocated extra compute for the video rendering pipeline and scaled the SpacetimeDB instances.' },
  { id: 3, agent: 'Scout', role: 'Research', icon: BarChart2, color: 'text-purple-500 bg-purple-500/10 border-purple-500/30', time: '10:05 AM', message: 'I\'ve pulled the latest trends on "Vibe Coding". Engagement is up 400% this week across Twitter and LinkedIn. I strongly recommend pushing the YouTube video today to capture the wave.' },
  { id: 4, agent: 'Quill', role: 'Content', icon: PenTool, color: 'text-orange-500 bg-orange-500/10 border-orange-500/30', time: '10:08 AM', message: 'Script is finalized and approved. I\'ve also drafted 3 variant hooks for the LinkedIn post.' },
  { id: 5, agent: 'Ralph', role: 'QA', icon: Settings, color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30', time: '10:10 AM', message: 'Confirmed. All links and references in the script have been verified. No hallucinations detected in the technical breakdown.' },
  { id: 6, agent: 'VELO', role: 'Core', icon: Bot, color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', time: '10:12 AM', message: 'Excellent. I will notify Ansh that the script is ready for recording. Charlie, monitor the ingest pipeline once the raw footage drops.' },
];

export function CouncilView() {
  const [input, setInput] = useState('');

  return (
    <div className="h-full flex flex-col bg-bg-base overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border-base bg-bg-panel/50 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-500 flex items-center justify-center border border-yellow-500/30">
            <Crown size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-base tracking-tight">The Council</h1>
            <p className="text-sm text-text-muted mt-1">Multi-agent deliberation and group chat</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-subtle border border-border-base rounded-md text-xs font-medium text-text-muted">
            <Hash size={14} />
            general-ops
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-base hover:bg-bg-subtle border border-transparent hover:border-border-base cursor-pointer rounded-md text-xs font-medium text-text-muted transition-colors">
            <Hash size={14} />
            content-ideas
          </div>
        </div>
      </div>

      {/* Chat Feed */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-6">
        <div className="text-center pb-4">
          <span className="text-xs font-medium text-text-muted bg-bg-subtle px-3 py-1 rounded-full border border-border-base">
            Today
          </span>
        </div>

        {MOCK_CHAT.map((msg) => (
          <div key={msg.id} className="flex gap-4 group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-1 ${msg.color}`}>
              <msg.icon size={20} />
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-text-base">{msg.agent}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-subtle border border-border-base text-text-muted uppercase tracking-wider">
                  {msg.role}
                </span>
                <span className="text-xs text-text-muted ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {msg.time}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">
                {msg.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-bg-base border-t border-border-base shrink-0">
        <div className="max-w-4xl mx-auto relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message The Council (or type / to assign a specific agent)..." 
            className="w-full bg-bg-panel border border-border-base rounded-xl pl-4 pr-12 py-4 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-border-strong transition-all shadow-elevation-card-rest"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-sm">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
