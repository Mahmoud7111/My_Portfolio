import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Search, Star } from 'lucide-react'
import { GithubIcon } from '../components/ui/BrandIcons'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { PROJECTS, TAG_GROUPS_RESOLVED } from '../data/projects'
import RevealOnScroll from '../components/ui/RevealOnScroll'
import TypingLine from '../components/ui/TypingLine'
import { useAchievements } from '../hooks/useAchievements'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

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
    <div className="projects-page">
      <AsciiArt art={ART.PROJECTS} color="var(--coral)" glow="var(--coral-glow)" />

      {/* ── Shell opener ───────────────────────── */}
      <TypingLine text='find ./projects -type d -name "*"' wrapperClassName="projects-opener">
        <span className="projects-opener__cmd">find </span>
        <span className="projects-opener__arg">./projects -type d -name &quot;*&quot;</span>
      </TypingLine>
      <span className="projects-opener__comment">// {PROJECTS.length} repositories</span>

      {/* ── ASCII folder + scanning log ────────── */}
      <div className="projects-header">
        <pre className="projects-folder">
{`┌──────┐
│      └────────────────┐
│   ./projects          │
│                       │
│   ▸ ${PROJECTS[0]?.name ?? '...'}/
│   ▸ ${PROJECTS[1]?.name ?? '...'}/
│   ▸ ...
└───────────────────────┘`}
        </pre>
        <pre className="projects-scan">
{`> scanning tree ...
> indexed ${PROJECTS.length} repos in 0.04s
> filter by tag or grep below`}
        </pre>
      </div>

      {/* ── ASCII rule ─────────────────────────── */}
      <div className="projects-rule" />

      {/* ── Filter chips + grep ────────────────── */}
      <RevealOnScroll>
      <TypingLine text="grep --tags ./projects" wrapperClassName="projects-opener">
        <span className="projects-opener__cmd">grep --tags </span>
        <span className="projects-opener__arg">./projects</span>
      </TypingLine>
      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={14} className="projects-search__icon" />
          <input
            type="text"
            className="projects-search__input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="grep ..."
          />
        </div>
        <div className="projects-chips projects-chips--grouped" data-testid="projects-chips">
          {TAG_GROUPS_RESOLVED.map((group) => (
            <div
              key={group.id}
              className="projects-chip-group"
              data-group={group.id}
            >
              <span className="projects-chip-group__label">
                {group.label.toLowerCase()}:
              </span>
              <div className="projects-chip-group__items">
                {group.tags.map((tag) => (
                  <button
                    key={tag}
                    className={`projects-chip${activeFilter === tag ? ' projects-chip--active' : ''}`}
                    onClick={() => setActiveFilter(activeFilter === tag ? 'all' : tag)}
                  >
                    --{tag}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      </RevealOnScroll>

      {/* ── Cards ──────────────────────────────── */}
      <TypingLine text="ls -la ./projects" wrapperClassName="projects-opener">
        <span className="projects-opener__cmd">ls -la </span>
        <span className="projects-opener__arg">./projects</span>
      </TypingLine>
      <CardList filtered={filtered} />

      {/* ── Empty state ────────────────────────── */}
      {filtered.length === 0 && (
        <div className="projects-empty">
          <span className="projects-empty__prompt">$ </span>
          <span className="projects-empty__text">no matches. try another query.</span>
        </div>
      )}

      {/* ── View more on GitHub ────────────────── */}
      <RevealOnScroll>
        <div className="projects-github-cta">
          <a
            href="https://github.com/Mahmoud7111"
            target="_blank"
            rel="noreferrer"
            className="projects-github-btn"
          >
            <GithubIcon size={15} />
            <span>$ view more on github</span>
          </a>
        </div>
      </RevealOnScroll>
    </div>
  )
}

/**
 * CardList — each card reveals individually as it scrolls into view.
 */
function CardList({ filtered }) {
  const prefersReduced = usePrefersReducedMotion()

  if (prefersReduced) {
    return (
      <div className="projects-cards">
        {filtered.map((p, i) => (
          <ProjectCard key={p.name} project={p} index={String(i + 1).padStart(2, '0')} />
        ))}
      </div>
    )
  }

  return (
    <div className="projects-cards">
      {filtered.map((p, i) => (
        <motion.div
          key={p.name}
          initial={{ opacity: 0, y: 32, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
        >
          <ProjectCard project={p} index={String(i + 1).padStart(2, '0')} />
        </motion.div>
      ))}
    </div>
  )
}

function ProjectCard({ project, index }) {
  const { unlock } = useAchievements()
  const firstTag = project.tags.find((t) => TAG_TO_EXT[t])
  const ext = firstTag ? TAG_TO_EXT[firstTag] : ''

  return (
    <article className="project-row-card">
      <div className="project-row-card__inner">
        <div className="project-row-card__gutter">
          <span className="gutter-bracket">[</span>
          <span className="gutter-index">{index}</span>
          <span className="gutter-bracket">]</span>
        </div>

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

        <div className="project-row-card__content">
          <div className="project-path">
            <span className="project-path-prefix">~/projects/</span>
            <span className="project-path-name">{project.name}</span>
            <span className="project-path-meta">
              {'{'}{project.branch}{'} '}
              <span className="project-path-dot" />
              {project.updated && (
                <span className="project-path-date">· {project.updated}</span>
              )}
            </span>
          </div>

          <p className="project-desc">
            <span className="project-desc-prefix">&gt;</span>
            {project.desc}
          </p>

          <div className="project-tag-pills">
            {project.tags.map((tag) => (
              <span key={tag} className="project-tag-pill">
                {tag}
              </span>
            ))}
          </div>

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
                  onClick={() => unlock('demo-explorer')}
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
