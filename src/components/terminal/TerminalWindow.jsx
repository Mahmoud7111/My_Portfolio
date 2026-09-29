import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { GithubIcon, LinkedinIcon } from '../ui/BrandIcons'
import AsciiArt from '../ascii/AsciiArt'
import { ART } from '../ascii/art'
import CommandOutput from '../commands/CommandOutput'
import { useTerminal } from '../../hooks/useTerminal'
import { useChat } from '../../hooks/useChat'
import { useEasterEggs } from '../../hooks/useEasterEggs'
import { useGlobalAchievements } from '../../hooks/useGlobalAchievements'
import { useAchievements } from '../../hooks/useAchievements'
import { me } from '../../data/me'
import TerminalClosedScreen from './TerminalClosedScreen'
import HelloWorldScreen from './HelloWorldScreen'
import AchievementToast from '../ui/AchievementToast'
import TypewriterText from '../ui/TypewriterText'
import { useTypewriter } from '../../hooks/useTypewriter'
import ChatFAB from '../ui/ChatFAB'

import HomeContent from '../../pages/HomeContent'
import ProjectsContent from '../../pages/ProjectsContent'
import AboutContent from '../../pages/AboutContent'
import ContactContent from '../../pages/ContactContent'
import AchievementsContent from '../../pages/AchievementsContent'
import NotFound from '../../pages/NotFound'

// ── Tab definitions ───────────────────────────────────────────
const TABS = [
  { id: 'terminal', path: '/', label: 'terminal' },
  { id: 'projects', path: '/projects', label: 'projects' },
  { id: 'about', path: '/about', label: 'about' },
  { id: 'contact', path: '/contact', label: 'contact' },
  { id: 'achievements', path: '/achievements', label: 'your achievements' },
]

const PATH_MAP = {
  '/': '~/home',
  '/projects': '~/projects',
  '/about': '~/about',
  '/contact': '~/contact',
  '/achievements': '~/achievements',
}

// ── Framer Motion spring presets ─────────────────────────────
// Used for window expand/restore — smooth but not bouncy
const SPRING_SMOOTH = {
  type: 'spring',
  stiffness: 220,
  damping: 28,
}

// Used for minimize/restore — snappier with light overshoot
const SPRING_SNAP = {
  type: 'spring',
  stiffness: 340,
  damping: 32,
}

// ── Track live viewport size ─────────────────────────────────
// Uses the Visual Viewport API when available to correctly ignore virtual keyboard
// resizes on mobile. The layout viewport height (window.innerHeight before keyboard)
// is stored as the "stable" height so Framer Motion targets never shrink due to IME.
function useViewport() {
  const getStableSize = () => {
    if (typeof window === 'undefined') return { w: 1024, h: 768 }
    return { w: window.innerWidth, h: window.innerHeight }
  }

  const [vp, setVp] = useState(getStableSize)

  // Store the last "full" height before any keyboard resize
  const stableHRef = useRef(typeof window !== 'undefined' ? window.innerHeight : 768)
  const stableWRef = useRef(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    // ── Visual Viewport path (Chrome/Safari iOS 13+) ─────────────
    // visualViewport shrinks when keyboard opens but window.innerHeight stays stable.
    // We simply always report innerHeight so the terminal never shrinks.
    const vv = window.visualViewport

    const onResize = () => {
      const curW = window.innerWidth
      const curH = window.innerHeight
      const isMobile = curW < 768

      if (isMobile) {
        // Orientation change: width changed significantly
        const widthChanged = Math.abs(curW - stableWRef.current) > 30
        if (widthChanged) {
          stableWRef.current = curW
          stableHRef.current = curH
          setVp({ w: curW, h: curH })
          return
        }

        // On mobile, innerHeight can still shrink on some browsers even with
        // interactive-widget=overlays-content. Use the stored stable height.
        // Only update stable height if it grew (i.e. keyboard closed and height restored).
        if (curH > stableHRef.current) {
          stableHRef.current = curH
        }

        // If there's a significant shrink (>10%), keyboard is likely open — keep stable height
        const shrinkRatio = stableHRef.current > 0 ? curH / stableHRef.current : 1
        if (shrinkRatio < 0.9) {
          // Keyboard open — report stable height, do NOT update stable
          setVp({ w: curW, h: stableHRef.current })
        } else {
          // Normal resize or keyboard fully closed
          stableHRef.current = curH
          setVp({ w: curW, h: curH })
        }
      } else {
        // Desktop/tablet — always take live dimensions
        stableWRef.current = curW
        stableHRef.current = curH
        setVp({ w: curW, h: curH })
      }
    }

    // ── visualViewport resize: fires when keyboard opens/closes ──
    // We intentionally do NOT update `vp` on visualViewport resize — the
    // terminal should stay the same size regardless of keyboard state.
    // We only listen on it so we can update stableH when keyboard closes.
    const onVvResize = () => {
      if (!vv) return
      const isMobile = window.innerWidth < 768
      if (!isMobile) return

      const curH = window.innerHeight
      // If innerHeight restored (keyboard closed), snap back to full size
      if (curH >= stableHRef.current) {
        stableHRef.current = curH
        setVp({ w: window.innerWidth, h: curH })
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    if (vv) vv.addEventListener('resize', onVvResize, { passive: true })

    return () => {
      window.removeEventListener('resize', onResize)
      if (vv) vv.removeEventListener('resize', onVvResize)
    }
  }, [])

  return vp
}

// ── Build Framer Motion animate target per state ─────────────
function buildTarget(state, vp) {
  const { w: vw, h: vh } = vp
  const isMobile = vw < 768

  // Normal state geometry
  const nW = isMobile ? vw - 16 : Math.min(1100, vw - 32)
  const nH = isMobile ? vh - 60 : vh - 80
  const nL = isMobile ? 8 : Math.round((vw - nW) / 2)
  const nT = isMobile ? 30 : 32
  const nR = isMobile ? 10 : 12
  const nMinW = isMobile ? 280 : undefined
  const nMinH = isMobile ? 360 : undefined

  switch (state) {
    case 'maximized':
      return {
        top: 0, left: 0,
        width: vw, height: vh,
        borderRadius: 0,
        opacity: 1, y: 0, scale: 1,
      }
    case 'minimized':
      return {
        top: nT, left: nL,
        width: nW, height: nH,
        borderRadius: nR,
        minWidth: nMinW, minHeight: nMinH,
        opacity: 0, y: 140, scale: 0.88,
      }
    default: // 'normal'
      return {
        top: nT, left: nL,
        width: nW, height: nH,
        borderRadius: nR,
        minWidth: nMinW, minHeight: nMinH,
        opacity: 1, y: 0, scale: 1,
      }
  }
}

export default function TerminalWindow() {
  const navigate = useNavigate()
  const location = useLocation()
  const vp = useViewport()

  const [windowState, setWindowState] = useState('hello')
  const [clock, setClock] = useState({ long: '', short: '' })
  const [menuOpen, setMenuOpen] = useState(false)
  const [typingCount, setTypingCount] = useState(0)
  const [aiActivating, setAiActivating] = useState(false) // shows activation overlay
  const [aiDeactivating, setAiDeactivating] = useState(false) // shows deactivation overlay
  const [aiReady, setAiReady] = useState(false)  // AI panel fully visible
  const [showRipple, setShowRipple] = useState(false)  // send ripple flash
  const [showMaximizeCallout, setShowMaximizeCallout] = useState(false)
  const [showChatCallout, setShowChatCallout] = useState(false)
  const chatCalloutTimerRef = useRef(null)
  const autoDismissMaxTimerRef = useRef(null)
  const autoDismissChatTimerRef = useRef(null)
  const bodyRef = useRef(null)
  const prevChatMode = useRef(false)
  const chatPromptRef = useRef(null)
  const scrolledToChat = useRef(false)

  const { history, input, setInput, submit, chatMode, exitChat, runFromClick, inputRef, pushLine, tabComplete, getCompletion } =
    useTerminal()

  const isTyping = typingCount > 0
  const startTyping = () => setTypingCount((n) => n + 1)
  const stopTyping = () => setTypingCount((n) => Math.max(0, n - 1))

  const { sendMessage, isLoading, clearChat } = useChat()

  const { lastUnlocked, clearLastUnlocked, onCloseClick, onMinimizeClick, onMaximizeClick, onRestoreFromMinimized } =
    useEasterEggs()
  useGlobalAchievements()
  const { unlock } = useAchievements()

  // ── Clock ────────────────────────────────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock({
        long: now.toLocaleTimeString('en-GB', { hour12: false }),
        short: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // ── Scroll to top + close mobile menu on route change ───────
  useEffect(() => {
    setMenuOpen(false)
    window.scrollTo(0, 0)
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }, [location.pathname])

  // ── Auto-scroll to keep prompt in view after command output ──
  useEffect(() => {
    if (location.pathname !== '/' || chatMode || history.length === 0) return
    if (!inputRef.current) return
    inputRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [history, location.pathname, chatMode])

  // ── Auto-trigger chat from FAB ────────────────────────────────
  useEffect(() => {
    if (location.search.includes('chat=1')) {
      if (!chatMode) {
        runFromClick('chat')
      }
      // Clean up URL using React Router so its internal state updates.
      // If we use window.history.replaceState, React Router's location.search 
      // remains stuck with '?chat=1', causing it to immediately reopen on exit.
      navigate(location.pathname, { replace: true })
    }
  }, [location.search, chatMode, runFromClick, location.pathname, navigate])

  // Scroll chat prompt into view once the AI panel mounts.
  // Only fires on the first aiReady=true of each activation (scrolledToChat guard).
  useEffect(() => {
    if (!aiReady) return
    if (scrolledToChat.current) return
    scrolledToChat.current = true
    requestAnimationFrame(() => {
      if (chatPromptRef.current) {
        chatPromptRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }
    })
  }, [aiReady])

  // Reset the scroll guard when chat mode closes so it fires again on next activation.
  useEffect(() => {
    if (!chatMode) scrolledToChat.current = false
  }, [chatMode])

  // ── Track minimise→restore cycles for easter egg ────────────
  const prevWindowState = useRef(windowState)
  useEffect(() => {
    if (prevWindowState.current === 'minimized' && windowState === 'normal') {
      onRestoreFromMinimized()
    }
    prevWindowState.current = windowState
  }, [windowState, onRestoreFromMinimized])

  // ── AI mode activation / deactivation sequence ────────────────
  // When chatMode flips true  → play the activation overlay for ~2.4s,
  // then mark aiReady so the holographic panel appears.
  // When chatMode flips false → play the deactivation overlay for ~2.2s,
  // then clear everything and return to normal mode.
  // aiReady stays true during deactivation so the AI mode terminal
  // styling persists until the overlay finishes.
  useEffect(() => {
    if (chatMode && !prevChatMode.current) {
      // entering chat mode
      clearChat()
      setAiActivating(true)
      setAiReady(false)
      setAiDeactivating(false)
      const t1 = setTimeout(() => setAiActivating(false), 2400)
      const t2 = setTimeout(() => setAiReady(true), 2000)
      prevChatMode.current = true
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    if (!chatMode && prevChatMode.current) {
      // leaving chat mode — play deactivation overlay, then clean up
      setTypingCount(0)
      setAiDeactivating(true)
      // aiReady stays true so the AI terminal styling persists during overlay
      const t = setTimeout(() => {
        setAiReady(false)
        setAiDeactivating(false)
        prevChatMode.current = false
      }, 2200)
      return () => clearTimeout(t)
    }
  }, [chatMode])

  // ── Fire ripple on send ───────────────────────────────────────
  const triggerRipple = useCallback(() => {
    setShowRipple(true)
    setTimeout(() => setShowRipple(false), 700)
  }, [])


  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    // In normal mode, block input while typewriter is animating.
    // In chat mode, always allow input (so 'exit' always works).
    if (isTyping && !chatMode) return
    const value = input.trim()
    if (chatMode && value && value.toLowerCase() !== 'exit') {
      triggerRipple()
      submit()
      const reply = await sendMessage(value)
      const isError = reply === "couldn't reach the AI right now. try again in a bit."
      pushLine({ type: 'chat-reply', value: reply, isError })
    } else {
      submit()
    }
  }

  const handleMinimize = () => {
    onMinimizeClick()
    setWindowState((s) => (s === 'minimized' ? 'normal' : 'minimized'))
  }
  const handleMaximize = () => {
    onMaximizeClick()
    setWindowState((s) => (s === 'maximized' ? 'normal' : 'maximized'))
  }

  const dismissChatCallout = useCallback(() => {
    setShowChatCallout(false)
    if (chatCalloutTimerRef.current) {
      clearTimeout(chatCalloutTimerRef.current)
      chatCalloutTimerRef.current = null
    }
    if (autoDismissChatTimerRef.current) {
      clearTimeout(autoDismissChatTimerRef.current)
      autoDismissChatTimerRef.current = null
    }
    try {
      sessionStorage.setItem('portfolio_seen_chat_callout', '1')
    } catch {}
  }, [])

  const dismissMaximizeCallout = useCallback(() => {
    setShowMaximizeCallout(false)
    if (autoDismissMaxTimerRef.current) {
      clearTimeout(autoDismissMaxTimerRef.current)
      autoDismissMaxTimerRef.current = null
    }
    try {
      sessionStorage.setItem('portfolio_seen_maximize_callout', '1')
    } catch {}

    // Sequence to AI Chat: only after Maximize is closed/dismissed, wait 3s pause
    try {
      const alreadySeenChat = sessionStorage.getItem('portfolio_seen_chat_callout')
      if (!alreadySeenChat && !chatMode) {
        if (chatCalloutTimerRef.current) clearTimeout(chatCalloutTimerRef.current)
        chatCalloutTimerRef.current = setTimeout(() => {
          setShowChatCallout(true)
          if (autoDismissChatTimerRef.current) clearTimeout(autoDismissChatTimerRef.current)
          autoDismissChatTimerRef.current = setTimeout(() => {
            setShowChatCallout(false)
            try {
              sessionStorage.setItem('portfolio_seen_chat_callout', '1')
            } catch {}
          }, 10000)
        }, 3000)
      }
    } catch {}
  }, [chatMode])

  // ── 🟢 Sequential Callouts (~4s after boot for Maximize, then AI Chat) ────
  useEffect(() => {
    if (windowState !== 'normal' || chatMode) return

    let startTimer = null

    try {
      const seenMax = sessionStorage.getItem('portfolio_seen_maximize_callout')
      const seenChat = sessionStorage.getItem('portfolio_seen_chat_callout')

      // Case 1: Maximize hasn't been shown yet and window is not maximized
      if (!seenMax && windowState !== 'maximized') {
        startTimer = setTimeout(() => {
          setShowMaximizeCallout(true)
          if (autoDismissMaxTimerRef.current) clearTimeout(autoDismissMaxTimerRef.current)
          autoDismissMaxTimerRef.current = setTimeout(() => {
            dismissMaximizeCallout()
          }, 10000)
        }, 4000)
      }
      // Case 2: Maximize already seen (or already maximized), but AI chat hasn't been shown
      else if (!seenChat) {
        startTimer = setTimeout(() => {
          setShowChatCallout(true)
          if (autoDismissChatTimerRef.current) clearTimeout(autoDismissChatTimerRef.current)
          autoDismissChatTimerRef.current = setTimeout(() => {
            dismissChatCallout()
          }, 10000)
        }, 4000)
      }
    } catch {}

    return () => {
      if (startTimer) clearTimeout(startTimer)
      if (autoDismissMaxTimerRef.current) clearTimeout(autoDismissMaxTimerRef.current)
      if (chatCalloutTimerRef.current) clearTimeout(chatCalloutTimerRef.current)
      if (autoDismissChatTimerRef.current) clearTimeout(autoDismissChatTimerRef.current)
    }
  }, [windowState, chatMode, dismissMaximizeCallout, dismissChatCallout])

  // If window is maximized while maximize callout is showing, dismiss it and trigger sequence
  useEffect(() => {
    if (windowState === 'maximized' && showMaximizeCallout) {
      dismissMaximizeCallout()
    }
  }, [windowState, showMaximizeCallout, dismissMaximizeCallout])

  // If chat mode opens at any time, cancel all timers and dismiss both callouts
  useEffect(() => {
    if (chatMode) {
      if (autoDismissMaxTimerRef.current) clearTimeout(autoDismissMaxTimerRef.current)
      if (chatCalloutTimerRef.current) clearTimeout(chatCalloutTimerRef.current)
      if (autoDismissChatTimerRef.current) clearTimeout(autoDismissChatTimerRef.current)
      setShowMaximizeCallout(false)
      setShowChatCallout(false)
      try {
        sessionStorage.setItem('portfolio_seen_maximize_callout', '1')
        sessionStorage.setItem('portfolio_seen_chat_callout', '1')
      } catch {}
    }
  }, [chatMode])

  if (windowState === 'hello') {
    return <HelloWorldScreen onReady={() => setWindowState('normal')} />
  }

  if (windowState === 'closed') {
    return <TerminalClosedScreen onReturn={() => setWindowState('normal')} />
  }

  const currentPath = PATH_MAP[location.pathname] ?? '~'
  const activeTabIdx = TABS.findIndex(t => t.path === location.pathname)

  // Framer Motion target + transition for current state
  const animTarget = buildTarget(windowState, vp)
  const animTransition =
    windowState === 'minimized'
      ? { ...SPRING_SNAP, opacity: { duration: 0.15, ease: 'easeOut' } }
      : SPRING_SMOOTH

  return (
    <>
      {/* ── Minimised dock pill ─────────────────────────────────── */}
      <AnimatePresence>
        {windowState === 'minimized' && (
          <motion.div
            key="dock"
            className="terminal-dock"
            style={{ position: 'fixed', bottom: 20, left: '50%' }}
            initial={{ x: '-50%', y: 30, opacity: 0 }}
            animate={{ x: '-50%', y: 0, opacity: 1 }}
            exit={{ x: '-50%', y: 30, opacity: 0 }}
            transition={SPRING_SNAP}
            onClick={() => setWindowState('normal')}
            role="button"
            aria-label="Restore terminal"
            tabIndex={0}
          >
            <span className="dock-dot" aria-hidden="true">●</span>
            <span className="">{me.handle} — click to restore</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── AI Activation Overlay ──────────────────────────────── */}
      <AnimatePresence>
        {aiActivating && (
          <AiActivationOverlay key="ai-activation" />
        )}
      </AnimatePresence>

      {/* ── AI Deactivation Overlay ────────────────────────────── */}
      <AnimatePresence>
        {aiDeactivating && (
          <AiDeactivationOverlay key="ai-deactivation" />
        )}
      </AnimatePresence>

      {/* ── Send Ripple ────────────────────────────────────────── */}
      <AnimatePresence>
        {showRipple && (
          <AiSendRipple key="ai-ripple" />
        )}
      </AnimatePresence>

      {/* ── Global backdrop dim ────────────────────────────────── */}
      <AnimatePresence>
        {(chatMode || aiDeactivating) && (
          <motion.div
            key="ai-backdrop"
            className="ai-mode-backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* ── Terminal window ─────────────────────────────────────── */}
      <motion.div
        className={`terminal-window${chatMode || aiDeactivating ? ' terminal-window--ai-mode' : ''}`}
        style={{
          position: 'fixed',
          zIndex: windowState === 'maximized' ? 999 : 100,
          pointerEvents: windowState === 'minimized' ? 'none' : 'auto',
        }}
        initial={buildTarget('normal', vp)}
        animate={animTarget}
        transition={animTransition}
      >
        {/* ── Chat-mode ambient cyan glow (pulse) ─────────────── */}
        <AnimatePresence>
          {(chatMode || aiDeactivating) && (
            <motion.div
              key="chat-glow"
              className="terminal-chat-glow"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            />
          )}
        </AnimatePresence>

        {/* ── AI particle layer ───────────────────────────────── */}
        <AnimatePresence>
          {aiReady && (
            <motion.div
              key="ai-particles"
              className="ai-particles"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <AiParticles />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ══ ROW 1 — tmux title bar ══════════════════════════ */}
        <div className={`trow trow--tmux${chatMode ? ' ai-mode-tinted' : ''}`}>
          <div className="traffic-lights">
            <button
              className="traffic-light close cursor-interactive"
              aria-label="Close terminal"
              onClick={() => { onCloseClick(); setWindowState('closed') }}
            />
            <button
              className="traffic-light minimize cursor-interactive"
              aria-label="Minimize terminal"
              onClick={handleMinimize}
            />
            <div className="traffic-light-beacon-wrap">
              <button
                className={`traffic-light maximize cursor-interactive${showMaximizeCallout ? ' has-beacon' : ''}`}
                aria-label={windowState === 'maximized' ? 'Restore' : 'Maximize'}
                onClick={() => {
                  if (showMaximizeCallout) dismissMaximizeCallout()
                  handleMaximize()
                }}
              />
              <AnimatePresence>
                {showMaximizeCallout && (
                  <motion.div
                    className="callout-tooltip callout-tooltip--maximize cursor-interactive"
                    initial={{ opacity: 0, y: -10, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.94 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                    onClick={() => {
                      dismissMaximizeCallout()
                      handleMaximize()
                    }}
                    role="tooltip"
                    aria-label="Click here to maximize screen"
                  >
                    <span className="callout-arrow callout-arrow--top" aria-hidden="true" />
                    <span className="callout-dot callout-dot--green" aria-hidden="true">•</span>
                    <span className="callout-text">
                      Click here to maximize screen! <span className="callout-icon" aria-hidden="true">⤢</span>
                    </span>
                    <button
                      className="callout-close cursor-interactive"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissMaximizeCallout()
                      }}
                      aria-label="Dismiss maximize callout"
                    >
                      ×
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <span className="tmux-session">
            <span className="tmux-prompt-user">{chatMode ? 'ai-shell' : 'portfolio'}</span>
            <span className="tmux-prompt-at">@</span>
            <span className="tmux-prompt-host">Mahmoud</span>
            <span className="tmux-prompt-sep">:</span>
            <span className="tmux-prompt-path">~</span>
          </span>

          <div className="tmux-right ">
            {chatMode ? (
              <span style={{ color: 'var(--cyan)', fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', opacity: 0.8 }}>
                ◈ assistant active
              </span>
            ) : (
              <>
                <span className="tmux-load">
                  load{' '}
                  <span className="tmux-load-val">0.42</span>{' '}
                  <span className="tmux-load-val">0.38</span>{' '}
                  <span className="tmux-load-val">0.31</span>
                </span>
                <span className="tmux-net">↓ 1.2ms/s</span>
                <span className="tmux-rec">
                  <span className="tmux-rec-dot">●</span> rec
                </span>
              </>
            )}
          </div>
        </div>

        {/* ══ ROW 3 — tmux windows tab bar ════════════════════ */}
        <div className={`trow trow--tabs${chatMode ? ' ai-mode-tinted' : ''}`} style={{ position: 'relative' }}>
          <span className="tmux-windows-label">windows:</span>
          {TABS.filter((t) => t.id !== 'achievements').map((tab, i) => {
            const isActive = location.pathname === tab.path
            return (
              <button
                key={tab.id}
                className={`tmux-tab ${isActive ? 'active' : ''}`}
                onClick={() => navigate(tab.path)}
              >
                [<span className="tmux-tab-num">{i + 1}</span>:<span className="tmux-tab-label">{tab.label}</span>{isActive ? '*' : '-'}]
              </button>
            )
          })}
          <span className="tmux-tab-new">[+:new]</span>

          <span className="tmux-tab-separator" aria-hidden="true">│</span>

          {(() => {
            const tab = TABS.find((t) => t.id === 'achievements')
            const idx = TABS.indexOf(tab) + 1
            const isActive = location.pathname === tab.path
            return (
              <button
                key={tab.id}
                className={`tmux-tab tmux-tab--right ${isActive ? 'active' : ''}`}
                onClick={() => navigate(tab.path)}
              >
                [<span className="tmux-tab-num">{idx}</span>:<span className="tmux-tab-label">{tab.label}</span>{isActive ? '*' : '-'}]
              </button>
            )
          })()}

          <a
            className="tmux-download"
            href={me.resumeUrl}
            download
            title="Download resume"
            onClick={() => unlock('interested-aren-we')}
          >
            <span className="tmux-download-icon">↓</span>
            <span className="tmux-download-label">resume</span>
          </a>

          {/* ── Mobile current tab label ── */}
          <span className="tmux-mobile-label">
            {TABS.find(t => t.path === location.pathname)?.label}
          </span>

          {/* ── Mobile menu button — labeled pill ── */}
          <button
            className="tmux-hamburger"
            aria-label="Open navigation menu"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
          >
            <span className="tmux-hamburger-icon" aria-hidden="true">☰</span>
            <span>MENU</span>
          </button>

          {/* ── Mobile dropdown ── */}
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="mobile-menu"
                className="tmux-mobile-dropdown"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                exit={{ scaleY: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
              >
                {TABS.map(tab => {
                  const isActive = location.pathname === tab.path
                  return (
                    <button
                      key={tab.id}
                      className={`tmux-mobile-tab ${isActive ? 'active' : ''}`}
                      onClick={() => { navigate(tab.path); setMenuOpen(false) }}
                    >
                      <span className="tab-cmd"><span className="tab-prompt">{isActive ? '>' : '$'}</span> cd {tab.path}</span>
                    </button>
                  )
                })}
                <a
                  className="tmux-mobile-tab tmux-mobile-tab--dl"
                  href={me.resumeUrl}
                  download
                  onClick={() => { setMenuOpen(false); unlock('interested-aren-we') }}
                >
                  <span className="tab-cmd">↓ resume</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══ Body ════════════════════════════════════════════ */}
        <div
          className={`terminal-body ${windowState === 'maximized' ? 'terminal-body--maximized' : ''} ${chatMode ? 'terminal-body--chat' : ''}`}
          ref={bodyRef}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {location.pathname === '/' && (
                <>
                  {/* Dim hero ASCII in AI mode */}
                  <motion.div
                    animate={{ opacity: chatMode ? 0.25 : 1, filter: chatMode ? 'blur(1px)' : 'blur(0px)' }}
                    transition={{ duration: 0.6 }}
                  >
                    <AsciiArt
                      art={ART.HERO}
                      color="var(--cyan)"
                      glow="var(--cyan-glow)"
                      fontSize="clamp(9px, 1.8vw, 18px)"
                      hideOnMobile={false}
                    />
                  </motion.div>

                  <motion.div
                    animate={{ opacity: chatMode ? 0.3 : 1 }}
                    transition={{ duration: 0.6 }}
                    className="hc-hero-intro"
                  >
                    {/* Name + role + status */}
                    <div className="hc-hero-intro__who">
                      <span className="hc-hero-intro__name">
                        Mahmoud Sayed
                        <span className="hc-hero-intro__cursor" aria-hidden="true">█</span>
                      </span>
                      <span className="hc-hero-intro__sep">//</span>
                      <span className="hc-hero-intro__role">Software &amp; AI Engineer</span>
                      <span className="hc-hero-intro__status">
                        <span className="hc-hero-intro__status-dot">●</span>
                        open to work
                      </span>
                    </div>

                    {/* One-liner description */}
                    <p className="hc-hero-intro__desc">
                      Navigate my portfolio using{' '}
                      <span className="hc-hero-intro__hl hc-hero-intro__hl--cyan">terminal commands</span>,{' '}
                      <span className="hc-hero-intro__hl hc-hero-intro__hl--coral">plain English chat</span>,
                      or click a shortcut below.
                    </p>

                    {/* Quick command pills */}
                    <div className="hc-hero-intro__pills-wrap">
                      <span className="hc-hero-intro__pills-label">$ quick start</span>
                      <div className="hc-quick-pills">
                        {[
                          { id: 'about', label: 'about' },
                          { id: 'skills', label: 'skills' },
                          { id: 'experience', label: 'experience' },
                          { id: 'projects', label: 'projects' },
                          { id: 'chat', label: 'chat' },
                          { id: 'help', label: 'help' },
                        ].map(({ id, label }, i) => (
                          <motion.button
                            key={id}
                            className="hc-quick-pill"
                            onClick={() => runFromClick(id)}
                            title={`Run: ${id}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 * i, duration: 0.25 }}
                          >
                            <span className="hc-quick-pill__label">{label}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>

                  {/* ── History entries ── */}
                  {/* In AI mode, wrap chat-related entries in holographic panel */}
                  {chatMode && aiReady ? (
                    <motion.div
                      className="chat-history-panel"
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="chat-history-panel__header">
                        <span className="chat-history-panel__indicator" aria-hidden="true" />
                        <span className="chat-history-panel__title">AI ASSISTANT SHELL</span>
                        <span className="chat-history-panel__badge">◈ model active</span>
                      </div>
                      <div className="chat-history-panel__body">
                        {history.map((entry, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, ease: 'easeOut' }}
                          >
                            <HistoryLine
                              entry={entry}
                              onCommandClick={runFromClick}
                              onTypingStart={startTyping}
                              onTypingDone={stopTyping}
                              inChatPanel
                            />
                          </motion.div>
                        ))}
                        {isLoading && (
                          <p className="chat-thinking" aria-label="AI is thinking">
                            <span className="chat-thinking-dot" style={{ animationDelay: '0ms' }} />
                            <span className="chat-thinking-dot" style={{ animationDelay: '220ms' }} />
                            <span className="chat-thinking-dot" style={{ animationDelay: '440ms' }} />
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ) : !chatMode ? (
                    <div>
                      {history.map((entry, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                          <HistoryLine
                            entry={entry}
                            onCommandClick={runFromClick}
                            onTypingStart={startTyping}
                            onTypingDone={stopTyping}
                          />
                        </motion.div>
                      ))}
                      {isLoading && (
                        <p className="chat-thinking" aria-label="AI is thinking">
                          <span className="chat-thinking-dot" style={{ animationDelay: '0ms' }} />
                          <span className="chat-thinking-dot" style={{ animationDelay: '220ms' }} />
                          <span className="chat-thinking-dot" style={{ animationDelay: '440ms' }} />
                        </p>
                      )}
                    </div>
                  ) : (
                    // Activation in progress — show history without panel yet
                    <div style={{ opacity: 0.4 }}>
                      {history.map((entry, i) => (
                        <motion.div key={i}>
                          <HistoryLine
                            entry={entry}
                            onCommandClick={runFromClick}
                            onTypingStart={startTyping}
                            onTypingDone={stopTyping}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* ── Prompt ── */}
                  {chatMode ? (
                    // AI mode prompt — holographic styled input
                    <motion.div
                      className="ai-prompt-wrapper"
                      ref={chatPromptRef}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: aiReady ? 1 : 0, y: aiReady ? 0 : 8 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <form onSubmit={handleSubmit} className="ai-prompt-inner">
                        <span className="ai-prompt-symbol">◈ AI&gt;</span>
                        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                          <input
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            autoFocus
                            spellCheck={false}
                            autoComplete="off"
                            placeholder="Ask me anything"
                            style={{
                              flex: 1,
                              background: 'transparent',
                              border: 'none',
                              outline: 'none',
                              color: '#e8e8f0',
                              fontFamily: 'var(--font-mono)',
                              // 16px is the iOS threshold — anything smaller triggers
                              // the viewport auto-zoom-on-focus behaviour.
                              fontSize: 16,
                              caretColor: 'var(--cyan)',
                              position: 'relative',
                              zIndex: 1,
                              width: '100%',
                            }}
                          />
                          <button
                            type="button"
                            className="ai-exit-btn"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              setInput('')
                              exitChat()
                            }}
                          >
                            exit
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  ) : (
                    // Normal command prompt — clean, minimal & visible
                    <form
                      onSubmit={handleSubmit}
                      className="terminal-prompt"
                      style={{ marginTop: 12, marginBottom: 28, position: 'relative' }}
                    >
                      <span className="prompt-host">mahmoud@dev</span>
                      <span className="prompt-path">:~/</span>
                      <span className={`prompt-symbol${!input ? ' prompt-symbol--pulse' : ''}`}>$</span>
                      <div className="terminal-input-wrap" style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                        <span
                          className="terminal-ghost"
                          aria-hidden="true"
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            pointerEvents: 'none',
                            color: 'var(--text-muted)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 16,
                            whiteSpace: 'pre',
                            opacity: 0.55,
                          }}
                        >
                          {(() => {
                            const match = getCompletion(input)
                            if (!match) return ''
                            return (
                              <>
                                {match}
                                <span className="tab-hint-pill">Tab ↹</span>
                              </>
                            )
                          })()}
                        </span>
                        <input
                          ref={inputRef}
                          value={input}
                          onChange={e => setInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                              e.preventDefault()
                              tabComplete()
                            }
                          }}
                          autoFocus={typeof window !== 'undefined' && window.innerWidth > 768}
                          spellCheck={false}
                          autoComplete="off"
                          placeholder="type 'help' or any command..."
                          style={{
                            flex: 1,
                            background: 'transparent',
                            color: 'var(--cyan)',
                            textShadow: '0 0 6px rgba(77, 208, 206, 0.4)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: 16,
                            caretColor: 'var(--coral)',
                            position: 'relative',
                            zIndex: 1,
                          }}
                        />
                      </div>
                    </form>
                  )}
                  <HomeContent chatMode={chatMode} runFromClick={runFromClick} />
                </>
              )}

              {location.pathname === '/projects' && <ProjectsContent />}
              {location.pathname === '/about' && <AboutContent />}
              {location.pathname === '/contact' && <ContactContent />}
              {location.pathname === '/achievements' && <AchievementsContent />}
              {/* Catch-all for any unknown route — render the styled 404 inside the terminal */}
              {!['/', '/projects', '/about', '/contact', '/achievements'].includes(location.pathname) && (
                <NotFound />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ══ Terminal footer ════════════════════════════════ */}
        <TerminalFooter chatMode={chatMode} />

        {/* Floating action button for AI chat — positioned inside the terminal window */}
        <ChatFAB
          chatMode={chatMode}
          calloutActive={showChatCallout}
          onDismissCallout={dismissChatCallout}
        />
      </motion.div>

      <AnimatePresence>
        {lastUnlocked && (
          <AchievementToast
            achievement={lastUnlocked}
            onDismiss={clearLastUnlocked}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// ── Terminal footer ─────────────────────────────────────────
function TerminalFooter({ chatMode }) {
  const year = new Date().getFullYear()
  const githubUrl = me.links.find(l => l.label.toLowerCase() === 'github')?.url || 'https://github.com/Mahmoud7111'
  const linkedinUrl = me.links.find(l => l.label.toLowerCase() === 'linkedin')?.url || 'https://www.linkedin.com/in/mahmoud7111/'

  return (
    <footer className={`terminal-footer${chatMode ? ' ai-mode-tinted' : ''}`}>
      <div className="terminal-footer__left">
        <span className="terminal-footer__prompt">$</span>
        <span className="terminal-footer__text">
          made by <span className="terminal-footer__name">{me.name}</span>
        </span>
      </div>

      <div className="terminal-footer__right">
        <a
          href={githubUrl}
          target="_blank"
          rel="noreferrer"
          className="terminal-footer__link"
          title="GitHub Profile"
        >
          <GithubIcon size={13} className="terminal-footer__icon" />
          <span>github</span>
        </a>
        <span className="terminal-footer__sep" aria-hidden="true">·</span>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="terminal-footer__link"
          title="LinkedIn Profile"
        >
          <LinkedinIcon size={13} className="terminal-footer__icon" />
          <span>linkedin</span>
        </a>
        <span className="terminal-footer__sep" aria-hidden="true">·</span>
        <span className="terminal-footer__copy">© {year}</span>
      </div>
    </footer>
  )
}

// ── Chat reply line — typed inline with useTypewriter ────────
function ChatReplyLine({ value, isError, onTypingStart, onTypingDone, inPanel }) {
  const { typedLines, isTyping } = useTypewriter(value, 18, onTypingDone)
  const startedRef = useRef(false)

  useEffect(() => {
    if (isTyping && !startedRef.current) {
      startedRef.current = true
      onTypingStart?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (inPanel) {
    return (
      <div className="chat-reply-line">
        <span className="chat-reply-line__handle">{me.handle}&gt;</span>
        <span className="chat-reply-line__text" style={isError ? { color: 'var(--coral)' } : {}}>
          {typedLines[0] || '\u00A0'}
          {isTyping && (
            <span className="chat-reply-line__cursor" aria-hidden="true" />
          )}
        </span>
      </div>
    )
  }

  return (
    <p style={{ color: isError ? 'var(--coral)' : 'var(--text-body)', marginBottom: 8 }}>
      <span style={{ color: 'var(--cyan)' }}>{me.handle}&gt;</span>{' '}
      {typedLines[0] || '\u00A0'}
      {isTyping && (
        <span
          className="terminal-cursor"
          style={{ display: 'inline-block', marginLeft: 2, verticalAlign: 'middle' }}
          aria-hidden="true"
        />
      )}
    </p>
  )
}

// ── History rendering ────────────────────────────────────────
function HistoryLine({ entry, onCommandClick, onTypingStart, onTypingDone, inChatPanel }) {
  if (entry.type === 'input') {
    if (inChatPanel) {
      return (
        <p className="chat-user-input-line">
          <span className="prompt-symbol">$</span> {entry.value}
        </p>
      )
    }
    return <p><span className="prompt-symbol">$</span> {entry.value}</p>
  }
  if (entry.type === 'system') {
    const lines = Array.isArray(entry.value) ? entry.value : [entry.value]
    return (
      <div style={{ marginBottom: 8 }}>
        <TypewriterText
          text={lines}
          onStart={onTypingStart}
          onComplete={onTypingDone}
          lineClassName={`tw-system-line${inChatPanel ? ' ai-system' : ''}`}
          lineStyle={{ color: entry.isError ? 'var(--coral)' : 'var(--text-body)' }}
        />
      </div>
    )
  }
  if (entry.type === 'output') {
    return (
      <CommandOutput commandId={entry.commandId} onCommandClick={onCommandClick} />
    )
  }
  if (entry.type === 'chat-reply') {
    return (
      <ChatReplyLine
        value={entry.value}
        isError={entry.isError}
        onTypingStart={onTypingStart}
        onTypingDone={onTypingDone}
        inPanel={inChatPanel}
      />
    )
  }
  return null
}

// ── AI Activation Overlay ────────────────────────────────────
function AiActivationOverlay() {
  // No RAF/setState per frame — all motion is pure CSS keyframes.
  // This keeps the main thread free so the cursor RAF loop stays smooth.
  const [phase, setPhase] = useState(0) // 0=scanning 1=booting 2=ready

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const statusLines = [
    { key: 'init', text: 'INITIALIZING AI SUBSYSTEM...', show: phase >= 0 },
    { key: 'model', text: 'LOADING LLM: neural inference engine', show: phase >= 0 },
    { key: 'ctx', text: 'BUILDING CONTEXT FROM me.js...', show: phase >= 1 },
    { key: 'ready', text: '◈ ASSISTANT SHELL READY', show: phase >= 2, isActive: true },
  ]

  return (
    <motion.div
      className="ai-activation-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{ background: 'rgba(6,6,14,0.88)' }}
    >
      {/* Sweep bar — pure CSS, zero JS per frame */}
      <div className="ai-sweep-bar ai-sweep-bar--css" />

      {/* Status messages */}
      <div className="ai-activation-status">
        {statusLines.map(({ key, text, show, isActive }) =>
          show ? (
            <motion.span
              key={key}
              className={`ai-status-line${isActive ? ' ai-status-line--active' : ' ai-status-line--label'}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {text}
            </motion.span>
          ) : null
        )}

        {/* Progress bar — pure CSS */}
        <div className="ai-scan-progress">
          <div className="ai-scan-progress__fill ai-scan-progress__fill--css" />
        </div>
        <span className="ai-status-line ai-status-line--label" style={{ opacity: 0.6 }}>
          scanning portfolio data...
        </span>
      </div>
    </motion.div>
  )
}

// ── AI Deactivation Overlay — mirrors activation but in reverse ──
// Bottom→top sweep, coral/amber accent, "shutting down" status lines.
function AiDeactivationOverlay() {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const statusLines = [
    { key: 'clear', text: 'CLEARING CONVERSATION CONTEXT...', show: phase >= 0 },
    { key: 'flush', text: 'FLUSHING SESSION MEMORY...', show: phase >= 1 },
    { key: 'offline', text: '◈ AI SUBSYSTEM OFFLINE', show: phase >= 2, isActive: true },
  ]

  return (
    <motion.div
      className="ai-deactivation-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Sweep bar — reverse direction (bottom → top) */}
      <div className="ai-sweep-bar ai-sweep-bar--reverse" />

      {/* Status messages */}
      <div className="ai-activation-status">
        {statusLines.map(({ key, text, show, isActive }) =>
          show ? (
            <motion.span
              key={key}
              className={`ai-status-line ai-status-line--deactivation${isActive ? ' ai-status-line--deactivation-active' : ''}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {text}
            </motion.span>
          ) : null
        )}

        {/* Progress bar — reverse fill */}
        <div className="ai-scan-progress">
          <div className="ai-scan-progress__fill ai-scan-progress__fill--reverse" />
        </div>
        <span className="ai-status-line ai-status-line--label" style={{ opacity: 0.6 }}>
          returning to terminal...
        </span>
      </div>
    </motion.div>
  )
}

// ── Send Ripple ──────────────────────────────────────────────
function AiSendRipple() {
  return (
    <motion.div
      className="ai-send-ripple"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {[1, 1.6, 2.4].map((scale, i) => (
        <motion.div
          key={i}
          className="ai-send-ripple__ring"
          initial={{ width: 40, height: 40, opacity: 0.9 }}
          animate={{ width: 40 * scale * 12, height: 40 * scale * 12, opacity: 0 }}
          transition={{ duration: 0.6, delay: i * 0.08, ease: 'easeOut' }}
        />
      ))}
    </motion.div>
  )
}

// ── Ambient particles ────────────────────────────────────────
const PARTICLE_DEFS = [
  { left: '8%', size: 2, dur: '8s', delay: '0s' },
  { left: '22%', size: 1, dur: '11s', delay: '2s' },
  { left: '40%', size: 2, dur: '9s', delay: '1s' },
  { left: '58%', size: 1, dur: '13s', delay: '3.5s' },
  { left: '72%', size: 2, dur: '7s', delay: '0.5s' },
  { left: '88%', size: 1, dur: '10s', delay: '4s' },
  { left: '15%', size: 1, dur: '14s', delay: '6s' },
  { left: '50%', size: 2, dur: '6s', delay: '2.5s' },
]

function AiParticles() {
  return (
    <>
      {PARTICLE_DEFS.map((p, i) => (
        <span
          key={i}
          className="ai-particle"
          style={{
            left: p.left,
            bottom: 0,
            width: p.size,
            height: p.size,
            animationDuration: p.dur,
            animationDelay: p.delay,
            boxShadow: `0 0 ${p.size * 3}px rgba(77,208,206,0.8)`,
          }}
        />
      ))}
    </>
  )
}
