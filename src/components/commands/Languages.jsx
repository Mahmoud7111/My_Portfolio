import { me } from '../../data/me'

export default function Languages() {
  return (
    <div className="cmd-output">
      {me.languages.map((l, i) => (
        <p key={i}>
          <span style={{ color: 'var(--cyan)' }}>{l.name}</span>{' '}
          <span style={{ color: 'var(--text-muted)' }}>— {l.level}</span>
        </p>
      ))}
    </div>
  )
}
