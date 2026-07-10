# AI Workplace Productivity Assistant

A modern, responsive web application that helps professionals automate everyday workplace tasks with AI. The app is intentionally built without user accounts, sign-in, or server-side data storage — your inputs and generated outputs stay in your browser unless you choose to submit them.

## Features Implemented

### 1. Smart Email Generator
- Compose professional emails from structured inputs: recipient, purpose, key points, tone, and length.
- Supports multiple tones: **Formal**, **Friendly**, and **Persuasive**.
- Generated email is shown in an editable textarea so you can refine it before copying.
- Copy and regenerate actions for quick iteration.

### 2. Meeting Notes Summarizer
- Paste lengthy meeting notes and receive a structured summary.
- Extracts **summary**, **action items** (with owners when mentioned), **decisions**, and **deadlines**.
- Uses a structured AI output schema for reliable, repeatable results.
- Toast notification when the summary is ready.
- Each output section is editable, with a copy-all option.

### 3. AI Chatbot Assistant
- Conversational AI interface for workplace productivity questions.
- Streaming responses via a server route.
- Strictly workplace-focused answers with reference citations when applicable.
- One-time conversation — no persistence. Use "New chat" to clear the thread.

### 4. Dashboard & Reviews
- Hero dashboard with quick-access cards for every tool.
- **User Reviews** widget for in-app satisfaction feedback: star rating + comment.
- Reviews are stored **only in browser localStorage** (clearly labeled, never sent to a server).
- Displays average rating and recent submissions.
- Persistent **Responsible AI disclaimer** banner on every page.

## Design

- Dark, modern SaaS aesthetic with a deep black (`#0A0A0F`) base and electric blue (`#2563EB`) accents.
- Blue sidebar navigation that collapses to an icon strip on mobile.
- Fully responsive layout built for desktop, tablet, and mobile screens.
- Typography: **Inter** for body text and **Space Grotesk** for headings.

## Technologies and Tools Used

- **Framework:** [TanStack Start](https://tanstack.com/start) — full-stack React framework with file-based routing
- **Build Tool:** Vite 8
- **UI Library:** React 19
- **Styling:** Tailwind CSS v4 with custom semantic design tokens
- **Components:** shadcn/ui primitives (Radix UI + Tailwind)
- **Icons:** Lucide React
- **AI SDK:** Vercel AI SDK (`ai`, `@ai-sdk/react`, `@ai-sdk/openai-compatible`)
- **AI Backend:** Lovable AI Gateway (`openai/gpt-5.5`)
- **Server Functions:** TanStack `createServerFn`
- **Validation:** Zod
- **Notifications:** Sonner
- **Language:** TypeScript (strict mode)
- **Package Manager:** Bun

## Setup Instructions

### Prerequisites

- [Bun](https://bun.sh/) installed on your machine
- A Lovable AI API key (`LOVABLE_API_KEY`) available in your environment

### 1. Install dependencies

```bash
bun install
```

### 2. Configure environment variables

Create a `.env` file in the project root and add your Lovable API key:

```env
LOVABLE_API_KEY=your_lovable_api_key_here
```

> The app reads `LOVABLE_API_KEY` server-side only. It is never exposed to the browser.

### 3. Start the development server

```bash
bun dev
```

The app will be available at `http://localhost:8080`.

### 4. Build for production

```bash
bun run build
```

To preview the production build locally:

```bash
bun run preview
```

### Optional scripts

- `bun run lint` — run ESLint
- `bun run format` — format code with Prettier

## Responsible AI Notice

AI outputs may be inaccurate or incomplete. Always review generated content before using it. The application does not store user data or credentials on its servers; generated content and reviews remain in your browser unless you explicitly copy or share them yourself.

## License

Private — for demonstration and personal use.
