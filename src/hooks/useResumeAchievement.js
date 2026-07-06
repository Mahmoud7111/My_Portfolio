import { useCallback } from 'react'
import { useAchievements } from './useAchievements'

/**
 * Returns a click handler that unlocks the 'interested-aren-we' achievement.
 * Attach to any resume/CV download link.
 */
export function useResumeAchievement() {
  const { unlock } = useAchievements()
  return useCallback(() => unlock('interested-aren-we'), [unlock])
}
