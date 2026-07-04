import { useState, useEffect, useCallback } from 'react'
import { UNLOCKABLES } from '../data/unlockables'

const STORAGE_KEY = 'portfolio_achievements'
const UNLOCK_EVENT = 'achv:unlock'

function loadUnlocked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

/**
 * Tracks which visitor achievements have been unlocked.
 * unlock(id) marks an achievement unlocked and persists it.
 * isUnlocked(id) checks current state.
 * All instances stay in sync via custom window events.
 */
export function useAchievements() {
  const [unlocked, setUnlocked] = useState(loadUnlocked)

  // React to unlocks from other hook instances
  useEffect(() => {
    const handler = () => setUnlocked(loadUnlocked())
    window.addEventListener(UNLOCK_EVENT, handler)
    return () => window.removeEventListener(UNLOCK_EVENT, handler)
  }, [])

  const unlock = useCallback((id) => {
    setUnlocked((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      window.dispatchEvent(new CustomEvent(UNLOCK_EVENT))
      return next
    })
  }, [])

  const isUnlocked = useCallback((id) => unlocked.includes(id), [unlocked])

  const clearAll = useCallback(() => {
    setUnlocked([])
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent(UNLOCK_EVENT))
  }, [])

  return {
    unlocked,
    unlock,
    isUnlocked,
    clearAll,
    all: UNLOCKABLES,
    progress: `${unlocked.length}/${UNLOCKABLES.length}`,
  }
}
