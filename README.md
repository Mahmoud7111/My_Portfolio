# Terminal Portfolio

A terminal-styled personal portfolio. React 18 + Vite, SCSS, react-router, framer-motion,
Groq AI chatbot, EmailJS contact form.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env`:
- `VITE_GROQ_API_KEY` — free key at https://console.groq.com/keys
- `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` — from https://dashboard.emailjs.com

```bash
npm run dev
```

## Where to put your real content

Everything personal lives in `src/data/`:
- `me.js` — name, bio, skills, experience, education, links (the single source of truth — also feeds the AI chatbot's system prompt)
- `projects.js` — your project gallery
- `unlockables.js` — visitor achievement definitions (edit names/descriptions if you want)
- `commands.js` — terminal command registry (add new commands here)


ASCII art lives in `src/components/ascii/art.js` — swap in your own banners any time.

## What's built so far

- Terminal window: traffic lights (close/minimize/maximize — all functional), tab navigation, live clock, command execution, `help`, `chat` mode (Groq-powered)
- Custom cursor: coral block + lagging cyan glow dot (disabled on touch)
- Sticky header: hides on scroll down, shows on scroll up / at top
- Pages: Home, Projects (filterable), About (timeline), Contact (EmailJS form), Achievements (visitor gamification via localStorage), 404

## Still to do

- Swap placeholder content in `data/` for your real info
- 3D model section (Google Model Viewer) — not yet added, original plan was an About-page or Home-page slot
- Visual QA pass against the design system (colors/spacing only — logic is done)
- Deploy to Vercel: push to GitHub, import the repo in Vercel, add the same env vars in the Vercel dashboard

## Deploy

Push to GitHub → import in Vercel → add the three env vars in Project Settings → Environment Variables → done.
