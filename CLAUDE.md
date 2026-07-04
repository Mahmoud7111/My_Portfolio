# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio styled as a macOS terminal. React 19 + Vite + SCSS. Features an interactive terminal with tab navigation, Groq AI chatbot, and EmailJS contact form.

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

### Single Source of Truth for Personal Data

`src/data/me.js` exports a single `me` object. This is consumed by:
- Every command output component in `src/components/commands/`
- The AI chatbot's system prompt (`src/hooks/useChat.js`)

`src/data/projects.js` and `src/data/unlockables.js` are the other two data files.

### Achievements / Gamification

`useAchievements.js` persists unlocked achievements to `localStorage` under key `portfolio_achievements`. Returns `{ unlocked, unlock, isUnlocked, clearAll, all: UNLOCKABLES, progress }`. Cross-instance reactive via custom `achv:unlock` window events.

`UNLOCKABLES` (22 entries) in `src/data/unlockables.js` — each has `id`, `name`, `desc`, `lockedDesc`, `rarity` (common/rare/legendary), `icon`.

`useEasterEggs.js` tracks close/minimize/maximize interactions, returns `lastUnlocked` for toast display. `useGlobalAchievements.js` tracks night-owl, patient, persistent-visitor, inspector.

Achievements page (`AchievementsContent.jsx`): filter pills (all/common/rare/legendary), ASCII block progress bar (`█`/`░`), cards with rarity-colored borders, clear button with `ConfirmDialog`.

### Terminal Window Sizing

`buildTarget()` in `TerminalWindow.jsx` (lines 69-103) controls all geometry via Framer Motion inline styles. No CSS min/max constraints.

| State | Mobile (< 768px) | Desktop |
|-------|-------------------|---------|
| Normal | `vw-16 × vh-60`, centered with 8px/30px margins, borderRadius 10, minWidth 280, minHeight 360 | `min(1100, vw-32) × vh-80`, centered, borderRadius 12 |
| Maximized | `vw × vh`, borderRadius 0 | `vw × vh`, borderRadius 0 |
| Minimized | Same as normal, opacity 0, scale 0.88 | Same as normal, opacity 0, scale 0.88 |

### Styling

SCSS with a single entry point `src/styles/main.scss`. Import order matters: `variables` → `mixins` → `reset` → `globals` → pages → `terminal` → `cursor`. Uses CSS custom properties defined in `_variables.scss` (e.g. `--coral`, `--cyan`, `--text-body`).

Key style files:
- `src/styles/pages/_home.scss` — homepage panels, `.hc-cmd-line`, `.hc-prompt`, `.hc-cmd`, `.hc-var`, stat cards, feed marquee, CTA
- `src/styles/pages/_about.scss` — about page panels, timeline, milestones, skills grid, courses
- `src/styles/pages/_achievements.scss` — achievements dashboard, filter pills, progress bar, cards
- `src/styles/_terminal.scss` — terminal chrome, tab bar, hamburger menu, mobile dropdown, download pill
- `src/styles/_toast.scss` — achievement toast (top-right, auto-dismiss 4.5s)

Tab bar: tab numbers (`.hc-tab-num`) are coral, tab labels (`.hc-tab-label`) are body color. Active tab overrides both to `#0f0f17`. Achievements tab right-aligned with coral active state. Download resume pill (`.tmux-download`) — white text, coral background, sharp corners.

Mobile hamburger menu: sharp corners, `#11111a` background. Each tab shows `$ cd /path` — active tab shows `> cd /path` in cyan with cyan left border.

Special about page classes (all prefixed with `.ab-`) live in `src/styles/pages/_about.scss` — ~720 lines, full BEM. Key reused components:
- `.ab-icon-sq` / `.ab-icon-sq--coral` / `.ab-icon-sq--cyan` — 36×36 square icon containers, `scale(1.1)` + glow on hover
- `.ab-download-btn` — bordered rectangle button with Download icon + `$ download resume.pdf` text
- `.ab-milestone-card` — color-coded top bar (coral/cyan), `◈` title, type pill badges

### About Page (7 panels)

Built in `src/pages/AboutContent.jsx` (rendered inside `TerminalWindow` via `pages/About.jsx` wrapper). Each panel uses `hc-panel` chrome (filename — comment, ⌃ ⌄ ×, dashed border) from `_home.scss`. Panels:
1. **about.md** — bio, ASCII art, currently box, download resume
2. **journey.log** — timeline entries from `src/data/journey.js` with type pills (experience/certification/award/education)
3. **stack.json** — skills grid with `ART.STACK` ASCII header, 4 categories
4. **milestones.log** — awards/publications/certifications as color-coded cards (coral for awards, cyan for publications/certs)
5. **education.md** — degree card + online courses as pills
6. **whoami.yaml** — quick facts grid with `.ab-icon-sq` icons
7. **languages.i18n** — spoken languages with icons

Data sources:
- `src/data/me.js` — `hobbiesLine`, `resumeUrl`, `currently`, `quickFacts`, `milestones`, `courses`, `languages` (all `[PLACEHOLDER]`-marked)
- `src/data/journey.js` — manually-ordered timeline array
- `src/components/ascii/art.js` — `ART.ABOUT_ME`, `ART.STACK`, `ART.ENV_BOX`, `ART.ACHIEVED`, `ART.TROPHY`

### Command Line Styling

Section command lines (`hc-cmd-line`) follow a consistent pattern across all pages:
- `$` (`.hc-prompt`) — coral with glow (`text-shadow` using `--coral-glow`)
- Command keyword (`.hc-cmd`) — `--text-body`, 13px
- Section/file name (`.hc-var`) — `--cyan`, 15px (bigger than command)

The `CmdLine` component in `AboutContent.jsx` accepts `cmd` and `arg` props:
```jsx
<CmdLine cmd="cat" arg="about.md" />
```

All 13 command lines across Home and About pages follow this split pattern.

### AI Chatbot

`useChat.js` sends messages to Groq's API (`llama-3.3-70b-versatile`). The system prompt is built dynamically from `me.js`. Users enter chat mode via the `chat` terminal command and exit with `exit`.

### Custom Cursor

`CustomCursor` (`src/components/ui/CustomCursor.jsx`) renders a coral block + lagging cyan glow dot. Disabled on touch devices.

## Key Constraints

- All env vars are `VITE_` prefixed (Vite requirement for client-side access)
- No test framework configured
- Not deployed yet — planned for Vercel
- **About page data**: all fields in `me.js` and `journey.js` are `[PLACEHOLDER]`-marked for easy replacement
- **No new colors**: uses only `--coral`, `--cyan`, `--gold`, `--text-*` existing CSS variables
- **No Tailwind / no inline styles** on about page (except dynamic values)
- Homepage and contact page download buttons: `ab-download-btn` rectangle style with `<Download size={14} />` icon
- **Terminal window**: all geometry controlled by `buildTarget()` in JS (Framer Motion), not CSS. Mobile has minWidth 280 / minHeight 360 constraints.
- **Command lines**: `$` always gets coral glow, section names always `.hc-var` (cyan, 15px), commands always `.hc-cmd` (body color, 13px)
