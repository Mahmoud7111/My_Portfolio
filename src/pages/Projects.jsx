import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '../components/ui/BrandIcons'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { projects, categories } from '../data/projects'

export default function Projects() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? projects : projects.filter((p) => p.category === filter)

  return (
    <div className="projects-page container">
      <AsciiArt art={ART.PROJECTS} color="var(--coral)" glow="var(--coral-glow)" />

      <div className="filter-row">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-chip ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            --{cat}
          </button>
        ))}
      </div>

      <div className="projects-grid">
        {filtered.map((p) => (
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
            <div style={{ display: 'flex', gap: 14, marginTop: 14 }}>
              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer" className="project-link">
                  <GithubIcon size={13} /> code
                </a>
              )}
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer" className="project-link">
                  <ExternalLink size={13} /> live
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
