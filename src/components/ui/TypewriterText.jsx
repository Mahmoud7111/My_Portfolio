import { useEffect, useRef } from 'react'
import { useTypewriter } from '../../hooks/useTypewriter'

export default function TypewriterText({
  text,
  speed = 18,
  onComplete,
  onStart,
  lineClassName,
  cursorClassName = 'terminal-cursor',
  lineStyle,
  wrapper: Wrapper = 'div',
}) {
  const { typedLines, isTyping } = useTypewriter(text, speed, onComplete)
  const startedRef = useRef(false)
  const isTypingRef = useRef(isTyping)
  isTypingRef.current = isTyping

  // Report typing start on mount (only when animating)
  useEffect(() => {
    if (isTypingRef.current && !startedRef.current) {
      startedRef.current = true
      onStart?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Wrapper>
      {typedLines.map((line, i) => {
        const isLast = i === typedLines.length - 1
        const showCursor = isTyping && isLast
        return (
          <p
            key={i}
            className={lineClassName}
            style={{ ...(lineStyle || {}), margin: 0 }}
          >
            {line || '\u00A0'}
            {showCursor && (
              <span
                className={cursorClassName}
                style={{
                  display: 'inline-block',
                  marginLeft: 2,
                  verticalAlign: 'middle',
                }}
                aria-hidden="true"
              />
            )}
          </p>
        )
      })}
    </Wrapper>
  )
}
