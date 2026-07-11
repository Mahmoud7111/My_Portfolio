import { useEffect, useRef, useState } from 'react'

/**
 * Coral block cursor (leads, instant) + cyan glow dot (lags, eased).
 * Auto-disabled on touch devices via CSS (@media pointer: coarse).
 *
 * The trail's easing loop runs only while it hasn't caught up to the cursor
 * (within 0.5px) and stops on idle. It restarts the moment the user moves
 * the mouse again. Before this fix the RAF ran at 60fps forever, even when
 * the user wasn't touching the mouse — pure wasted CPU.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)
  const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (isTouch) return

    const trailX = { value: 0 }
    const trailY = { value: 0 }
    let targetX = 0
    let targetY = 0
    let rafId = null

    const CATCHUP_THRESHOLD_SQ = 0.5 * 0.5  // 0.5px² squared distance

    const tick = () => {
      const dx = targetX - trailX.value
      const dy = targetY - trailY.value
      const distSq = dx * dx + dy * dy

      if (distSq < CATCHUP_THRESHOLD_SQ) {
        // Caught up — snap and stop the loop until the next mousemove.
        trailX.value = targetX
        trailY.value = targetY
        if (trailRef.current) {
          trailRef.current.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`
        }
        rafId = null
        return
      }

      trailX.value += dx * 0.18
      trailY.value += dy * 0.18
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trailX.value}px, ${trailY.value}px) translate(-50%, -50%)`
      }
      rafId = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (rafId === null) rafId = requestAnimationFrame(tick)
    }

    const onMove = (e) => {
      targetX = e.clientX
      targetY = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`
      }
      startLoop()
    }

    window.addEventListener('mousemove', onMove)
    startLoop()

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafId !== null) cancelAnimationFrame(rafId)
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
