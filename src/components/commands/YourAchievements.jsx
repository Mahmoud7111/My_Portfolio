import { useAchievements } from '../../hooks/useAchievements'

export default function YourAchievements() {
  const { all, isUnlocked, progress } = useAchievements()

  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
        // {progress} unlocked
      </p>
      {all.map((a) => {
        const unlocked = isUnlocked(a.id)
        return (
          <p key={a.id} style={{ opacity: unlocked ? 1 : 0.4 }}>
            <span style={{ color: unlocked ? 'var(--cyan)' : 'var(--text-dim)' }}>
              {unlocked ? '[x]' : '[ ]'}
            </span>{' '}
            <span style={{ color: 'var(--text-heading)' }}>{a.name}</span>{' '}
            <span style={{ color: 'var(--text-muted)' }}>— {a.desc}</span>
          </p>
        )
      })}
    </div>
  )
}
