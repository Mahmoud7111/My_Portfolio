import { useState } from 'react'
import { Download, ExternalLink, MapPin, Briefcase, Coffee, Music, Layers, Cpu, Code, Languages, GraduationCap, Award, FileText, Trophy, Filter } from 'lucide-react'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'
import { JOURNEY } from '../data/journey'
import RevealOnScroll from '../components/ui/RevealOnScroll'
import TypingLine from '../components/ui/TypingLine'
import TypewriterLoop from '../components/ui/TypewriterLoop'
import { useResumeAchievement } from '../hooks/useResumeAchievement'

const ICONS = { MapPin, Briefcase, Coffee, Music, Layers, Cpu, Code }

const TYPE_STYLES = {
  experience:    { className: 'ab-type-pill ab-type-pill--cyan',      label: 'Professional experience' },
  certification: { className: 'ab-type-pill ab-type-pill--neutral',   label: 'Certification' },
  award:         { className: 'ab-type-pill ab-type-pill--gold',      label: 'Award' },
  education:     { className: 'ab-type-pill ab-type-pill--coral',     label: 'Education' },
}

const SKILL_CATEGORIES = [
  { key: 'languages',  label: 'Languages',  items: me.skills.languages },
  { key: 'frameworks', label: 'Frameworks', items: me.skills.frameworks },
  { key: 'ai_tools',   label: 'AI Tools',   items: me.skills.ai_tools },
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

function CmdLine({ cmd, arg }) {
  return (
    <>
      {cmd && <span className="hc-cmd">{cmd}</span>}
      {arg && <span className="hc-var">{arg}</span>}
    </>
  )
}

export default function AboutContent() {
  const onResumeClick = useResumeAchievement()
  const [journeyFilter, setJourneyFilter] = useState(new Set())
  return (
    <div className="ab-root">

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 1 — about.md — bio                                  */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="about.md" subtitle="bio" />
        <div className="hc-panel__body">
          <TypingLine text="cat about.md">
            <CmdLine cmd="cat" arg="about.md" />
          </TypingLine>

          <AsciiArt art={ART.ABOUT_ME} color="var(--cyan)" glow="var(--cyan-glow)" />

          <div className="ab-bio-grid">
            <div className="ab-bio-main">
              <h1 className="ab-bio-heading">
                <span className="ab-bio-prefix">Hi, I&apos;m{' '}</span>
                <TypewriterLoop
                  strings={[
                    'Mahmoud Sayed',
                    'Software & AI Engineer',
                    'CS Student @ MIU',
                    'Builder of Things That Matter',
                  ]}
                  speed={70}
                  deleteSpeed={35}
                  pause={911}
                />
              </h1>
              <p className="ab-bio-text">{me.bio}</p>
              <p className="ab-bio-hobbies">{me.hobbiesLine}</p>
              <a
                href={me.resumeUrl}
                download
                className="ab-download-btn"
                onClick={onResumeClick}
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
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 2 — journey.log — entries                           */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome
          filename="journey.log"
          subtitle={`${JOURNEY.length} entries`}
        />
        <div className="hc-panel__body">
          <TypingLine text="git log --all --oneline">
            <CmdLine cmd="git log --all" arg="--oneline" />
          </TypingLine>
          <div className="ab-timeline-filter-label">
            <Filter size={12} />
            <span>Filter Timeline:</span>
          </div>
          <div className="ab-timeline-filters">
            {Object.keys(TYPE_STYLES).map((t) => {
              const active = journeyFilter.size === 0 || journeyFilter.has(t)
              return (
                <button
                  key={t}
                  className={`ab-timeline-filter${active ? ' ab-timeline-filter--active' : ''}`}
                  onClick={() => {
                    setJourneyFilter((prev) => {
                      const next = new Set(prev)
                      if (next.has(t)) {
                        next.delete(t)
                      } else {
                        next.add(t)
                      }
                      return next
                    })
                  }}
                >
                  <span className="ab-timeline-filter__check">{active ? '[✓]' : '[ ]'}</span>
                  {TYPE_STYLES[t].label}
                </button>
              )
            })}
            </div>
          <div className="ab-timeline">
            {JOURNEY
              .filter((e) => journeyFilter.size === 0 || journeyFilter.has(e.type))
              .map((entry, i) => {
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
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 3 — stack.json — N entries                          */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="stack.json" subtitle={`${totalSkills} entries`} />
        <div className="hc-panel__body">
          <TypingLine text="cat stack.json">
            <CmdLine cmd="cat" arg="stack.json" />
          </TypingLine>

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
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 4 — milestones.log — achievements / publications / certs */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="milestones.log" subtitle={`${me.milestones.length} entries`} />
        <div className="hc-panel__body">
          <TypingLine text="ls ./achievements && ls ./publications && ls ./certs">
            <span className="hc-cmd">ls </span>
            <span className="hc-var">./achievements</span>
            <span className="hc-cmd"> && ls </span>
            <span className="hc-var">./publications</span>
            <span className="hc-cmd"> && ls </span>
            <span className="hc-var">./certs</span>
          </TypingLine>
          <div className="achv-banner">
            <AsciiArt art={ART.ACHIEVED} color="var(--coral)" glow="var(--coral-glow)" />
            <AsciiArt art={ART.TROPHY} color="var(--gold)" fontSize="11px" hideOnMobile={false} />
          </div>
          <div className="ab-milestones-grid">
            {me.milestones.map((ms, i) => {
              const colorMap = { award: 'coral', publication: 'cyan', certification: 'cyan' }
              const typeColor = colorMap[ms.type] || 'cyan'
              const Icon = ms.type === 'award' ? Trophy : ms.type === 'publication' ? FileText : Award
              return (
                <div key={i} className={`ab-milestone-card ab-milestone-card--${typeColor}`}>
                  <div className="ab-milestone-top">
                    <div className={`ab-icon-sq ab-icon-sq--${typeColor}`}>
                      <Icon size={16} />
                    </div>
                    <span className={`ab-milestone-type ab-milestone-type--${typeColor}`}>// {ms.type}</span>
                  </div>
                  <span className="ab-milestone-title">◈ {ms.title}</span>
                  <span className="ab-milestone-org">{ms.org}</span>
                  <span className="ab-milestone-year">{ms.year}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 5 — education.md — uni + courses                    */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="education.md" subtitle="uni + courses" />
        <div className="hc-panel__body">
          <TypingLine text="cat education.md">
            <CmdLine cmd="cat" arg="education.md" />
          </TypingLine>
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
                <span className="ab-courses-cmd">ls</span>
                <span className="hc-var">./courses</span>
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
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 6 — whoami.yaml — quick facts                       */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 40 }}>
        <PanelChrome filename="whoami.yaml" subtitle="quick facts" />
        <div className="hc-panel__body">
          <TypingLine text="cat whoami.yaml">
            <CmdLine cmd="cat" arg="whoami.yaml" />
          </TypingLine>
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
      </RevealOnScroll>

      {/* ══════════════════════════════════════════════════════════ */}
      {/* PANEL 7 — languages.i18n — spoken                         */}
      {/* ══════════════════════════════════════════════════════════ */}
      <RevealOnScroll>
      <div className="hc-panel" style={{ marginBottom: 24 }}>
        <PanelChrome filename="languages.i18n" subtitle="spoken" />
        <div className="hc-panel__body">
          <TypingLine text="locale -a">
            <CmdLine cmd="locale" arg="-a" />
          </TypingLine>
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
      </RevealOnScroll>

    </div>
  )
}
