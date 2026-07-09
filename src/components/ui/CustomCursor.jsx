import { useEffect, useRef, useState } from 'react'

/**
 * Coral block cursor (leads, instant) + cyan glow dot (lags, eased).
 * Auto-disabled on touch devices via CSS (@media pointer: coarse).
 */
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)
  const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (isTouch) return

    let trailX = 0
    let trailY = 0
    let targetX = 0
    let targetY = 0

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`
      }
    }

    let rafId
    const animateTrail = () => {
      trailX += (targetX - trailX) * 0.18
      trailY += (targetY - trailY) * 0.18
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(animateTrail)
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(animateTrail)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [isTouch])

  if (isTouch) return null

  return (
    <>
      <div ref={trailRef} className="cursor-trail" style={{ transition: 'none' }} />
      <div ref={cursorRef} className="custom-cursor" />
    </>
  )
}
