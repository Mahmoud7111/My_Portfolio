import { COMMANDS } from '../../data/commands'

export default function Help({ onCommandClick }) {
  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
        Available commands — <span style={{ color: 'var(--cyan)' }}>click any row</span>, or type the command into the terminal below.
      </p>
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
          style={{ display: 'flex', gap: 16 }}
        >
          <span className="cmd-name" style={{ minWidth: 160 }}>
            {c.id}
          </span>
          <span className="cmd-desc">{c.desc}</span>
        </div>
      ))}
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
        Tip: if the terminal feels unfamiliar, the navigation tabs at the top of the window take you to the same pages the commands open.
      </p>
    </div>
  )
}
