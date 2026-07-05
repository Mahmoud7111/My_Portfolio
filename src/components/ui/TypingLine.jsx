import { useState, useEffect, useRef } from 'react'

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

export default function TypingLine({ children, text, delay = 0 }) {
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const fullText = text || extractText(children)

  useEffect(() => {
    if (!fullText) return
    indexRef.current = 0
    setTyped('')
    setDone(false)

    const startTimeout = setTimeout(() => {
      const id = setInterval(() => {
        indexRef.current++
        setTyped(fullText.slice(0, indexRef.current))
        if (indexRef.current >= fullText.length) {
          clearInterval(id)
          setTimeout(() => setDone(true), 150)
        }
      }, 50)
      return () => clearInterval(id)
    }, delay)

    return () => clearTimeout(startTimeout)
  }, [fullText, delay])

  return (
    <div className="hc-cmd-line">
      <span className="hc-prompt">$</span>
      {done ? (
        children
      ) : (
        <span>
          {typed}
          <span className="typing-cursor">_</span>
        </span>
      )}
    </div>
  )
}
