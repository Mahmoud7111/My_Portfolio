import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { me } from '../../data/me'

const ICONS = { Github: GithubIcon, Linkedin: LinkedinIcon, Mail }

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>made by {me.name}</span>
        <div className="site-footer-links">
          {me.links.map((l) => {
            const Icon = ICONS[l.icon]
            return (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer" aria-label={l.label}>
                {Icon ? <Icon size={14} /> : l.label}
              </a>
            )
          })}
        </div>
        <span>© {year}</span>
      </div>
    </footer>
  )
}
