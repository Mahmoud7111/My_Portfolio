import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import emailjs from '@emailjs/browser'
import AsciiArt from '../components/ascii/AsciiArt'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export default function ContactContent() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div className="tab-content-inner">
      <AsciiArt art={ART.CONTACT} color="var(--coral)" glow="var(--coral-glow)" />
      <AsciiArt
        art={ART.EMAIL_BOX}
        color="var(--text-muted)"
        fontSize="11px"
        hideOnMobile={false}
        className="email-box"
      />

      <form onSubmit={handleSubmit} style={{ marginTop: 24 }}>
        <div className="field">
          <label>
            <span className="flag">--</span>name
          </label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>
            <span className="flag">--</span>email
          </label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="field">
          <label>
            <span className="flag">--</span>message
          </label>
          <textarea name="message" rows={3} value={form.message} onChange={handleChange} required />
        </div>

        <button type="submit" className="btn-submit" disabled={status === 'sending'}>
          {t('contact.submit')}
        </button>

        {status === 'sent' && (
          <p style={{ color: 'var(--cyan)', marginTop: 10 }}>✓ {t('contact.success')}</p>
        )}
        {status === 'error' && (
          <p style={{ color: 'var(--coral)', marginTop: 10 }}>{t('contact.error')}</p>
        )}
      </form>

      <p style={{ marginTop: 24, color: 'var(--text-muted)' }}>
        or reach me directly at{' '}
        <a href={`mailto:${me.email}`} style={{ color: 'var(--cyan)' }}>
          {me.email}
        </a>
      </p>
    </div>
  )
}
