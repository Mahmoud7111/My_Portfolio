import { me } from '../../data/me'

export default function Courses() {
  return (
    <div className="cmd-output">
      {me.courses.map((c, i) => (
        <p key={i}>
          <span style={{ color: 'var(--coral)' }}>▸</span> {c.name}{' '}
          <span style={{ color: 'var(--text-muted)' }}>— {c.provider}</span>
        </p>
      ))}
    </div>
  )
}
