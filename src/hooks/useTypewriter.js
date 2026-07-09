import { useState, useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

const LINE_PAUSE = 40

export function useTypewriter(text, speed = 18, onComplete) {
  const prefersReduced = usePrefersReducedMotion()
  const lines = Array.isArray(text) ? text : [text]
  const total = lines.length
  // Stable key so inline array literals don't re-trigger the effect
  const textKey = lines.join('\n')

  const [typedLines, setTypedLines] = useState(() =>
    prefersReduced ? [...lines] : lines.map(() => '')
  )
  const [isTyping, setIsTyping] = useState(!prefersReduced)
  const intervalRef = useRef(null)
  const timeoutRef = useRef(null)
  const cbRef = useRef(onComplete)
  cbRef.current = onComplete

  useEffect(() => {
    if (prefersReduced) {
      setTypedLines([...lines])
      setIsTyping(false)
      // Do NOT call onComplete — reduced motion skips typing entirely,
      // so the paired onStart was never called either. Omitting both
      // keeps the typing-count counter balanced.
      return
    }

    if (total === 0 || (lines.length === 1 && lines[0] === '')) {
      setIsTyping(false)
      return
    }

    let lineIdx = 0
    let charIdx = 0
    setIsTyping(true)
    setTypedLines(lines.map(() => ''))

    const CHARS_PER_TICK = 8 // batch chars to cut re-renders; makes activation messages near-instant

    const tick = () => {
      charIdx += CHARS_PER_TICK
      
      // Capture the current values so the React state updater callback
      // doesn't read the mutated values if we increment them below.
      const currentLine = lineIdx
      const currentChar = charIdx

      setTypedLines((prev) => {
        const next = [...prev]
        next[currentLine] = lines[currentLine].slice(0, currentChar)
        return next
      })

      if (charIdx >= lines[lineIdx].length) {
        clearInterval(intervalRef.current)
        intervalRef.current = null

        if (lineIdx < total - 1) {
          lineIdx++
          charIdx = 0
          timeoutRef.current = setTimeout(() => {
            intervalRef.current = setInterval(tick, speed)
          }, LINE_PAUSE)
        } else {
          setIsTyping(false)
          cbRef.current?.()
        }
      }
    }

    intervalRef.current = setInterval(tick, speed)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      intervalRef.current = null
      timeoutRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textKey, speed, prefersReduced])

  return { typedLines, isTyping }
}
