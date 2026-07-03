import { useState } from 'react'
import { ExternalLink, Search, Star } from 'lucide-react'
import { GithubIcon } from '../components/ui/BrandIcons'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { PROJECTS, ALL_TAGS } from '../data/projects'

const TAG_TO_EXT = {
  python: '.py',
  rust: '.rs',
  typescript: '.ts',
  javascript: '.js',
  go: '.go',
  ruby: '.rb',
  java: '.java',
}

export default function ProjectsContent() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = PROJECTS.filter((p) => {
    const matchesTag = activeFilter === 'all' || p.tags.includes(activeFilter)
    const q = query.trim().toLowerCase()
    const matchesQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    return matchesTag && matchesQuery
  })

  return (
    <div className="projects-page tab-content-inner">
      <AsciiArt art={ART.PROJECTS} color="var(--coral)" glow="var(--coral-glow)" />

      {/* ── Shell opener ───────────────────────── */}
      <div style={{ marginTop: 24, marginBottom: 20 }}>
        <span style={mono(13, 'var(--coral)')}>$ </span>
        <span style={mono(13, 'var(--text-muted)')}>find </span>
        <span style={mono(13, 'var(--cyan)')}>
          ./projects -type d -name &quot;*&quot;
        </span>
        <span style={{ ...mono(13, 'var(--text-dim)'), marginLeft: 10 }}>
          // {PROJECTS.length} repositories
        </span>
      </div>

      {/* ── ASCII folder + scanning log ────────── */}
      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap', marginBottom: 16 }}>
        <pre style={asciiStyle()}>
{`┌──────┐
│      └────────────────┐
│   ./projects          │
│                       │
│    ▸ neural-router/   │
│    ▸ vector-cache/    │
│    ▸ ...              │
└───────────────────────┘`}
        </pre>
        <pre style={scanStyle()}>
{`> scanning tree ...
> indexed ${PROJECTS.length} repos in 0.04s
> filter by tag or grep below`}
        </pre>
      </div>

      {/* ── ASCII rule ─────────────────────────── */}
      <div style={{ borderTop: '1px solid #262630', marginBottom: 16 }} />

      {/* ── Filter chips + grep ────────────────── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
        {ALL_TAGS.map((tag) => {
          const isActive = activeFilter === tag
          return (
            <button
              key={tag}
              onClick={() => setActiveFilter(tag)}
              style={chipStyle(isActive)}
            >
              --{tag}
            </button>
          )
        })}
        <div style={{ flex: 1, minWidth: 12 }} />
        <div style={searchBoxStyle()}>
          <Search size={14} style={{ color: 'var(--text-dim)', flexShrink: 0, ...mono(12) }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="grep ..."
            style={searchInputStyle()}
          />
        </div>
      </div>

      {/* ── Cards ──────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={String(i + 1).padStart(2, '0')} />
        ))}
      </div>

      {/* ── Empty state ────────────────────────── */}
      {filtered.length === 0 && (
        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <span style={mono(13, 'var(--coral)')}>$ </span>
          <span style={mono(13, 'var(--text-muted)')}>no matches. try another query.</span>
        </div>
      )}
    </div>
  )
}

function ProjectCard({ project, index }) {
  const firstTag = project.tags.find((t) => TAG_TO_EXT[t])
  const ext = firstTag ? TAG_TO_EXT[firstTag] : ''

  return (
    <article className="project-row-card">
      <div className="project-row-card__inner">
        {/* ── Gutter ── */}
        <div className="project-row-card__gutter">
          <span className="gutter-bracket">[</span>
          <span className="gutter-index">{index}</span>
          <span className="gutter-bracket">]</span>
        </div>

        {/* ── Image ── */}
        <div className="project-row-card__image">
          <div className="project-row-card__image-wrap">
            {project.image ? (
              <>
                <img src={project.image} alt={project.name} loading="lazy" />
                <div className="project-row-card__image-overlay" />
              </>
            ) : (
              <div className="project-row-card__no-preview">
                <span>[ no preview ]</span>
              </div>
            )}
            {ext && <span className="project-lang-badge">{ext}</span>}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="project-row-card__content">
          {/* Path line */}
          <div className="project-path">
            <span className="project-path-prefix">~/projects/</span>
            <span className="project-path-name">{project.name}</span>
            <span className="project-path-meta">
              {'{'}{project.branch}{'} '}
              <span className="project-path-dot" />
              {project.updated && (
                <span style={{ marginLeft: 8 }}>· {project.updated}</span>
              )}
            </span>
          </div>

          {/* Description */}
          <p className="project-desc">
            <span className="project-desc-prefix">&gt;</span>
            {project.desc}
          </p>

          {/* Tags */}
          <div className="project-tag-pills">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag-pill">
                {tag}
              </span>
            ))}
          </div>

          {/* Meta + actions */}
          <div className="project-meta-actions">
            <div className="project-meta-left">
              {project.stars !== undefined && (
                <span className="project-stars">
                  <Star size={11} />
                  {project.stars}
                </span>
              )}
              {project.status && (
                <span className="project-status">
                  <span className="project-status-dot" />
                  {project.status}
                </span>
              )}
            </div>

            <div className="project-actions-right">
              <span className="project-open-hint">
                <kbd>↵</kbd>
                open
              </span>
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-source"
                >
                  <GithubIcon size={12} /> source
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-live"
                >
                  <ExternalLink size={12} /> live
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

/* ── Inline style helpers ───────────────────────────── */

function mono(size, color) {
  return { fontFamily: 'var(--font-mono)', fontSize: size, color, lineHeight: 1.5 }
}

function asciiStyle() {
  return {
    color: '#888899',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    lineHeight: 1.6,
    margin: 0,
  }
}

function scanStyle() {
  return {
    color: 'var(--text-dim)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    lineHeight: 1.6,
    margin: 0,
    flex: 1,
  }
}

function chipStyle(isActive) {
  return {
    background: isActive ? 'var(--cyan)' : '#1a1a22',
    color: isActive ? '#0c0c10' : 'var(--text-body)',
    border: `1px solid ${isActive ? 'var(--cyan)' : '#262630'}`,
    borderRadius: 'var(--radius-md)',
    padding: '5px 12px',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    cursor: 'pointer',
    transition: 'all 150ms ease',
    lineHeight: 1.5,
  }
}

function searchBoxStyle() {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#1a1a22',
    border: '1px solid #262630',
    borderRadius: 'var(--radius-md)',
    padding: '5px 12px',
    minWidth: 220,
  }
}

function searchInputStyle() {
  return {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: 'var(--text-body)',
    fontFamily: 'var(--font-mono)',
    fontSize: 12,
    width: '100%',
    padding: 0,
    lineHeight: 1.5,
  }
}
