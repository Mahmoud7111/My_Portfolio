// ============================================================
// unlockables.js — visitor-facing achievements (gamification).
// Tracked client-side via localStorage, see hooks/useAchievements.js
// ============================================================

export const UNLOCKABLES = [
  // ─── Terminal basics ─────────────────────────────────────
  {
    id: 'first-visit',
    name: 'hello, world',
    desc: 'Opened the terminal for the first time.',
    lockedDesc: 'Type any command in the terminal to begin your journey',
    rarity: 'common',
    icon: 'hello, world',
  },
  {
    id: 'first-step',
    name: 'First Step',
    desc: 'Execute your first command in the terminal',
    lockedDesc: 'Try typing a command like help or about',
    rarity: 'common',
    icon: '❯',
  },
  {
    id: 'terminal-master',
    name: 'Terminal Master',
    desc: 'Execute at least 7 different terminal commands',
    lockedDesc: 'Keep exploring — try every command in the help menu',
    rarity: 'rare',
    icon: '⌨',
  },
  {
    id: 'ai-conversationalist',
    name: 'AI Conversationalist',
    desc: 'Activated chat assistant mode to talk with the Mahmoud AI',
    lockedDesc: 'Type chat in the terminal to open the AI assistant',
    rarity: 'rare',
    icon: '✧',
  },

  // ─── Navigation & content ────────────────────────────────
  {
    id: 'site-explorer',
    name: 'Site Explorer',
    desc: 'Visited all sections of the portfolio',
    lockedDesc: 'Explore every page the portfolio has to offer',
    rarity: 'rare',
    icon: '◈',
  },
  {
    id: 'interested-aren-we',
    name: "Interested Aren't We",
    desc: 'Downloaded my CV to learn more about me',
    lockedDesc: 'Look for a way to download my resume',
    rarity: 'common',
    icon: '⊡',
  },
  {
    id: 'contact-made',
    name: 'Contact Made',
    desc: 'Sent a message through the contact form or clicked on my email',
    lockedDesc: 'Try reaching out via the contact page',
    rarity: 'common',
    icon: '✉',
  },
  {
    id: 'demo-explorer',
    name: 'Demo Explorer',
    desc: 'Clicked on a project demo link',
    lockedDesc: 'Check out the Projects section and click a live demo link',
    rarity: 'common',
    icon: '▶',
  },

  // ─── Time & persistence ──────────────────────────────────
  {
    id: 'night-owl',
    name: 'night owl',
    desc: 'Visited between midnight and 4am.',
    lockedDesc: 'Come back late at night...',
    rarity: 'rare',
    icon: '☾',
  },
  {
    id: 'patient',
    name: 'the patient one',
    desc: 'Stayed for over 3 minutes.',
    lockedDesc: 'Take your time exploring — no rush',
    rarity: 'rare',
    icon: '⌛',
  },
  {
    id: 'persistent-visitor',
    name: 'Persistent Visitor',
    desc: 'Spent more than 5 minutes exploring the portfolio',
    lockedDesc: 'Really take your time and explore every corner',
    rarity: 'rare',
    icon: '⏳',
  },

  // ─── Meta ─────────────────────────────────────────────────
  {
    id: 'achievement-hunter',
    name: 'Achievement Hunter',
    desc: 'Unlocked at least 5 achievements',
    lockedDesc: 'Keep unlocking achievements to prove yourself',
    rarity: 'legendary',
    icon: '✦',
  },

  // ─── Hidden / easter eggs ────────────────────────────────
  {
    id: 'red-choice',
    name: '???',
    desc: '// red is a bold color choice.',
    lockedDesc: 'What could be red in this terminal?',
    rarity: 'common',
    icon: '◈',
  },
  {
    id: 'muscle-memory',
    name: '???',
    desc: '// muscle memory dies hard.',
    lockedDesc: 'Some commands are just instinct',
    rarity: 'common',
    icon: '...',
  },
  {
    id: 'konami',
    name: '???',
    desc: '// ↑ ↑ ↓ ↓ ← → ← → b a',
    lockedDesc: 'A classic code never dies',
    rarity: 'legendary',
    icon: '⬆',
  },
  {
    id: 'for-the-vibes',
    name: '???',
    desc: "// you're here for the vibes, not the words.",
    lockedDesc: 'Sometimes you just need to be here',
    rarity: 'rare',
    icon: '...',
  },
  {
    id: 'inspector',
    name: 'the inspector',
    desc: 'Opened DevTools while browsing.',
    lockedDesc: 'Right-click and inspect... if you dare',
    rarity: 'legendary',
    icon: '⌘',
  },
  {
    id: 'greeting',
    name: '???',
    desc: 'Hint: Try being friendly to the terminal with a greeting.',
    lockedDesc: 'The terminal has feelings too',
    rarity: 'legendary',
    icon: '?',
  },
  {
    id: 'escape-artist',
    name: 'Terminal Escape Artist',
    desc: 'Tried to close the terminal, but could not escape!',
    lockedDesc: 'Click the red X and see what happens',
    rarity: 'legendary',
    icon: '✕',
  },
  {
    id: 'rabbit-hole',
    name: 'Found the Bottom of the Rabbit Hole',
    desc: 'Discovered the secret minimized terminal screen',
    lockedDesc: 'Try minimizing the terminal — something might be hidden',
    rarity: 'legendary',
    icon: '⬇',
  },
  {
    id: 'full-screener',
    name: 'Full Screener',
    desc: 'Maximized the terminal to full screen',
    lockedDesc: 'Click the maximize button and see the terminal go full screen',
    rarity: 'rare',
    icon: '⊞',
  },
  {
    id: '404-explorer',
    name: '???',
    desc: '// you went somewhere you weren\'t supposed to go.',
    lockedDesc: 'Stray paths sometimes lead to discoveries',
    rarity: 'rare',
    icon: '⛯',
  },
]
