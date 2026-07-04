import { useState, useEffect, useRef } from 'react'

export default function HelloWorldScreen({ onReady }) {
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [fading, setFading] = useState(false)
  const indexRef = useRef(0)
  const fullTitle = 'Hello World'

  useEffect(() => {
    const id = setInterval(() => {
      if (indexRef.current < fullTitle.length) {
        indexRef.current++
        setDisplayedTitle(fullTitle.slice(0, indexRef.current))
      } else {
        clearInterval(id)
        setTimeout(() => setShowSubtitle(true), 300)
        setTimeout(() => setFading(true), 1800)
        setTimeout(() => onReady(), 2400)
      }
    }, 70)
    return () => clearInterval(id)
  }, [onReady])

  return (
    <div className={`hw-screen ${fading ? 'hw-screen--fade' : ''}`}>
      <div className="hw-scanlines" aria-hidden="true" />

      <div className="hw-content">
        <h1 className="hw-title">
          {displayedTitle}
          <span className="hw-cursor">_</span>
        </h1>

        <p className={`hw-subtitle ${showSubtitle ? 'hw-subtitle--visible' : ''}`}>
          <span className="hw-prompt">&gt;</span> loading portfolio...
        </p>
      </div>
    </div>
  )
}
