import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Download } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../components/ui/BrandIcons'
import { ART } from '../components/ascii/art'
import { me } from '../data/me'
import RevealOnScroll from '../components/ui/RevealOnScroll'
import TypingLine from '../components/ui/TypingLine'
import { useResumeAchievement } from '../hooks/useResumeAchievement'
import { useAchievements } from '../hooks/useAchievements'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const SOCIAL_ICONS = {
  Github:   GithubIcon,
  Linkedin: LinkedinIcon,
  Twitter:  TwitterIcon,
  Mail:     Mail,
}

// Shared motion variants
const fadeUp = {
  hidden:  { opacity: 0, y: 20, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)' },
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
  const [form, setForm]     = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')
  const onResumeClick       = useResumeAchievement()
  const { unlock }          = useAchievements()
  const prefersReduced      = usePrefersReducedMotion()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, form, PUBLIC_KEY)
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      unlock('contact-made')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  const handleReset = () => setStatus('idle')

  const Wrap = prefersReduced ? 'div' : motion.div

  return (
    <div className="compose-panel">
      {/* Chrome bar */}
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

        {/* ASCII Banner */}
        <Wrap
          {...(!prefersReduced && {
            initial: { opacity: 0, y: -12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
          })}
        >
          <pre className="contact-banner" aria-hidden="true">
            {ART.CONTACT}
          </pre>
        </Wrap>

        {/* Command line opener */}
        <Wrap
          {...(!prefersReduced && {
            initial: { opacity: 0, x: -16 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.1 },
          })}
        >
          <TypingLine text={`mail --compose ${me.email}`} wrapperClassName="opener">
            <span className="opener__cmd">mail --compose </span>
            <span className="opener__target">{me.email}</span>
          </TypingLine>
        </Wrap>

        {/* Status strip */}
        <Wrap
          {...(!prefersReduced && {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            transition: { duration: 0.4, delay: 0.2 },
          })}
        >
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
        </Wrap>

        {/* Form / Success */}
        <RevealOnScroll delay={0.15}>
          {status === 'sent' ? (
            <motion.div
              className="contact-success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <pre className="contact-success__pre">
{`  ✓ message queued
  ✓ delivered to inbox
  ✓ awaiting reply ...`}
              </pre>
              <button type="button" className="contact-success__btn" onClick={handleReset}>
                $ send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              {/* name */}
              <motion.div
                className="contact-form__field"
                variants={fieldVariant(0)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
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
              </motion.div>

              {/* email */}
              <motion.div
                className="contact-form__field"
                variants={fieldVariant(1)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
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
              </motion.div>

              {/* message */}
              <motion.div
                className="contact-form__field contact-form__field--full"
                variants={fieldVariant(2)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
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
              </motion.div>

              {/* submit */}
              <motion.div
                className="contact-form__actions"
                variants={fieldVariant(3)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <button
                  type="submit"
                  className="contact-form__submit"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? '$ sending ...' : '$ send --message'}
                </button>
              </motion.div>

              {status === 'error' && (
                <motion.div
                  className="contact-error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  failed to send. try again.
                </motion.div>
              )}
            </form>
          )}
        </RevealOnScroll>

        {/* Footer: socials */}
        <RevealOnScroll delay={0.1}>
          <div className="contact-footer">
            <div className="contact-footer__left">
              <TypingLine text="ls ./socials" wrapperClassName="contact-footer__prompt">
                <span className="contact-footer__prompt-cmd">ls </span>
                <span className="contact-footer__prompt-path">./socials</span>
              </TypingLine>
              <h3 className="contact-footer__heading">Find me on</h3>
            </div>

            <div className="contact-footer__socials">
              {me.links.map((l, i) => {
                const Icon = SOCIAL_ICONS[l.icon]
                return (
                  <motion.a
                    key={l.label}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-footer__icon-btn"
                    aria-label={l.label}
                    onClick={() => unlock('contact-made')}
                    initial={prefersReduced ? false : { opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={prefersReduced ? undefined : { y: -3, rotate: 5, transition: { duration: 0.7 } }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.08 }}
                  >
                    {Icon && <Icon size={15} />}
                  </motion.a>
                )
              })}
            </div>
          </div>
        </RevealOnScroll>

        {/* Download resume */}
        <RevealOnScroll delay={0.15}>
          <div className="contact-download">
            <a href={me.resume} download className="contact-download__btn" onClick={onResumeClick}>
              <Download size={15} />
              $ download resume.pdf
            </a>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  )
}
