---
title: "feat: Migrate Mission Control VOS from Vite SPA to Next.js 15 App Router"
type: feat
status: active
date: 2026-04-01
origin: docs/brainstorms/2026-04-01-nextjs-migration-brainstorm.md
---

# ✨ feat: Migrate Mission Control VOS from Vite SPA to Next.js 15 App Router

## Overview

Port the existing Google AI Studio Vite + React SPA to Next.js 15 App Router, deployed on Vercel. This is a **framework foundation migration only** — AI integration (Vercel AI SDK) and database persistence (Neon Postgres) are explicitly deferred to follow-up phases. All 9 views must render correctly, the dark design system must be preserved exactly, and Kanban drag-and-drop must work with no functional regressions.

**Branch:** `feature/nextjs-migration`
**Deploy target:** Vercel

---

## Problem Statement

The current codebase is a Google AI Studio prototype scaffolded with Vite. It:
- Uses client-side-only `useState` routing (no URL changes on navigation)
- Cannot be deployed to Vercel in a way that enables AI Gateway, server actions, or Neon Postgres
- Has `@google/genai` installed but never used
- Has `express` installed but never used
- Uses `@tailwindcss/vite` (incompatible with Next.js PostCSS pipeline)
- Loads fonts via a CSS `@import` of Google Fonts (suboptimal — no font optimization)

The Next.js App Router gives us file-system routing, server components, server actions, and first-class Vercel integration — all prerequisites for the AI and persistence phases.

---

## Proposed Solution

Clean branch port: scaffold Next.js 15 over the existing project on a dedicated branch, port all 9 views to `app/(dashboard)/` routes, preserve the design system exactly, and deploy to Vercel.

(See brainstorm: docs/brainstorms/2026-04-01-nextjs-migration-brainstorm.md — decision: "Clean port on a dedicated branch")

---

## Technical Approach

### Architecture

**Route structure (target):**

```
app/
├── layout.tsx                    ← root layout (html, body, fonts)
├── page.tsx                      ← redirect to /dashboard
├── globals.css                   ← ported from src/index.css
└── (dashboard)/
    ├── layout.tsx                ← Sidebar + TopBar shell (server)
    ├── page.tsx                  ← DashboardView (server)
    ├── tasks/page.tsx            ← TasksView (client, dynamic no-ssr)
    ├── content-pipeline/page.tsx ← ContentPipelineView (client, dynamic no-ssr)
    ├── ai-team/page.tsx          ← AITeamView (mixed)
    ├── council/page.tsx          ← CouncilView (client)
    ├── calendar/page.tsx         ← CalendarView (mixed)
    ├── memory/page.tsx           ← MemoryView (client)
    ├── contacts/page.tsx         ← ContactsView (mixed)
    └── settings/page.tsx         ← SettingsView (client)

src/
├── types.ts                      ← unchanged from original
├── lib/utils.ts                  ← unchanged from original
├── data/initial.ts               ← unchanged from original (in-memory mock data)
└── components/
    ├── Sidebar.tsx               ← server component, uses next/link
    ├── TopBar.tsx                ← server component
    └── views/                   ← ported components (see component table)
```

### Critical Technical Gotchas

#### 1. Tailwind v4 + Next.js requires PostCSS adapter

Next.js does not support `@tailwindcss/vite`. Must use:

```bash
npm install @tailwindcss/postcss
```

```js
// postcss.config.mjs
export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
```

The `@theme {}` block in `globals.css` stays unchanged — only the PostCSS plugin changes.

#### 2. Path alias reconfiguration

Current: `@/` → `.` (project root, via both vite.config.ts and tsconfig.json)  
Target: `@/` → `./src` (Next.js convention from `create-next-app --src-dir`)

All existing imports use patterns like `@/src/components/Foo` or `../lib/utils`.  
After migration, relative imports remain unchanged. New imports use `@/` → `./src`.

In `tsconfig.json`:
```json
"paths": { "@/*": ["./src/*"] }
```

In `next.config.ts` (no extra config needed — Next.js auto-reads tsconfig paths).

#### 3. dnd-kit hydration — use dynamic import with ssr: false

dnd-kit uses browser APIs (`PointerEvent`, `ResizeObserver`, etc.) and `DragOverlay` renders into a portal. Server-rendering these components causes hydration mismatches. The safest approach is:

```tsx
// app/(dashboard)/tasks/page.tsx
import dynamic from 'next/dynamic';

const TasksView = dynamic(() => import('@/components/views/TasksView'), {
  ssr: false,
  loading: () => <div className="flex-1 flex items-center justify-center text-text-muted">Loading...</div>,
});

export default function TasksPage() {
  return <TasksView />;
}
```

Apply the same pattern to `ContentPipelineView`.

#### 4. Font migration — next/font/google

Remove the `@import "https://fonts.googleapis.com/..."` from `globals.css`.  
In `app/layout.tsx`:

```tsx
import { Inter, Roboto_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' });
```

Apply both variables to the `<html>` element. The `@theme` CSS vars (`--font-sans`, `--font-mono`) remain unchanged in `globals.css` — they just need to be populated by Next.js at runtime.

#### 5. `motion` (Framer Motion v12) — requires 'use client'

Any component using `motion.*` must have `'use client'`. Audit all views for motion usage. Wrap animated leaf components in `'use client'` if they're currently server components.

#### 6. Remove unused dependencies

- `@google/genai` — remove (replaced by AI SDK in future phase)
- `express` + `@types/express` — remove (vestigial, never used)
- `dotenv` — remove (Next.js loads `.env.local` natively)
- `@vitejs/plugin-react`, `vite`, `@tailwindcss/vite` — remove

Add:
- `next` (latest stable, ~15.x)
- `@tailwindcss/postcss`

#### 7. `GEMINI_API_KEY` env var handling

Vite injected this via `define` in `vite.config.ts`. No source file currently uses it. In Next.js, if needed later: prefix with `NEXT_PUBLIC_` for client access. For now, simply remove the Vite `define` — no code references it.

---

### Component Migration Table

| Component | Next.js pattern | Notes |
|---|---|---|
| `Sidebar.tsx` | Server component | Replace `onClick` nav → `<Link href="/tasks">`. Active route via `usePathname()` in a `'use client'` wrapper. |
| `TopBar.tsx` | Server component | Purely presentational, no changes needed. |
| `DashboardView.tsx` | Server component | Static metrics and activity feed. No changes. |
| `TasksView.tsx` | `'use client'` + `dynamic({ssr:false})` | dnd-kit requires browser. All local state stays. |
| `ContentPipelineView.tsx` | `'use client'` + `dynamic({ssr:false})` | Same as TasksView. |
| `KanbanCard.tsx` | `'use client'` | Used by both Kanban views — inherits client context. |
| `KanbanColumn.tsx` | `'use client'` | Same. |
| `AITeamView.tsx` | Mixed | Static agent cards → server. Detail panel toggle → client leaf. |
| `CouncilView.tsx` | `'use client'` | Input state. Placeholder for future AI integration. |
| `CalendarView.tsx` | Mixed | Calendar grid → server. Event detail modal → client leaf. |
| `MemoryView.tsx` | `'use client'` | Full client — search state, filter/sort, inline editor all require browser state. |
| `ContactsView.tsx` | Mixed | Contact cards → server parent, search/filter → client leaf. |
| `SettingsView.tsx` | `'use client'` | Sliders and toggles require browser state. |

---

### Sidebar Active State

The current Sidebar uses a prop `activeSection` from App.tsx's `useState`. In Next.js, active state comes from the URL. The cleanest approach:

```tsx
// src/components/SidebarNav.tsx  ← new 'use client' leaf
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  // render links with active styles based on pathname
}
```

Keep `Sidebar.tsx` as a server component — it imports `SidebarNav` (client) for the link list.

---

## Implementation Phases

### Phase 1: Scaffold and Infrastructure

**Goal:** Next.js project scaffold is running locally with correct Tailwind setup.

- [ ] Create branch: `git checkout -b feature/nextjs-migration`
- [ ] Scaffold Next.js: `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint`
  - This overwrites `package.json`, `tsconfig.json` — review diff before accepting
- [ ] Remove Vite artifacts: `vite.config.ts`, `index.html`, `metadata.json`
- [ ] Remove unused packages: `@google/genai`, `express`, `@types/express`, `dotenv`, `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`
- [ ] Add missing packages: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`, `motion`, `date-fns`, `clsx`, `tailwind-merge`, `lucide-react`
- [ ] Verify Tailwind v4: confirm `@tailwindcss/postcss` is installed and `postcss.config.mjs` is correct
- [ ] Port `@theme` tokens from `src/index.css` → `app/globals.css` (full `@theme {}` block, custom scrollbar styles)
- [ ] Port `src/lib/utils.ts` — no changes needed
- [ ] Port `src/types.ts` — no changes needed
- [ ] Port `src/data/initial.ts` — no changes needed
- [ ] Configure `next/font/google` in `app/layout.tsx` (Inter + Roboto Mono with CSS variable names)
- [ ] Verify `npm run dev` starts without errors and globals.css theme tokens load
- [ ] **Files to create:** `app/layout.tsx`, `app/globals.css`, `postcss.config.mjs`, `next.config.ts`
- [ ] **Files to delete:** `vite.config.ts`, `index.html`, `metadata.json`, `src/main.tsx`, `src/App.tsx`

### Phase 2: Layout Shell

**Goal:** App shell (Sidebar + TopBar) renders at all routes.

- [ ] Create `app/(dashboard)/layout.tsx` — imports `Sidebar` and `TopBar` as server components, wraps `{children}` in the same `flex h-screen` structure from `App.tsx`
- [ ] Port `src/components/Sidebar.tsx` to server component
- [ ] Create `src/components/SidebarNav.tsx` as `'use client'` — handles `usePathname()` active link detection, renders `<Link>` elements
- [ ] Port `src/components/TopBar.tsx` to server component — no changes needed beyond removing the prop interface
- [ ] Create `app/(dashboard)/page.tsx` as a placeholder (renders "Dashboard" text) to verify layout works
- [ ] Create `app/page.tsx` that redirects to `/` (or serves as default) — or just redirect to `/dashboard` if needed
- [ ] Verify layout renders correctly at `localhost:3000`

### Phase 3: Port Server Components Views

**Goal:** Static/mostly-server views are working routes.

- [ ] `app/(dashboard)/page.tsx` → port `DashboardView` as a server component page
- [ ] `app/(dashboard)/ai-team/page.tsx` → port `AITeamView` (server parent + client detail panel)
- [ ] `app/(dashboard)/calendar/page.tsx` → port `CalendarView` (server grid + client modal leaf)
- [ ] `app/(dashboard)/contacts/page.tsx` → port `ContactsView` (server cards + client search leaf)
- [ ] Verify all 4 routes render correctly with dark theme

### Phase 4: Port Client Component Views

**Goal:** All interactive/stateful views work.

- [ ] `app/(dashboard)/tasks/page.tsx` → `dynamic(() => import TasksView, {ssr: false})`
- [ ] `app/(dashboard)/content-pipeline/page.tsx` → same pattern for `ContentPipelineView`
- [ ] `app/(dashboard)/council/page.tsx` → port `CouncilView` with `'use client'`
- [ ] `app/(dashboard)/memory/page.tsx` → port `MemoryView` with `'use client'`
- [ ] `app/(dashboard)/settings/page.tsx` → port `SettingsView` with `'use client'`
- [ ] Verify dnd-kit drag-and-drop works correctly in both Kanban views
- [ ] Verify MemoryView search, filter, sort, and inline editor work
- [ ] Verify CouncilView text input works

### Phase 5: Polish and Deploy

**Goal:** All 9 routes working, app deploys successfully to Vercel.

- [ ] Audit `motion` usage — ensure all components using `motion.*` have `'use client'`
- [ ] Audit all imports — verify `@/` alias works correctly (`@/` → `./src`)
- [ ] Update page `<title>` — remove "My Google AI Studio App" placeholder
- [ ] Add basic metadata in `app/layout.tsx` (`title`, `description`)
- [ ] Run `npm run build` locally — fix any TypeScript or build errors
- [ ] Run `vercel link` (or create project in Vercel dashboard)
- [ ] Push branch to GitHub, open PR
- [ ] Verify Vercel preview deployment — all 9 routes accessible
- [ ] Confirm dark theme renders correctly on Vercel (not just locally)
- [ ] Merge to `main`

---

## Alternative Approaches Considered

(See brainstorm: docs/brainstorms/2026-04-01-nextjs-migration-brainstorm.md)

| Approach | Why Rejected |
|---|---|
| **Parallel project** (new Next.js app in sibling folder) | Overkill for a 1,500-line codebase. Managing two directories adds friction without adding safety for this size. |
| **In-place on main** | No rollback path if the migration breaks something mid-way. |
| **Incremental adapter** (Next.js wrapper around Vite SPA) | Creates technical debt and defers the problem. Routing will still be broken in the adapter phase. |

---

## System-Wide Impact

### Interaction Graph

- Sidebar `<Link>` → Next.js router → `app/(dashboard)/[route]/page.tsx` renders
- Route renders view component → view reads from `src/data/initial.ts` (in-memory)
- dnd-kit DnD events → `handleDragOver` / `handleDragEnd` in TasksView → local `useState` update → re-render
- MemoryView editor changes → local `useState` → debounced "save" to local state (no persistence)

### Error & Failure Propagation

- **Hydration mismatch**: If a dnd-kit component is server-rendered, React will throw a hydration error. Mitigation: `dynamic({ssr:false})` on all dnd-kit views.
- **Missing `'use client'`**: If a component using `useState`, `useEffect`, or browser APIs lacks the directive, Next.js will throw at build time with a clear error. Mitigation: the component table above.
- **Font CSS variable mismatch**: If `next/font/google` variable names don't match the `@theme` `--font-sans` / `--font-mono` tokens, fonts will fall back to system fonts silently. Mitigation: use `variable: '--font-sans'` in the font configuration.

### State Lifecycle Risks

All state is component-local `useState`. No persistence, no global store. Migrating to Next.js has no impact on state lifecycle — state resets on navigation (same as before, since the SPA also re-mounts on section change). This is acceptable for this phase.

### API Surface Parity

No public API exists yet. The only "API" is the in-memory initial data — which is unchanged.

### Integration Test Scenarios

1. Navigate Sidebar → all 9 routes render without white screen
2. Drag a task card across columns in TasksView → card moves, state persists within session
3. Open and close a task detail modal → modal renders correctly, closes on click-outside
4. MemoryView: search for a document title → results filter correctly
5. Hard-refresh any route (e.g. `/tasks`) → page loads correctly (not 404)

---

## Acceptance Criteria

### Functional
- [ ] All 9 routes (`/`, `/tasks`, `/content-pipeline`, `/ai-team`, `/council`, `/calendar`, `/memory`, `/contacts`, `/settings`) render without console errors
- [ ] Sidebar shows correct active state based on current URL
- [ ] Kanban drag-and-drop works in both TasksView and ContentPipelineView
- [ ] MemoryView search, filter, sort, and inline editor are functional
- [ ] CouncilView text input accepts and displays user text
- [ ] All modals (task detail, calendar event, AI team panel) open and close correctly
- [ ] Hard-refreshing any route serves the correct page (no 404)

### Visual
- [ ] Dark theme matches the original exactly (zinc palette, blue accent)
- [ ] Fonts render correctly (Inter for UI text, Roboto Mono for code/metrics)
- [ ] Custom scrollbar styles are applied
- [ ] No layout shifts or flash of unstyled content on page load

### Build & Deploy
- [ ] `npm run build` completes with 0 errors and 0 TypeScript errors
- [ ] App deploys successfully to Vercel preview URL
- [ ] All 9 routes accessible on Vercel (not just the root)

### Quality
- [ ] No `@google/genai`, `express`, `dotenv`, `vite` in dependencies
- [ ] No `'use client'` on components that don't need it (Sidebar, TopBar, DashboardView)
- [ ] dnd-kit components use `dynamic({ssr:false})` pattern

---

## Dependencies & Prerequisites

- Node.js 20+ (Next.js 15 requirement)
- `vercel` CLI installed (`npm i -g vercel@latest`) — needed for deploy step
- Vercel account with a project linked

---

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Tailwind v4 + PostCSS breaks `@theme` tokens | Low | High | Test locally before deploy; the PostCSS adapter is the official Tailwind v4 path |
| dnd-kit hydration mismatch | Medium | High | `dynamic({ssr:false})` on all dnd-kit views — eliminates the issue entirely |
| `motion` animations break in client components | Low | Medium | Audit motion usage; all animated components get `'use client'` |
| `@/` alias breakage after reconfiguration | Low | Medium | Next.js auto-reads `tsconfig.json` paths; verify with `npm run build` after setup |
| Vercel deployment fails on first try | Low | Low | Use preview URL on branch; main is unaffected |

---

## Sources & References

### Origin

- **Brainstorm document:** [docs/brainstorms/2026-04-01-nextjs-migration-brainstorm.md](../brainstorms/2026-04-01-nextjs-migration-brainstorm.md)
  - Key decisions carried forward: branch-based port, framework-only scope, Vercel deployment, preserve design exactly

### Internal References

- Current routing logic: `src/App.tsx` (switch-based SPA navigation to replace)
- Design tokens: `src/index.css` (full `@theme` block to port)
- dnd-kit setup: `src/components/views/TasksView.tsx` (sensor config and multi-column logic)
- Path alias config: `tsconfig.json` and `vite.config.ts`
- Component types: `src/types.ts`
- Migration guide: `CLAUDE.md`

### External References

- Next.js 15 App Router docs: https://nextjs.org/docs/app
- Tailwind v4 PostCSS adapter: https://tailwindcss.com/docs/installation/postcss
- next/font/google: https://nextjs.org/docs/app/api-reference/components/font
- dnd-kit with Next.js: use `dynamic({ssr:false})` pattern documented in dnd-kit issues
