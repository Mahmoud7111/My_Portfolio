// ============================================================
// commands.js — registry of every terminal command.
// `descKey` points to src/locales/*/translation.json → commands.*
// `type`:
//   'output'  → renders a component from components/commands/
//   'action'  → triggers a side effect (clear, chat, navigate)
// ============================================================

export const COMMANDS = [
  { id: 'about', descKey: 'commands.about', type: 'output' },
  { id: 'chat', descKey: 'commands.chat', type: 'action' },
  { id: 'clear', descKey: 'commands.clear', type: 'action' },
  { id: 'contact', descKey: 'commands.contact', type: 'output' },
  { id: 'courses', descKey: 'commands.courses', type: 'output' },
  { id: 'education', descKey: 'commands.education', type: 'output' },
  { id: 'experience', descKey: 'commands.experience', type: 'output' },
  { id: 'freelance', descKey: 'commands.freelance', type: 'output' },
  { id: 'help', descKey: 'commands.help', type: 'action' },
  { id: 'languages', descKey: 'commands.languages', type: 'output' },
  { id: 'links', descKey: 'commands.links', type: 'output' },
  { id: 'my-achievements', descKey: 'commands.my-achievements', type: 'output' },
  { id: 'projects', descKey: 'commands.projects', type: 'output' },
  { id: 'skills', descKey: 'commands.skills', type: 'output' },
  { id: 'timeline', descKey: 'commands.timeline', type: 'output' },
  { id: 'your-achievements', descKey: 'commands.your-achievements', type: 'output' },
]

export const getCommand = (id) => COMMANDS.find((c) => c.id === id.toLowerCase())
