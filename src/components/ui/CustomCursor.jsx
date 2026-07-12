import { useEffect, useRef, useState } from 'react'

/**
 * Coral block cursor (leads, instant) + cyan glow dot (lags, eased).
 * Auto-disabled on touch devices via CSS (@media pointer: coarse).
 *
 * The trail's easing loop runs only while it hasn't caught up to the cursor
 * (within 0.5px) and stops on idle. It restarts the moment the user moves
 * the mouse again.
 *
 * Hover state uses event delegation: a single mouseover/mouseout pair on
 * document checks e.target.closest(...) for interactive elements and
 * toggles .is-hovering on the cursor — no per-element listeners.
 */
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const trailRef = useRef(null)
  const isHovering = useRef(false)
  const [isTouch] = useState(() => window.matchMedia('(pointer: coarse)').matches)

  useEffect(() => {
    if (isTouch) return

    const trailX = { value: 0 }
    const trailY = { value: 0 }
    let targetX = 0
    let targetY = 0
    let rafId = null

    const CATCHUP_THRESHOLD_SQ = 0.5 * 0.5

    const tick = () => {
      const dx = targetX - trailX.value
      const dy = targetY - trailY.value
      const distSq = dx * dx + dy * dy

      if (distSq < CATCHUP_THRESHOLD_SQ) {
        trailX.value = targetX
        trailY.value = targetY
        if (trailRef.current) {
          trailRef.current.style.transform = `translate(${targetX}px, ${targetY}px) translate(-50%, -50%)`
        }
        rafId = null
        return
      }

      trailX.value += dx * 0.25
      trailY.value += dy * 0.25
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

    // ── Hover detection via event delegation ──────────────────────
    // Matches native interactive elements plus .cursor-interactive.
    const INTERACTIVE_SELECTOR = 'a, button, [role="button"], .cursor-interactive'

    const setHover = (on) => {
      if (isHovering.current === on) return
      isHovering.current = on
      if (cursorRef.current) {
        cursorRef.current.classList.toggle('is-hovering', on)
      }
      // Trail glow colour: cyan when hovering interactive, coral otherwise.
      // The actual colour shift is handled by CSS :where(...:hover) rules;
      // here we just ensure the variable is correct so CSS fallbacks work.
      if (trailRef.current) {
        trailRef.current.style.setProperty(
          '--cursor-glow',
          on ? 'rgba(77,208,206,0.6)' : 'var(--cyan-glow)'
        )
      }
    }

    const onHover = (e) => {
      if (e.target.closest(INTERACTIVE_SELECTOR)) setHover(true)
    }
    const onLeave = (e) => {
      if (e.target.closest(INTERACTIVE_SELECTOR)) setHover(false)
    }

    document.addEventListener('mouseover', onHover)
    document.addEventListener('mouseout', onLeave)
    window.addEventListener('mousemove', onMove)
    startLoop()

    return () => {
      document.removeEventListener('mouseover', onHover)
      document.removeEventListener('mouseout', onLeave)
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
