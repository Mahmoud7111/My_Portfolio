import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useAchievements } from '../hooks/useAchievements'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const VALID_ROUTES = [
  { to: '/',             label: 'terminal',     sublabel: 'back to the home shell' },
  { to: '/projects',     label: 'projects',     sublabel: 'browse the project gallery' },
  { to: '/about',        label: 'about',        sublabel: 'bio, journey, stack, milestones' },
  { to: '/contact',      label: 'contact',      sublabel: 'send a message via the compose shell' },
  { to: '/achievements', label: 'achievements', sublabel: 'view your unlocked achievements' },
]

// Hand-laid ASCII banner. Every row is exactly 60 columns wide.
// Single-line box-drawing only — no ═ (U+2550 "heavy double"), which renders
// looking like "22" in JetBrains Mono at small sizes (the original source
// of the stray "22" glyph in the banner).
const NOT_FOUND_ASCII = [
  '┌──────────────────────────────────────────────────────────┐',
  '│                                                          │',
  '│   ███╗   ██╗ ██████╗ ████████╗    ███████╗ ██████╗       │',
  '│   ████╗  ██║██╔═══██╗╚══██╔══╝    ╚════██║ ╚════██╗      │',
  '│   ██╔██╗ ██║██║   ██║   ██║        █████╔╝  █████╔╝      │',
  '│   ██║╚██╗██║██║   ██║   ██║       ██╔═══╝  ██╔═══╝       │',
  '│   ██║ ╚████║╚██████╔╝   ██║       ███████╗ ███████╗      │',
  '│   ╚═╝  ╚═══╝ ╚═════╝    ╚═╝       ╚══════╝ ╚══════╝      │',
  '│                                                          │',
  '│           ▄▄▄▄  HTTP 404 ▄▄▄▄   signal lost              │',
  '│                                                          │',
  '│         $ curl <path>  ->  bash: route not found         │',
  '│                                                          │',
  '└──────────────────────────────────────────────────────────┘',
].join('\n')

const fadeUp = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
}

export default function NotFound() {
  const prefersReduced = usePrefersReducedMotion()
  const { unlock, isUnlocked } = useAchievements()

  // Auto-unlock on mount: anyone who genuinely hits a 404 lands here and
  // immediately earns the achievement — no extra interaction required.
  useEffect(() => {
    if (!isUnlocked('404-explorer')) {
      unlock('404-explorer')
    }
  }, [isUnlocked, unlock])

  const Wrap = prefersReduced ? 'div' : motion.div
  const Item = prefersReduced ? 'div' : motion.div

  return (
    <div className="nf-root">

      {/* ══ PANEL 1 — 404 banner ═══════════════════════════════════════════ */}
      <Wrap
        {...(!prefersReduced && {
          variants: fadeUp,
          initial: 'hidden',
          animate: 'visible',
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        })}
      >
        <div className="hc-panel" style={{ marginBottom: 32 }}>
          <div className="hc-panel__chrome">
            <div className="hc-panel__chrome-left">
              <span className="hc-panel__bar">▍</span>
              <span className="hc-panel__filename">status.sh</span>
              <span className="hc-panel__sep">—</span>
              <span className="hc-panel__subtitle">http 404 · not found</span>
            </div>
            <span className="hc-panel__controls">⌃ ⌄ ×</span>
          </div>

          <div className="hc-panel__body nf-banner-body">
            <p className="hc-cmd-line">
              <span className="hc-prompt">$</span>{' '}
              <span className="hc-cmd">curl </span>
              <span className="hc-var">{typeof window !== 'undefined' ? window.location.pathname : '/unknown'}</span>
            </p>

            <pre className="nf-ascii" aria-hidden="true">{NOT_FOUND_ASCII}</pre>

            <p className="nf-status">
              <span className="nf-status__dot" aria-hidden="true">●</span>
              <span className="nf-status__label">bash</span>
              <span className="nf-status__sep">:</span>
              <span className="nf-status__msg">route not found in the file system.</span>
            </p>

            <p className="nf-hint">
              <span className="nf-hint__cmd">try</span>{' '}
              <code className="nf-hint__code">cd ..</code>{' '}
              <span className="nf-hint__cmd">or jump to one of the tabs above</span>
            </p>
          </div>
        </div>
      </Wrap>

      {/* ══ PANEL 2 — quick links ══════════════════════════════════════════ */}
      <Wrap
        {...(!prefersReduced && {
          variants: fadeUp,
          initial: 'hidden',
          animate: 'visible',
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
        })}
      >
        <div className="hc-panel" style={{ marginBottom: 32 }}>
          <div className="hc-panel__chrome">
            <div className="hc-panel__chrome-left">
              <span className="hc-panel__bar">▍</span>
              <span className="hc-panel__filename">routes.sh</span>
              <span className="hc-panel__sep">—</span>
              <span className="hc-panel__subtitle">{VALID_ROUTES.length} known paths</span>
            </div>
            <span className="hc-panel__controls">⌃ ⌄ ×</span>
          </div>

          <div className="hc-panel__body">
            <p className="hc-cmd-line">
              <span className="hc-prompt">$</span>{' '}
              <span className="hc-cmd">ls </span>
              <span className="hc-var">./valid-routes</span>
            </p>

            <ol className="nf-routes">
              {VALID_ROUTES.map((r, i) => (
                <Item
                  key={r.to}
                  className="nf-route"
                  {...(!prefersReduced && {
                    initial: { opacity: 0, x: -12 },
                    animate: { opacity: 1, x: 0 },
                    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.15 + i * 0.06 },
                  })}
                >
                  <Link to={r.to} className="nf-route__link">
                    <span className="nf-route__idx">{String(i + 1).padStart(2, '0')}</span>
                    <span className="nf-route__cmd">
                      <span className="nf-route__prompt">$</span> cd{' '}
                      <span className="nf-route__path">{r.to}</span>
                    </span>
                    <span className="nf-route__label">{r.label}</span>
                    <span className="nf-route__sub">— {r.sublabel}</span>
                  </Link>
                </Item>
              ))}
            </ol>

            <div className="nf-back-home">
              <Link to="/" className="ab-download-btn nf-back-home__btn">
                <span>$ cd ~</span>
              </Link>
            </div>
          </div>
        </div>
      </Wrap>

    </div>
  )
}
