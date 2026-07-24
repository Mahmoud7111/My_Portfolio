import { me } from '../../data/me'

const TYPE_COLOR = {
  award: 'var(--coral)',
  certification: 'var(--cyan)',
  publication: 'var(--cyan)',
}

export default function Achievements() {
  return (
    <div className="cmd-output">
      {me.milestones.map((m, i) => (
        <p key={i}>
          <span style={{ color: TYPE_COLOR[m.type] || 'var(--gold)' }}>★</span> {m.title}{' '}
          <span style={{ color: 'var(--text-muted)' }}>
            — {m.org} · {m.year}
          </span>
        </p>
      ))}
    </div>
  )
}
