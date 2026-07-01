// ============================================================
// projects.js — your project gallery.
// `category` is used by the Projects page filter chips.
// ============================================================

export const projects = [
  {
    id: 'project-one',
    name: './project-one',
    description: 'One-line description of what this project does and why it matters.',
    tags: ['React', 'Node.js'],
    category: 'web',
    github: 'https://github.com/mahmoud/project-one',
    live: 'https://project-one.dev',
    featured: true,
  },
  {
    id: 'project-two',
    name: './project-two',
    description: 'One-line description of what this project does and why it matters.',
    tags: ['Python', 'PyTorch'],
    category: 'ai',
    github: 'https://github.com/mahmoud/project-two',
    live: null,
    featured: true,
  },
  {
    id: 'project-three',
    name: './project-three',
    description: 'One-line description of what this project does and why it matters.',
    tags: ['TypeScript', 'Docker'],
    category: 'tools',
    github: 'https://github.com/mahmoud/project-three',
    live: 'https://project-three.dev',
    featured: true,
  },
]

export const categories = ['all', 'web', 'ai', 'tools']
