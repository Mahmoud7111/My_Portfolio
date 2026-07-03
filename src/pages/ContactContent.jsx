import { useState } from 'react'
import { Mail, Download } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../components/ui/BrandIcons'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const SOCIAL_ICONS = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  Mail: Mail,
}

export default function ContactContent() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

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

  const handleReset = () => setStatus('idle')

  return (
    <div className="compose-panel">
      <div className="compose-panel__chrome">
        <div className="compose-panel__chrome-left">
          <span className="compose-panel__bar">▍</span>
          <span className="compose-panel__filename">compose.sh</span>
          <span className="compose-panel__sep">—</span>
          <span className="compose-panel__subtitle">drop a line</span>
        </div>
        <span className="compose-panel__controls">⌃ ⌄ ×</span>
      </div>

      <div className="compose-panel__body">
        <pre className="contact-banner" aria-hidden="true">
          {ART.CONTACT}
        </pre>

        <div className="opener">
          <span className="opener__prompt">$ </span>
          <span className="opener__cmd">mail --compose </span>
          <span className="opener__target">{me.email}</span>
        </div>

        <div className="status-strip">
          <div className="status-item">
            <span className="status-item__dot" />
            <span className="status-item__value">open</span>
          </div>
          <span className="status-strip__divider">│</span>
          <div className="status-item">
            <span className="status-item__label">replies </span>
            <span className="status-item__value">&lt; 24h</span>
          </div>
          <span className="status-strip__divider">│</span>
          <div className="status-item">
            <span className="status-item__label">based in </span>
            <span className="status-item__value">Cairo, Egypt</span>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="contact-success">
            <pre className="contact-success__pre">
{`  \u2713 message queued
  \u2713 delivered to inbox
  \u2713 awaiting reply ...`}
            </pre>
            <button type="button" className="contact-success__btn" onClick={handleReset}>
              $ send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form__field">
              <label className="contact-form__label">
                <span className="contact-form__label-prefix">--</span>name
              </label>
              <input
                className="contact-form__input"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="ada lovelace"
                required
              />
            </div>

            <div className="contact-form__field">
              <label className="contact-form__label">
                <span className="contact-form__label-prefix">--</span>email
              </label>
              <input
                className="contact-form__input"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="ada@example.dev"
                required
              />
            </div>

            <div className="contact-form__field contact-form__field--full">
              <label className="contact-form__label">
                <span className="contact-form__label-prefix">--</span>message
              </label>
              <textarea
                className="contact-form__textarea"
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                placeholder="hey, i'm working on ..."
                required
              />
            </div>

            <div className="contact-form__actions">
              <button
                type="submit"
                className="contact-form__submit"
                disabled={status === 'sending'}
              >
                $ send --message
              </button>
            </div>

            {status === 'error' && (
              <div className="contact-error">failed to send. try again.</div>
            )}
          </form>
        )}

        <div className="contact-footer">
          <div className="contact-footer__left">
            <div className="contact-footer__prompt">
              <span className="contact-footer__prompt-dollar">$ </span>
              <span className="contact-footer__prompt-cmd">ls </span>
              <span className="contact-footer__prompt-path">./socials</span>
            </div>
            <h3 className="contact-footer__heading">Find me on</h3>
          </div>

          <div className="contact-footer__socials">
            {me.links.map((l) => {
              const Icon = SOCIAL_ICONS[l.icon]
              return (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-footer__icon-btn"
                  aria-label={l.label}
                >
                  {Icon && <Icon size={15} />}
                </a>
              )
            })}
          </div>
        </div>

        <div className="contact-download">
          <a href={me.resume} download className="contact-download__btn">
            <Download size={15} />
            download resume.pdf
          </a>
        </div>
      </div>
    </div>
  )
}
