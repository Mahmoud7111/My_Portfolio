// ============================================================
// projects.js — seed projects for the Projects page.
// ============================================================

export const ALL_TAGS = [
  'all',
  'ai',
  'rust',
  'python',
  'typescript',
  'cli',
  'tools',
  'go',
]

export const PROJECTS = [
  {
    name: 'neural-router',
    desc: 'Routing layer for neural inference with dynamic batching and throughput-aware scheduling.',
    tags: ['ai', 'python'],
    stars: 891,
    status: 'shipping',
    branch: 'main',
    github: '',
    live: '',
    image:
      'https://images.unsplash.com/photo-1558346490-66cb1858d9ac?w=800&q=80',
    updated: '2d ago',
  },
  {
    name: 'vector-cache',
    desc: "Fast approximate nearest neighbors cache backed by HNSW and mmap'd indices.",
    tags: ['ai', 'rust'],
    stars: 342,
    status: 'active',
    branch: 'main',
    github: '',
    live: null,
    image:
      '',
    updated: '1w ago',
  },
  {
    name: 'agentctl',
    desc: 'CLI for orchestrating AI agents, pipelines, and multi-step workflows.',
    tags: ['ai', 'python', 'cli', 'tools'],
    stars: 156,
    status: 'beta',
    branch: 'dev',
    github: '',
    live: '',
    image:
      'https://images.unsplash.com/photo-1620712943543-bcc4688df365?w=800&q=80',
    updated: '3d ago',
  },
  {
    name: 'pgvec-bench',
    desc: 'PostgreSQL pgvector benchmarking suite with reproducible workloads.',
    tags: ['tools', 'python'],
    stars: 88,
    status: 'stable',
    branch: 'main',
    github: '',
    live: null,
    image: null,
    updated: '5d ago',
  },
  {
    name: 'ttyd-share',
    desc: 'Share your terminal over the web with real-time streaming and session recording.',
    tags: ['tools', 'typescript', 'cli'],
    stars: 210,
    status: 'active',
    branch: 'main',
    github: '',
    live: '',
    image:
      'https://images.unsplash.com/photo-1542831371-29b0f74c9713?w=800&q=80',
    updated: '1mo ago',
  },
  {
    name: 'editor-rs',
    desc: 'A modal text editor built in Rust with zero-config Tree-sitter integration.',
    tags: ['tools', 'rust'],
    stars: 445,
    status: 'beta',
    branch: 'dev',
    github: '',
    live: null,
    image: null,
    updated: '2w ago',
  },
]

// Backwards-compatible exports for HomeContent.jsx
export const projects = PROJECTS.map((p) => ({
  id: p.name,
  name: p.name,
  description: p.desc,
  tags: p.tags,
  category: p.tags.includes('ai') ? 'ai' : p.tags.includes('tools') ? 'tools' : 'web',
  github: p.github,
  live: p.live,
  featured: true,
}))

export const categories = ['all', 'web', 'ai', 'tools']
