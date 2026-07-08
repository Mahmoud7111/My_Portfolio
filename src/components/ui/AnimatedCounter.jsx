import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

function parseValue(raw) {
  // Extract number + prefix/suffix, e.g. "3+" → { num: 3, prefix: '', suffix: '+' }
  const match = String(raw).match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { num: 0, prefix: '', suffix: '', original: raw }
  return {
    num: parseFloat(match[2]),
    prefix: match[1],
    suffix: match[3],
    original: raw,
  }
}

function easeOut(t) {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * AnimatedCounter — counts up from 0 to the target number when in view.
 * Supports values like "3+", "10k", "99%".
 *
 * @param {object}  props
 * @param {string|number} props.value   target value string, e.g. "42" or "3+"
 * @param {number}  [props.duration=1600]  animation duration in ms
 * @param {string}  [props.className]
 */
export default function AnimatedCounter({ value, duration = 1600, className }) {
  const prefersReduced = usePrefersReducedMotion()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState('0')

  const parsed = parseValue(value)

  useEffect(() => {
    if (!inView || prefersReduced) {
      setDisplay(String(value))
      return
    }

    let start = null
    let raf

    function step(timestamp) {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeOut(progress)
      const current = Math.round(eased * parsed.num)
      const isFloat = parsed.num % 1 !== 0
      setDisplay(
        parsed.prefix +
          (isFloat ? current.toFixed(1) : current) +
          parsed.suffix
      )
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      }
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, prefersReduced, value, duration, parsed.num, parsed.prefix, parsed.suffix])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
