import { me } from '../data/me'
import { projects } from '../data/projects'
import { ART } from '../components/ascii/art'

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
  const featuredProjects = projects.filter((p) => p.featured)

  const stats = [
    { n: '01', flag: '--projects',  value: projects.length,            label: 'Projects',   note: 'Shipped & maintained' },
    { n: '02', flag: '--skills',    value: allSkills.length,           label: 'Skills',     note: 'Across all categories' },
    { n: '03', flag: '--languages', value: me.skills.languages.length, label: 'Languages',  note: 'Writing code daily' },
    { n: '04', flag: '--years',     value: '5+',                       label: 'Years',      note: 'Shipping production code' },
  ]

  return (
    <div className="hc-root">

      {/* ══════════════════════════════════════════════════════ */}
      {/* ABOUT                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="intro" />


      <div className="hc-panel" style={{ marginBottom: 40 }}>
        {/* Chrome bar */}
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">intro.txt</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">tl;dr</span>
          </div>
          <span className="hc-panel__controls">⌃ ⌄ ×</span>
        </div>

        {/* Body */}
        <div className="hc-panel__body">
          <div className="hc-cmd-line">
            <span className="hc-prompt">$</span>
            <span className="hc-cmd">cat intro.txt</span>
          </div>
          <div className="hc-cmd-line" style={{ marginBottom: 20 }}>
            <span className="hc-prompt">$</span>
            <span className="hc-cmd">
              echo &quot;<span className="hc-var">$ABOUT_ME</span>&quot;
            </span>
          </div>

          <div className="hc-about-split">
            <div className="hc-about-text">
              <p className="hc-bio">{me.bio}</p>
              <p className="hc-tagline">
                Software engineer &amp; AI student — building things at the
                intersection of code, design, and intelligence.
              </p>
            </div>
            <div className="hc-identity">
              <div className="hc-identity__header">┌─ identity ─</div>
              {[
                { k: 'name',   v: me.name,     cls: '' },
                { k: 'role',   v: me.title,    cls: '' },
                { k: 'loc',    v: me.location, cls: '' },
                { k: 'status', v: me.status,   cls: 'hc-identity__val--status' },
                { k: 'pgp',    v: '0x5F3E…A2B1', cls: '' },
              ].map(({ k, v, cls }) => (
                <div key={k} className="hc-identity__row">
                  <span className="hc-identity__key">{k}</span>
                  <span className={`hc-identity__val ${cls}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* STATS                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="by-the-numbers" />

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
          <div className="hc-cmd-line" style={{ marginBottom: 24 }}>
            <span className="hc-prompt">$</span>
            <span className="hc-cmd">
              awk &apos;&#123; print{' '}
              <span className="hc-var">$value</span> &#125;&apos; stats.tsv
            </span>
          </div>
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

      {/* ══════════════════════════════════════════════════════ */}
      {/* TECH FEED                                              */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="tech-feed" />

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
          <div className="hc-cmd-line" style={{ padding: '16px 0 8px' }}>
            <span className="hc-prompt">$</span>
            <span className="hc-cmd">watch -n 1 tech-feed</span>
          </div>
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

      {/* ══════════════════════════════════════════════════════ */}
      {/* FEATURED PROJECTS                                      */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="featured" />

      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <div className="hc-panel__chrome">
          <div className="hc-panel__chrome-left">
            <span className="hc-panel__bar">▍</span>
            <span className="hc-panel__filename">featured-projects.sh</span>
            <span className="hc-panel__sep">—</span>
            <span className="hc-panel__subtitle">{featuredProjects.length} pinned</span>
          </div>
          <span className="hc-panel__controls">⌃ ⌄ ×</span>
        </div>
        <div className="hc-panel__body">
          <div className="hc-cmd-line" style={{ marginBottom: 20 }}>
            <span className="hc-prompt">$</span>
            <span className="hc-cmd">ls ~/projects/featured</span>
          </div>

          {/* Big PROJECTS heading */}
          <pre className="hc-projects-ascii" aria-hidden="true">
            {ART.PROJECTS}
          </pre>

          {/* Project cards */}
          <div className="hc-project-grid">
            {featuredProjects.map((p) => (
              <div key={p.id} className="hc-project-card">
                <div className="hc-project-card__header">
                  <span className="hc-project-card__name">./{p.name}</span>
                  <div className="hc-project-card__icons">
                    <span title="Copy">⎘</span>
                    <span title="Open">↗</span>
                  </div>
                </div>
                <p className="hc-project-card__desc">{p.description}</p>
                <div className="hc-project-card__tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="hc-tag">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTACT CTA                                            */}
      {/* ══════════════════════════════════════════════════════ */}
      <SectionComment label="contact" />

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
          <div className="hc-cmd-line" style={{ marginBottom: 32 }}>
            <span className="hc-prompt">$</span>
            <span className="hc-cmd">echo --build-something</span>
          </div>

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
          </div>
        </div>
      </div>

    </div>
  )
}
