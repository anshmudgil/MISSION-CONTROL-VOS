import React from 'react';
import { Settings as SettingsIcon, Database, Bell, Github, Slack, ShoppingBag, Activity } from 'lucide-react';

export function Settings() {
  const integrations = [
    { name: 'Shopify', desc: 'Data source for CRO experiments', icon: ShoppingBag, status: 'connected' },
    { name: 'Notion', desc: 'Memory + task sync', icon: Database, status: 'connected' },
    { name: 'Google Analytics 4', desc: 'Conversion tracking', icon: Activity, status: 'error' },
    { name: 'Slack', desc: 'Agent alerts + notifications', icon: Slack, status: 'connected' },
    { name: 'GitHub', desc: 'Deployment triggers', icon: Github, status: 'connected' },
  ];

  return (
    <div className="p-8 h-full overflow-y-auto custom-scrollbar max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-8">
        
        {/* Agent Config */}
        <section>
          <h3 className="text-sm font-mono text-ink/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <SettingsIcon size={16} /> Agent Configuration
          </h3>
          <div className="bg-card border border-line rounded-xl p-6 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-ink">VELO Autonomy Level</h4>
                <p className="text-xs text-ink/60 mt-1">Determine how much VELO can execute without approval.</p>
              </div>
              <select className="bg-panel border border-line rounded-lg px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent">
                <option>Require Approval (Safe)</option>
                <option>Semi-Autonomous</option>
                <option>Fully Autonomous (Danger)</option>
              </select>
            </div>
            
            <div className="w-full h-px bg-line/50" />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-ink">Experiment Frequency</h4>
                <p className="text-xs text-ink/60 mt-1">Maximum concurrent A/B tests per client.</p>
              </div>
              <input type="number" defaultValue={3} className="bg-panel border border-line rounded-lg px-3 py-1.5 text-sm text-ink w-20 focus:outline-none focus:border-accent" />
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h3 className="text-sm font-mono text-ink/40 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Database size={16} /> Integrations
          </h3>
          <div className="bg-card border border-line rounded-xl overflow-hidden">
            <div className="divide-y divide-line">
              {integrations.map(int => {
                const Icon = int.icon;
                return (
                  <div key={int.name} className="p-4 flex items-center justify-between hover:bg-panel/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-panel rounded-lg flex items-center justify-center border border-line">
                        <Icon size={20} className="text-ink/80" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-ink">{int.name}</h4>
                        <p className="text-xs text-ink/50">{int.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex h-2 w-2 relative">
                        {int.status === 'connected' ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </>
                        ) : (
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        )}
                      </span>
                      <span className="text-xs font-mono text-ink/60 capitalize">{int.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
