# 🖥️ portfolio@Mahmoud

> An interactive, terminal-style personal portfolio styled as a macOS / tmux
> shell. Type real commands, talk to an AI that knows me, unlock 22 hidden
> achievements, and orbit a 3D PC rig — all in the browser. 🚀

Built by **Mahmoud Sayed** — Software & AI Engineer, Cairo.

🔗 **Live:** deployed via Vercel · 💻 **GitHub:** [Mahmoud7111/My_Portfolio](https://github.com/Mahmoud7111/My_Portfolio)

---

## ✨ Highlights

- ⌨️ **Interactive terminal** — type commands, hit `Tab` to autocomplete, run
  `help` for the full list. Real traffic-light window controls (close,
  minimize-to-dock, maximize) animated with Framer Motion springs.
- 🤖 **AI assistant (`7oka`)** — chat with an LLM that has my full CV in its
  system prompt. Powered by Groq (`llama-3.3-70b-versatile`) through a
  serverless proxy; the API key never reaches the browser.
- 🧊 **3D scene** — an interactive PC / desk setup rendered with
  `@react-three/fiber`, lazy-loaded with an `IntersectionObserver` and
  fully paused when off-screen or backgrounded (zero CPU/GPU cost).
- 🏆 **22 unlockable achievements** — visitor gamification persisted in
  `localStorage`. Rarities (common / rare / legendary), toast popups,
  progress bar, filter pills, plus hidden easter eggs (Konami code,
  greetings, minimize rabbit hole, DevTools inspector, night-owl, …).
- 📧 **EmailJS contact form** — client-side validation, honeypot
  anti-spam, success + auto-reply templates, and a spam-folder hint.
- 🖱️ **Custom cursor** — coral block + lagging cyan glow dot, auto-disabled
  on touch devices.
- 🎬 **Boot + AI overlays** — a `Hello World` boot sequence on first load,
  and cinematic activation / deactivation overlays when entering /
  leaving chat mode (pure CSS keyframes, no per-frame JS).
- ⊞ **Powerline footer** — segment-style status bar with mode, path, and
  keyboard hints that swap between normal and AI-shell modes.

## 🧰 Tech stack

| Area | Libraries |
|------|-----------|
| Framework | React 19, Vite 8 |
| Routing | react-router-dom 7 |
| Animation | framer-motion 12 |
| 3D | three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing |
| Styling | SCSS (CSS variables, no Tailwind) |
| AI | Groq API via a Vercel serverless function (`api/chat.js`) |
| Email | @emailjs/browser |
| Icons | lucide-react |
| Lint | oxlint |

## 🗂️ Project structure

```
portfolio/
├─ api/
│  └─ chat.js                # Vercel serverless function — Groq proxy
├─ public/
│  ├─ images/                # project screenshots
│  └─ My_Resume2.pdf
├─ src/
│  ├─ components/
│  │  ├─ 3d/                 # PCModel, LazyPCModel (pause-when-offscreen)
│  │  ├─ ascii/              # centralized ASCII art (ART.HERO, ART.STACK, …)
│  │  ├─ commands/           # one component per terminal command
│  │  ├─ layout/             # Header, Footer
│  │  ├─ terminal/           # TerminalWindow, HelloWorldScreen, closed screen
│  │  └─ ui/                 # ChatFAB, AchievementToast, CustomCursor, typewriter…
│  ├─ data/                  # me.js, projects.js, journey.js, unlockables.js, stats.js, commands.js
│  ├─ hooks/                 # useTerminal, useChat, useAchievements, useEasterEggs…
│  ├─ pages/                 # Home, Projects, About, Contact, Achievements (+ Content wrappers)
│  └─ styles/                # main.scss + pages/ + partials (_terminal, _cursor, _toast, _ai-mode…)
├─ vercel.json               # SPA rewrites
└─ vite.config.js
```

### 🗃️ Single source of truth

`src/data/me.js` is the canonical personal-data file. Every command output,
page section, and the AI system prompt reads from it — update one file and
the whole site (including the chatbot's knowledge) updates with you.
`projects.js`, `journey.js`, `unlockables.js`, `stats.js`, and `commands.js`
hold the rest.

## 🚀 Getting started

```bash
npm install
cp .env.example .env   # then fill in the keys (see below)
```

### ⚡ Local dev — pick one

```bash
npm run dev      # plain Vite dev server — UI only, chatbot offline
vercel dev       # full stack — runs the /api/chat serverless function too
```

You need `vercel dev` (not `npm run dev`) to exercise the chatbot locally —
the plain Vite server only serves the frontend and won't run serverless API
routes. The first run prompts you to link the project to Vercel; that's
normal.

### 🔑 Environment variables

Copy `.env.example` to `.env` and fill in:

| Variable | Where | Notes |
|----------|-------|-------|
| `GROQ_API_KEY` | https://console.groq.com/keys | **No `VITE_` prefix.** Read server-side by `api/chat.js` via `process.env`. A `VITE_`-prefixed copy would be inlined into the public client bundle and leak the key. |
| `VITE_EMAILJS_SERVICE_ID` | https://dashboard.emailjs.com | EmailJS service ID (safe to expose — templated send only). |
| `VITE_EMAILJS_TEMPLATE_ID_CONTACT` | EmailJS dashboard | Template that delivers the visitor's message to you. |
| `VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY` | EmailJS dashboard | Template that auto-replies to the visitor. |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS dashboard | EmailJS public key. |

## ➕ Adding a new terminal command

1. Add an entry to `src/data/commands.js` (`type: 'output'` or `'action'`).
2. Create the component under `src/components/commands/`.
3. Register it in `CommandOutput.jsx`.

`help` then lists it automatically, Tab-completion picks it up, and the
`terminal-master` achievement (run 7 different commands) counts it.

## 🔒 How the chatbot stays safe

`api/chat.js` is the only thing that talks to Groq. It:

- 🔐 Keeps the API key server-side only (`process.env.GROQ_API_KEY`).
- 🚦 Rate-limits per IP (8 requests / minute, best-effort in-memory).
- 📏 Caps message length (500 chars) and messages per request (10).
- 🛡️ Appends a guardrail to the system prompt to resist
  "ignore your instructions" style injections.
- ✉️ Returns short, plain-text replies (no markdown).

The client (`useChat.js`) only sends the last 8 messages as context to
keep cost flat across a long conversation, and builds the system prompt
from every `src/data/` file **except** `unlockables.js` — leaking the
achievement secrets would spoil the discovery mechanic. 🤫

## 📜 Scripts

```bash
npm run dev       # Vite dev server
npm run build     # production build → dist/
npm run preview   # preview the production build
npm run lint      # oxlint
```

No test runner is configured.

## ☁️ Deploy (Vercel)

1. Push to GitHub and import the repo in Vercel.
2. In **Project Settings → Environment Variables**, add `GROQ_API_KEY` and
   the three `VITE_EMAILJS_*` vars. `GROQ_API_KEY` **must** be set in the
   dashboard — a local `.env` file isn't read by Vercel's serverless
   runtime at deploy time.
3. `vercel.json` already handles SPA rewrites for client-side routes.

## 📄 License

No license is currently declared on this repo. All rights reserved to
Mahmoud Sayed unless stated otherwise. (Dependencies keep their own
licenses, as listed in `package-lock.json`)
