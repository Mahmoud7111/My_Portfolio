import { COMMANDS } from '../../data/commands'

export default function Help({ onCommandClick }) {
  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>Available commands  (You can type them in the terminal or click on the command to input it):</p>
      {COMMANDS.map((c) => (
        <div
          key={c.id}
          className="cmd-line cursor-interactive"
          onClick={() => onCommandClick?.(c.id)}
          style={{ display: 'flex', gap: 16 }}
        >
          <span className="cmd-name" style={{ minWidth: 160 }}>
            {c.id}
          </span>
          <span className="cmd-desc">{c.desc}</span>
        </div>
      ))}
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Type any command to see more information.</p>
    </div>
  )
}
