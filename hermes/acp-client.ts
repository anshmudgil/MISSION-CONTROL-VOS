// Minimal ACP client for Hermes — no external dependencies
const BASE = process.env.MISSION_CONTROL_URL ?? 'http://localhost:3000';

export type ACPMessage = {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: string;
};

export type AgentRegistration = {
  id: string;
  name: string;
  model: string;
  status: 'active' | 'idle' | 'offline';
  lastHeartbeat: string;
};

export async function registerWithACP(): Promise<void> {
  const res = await fetch(`${BASE}/api/acp/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 'hermes',
      name: 'Hermes',
      model: 'claude-haiku-4-5-20251001',
      status: 'active',
    }),
  });
  if (!res.ok) throw new Error(`Registration failed: ${res.status} ${res.statusText}`);
  console.log('[Hermes] Registered with ACP registry');
}

export async function fetchPendingMessages(): Promise<ACPMessage[]> {
  const res = await fetch(`${BASE}/api/acp?to=hermes&limit=10`);
  if (!res.ok) return [];
  return res.json();
}

export async function sendMessage(to: string, content: string): Promise<void> {
  await fetch(`${BASE}/api/acp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: 'hermes', to, content }),
  });
}

export async function heartbeat(): Promise<void> {
  await fetch(`${BASE}/api/acp/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'hermes', status: 'active' }),
  }).catch(() => {});
}
