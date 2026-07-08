import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

export default function TypewriterLoop({ strings, speed = 70, deleteSpeed = 35, pause = 1800, className, style }) {
  const stringsRef = useRef(strings)
  stringsRef.current = strings

  const [display, setDisplay] = useState('')
  const [index, setIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCursor, setShowCursor] = useState(true)
  const [started, setStarted] = useState(false)
  const timeoutRef = useRef(null)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (isInView && !started) setStarted(true)
  }, [isInView, started])

  useEffect(() => {
    if (!started) return
    const current = stringsRef.current[index]

    if (!isDeleting) {
      if (display.length < current.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplay(current.slice(0, display.length + 1))
        }, speed)
      } else {
        timeoutRef.current = setTimeout(() => setIsDeleting(true), pause)
      }
    } else {
      if (display.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplay(display.slice(0, -1))
        }, deleteSpeed)
      } else {
        setIsDeleting(false)
        setIndex((i) => (i + 1) % stringsRef.current.length)
      }
    }

    return () => clearTimeout(timeoutRef.current)
  }, [display, isDeleting, index, started, speed, deleteSpeed, pause])

  useEffect(() => {
    const id = setInterval(() => setShowCursor((c) => !c), 530)
    return () => clearInterval(id)
  }, [])

  return (
    <span ref={containerRef} className={className} style={style}>
      <span className="twl-text">{started ? (display || '\u00A0') : '\u00A0'}</span>
      <span className="twl-cursor" data-show={showCursor && started}>▋</span>
    </span>
  )
}
