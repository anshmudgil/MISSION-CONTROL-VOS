# Mission Control VOS — CLAUDE.md

## Project Overview

An AI agent operating system dashboard ("Mission Control") built in React + Vite. Currently a Google AI Studio prototype with hardcoded mock data. The goal of this CLAUDE.md is to guide the refactor into a production app: real AI integration via the Vercel AI SDK, persistent state, and a proper Next.js 15+ App Router structure.

---

## Refactor Goals

1. **Migrate from Vite/SPA to Next.js 15 App Router** — drop client-side-only routing, gain SSR and server actions.
2. **Replace `@google/genai` with Vercel AI SDK** — use AI Gateway for provider-agnostic access to Gemini/Claude/GPT models.
3. **Wire real AI into the Council and AI Team views** — make the multi-agent chat and agent detail panels use actual streaming AI calls.
4. **Add persistence** — replace in-memory `useState` seed data with a real database (Neon Postgres via Vercel Marketplace).
5. **Keep the existing design system** — dark UI, zinc palette, blue accent, design tokens from `src/index.css`.

---

## Current Architecture (Prototype)

| Concern | Current | Target |
|---|---|---|
| Framework | Vite + React SPA | Next.js 15 App Router |
| Routing | `switch(activeSection)` in `App.tsx` | File-system routes under `app/` |
| AI SDK | `@google/genai` (unused) | Vercel AI SDK (`ai` + `@ai-sdk/react`) |
| AI Provider | Gemini (hardcoded) | AI Gateway (`google/gemini-2.5-pro`) |
| AI calls | None — all UI is static | `streamText` server route + `useChat` |
| State | Component-local `useState` | Neon Postgres + server actions |
| Data seeding | `src/data/initial.ts` constants | DB seed migration |
| Styling | Tailwind v4 `@theme` tokens | Same — carry over |
| Env vars | `GEMINI_API_KEY` via Vite | `VERCEL_OIDC_TOKEN` via `vercel env pull` |

---

## Migration Steps (ordered)

### Step 1 — Scaffold Next.js project

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"
```

- Remove the Vite-specific files: `vite.config.ts`, `index.html`, `metadata.json`
- Port `src/index.css` `@theme` tokens into `app/globals.css`
- Port `src/lib/utils.ts` (`cn()`) — already compatible
- Port all types from `src/types.ts` into `src/types.ts` (same path, no changes needed)

### Step 2 — Set up Vercel project and AI Gateway

```bash
vercel link
# Enable AI Gateway in the Vercel dashboard
vercel env pull   # provisions VERCEL_OIDC_TOKEN locally
```

Install:
```bash
npm install ai @ai-sdk/react
npm uninstall @google/genai
```

AI Gateway usage — always use model strings, never import provider SDKs directly:

```ts
import { streamText } from 'ai';

const result = streamText({
  model: 'google/gemini-2.5-pro',  // routed through AI Gateway automatically
  messages,
});
```

### Step 3 — Convert routes

Map each `SectionId` to a Next.js route:

| Old `activeSection` | New route |
|---|---|
| `dashboard` | `app/(dashboard)/page.tsx` |
| `tasks` | `app/(dashboard)/tasks/page.tsx` |
| `content-pipeline` | `app/(dashboard)/content-pipeline/page.tsx` |
| `ai-team` | `app/(dashboard)/ai-team/page.tsx` |
| `council` | `app/(dashboard)/council/page.tsx` |
| `calendar` | `app/(dashboard)/calendar/page.tsx` |
| `memory` | `app/(dashboard)/memory/page.tsx` |
| `contacts` | `app/(dashboard)/contacts/page.tsx` |
| `settings` | `app/(dashboard)/settings/page.tsx` |

The `Sidebar.tsx` and `TopBar.tsx` move into `app/(dashboard)/layout.tsx` as a shared layout.

### Step 4 — Wire AI into CouncilView

`CouncilView` is the priority AI integration — it's already a chat-room UI. Replace mock messages with real streaming:

**Server route** (`app/api/council/route.ts`):
```ts
import { streamText, convertToModelMessages } from 'ai';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  const result = streamText({
    model: 'google/gemini-2.5-pro',
    system: 'You are VELO, an AI operations coordinator managing a team of autonomous agents.',
    messages: convertToModelMessages(messages),
  });
  return result.toUIMessageStreamResponse();
}
```

**Client** (`CouncilView.tsx` → `'use client'`):
```tsx
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';

const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/council' }),
});
```

Render messages with AI Elements:
```bash
npx ai-elements@latest
```
Use `<Message>` for chat, `<MessageResponse>` for any AI-generated markdown.

### Step 5 — Persistence with Neon

Install via Vercel Marketplace (not directly):
```bash
vercel integration add neon
vercel env pull  # picks up DATABASE_URL
```

```bash
npm install @neondatabase/serverless
```

Create a migration for each data shape from `src/data/initial.ts`:
- `tasks` table (Task type)
- `calendar_events` table
- `projects` table
- `docs` table (for MemoryView)
- `contacts` table

Use server actions for mutations (drag-to-reorder, add comment, delete task). Do NOT use Route Handlers for in-app mutations — use `'use server'` actions.

---

## Coding Conventions

### General

- Default to **Server Components**. Add `'use client'` only when you need interactivity (dnd-kit, useChat, local state for modals).
- Push `'use client'` as far down the tree as possible — the view-level components can stay server-rendered if they just pass data to interactive leaf components.
- All request APIs are async in Next.js 15: `await cookies()`, `await headers()`, `await params`.
- Mutations go in server actions (`'use server'`), not Route Handlers, unless building a public API.

### AI SDK

- Always use AI Gateway model strings (`'google/gemini-2.5-pro'`, `'anthropic/claude-sonnet-4.6'`). Never import `@ai-sdk/anthropic` or `@ai-sdk/google` directly.
- Use `streamText` + `useChat` for all user-facing AI interactions. Never `generateText` for chat.
- Use `convertToModelMessages(messages)` server-side, `DefaultChatTransport` client-side.
- Use `toUIMessageStreamResponse()` (not `toDataStreamResponse()`).
- Never render AI text as raw `{message.parts}` or `<p>` tags — always use `<Message>` or `<MessageResponse>` from AI Elements. Iterate `message.parts` only if building fully custom rendering.
- Check current model IDs before writing code:
  ```bash
  curl -s https://ai-gateway.vercel.sh/v1/models | jq -r '[.data[] | select(.id | startswith("google/")) | .id] | reverse | .[]'
  ```

### Styling

- Carry over all `@theme` tokens from `src/index.css` verbatim — the design system is complete and correct.
- Dark mode only — no light mode toggle needed.
- Use `cn()` from `src/lib/utils.ts` (clsx + tailwind-merge).
- Zinc palette + blue-500 accent — do not introduce new colors.
- Use Geist Sans for interface text, Geist Mono for code/metrics/IDs. (Replace Inter/Roboto Mono from Google Fonts with `next/font/google` or `next/font/local`.)

### Component patterns

- `KanbanCard.tsx` and `KanbanColumn.tsx` are already isolated — keep them as `'use client'` components (dnd-kit requires browser APIs).
- The `MemoryView` inline editor is the most stateful component — keep it client-side, move the document fetch to a server component parent.
- Modal open/close state stays in client components; modal content data can be passed as props from server.

---

## What NOT to Change

- The visual design — layout, spacing, color, typography are intentional and complete.
- The `cn()` utility, types, and component composition patterns.
- The Kanban DnD architecture (`@dnd-kit/core` + sortable) — it works correctly.
- The nine-section navigation structure — just map 1:1 to file-system routes.

---

## Environment Variables

| Variable | Source | Purpose |
|---|---|---|
| `VERCEL_OIDC_TOKEN` | `vercel env pull` | AI Gateway auth (auto-provisioned) |
| `DATABASE_URL` | Neon via Marketplace | Postgres connection |

Do not use `GEMINI_API_KEY` or any provider-specific API key. AI Gateway handles auth.

---

## Key Files to Port First (Priority Order)

1. `src/types.ts` — no changes, just copy
2. `src/lib/utils.ts` — no changes, just copy
3. `src/index.css` → `app/globals.css` — copy `@theme` block
4. `src/components/Sidebar.tsx` → server component layout
5. `src/components/TopBar.tsx` → server component layout
6. `src/components/views/CouncilView.tsx` → first AI integration target
7. `src/components/views/TasksView.tsx` → most complex; port dnd-kit logic
8. `src/data/initial.ts` → DB seed file
