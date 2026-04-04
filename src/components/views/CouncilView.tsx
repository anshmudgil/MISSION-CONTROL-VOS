'use client';

import React, { useRef, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { Send, Bot, Terminal, BarChart2, PenTool, Settings, Crown, Hash, Loader2 } from 'lucide-react';

const AGENT_ICONS: Record<string, React.ElementType> = {
  VELO: Bot,
  Charlie: Terminal,
  Scout: BarChart2,
  Quill: PenTool,
  Ralph: Settings,
};

const AGENT_COLORS: Record<string, string> = {
  VELO: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  Charlie: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
  Scout: 'text-purple-500 bg-purple-500/10 border-purple-500/30',
  Quill: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  Ralph: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',
};

export function CouncilView() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = React.useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/council' }),
  });

  const isStreaming = status === 'streaming' || status === 'submitted';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput('');
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
            isStreaming
              ? 'text-blue-400 bg-blue-500/10 border border-blue-500/30'
              : 'text-text-muted border border-transparent'
          }`}>
            {isStreaming && <Loader2 size={12} className="animate-spin" />}
            {isStreaming ? 'VELO is responding…' : 'Ready'}
          </div>
        </div>
      </div>

      {/* Chat Feed */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar flex flex-col gap-6">
        {messages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <Crown size={28} className="text-yellow-500" />
            </div>
            <p className="text-text-base font-medium">The Council is ready</p>
            <p className="text-text-muted text-sm mt-2">Start a conversation with VELO and the agent team.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const agentName = isUser ? 'You' : 'VELO';
          const Icon = AGENT_ICONS[agentName] ?? Bot;
          const colorClass = isUser
            ? 'text-zinc-300 bg-zinc-700/50 border-zinc-600/50'
            : (AGENT_COLORS[agentName] ?? AGENT_COLORS.VELO);

          const textContent = msg.parts
            .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
            .map(p => p.text)
            .join('');

          return (
            <div key={msg.id} className={`flex gap-4 group ${isUser ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 mt-1 ${colorClass}`}>
                {isUser
                  ? <span className="text-[10px] font-bold uppercase">You</span>
                  : <Icon size={20} />
                }
              </div>
              <div className={`flex flex-col gap-1 min-w-0 max-w-[75%] ${isUser ? 'items-end' : ''}`}>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-text-base">{agentName}</span>
                  {!isUser && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-bg-subtle border border-border-base text-text-muted uppercase tracking-wider">
                      Core
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  isUser
                    ? 'text-text-base bg-bg-panel border border-border-base rounded-xl px-4 py-3'
                    : 'text-text-muted'
                }`}>
                  {textContent}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-bg-base border-t border-border-base shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={isStreaming}
            placeholder="Message The Council (or type / to assign a specific agent)…"
            className="w-full bg-bg-panel border border-border-base rounded-xl pl-4 pr-12 py-4 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-border-strong transition-all shadow-elevation-card-rest disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}

            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isStreaming
              ? <Loader2 size={16} className="animate-spin" />
              : <Send size={16} />
            }
          </button>
        </form>
      </div>
    </div>
  );
}
