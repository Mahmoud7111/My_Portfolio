import { useState, useEffect, useCallback } from 'react'
import { UNLOCKABLES } from '../data/unlockables'

const STORAGE_KEY = 'portfolio_achievements'

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
 */
export function useAchievements() {
  const [unlocked, setUnlocked] = useState(loadUnlocked)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlocked))
  }, [unlocked])

  const unlock = useCallback((id) => {
    setUnlocked((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const isUnlocked = useCallback((id) => unlocked.includes(id), [unlocked])

  return {
    unlocked,
    unlock,
    isUnlocked,
    all: UNLOCKABLES,
    progress: `${unlocked.length}/${UNLOCKABLES.length}`,
  }
}
