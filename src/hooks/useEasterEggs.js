import { useState, useCallback, useEffect, useRef } from 'react'
import { useAchievements } from './useAchievements'
import { UNLOCKABLES } from '../data/unlockables'

const STORAGE_KEY = 'portfolio_achievements'
const UNLOCK_EVENT = 'achv:unlock'

/**
 * Listens for any achievement unlock (from any hook) and exposes
 * `lastUnlocked` so TerminalWindow can show a toast notification.
 * Also tracks terminal chrome interactions (close/minimize/maximize).
 */
export function useEasterEggs() {
  const { unlock } = useAchievements()
  const [lastUnlocked, setLastUnlocked] = useState(null)
  const prevRef = useRef([])

  // Listen for unlocks from ANY source and show a toast
  useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        const current = raw ? JSON.parse(raw) : []
        const newId = current.find((id) => !prevRef.current.includes(id))
        if (newId) {
          const a = UNLOCKABLES.find((x) => x.id === newId)
          if (a) setLastUnlocked(a)
        }
        prevRef.current = current
      } catch { /* ignore */ }
    }

    // Sync current state on mount so we don't toast for pre-existing unlocks
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      prevRef.current = raw ? JSON.parse(raw) : []
    } catch { /* ignore */ }

    window.addEventListener(UNLOCK_EVENT, handler)
    return () => window.removeEventListener(UNLOCK_EVENT, handler)
  }, [])

  const clearLastUnlocked = useCallback(() => setLastUnlocked(null), [])

  const onCloseClick = useCallback(() => {
    unlock('escape-artist')
    unlock('red-choice')
  }, [unlock])

  const onMinimizeClick = useCallback(() => {
    unlock('rabbit-hole')
  }, [unlock])

  const onMaximizeClick = useCallback(() => {
    unlock('full-screener')
  }, [unlock])

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
