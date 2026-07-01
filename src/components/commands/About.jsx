import { me } from '../../data/me'

export default function About() {
  return (
    <div className="cmd-output">
      <p>
        <span className="cmd-name">{me.name}</span> — {me.title}
      </p>
      <p style={{ marginTop: 8, color: 'var(--text-body)' }}>{me.bio}</p>
      <p style={{ marginTop: 8, color: 'var(--text-muted)' }}>
        loc: {me.location} · status: <span style={{ color: 'var(--cyan)' }}>{me.status}</span>
      </p>
    </div>
  )
}
