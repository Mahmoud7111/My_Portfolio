import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GithubIcon } from '../ui/BrandIcons'
import { useScrollDirection } from '../../hooks/useScrollDirection'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { me } from '../../data/me'

export default function Header() {
  const { t } = useTranslation()
  const direction = useScrollDirection()
  const scrollY = useScrollPosition()

  const atTop = scrollY < 50
  const visible = direction === 'up' || atTop

  return (
    <header className={`site-header ${visible ? 'visible' : 'hidden'} ${atTop ? 'at-top' : 'scrolled'}`}>
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <span style={{ color: 'var(--coral)' }}>~/</span>
          <span>{me.handle}</span>
        </Link>

        <nav className="site-nav">
          <Link to="/projects">{t('nav.projects')}</Link>
          <Link to="/about">{t('nav.about')}</Link>
          <Link to="/contact">{t('nav.contact')}</Link>
          <Link to="/achievements">{t('nav.achievements')}</Link>
        </nav>

        <div className="site-header-actions">
          <a
            href={me.links.find((l) => l.label === 'GitHub')?.url || '#'}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            <GithubIcon size={14} />
            {t('nav.github')}
          </a>
        </div>
      </div>
    </header>
  )
}
