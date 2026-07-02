import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--coral)', fontFamily: 'var(--font-mono)', fontSize: 18 }}>
        bash: command not found
      </p>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>the page you're looking for doesn't exist.</p>
      <Link to="/" style={{ color: 'var(--cyan)', display: 'inline-block', marginTop: 24 }}>
        $ cd ~
      </Link>
    </div>
  )
}
