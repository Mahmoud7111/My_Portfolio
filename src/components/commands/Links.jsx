import { me } from '../../data/me'

export default function Links() {
  return (
    <div className="cmd-output">
      {me.links.map((l) => (
        <p key={l.label}>
          <span style={{ color: 'var(--text-muted)' }}>--{l.label.toLowerCase()}</span>{' '}
          <a href={l.url} target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>
            {l.url}
          </a>
        </p>
      ))}
    </div>
  )
}
