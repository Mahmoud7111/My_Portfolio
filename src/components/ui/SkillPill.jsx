import { useState } from 'react'

// Plain-English explanations for non-technical visitors
export const JARGON = {
  'React.js':            'JavaScript library for building interactive web pages',
  'Node.js':             'Runs JavaScript on the server (backend)',
  'Express.js':          'Web framework that runs on Node.js',
  'MongoDB':             'Database that stores data as flexible documents',
  'Mongoose':            'Tool that simplifies working with MongoDB',
  'Vite':                'Super-fast tool to build and run web apps',
  'Axios':               'Library for making HTTP requests (API calls)',
  'Context API':         `React's built-in way to share data across components`,
  'Framer Motion':       'Library for smooth animations in React',
  'MySQL':               'Popular relational (table-based) database',
  'JavaScript':          'The language that makes web pages interactive',
  'Python':              'Beginner-friendly language, popular for AI & data',
  'Java':                'General-purpose language, used in enterprise software',
  'C++':                 'Fast, low-level language used in systems & games',
  'SQL':                 'Language for querying relational databases',
  'HTML':                'Markup language that defines web page structure',
  'CSS':                 'Styles the look and layout of web pages',
  'LLM API Integration': 'Connecting apps to AI models like GPT or Claude',
  'Prompt Engineering':  'Crafting effective instructions for AI models',
  'NLP Basics':          'Teaching computers to understand human language',
  'Git':                 'Version control — tracks code changes over time',
  'GitHub':              'Online platform for hosting and sharing code',
  'Jira':                'Project management tool used by dev teams',
  'Arduino':             'Hardware board for building electronic projects',
}

export function SkillPill({ skill, className = 'pill-neutral-inline' }) {
  const [tip, setTip] = useState(false)
  const desc = JARGON[skill]

  return (
    <span
      className={`${className} skill-pill${desc ? ' skill-pill--has-tip' : ''}`}
      onMouseEnter={() => desc && setTip(true)}
      onMouseLeave={() => setTip(false)}
      style={{ position: 'relative', cursor: desc ? 'help' : 'default' }}
    >
      {skill}
      {tip && (
        <span className="skill-jargon-tip" role="tooltip">
          {desc}
        </span>
      )}
    </span>
  )
}
