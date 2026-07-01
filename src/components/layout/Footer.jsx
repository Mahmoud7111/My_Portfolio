import { useTranslation } from 'react-i18next'
import { Mail } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import { me } from '../../data/me'

const ICONS = { Github: GithubIcon, Linkedin: LinkedinIcon, Mail }

export default function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <span>{t('footer.madeBy', { name: me.name })}</span>
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
        <span>{t('footer.copyright', { year })}</span>
      </div>
    </footer>
  )
}
