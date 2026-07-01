# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio styled as a macOS terminal. React 19 + Vite + SCSS. Features an interactive terminal with tab navigation, Groq AI chatbot, EmailJS contact form, and full EN/AR i18n with RTL.

## Development Commands

All commands run from `portfolio/` (the directory containing `package.json`):

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # Run oxlint
```

No test runner is configured. There are no `test` or `test:watch` scripts.

## Environment Setup

Copy `portfolio/.env.example` to `portfolio/.env` and fill in:

- `VITE_GROQ_API_KEY` — free at https://console.groq.com/keys
- `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID` / `VITE_EMAILJS_PUBLIC_KEY` — from https://dashboard.emailjs.com

## Architecture

### Routing

`BrowserRouter` wraps the app in `main.jsx`. Routes are flat in `App.jsx`:
- `/` — Home (contains the terminal)
- `/projects`, `/about`, `/contact`, `/achievements`
- `*` — 404

The terminal's tab bar (`TerminalWindow.jsx`) shares the same router via `useNavigate()` / `useLocation()`.

### Terminal Command System

Commands are defined in `src/data/commands.js` as a registry. Each entry has `id`, `descKey` (i18n key), and `type`:
- `'output'` → renders a component from `src/components/commands/`
- `'action'` → triggers a side effect (clear, chat, help)

`useTerminal` (`src/hooks/useTerminal.js`) manages the terminal state: history of `{type, commandId?, value?}` entries, current input, and command dispatch. It calls `unlock()` from `useAchievements` to track visitor progress (e.g. first command, explorer).

`CommandOutput.jsx` is the component registry — it maps `commandId` to the matching component from `src/components/commands/`. Adding a new terminal command means:
1. Add entry to `src/data/commands.js`
2. Create component in `src/components/commands/`
3. Register it in `CommandOutput.jsx`
4. Add translation strings to both `src/locales/en/translation.json` and `src/locales/ar/translation.json`

### Single Source of Truth for Personal Data

`src/data/me.js` exports a single `me` object. This is consumed by:
- Every command output component in `src/components/commands/`
- The AI chatbot's system prompt (`src/hooks/useChat.js`)

`src/data/projects.js` and `src/data/unlockables.js` are the other two data files.

### i18n (EN/AR)

`src/i18n.js` initializes i18next with `LanguageDetector`. Two translation files: `src/locales/en/translation.json` and `src/locales/ar/translation.json`. When the language changes, `i18n.js` syncs `document.documentElement.dir` and `lang`. Terminal and code elements stay LTR via the `.ltr-island` class (see `_globals.scss`). Keep both translation files in sync.

### AI Chatbot

`useChat.js` sends messages to Groq's API (`llama-3.3-70b-versatile`). The system prompt is built dynamically from `me.js`. Users enter chat mode via the `chat` terminal command and exit with `exit`.

### Achievements / Gamification

`useAchievements.js` persists unlocked achievements to `localStorage` under key `portfolio_achievements`. Achievement definitions live in `src/data/unlockables.js`.

### Styling

SCSS with a single entry point `src/styles/main.scss`. Import order matters: `variables` → `mixins` → `reset` → `globals` → pages → `terminal` → `cursor`. Uses CSS custom properties defined in `_variables.scss` (e.g. `--coral`, `--cyan`, `--text-body`).

### Custom Cursor

`CustomCursor` (`src/components/ui/CustomCursor.jsx`) renders a coral block + lagging cyan glow dot. Disabled on touch devices.

## Key Constraints

- All env vars are `VITE_` prefixed (Vite requirement for client-side access)
- No test framework configured
- Not deployed yet — planned for Vercel
