# 🤖 CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Project Overview

Personal portfolio styled as a macOS / tmux terminal. **React 19** + Vite 8 + SCSS (no Tailwind). Ships with an interactive terminal (real window controls), a Groq-powered AI assistant ("7oka") routed through a Vercel serverless function, a lazy-loaded three.js PC/desk scene (paused off-screen), 22 visitor unlockables, an EmailJS contact form, and a custom cursor.

GitHub: `Mahmoud7111/My_Portfolio` · Deployed via Vercel.

## 🛠️ Development Commands

All commands run from `portfolio/` (the directory containing `package.json`):

```bash
npm run dev       # Vite dev server (UI only — chatbot offline, /api/ not served)
vercel dev        # full stack — runs /api/chat.js serverless function too
npm run build     # production build → dist/
npm run preview   # preview the production build locally
npm run lint      # oxlint
```

⚠️ Use `vercel dev` (not `npm run dev`) to actually exercise the chatbot — the plain Vite server won't run serverless API routes. First run prompts to link the project to Vercel; that's normal.

No test runner is configured. There are no `test` / `test:watch` scripts.

## 🔑 Environment Setup

Copy `portfolio/.env.example` to `portfolio/.env` and fill in:

- `GROQ_API_KEY` — free key at <https://console.groq.com/keys>. **No `VITE_` prefix** — read server-side by `api/chat.js` via `process.env`. A `VITE_`-prefixed copy would be inlined into the public client bundle and leak the key.
- `VITE_EMAILJS_SERVICE_ID` / `VITE_EMAILJS_TEMPLATE_ID_CONTACT` / `VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY` / `VITE_EMAILJS_PUBLIC_KEY` — from <https://dashboard.emailjs.com>. These are intentionally `VITE_`-prefixed (EmailJS public keys only allow templated sends, safe to expose).

On **Vercel deploy**, `GROQ_API_KEY` MUST be set in the dashboard env vars — a local `.env` is not read by Vercel's serverless runtime at deploy time.

## 🏗️ Architecture

### 🧭 Routing

`BrowserRouter` wraps the app in `main.jsx`. `ScrollToTop` resets scroll on route change. Routes are flat in `App.jsx`:
- `/` — Home (contains the terminal + 3D model + hero/home content sections)
- `/projects`, `/about`, `/contact`, `/achievements`
- `*` — 404

The terminal's tab bar (`TerminalWindow.jsx`) shares the same router via `useNavigate()` / `useLocation()`. Always redirects to `/` + `?chat=1` when opened from `ChatFAB`. `main.jsx` also handles `ScrollToTop` on every route change.

### ⌨️ Terminal Command System

Commands are defined in `src/data/commands.js` as a registry (14 enabled; `freelance` is commented out). Each entry has `id`, `desc` (inline string), and `type`:
- `'output'` → renders a component from `src/components/commands/`
- `'action'` → triggers a side effect (`clear`, `chat`, `help`)

`useTerminal` (`src/hooks/useTerminal.js`) manages terminal state: history of `{type, commandId?, value?, isError?}` entries, current input, chat-mode flag, and command dispatch. It also:
- Builds Tab-completion from sorted command ids (`getCompletion`, `tabComplete`)
- Tracks greeting easter egg (hello/hi/hey/…) and the **Konami code** (`u u d d l r l r b a`)
- Calls `unlock()` from `useAchievements` to track visitor progress (`first-step`, `terminal-master` at 7 distinct commands, `muscle-memory` at 2 `clear`s, `for-the-vibes` at 3 `help`s, `ai-conversationalist` on `chat`)

`CommandOutput.jsx` is the component registry (maps `commandId` → component in `src/components/commands/`). Adding a new terminal command means:
1. Add entry to `src/data/commands.js`
2. Create component in `src/components/commands/`
3. Register it in `CommandOutput.jsx`'s `REGISTRY` map

`help` then lists it automatically, Tab-completion picks it up, `terminal-master` counts it.

### 🗂️ Single Source of Truth for Personal Data

`src/data/me.js` exports the `me` object — the canonical personal-data file. Consumed by:
- Every command output component in `src/components/commands/`
- The AI chatbot's system prompt (`src/hooks/useChat.js`)
- Page content (`HomeContent.jsx`, `AboutContent.jsx`, `ContactContent.jsx`, `AchievementsContent.jsx`)

Other data files:
- `projects.js` — project gallery (`PROJECTS`, `ALL_TAGS`, plus back-compat `projects`/`categories` exports)
- `journey.js` — manually-ordered timeline (most recent first; placeholder data)
- `unlockables.js` — 22 visitor achievement definitions (id/name/desc/lockedDesc/rarity/icon)
- `stats.js` — `getStats()` derives the home page stat cards from `me` + `PROJECTS`
- `commands.js` — terminal command registry

ASCII art is centralized in `src/components/ascii/art.js` as `ART.*` (`HERO`, `PROJECTS`, `STACK`, `ABOUT_ME`, `CONTACT`, `ACHIEVED`, `ACHIEVEMENTS`, `ENV_BOX`, `EMAIL_BOX`, `TROPHY`, `ROCKET`, dividers). Render via `<AsciiArt art={ART.X} color="--coral" glow="--coral-glow" />` from `components/ascii/AsciiArt.jsx`.

### 🏆 Achievements / Gamification

`useAchievements.js` persists unlocked ids to `localStorage` under `portfolio_achievements`. Returns `{ unlocked, unlock, isUnlocked, clearAll, all: UNLOCKABLES, progress }`. Cross-instance reactive via the `achv:unlock` window CustomEvent.

`UNLOCKABLES` (22 entries) in `src/data/unlockables.js` — each has `id`, `name`, `desc`, `lockedDesc`, `rarity` (common/rare/legendary), `icon`. Several are hidden easter eggs (name `'???'`, concealed lockedDesc).

Hook responsibilities:
- `useEasterEggs.js` — listens for any unlock and exposes `lastUnlocked` for the toast. Also handles chrome interactions: `onCloseClick` → `escape-artist` + `red-choice`, `onMinimizeClick` → `rabbit-hole`, `onMaximizeClick` → `full-screener`, `onRestoreFromMinimized` (no-op hook reserved).
- `useGlobalAchievements.js` — time/behavior-based unlocks: `night-owl` (midnight–4am), `patient` (3 min), `persistent-visitor` (5 min), `inspector` (DevTools; window-size delta >160px check every 2s), `site-explorer` (visit all 5 routes), `achievement-hunter` (≥5 others unlocked).
- `useResumeAchievement.js` — `interested-aren-we` on resume download click.

Achievements page (`AchievementsContent.jsx`, routed at `/achievements`): filter pills (all/common/rare/legendary), ASCII block progress bar (`█`/`░`), cards with rarity-colored borders, clear button with `ConfirmDialog`.

### 🪟 Terminal Window States

`TerminalWindow.jsx` has 4 top-level states external to Motion:
- `'hello'` → `HelloWorldScreen` — types out "Hello World" then fades (~2.4s boot) and hands off to `'normal'`
- `'closed'` → `TerminalClosedScreen` — rendered when the red traffic-light is clicked; has its own restore affordance
- `'normal'` / `'minimized'` / `'maximized'` → the live terminal window, animated via Framer Motion

`buildTarget()` in `TerminalWindow.jsx` controls all window geometry via inline styles (no CSS min/max):

| State | Mobile (<768px) | Desktop |
|-------|-----------------|---------|
| Normal | `vw-16 × vh-60`, centered (8/30px margins), borderRadius 10, minWidth 280, minHeight 360 | `min(1100, vw-32) × vh-80`, centered, borderRadius 12 |
| Maximized | `vw × vh`, borderRadius 0 | `vw × vh`, borderRadius 0 |
| Minimized | Same as normal + opacity 0, y 140, scale 0.88 → dock pill shown | Same |

Springs: `SPRING_SMOOTH` (normal) and `SPRING_SNAP` (minimize with light overshoot).

When minimized, a dock pill (`.terminal-dock`) renders at fixed bottom-center and restores on click.

### 🤖 AI Chat Mode Sequence

Chat mode is far more than a flag — it's a multi-stage cinematic sequence (all in `TerminalWindow.jsx`):
1. `chat` command (or `ChatFAB` click → navigates `/?chat=1`) flips `chatMode=true`. URL is cleaned via `navigate(..., { replace: true })` so it doesn't reopen on exit.
2. **Activation overlay** (`AiActivationOverlay`) — ~2.4s, pure CSS sweep bar + status lines ("INITIALIZING AI SUBSYSTEM…", "BUILDING CONTEXT FROM me.js…", "◈ ASSISTANT SHELL READY"). No per-frame JS, so the cursor RAF stays smooth.
3. **Backdrop dim** (`.ai-mode-backdrop`) + ambient **cyan particles** (`AiParticles`, 8 `aria-hidden` dots) + cyan glow (`.terminal-chat-glow`).
4. `aiReady` flips true at ~2s → the **holographic chat panel** (`<div class="chat-history-panel">`) slides in with a badge "◈ model active".
5. On send: **ripple** (`AiSendRipple`) flashes, message goes to `/api/chat`, reply arrives and is rendered via `useTypewriter` line-by-line inside the panel.
6. `exit` (command or exit button) flips `chatMode=false` → **deactivation overlay** (`AiDeactivationOverlay`) plays ~2.2s in reverse (bottom→top sweep, coral accent, "AI SUBSYSTEM OFFLINE"), then everything clears back to normal.

Chat messages are sent via `useChat.js` which posts to `/api/chat` (our proxy), trimming conversation context to the last 8 messages. Client-side 500-char cap is matched server-side in `api/chat.js`.

`ChatFAB` (`src/components/ui/ChatFAB.jsx`) is a floating bottom-right button, present on every page. Hidden while already in chat mode on `/`, and stagger-in 1.2s after mount so it doesn't fight the terminal entrance.

### 🔒 Serverless Chat Proxy (`api/chat.js`)

Vercel serverless function — the ONLY thing that talks to Groq. Responsibilities:
- `GROQ_API_KEY` read from `process.env` (server-side only), NEVER shipped to the browser.
- Rate limit: 8 requests/min per IP, best-effort in-memory Map (NOT bulletproof across cold starts; swap for Vercel KV / Upstash if needed).
- Caps: `MAX_MESSAGE_LENGTH=500` chars/msg, `MAX_MESSAGES_PER_REQUEST=10`.
- Appends a guardrail to the system prompt resisting "ignore your instructions"-style injections (lightweight, not bulletproof).
- Model: `llama-3.3-70b-versatile`, `temperature: 0.6`, `max_tokens: 250`.

The client (`useChat.js`) builds the system prompt from every file in `src/data/` EXCEPT `unlockables.js` (leaking achievement secrets would spoil the discovery mechanic). System prompt is memoized per hook instance — it's large — and only the last 8 messages are sent as context.

### 📄 About Page (7 panels)

Built in `src/pages/AboutContent.jsx` (rendered inside `TerminalWindow` via `pages/About.jsx` wrapper). Each panel uses `hc-panel` chrome (filename — comment, `⌃ ⌄ ×` controls, dashed border) from `_home.scss`. Panels:
1. **about.md** — bio, ASCII art (`ART.ABOUT_ME`), `TypewriterLoop` title (cycles "Mahmoud Sayed" / "Software & AI Engineer" / "CS Student @ MIU" / …), `currently` box, resume download
2. **journey.log** — timeline from `src/data/journey.js` with type filter pills (`experience`/`certification`/`award`/`education`) + alternating left/right slide-in (`TimelineList`)
3. **skills.json** — skills grid with `ART.STACK` + `ART.ENV_BOX` headers, 4 categories (`languages`/`frameworks`/`ai_tools`/`tools`)
4. **milestones.log** — color-coded cards for `award` (coral), `publication`/`certification` (cyan), with `Trophy`/`FileText`/`Award` icons
5. **education.md** — degree card + online courses as pills
6. **whoami.yaml** — quick facts grid with `.ab-icon-sq` icons (alternating coral/cyan)
7. **languages.i18n** — spoken languages with `Languages` icons

Data sources: `src/data/me.js` (bio, currently, quickFacts, milestones, courses, languages, skills, experience, education, freelance, links, resume status), `src/data/journey.js` (timeline — most fields still `[PLACEHOLDER]`-marked).

`PanelChrome` and `CmdLine` helpers in `AboutContent.jsx` accept props and produce the consistent `filename — comment / ⌃ ⌄ ×` chrome and `$ cmd var` line pattern across all panels.

### 🎮 Home Page (HomeContent.jsx)

`src/pages/HomeContent.jsx` renders scrollable panels below the prompt:
1. **about.md panel** — same `ART.ABOUT_ME` + `TypewriterLoop` title, bio, status pill, AND the **3D model** (`LazyPCModel` with `forcePaused={chatMode}`) in a split layout
2. **stats.tsv** — `AnimatedCounter` stat cards from `getStats()` (projects, skills, languages, certs)
3. **tech-feed.log** — dual-direction skill marquee (`hc-feed-marquee` + reverse track)
4. **featured-projects.sh** — first 2 projects as `project-row-card`s, with `unlock('demo-explorer')` on live-link click
5. **cta.sh** — rocket ASCII, email, social icon buttons, status pill

All panels use `RevealOnScroll` wrappers. `TypingLine` types out the command line on entry.

### 🖥️ 3D Scene (`src/components/3d/`)

- `PCModel.jsx` — `@react-three/fiber` `Canvas` with cyberpunk lighting (coral pointlight + cyan pulsing backlight), `Sparkles`, `Grid` (cyberspace floor), `Float` (gentle bob), and `OrbitControls` (auto-rotate, zoom/pan disabled). Loads `pc.glb`. `Fallback` shows an ASCII progress bar via `useProgress`.
- `LazyPCModel.jsx` — code-splits `PCModel` via `React.lazy` and wraps with an `IntersectionObserver` (400px lookahead / 200px bottom buffer):
  - **PRELOAD**: downloads the ~700KB 3D chunk as the user approaches the section
  - **PAUSE-RENDER**: unmounts the Canvas when off-screen (or when `forcePaused` — true during chat mode — or when the tab is backgrounded). The placeholder keeps layout space so nothing reflows, and the cached GLB remounts instantly on scroll-back.
  - Result: 0 CPU + 0 GPU cost while the visitor reads other pages.

### 📧 Contact Form (`ContactContent.jsx`)

Uses `@emailjs/browser` directly. Features:
- Client-side validation (name/email regex/message length ≤2000)
- **Honeypot field** (`name="website"`) — if filled, silently pretends success without hitting EmailJS
- Sends TWO templates in parallel via `Promise.allSettled`: `VITE_EMAILJS_TEMPLATE_ID_CONTACT` (to author) + `VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY` (to sender). Auto-reply failure doesn't fail the send.
- Success state shows ASCII "queued/delivered/awaiting" + spam-folder reminder
- Resume download button at the bottom (unlocks `interested-aren-we`)
- Social icons unlock `contact-made` on click
- `usePrefersReducedMotion` → falls back to plain `div` wrappers instead of `motion.div`

### ⊞ Powerline Footer

`TerminalWindow.jsx` renders `PowerlineFooter` — segment-style status bar (`pl-seg--coral`, `--surface2/3`, `--cyan`) showing NORMAL/AI-SHELL mode, model/load/path/encoding, and keyboard hints (`^C ^D ^L tab`). Segments overlap via `z-index` to mimic real shell powerline.

### 🎨 Styling

SCSS with a single entry point `src/styles/main.scss`. `@use` order matters:
`variables` → `mixins` → `reset` → `globals` → `animations` → `pages/*` → `terminal` → `cursor` → `toast` → `ai-mode` → `chat-fab`

Uses CSS custom properties defined in `_variables.scss` (e.g. `--coral`, `--cyan`, `--gold`, `--text-*`). Fonts: `JetBrains Mono` (mono) + `Inter` (sans), imported via `src/styles/fonts.css`.

Key style files:
- `src/styles/pages/_home.scss` — homepage panels, `.hc-cmd-line`, `.hc-prompt`, `.hc-cmd`, `.hc-var`, stat cards, feed marquee, CTA, 3D placeholder styles (`hc-model-placeholder`)
- `src/styles/pages/_about.scss` — about page (~720 lines, full BEM `.ab-*`): timeline, milestones, skills grid, courses
- `src/styles/pages/_achievements.scss` — achievements dashboard, filter pills, ASCII progress bar, cards, clear button
- `src/styles/pages/_contact.scss` — compose panel, form fields, honeypot, success state, spam hint
- `src/styles/_terminal.scss` — terminal chrome, tmux tab bar (`tmux-tab`/`tmux-mobile-dropdown`), hamburger, download pill, powerline segments, dock pill
- `src/styles/_ai-mode.scss` — activation/deactivation overlays, sweep bar, scan progress, chat panel, particles, send ripple, ChatFAB label slide
- `src/styles/_cursor.scss` — custom cursor (coral block + lagging cyan glow, disabled on touch)
- `src/styles/_toast.scss` — achievement toast (top-right, auto-dismiss 4.5s)

#### 🐳 Tab bar conventions
Tab numbers (`.hc-tab-num`) coral, tab labels (`.hc-tab-label`) body color. Active tab overrides both to `#0f0f17` (surface-5). Achievements tab right-aligned with coral active state. Download resume pill (`.tmux-download`) — white text, coral background, sharp corners. Mobile hamburger menu — sharp corners, `#11111a` background. Each tab shows `$ cd /path` — active shows `> cd /path` in cyan with cyan left border.

#### 🟦 About-page reused components (`.ab-*` BEM)
- `.ab-icon-sq` / `--coral` / `--cyan` — 36×36 square icon containers, `scale(1.1)` + glow on hover
- `.ab-download-btn` — bordered rectangle button with Download icon + `$ download resume.pdf` text (also used on Home + Contact)
- `.ab-milestone-card` — color-coded top bar (coral/cyan), `◈` title, type pill badges

#### 🖋️ Command line styling
Section command lines (`hc-cmd-line`) follow a consistent split pattern across all pages:
- `$` (`.hc-prompt`) — coral with `--coral-glow` text-shadow
- Command keyword (`.hc-cmd`) — `--text-body`, 13px
- Section/file name (`.hc-var`) — `--cyan`, 15px (bigger than command)

`CmdLine` and `TypingLine` components in `AboutContent.jsx` apply this consistently across all panels and the home page.

### ✨ Custom Cursor

`CustomCursor` (`src/components/ui/CustomCursor.jsx`) renders a coral block + lagging cyan glow dot. `usePrefersReducedMotion` and touch-device detection skip it on accessibility / mobile paths.

## ⚙️ Key Constraints

- ✅ React **19** — not 18. Don't downgrade patterns or syntax.
- ✅ Env vars: `GROQ_API_KEY` is NON-`VITE_` (server-only); all EmailJS vars are `VITE_`-prefixed.
- ✅ No test framework configured.
- ✅ **No new colors**: uses only existing CSS variables (`--coral`, `--cyan`, `--gold`, `--text-*`). `--gold` is reserved for the macOS minimize dot + trophy ASCII only — never for content.
- ✅ **No Tailwind / no inline styles** on about page (except dynamic values like `style={{ marginBottom: 40 }}`).
- ✅ Terminal window: all geometry controlled by `buildTarget()` in JS (Framer Motion), not CSS. Mobile has minWidth 280 / minHeight 360 constraints.
- ✅ Command lines: `$` always gets coral glow, section names always `.hc-var` (cyan, 15px), commands always `.hc-cmd` (body, 13px).
- ✅ Homepage + contact page download buttons: `.ab-download-btn` rectangle style with `<Download size={14} />` icon.
- ✅ AI mode animations: overlays use pure CSS keyframes (no per-frame JS / RAF) to keep the cursor loop smooth. Preserve this — don't add `useFrame`-style updates to the activation sequence.
- ✅ 3D model: never render `<PCModel>` directly. Always go through `<LazyPCModel forcePaused={chatMode}>` so the IntersectionObserver pause logic stays intact.
- ✅ Chat system prompt: read from `me.js` + `journey.js` + `projects.js` + `stats.js` + `commands.js`. NEVER include `unlockables.js` (spoils achievements).
- ✅ Verifying the chatbot locally requires `vercel dev` (to run `api/chat.js`).

## 🧪 Known Limitations / Future Enhancements

- The in-memory rate limiter in `api/chat.js` does NOT persist across cold starts — fine for a portfolio site, but swap to Vercel KV / Upstash Redis if you need bulletproof limiting.
- `journey.js` and parts of `me.js` (`experience`, `freelance`) still have `[PLACEHOLDER]` content — fill in before serious deployment.
- The prompt-injection guardrail in `api/chat.js` is lightweight (appended instruction), not a model-side safety filter — a determined prompt can still phrase around it.
- No tests configured; no CI beyond `npm run lint`.
- `src/components/three/`, `src/components/sections/`, `src/components/chat/`, `src/utils/` are currently empty scaffold folders — safe to remove or repurpose.
