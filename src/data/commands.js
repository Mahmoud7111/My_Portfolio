// ============================================================
// commands.js — registry of every terminal command.
// `descKey` points to src/locales/*/translation.json → commands.*
// `type`:
//   'output'  → renders a component from components/commands/
//   'action'  → triggers a side effect (clear, chat, navigate)
// ============================================================

export const COMMANDS = [
  // ── Identity — who you are ──────────────────────────
  { id: 'about', desc: "- View my background and Bio", type: 'output' },
  { id: 'skills', desc: "- View my technical skills", type: 'output' },

  // ── Credibility — proof ─────────────────────────────
  { id: 'experience', desc: "- View my work experience", type: 'output' },
  { id: 'education', desc: "- View my educational background", type: 'output' },
  { id: 'courses', desc: "- View my taken courses", type: 'output' },
  { id: 'languages', desc: "- View my language proficiencies", type: 'output' },
  { id: 'timeline', desc: "- View my career timeline", type: 'output' },

  // ── Breadth — the actual work ───────────────────────
  { id: 'projects', desc: "- View my projects gallery", type: 'output' },
  { id: 'my-achievements', desc: "- View my achievements and publications", type: 'output' },

  // ── Depth — go further ──────────────────────────────
  { id: 'chat', desc: "- Start a conversation with 7oka, my personal AI that knows everything about me", type: 'action' },
  { id: 'links', desc: "- View my professional links", type: 'output' },

  // ── Action — how to reach you ───────────────────────
  { id: 'contact', desc: "- Get my contact information", type: 'output' },

  // ── Fun / meta ───────────────────────────────────────
  { id: 'your-achievements', desc: "- View your unlocked achievements", type: 'output' },

  // ── Utility — always last, these aren't "about me" ──
  { id: 'help', desc: "- Show available commands", type: 'action' },
  { id: 'clear', desc: "- Clear the terminal", type: 'action' },

  //{ id: 'freelance', desc: "- View my freelance projects", type: 'output' },
]

export const getCommand = (id) => COMMANDS.find((c) => c.id === id.toLowerCase())
