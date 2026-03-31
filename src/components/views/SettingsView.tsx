'use client';

import React, { useState } from 'react';
import { Settings, Sliders, Activity, CheckCircle, XCircle, AlertCircle, Github, Slack, Database, Globe, ShoppingBag, FileText, BarChart } from 'lucide-react';

type IntegrationStatus = 'connected' | 'disconnected' | 'error';

interface Integration {
  id: string;
  name: string;
  icon: React.ElementType;
  status: IntegrationStatus;
  lastSync?: string;
}

const INTEGRATIONS: Integration[] = [
  { id: 'shopify', name: 'Shopify', icon: ShoppingBag, status: 'connected', lastSync: '2 mins ago' },
  { id: 'notion', name: 'Notion', icon: FileText, status: 'connected', lastSync: 'Just now' },
  { id: 'ga4', name: 'Google Analytics 4', icon: BarChart, status: 'connected', lastSync: '1 hour ago' },
  { id: 'slack', name: 'Slack', icon: Slack, status: 'connected', lastSync: '5 mins ago' },
  { id: 'github', name: 'GitHub', icon: Github, status: 'connected', lastSync: '10 mins ago' },
  { id: 'vercel', name: 'Vercel', icon: Globe, status: 'error', lastSync: 'Failed 2 hours ago' },
];

export function SettingsView() {
  const [threshold, setThreshold] = useState(80);
  const [experimentFreq, setExperimentFreq] = useState('medium');
  const [approvalGate, setApprovalGate] = useState(true);

  return (
    <div className="h-full flex flex-col bg-bg-base overflow-hidden">
      <div className="px-8 py-6 border-b border-border-base bg-bg-panel/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-500/20 text-zinc-500 flex items-center justify-center border border-zinc-500/30">
            <Settings size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-base tracking-tight">Settings</h1>
            <p className="text-sm text-text-muted mt-1">Manage system configurations and integrations</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* VELO Configuration Panel */}
          <section className="bg-bg-panel border border-border-base rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border-base flex items-center gap-2">
              <Sliders size={18} className="text-blue-500" />
              <h2 className="text-lg font-medium text-text-base">VELO Agent Configuration</h2>
            </div>
            <div className="p-6 space-y-6">
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-text-base">Confidence Threshold</label>
                  <span className="text-sm text-text-muted">{threshold}%</span>
                </div>
                <input 
                  type="range" 
                  min="50" max="100" 
                  value={threshold} 
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
                <p className="text-xs text-text-muted mt-2">Minimum confidence required for VELO to execute actions autonomously.</p>
              </div>

              <div>
                <label className="text-sm font-medium text-text-base block mb-2">Experiment Frequency</label>
                <div className="flex gap-3">
                  {['low', 'medium', 'high'].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setExperimentFreq(freq)}
                      className={`flex-1 py-2 px-4 rounded-md border text-sm capitalize transition-colors ${
                        experimentFreq === freq 
                          ? 'bg-blue-500/10 border-blue-500 text-blue-500' 
                          : 'bg-bg-base border-border-base text-text-muted hover:border-border-strong'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-2">How often VELO should propose new A/B tests or content variations.</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-base">
                <div>
                  <h3 className="text-sm font-medium text-text-base">Require Approval Gates</h3>
                  <p className="text-xs text-text-muted mt-1">Force human review before publishing content or deploying code.</p>
                </div>
                <button 
                  onClick={() => setApprovalGate(!approvalGate)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${approvalGate ? 'bg-blue-500' : 'bg-zinc-600'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${approvalGate ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

            </div>
          </section>

          {/* Integrations Panel */}
          <section className="bg-bg-panel border border-border-base rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border-base flex items-center gap-2">
              <Activity size={18} className="text-emerald-500" />
              <h2 className="text-lg font-medium text-text-base">Integrations Status</h2>
            </div>
            <div className="divide-y divide-border-base">
              {INTEGRATIONS.map((integration) => (
                <div key={integration.id} className="p-4 flex items-center justify-between hover:bg-bg-subtle transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-base border border-border-base flex items-center justify-center text-text-base">
                      <integration.icon size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-base">{integration.name}</h3>
                      <p className="text-xs text-text-muted">Last sync: {integration.lastSync}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {integration.status === 'connected' && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full">
                        <CheckCircle size={14} /> Connected
                      </span>
                    )}
                    {integration.status === 'disconnected' && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-500/10 px-2.5 py-1 rounded-full">
                        <XCircle size={14} /> Disconnected
                      </span>
                    )}
                    {integration.status === 'error' && (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full">
                        <AlertCircle size={14} /> Error
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
