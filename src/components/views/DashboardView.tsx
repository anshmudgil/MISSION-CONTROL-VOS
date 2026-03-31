import React from 'react';
import { Activity, CheckCircle2, Clock, Calendar, AlertCircle, PlayCircle } from 'lucide-react';

export function DashboardView() {
  const metrics = [
    { label: 'Active Tasks', value: '24', icon: CheckCircle2, color: 'text-blue-400' },
    { label: 'Content Pipeline', value: '12', icon: PlayCircle, color: 'text-purple-400', subtext: '3 Scripting, 5 Editing' },
    { label: 'Upcoming Events', value: '4', icon: Calendar, color: 'text-green-400', subtext: 'Next 48 hours' },
    { label: 'VELO Activity', value: '98%', icon: Activity, color: 'text-emerald-400', subtext: 'Uptime today' },
  ];

  const activityFeed = [
    { id: 1, action: 'VELO drafted YouTube script "10 CRO Tips"', time: '10 mins ago', status: 'active' },
    { id: 2, action: 'VELO analyzed competitor landing pages', time: '1 hour ago', status: 'active' },
    { id: 3, action: 'Waiting for Ansh approval on LinkedIn post', time: '2 hours ago', status: 'pending' },
    { id: 4, action: 'Failed to sync with Webflow API', time: '4 hours ago', status: 'error' },
    { id: 5, action: 'VELO completed weekly analytics report', time: '5 hours ago', status: 'active' },
    { id: 6, action: 'System idle', time: '6 hours ago', status: 'idle' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'pending': return 'bg-amber-500';
      case 'error': return 'bg-rose-500';
      case 'idle': return 'bg-zinc-500';
      default: return 'bg-zinc-500';
    }
  };

  return (
    <div className="h-full flex flex-col bg-bg-base p-8 overflow-y-auto custom-scrollbar">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-text-base tracking-tight">Mission Control</h1>
        <p className="text-text-muted mt-1">Velocity OS Autonomous CRO Agent Overview</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div key={i} className="bg-bg-panel border border-border-base rounded-xl p-5 shadow-elevation-card-rest hover:shadow-elevation-card-hover transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-muted">{metric.label}</span>
                <Icon size={18} className={metric.color} />
              </div>
              <div className="text-3xl font-semibold text-text-base mb-1">{metric.value}</div>
              {metric.subtext && (
                <div className="text-xs text-text-muted">{metric.subtext}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Activity Feed */}
      <div className="flex-1 bg-bg-panel border border-border-base rounded-xl shadow-elevation-card-rest overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border-base flex items-center justify-between">
          <h2 className="text-lg font-medium text-text-base">Live Activity Feed</h2>
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Error</span>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          <div className="space-y-6">
            {activityFeed.map((item, i) => (
              <div key={item.id} className="flex gap-4 relative">
                {i !== activityFeed.length - 1 && (
                  <div className="absolute left-[9px] top-6 bottom-[-24px] w-[2px] bg-border-base"></div>
                )}
                <div className="relative z-10 mt-1">
                  <div className={`w-5 h-5 rounded-full border-4 border-bg-panel ${getStatusColor(item.status)}`}></div>
                </div>
                <div>
                  <p className="text-sm text-text-base font-medium">{item.action}</p>
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    {item.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
