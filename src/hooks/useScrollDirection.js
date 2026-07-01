import { useState, useEffect, useRef } from 'react'

/**
 * Returns 'up' or 'down' based on the most recent scroll movement.
 * Used to show/hide the sticky header.
 */
export function useScrollDirection() {
  const [direction, setDirection] = useState('up')
  const lastScrollY = useRef(0)

  useEffect(() => {
    lastScrollY.current = window.scrollY

    const onScroll = () => {
      const currentY = window.scrollY
      const diff = currentY - lastScrollY.current

      // Ignore tiny jitter (e.g. mobile bounce scroll)
      if (Math.abs(diff) > 4) {
        setDirection(diff > 0 ? 'down' : 'up')
        lastScrollY.current = currentY
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return direction
}
