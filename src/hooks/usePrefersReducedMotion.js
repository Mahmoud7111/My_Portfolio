// This hook is used to determine if the user has requested reduced motion in their system preferences. It uses the `window.matchMedia` API to check for the `(prefers-reduced-motion: reduce)` media query and sets up an event listener to update the state if the preference changes. The hook returns a boolean indicating whether the user prefers reduced motion.
import { useState, useEffect } from 'react'

export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e) => setPrefersReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}
