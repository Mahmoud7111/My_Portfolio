import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import AsciiArt from '../ascii/AsciiArt'
import { ART } from '../ascii/art'
import CommandOutput from '../commands/CommandOutput'
import { useTerminal } from '../../hooks/useTerminal'
import { useChat } from '../../hooks/useChat'
import { useEasterEggs } from '../../hooks/useEasterEggs'
import { useGlobalAchievements } from '../../hooks/useGlobalAchievements'
import { me } from '../../data/me'
import TerminalClosedScreen from './TerminalClosedScreen'
import HelloWorldScreen from './HelloWorldScreen'
import AchievementToast from '../ui/AchievementToast'
import TypewriterText from '../ui/TypewriterText'
import { useTypewriter } from '../../hooks/useTypewriter'

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
  const bodyRef = useRef(null)

  const isTyping = typingCount > 0
  const startTyping = () => setTypingCount((n) => n + 1)
  const stopTyping  = () => setTypingCount((n) => Math.max(0, n - 1))

  const { history, input, setInput, submit, chatMode, runFromClick, inputRef, pushLine } =
    useTerminal()
  const { sendMessage, isLoading } = useChat()

  const { lastUnlocked, clearLastUnlocked, onCloseClick, onMinimizeClick, onMaximizeClick, onRestoreFromMinimized } =
    useEasterEggs()
  useGlobalAchievements()

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
  useEffect(() => {
    if (location.pathname === '/' && inputRef.current) {
      inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [history, location.pathname])

  // ── Track minimise→restore cycles for easter egg ────────────
  const prevWindowState = useRef(windowState)
  useEffect(() => {
    if (prevWindowState.current === 'minimized' && windowState === 'normal') {
      onRestoreFromMinimized()
    }
    prevWindowState.current = windowState
  }, [windowState, onRestoreFromMinimized])


  // ── Submit ───────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isTyping) return // ignore Enter while output is being typed out
    const value = input.trim()
    if (chatMode && value && value.toLowerCase() !== 'exit') {
      submit()
      const reply = await sendMessage(value)
      pushLine({ type: 'chat-reply', value: reply })
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

      {/* ── Terminal window ─────────────────────────────────────── */}
      <motion.div
        className="terminal-window"
        style={{
          position:      'fixed',
          zIndex:        windowState === 'maximized' ? 999 : 100,
          pointerEvents: windowState === 'minimized' ? 'none' : 'auto',
        }}
        initial={buildTarget('normal', vp)}
        animate={animTarget}
        transition={animTransition}
      >

        {/* ══ ROW 1 — tmux title bar ══════════════════════════ */}
        <div className="trow trow--tmux">
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
            <span className="tmux-name">portfolio</span>
            <span className="tmux-dim"> · pane {activeTabIdx + 1}/{TABS.length}</span>
          </span>

          <div className="tmux-right ">
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
          </div>
        </div>

        {/* ══ ROW 2 — shell prompt ════════════════════════════ */}
        <div className="trow trow--prompt ">
          <span className="sh-time">[ {clock.long} ]</span>
          <span className="sh-user"> mahmoud</span>
          <span className="sh-dim"> @ </span>
          <span className="sh-host">portfolio.dev</span>
          <span className="sh-dim"> : </span>
          <span className="sh-path">{currentPath}</span>
          <span className="sh-git">
            {' '}git:<span className="sh-branch">(main)</span>
          </span>
          <span className="sh-chevron"> &gt;</span>
          <span className="sh-cmd"> ls</span>
        </div>

        {/* ══ ROW 3 — tmux windows tab bar ════════════════════ */}
        <div className="trow trow--tabs" style={{ position: 'relative' }}>
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
                  onClick={() => setMenuOpen(false)}
                >
                  <span className="tab-cmd">↓ resume</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ══ Body ════════════════════════════════════════════ */}
        <div
          className={`terminal-body ${windowState === 'maximized' ? 'terminal-body--maximized' : ''}`}
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
              <AsciiArt
                art={ART.HERO}
                color="var(--cyan)"
                glow="var(--cyan-glow)"
                fontSize="clamp(9px, 1.8vw, 18px)"
                hideOnMobile={false}
              />
              <div style={{ marginTop: 16, marginBottom: 16 }}>
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
              </div>
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
              </div>
              {isLoading && (
                <p style={{ color: 'var(--text-muted)' }}>thinking...</p>
              )}
              <form
                onSubmit={handleSubmit}
                className="terminal-prompt"
                style={{ marginTop: 8, marginBottom: 32 }}
              >
                <span className="prompt-symbol">$</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  placeholder={chatMode ? 'Ask me anything...' : ''}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    color: 'var(--text-body)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    caretColor: 'var(--coral)',
                  }}
                />
              </form>
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
        <PowerlineFooter currentPath={currentPath} shortTime={clock.short} />
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
function PowerlineFooter({ currentPath, shortTime }) {
  return (
    <div className="powerline " aria-hidden="true">
      <Seg variant="coral"    dir="right" z={3}>NORMAL</Seg>
      <Seg variant="surface3" dir="right" z={2}>main ±0</Seg>
      <Seg variant="surface2" dir="right" z={1}>{currentPath}</Seg>

      <div className="powerline-spacer">
        <span className="pl-hints">
          <span className="pl-hint-key">^C</span> exit
          {'  '}<span className="pl-hint-key">^D</span> logout
          {'  '}<span className="pl-hint-key">^L</span> clear
          {'  '}<span className="pl-hint-key">tab</span> autocomplete
        </span>
      </div>

      <Seg variant="surface2" dir="left" z={1}>utf-8 │ lf</Seg>
      <Seg variant="surface3" dir="left" z={2}>● 100%</Seg>
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
function ChatReplyLine({ value, onTypingStart, onTypingDone }) {
  const { typedLines, isTyping } = useTypewriter(value, 18, onTypingDone)
  const startedRef = useRef(false)

  useEffect(() => {
    if (isTyping && !startedRef.current) {
      startedRef.current = true
      onTypingStart?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <p style={{ color: 'var(--text-body)', marginBottom: 8 }}>
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
function HistoryLine({ entry, onCommandClick, onTypingStart, onTypingDone }) {
  if (entry.type === 'input') {
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
          lineClassName="tw-system-line"
          lineStyle={{ color: 'var(--text-body)' }}
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
        onTypingStart={onTypingStart}
        onTypingDone={onTypingDone}
      />
    )
  }
  return null
}
