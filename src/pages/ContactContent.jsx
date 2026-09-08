import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Download } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { GithubIcon, LinkedinIcon } from '../components/ui/BrandIcons'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'
import { useResumeAchievement } from '../hooks/useResumeAchievement'
import { useAchievements } from '../hooks/useAchievements'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const SERVICE_ID          = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID_CONTACT = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_CONTACT
const TEMPLATE_ID_AUTOREPLY = import.meta.env.VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY
const PUBLIC_KEY          = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_MSG  = 2000

const ERRORS = {
  name:        'name is required',
  email:       'enter a valid email address',
  message:     'message is required',
  messageLong: 'message must be under 2000 characters',
}

function validate({ name, email, message }) {
  const errors = {}
  if (!name.trim())             errors.name    = ERRORS.name
  if (!EMAIL_RE.test(email))    errors.email   = ERRORS.email
  if (!message.trim())          errors.message = ERRORS.message
  else if (message.length > MAX_MSG) errors.message = ERRORS.messageLong
  return errors
}

const SOCIAL_ICONS = {
  Github:   GithubIcon,
  Linkedin: LinkedinIcon,
  Mail:     Mail,
}

const fieldVariant = (i) => ({
  hidden:  { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 },
  },
})

export default function ContactContent() {
  const [form, setForm]     = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState('idle')
  const [errors, setErrors] = useState({})
  const onResumeClick       = useResumeAchievement()
  const { unlock }          = useAchievements()
  const prefersReduced      = usePrefersReducedMotion()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length > 0) { setErrors(found); return }

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
      if (results[0].status === 'fulfilled') {
        setStatus('sent')
        setForm({ name: '', email: '', message: '', website: '' })
        unlock('contact-made')
      } else {
        console.error('contact send failed:', results[0].reason)
        setStatus('error')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const handleReset = () => { setStatus('idle'); setErrors({}) }

  const Wrap = prefersReduced ? 'div' : motion.div

  // Links to show in the Links card (GitHub + LinkedIn only)
  const sideLinks = me.links.filter(l => l.label === 'GitHub' || l.label === 'LinkedIn')

  return (
    <div className="ct-wrap">

      {/* ── ASCII Banner ───────────────────────────────── */}
      <Wrap
        {...(!prefersReduced && {
          initial:    { opacity: 0, y: -12 },
          animate:    { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        })}
      >
        <pre className="contact-banner" aria-hidden="true">
          {ART.CONTACT}
        </pre>
      </Wrap>


      {/* ── 2-column grid ────────────────────────────── */}
      <div className="ct-grid">

        {/* LEFT: Send a Message */}
        <motion.div
          className="ct-card ct-card--form"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <p className="ct-card__eyebrow">Send a Message</p>
          <p className="ct-card__sub">Fill out the form below to get in touch with me.</p>

          {status === 'sent' ? (
            <motion.div
              className="contact-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <pre className="contact-success__pre">
{`  ✓ Message sent!
  ✓ Delivered to my inbox
  ✓ I'll get back to you within 24 hours`}
              </pre>
              <div className="contact-success__spam-note">
                <span className="contact-success__spam-icon">!</span>
                <p>
                  didn't get the auto-reply? check your <strong>spam/junk</strong> folder
                  and mark it as <strong>"not spam"</strong> so future emails land in your inbox.
                </p>
              </div>
              <button type="button" className="contact-success__btn" onClick={handleReset}>
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="ct-form" noValidate>

              {/* Honeypot */}
              <div className="ct-form__honeypot" aria-hidden="true">
                <label htmlFor="website">website (leave blank)</label>
                <input
                  type="text" id="website" name="website"
                  value={form.website} onChange={handleChange}
                  tabIndex={-1} autoComplete="off"
                />
              </div>

              {/* Name + Email row */}
              <div className="ct-form__row">
                <motion.div className="ct-form__field" variants={fieldVariant(0)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <label className="ct-form__label">Name</label>
                  <input
                    className={`ct-form__input${errors.name ? ' ct-form__input--err' : ''}`}
                    name="name" value={form.name} onChange={handleChange}
                    placeholder="your name"
                  />
                  {errors.name && <span className="ct-form__error">{errors.name}</span>}
                </motion.div>

                <motion.div className="ct-form__field" variants={fieldVariant(1)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <label className="ct-form__label">Email</label>
                  <input
                    className={`ct-form__input${errors.email ? ' ct-form__input--err' : ''}`}
                    type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="your@email.com"
                  />
                  {errors.email && <span className="ct-form__error">{errors.email}</span>}
                </motion.div>
              </div>

              {/* Message */}
              <motion.div className="ct-form__field ct-form__field--full" variants={fieldVariant(2)} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <label className="ct-form__label">Message</label>
                <textarea
                  className={`ct-form__textarea${errors.message ? ' ct-form__input--err' : ''}`}
                  name="message" rows={7} value={form.message} onChange={handleChange}
                  placeholder="hey, i'm working on ..."
                />
                {errors.message && <span className="ct-form__error">{errors.message}</span>}
              </motion.div>

              {/* Submit */}
              <div className="ct-form__actions">
                <button
                  type="submit"
                  className="ct-btn ct-btn--send"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </div>

              {status === 'error' && (
                <motion.div className="contact-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  failed to send. try again.
                </motion.div>
              )}
            </form>
          )}
        </motion.div>

        {/* RIGHT: Info + Links stacked */}
        <div className="ct-side">

          {/* Card: Contact Information */}
          <motion.div
            className="ct-card ct-card--info"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          >
            <p className="ct-card__eyebrow">Contact Information</p>

            <div className="ct-info-list">
              <a href={`mailto:${me.email}`} className="ct-info-row">
                <Mail size={16} className="ct-info-row__icon" />
                <span className="ct-info-row__text ct-info-row__text--link">{me.email}</span>
              </a>

              <div className="ct-info-row">
                <MapPin size={16} className="ct-info-row__icon" />
                <span className="ct-info-row__text">{me.location}</span>
              </div>
            </div>

            <a
              href={me.resumeUrl || '/My_Resume.pdf'}
              download
              className="ab-download-btn ct-btn--cv"
              onClick={onResumeClick}
            >
              <Download size={14} />
              <span>Download CV</span>
            </a>
          </motion.div>

          {/* Card: Links */}
          <motion.div
            className="ct-card ct-card--links"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            <p className="ct-card__eyebrow">Links</p>

            <div className="ct-links-row">
              {sideLinks.map((link) => {
                const Icon = SOCIAL_ICONS[link.icon] || GithubIcon
                return (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="ct-icon-btn"
                    aria-label={link.label}
                    title={link.label}
                    onClick={() => unlock('contact-made')}
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
