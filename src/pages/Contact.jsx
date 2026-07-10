import { useState } from 'react'
import { Mail, Download } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../components/ui/BrandIcons'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT
const TEMPLATE_ID_AUTOREPLY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const SOCIAL_ICONS = {
  Github: GithubIcon,
  Linkedin: LinkedinIcon,
  Twitter: TwitterIcon,
  Mail: Mail,
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MSG = 2000

const ERRORS = {
  name: 'name is required',
  email: 'enter a valid email address',
  message: 'message is required',
  messageLong: 'message must be under 2000 characters',
}

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim()) errors.name = ERRORS.name
  if (!EMAIL_RE.test(email)) errors.email = ERRORS.email
  if (!message.trim()) errors.message = ERRORS.message
  else if (message.length > MAX_MSG) errors.message = ERRORS.messageLong
  return errors
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setErrors(found)
      return
    }

    // Honeypot: if the hidden field is filled, silently pretend success
    // without hitting emailjs — wastes the bot's time without tipping it off.
    if (form.website) {
      setStatus('sent')
      setForm({ name: '', email: '', message: '', website: '' })
      return
    }

    const payload = { name: form.name, email: form.email, message: form.message }
    setStatus('sending')
    try {
      const results = await Promise.allSettled([
        emailjs.send(SERVICE_ID, TEMPLATE_ID_CONTACT, payload, PUBLIC_KEY),
        emailjs.send(SERVICE_ID, TEMPLATE_ID_AUTOREPLY, payload, PUBLIC_KEY),
      ])
      const contactResult = results[0]
      if (contactResult.status === 'fulfilled') {
        setStatus('sent')
        setForm({ name: '', email: '', message: '', website: '' })
      } else {
        console.error('contact send failed:', contactResult.reason)
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setErrors({})
  }

  return (
    <div className="contact-page">
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
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div
                className="contact-form__honeypot"
                aria-hidden="true"
              >
                <label htmlFor="website">website (leave blank)</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={form.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

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
                {errors.name && (
                  <span className="contact-form__error">{errors.name}</span>
                )}
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
                {errors.email && (
                  <span className="contact-form__error">{errors.email}</span>
                )}
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
                {errors.message && (
                  <span className="contact-form__error">{errors.message}</span>
                )}
              </div>

              <div className="contact-form__actions">
                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'sending...' : '$ send --message'}
                </button>
              </div>

              {status === 'error' && (
                <div className="contact-error">failed to send. try again.</div>
              )}
            </form>
          )}
        </div>

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
            $ download resume.pdf
          </a>
        </div>
      </div>
    </div>
  )
}
