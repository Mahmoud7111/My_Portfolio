import { useState, useEffect } from 'react'

/**
 * Returns the current vertical scroll position in pixels.
 * Used to detect "at top of page" for header styling.
 */
export function useScrollPosition() {
  const [scrollY, setScrollY] = useState(window.scrollY || 0)

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return scrollY
}
