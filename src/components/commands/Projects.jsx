import { PROJECTS } from '../../data/projects'

export default function Projects() {
  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
        // {PROJECTS.length} repositories found.
      </p>
      {PROJECTS.map((p, i) => (
        <div key={p.name} style={{ 
          marginBottom: 12, 
          paddingBottom: 12,
          borderBottom: i !== PROJECTS.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none'
        }}>
          <span className="cmd-name">{p.name}</span>
          <p style={{ color: 'var(--text-body)' }}>{p.desc}</p>
          <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
            {p.tags.map((t) => (
              <span key={t} className="pill-coral-inline">
                {t}
              </span>
            ))}
          </div>
        </div>
      ))}
      <p style={{ color: 'var(--text-muted)' }}>
        view full gallery → <a href="/projects" style={{ color: 'var(--cyan)' }}>/projects</a>
      </p>
    </div>
  )
}
