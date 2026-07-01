import { me } from '../../data/me'

export default function Education() {
  return (
    <div className="cmd-output">
      {me.education.map((ed, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <p style={{ color: 'var(--text-heading)' }}>{ed.degree}</p>
          <p style={{ color: 'var(--cyan)' }}>{ed.institution}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            {ed.year} · {ed.details}
          </p>
        </div>
      ))}
    </div>
  )
}
