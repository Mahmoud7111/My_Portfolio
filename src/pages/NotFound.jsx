import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="container" style={{ padding: '120px 24px', textAlign: 'center' }}>
      <p style={{ color: 'var(--coral)', fontFamily: 'var(--font-mono)', fontSize: 18 }}>
        {t('notFoundPage.code')}
      </p>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>{t('notFoundPage.hint')}</p>
      <Link to="/" style={{ color: 'var(--cyan)', display: 'inline-block', marginTop: 24 }}>
        {t('notFoundPage.back')}
      </Link>
    </div>
  )
}
