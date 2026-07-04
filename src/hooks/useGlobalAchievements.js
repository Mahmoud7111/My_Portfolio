import { useEffect, useRef } from 'react'
import { useAchievements } from './useAchievements'

/**
 * Tracks global achievements that don't belong to a specific component:
 * - night-owl      (visit between midnight–4am)
 * - patient        (3+ minutes on site)
 * - persistent-visitor (5+ minutes on site)
 * - inspector      (DevTools opened)
 * - meta           (unlocked 5 others)
 * - achievement-hunter (unlocked 5 others)
 */
export function useGlobalAchievements() {
  const { unlock, unlocked, isUnlocked } = useAchievements()
  const startRef = useRef(Date.now())

  // ── night-owl ─────────────────────────────────────────────
  useEffect(() => {
    const h = new Date().getHours()
    if (h >= 0 && h < 4) {
      unlock('night-owl')
    }
  }, [unlock])

  // ── patient / persistent-visitor (timers) ─────────────────
  useEffect(() => {
    const threeMin = setTimeout(() => unlock('patient'), 180_000)
    const fiveMin  = setTimeout(() => unlock('persistent-visitor'), 300_000)
    return () => { clearTimeout(threeMin); clearTimeout(fiveMin) }
  }, [unlock])

  // ── inspector (DevTools detection) ────────────────────────
  useEffect(() => {
    const check = () => {
      const threshold = 160
      const w = window.outerWidth - window.innerWidth
      const h = window.outerHeight - window.innerHeight
      if (w > threshold || h > threshold) {
        unlock('inspector')
      }
    }
    // Poll every 2s for DevTools width difference
    const id = setInterval(check, 2000)
    return () => clearInterval(id)
  }, [unlock])
}
