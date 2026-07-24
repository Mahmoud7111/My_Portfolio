import { COMMANDS } from '../../data/commands'

export default function Help({ onCommandClick }) {
  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 10 }}>
        // Available commands — <span style={{ color: 'var(--cyan)' }}>click any row to execute</span>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {COMMANDS.map((c) => (
          <div
            key={c.id}
            className="cmd-line cursor-interactive"
            onClick={() => onCommandClick?.(c.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onCommandClick?.(c.id)
              }
            }}
            aria-label={`Run command: ${c.id}`}
          >
            <span className="cmd-name">
              <span className="cmd-dollar">$</span> {c.id}
            </span>
            <span className="cmd-desc">{c.desc}</span>
            <span className="cmd-run-badge">run ↵</span>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--text-muted)', marginTop: 12, fontSize: 12 }}>
        // Tip: Navigation tabs at top of screen take you to the same views.
      </p>
    </div>
  )
}
