import { useTranslation } from 'react-i18next'
import TerminalWindow from '../components/terminal/TerminalWindow'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { projects } from '../data/projects'
import { me } from '../data/me'

export default function Home() {
  const { t } = useTranslation()

  return (
    <div className="home-page">
      <section className="section--hero">
        <TerminalWindow />
      </section>

      {/* Featured projects */}
      <section className="section container">
        <p className="section-opener">
          <span className="prompt-symbol">$</span> ls ~/projects/featured
        </p>
        <div className="projects-grid">
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <div key={p.id} className="project-card">
                <span className="cmd-name">{p.name}</span>
                <p style={{ color: 'var(--text-body)', marginTop: 6 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {p.tags.map((tag) => (
                    <span key={tag} className="pill-coral-inline">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Tech stack */}
      <section className="section container">
        <AsciiArt art={ART.STACK} color="var(--cyan)" glow="var(--cyan-glow)" />
        <div style={{ marginTop: 24, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.values(me.skills)
            .flat()
            .map((skill) => (
              <span key={skill} className="pill-neutral-inline">
                {skill}
              </span>
            ))}
        </div>
      </section>

      {/* About snapshot */}
      <section className="section container about-split">
        <div>
          <h2 style={{ fontSize: 28 }}>{t('about.heading')}</h2>
          <p className="about-bio" style={{ marginTop: 12 }}>
            {me.bio}
          </p>
        </div>
        <AsciiArt art={ART.ENV_BOX} color="var(--text-muted)" fontSize="11px" hideOnMobile={false} />
      </section>

      {/* Contact CTA */}
      <section className="cta-band container">
        <h2 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', letterSpacing: '-1.5px' }}>
          Let's build something.
        </h2>
        <div style={{ marginTop: 24, display: 'flex', gap: 16, justifyContent: 'center' }}>
          {me.links.map((l) => (
            <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-outline">
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
