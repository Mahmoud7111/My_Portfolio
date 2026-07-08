import { me } from './me'
import { PROJECTS } from './projects'

const allSkills = Object.values(me.skills).flat()

export function getStats() {
  return [
    { n: '01', flag: '--projects',  value: `${PROJECTS.length}+`,            label: 'Projects',   note: 'Shipped & maintained' },
    { n: '02', flag: '--skills',    value: `${allSkills.length -1}+`,           label: 'Skills',     note: 'Across all categories' },
    { n: '03', flag: '--languages', value: `${me.skills.languages.length}+`, label: 'Languages',  note: 'Writing code daily' },
    { n: '04', flag: '--certs',     value: '10+',                       label: 'Certificates', note: 'Spanning AI, ML & Web Dev' },
  ]
}
