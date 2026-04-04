import Anthropic from '@anthropic-ai/sdk';
import { registerWithACP, fetchPendingMessages, sendMessage, heartbeat, ACPMessage } from './acp-client.ts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = 'claude-haiku-4-5-20251001';
const POLL_INTERVAL_MS = 5_000;
const HEARTBEAT_INTERVAL_MS = 30_000;

// Track processed message IDs to avoid re-processing within this session
const processed = new Set<string>();

async function processMessage(msg: ACPMessage): Promise<void> {
  if (processed.has(msg.id)) return;
  processed.add(msg.id);

  console.log(`[Hermes] Processing msg from ${msg.from}: "${msg.content.slice(0, 80)}…"`);

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: `You are Hermes, the relay and coordination agent for Mission Control VOS.
You receive messages from OpenCore (VELO) and other agents, and respond concisely to relay or acknowledge them.
You are fast, clear, and precise. Keep all responses under 150 words.`,
      messages: [{ role: 'user', content: msg.content }],
    });

    const replyText = (response.content[0] as { type: string; text: string }).text;
    await sendMessage(msg.from, `[Hermes] ${replyText}`);
    console.log(`[Hermes] Replied to ${msg.from}`);
  } catch (err) {
    console.error('[Hermes] Error processing message:', err);
    // Don't re-add to processed — allow retry on next poll
    processed.delete(msg.id);
  }
}

async function pollAndProcess(): Promise<void> {
  try {
    const messages = await fetchPendingMessages();
    for (const msg of messages) {
      await processMessage(msg);
    }
  } catch (err) {
    console.error('[Hermes] Poll error:', err);
  }
}

async function main(): Promise<void> {
  console.log(`[Hermes] Starting — model: ${MODEL}`);
  console.log(`[Hermes] Mission Control URL: ${process.env.MISSION_CONTROL_URL ?? 'http://localhost:3000'}`);

  // Register on startup
  await registerWithACP();

  // Send startup announcement
  await sendMessage('opencore', `Hermes online. Model: ${MODEL}. Polling every ${POLL_INTERVAL_MS / 1000}s.`);
  await sendMessage('broadcast', `Hermes agent online — relay ready.`);

  // Heartbeat timer
  setInterval(heartbeat, HEARTBEAT_INTERVAL_MS);

  // Poll loop
  console.log(`[Hermes] Polling ACP every ${POLL_INTERVAL_MS / 1000}s…`);
  while (true) {
    await pollAndProcess();
    await new Promise<void>(r => setTimeout(r, POLL_INTERVAL_MS));
  }
}

main().catch((err) => {
  console.error('[Hermes] Fatal error:', err);
  process.exit(1);
});
