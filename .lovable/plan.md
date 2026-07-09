# AI Workplace Productivity Assistant

A modern SaaS-style dashboard with three AI tools powered by Lovable AI (no sign-in, no server-side data storage of user content).

## Design System

- **Palette:** Deep black (`#0A0A0F`) surfaces, electric blue (`#2563EB` / `#3B82F6`) accents, subtle blue glow gradients, white/muted foreground text.
- **Sidebar:** Blue-tinted dark surface with active-route glow.
- **Typography:** Inter (body) + Space Grotesk (headings) via `<link>` in root head.
- **Components:** shadcn primitives customized via semantic tokens in `src/styles.css` (no hardcoded colors in components).

## Routes (TanStack Start)

```
/                      Dashboard (overview cards, quick actions, reviews)
/email-generator       Smart Email Generator
/meeting-summarizer    Meeting Notes Summarizer
/chatbot               AI Chatbot Assistant
/reviews               User reviews & satisfaction (also embedded on dashboard)
```

Shared layout in `__root.tsx`: `SidebarProvider` + `AppSidebar` + main content. Each route gets its own `head()` metadata.

## Features

### 1. Smart Email Generator (`/email-generator`)
- Structured inputs: Recipient, Subject/Purpose, Key points, **Tone** (Formal / Friendly / Persuasive), Length.
- Generates email via Lovable AI, always appends signature **"U. Dunywa"**.
- Output rendered in an **editable textarea**; Copy + Regenerate buttons.

### 2. Meeting Notes Summarizer (`/meeting-summarizer`)
- Textarea for pasting raw meeting notes.
- Returns structured output: **Summary**, **Action Items** (with owner if mentioned), **Decisions**, **Deadlines**.
- Uses AI SDK `Output` with a zod schema for reliable structure.
- **Toast notification** ("Summary ready") on completion via `sonner`.
- Each section is editable inline; Copy-all button.

### 3. AI Chatbot (`/chatbot`)
- Built on AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`).
- One conversation, **no persistence** — history lives only in component state; "New chat" clears it.
- System prompt instructs strict, workplace-focused answers and to **cite references/sources** at the end of each response (or state "No external source — general knowledge").
- Streaming responses via `/api/chat` server route.

### 4. Dashboard (`/`)
- Hero header + 3 feature cards linking to each tool.
- **User Reviews** section: star rating + comment form (localStorage only, in-browser), average score, list of recent reviews. Clearly labeled as browser-local.
- Responsible AI disclaimer banner (footer of every page).

## Technical Details

- **AI backend:** Lovable AI Gateway via `createLovableAiGatewayProvider` (server-only helper in `src/lib/ai-gateway.server.ts`).
- **Model:** `openai/gpt-5.5` for chat + email + summarizer.
- **Server functions:** `src/lib/email.functions.ts` (`generateEmail`), `src/lib/summarize.functions.ts` (`summarizeNotes`). Chat uses streaming server route `src/routes/api/chat.ts`.
- **No storage:** No Lovable Cloud, no database, no auth. Reviews stored in browser `localStorage` only (clearly labeled; nothing sent to server).
- **Responsive:** Sidebar collapses to icon strip on mobile; grid layouts use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` patterns; `min-w-0` + `truncate` on text rows.
- **Responsible AI disclaimer:** Persistent footer note — "AI outputs may be inaccurate. Review before use. No data is stored on our servers."

## File Plan

- `src/styles.css` — add black/blue tokens, sidebar tokens, gradient + glow utilities.
- `src/routes/__root.tsx` — real title/description/OG, load fonts, wrap in `SidebarProvider`, sidebar + main + disclaimer footer.
- `src/components/app-sidebar.tsx` — blue sidebar with 4 nav items + logo.
- `src/components/responsible-ai-disclaimer.tsx`
- `src/components/reviews-widget.tsx` — localStorage reviews.
- `src/routes/index.tsx` — dashboard.
- `src/routes/email-generator.tsx`
- `src/routes/meeting-summarizer.tsx`
- `src/routes/chatbot.tsx` (uses AI Elements — install via `bunx ai-elements@latest add conversation message prompt-input shimmer`).
- `src/routes/reviews.tsx`
- `src/routes/api/chat.ts` — streaming chat handler.
- `src/lib/ai-gateway.server.ts` — provider helper.
- `src/lib/email.functions.ts`, `src/lib/summarize.functions.ts` — server functions.

## Out of Scope

- No sign-in, no user accounts, no server persistence of prompts/outputs.
- No email sending (generator only drafts text).
