# Brainstorm: Next.js Migration

**Date:** 2026-04-01
**Status:** Ready for planning

---

## What We're Building

A full migration of Mission Control VOS from a Vite + React SPA (Google AI Studio prototype) to a Next.js 15 App Router application deployed on Vercel. This is a framework foundation migration — AI integration (Vercel AI SDK) and database persistence (Neon Postgres) are explicitly out of scope and will follow in subsequent work.

**Success looks like:** All 9 views render correctly in Next.js, the dark design system is preserved exactly, the app deploys to Vercel, and Kanban drag-and-drop works — with no functional regressions.

---

## Why This Approach

**Clean port on a dedicated branch** (`feature/nextjs-migration`).

The codebase is small (~15 components, ~1,500 lines of source code) and the existing design system is already complete. A clean branch port is faster and less risky than an in-place migration on `main`, and simpler than maintaining a parallel project directory. If the port breaks something, `main` is always the safe fallback.

---

## Scope

**In scope:**
- Scaffold Next.js 15 App Router (TypeScript, Tailwind v4, `src/` dir, `@/*` alias)
- Remove Vite artifacts (`vite.config.ts`, `index.html`, `metadata.json`)
- Port `@theme` tokens and global styles from `src/index.css` → `app/globals.css`
- Port shared utilities: `src/lib/utils.ts` (unchanged), `src/types.ts` (unchanged)
- Create `app/(dashboard)/layout.tsx` with `Sidebar` + `TopBar` as server components
- Create one route per section under `app/(dashboard)/`:
  - `page.tsx` (dashboard), `tasks/`, `content-pipeline/`, `ai-team/`, `council/`, `calendar/`, `memory/`, `contacts/`, `settings/`
- Mark client components with `'use client'` (dnd-kit views, CouncilView input, MemoryView editor)
- Port `src/data/initial.ts` as-is — mock data stays in-memory for now
- Replace `next/font/google` for Inter + Roboto Mono (drop Google Fonts CDN link)
- Deploy to Vercel and confirm all routes work

**Out of scope (follow-up work):**
- Vercel AI SDK / real AI in Council
- Neon Postgres / data persistence
- Server actions for mutations (tasks, comments, docs)
- Any redesign or visual changes

---

## Key Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 App Router | File-system routing, SSR, server actions ready for future AI/DB work |
| Port strategy | Branch-based clean port | Small codebase, safe rollback, no in-place mess |
| Deployment target | Vercel | AI Gateway + Neon Marketplace needed for later phases |
| Design system | Preserve exactly | Design is done; focus is on functionality |
| Mock data | Keep in-memory | Persistence is a separate phase |
| `'use client'` placement | Leaf components only | Default to Server Components per Next.js 15 best practices |
| dnd-kit components | Stay client-side | Browser APIs required; no change needed |
| Font loading | `next/font/google` | Drop CDN link, use Next.js font optimization |

---

## Component-by-Component Plan

| Component | Server or Client? | Notes |
|---|---|---|
| `Sidebar.tsx` | Server | No interactivity; use `<Link>` from `next/link` |
| `TopBar.tsx` | Server | Static header |
| `DashboardView.tsx` | Server | Hardcoded metrics + activity feed |
| `TasksView.tsx` | **Client** | dnd-kit requires browser APIs |
| `ContentPipelineView.tsx` | **Client** | dnd-kit |
| `KanbanCard.tsx` | **Client** | Sortable drag primitive |
| `KanbanColumn.tsx` | **Client** | Droppable container |
| `AITeamView.tsx` | Mixed | Static cards (server) + detail side panel toggle (client leaf) |
| `CouncilView.tsx` | **Client** | Input state; will become real chat later |
| `CalendarView.tsx` | Mixed | Grid (server) + modal toggle (client leaf) |
| `MemoryView.tsx` | **Client** | Search state, inline editor, filter/sort all need browser state |
| `ContactsView.tsx` | Mixed | Grid (server) + search/filter (client leaf) |
| `SettingsView.tsx` | **Client** | Slider + toggle state |

---

## Resolved Questions

- **Deployment target**: Vercel — confirmed.
- **Migration approach**: Clean branch port — confirmed.
- **Design changes**: None — preserve exactly.
- **AI + persistence timing**: Follow-up phases, not this migration.

---

## Open Questions

_(none — all key decisions are resolved)_

---

## Next Step

Run `/ce:plan docs/brainstorms/2026-04-01-nextjs-migration-brainstorm.md` to generate a step-by-step implementation plan.
