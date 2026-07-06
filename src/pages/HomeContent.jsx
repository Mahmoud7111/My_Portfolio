import { useNavigate } from 'react-router-dom'
import { ExternalLink, Star, Download } from 'lucide-react'
import { GithubIcon } from '../components/ui/BrandIcons'
import RevealOnScroll from '../components/ui/RevealOnScroll'
import TypingLine from '../components/ui/TypingLine'
import { me } from '../data/me'
import { PROJECTS } from '../data/projects'
import { ART } from '../components/ascii/art'
import PCModel from '../components/3d/PCModel'
import { useResumeAchievement } from '../hooks/useResumeAchievement'
import { useAchievements } from '../hooks/useAchievements'

const allSkills = Object.values(me.skills).flat()

// ── Icon SVGs ────────────────────────────────────────────────
const ICONS = {
  Mail: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="2,4 12,13 22,4"/>
    </svg>
  ),
  Github: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  ),
  Linkedin: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  ),
  Twitter: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
    </svg>
  ),
}

// ── Shared helpers ────────────────────────────────────────────
function SectionComment({ label }) {
  return <div className="hc-section-comment">// section: {label}</div>
}

export default function HomeContent() {
  const navigate = useNavigate()
  const onResumeClick = useResumeAchievement()
  const { unlock } = useAchievements()

  const stats = [
    { n: '01', flag: '--projects',  value: PROJECTS.length,            label: 'Projects',   note: 'Shipped & maintained' },
    { n: '02', flag: '--skills',    value: allSkills.length,           label: 'Skills',     note: 'Across all categories' },
    { n: '03', flag: '--languages', value: me.skills.languages.length, label: 'Languages',  note: 'Writing code daily' },
    { n: '04', flag: '--years',     value: '5+',                       label: 'Years',      note: 'Shipping production code' },
  ]

  return (
    <div className="hc-root">

      {/* ══════════════════════════════════════════════════════ */}
      {/* ABOUT                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="about" />

      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40, marginTop: 12 }}>
        {/* Chrome bar */}
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">about.md</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">bio + setup</span>
          </div>
          <span className="hc-panel__controls">⌃ ⌄ ×</span>
        </div>

        {/* Body */}
        <div className="hc-panel__body">
          {/* ASCII Art */}
          <pre className="hc-about-ascii" aria-hidden="true" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 'clamp(6px, 1.2vw, 12px)',
            lineHeight: 1.2,
            color: 'var(--cyan)',
            textShadow: '0 0 12px var(--cyan-glow)',
            whiteSpace: 'pre',
            overflowX: 'auto',
            margin: '0 0 24px'
          }}>
            {ART.ABOUT_ME}
          </pre>

          <div className="hc-about-3d-split">
            <div className="hc-about-left">
              <TypingLine text="whoami">
                <span className="hc-var">whoami</span>
              </TypingLine>
              
              <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', margin: '0 0 4px', color: 'var(--text-heading)', fontWeight: 700 }}>
                {me.name}
              </h1>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--cyan)', margin: '0 0 24px' }}>
                {me.title}
              </p>
              
              <p style={{ margin: '0 0 24px', fontSize: 'clamp(14px, 1.5vw, 16px)', lineHeight: 1.8, color: 'var(--text-body)', maxWidth: 520 }}>
                {me.bio}
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                <span>~/{me.location.toLowerCase()}</span>
                <span>·</span>
                <span style={{ color: me.status === 'available' ? 'var(--cyan)' : 'var(--text-muted)' }}>
                  {me.status === 'available' ? 'open to work' : me.status}
                </span>
              </div>
            </div>
            <div 
              className="hc-model-canvas" 
              style={{ minHeight: 300 }}
            >
              <PCModel />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20, flexWrap: 'wrap' }}>
            <a href={me.resumeUrl} download className="ab-download-btn" onClick={onResumeClick}>
              <Download size={14} />
              <span>$ download resume.pdf</span>
            </a>
            <button onClick={() => navigate('/about')} className="btn-outline btn-outline--cyan">
              learn more → about
            </button>
          </div>
        </div>
      </div>
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STATS                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="by-the-numbers" />

      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">stats.tsv</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">by the numbers</span>
          </div>
          <span className="hc-panel__controls">⌃ ⌄ ×</span>
        </div>
        <div className="hc-panel__body">
          <TypingLine text="awk '{ print $value }' stats.tsv">
            <span className="hc-cmd">
              awk '&#123; print{' '}
              <span className="hc-var">$value</span> &#125;'{' '}
            </span>
            <span className="hc-var">stats.tsv</span>
          </TypingLine>
          <div className="hc-stat-grid">
            {stats.map((s) => (
              <div key={s.n} className="hc-stat-card">
                <div className="hc-stat-card__header">
                  <span className="hc-stat-card__num">{s.n}</span>
                  <span className="hc-stat-card__flag">{s.flag}</span>
                  <span className="hc-stat-card__dot" aria-hidden="true">●</span>
                </div>
                <div className="hc-stat-card__value">{s.value}</div>
                <div className="hc-stat-card__label">{s.label}</div>
                <div className="hc-stat-card__note">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TECH FEED                                              */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="tech-feed" />

      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">tech-feed.log</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">real-time</span>
          </div>
          <span className="hc-panel__controls hc-panel__controls--right">
            // auto-refresh · {allSkills.length} signals
          </span>
        </div>
        <div className="hc-panel__body hc-panel__body--no-pad-v">
          <TypingLine text="watch -n 1 tech-feed">
            <span className="hc-cmd">watch -n 1 </span>
            <span className="hc-var">tech-feed</span>
          </TypingLine>
          <div className="hc-feed-marquee">
            <div className="hc-feed-marquee__track">
              {[...allSkills, ...allSkills].map((skill, i) => (
                <span key={i} className="hc-feed-pill">
                  <span className="hc-feed-pill__dollar">$</span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="hc-feed-marquee hc-feed-marquee--reverse" style={{ marginTop: 8, marginBottom: 16 }}>
            <div className="hc-feed-marquee__track hc-feed-marquee__track--rev">
              {[...allSkills, ...allSkills].reverse().map((skill, i) => (
                <span key={i} className="hc-feed-pill">
                  <span className="hc-feed-pill__dollar">$</span>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════ */}
      {/* FEATURED PROJECTS                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="featured" />

      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">featured-projects.sh</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">2 pinned</span>
          </div>
          <span className="hc-panel__controls">⌃ ⌄ ×</span>
        </div>
        <div className="hc-panel__body">
          <TypingLine text="ls ~/projects/featured">
            <span className="hc-cmd">ls </span>
            <span className="hc-var">~/projects/featured</span>
          </TypingLine>

          {/* Big PROJECTS heading */}
          <pre className="hc-projects-ascii" aria-hidden="true">
            {ART.PROJECTS}
          </pre>

          {/* Project cards — same row-card style as projects page */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {PROJECTS.slice(0, 2).map((p, i) => (
              <article key={p.name} className="project-row-card">
                <div className="project-row-card__inner">
                  <div className="project-row-card__gutter">
                    <span className="gutter-bracket">[</span>
                    <span className="gutter-index">{String(i + 1).padStart(2, '0')}</span>
                    <span className="gutter-bracket">]</span>
                  </div>
                  <div className="project-row-card__image">
                    <div className="project-row-card__image-wrap">
                      {p.image ? (
                        <>
                          <img src={p.image} alt={p.name} loading="lazy" />
                          <div className="project-row-card__image-overlay" />
                        </>
                      ) : (
                        <div className="project-row-card__no-preview">
                          <span>[ no preview ]</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="project-row-card__content">
                    <div className="project-path">
                      <span className="project-path-prefix">~/projects/</span>
                      <span className="project-path-name">{p.name}</span>
                      <span className="project-path-meta">
                        {'{'}{p.branch}{'} '}
                        <span className="project-path-dot" />
                        {p.updated && (
                          <span style={{ marginLeft: 8 }}>· {p.updated}</span>
                        )}
                      </span>
                    </div>
                    <p className="project-desc">
                      <span className="project-desc-prefix">&gt;</span>
                      {p.desc}
                    </p>
                    <div className="project-tag-pills">
                      {p.tags.map((tag) => (
                        <span key={tag} className="project-tag-pill">{tag}</span>
                      ))}
                    </div>
                    <div className="project-meta-actions">
                      <div className="project-meta-left">
                        {p.stars !== undefined && (
                          <span className="project-stars">
                            <Star size={11} />
                            {p.stars}
                          </span>
                        )}
                        {p.status && (
                          <span className="project-status">
                            <span className="project-status-dot" />
                            {p.status}
                          </span>
                        )}
                      </div>
                      <div className="project-actions-right">
                        {p.github && (
                          <a href={p.github} target="_blank" rel="noreferrer" className="btn-source">
                            <GithubIcon size={12} /> source
                          </a>
                        )}
                        {p.live && (
                          <a href={p.live} target="_blank" rel="noreferrer" className="btn-live" onClick={() => unlock('demo-explorer')}>
                            <ExternalLink size={12} /> live
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* View all button */}
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button onClick={() => navigate('/projects')} className="btn-outline btn-outline--nav">
              view all --projects
            </button>
          </div>
        </div>
      </div>
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTACT CTA                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="contact" />

      <RevealOnScroll>
      <div className="hc-panel hc-panel--cta" style={{ marginBottom: 24 }}>
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">cta.sh</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">contact</span>
          </div>
          <span className="hc-panel__controls">⌃ ⌄ ×</span>
        </div>
        <div className="hc-panel__body hc-cta-body">
          <TypingLine text="echo --build-something">
            <span className="hc-cmd">echo </span>
            <span className="hc-var">--build-something</span>
          </TypingLine>

          <div className="hc-cta-center">
            {/* Status pill */}
            <div className="hc-status-pill">
              <span className="hc-status-pill__dot" aria-hidden="true">●</span>
              available for projects
            </div>

            {/* Rocket ASCII */}
            <pre className="hc-rocket" aria-hidden="true">{ART.ROCKET}</pre>

            {/* Heading */}
            <h2 className="hc-cta-heading">Let&apos;s build something.</h2>

            {/* Email */}
            <p className="hc-cta-email">{me.email}</p>

            {/* Social icon buttons */}
            <div className="hc-cta-icons">
              {me.links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hc-icon-btn"
                  aria-label={l.label}
                  title={l.label}
                >
                  {ICONS[l.icon] ?? l.label[0]}
                </a>
              ))}
            </div>
            <button onClick={() => navigate('/contact')} className="btn-outline btn-outline--nav" style={{ marginTop: 16 }}>
              connect → contact
            </button>
          </div>
        </div>
      </div>
      </RevealOnScroll>

    </div>
  )
}
