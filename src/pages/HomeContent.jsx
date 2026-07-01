import { useTranslation } from 'react-i18next'
import { me } from '../data/me'

// The introductory text shown below the ASCII hero on the terminal home tab
export default function HomeContent() {
  const { t } = useTranslation()
  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ color: 'var(--text-body)' }}>
        Welcome to my interactive portfolio terminal!
      </p>
      <p style={{ color: 'var(--text-body)' }}>
        You can learn everything you want about me by interacting with this terminal via typing
        commands,
      </p>
      <p style={{ color: 'var(--text-body)' }}>by using natural language in chat mode,</p>
      <p style={{ color: 'var(--text-body)', marginBottom: 16 }}>
        Or by simply selecting a tab from the menu above.
      </p>
      <p style={{ color: 'var(--text-muted)' }}>Type &apos;help&apos; to see available commands.</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: 8 }}>
        Type &apos;chat&apos; to open my AI chatbot for natural language questions.
      </p>
    </div>
  )
}
