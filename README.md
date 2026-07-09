# Terminal Portfolio

A terminal-styled personal portfolio. React 18 + Vite, SCSS, react-router, framer-motion,
Groq AI chatbot (via a secure serverless proxy), EmailJS contact form.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `GROQ_API_KEY` — free key at https://console.groq.com/keys (server-side only; **do not** add a `VITE_` prefix, see `.env.example` for why)
- `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` — from https://dashboard.emailjs.com

### Local dev

```bash
vercel dev
```

You need `vercel dev` (not `npm run dev`) to actually run the `/api/chat.js`
serverless function locally — the plain Vite dev server only serves the frontend
and won't execute serverless API routes. (You'll be prompted to link the project
to Vercel the first time; that's normal.)

If you only want to work on the UI and can skip the chatbot, plain `npm run dev`
still works for everything else.

## Where to put your real content

Everything personal lives in `src/data/`:
- `me.js` — name, bio, skills, experience, education, links (the single source of truth — also feeds the AI chatbot's system prompt)
- `projects.js` — your project gallery
- `unlockables.js` — visitor achievement definitions (edit names/descriptions if you want)
- `commands.js` — terminal command registry (add new commands here)


ASCII art lives in `src/components/ascii/art.js` — swap in your own banners any time.

## What's built so far

- Terminal window: traffic lights (close/minimize/maximize — all functional), tab navigation, live clock, command execution, `help`, `chat` mode (Groq-powered through a serverless proxy)
- Custom cursor: coral block + lagging cyan glow dot (disabled on touch)
- Sticky header: hides on scroll down, shows on scroll up / at top
- Pages: Home, Projects (filterable), About (timeline), Contact (EmailJS form), Achievements (visitor gamification via localStorage), 404

## Still to do

- Swap placeholder content in `data/` for your real info
- 3D model section (Google Model Viewer) — not yet added, original plan was an About-page or Home-page slot
- Visual QA pass against the design system (colors/spacing only — logic is done)

## Deploy

Push to GitHub → import the repo in Vercel → in **Project Settings → Environment Variables** add `GROQ_API_KEY` and the three `VITE_EMAILJS_*` vars → done.

`GROQ_API_KEY` **must** be added in the Vercel dashboard — a local `.env` file is
not read by Vercel's serverless runtime at deploy time, only the dashboard env vars are.
