import { me } from '../../data/me'

export default function Freelance() {
  return (
    <div className="cmd-output">
      {me.freelance.map((f, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <span className="cmd-name">{f.name}</span>{' '}
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            — {f.client} · {f.year}
          </span>
          <p style={{ color: 'var(--text-body)' }}>{f.description}</p>
        </div>
      ))}
    </div>
  )
}
