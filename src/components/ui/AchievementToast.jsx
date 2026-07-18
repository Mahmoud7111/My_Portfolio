import { useEffect } from 'react'
import { motion } from 'framer-motion'

const RARITY_META = {
  common:    { label: 'Common',    color: '#4dd0ce' },
  rare:      { label: 'Rare',      color: '#b47ecc' },
  legendary: { label: 'Legendary', color: '#febc2e' },
}

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4500)
    return () => clearTimeout(timer)
  }, [onDismiss])

  const meta = RARITY_META[achievement.rarity] ?? RARITY_META.common

  return (
    <motion.div
      className="achv-toast"
      style={{
        '--toast-color': meta.color,
      }}
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
    >
      <div className="achv-toast-header">
        <span className="achv-toast-badge" style={{ color: meta.color }}>
          ◈
        </span>
        ACHIEVEMENT UNLOCKED
        <button className="achv-toast-close" onClick={onDismiss} aria-label="Dismiss">
          ×
        </button>
      </div>
      <div className="achv-toast-body">
        <span className="achv-toast-name">{achievement.name}</span>
        <span className="achv-toast-desc">{achievement.desc}</span>
      </div>
      <div className="achv-toast-footer" style={{ color: meta.color }}>
        [{meta.label}]
      </div>
    </motion.div>
  )
}
