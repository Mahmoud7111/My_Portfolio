import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import TerminalWindow from '../components/terminal/TerminalWindow'
import { projects } from '../data/projects'
import { me } from '../data/me'

export default function Home() {
  const { t } = useTranslation()
  const allSkills = Object.values(me.skills).flat()

  const stats = [
    { metric: 'projects', value: projects.length, note: 'shipped & maintained' },
    { metric: 'skills', value: allSkills.length, note: 'across 4 categories' },
    { metric: 'languages', value: me.skills.languages.length, note: 'writing code' },
    { metric: 'frameworks', value: me.skills.frameworks.length, note: 'in production' },
    { metric: 'years', value: '5+', note: 'shipping code' },
    { metric: 'ai_credits', value: '10+', note: 'certs & courses' },
    { metric: 'status', value: me.status, note: 'open to collaboration' },
  ]

  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className='home-page'>
      {/* 1. Terminal hero */}
      <section className='section--hero'>
        <TerminalWindow />
      </section>

      {/* Scroll-down affordance — sits below the fixed terminal */}
      {!scrolled && (
        <button
          className='scroll-down-btn'
          aria-label='Scroll to content'
          onClick={() =>
            document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          <span className='scroll-down-btn__label'>scroll</span>
          <span className='scroll-down-btn__arrow' aria-hidden='true'>↓</span>
        </button>
      )}

      {/* 2. About panel */}
      <section id='about-section' className='section about-panel'>
        <div className='about-panel__chrome'>
          <span className='about-panel__title'>▍ intro.txt — tl;dr</span>
          <span className='about-panel__controls'>⌃ ⌄ ×</span>
        </div>
        <div className='about-panel__body'>
          <div className='about-panel__left'>
            <div className='about-panel__commands'>
              <span className='about-panel__cmd'>
                <span className='prompt-symbol'>$</span> cat intro.txt
              </span>
              <span className='about-panel__cmd'>
                <span className='prompt-symbol'>$</span> echo &quot;<span className='about-panel__var'>$ABOUT_ME</span>&quot;
              </span>
            </div>
            <p className='about-panel__bio'>{me.bio}</p>
            <p className='about-panel__tagline'>
              Software engineer &amp; AI student — building things at the
              intersection of code, design, and intelligence.
            </p>
          </div>
          <div className='about-panel__right'>
            <div className='about-panel__identity'>
              <div className='about-panel__identity-header'>┌─ identity ─</div>
              <div className='about-panel__identity-body'>
                <div className='about-panel__identity-row'>
                  <span className='about-panel__identity-key'>name</span>
                  <span className='about-panel__identity-val'>{me.name}</span>
                </div>
                <div className='about-panel__identity-row'>
                  <span className='about-panel__identity-key'>role</span>
                  <span className='about-panel__identity-val'>
                    {me.title}
                  </span>
                </div>
                <div className='about-panel__identity-row'>
                  <span className='about-panel__identity-key'>loc</span>
                  <span className='about-panel__identity-val'>
                    {me.location}
                  </span>
                </div>
                <div className='about-panel__identity-row'>
                  <span className='about-panel__identity-key'>status</span>
                  <span className='about-panel__identity-val about-panel__identity-val--status'>
                    {me.status}
                  </span>
                </div>
                <div className='about-panel__identity-row'>
                  <span className='about-panel__identity-key'>pgp</span>
                  <span className='about-panel__identity-val'>
                    0x5F3E…A2B1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats panel */}
      <section className='section stats-panel'>
        <div className='stats-panel__chrome'>
          <span className='stats-panel__title'>▍ stats.tsv — proof points</span>
          <span className='stats-panel__controls'>⌃ ⌄ ×</span>
        </div>
        <div className='stats-panel__body'>
          <div className='stats-panel__header-row'>
            <span className='stats-panel__col-metric'>metric</span>
            <span className='stats-panel__col-value'>value</span>
            <span className='stats-panel__col-note'>note</span>
          </div>
          {stats.map((s) => (
            <div key={s.metric} className='stats-panel__row'>
              <span className='stats-panel__col-metric stats-panel__metric'>
                {s.metric}
              </span>
              <span className='stats-panel__col-value stats-panel__value'>
                {s.value}
              </span>
              <span className='stats-panel__col-note stats-panel__note'>
                # {s.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Tech feed marquee */}
      <section className='section tech-marquee-section'>
        <div className='tech-marquee__header'>
          <span className='tech-marquee__label'>
            ▍ tech_feed.log — real-time
          </span>
        </div>
        <div className='tech-marquee'>
          <div className='tech-marquee__track'>
            {[...allSkills, ...allSkills].map((skill, i) => (
              <span key={i} className='tech-marquee__item'>
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured projects */}
      <section className='section container'>
        <p className='section-opener'>
          <span className='prompt-symbol'>$</span> ls ~/projects/featured
        </p>
        <div className='projects-grid'>
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <div key={p.id} className='project-card'>
                <span className='cmd-name'>{p.name}</span>
                <p style={{ color: 'var(--text-body)', marginTop: 6 }}>
                  {p.description}
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 6,
                    marginTop: 10,
                    flexWrap: 'wrap',
                  }}
                >
                  {p.tags.map((tag) => (
                    <span key={tag} className='pill-coral-inline'>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className='cta-band container'>
        <h2
          style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)',
            letterSpacing: '-1.5px',
          }}
        >
          Let's build something.
        </h2>
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
          }}
        >
          {me.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target='_blank'
              rel='noreferrer'
              className='btn-outline'
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
