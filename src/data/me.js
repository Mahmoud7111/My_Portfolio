// ============================================================
// me.js — SINGLE SOURCE OF TRUTH for personal data.
// Every command output, page section, and the AI chatbot
// system prompt reads from this file. Fill in your real info.
// ============================================================

export const me = {
  name: 'Mahmoud Sayed',
  handle: 'mahmoud',
  title: 'Software & AI Engineer',
  location: 'City, Country',
  status: 'available', // 'available' | 'busy' | 'open-to-work'
  email: 'you@mahmoud.dev',

  bio: `Replace this with 2-3 sentences about who you are, what you build,
and what you care about. Keep it concrete — mention real tools, real
numbers, real outcomes rather than generic adjectives.`,

  hobbiesLine: 'Outside of work I [PLACEHOLDER: pour-over coffee, mechanical-keyboard firmware, and occasionally losing at chess online].',

  resume: '/resume.pdf',   // kept for backwards compat (contact page)
  resumeUrl: '/resume.pdf',

  currently: [
    '[PLACEHOLDER: shipping a semantic-caching layer for LLM apps]',
    '[PLACEHOLDER: writing a rust cli for terminal-native pair programming]',
    '[PLACEHOLDER: reading — designing data-intensive apps (again)]',
  ],

  quickFacts: [
    { icon: 'MapPin',     label: 'Location',      sublabel: '[PLACEHOLDER: Cairo, Egypt — remote-friendly]' },
    { icon: 'Briefcase',  label: 'Availability',   sublabel: '[PLACEHOLDER: open to full-time & contract]' },
    { icon: 'Coffee',     label: 'Daily fuel',     sublabel: '[PLACEHOLDER: x43 pour-over — 2 cups/day]' },
    { icon: 'Music',      label: 'Interests',      sublabel: '[PLACEHOLDER: Lo-fi hip-hop — #focus]' },
    { icon: 'Layers',     label: 'Current focus',  sublabel: '[PLACEHOLDER: designing data-intensive apps]' },
    { icon: 'Cpu',        label: 'Specialty',      sublabel: '[PLACEHOLDER: AI infra — devEx tooling]' },
  ],

  links: [
    { label: 'GitHub', url: 'https://github.com/mahmoud', icon: 'Github' },
    { label: 'LinkedIn', url: 'https://linkedin.com/in/mahmoud', icon: 'Linkedin' },
    { label: 'Twitter', url: 'https://twitter.com/mahmoud', icon: 'Twitter' },
    { label: 'Email', url: 'mailto:you@mahmoud.dev', icon: 'Mail' },
  ],

  skills: {
    languages: ['JavaScript', 'TypeScript', 'Python', 'C++'],
    frameworks: ['React', 'Node.js', 'Express', 'Next.js'],
    aiml: ['PyTorch', 'TensorFlow', 'LangChain', 'Hugging Face'],
    tools: ['Docker', 'Git', 'AWS', 'PostgreSQL'],
  },

  languages: [
    { name: 'English', level: 'Fluent' },
    { name: 'Arabic', level: 'Native' },
  ],

  education: [
    {
      degree: 'B.Sc. Computer Science',
      institution: '[PLACEHOLDER]',
      year: '2021 — 2025',
      details: 'GPA: 0.00 / 4.0',
    },
  ],

  courses: [
    { name: 'Machine Learning Specialization', provider: 'Coursera / Stanford' },
    { name: 'CS50', provider: 'Harvard' },
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

  achievements: [
    { title: 'Achievement title', org: 'Where / who issued it', year: '2025' },
  ],
}
