import { useState } from 'react'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { useAchievements } from '../hooks/useAchievements'
import ConfirmDialog from '../components/ui/ConfirmDialog'

const FILTERS = ['all', 'unlocked', 'locked', 'common', 'rare', 'legendary']

export default function AchievementsContent() {
  const { all, unlocked, isUnlocked, progress, clearAll } = useAchievements()
  const [activeFilter, setActiveFilter] = useState('all')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const [num, den] = progress.split('/').map(Number)
  const pct = den > 0 ? Math.round((num / den) * 100) : 0
  const BAR_BLOCKS = 30
  const filled = Math.round((pct / 100) * BAR_BLOCKS)
  const empty = BAR_BLOCKS - filled

  // ─── filter pills ───
  const pillLabel = (id) =>
    id === 'all' ? 'All' : Array.from(id).map(c => c.toUpperCase()).join('')
  const pillCount = (id) => {
    switch (id) {
      case 'all': return all.length
      case 'unlocked': return unlocked.length
      case 'locked': return all.length - unlocked.length
      default: return all.filter((a) => a.rarity === id).length
    }
  }

  // ─── filtered achievements ───
  const filtered = all.filter((a) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'unlocked') return isUnlocked(a.id)
    if (activeFilter === 'locked') return !isUnlocked(a.id)
    return a.rarity === activeFilter
  })

  // ─── rarity meta ───
  const rarityMeta = {
    common: { label: 'Common', color: '#4dd0ce' },
    rare: { label: 'Rare', color: '#b47ecc' },
    legendary: { label: 'Legendary', color: '#febc2e' },
  }

  // ─── locked name randomizer ───
  const scramble = (id) => {
    // deterministic per ID
    const base = '??? ????????'
    let hash = 0
    for (let i = 0; i < id.length; i++) hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0
    return base
  }

  return (
    <div className="achievements-page container">
      {/* Terminal header */}
      <div className="achv-header">
        <div className="hc-cmd-line">
          <span className="hc-prompt">$</span>
          <span className="hc-cmd">cat </span>
          <span className="hc-var">achievements.log</span>
        </div>
        <AsciiArt art={ART.ACHIEVEMENTS} color="var(--coral)" glow="var(--coral-glow)" />
      </div>

      {/* Progress block */}
      <div className="achv-progress-block">
        <div className="hc-cmd-line">
          <span className="hc-prompt">$</span>
          <span className="hc-cmd">progress --show</span>
        </div>
        <div className="achv-progress-top">
          <span className="achv-progress-fraction"><span className="achv-fraction-num">{num} / {den}</span> <span className="achv-progress-pct">({pct}%)</span></span>
          <span className="achv-progress-tag">rm --unlocked  // {num} unlocked</span>
        </div>
        <div className="achv-progress-bar">
          <span className="achv-bar-bracket">[</span>
          <span className="achv-bar-fill">{'█'.repeat(filled)}</span>
          <span className="achv-bar-empty">{'░'.repeat(empty)}</span>
          <span className="achv-bar-bracket">]</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="achv-filters">
        {FILTERS.map((f) => {
          const isActive = activeFilter === f
          return (
            <button
              key={f}
              className={`achv-filter-pill ${isActive ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
              type="button"
            >
              --{pillLabel(f)}<span className="achv-filter-count">{pillCount(f)}</span>
            </button>
          )
        })}
      </div>

      {/* Cards grid */}
      <div className="achievements-grid">
        {filtered.map((a) => {
          const locked = !isUnlocked(a.id)
          const meta = rarityMeta[a.rarity]
          const hiddenName = scramble(a.id)
          return (
            <div
              key={a.id}
              className={`achievement-card ${locked ? 'locked' : 'unlocked'}`}
              style={{
                '--card-glow': locked ? 'transparent' : meta.color,
                '--card-border': locked ? 'var(--border)' : meta.color,
              }}
            >
              <div className="card-top-bar">
                <span className="card-rarity" style={{ color: meta.color }}>
                  {locked ? '? ? ?' : meta.label}
                </span>
                <span className="card-status">
                  {locked ? (
                    <>
                      <span className="card-status-dot locked" /> Locked
                    </>
                  ) : (
                    <>
                      <span className="card-status-dot unlocked" /> Unlocked
                    </>
                  )}
                </span>
              </div>

              <h3 className="card-title"><span className="card-title-icon">{a.icon}</span> {locked ? hiddenName : a.name}</h3>
              <p className="card-desc">{locked ? (a.lockedDesc || '???? ????????') : a.desc}</p>

              <div className="card-actions">
                {locked ? (
                  <span className="card-btn locked">
                    <span>🔒</span> Locked
                  </span>
                ) : (
                  <span className="card-btn unlocked" style={{ color: meta.color }}>
                    <span>✓</span> Claimed
                  </span>
                )}
              </div>
              {locked && <div className="card-lock-overlay" />}
            </div>
          )
        })}
      </div>

      {/* Clear button */}
      <div className="achv-clear">
        <button className="achv-clear-btn" onClick={() => setShowClearConfirm(true)} type="button">
          <span className="hc-prompt">$</span>
          <span className="hc-cmd">rm --reset </span>
          <span className="hc-var">achievements.db</span>
        </button>
        <span className="achv-clear-hint">// clears all achievement data</span>
      </div>

      <ConfirmDialog
        open={showClearConfirm}
        title="Warning"
        message="This will delete all unlocked achievements, and there is no way to recover them except by completing the achievements again."
        confirmLabel="Confirm"
        cancelLabel="Cancel"
        danger
        onConfirm={() => { clearAll(); setShowClearConfirm(false) }}
        onCancel={() => setShowClearConfirm(false)}
      />
    </div>
  )
}
