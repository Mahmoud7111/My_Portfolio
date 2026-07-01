import { me } from '../../data/me'

export default function Contact() {
  return (
    <div className="cmd-output">
      <p>
        <span style={{ color: 'var(--text-muted)' }}>--email</span>{' '}
        <a href={`mailto:${me.email}`} style={{ color: 'var(--cyan)' }}>
          {me.email}
        </a>
      </p>
      <p style={{ marginTop: 6, color: 'var(--text-muted)' }}>
        or use the full form → <a href="/contact" style={{ color: 'var(--cyan)' }}>/contact</a>
      </p>
    </div>
  )
}
