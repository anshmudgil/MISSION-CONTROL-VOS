import React, { useState } from 'react';
import { Bot, Activity, CheckCircle, Clock, ChevronRight, X, Terminal, BarChart2, PenTool, Settings } from 'lucide-react';

type AgentStatus = 'active' | 'idle' | 'error' | 'offline';

type Agent = {
  id: string;
  name: string;
  role: string;
  group: 'Core' | 'Developers' | 'Analysts' | 'Writers' | 'Operators';
  currentTask: string;
  status: AgentStatus;
  lastActive: string;
  responsibilities: string[];
  recentWork: string[];
  metrics: {
    tasksCompleted: number;
    uptime: string;
    avgResponseTime: string;
  };
  icon: React.ElementType;
  color: string;
};

const AGENTS: Agent[] = [
  {
    id: 'velo',
    name: 'VELO',
    role: 'Autonomous CRO Agent',
    group: 'Core',
    currentTask: 'Orchestrating Q3 Content Pipeline',
    status: 'active',
    lastActive: 'Just now',
    responsibilities: ['Strategic Planning', 'Agent Orchestration', 'Final Approvals', 'System Health Monitoring'],
    recentWork: ['Approved "Vibe Coding" YouTube Script', 'Deployed new landing page variant', 'Analyzed weekly conversion metrics'],
    metrics: { tasksCompleted: 142, uptime: '99.9%', avgResponseTime: '1.2s' },
    icon: Bot,
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/30'
  },
  {
    id: 'charlie',
    name: 'Charlie',
    role: 'Infrastructure Engineer',
    group: 'Developers',
    currentTask: 'Optimizing local model inference',
    status: 'active',
    lastActive: '2m ago',
    responsibilities: ['Local Model Deployment', 'API Integration', 'Database Maintenance'],
    recentWork: ['Updated Qwen 3.5 weights', 'Fixed SpacetimeDB connection issue'],
    metrics: { tasksCompleted: 89, uptime: '99.5%', avgResponseTime: '800ms' },
    icon: Terminal,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    id: 'scout',
    name: 'Scout',
    role: 'Trend Researcher',
    group: 'Analysts',
    currentTask: 'Scanning Twitter for AI trends',
    status: 'idle',
    lastActive: '15m ago',
    responsibilities: ['Market Research', 'Competitor Analysis', 'Trend Identification'],
    recentWork: ['Compiled daily trend report', 'Analyzed competitor pricing changes'],
    metrics: { tasksCompleted: 210, uptime: '100%', avgResponseTime: '2.5s' },
    icon: BarChart2,
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/30'
  },
  {
    id: 'quill',
    name: 'Quill',
    role: 'Content Writer',
    group: 'Writers',
    currentTask: 'Drafting LinkedIn post on Vibe Coding',
    status: 'active',
    lastActive: 'Just now',
    responsibilities: ['Script Writing', 'Social Media Copy', 'Newsletter Drafting'],
    recentWork: ['Drafted "Vibe Coding" YouTube Script', 'Wrote 5 tweet threads'],
    metrics: { tasksCompleted: 340, uptime: '99.8%', avgResponseTime: '3.1s' },
    icon: PenTool,
    color: 'text-orange-500 bg-orange-500/10 border-orange-500/30'
  },
  {
    id: 'ralph',
    name: 'Ralph',
    role: 'QA Manager',
    group: 'Operators',
    currentTask: 'Reviewing landing page copy',
    status: 'active',
    lastActive: '5m ago',
    responsibilities: ['Quality Assurance', 'Link Checking', 'Formatting Review'],
    recentWork: ['Approved newsletter draft', 'Flagged broken link in staging'],
    metrics: { tasksCompleted: 512, uptime: '99.9%', avgResponseTime: '900ms' },
    icon: Settings,
    color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30'
  }
];

const StatusIndicator = ({ status }: { status: AgentStatus }) => {
  const colors = {
    active: 'bg-emerald-500',
    idle: 'bg-zinc-500',
    error: 'bg-red-500',
    offline: 'bg-zinc-800'
  };
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
      <span className="text-xs text-text-muted capitalize">{status}</span>
    </div>
  );
};

export function AITeamView() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const coreAgent = AGENTS.find(a => a.group === 'Core');
  const groups = ['Developers', 'Analysts', 'Writers', 'Operators'];

  return (
    <div className="h-full flex bg-bg-base overflow-hidden relative">
      {/* Main View */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedAgent ? 'mr-96' : ''}`}>
        <div className="px-8 py-6 border-b border-border-base bg-bg-panel/50 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-500 flex items-center justify-center border border-indigo-500/30">
              <Bot size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-base tracking-tight">AI Team Org</h1>
              <p className="text-sm text-text-muted mt-1">Manage your autonomous workforce</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto flex flex-col items-center">
            
            {/* Core Agent (VELO) */}
            {coreAgent && (
              <div className="flex flex-col items-center relative z-10 mb-12">
                <AgentCard agent={coreAgent} onClick={() => setSelectedAgent(coreAgent)} isSelected={selectedAgent?.id === coreAgent.id} />
                {/* Vertical line down from VELO */}
                <div className="w-px h-12 bg-border-strong absolute -bottom-12 left-1/2 -translate-x-1/2" />
              </div>
            )}

            {/* Sub-agents grouped */}
            <div className="flex justify-between w-full relative pt-8">
              {/* Horizontal connecting line */}
              <div className="absolute top-0 left-[12.5%] right-[12.5%] h-px bg-border-strong" />
              
              {groups.map((group, idx) => {
                const groupAgents = AGENTS.filter(a => a.group === group);
                if (groupAgents.length === 0) return null;

                return (
                  <div key={group} className="flex flex-col items-center gap-6 relative w-1/4">
                    {/* Vertical line connecting up to horizontal line */}
                    <div className="w-px h-8 bg-border-strong absolute top-0 left-1/2 -translate-x-1/2" />
                    
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 bg-bg-base px-3 py-1 rounded-full border border-border-base relative z-10 shadow-sm">
                      {group}
                    </div>
                    
                    {groupAgents.map(agent => (
                      <AgentCard 
                        key={agent.id} 
                        agent={agent} 
                        onClick={() => setSelectedAgent(agent)} 
                        isSelected={selectedAgent?.id === agent.id} 
                      />
                    ))}
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Side Panel for Agent Details */}
      {selectedAgent && (
        <div className="w-96 bg-bg-panel border-l border-border-base absolute right-0 top-0 bottom-0 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-border-base flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${selectedAgent.color}`}>
                <selectedAgent.icon size={20} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-text-base">{selectedAgent.name}</h2>
                <p className="text-xs text-text-muted">{selectedAgent.role}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedAgent(null)}
              className="p-2 hover:bg-bg-subtle rounded-md text-text-muted hover:text-text-base transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 custom-scrollbar">
            
            {/* Status & Current Task */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Current Status</h3>
              <div className="bg-bg-subtle border border-border-base rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <StatusIndicator status={selectedAgent.status} />
                  <span className="text-xs text-text-muted flex items-center gap-1"><Clock size={12} /> {selectedAgent.lastActive}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-text-base">{selectedAgent.currentTask}</p>
                  <p className="text-xs text-text-muted mt-1">Active assignment</p>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Performance Metrics</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-subtle border border-border-base rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-text-base">{selectedAgent.metrics.tasksCompleted}</div>
                  <div className="text-[10px] text-text-muted uppercase mt-1">Tasks</div>
                </div>
                <div className="bg-bg-subtle border border-border-base rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-emerald-500">{selectedAgent.metrics.uptime}</div>
                  <div className="text-[10px] text-text-muted uppercase mt-1">Uptime</div>
                </div>
                <div className="bg-bg-subtle border border-border-base rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-blue-500">{selectedAgent.metrics.avgResponseTime}</div>
                  <div className="text-[10px] text-text-muted uppercase mt-1">Avg Resp</div>
                </div>
              </div>
            </div>

            {/* Responsibilities */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Core Responsibilities</h3>
              <ul className="space-y-2">
                {selectedAgent.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-text-base">
                    <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Work */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">Recent Work</h3>
              <div className="space-y-3">
                {selectedAgent.recentWork.map((work, i) => (
                  <div key={i} className="bg-bg-subtle border border-border-base rounded-lg p-3 text-sm text-text-base">
                    {work}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function AgentCard({ agent, onClick, isSelected }: { agent: Agent, onClick: () => void, isSelected: boolean }) {
  return (
    <div 
      onClick={onClick}
      className={`w-64 bg-bg-panel border rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'border-accent shadow-elevation-card-hover ring-1 ring-accent/50' 
          : 'border-border-base shadow-elevation-card-rest hover:border-border-strong hover:shadow-elevation-card-hover'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${agent.color}`}>
            <agent.icon size={20} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-base">{agent.name}</h3>
            <p className="text-xs text-text-muted">{agent.role}</p>
          </div>
        </div>
      </div>
      
      <div className="pt-3 border-t border-border-base flex flex-col gap-2">
        <StatusIndicator status={agent.status} />
        <p className="text-xs text-text-base line-clamp-1" title={agent.currentTask}>
          <span className="text-text-muted mr-1">Task:</span>
          {agent.currentTask}
        </p>
      </div>
    </div>
  );
}
