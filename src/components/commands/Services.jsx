import { me } from '../../data/me'

export default function Services() {
  return (
    <div className="cmd-output">
      {/* header callout */}
      <div style={{
        marginBottom: 14,
        padding: '5px 10px',
        background: 'rgba(255, 108, 96, 0.06)',
        borderLeft: '2px solid var(--coral)',
        borderRadius: '0 3px 3px 0',
        display: 'inline-block',
      }}>
        <span style={{ color: 'var(--coral)', fontSize: 11, fontFamily: 'var(--font-mono)', opacity: 0.8 }}>
          // open to freelance · contract · consulting
        </span>
      </div>

      {me.services.map((svc, i) => (
        <div
          key={svc.id}
          style={{
            marginBottom: 0,
            paddingTop: 10,
            paddingBottom: 10,
            borderBottom: i !== me.services.length - 1 ? '1px dashed rgba(255,255,255,0.07)' : 'none',
            display: 'flex',
            gap: 0,
          }}
        >
          {/* gutter */}
          <span style={{
            flexShrink: 0,
            width: 36,
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--coral)',
            opacity: 0.7,
            userSelect: 'none',
          }}>
            [{svc.number || String(i + 1).padStart(2, '0')}]
          </span>

          {/* body */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* $ title --available */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 3 }}>
              <span style={{ color: 'var(--coral)' }}>$</span>
              {' '}
              <span style={{ color: 'var(--text-heading)', fontWeight: 600 }}>{svc.title}</span>
              {svc.badge && (
                <span style={{
                  color: 'var(--coral)',
                  fontSize: 10,
                  marginLeft: 6,
                  padding: '1px 5px',
                  borderRadius: 3,
                  background: 'rgba(224, 108, 117, 0.1)',
                  border: '1px solid rgba(224, 108, 117, 0.25)',
                }}>
                  {svc.badge}
                </span>
              )}
              {' '}
              <span style={{ color: 'var(--text-dim)', fontSize: 11, opacity: 0.45 }}>--available</span>
            </div>

            {/* > desc */}
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 12,
              color: 'var(--text-muted)',
              lineHeight: 1.65,
              marginBottom: 4,
            }}>
              <span style={{ color: 'var(--coral)', opacity: 0.55 }}>&gt;</span>
              {' '}{svc.desc}
            </div>

            {/* stack: ... */}
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
              <span style={{ color: 'var(--cyan)', opacity: 0.7 }}>stack:</span>
              {' '}
              <span style={{ color: 'var(--text-muted)' }}>
                {svc.tags.join(', ')}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* hire line */}
      <div style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
      }}>
        <span style={{ color: 'var(--coral)' }}>$</span>
        {' '}reach out →{' '}
        <a
          href={`mailto:${me.email}`}
          style={{
            color: 'var(--cyan)',
            textDecoration: 'none',
            borderBottom: '1px solid rgba(77, 208, 206, 0.25)',
          }}
        >
          {me.email}
        </a>
      </div>
    </div>
  )
}
