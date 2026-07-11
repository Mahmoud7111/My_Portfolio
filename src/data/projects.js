// ============================================================
// projects.js — seed projects for the Projects page.
// ============================================================

export const ALL_TAGS = [
  'all',
  'web',
  'fullstack',
  'react',
  'node',
  'mongodb',
  'threejs',
  'java',
  'cpp',
  'algorithms',
  'arduino',
  'assembly',
  'cisco',
  'desktop',
]

export const PROJECTS = [
  {
    name: 'van-der-linde',
    desc: 'Full-stack luxury watch e-commerce platform with 3D configurator, chatbot, admin dashboard, JWT auth, multi-currency, and Arabic RTL support.',
    tags: ['web', 'fullstack', 'react', 'node', 'mongodb', 'threejs'],
    stars: 0,
    status: 'stable',
    branch: 'main',
    github: 'https://github.com/Mahmoud7111/Van-Der-Linde-MIU',
    live: 'https://van-der-linde1.vercel.app',
    image: '/images/van-der-linde.webp',
    updated: '',
  },
  {
    name: 'miu-guide',
    desc: 'Comprehensive university web portal with a public site and private student portal featuring schedule, attendance tracker, GPA calculator, and exam countdown.',
    tags: ['web', 'react'],
    stars: 0,
    status: 'stable',
    branch: 'main',
    github: 'https://github.com/Mahmoud7111/MIU-Guide',
    live: 'https://miu-guide.vercel.app/',
    image: '/images/MIU.webp',
    updated: '',
  },
  {
    name: 'my-portfolio',
    desc: 'The website you are currently on! My Terminal-style personal portfolio website built with React, Vite, Three.js, and Framer Motion — featuring an interactive terminal, AI chatbot, and gamified achievements.',
    tags: ['web', 'react', 'threejs'],
    stars: 0,
    status: 'active',
    branch: 'main',
    github: 'https://github.com/Mahmoud7111/My_Portfolio',
    live: '',
    image: '/images/spongebob-dance.gif',
    updated: '',
  },
  {
    name: 'tic-tac-toe-solver',
    desc: 'Generalized Tic-Tac-Toe solver using Minimax with brute force vs. dynamic programming memoization on NxN boards.',
    tags: ['web', 'cpp', 'algorithms'],
    stars: 0,
    status: 'stable',
    branch: 'main',
    github: 'https://github.com/Mahmoud7111/Generalized-Tic-Tac-Toe-Solver',
    live: 'https://generalized-tic-tac-toe-solver.vercel.app/',
    image: '/images/tic-tac-toe.webp',
    updated: '',
  },
  {
    name: 'ecommerce-java',
    desc: 'Desktop e-commerce application with Admin, Seller, and Customer roles using layered architecture and file-based persistence.',
    tags: ['java', 'desktop'],
    stars: 0,
    status: 'stable',
    branch: 'main',
    github: 'https://github.com/Mahmoud7111/E-Commerce-Application',
    live: null,
    image: '/images/e-commerce.webp',
    updated: '',
  },
  {
    name: 'miu-network',
    desc: 'Enterprise campus network simulation: VLSM, VLANs, OSPF/EIGRP, IPsec VPN, NAT/PAT, DHCP, DNS, and more in Packet Tracer.',
    tags: ['cisco'],
    stars: 0,
    status: 'stable',
    branch: 'main',
    github: 'https://github.com/Habiba-404-11-11/packet-tracer-project',
    live: null,
    image: '/images/Network.webp',
    updated: '',
  },
  {
    name: 'smart-irrigation',
    desc: 'Intelligent automated irrigation system monitoring soil moisture in real-time, implemented in both Arduino C++ and 8086 Assembly.',
    tags: ['arduino', 'assembly'],
    stars: 0,
    status: 'stable',
    branch: 'main',
    github: 'https://github.com/Mahmoud7111/smart-irrigation-assembly-and-arduino',
    live: null,
    image: '/images/CO.webp',
    updated: '',
  },
]

// Backwards-compatible exports for HomeContent.jsx
export const projects = PROJECTS.map((p) => ({
  id: p.name,
  name: p.name,
  description: p.desc,
  tags: p.tags,
  category: p.tags.includes('fullstack') || p.tags.includes('web')
    ? 'web'
    : p.tags.includes('java') || p.tags.includes('desktop')
      ? 'desktop'
      : p.tags.includes('cpp') || p.tags.includes('algorithms')
        ? 'algorithms'
        : 'systems',
  github: p.github,
  live: p.live,
  featured: true,
}))

export const categories = ['all', 'web', 'desktop', 'algorithms', 'systems']
