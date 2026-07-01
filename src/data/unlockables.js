// ============================================================
// unlockables.js — visitor-facing achievements (gamification).
// Tracked client-side via localStorage, see hooks/useAchievements.js
// ============================================================

export const UNLOCKABLES = [
  {
    id: 'first-command',
    name: 'First Steps',
    desc: 'Ran your first command',
  },
  {
    id: 'explorer',
    name: 'Explorer',
    desc: 'Ran 5+ different commands',
  },
  {
    id: 'deep-diver',
    name: 'Deep Diver',
    desc: 'Read the full experience output',
  },
  {
    id: 'social-stalker',
    name: 'Social Stalker',
    desc: 'Checked all professional links',
  },
  {
    id: 'chat-addict',
    name: 'Chat Addict',
    desc: 'Sent 3+ messages in chat mode',
  },
  {
    id: 'secret-hunter',
    name: 'Secret Hunter',
    desc: 'Found a hidden easter egg command',
  },
]
