import { JOURNEY } from '../../data/journey'

export default function Timeline() {
  return (
    <div className="cmd-output">
      {JOURNEY.map((entry, i) => (
        <p key={i}>
          <span style={{ color: 'var(--text-muted)' }}>{entry.date}</span>{' '}
          <span style={{ color: 'var(--coral)' }}>▸</span>{' '}
          <span style={{ color: 'var(--text-heading)' }}>{entry.title}</span>{' '}
          <span style={{ color: 'var(--cyan)' }}>· {entry.type}</span>
        </p>
      ))}
    </div>
  )
}
