import { AgentRegistration } from '@/types';

// Shared in-memory agent registry — pre-seeded with known agents
export const agentRegistry: Map<string, AgentRegistration> = new Map([
  ['opencore', {
    id: 'opencore',
    name: 'OpenCore (VELO)',
    model: 'claude-sonnet-4-6',
    status: 'idle',
    lastHeartbeat: new Date().toISOString(),
  }],
  ['hermes', {
    id: 'hermes',
    name: 'Hermes',
    model: 'claude-haiku-4-5-20251001',
    status: 'offline',
    lastHeartbeat: new Date(0).toISOString(),
  }],
]);
