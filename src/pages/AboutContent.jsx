import { useTranslation } from 'react-i18next'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'

export default function AboutContent() {
  const { t } = useTranslation()

  const timelineItems = [
    ...me.experience.map((e) => ({ year: e.period, role: e.role, org: e.org })),
    ...me.education.map((e) => ({ year: e.year, role: e.degree, org: e.institution })),
  ]

  return (
    <div className="tab-content-inner">
      <AsciiArt art={ART.ABOUT} color="var(--cyan)" glow="var(--cyan-glow)" />

      <h1 style={{ fontSize: 36, marginTop: 24 }}>{me.name}</h1>
      <p className="about-bio" style={{ marginTop: 12 }}>
        {me.bio}
      </p>

      <p style={{ marginTop: 32, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
        {t('about.timelineHeading')}
      </p>

      <div className="timeline">
        {timelineItems.map((item, i) => (
          <div key={i} className="timeline-item">
            <span className="timeline-year">{item.year}</span>
            <p className="timeline-role">
              <span className="timeline-at">@</span>{' '}
              <span className="timeline-org">{item.org}</span>
              <br />
              {item.role}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>$ cat skills.json</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.values(me.skills)
            .flat()
            .map((s) => (
              <span key={s} className="pill-neutral-inline">
                {s}
              </span>
            ))}
        </div>
      </div>
    </div>
  )
}
