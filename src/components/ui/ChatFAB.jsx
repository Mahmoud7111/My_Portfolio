import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/**
 * Floating AI shell button — bottom-right, visible on every page.
 * Clicking it navigates to / with ?chat=1, which TerminalWindow picks
 * up and auto-triggers chat mode. Hidden when already on / in chat mode.
 */
export default function ChatFAB({ chatMode, calloutActive, onDismissCallout }) {
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)

  // Stagger in after a short delay so it doesn't fight the terminal entrance
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1200)
    return () => clearTimeout(t)
  }, [])

  const handleClick = () => {
    if (calloutActive) onDismissCallout?.()
    navigate('/?chat=1')
  }

  const showCallout = Boolean(calloutActive && !chatMode)

  return (
    <AnimatePresence>
      {visible && !chatMode && (
        <div className="chat-fab-wrapper">
          {/* AI Chat Callout Tooltip */}
          <AnimatePresence>
            {showCallout && (
              <motion.div
                className="callout-tooltip callout-tooltip--chat cursor-interactive"
                initial={{ opacity: 0, y: 10, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                onClick={handleClick}
                role="tooltip"
                aria-label="Click here to open AI chat"
              >
                <span className="callout-dot callout-dot--cyan" aria-hidden="true">•</span>
                <span className="callout-text">
                  Click here to open AI chat! <span className="callout-glyph" aria-hidden="true">◈</span>
                </span>
                <button
                  className="callout-close cursor-interactive"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDismissCallout?.()
                  }}
                  aria-label="Dismiss AI chat callout"
                >
                  ×
                </button>
                <span className="callout-arrow callout-arrow--bottom" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            className={`chat-fab${showCallout ? ' has-cyan-beacon' : ''}`}
            aria-label="Open AI assistant"
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            initial={{ opacity: 0, y: 24, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0 }}
            whileTap={{ scale: 0.93 }}
          >
            {/* Corner accent dots */}
            <span className="chat-fab__corner chat-fab__corner--tl" aria-hidden="true" />
            <span className="chat-fab__corner chat-fab__corner--br" aria-hidden="true" />

            {/* Icon (Sleek Chat Bubble) */}
            <span className="chat-fab__symbol" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                <path d="M9 10h.01"></path>
                <path d="M12 10h.01"></path>
                <path d="M15 10h.01"></path>
              </svg>
            </span>

            {/* Label — slides in on hover */}
            <AnimatePresence>
              {hovered && (
                <motion.span
                  className="chat-fab__label"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ opacity: 1, width: 'auto', marginLeft: 8 }}
                  exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  AI CHAT
                </motion.span>
              )}
            </AnimatePresence>

            {/* Scanline overlay */}
            <span className="chat-fab__scanlines" aria-hidden="true" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}

