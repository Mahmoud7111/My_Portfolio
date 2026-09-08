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

export default function TypingLine({ children, text, wrapperClassName, noPrompt }) {
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

  const isArrowLine = noPrompt && (/^(->|→|\u2192)/.test(fullText))
  const childClassName = children?.props?.className || 'hc-var'

  const arrowGlowStyle = {
    color: 'var(--coral)',
    textShadow: '0 0 8px var(--coral-glow), 0 0 16px var(--coral-glow)',
    fontWeight: 600,
  }

  const restText = (str) => str.replace(/^(->|→|\u2192)\s*/, '')

  return (
    <div ref={ref} className={wrapperClassName || 'hc-cmd-line'}>
      {!noPrompt && <span className="hc-prompt">$ </span>}
      {done ? (
        isArrowLine ? (
          <>
            <span style={arrowGlowStyle}>-&gt;</span>
            <span className={childClassName}>{' ' + restText(fullText)}</span>
          </>
        ) : children
      ) : (
        <span>
          {isInView ? (
            isArrowLine && typed.length > 0 ? (
              <>
                <span style={arrowGlowStyle}>
                  {typed.startsWith('->')
                    ? '->'
                    : (typed.startsWith('-') ? '-' : '->')}
                </span>
                <span className={childClassName}>
                  {typed.startsWith('->')
                    ? typed.slice(2)
                    : (typed.startsWith('→') || typed.startsWith('\u2192') ? typed.slice(1) : '')}
                </span>
              </>
            ) : (typed || '\u00A0')
          ) : '\u00A0'}
          {isInView && !done && (
            <span className="typing-cursor">_</span>
          )}
        </span>
      )}
    </div>
  )
}
