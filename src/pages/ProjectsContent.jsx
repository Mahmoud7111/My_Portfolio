import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ExternalLink, Search, SlidersHorizontal, Star, MapPin } from 'lucide-react'
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
  const [filtersOpen, setFiltersOpen] = useState(false)
  const hasActiveFilter = activeFilter !== 'all'

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

        {/* Mobile toggle button — hidden on desktop via CSS */}
        <button
          className={`projects-filter-toggle${filtersOpen ? ' projects-filter-toggle--open' : ''}${hasActiveFilter ? ' projects-filter-toggle--active' : ''}`}
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          aria-controls="projects-chip-panel"
        >
          <SlidersHorizontal size={13} />
          <span>filter{hasActiveFilter ? `: --${activeFilter}` : 's'}</span>
          {hasActiveFilter && <span className="projects-filter-toggle__badge" />}
          <ChevronDown size={12} className="projects-filter-toggle__chevron" />
        </button>

        <div
          id="projects-chip-panel"
          className={`projects-chips projects-chips--grouped${filtersOpen ? ' projects-chips--open' : ''}`}
          data-testid="projects-chips"
        >
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
                    onClick={() => {
                      setActiveFilter(activeFilter === tag ? 'all' : tag)
                      setFiltersOpen(false)
                    }}
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
  const [selfPopup, setSelfPopup] = useState(false)
  const popupRef = useRef(null)
  const firstTag = project.tags.find((t) => TAG_TO_EXT[t])
  const ext = firstTag ? TAG_TO_EXT[firstTag] : ''

  // Close popup on outside click
  useEffect(() => {
    if (!selfPopup) return
    const handler = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setSelfPopup(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [selfPopup])

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
              {'{' + project.branch + '} '}
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
                <div className="btn-live-wrapper" ref={project.isSelf ? popupRef : null}>
                  {project.isSelf ? (
                    <button
                      className="btn-live btn-live--self"
                      onClick={() => {
                        setSelfPopup((v) => !v)
                        unlock('already-here')
                      }}
                      aria-expanded={selfPopup}
                    >
                      <MapPin size={12} /> live
                    </button>
                  ) : (
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

                  <AnimatePresence>
                    {selfPopup && (
                      <>
                        {/* Tap-to-close backdrop — mobile only (CSS hides on desktop) */}
                        <motion.div
                          className="self-popup__backdrop"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          onClick={() => setSelfPopup(false)}
                        />
                        <motion.div
                          className="self-popup"
                          initial={{ opacity: 0, y: 8, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                          <div className="self-popup__scanlines" />
                          <div className="self-popup__header">
                            <span className="self-popup__dot self-popup__dot--red" />
                            <span className="self-popup__dot self-popup__dot--yellow" />
                            <span className="self-popup__dot self-popup__dot--green" />
                            <span className="self-popup__title">locate: live-url</span>
                            <button
                              className="self-popup__close"
                              onClick={() => setSelfPopup(false)}
                              aria-label="Close"
                            >✕</button>
                          </div>
                          <div className="self-popup__body">
                            <p className="self-popup__line self-popup__line--cmd">
                              <span className="self-popup__prompt">$</span>
                              <span className="self-popup__glitch" data-text="open --url live">open --url live</span>
                            </p>
                            <p className="self-popup__line">
                              <span className="self-popup__label">resolving</span>
                              <span className="self-popup__value">{window.location.origin}</span>
                            </p>
                            <p className="self-popup__line self-popup__line--warn">
                              <span className="self-popup__icon">◈</span>
                              <span>location match detected</span>
                            </p>
                            <p className="self-popup__line self-popup__line--success">
                              <span className="self-popup__icon">✓</span>
                              <span className="self-popup__big">you're already here!</span>
                            </p>
                            <p className="self-popup__line self-popup__line--muted">
                              <span className="self-popup__icon">↳</span>
                              <span>no redirect needed, enjoy the visit</span>
                            </p>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
