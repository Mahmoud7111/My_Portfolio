import { useState, useEffect, useRef } from 'react'

const JOKES = [
  '"Why do programmers prefer dark mode? Because light attracts bugs!"',
  '"A SQL query walks into a bar, walks up to two tables and asks... Can I join you?"',
  '"Why do Java developers wear glasses? Because they don\'t C#."',
  '"How many programmers does it take to change a light bulb? None — that\'s a hardware problem."',
  '"Why did the programmer quit his job? Because he didn\'t get arrays."',
  '"What\'s a programmer\'s favorite hangout spot? The Foo Bar."',
  '"Why was the JavaScript developer sad? Because he didn\'t Node how to Express himself."',
  '"What do you call a programmer from Finland? Nerdic."',
  '"Why do programmers always mix up Halloween and Christmas? Because Oct 31 === Dec 25."',
  '"There are only 10 types of people in the world: those who understand binary, and those who don\'t."',
]

export default function TerminalClosedScreen({ onReturn }) {
  const [joke] = useState(() => JOKES[Math.floor(Math.random() * JOKES.length)])
  const [displayedTitle, setDisplayedTitle] = useState('')
  const [showContent, setShowContent] = useState(false)
  const fullTitle = 'Terminal Closed'
  const indexRef = useRef(0)

  // Typewriter for title
  useEffect(() => {
    const id = setInterval(() => {
      if (indexRef.current < fullTitle.length) {
        setDisplayedTitle(fullTitle.slice(0, indexRef.current + 1))
        indexRef.current++
      } else {
        clearInterval(id)
        setTimeout(() => setShowContent(true), 200)
      }
    }, 60)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="tc-screen">
      {/* Scanline overlay */}
      <div className="tc-scanlines" aria-hidden="true" />

      <div className="tc-content">
        <h1 className="tc-title">
          {displayedTitle}
          <span className="tc-cursor-blink">_</span>
        </h1>

        <div className={`tc-body ${showContent ? 'tc-body--visible' : ''}`}>
          <p className="tc-line">
            You tried to close the terminal, but I couldn&apos;t let you go that easily!
          </p>
          <p className="tc-line tc-line--dim">
            Instead of saying goodbye, let&apos;s hang out in this meta-space...
          </p>

          <div className="tc-joke-block">
            <p className="tc-joke-label">&gt; Joke of the Day:</p>
            <p className="tc-joke-text">{joke}</p>
          </div>

          <p className="tc-achievement">
            Achievement Unlocked: Terminal Escape Artist
          </p>

          <button className="tc-return-btn" onClick={onReturn} id="tc-return">
            Return to Terminal ↗
          </button>
        </div>
      </div>
    </div>
  )
}
