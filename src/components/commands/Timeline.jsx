import { me } from '../../data/me'

export default function Timeline() {
  const items = [
    ...me.experience.map((e) => ({ year: e.period, label: e.role, org: e.org })),
    ...me.education.map((e) => ({ year: e.year, label: e.degree, org: e.institution })),
  ]

  return (
    <div className="cmd-output">
      {items.map((item, i) => (
        <p key={i}>
          <span style={{ color: 'var(--text-muted)' }}>{item.year}</span>{' '}
          <span style={{ color: 'var(--coral)' }}>▸</span>{' '}
          <span style={{ color: 'var(--text-heading)' }}>{item.label}</span>{' '}
          <span style={{ color: 'var(--cyan)' }}>@ {item.org}</span>
        </p>
      ))}
    </div>
  )
}
