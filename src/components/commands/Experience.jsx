import { me } from '../../data/me'

export default function Experience() {
  return (
    <div className="cmd-output">
      {me.experience.map((job, i) => (
        <div key={i} style={{ 
          marginBottom: 14, 
          paddingBottom: 14, 
          borderBottom: i !== me.experience.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none' 
        }}>
          <p>
            <span style={{ color: 'var(--text-heading)' }}>{job.role}</span>{' '}
            <span style={{ color: 'var(--coral)' }}>@</span>{' '}
            <span style={{ color: 'var(--cyan)' }}>{job.org}</span>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>{job.period}</p>
          <ul style={{ marginTop: 4, paddingLeft: 18 }}>
            {job.bullets.map((b, j) => (
              <li key={j} style={{ color: 'var(--text-body)', listStyle: 'disc', marginBottom: 4 }}>
                {b}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
