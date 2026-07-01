import { useTranslation } from 'react-i18next'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'
import { useAchievements } from '../hooks/useAchievements'

export default function AchievementsContent() {
  const { t } = useTranslation()
  const { all, isUnlocked, progress } = useAchievements()

  return (
    <div className="tab-content-inner">
      <AsciiArt art={ART.ACHIEVED} color="var(--coral)" glow="var(--coral-glow)" />
      <AsciiArt art={ART.TROPHY} color="var(--gold)" fontSize="10px" hideOnMobile={false} />

      <h2 style={{ marginTop: 24 }}>my publications &amp; achievements</h2>
      <div style={{ marginTop: 16 }}>
        {me.achievements.map((a, i) => (
          <p key={i}>
            <span style={{ color: 'var(--gold)' }}>★</span> {a.title}{' '}
            <span style={{ color: 'var(--text-muted)' }}>
              — {a.org} · {a.year}
            </span>
          </p>
        ))}
      </div>

      <h2 style={{ marginTop: 40 }}>{t('achievements.yourAchievements')}</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>// {progress} unlocked</p>

      <div className="achievements-grid">
        {all.map((a) => (
          <div key={a.id} className={`achievement-card ${isUnlocked(a.id) ? 'unlocked' : ''}`}>
            <span className="achievement-icon">★</span>
            <div>
              <div className="achievement-name">{a.name}</div>
              <div className="achievement-desc">{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
