// ============================================================
// me.js — SINGLE SOURCE OF TRUTH for personal data.
// Every command output, page section, and the AI chatbot
// system prompt reads from this file. Fill in your real info.
// ============================================================

export const me = {
  name: 'Mahmoud Sayed',
  handle: '7oka',
  title: 'Software & AI Engineer',
  location: 'Cairo, Egypt',
  status: 'available', // 'available' | 'busy' | 'open-to-work'
  email: 'mahmoudsyd24@gmail.com',
  phone: '+20 1110333933',

  bio: `I build full-stack platforms with React 18, Node.js, Express, and
MongoDB, thinking through architecture as much as code — how data
flows, where state lives, what breaks at scale. I'm also expanding
into Python and the ML stack as part of my AI degree. I care about
code that holds up under a real team and a real deadline, not just
demos that work once.`,

  hobbiesLine: `Outside of work I'm drinking Turkish coffee, more Turkish coffee, and then wondering why I can't sleep.`,

  resume: '/M_Resume.pdf',
  resumeUrl: '/M_Resume.pdf',
  avatarUrl: '/images/Me1.jpeg',

  currently: [
    'Building this portfolio with React 18',
    'Learning more about AI and ML with Python',
    'Exploring the latest in web development and AI tools',
  ],

  quickFacts: [
    { icon: 'MapPin',     label: 'Location',      sublabel: 'New Cairo, Egypt — remote-friendly' },
    { icon: 'Briefcase',  label: 'Availability',   sublabel: 'Open to full-time & contract' },
    { icon: 'Coffee',     label: 'Daily fuel',     sublabel: 'x43 pour-over — 2 cups/day' },
    { icon: 'Code',       label: 'Passion',      sublabel: 'Building scalable systems' },    { icon: 'Layers',     label: 'Current focus',  sublabel: 'designing data-intensive apps' },
    { icon: 'Cpu',        label: 'Specialty',      sublabel: 'AI infra — devEx tooling' },
  ],

  links: [
    { label: 'GitHub', url: 'https://github.com/Mahmoud7111', icon: 'Github' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/mahmoud7111/', icon: 'Linkedin' },
    // { label: 'Credly', url: 'https://www.credly.com/users/mahmoud-sayed', icon: 'Credly' },
    { label: 'Email', url: 'mailto:mahmoudsyd24@gmail.com', icon: 'Mail' },
  ],

  skills: {
    webDevelopment: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'Vite', 'Axios', 'Context API', 'Framer Motion', 'MySQL'],
    languages: ['JavaScript', 'C++', 'Java', 'Python', 'SQL', 'HTML', 'CSS'],
    ai: ['AI Basics', 'Prompt Engineering', 'NLP Basics', 'LLM API Integration'],
    aiTools: ['Claude', 'Multi-Agent Systems', 'Claude Hooks', 'Skills', 'AI Workflow Orchestration'],
    SoftSkills: ['Problem Solving', 'Teamwork', 'Leadership', 'Communication', 'Time Management', 'Adaptability'],
    additional: ['JavaFX', 'Qt', 'Arduino', 'Git', 'GitHub', 'Jira'],
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
      role: 'Software Development Co-Head',
      org: 'MSP Tech Club – Misr International University',
      period: 'Sep. 2026 – Present',
      bullets: [
        'Leadership: Co-lead the club’s software development track, guiding project direction and mentoring members through Git-based collaborative workflows.',
      ],
    },
    {
      role: 'Full Stack Web Developer Intern',
      org: 'El Zatuna',
      period: 'Jul. 2026 – Present',
      bullets: [
        'Development: Contributing to a MERN-stack platform and helping build core features with the engineering team.',
      ],
    },
    {
      role: 'Data Science Trainee',
      org: 'Digital Egypt Pioneers Initiative (DEPI)',
      period: 'Jul. 2026 – Present',
      bullets: [
        'AI & Data Science – Data Scientist Track',
        '6-month track covering Prompt Engineering, Python, SQL, Data Analysis, Data Visualization, Machine Learning, MLOps, MLflow, and Hugging Face.',
      ],
    },
  ],

  //* Freelance projects, consulting, or contract work. Optional.
  freelance: [
    {
      name: 'Project Name',
      client: 'Client / Industry',
      year: '2025',
      description: 'One line on what you built and the result.',
    },
  ],

  //* Achievements, awards, certifications, publications, etc.
  milestones: [
    {
      title: 'ECPC Contestant (Team: "Trial and Error")',
      org: 'ECPC Egyptian Collegiate Programming Contest',
      year: 'Aug. 2026',
      type: 'award',
      description: 'Took part in a one-day competitive programming competition, solving algorithmic problems as part of a three-person team ("Trial and Error"). Practiced problem analysis, time-boxed implementation, and collaborative debugging under contest conditions.',
    },
    {
      title: 'TOP 3 MSP Software Hackathon',
      org: 'MSP Tech Club',
      year: '2025',
      type: 'award',
    },
  ],

  // ── Services — what you offer to clients ─────────────────────
  services: [
    {
      id: 'fullstack',
      number: '01',
      title: 'Full-Stack Development',
      badge: 'Core Specialty',
      desc: 'Complete web applications built from database to cloud deployment. Scalable, secure, and ready for production.',
      tags: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
      highlights: ['Frontend & Backend', 'Database Architecture', 'Cloud Deployment'],
    },
    {
      id: 'ai-integration',
      number: '02',
      title: 'AI & LLM Integration',
      desc: 'Smart AI features embedded into your product — custom assistants, automated workflows, and intelligent search.',
      tags: ['LLM APIs', 'OpenAI', 'RAG', 'Automation'],
    },
    {
      id: 'frontend',
      number: '03',
      title: 'Frontend Engineering',
      desc: 'Fast, responsive interfaces with thoughtful UX, clean typography, smooth animations, and zero clutter.',
      tags: ['React.js', 'TypeScript', 'Tailwind / SCSS', 'Motion'],
    },
    {
      id: 'consulting',
      number: '04',
      title: 'Technical Consulting',
      desc: 'System architecture reviews, tech stack selection, and code quality audits to help you launch with confidence.',
      tags: ['Architecture', 'Code Audits', 'Performance', 'Best Practices'],
    },
  ],
}
