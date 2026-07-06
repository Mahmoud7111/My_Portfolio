import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAchievements } from './useAchievements'

const ALL_ROUTES = ['/', '/projects', '/about', '/contact', '/achievements']

export function useGlobalAchievements() {
  const { unlock, unlocked } = useAchievements()
  const location = useLocation()
  const visitedRef = useRef(new Set())

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
    const id = setInterval(check, 2000)
    return () => clearInterval(id)
  }, [unlock])

  // ── site-explorer (visit all routes) ───────────────────────
  useEffect(() => {
    visitedRef.current.add(location.pathname)
    if (ALL_ROUTES.every((r) => visitedRef.current.has(r))) {
      unlock('site-explorer')
    }
  }, [location.pathname, unlock])

  // ── achievement-hunter (unlock 5 others) ──────────────────
  useEffect(() => {
    if (unlocked.length >= 5) {
      unlock('achievement-hunter')
    }
  }, [unlocked, unlock])
}
