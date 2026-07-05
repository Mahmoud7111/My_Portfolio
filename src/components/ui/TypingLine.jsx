import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

function extractText(children) {
  if (!children) return ''
  const arr = Array.isArray(children) ? children : [children]
  return arr
    .map((child) => {
      if (typeof child === 'string') return child
      if (typeof child === 'number') return String(child)
      if (child?.props?.children) return extractText(child.props.children)
      return ''
    })
    .join('')
}

export default function TypingLine({ children, text, wrapperClassName }) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const fullText = text || extractText(children)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!fullText || !isInView) return
    indexRef.current = 0
    setTyped('')
    setDone(false)

    const id = setInterval(() => {
      indexRef.current++
      setTyped(fullText.slice(0, indexRef.current))
      if (indexRef.current >= fullText.length) {
        clearInterval(id)
        setTimeout(() => setDone(true), 150)
      }
    }, 50)

    return () => clearInterval(id)
  }, [fullText, isInView])

  return (
    <div ref={ref} className={wrapperClassName || 'hc-cmd-line'}>
      <span className="hc-prompt">$ </span>
      {done ? (
        children
      ) : (
        <span>
          {isInView ? (typed || '\u00A0') : '\u00A0'}
          {isInView && !done && (
            <span className="typing-cursor">_</span>
          )}
        </span>
      )}
    </div>
  )
}
