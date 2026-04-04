import { ACPMessage, AgentRegistration } from '@/types';

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export async function sendACPMessage(
  from: string,
  to: string,
  content: string,
  metadata?: Record<string, string>
): Promise<ACPMessage> {
  const res = await fetch(`${BASE}/api/acp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, content, metadata }),
  });
  if (!res.ok) throw new Error(`ACP send failed: ${res.statusText}`);
  return res.json();
}

export async function fetchACPMessages(agentId: string, limit = 20): Promise<ACPMessage[]> {
  const res = await fetch(`${BASE}/api/acp?to=${agentId}&limit=${limit}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`ACP fetch failed: ${res.statusText}`);
  return res.json();
}

export async function registerAgent(agent: Partial<AgentRegistration> & { id: string }): Promise<AgentRegistration> {
  const res = await fetch(`${BASE}/api/acp/agents`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(agent),
  });
  if (!res.ok) throw new Error(`Agent register failed: ${res.statusText}`);
  return res.json();
}

export async function fetchAgents(): Promise<AgentRegistration[]> {
  const res = await fetch(`${BASE}/api/acp/agents`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Agents fetch failed: ${res.statusText}`);
  return res.json();
}
