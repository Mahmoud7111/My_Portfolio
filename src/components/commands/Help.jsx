import { useTranslation } from 'react-i18next'
import { COMMANDS } from '../../data/commands'

export default function Help({ onCommandClick }) {
  const { t } = useTranslation()

  return (
    <div className="cmd-output">
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>{t('terminal.helpHeader')}</p>
      {COMMANDS.map((c) => (
        <div
          key={c.id}
          className="cmd-line"
          onClick={() => onCommandClick?.(c.id)}
          style={{ display: 'flex', gap: 16 }}
        >
          <span className="cmd-name" style={{ minWidth: 160 }}>
            {c.id}
          </span>
          <span className="cmd-desc">{t(c.descKey)}</span>
        </div>
      ))}
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{t('terminal.helpFooter')}</p>
    </div>
  )
}
