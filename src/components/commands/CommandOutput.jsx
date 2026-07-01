import About from './About'
import Skills from './Skills'
import Projects from './Projects'
import Experience from './Experience'
import Education from './Education'
import Contact from './Contact'
import Timeline from './Timeline'
import Courses from './Courses'
import Languages from './Languages'
import Links from './Links'
import Freelance from './Freelance'
import Achievements from './Achievements'
import YourAchievements from './YourAchievements'
import Help from './Help'

const REGISTRY = {
  about: About,
  skills: Skills,
  projects: Projects,
  experience: Experience,
  education: Education,
  contact: Contact,
  timeline: Timeline,
  courses: Courses,
  languages: Languages,
  links: Links,
  freelance: Freelance,
  'my-achievements': Achievements,
  'your-achievements': YourAchievements,
  help: Help,
}

/**
 * Renders the right output component for a given command id.
 * Returns null if the command has no visual output (e.g. pure actions).
 */
export default function CommandOutput({ commandId, onCommandClick }) {
  const Component = REGISTRY[commandId]
  if (!Component) return null
  return <Component onCommandClick={onCommandClick} />
}
