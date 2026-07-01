import { me } from '../../data/me'

export default function Achievements() {
  return (
    <div className="cmd-output">
      {me.achievements.map((a, i) => (
        <p key={i}>
          <span style={{ color: 'var(--gold)' }}>★</span> {a.title}{' '}
          <span style={{ color: 'var(--text-muted)' }}>
            — {a.org} · {a.year}
          </span>
        </p>
      ))}
    </div>
  )
}
