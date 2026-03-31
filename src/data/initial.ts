import { Task, CalendarEvent, Project, Doc, TeamMember } from '../types';

export const INITIAL_TASKS: Task[] = [
  { 
    id: 't1', columnId: 'backlog', title: 'Record Claude Code ...', description: 'Film the I deleted all my AI tools video', 
    assignee: { name: 'Ansh', initial: 'A', color: 'bg-emerald-500/20 text-emerald-500' }, 
    tag: { label: 'YouTube', color: 'text-red-500' }, timeAgo: 'less than a minute ago', project: 'Personal Brand/Content',
    priority: 'high', dueDate: '2026-04-05', comments: [{ id: 'c1', author: 'VELO', text: 'Script is ready for review.', timestamp: '1 hour ago' }]
  },
  { 
    id: 't2', columnId: 'backlog', title: 'Flesh out $10K Mac ...', description: 'Develop and prioritize the use cases for the Mac Studio M3 Ultra upgrade', 
    assignee: { name: 'Ansh', initial: 'A', color: 'bg-emerald-500/20 text-emerald-500' }, 
    tag: { label: 'Clawdbot', color: 'text-zinc-400' }, timeAgo: 'less than a minute ago', project: 'Velocity OS',
    priority: 'medium', dueDate: '2026-04-10', comments: []
  },
  { 
    id: 't3', columnId: 'backlog', title: 'Pre train a local model', description: '', 
    assignee: { name: 'VELO', initial: 'V', color: 'bg-purple-500/20 text-purple-500' }, 
    tag: { label: '', color: '' }, timeAgo: 'less than a minute ago', project: 'Velocity OS',
    priority: 'low', comments: []
  },
  { 
    id: 't4', columnId: 'backlog', title: 'Build activity feed for...', description: '', 
    assignee: { name: 'VELO', initial: 'V', color: 'bg-purple-500/20 text-purple-500' }, 
    tag: { label: 'Agents', color: 'text-zinc-400' }, timeAgo: 'less than a minute ago', project: 'Velocity OS',
    priority: 'medium', comments: []
  },
  { 
    id: 't5', columnId: 'backlog', title: '[Reborn] Server: Play...', description: 'SpacetimeDB module: Create Player table (identity, name, x, y, z, rotY,...', 
    assignee: { name: 'VELO', initial: 'V', color: 'bg-purple-500/20 text-purple-500' }, 
    tag: { label: 'Reborn', color: 'text-zinc-400' }, timeAgo: 'less than a minute ago', project: 'Agency Client Delivery',
    priority: 'high', dueDate: '2026-04-02', comments: []
  },
  { 
    id: 't6', columnId: 'in-progress', title: 'Build Council - Societ...', description: 'Multi-model deliberation system. Phase 1: CLI backend. Phase 2:...', 
    assignee: { name: 'VELO', initial: 'V', color: 'bg-purple-500/20 text-purple-500' }, 
    tag: { label: 'Council', color: 'text-zinc-400' }, timeAgo: 'less than a minute ago', project: 'Velocity OS',
    priority: 'high', dueDate: '2026-04-01', comments: [{ id: 'c2', author: 'Ansh', text: 'Make sure to include the new API endpoints.', timestamp: '2 hours ago' }]
  },
  { 
    id: 't7', columnId: 'in-progress', title: 'Research Exo Labs du...', description: 'Prep guide for running large models (Kimi K2.5, etc.) distributed across ...', 
    assignee: { name: 'Ansh', initial: 'A', color: 'bg-emerald-500/20 text-emerald-500' }, 
    tag: { label: 'Mac Studio Launch', color: 'text-zinc-400' }, timeAgo: 'less than a minute ago', project: 'Personal Brand/Content',
    priority: 'medium', comments: []
  },
  { 
    id: 't8', columnId: 'in-progress', title: 'Build AI Employee Sc...', description: 'New tab in Mission Control tracking the ROI of the AI employee setup....', 
    assignee: { name: 'VELO', initial: 'V', color: 'bg-purple-500/20 text-purple-500' }, 
    tag: { label: 'Mission Control', color: 'text-zinc-400' }, timeAgo: 'less than a minute ago', project: 'Agency Client Delivery',
    priority: 'high', dueDate: '2026-04-07', comments: []
  },
];

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'c1', day: 0, title: 'Trend Radar', time: '12:00 PM', color: 'border-orange-500/50 text-orange-500 bg-orange-500/10', type: 'Automations', description: 'Daily trend analysis across Twitter and LinkedIn.' },
  { id: 'c2', day: 0, title: 'Morning Kickoff', time: '6:55 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Velocity OS', description: 'System health check and daily priorities.' },
  { id: 'c3', day: 0, title: 'YouTube OpenClaw R...', time: '7:00 AM', color: 'border-red-500/50 text-red-500 bg-red-500/10', type: 'Content', description: 'Recording session for the new OpenClaw video.' },
  { id: 'c4', day: 0, title: 'Scout Morning Resear...', time: '8:00 AM', color: 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10', type: 'Automations', description: 'Scout agent gathering daily intel.' },
  { id: 'c5', day: 0, title: 'Morning Brief', time: '8:00 AM', color: 'border-orange-500/50 text-orange-500 bg-orange-500/10', type: 'Velocity OS', description: 'Team sync and task delegation.' },
  { id: 'c6', day: 0, title: 'Trend Radar Daily Dig...', time: '8:00 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Automations', description: 'Processing trend data into actionable insights.' },
  { id: 'c7', day: 0, title: 'Quill Script Writer', time: '8:30 AM', color: 'border-blue-500/50 text-blue-500 bg-blue-500/10', type: 'Content', description: 'Quill agent drafting the next newsletter.' },
  { id: 'c8', day: 0, title: 'Client Sync: Acme', time: '9:00 AM', color: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10', type: 'Agency', description: 'Weekly sync with Acme Corp.' },
  { id: 'c9', day: 0, title: 'Evening Wrap Up', time: '9:00 PM', color: 'border-purple-500/50 text-purple-400 bg-purple-500/10', type: 'Velocity OS', description: 'End of day system state save and reporting.' },
  
  { id: 'c10', day: 1, title: 'Trend Radar', time: '12:00 PM', color: 'border-orange-500/50 text-orange-500 bg-orange-500/10', type: 'Automations', description: 'Daily trend analysis across Twitter and LinkedIn.' },
  { id: 'c11', day: 1, title: 'Morning Kickoff', time: '6:55 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Velocity OS', description: 'System health check and daily priorities.' },
  { id: 'c12', day: 1, title: 'LinkedIn Post Draft', time: '7:00 AM', color: 'border-blue-500/50 text-blue-500 bg-blue-500/10', type: 'Content', description: 'Drafting the weekly LinkedIn post.' },
  { id: 'c13', day: 1, title: 'Stock Scarcity Resear...', time: '7:30 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Automations', description: 'Market research and analysis.' },
  { id: 'c14', day: 1, title: 'Scout Morning Resear...', time: '8:00 AM', color: 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10', type: 'Automations', description: 'Scout agent gathering daily intel.' },
  { id: 'c15', day: 1, title: 'Morning Brief', time: '8:00 AM', color: 'border-orange-500/50 text-orange-500 bg-orange-500/10', type: 'Velocity OS', description: 'Team sync and task delegation.' },
  { id: 'c16', day: 1, title: 'Trend Radar Daily Dig...', time: '8:00 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Automations', description: 'Processing trend data into actionable insights.' },
  { id: 'c17', day: 1, title: 'Quill Script Writer', time: '8:30 AM', color: 'border-blue-500/50 text-blue-500 bg-blue-500/10', type: 'Content', description: 'Quill agent drafting the next newsletter.' },
  { id: 'c18', day: 1, title: 'Client Sync: Globex', time: '9:00 AM', color: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10', type: 'Agency', description: 'Weekly sync with Globex.' },
  { id: 'c19', day: 1, title: 'Evening Wrap Up', time: '9:00 PM', color: 'border-purple-500/50 text-purple-400 bg-purple-500/10', type: 'Velocity OS', description: 'End of day system state save and reporting.' },
  
  { id: 'c20', day: 2, title: 'Trend Radar', time: '12:00 PM', color: 'border-orange-500/50 text-orange-500 bg-orange-500/10', type: 'Automations', description: 'Daily trend analysis across Twitter and LinkedIn.' },
  { id: 'c21', day: 2, title: 'Morning Kickoff', time: '6:55 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Velocity OS', description: 'System health check and daily priorities.' },
  { id: 'c22', day: 2, title: 'YouTube OpenClaw R...', time: '7:00 AM', color: 'border-red-500/50 text-red-500 bg-red-500/10', type: 'Content', description: 'Recording session for the new OpenClaw video.' },
  { id: 'c23', day: 2, title: 'Scout Morning Resear...', time: '8:00 AM', color: 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10', type: 'Automations', description: 'Scout agent gathering daily intel.' },
  { id: 'c24', day: 2, title: 'Morning Brief', time: '8:00 AM', color: 'border-orange-500/50 text-orange-500 bg-orange-500/10', type: 'Velocity OS', description: 'Team sync and task delegation.' },
  { id: 'c25', day: 2, title: 'Trend Radar Daily Dig...', time: '8:00 AM', color: 'border-zinc-500/50 text-zinc-400 bg-zinc-500/10', type: 'Automations', description: 'Processing trend data into actionable insights.' },
  { id: 'c26', day: 2, title: 'Quill Script Writer', time: '8:30 AM', color: 'border-blue-500/50 text-blue-500 bg-blue-500/10', type: 'Content', description: 'Quill agent drafting the next newsletter.' },
  { id: 'c27', day: 2, title: 'Daily Digest', time: '9:00 AM', color: 'border-indigo-500/50 text-indigo-400 bg-indigo-500/10', type: 'Agency', description: 'Daily digest of agency activities.' },
  { id: 'c28', day: 2, title: 'Evening Wrap Up', time: '9:00 PM', color: 'border-purple-500/50 text-purple-400 bg-purple-500/10', type: 'Velocity OS', description: 'End of day system state save and reporting.' },
];

export const PROJECTS: Project[] = [
  { id: 'p1', title: 'Agent Org Infrastructure', status: 'Active', description: 'Core infrastructure for the autonomous agent organization. Health monitoring, message bus, shared...', progress: 100, tasksCompleted: 10, tasksTotal: 10, assignee: { name: 'Charlie', initial: 'C', color: 'bg-blue-500/20 text-blue-400' }, priority: 'high', timeAgo: '8 days ago by Henry' },
  { id: 'p2', title: 'Mission Control', status: 'Active', description: 'Central dashboard for the agent organization. Tasks, projects, approvals, agent activity, docs, and real-tim...', progress: 70, tasksCompleted: 0, tasksTotal: 0, assignee: { name: 'Henry', initial: 'H', color: 'bg-orange-500/20 text-orange-400' }, priority: 'high', timeAgo: '8 days ago by Henry' },
  { id: 'p3', title: 'Skool AI Extension', status: 'Planning', description: '"Ask Alex" Chrome extension for Vibe Coding Academy. RAG pipeline over course content...', progress: 0, tasksCompleted: 0, tasksTotal: 0, assignee: { name: 'Henry', initial: 'H', color: 'bg-orange-500/20 text-orange-400' }, priority: 'high', timeAgo: '8 days ago by Henry' },
  { id: 'p4', title: 'Micro-SaaS Factory', status: 'Planning', description: 'Violet\'s opportunity engine — research market gaps, validate ideas, and build small SaaS products...', progress: 0, tasksCompleted: 0, tasksTotal: 0, assignee: { name: 'Violet', initial: 'V', color: 'bg-purple-500/20 text-purple-400' }, priority: 'medium', timeAgo: '8 days ago by Violet' },
  { id: 'p5', title: 'Even G2 Integration', status: 'Planning', description: 'Smart glasses bridge app connecting Even Realities G2 glasses to Henry via BLE. AI assistant in your glasses...', progress: 0, tasksCompleted: 0, tasksTotal: 0, assignee: { name: 'Unassigned', initial: 'U', color: 'bg-zinc-500/20 text-zinc-400' }, priority: 'medium', timeAgo: '8 days ago' },
];

export const DOCS: Doc[] = [
  { id: 'd1', title: '2026-02-26.md', date: 'Thu, Feb 26', tag: 'Journal', size: '4.8 KB', words: 772, content: `# 2026-02-26 — Thursday

## 9:00 AM — Qwen 3.5 Medium Series Research

**What we discussed:** Alex shared the Qwen 3.5 Medium announcement tweet. 4 new models: 35B-A3B, 27B dense, Flash (API).

**Key findings:**
- 35B-A3B (3B active params) beats old 235B flagship — incredible efficiency
- 122B-A10B matches/beats 397B on agent benchmarks with only 10B active
- 27B dense gets best SWE-bench of the medium trio (72.4)
- All have MLX community ports available (4-bit, 8-bit)
- 35B-A3B at 4-bit is ~20GB RAM — could run alongside Opus on Studio 1

**Recommendations given:**
1. Keep 397B on Studio 2 for Charlie (still strongest overall)
2. Add 35B-A3B on Studio 1 as fast parallel worker (~20GB, blazing inference)
3. 122B-A10B as potential Charlie upgrade (similar quality, much faster, ~70GB)
4. 35B-A3B could replace Violet's MiniMax M2.5 on Mac Mini

**Decision:** Pending — Alex hasn't decided yet

## Overnight — Reborn Factory Results
...` },
  { id: 'd2', title: '2026-02-25-vibe-coding-mainstream.md', date: 'Wed, Feb 25', tag: 'Other', size: '3.2 KB', words: 583, content: `# Newsletter Draft — Feb 25, 2026

## Subject Line Options:
1. Vibe coding just went mainstream. Here's how to cash in before everyone else.
2. The New York Times just wrote about vibe coding. Here's what that means for YOU.
3. Vibe coding is now a $100 million industry. Are you in or are you watching?
4. Everyone will be vibe coding in 6 months. Here's how to be ahead of ALL of them.
5. I've been vibe coding for 18 months. Here's what 99% of people still don't understand.

## Draft:
This week, The New York Times published an opinion piece about vibe coding.
Let that sink in.

A year ago, this was a niche thing that me and a handful of other people were obsessing over. Andrej Karpathy coined the term. A few thousand of us were in the trenches actually doing it. Most people had no idea what it was.
Now it has a Wikipedia page. The NYT is writing about it. A company called Code Metal just raised $10M to build infrastructure around it. Software companies are formally restructuring their entire engineering teams around it.

**This is the tipping point.**` },
];

export const TEAM: TeamMember[] = [
  { id: 'tm1', name: 'Henry', role: 'Chief of Staff', description: 'Coordinates, delegates, keeps the ship tight. The first point of contact between boss and machine.', tags: ['Orchestration', 'Clarity', 'Delegation'], avatar: '🦉' },
  { id: 'tm2', name: 'Charlie', role: 'Infrastructure Engineer', description: 'Infrastructure and automation specialist', tags: ['coding', 'infrastructure', 'automation'], avatar: '🤖' },
  { id: 'tm3', name: 'Ralph', role: 'Foreman / QA Manager', description: 'Checks the work, signs off or sends it back. No-nonsense quality control.', tags: ['Quality Assurance', 'Monitoring', 'Demo Recording'], avatar: '🔧' },
];
