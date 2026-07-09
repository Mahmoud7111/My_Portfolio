import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
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

// ── Tab definitions ───────────────────────────────────────────
const TABS = [
  { id: 'terminal',     path: '/',             label: 'terminal' },
  { id: 'projects',     path: '/projects',     label: 'projects' },
  { id: 'about',        path: '/about',        label: 'about' },
  { id: 'contact',      path: '/contact',      label: 'contact' },
  { id: 'achievements', path: '/achievements', label: 'your achievements' },
]

const PATH_MAP = {
  '/':             '~/home',
  '/projects':     '~/projects',
  '/about':        '~/about',
  '/contact':      '~/contact',
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
function useViewport() {
  const [vp, setVp] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  })
  useEffect(() => {
    const handler = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', handler, { passive: true })
    return () => window.removeEventListener('resize', handler)
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
  const navigate      = useNavigate()
  const location      = useLocation()
  const vp            = useViewport()

  const [windowState, setWindowState] = useState('hello')
  const [clock,       setClock]       = useState({ long: '', short: '' })
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [typingCount, setTypingCount] = useState(0)
  const [aiActivating, setAiActivating] = useState(false) // shows activation overlay
  const [aiReady,      setAiReady]      = useState(false)  // AI panel fully visible
  const [showRipple,   setShowRipple]   = useState(false)  // send ripple flash
  const bodyRef = useRef(null)
  const prevChatMode = useRef(false)

  const isTyping = typingCount > 0
  const startTyping = () => setTypingCount((n) => n + 1)
  const stopTyping  = () => setTypingCount((n) => Math.max(0, n - 1))

  const { history, input, setInput, submit, chatMode, runFromClick, inputRef, pushLine, tabComplete, getCompletion } =
    useTerminal()
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
        long:  now.toLocaleTimeString('en-GB', { hour12: false }),
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
    if (bodyRef.current) {
      bodyRef.current.scrollTop = 0
    }
  }, [location.pathname])

  // ── Auto-scroll to keep prompt in view after command output ──
  // Skipped in chat mode: chat replies arrive gradually via the
  // typewriter hook, and forcing a smooth scrollIntoView on every
  // history change competes with the user's manual touch scroll,
  // which on iOS makes subsequent taps feel unresponsive.
  useEffect(() => {
    if (location.pathname !== '/' || chatMode) return
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

  // ── Track minimise→restore cycles for easter egg ────────────
  const prevWindowState = useRef(windowState)
  useEffect(() => {
    if (prevWindowState.current === 'minimized' && windowState === 'normal') {
      onRestoreFromMinimized()
    }
    prevWindowState.current = windowState
  }, [windowState, onRestoreFromMinimized])

  // ── AI mode activation sequence ───────────────────────────────
  // When chatMode flips true → play the activation overlay for ~2.4s,
  // then mark aiReady so the holographic panel appears.
  // When chatMode flips false → immediately hide everything.
  useEffect(() => {
    if (chatMode && !prevChatMode.current) {
      // entering chat mode
      clearChat()
      setAiActivating(true)
      setAiReady(false)
      const t1 = setTimeout(() => setAiActivating(false), 2400)
      const t2 = setTimeout(() => setAiReady(true), 2000)
      prevChatMode.current = true
      return () => { clearTimeout(t1); clearTimeout(t2) }
    }
    if (!chatMode && prevChatMode.current) {
      // leaving chat mode — clear any stuck typewriter state so commands work immediately
      setAiActivating(false)
      setAiReady(false)
      setTypingCount(0)
      prevChatMode.current = false
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

  if (windowState === 'hello') {
    return <HelloWorldScreen onReady={() => setWindowState('normal')} />
  }

  if (windowState === 'closed') {
    return <TerminalClosedScreen onReturn={() => setWindowState('normal')} />
  }

  const currentPath  = PATH_MAP[location.pathname] ?? '~'
  const activeTabIdx = TABS.findIndex(t => t.path === location.pathname)

  // Framer Motion target + transition for current state
  const animTarget     = buildTarget(windowState, vp)
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
            animate={{ x: '-50%', y: 0,  opacity: 1 }}
            exit={{    x: '-50%', y: 30, opacity: 0 }}
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

      {/* ── Send Ripple ────────────────────────────────────────── */}
      <AnimatePresence>
        {showRipple && (
          <AiSendRipple key="ai-ripple" />
        )}
      </AnimatePresence>

      {/* ── Global backdrop dim ────────────────────────────────── */}
      <AnimatePresence>
        {chatMode && (
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
        className={`terminal-window${chatMode ? ' terminal-window--ai-mode' : ''}`}
        style={{
          position:      'fixed',
          zIndex:        windowState === 'maximized' ? 999 : 100,
          pointerEvents: windowState === 'minimized' ? 'none' : 'auto',
        }}
        initial={buildTarget('normal', vp)}
        animate={animTarget}
        transition={animTransition}
      >
        <ChatFAB chatMode={chatMode} />

        {/* ── Chat-mode ambient cyan glow (pulse) ─────────────── */}
        <AnimatePresence>
          {chatMode && (
            <motion.div
              key="chat-glow"
              className="terminal-chat-glow"
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.18, 0.5, 0] }}
              transition={{
                duration: 4.5,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0,
              }}
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
                className="traffic-light close"
                aria-label="Close terminal"
                onClick={() => { onCloseClick(); setWindowState('closed') }}
              />
            <button
              className="traffic-light minimize"
              aria-label="Minimize terminal"
              onClick={handleMinimize}
            />
            <button
              className="traffic-light maximize"
              aria-label={windowState === 'maximized' ? 'Restore' : 'Maximize'}
              onClick={handleMaximize}
            />
          </div>

          <span className="tmux-session ">
            <span className="tmux-dim">[tmux]</span>
            <span className="tmux-dim"> session </span>
            <span className="tmux-name">{chatMode ? 'ai-shell' : 'portfolio'}</span>
            <span className="tmux-dim"> · pane {activeTabIdx + 1}/{TABS.length}</span>
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

        {/* ══ ROW 2 — shell prompt ════════════════════════════ */}
        <div className={`trow trow--prompt${chatMode ? ' ai-mode-tinted' : ''}`}>
          <span className="sh-time">[ {clock.long} ]</span>
          <span className="sh-user"> mahmoud</span>
          <span className="sh-dim"> @ </span>
          <span className="sh-host" style={chatMode ? { color: 'var(--cyan)', textShadow: '0 0 10px rgba(77,208,206,0.4)' } : undefined}>portfolio.dev</span>
          <span className="sh-dim"> : </span>
          <span className="sh-path">{chatMode ? '~/ai-shell' : currentPath}</span>
          {chatMode ? (
            <span style={{ color: 'var(--text-dim)', marginLeft: 6, fontSize: 11 }}>mode:assistant</span>
          ) : (
            <span className="sh-git">
              {' '}git:<span className="sh-branch">(main)</span>
            </span>
          )}
          <span className="sh-chevron"> &gt;</span>
          <span className="sh-cmd">{chatMode ? ' chat' : ' ls'}</span>
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

              {/* Dim intro text in AI mode */}
              <motion.div
                animate={{ opacity: chatMode ? 0.3 : 1 }}
                transition={{ duration: 0.6 }}
                style={{ marginTop: 16, marginBottom: 16 }}
              >
                <p className="hc-intro">Welcome to my interactive portfolio terminal.</p>
                <p className="hc-intro" style={{ lineHeight: 1.6 }}>
                  Explore my work and learn more about me by entering <span style={{ color: 'var(--cyan)' }}>terminal commands</span>,
                  <br />
                  chatting in <span style={{ color: 'var(--coral)' }}>plain English</span>,
                  <br />
                  or selecting a section from the <span style={{ color: 'var(--gold)' }}>navigation menu</span> above.
                </p>
                <p className="hc-hint">
                  Type <span className="hc-key">'help'</span> for commands &nbsp;·&nbsp;{' '}
                  <span className="hc-key">'chat'</span> to open the AI assistant
                </p>
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
                        placeholder="Ask me anything — type 'exit' to leave AI mode"
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
                    </div>
                  </form>
                </motion.div>
              ) : (
                // Normal command prompt
                <form
                  onSubmit={handleSubmit}
                  className="terminal-prompt"
                  style={{ marginTop: 8, marginBottom: 32, position: 'relative' }}
                >
                  <span className="prompt-symbol">$</span>
                  <div className="terminal-input-wrap" style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
                    {/* Ghost autocomplete suggestion rendered behind the input */}
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
                        return match
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
                      autoFocus
                      spellCheck={false}
                      autoComplete="off"
                      placeholder=""
                      style={{
                        flex: 1,
                        background: 'transparent',
                        color: 'var(--cyan)',
                        fontFamily: 'var(--font-mono)',
                        // 16px is the iOS threshold — anything smaller triggers
                        // the viewport auto-zoom-on-focus behaviour.
                        fontSize: 16,
                        caretColor: 'var(--coral)',
                        position: 'relative',
                        zIndex: 1,
                      }}
                    />
                  </div>
                </form>
              )}
              <HomeContent />
            </>
          )}

          {location.pathname === '/projects'     && <ProjectsContent />}
          {location.pathname === '/about'        && <AboutContent />}
          {location.pathname === '/contact'      && <ContactContent />}
          {location.pathname === '/achievements' && <AchievementsContent />}
          </motion.div>
          </AnimatePresence>
        </div>

        {/* ══ Powerline footer ════════════════════════════════ */}
        <PowerlineFooter currentPath={currentPath} shortTime={clock.short} chatMode={chatMode} />
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

// ── Powerline footer ─────────────────────────────────────────
function PowerlineFooter({ currentPath, shortTime, chatMode }) {
  return (
    <div className={`powerline${chatMode ? ' powerline--ai-mode' : ''}`} aria-hidden="true">
      <Seg variant="coral"    dir="right" z={3}>{chatMode ? 'AI-SHELL' : 'NORMAL'}</Seg>
      <Seg variant="surface3" dir="right" z={2}>{chatMode ? 'llm:active' : 'main ±0'}</Seg>
      <Seg variant="surface2" dir="right" z={1}>{chatMode ? '~/ai-shell' : currentPath}</Seg>

      <div className="powerline-spacer">
        <span className="pl-hints">
          {chatMode ? (
            <><span className="pl-hint-key">exit</span> return to terminal{'  '}
            <span className="pl-hint-key">◈ llm</span> ai active</>  
          ) : (
            <><span className="pl-hint-key">^C</span> exit
            {'  '}<span className="pl-hint-key">^D</span> logout
            {'  '}<span className="pl-hint-key">^L</span> clear
            {'  '}<span className="pl-hint-key">tab</span> autocomplete</>
          )}
        </span>
      </div>

      <Seg variant="surface2" dir="left" z={1}>{chatMode ? 'model │ ai' : 'utf-8 │ lf'}</Seg>
      <Seg variant="surface3" dir="left" z={2}>{chatMode ? '◈ online' : '● 100%'}</Seg>
      <Seg variant="cyan"     dir="left" z={3}>{shortTime}</Seg>
    </div>
  )
}

function Seg({ children, variant, dir, z = 1 }) {
  return (
    <span
      className={`pl-seg pl-seg--${variant} pl-seg--${dir}`}
      style={{ zIndex: z }}
    >
      {children}
    </span>
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
    { key: 'init',    text: 'INITIALIZING AI SUBSYSTEM...', show: phase >= 0 },
    { key: 'model',   text: 'LOADING LLM: neural inference engine', show: phase >= 0 },
    { key: 'ctx',     text: 'BUILDING CONTEXT FROM me.js...', show: phase >= 1 },
    { key: 'ready',   text: '◈ ASSISTANT SHELL READY', show: phase >= 2, isActive: true },
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
  { left: '8%',  size: 2, dur: '8s',  delay: '0s'    },
  { left: '22%', size: 1, dur: '11s', delay: '2s'    },
  { left: '40%', size: 2, dur: '9s',  delay: '1s'    },
  { left: '58%', size: 1, dur: '13s', delay: '3.5s'  },
  { left: '72%', size: 2, dur: '7s',  delay: '0.5s'  },
  { left: '88%', size: 1, dur: '10s', delay: '4s'    },
  { left: '15%', size: 1, dur: '14s', delay: '6s'    },
  { left: '50%', size: 2, dur: '6s',  delay: '2.5s'  },
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
