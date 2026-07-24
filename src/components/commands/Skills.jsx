import { me } from '../../data/me'

const GROUPS = [
  { key: 'webDevelopment', label: 'web development' },
  { key: 'languages', label: 'languages' },
  { key: 'ai', label: 'ai' },
  { key: 'aiTools', label: 'ai tools' },
  { key: 'additional', label: 'additional' },
]

export default function Skills() {
  return (
    <div className="cmd-output">
      {GROUPS.map((g) => (
        <div key={g.key} style={{ marginBottom: 10 }}>
          <span style={{ color: 'var(--cyan)' }}>--{g.label}</span>
          <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(me.skills[g.key] || []).map((skill) => (
              <span key={skill} className="pill-neutral-inline">
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
