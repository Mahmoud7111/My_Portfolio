// ============================================================
// me.js — SINGLE SOURCE OF TRUTH for personal data.
// Every command output, page section, and the AI chatbot
// system prompt reads from this file. Fill in your real info.
// ============================================================

export const me = {
  name: 'Mahmoud Sayed',
  handle: 'mahmoud',
  title: 'Software & AI Engineer',
  location: 'Cairo, Egypt',
  status: 'available', // 'available' | 'busy' | 'open-to-work'
  email: 'mahmoudsyd24@gmail.com',

  bio: `I build full-stack platforms with React 18, Node.js, Express, and
MongoDB, thinking through architecture as much as code — how data
flows, where state lives, what breaks at scale. I'm also expanding
into Python and the ML stack as part of my AI degree. I care about
code that holds up under a real team and a real deadline, not just
demos that work once.`,

  hobbiesLine: `Outside of work I'm drinking Turkish coffee, more Turkish coffee, and then wondering why I can't sleep.`,

  resume: '/My_Resume2.pdf',
  resumeUrl: '/My_Resume2.pdf',

  currently: [
    'Building this portfolio with React 18',
    'Learning more about AI and ML with Python',
    'Exploring the latest in web development and AI tools',
  ],

  quickFacts: [
    { icon: 'MapPin',     label: 'Location',      sublabel: 'Cairo, Egypt — remote-friendly' },
    { icon: 'Briefcase',  label: 'Availability',   sublabel: 'Open to full-time & contract' },
    { icon: 'Coffee',     label: 'Daily fuel',     sublabel: 'x43 pour-over — 2 cups/day' },
    { icon: 'Code',       label: 'Passion',      sublabel: 'Building scalable systems' },    { icon: 'Layers',     label: 'Current focus',  sublabel: 'designing data-intensive apps' },
    { icon: 'Cpu',        label: 'Specialty',      sublabel: 'AI infra — devEx tooling' },
  ],

  links: [
    { label: 'GitHub', url: 'https://github.com/Mahmoud7111', icon: 'Github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mahmoud7111/', icon: 'Linkedin' },
    { label: 'Email', url: 'mailto:mahmoudsyd24@gmail.com', icon: 'Mail' },
  ],

  skills: {
    languages: ['JavaScript', 'Python', 'C++', 'Java', 'SQL', 'HTML5', 'CSS3'],
    frameworks: ['React', 'Vite', 'Framer Motion', 'Node.js', 'Express.js', 'MongoDB', 'JavaFX', 'Qt'],
    ai_tools: ['Claude', 'OpenCode', 'Multi-Agent Systems','Skills' ,'Claude Hooks', 'Antigravity'],
    tools: ['Git', 'GitHub', 'Postman', 'Figma', 'Arduino' ],
  },

  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'Arabic', level: 'Native' },
  ],

  education: [
    {
      degree: 'B.Sc. Computer Science',
      institution: 'Misr International University (MIU)',
      year: '2024 — 2028',
      details: 'GPA: 3.3 / 4.0',
    },
  ],

  courses: [
    { name: 'IBM AI Engineer (In Progress)', provider: 'Coursera / IBM' },
    { name: 'Build with AI, Masr Edition', provider: 'Google' },
    { name : 'Claude Code in Action', provider: 'Anthropic' },
    { name : 'python Essentials', provider: 'Cisco' },
    { name : 'Front-End Web Development', provider: 'MSP Tech club' },
  ],

  experience: [
    {
      role: 'Software Engineer',
      org: 'Company Name',
      period: '2024 — Present',
      bullets: [
        'Replace with a concrete achievement, e.g. "Cut p99 latency 400ms → 38ms".',
        'Another bullet with a real, measurable outcome.',
      ],
    },
  ],

  freelance: [
    {
      name: 'Project Name',
      client: 'Client / Industry',
      year: '2025',
      description: 'One line on what you built and the result.',
    },
  ],

  milestones: [
    { title: 'TOP 3 MSP Software Hackathon', org: 'MSP Tech Club', year: '2025', type: 'award' },
    //{ title: '[PLACEHOLDER]', org: '[PLACEHOLDER]', year: '2024', type: 'certification' },
    //{ title: '[PLACEHOLDER]', org: '[PLACEHOLDER]', year: '2023', type: 'publication' },
  ],
}
