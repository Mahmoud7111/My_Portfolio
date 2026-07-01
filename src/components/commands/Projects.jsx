import { projects } from '../../data/projects'

export default function Projects() {
  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
        // {projects.length} repositories found.
      </p>
      {projects.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <span className="cmd-name">{p.name}</span>
          <p style={{ color: 'var(--text-body)' }}>{p.description}</p>
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
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
