import { Download, ExternalLink, MapPin, Briefcase, Coffee, Music, Layers, Cpu, Languages, GraduationCap, Award, FileText, Trophy } from 'lucide-react'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'
import { JOURNEY } from '../data/journey'

const ICONS = { MapPin, Briefcase, Coffee, Music, Layers, Cpu }

const TYPE_STYLES = {
  experience:    { className: 'ab-type-pill ab-type-pill--cyan',      label: 'Professional experience' },
  certification: { className: 'ab-type-pill ab-type-pill--neutral',   label: 'Certification' },
  award:         { className: 'ab-type-pill ab-type-pill--gold',      label: 'Award' },
  education:     { className: 'ab-type-pill ab-type-pill--coral',     label: 'Education' },
}

const SKILL_CATEGORIES = [
  { key: 'languages',  label: 'Languages',  items: me.skills.languages },
  { key: 'frameworks', label: 'Frameworks', items: me.skills.frameworks },
  { key: 'aiml',       label: 'AI / ML',    items: me.skills.aiml },
  { key: 'tools',      label: 'Tools',      items: me.skills.tools },
]

const totalSkills = SKILL_CATEGORIES.reduce((n, c) => n + c.items.length, 0)

function PanelChrome({ filename, subtitle, controls }) {
  return (
    <div className="hc-panel__chrome">
      <div className="hc-panel__chrome-left">
        <span className="hc-panel__bar">▍</span>
        <span className="hc-panel__filename">{filename}</span>
        <span className="hc-panel__sep">—</span>
        <span className="hc-panel__subtitle">{subtitle}</span>
      </div>
      <span className="hc-panel__controls">{controls || '⌃ ⌄ ×'}</span>
    </div>
  )
}

function CmdLine({ children }) {
  return (
    <div className="hc-cmd-line">
      <span className="hc-prompt">$</span>
      <span className="hc-cmd">{children}</span>
    </div>
  )
}

export default function AboutContent() {
  return (
    <div className="ab-root">

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 1 — about.md — bio                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="about.md" subtitle="bio" />
        <div className="hc-panel__body">
          <CmdLine>cat about.md</CmdLine>

          <AsciiArt art={ART.ABOUT_ME} color="var(--cyan)" glow="var(--cyan-glow)" />

          <div className="ab-bio-grid">
            <div className="ab-bio-main">
              <h1 className="ab-bio-heading">Hi, I&apos;m {me.name}.</h1>
              <p className="ab-bio-text">{me.bio}</p>
              <p className="ab-bio-hobbies">{me.hobbiesLine}</p>
              <a
                href={me.resumeUrl}
                download
                className="ab-download-btn"
              >
                <Download size={14} />
                <span>$ download resume.pdf</span>
              </a>
            </div>

            <div className="ab-currently-box">
              <div className="ab-currently-header">
                <span className="ab-currently-dot">●</span>
                <span className="ab-currently-label">ps aux — currently</span>
              </div>
              <ul className="ab-currently-list">
                {me.currently.map((line, i) => (
                  <li key={i} className="ab-currently-item">
                    <span className="ab-currently-prefix">&gt;</span> {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 2 — whoami.yaml — quick facts                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="whoami.yaml" subtitle="quick facts" />
        <div className="hc-panel__body">
          <CmdLine>cat whoami.yaml</CmdLine>
          <div className="ab-facts-grid">
            {me.quickFacts.map((fact, i) => {
              const Icon = ICONS[fact.icon]
              const iconColor = i % 2 === 0 ? 'ab-icon-sq--coral' : 'ab-icon-sq--cyan'
              return (
                <div key={fact.label} className="ab-fact-card">
                  <div className={`ab-icon-sq ${iconColor}`}>
                    {Icon && <Icon size={16} />}
                  </div>
                  <div className="ab-fact-content">
                    <span className="ab-fact-label">{fact.label}</span>
                    <span className="ab-fact-sublabel">{fact.sublabel}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 3 — languages.i18n — spoken                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="languages.i18n" subtitle="spoken" />
        <div className="hc-panel__body">
          <CmdLine>locale -a</CmdLine>
          <div className="ab-langs-grid">
            {me.languages.map((lang, i) => {
              const langColor = i % 2 === 0 ? 'ab-icon-sq--coral' : 'ab-icon-sq--cyan'
              return (
                <div key={lang.name} className="ab-lang-card">
                  <div className={`ab-icon-sq ${langColor}`}>
                    <Languages size={16} />
                  </div>
                  <div className="ab-lang-content">
                    <span className="ab-lang-name">{lang.name}</span>
                    <span className="ab-lang-level">{lang.level}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 4 — education.md — uni + courses                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="education.md" subtitle="uni + courses" />
        <div className="hc-panel__body">
          <CmdLine>cat education.md</CmdLine>
          <div className="ab-edu-grid">
            <div className="ab-edu-degree">
              {me.education.map((edu, i) => (
                <div key={i} className="ab-degree-card">
                  <div className="ab-icon-sq ab-icon-sq--coral"><GraduationCap size={18} /></div>
                  <span className="ab-degree-institution">{edu.institution}</span>
                  <span className="ab-degree-name">{edu.degree}</span>
                  <span className="ab-degree-meta">{edu.year}</span>
                  {edu.details && <span className="ab-degree-meta">{edu.details}</span>}
              </div>
            ))}
            </div>
            <div className="ab-edu-courses">
              <div className="ab-courses-header">
                <span className="ab-courses-prompt">$</span>
                <span className="ab-courses-cmd">ls ./courses</span>
                <span className="ab-courses-count">// {me.courses.length} items</span>
              </div>
              <div className="ab-courses-list">
                {me.courses.map((c) => (
                  <span key={c.name} className="pill-neutral-inline">{c.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 5 — journey.log — entries                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome
          filename="journey.log"
          subtitle={`${JOURNEY.length} entries`}
        />
        <div className="hc-panel__body">
          <CmdLine>git log --all --oneline</CmdLine>
          <div className="ab-timeline">
            {JOURNEY.map((entry, i) => {
              const ts = TYPE_STYLES[entry.type] || TYPE_STYLES.experience
              return (
                <div key={i} className="ab-timeline-item">
                  <div className="ab-timeline-meta">
                    <span className="ab-timeline-date">{entry.date}</span>
                    <span className={ts.className}>{ts.label}</span>
                  </div>
                  <h3 className="ab-timeline-title">{entry.title}</h3>
                  <p className="ab-timeline-desc">{entry.description}</p>
                  {entry.link && (
                    <a href={entry.link} target="_blank" rel="noreferrer" className="ab-timeline-link">
                      View details <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 6 — stack.json — N entries                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 24 }}>
        <PanelChrome filename="stack.json" subtitle={`${totalSkills} entries`} />
        <div className="hc-panel__body">
          <CmdLine>cat stack.json</CmdLine>

          <div className="ab-stack-header">
            <AsciiArt art={ART.STACK} color="var(--cyan)" glow="var(--cyan-glow)" />
            <pre className="ab-env-box" aria-hidden="true">{ART.ENV_BOX}</pre>
          </div>

          <div className="ab-divider">
            <span>◆ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─</span>
          </div>

          <div className="ab-skills-grid">
            {SKILL_CATEGORIES.map((cat) => (
              <div key={cat.key} className="ab-skill-category">
                <div className="ab-skill-header">
                  <span className="ab-skill-triangle">▸</span>
                  <span className="ab-skill-name">{cat.label}</span>
                  <span className="ab-skill-count">// {cat.items.length} entries</span>
                </div>
                <div className="ab-skill-pills">
                  {cat.items.map((s) => (
                    <span key={s} className="pill-neutral-inline">{s}</span>
            ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 7 — milestones.log — achievements / publications / certs */}
      {/* ══════════════════════════════════════════════════════════ */}
      <div className="hc-panel" style={{ marginBottom: 24 }}>
        <PanelChrome filename="milestones.log" subtitle={`${me.milestones.length} entries`} />
        <div className="hc-panel__body">
          <CmdLine>ls ./achievements &amp;&amp; ls ./publications &amp;&amp; ls ./certs</CmdLine>
          <div className="achv-banner">
            <AsciiArt art={ART.ACHIEVED} color="var(--coral)" glow="var(--coral-glow)" />
            <AsciiArt art={ART.TROPHY} color="var(--gold)" fontSize="10px" hideOnMobile={false} />
          </div>
          <div className="ab-milestones-grid">
            {me.milestones.map((ms, i) => {
              const iconColor = i % 2 === 0 ? 'ab-icon-sq--coral' : 'ab-icon-sq--cyan'
              const Icon = ms.type === 'award' ? Trophy : ms.type === 'publication' ? FileText : Award
              return (
                <div key={i} className="ab-milestone-card">
                  <div className="ab-milestone-top">
                    <div className={`ab-icon-sq ${iconColor}`}>
                      <Icon size={16} />
                    </div>
                    <span className="ab-milestone-type">// {ms.type}</span>
                  </div>
                  <span className="ab-milestone-title">{ms.title}</span>
                  <span className="ab-milestone-org">{ms.org}</span>
                  <span className="ab-milestone-year">{ms.year}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

    </div>
  )
}
