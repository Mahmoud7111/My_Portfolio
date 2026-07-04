import { useState, useCallback } from 'react'
import { useAchievements } from './useAchievements'
import { UNLOCKABLES } from '../data/unlockables'

/**
 * Tracks "easter egg" achievements based on user interactions
 * with the terminal window chrome (close, minimize).
 * Returns `lastUnlocked` for toast notifications.
 */
export function useEasterEggs() {
  const { unlock, isUnlocked } = useAchievements()
  const [lastUnlocked, setLastUnlocked] = useState(null)

  const tryUnlock = useCallback((id) => {
    if (!isUnlocked(id)) {
      unlock(id)
      const a = UNLOCKABLES.find((x) => x.id === id)
      if (a) setLastUnlocked(a)
    }
  }, [unlock, isUnlocked])

  const clearLastUnlocked = useCallback(() => setLastUnlocked(null), [])

  const onCloseClick = useCallback(() => {
    tryUnlock('escape-artist')
  }, [tryUnlock])

  const onMinimizeClick = useCallback(() => {
    tryUnlock('rabbit-hole')
  }, [tryUnlock])

  const onMaximizeClick = useCallback(() => {
    tryUnlock('full-screener')
  }, [tryUnlock])

  const onRestoreFromMinimized = useCallback(() => {}, [])

  return {
    lastUnlocked,
    clearLastUnlocked,
    onCloseClick,
    onMinimizeClick,
    onMaximizeClick,
    onRestoreFromMinimized,
  }
}
