import { me } from '../data/me'
import { projects } from '../data/projects'

const allSkills = Object.values(me.skills).flat()

const stats = [
  { metric: 'projects',   value: projects.length,           note: 'shipped & maintained' },
  { metric: 'skills',     value: allSkills.length,          note: 'across 4 categories'  },
  { metric: 'languages',  value: me.skills.languages.length, note: 'writing code'         },
  { metric: 'frameworks', value: me.skills.frameworks.length, note: 'in production'        },
  { metric: 'years',      value: '5+',                      note: 'shipping code'         },
  { metric: 'ai_credits', value: '10+',                     note: 'certs & courses'       },
  { metric: 'status',     value: me.status,                 note: 'open to collaboration' },
]

// The introductory text shown below the ASCII hero on the terminal home tab,
// followed by scrollable portfolio sections inside the terminal body.
export default function HomeContent() {
  return (
    <div style={{ marginTop: 16 }}>
      {/* ── Intro ──────────────────────────────────────────────── */}
      <p style={{ color: 'var(--text-body)' }}>
        Welcome to my interactive portfolio terminal!
      </p>
      <p style={{ color: 'var(--text-body)' }}>
        You can learn everything you want about me by interacting with this
        terminal via typing commands,
      </p>
      <p style={{ color: 'var(--text-body)' }}>by using natural language in chat mode,</p>
      <p style={{ color: 'var(--text-body)', marginBottom: 16 }}>
        Or by simply selecting a tab from the menu above.
      </p>
      <p style={{ color: 'var(--text-muted)' }}>Type &apos;help&apos; to see available commands.</p>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>
        Type &apos;chat&apos; to open my AI chatbot for natural language questions.
      </p>

      {/* ── About panel ────────────────────────────────────────── */}
      <section className='about-panel' style={{ marginBottom: 40 }}>
        <div className='about-panel__chrome'>
          <span className='about-panel__title'>▍ intro.txt — tl;dr</span>
          <span className='about-panel__controls'>⌃ ⌄ ×</span>
        </div>
        <div className='about-panel__body'>
          <div className='about-panel__left'>
            <div className='about-panel__commands'>
              <span className='about-panel__cmd'>
                <span className='prompt-symbol'>$</span> cat intro.txt
              </span>
              <span className='about-panel__cmd'>
                <span className='prompt-symbol'>$</span> echo &quot;<span className='about-panel__var'>$ABOUT_ME</span>&quot;
              </span>
            </div>
            <p className='about-panel__bio'>{me.bio}</p>
            <p className='about-panel__tagline'>
              Software engineer &amp; AI student — building things at the
              intersection of code, design, and intelligence.
            </p>
          </div>
          <div className='about-panel__right'>
            <div className='about-panel__identity'>
              <div className='about-panel__identity-header'>┌─ identity ─</div>
              <div className='about-panel__identity-body'>
                {[
                  { key: 'name',   val: me.name,     cls: '' },
                  { key: 'role',   val: me.title,    cls: '' },
                  { key: 'loc',    val: me.location, cls: '' },
                  { key: 'status', val: me.status,   cls: 'about-panel__identity-val--status' },
                  { key: 'pgp',    val: '0x5F3E…A2B1', cls: '' },
                ].map(({ key, val, cls }) => (
                  <div key={key} className='about-panel__identity-row'>
                    <span className='about-panel__identity-key'>{key}</span>
                    <span className={`about-panel__identity-val ${cls}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats panel ────────────────────────────────────────── */}
      <section className='stats-panel' style={{ marginBottom: 40 }}>
        <div className='stats-panel__chrome'>
          <span className='stats-panel__title'>▍ stats.tsv — proof points</span>
          <span className='stats-panel__controls'>⌃ ⌄ ×</span>
        </div>
        <div className='stats-panel__body'>
          <div className='stats-panel__header-row'>
            <span className='stats-panel__col-metric'>metric</span>
            <span className='stats-panel__col-value'>value</span>
            <span className='stats-panel__col-note'>note</span>
          </div>
          {stats.map((s) => (
            <div key={s.metric} className='stats-panel__row'>
              <span className='stats-panel__col-metric stats-panel__metric'>{s.metric}</span>
              <span className='stats-panel__col-value stats-panel__value'>{s.value}</span>
              <span className='stats-panel__col-note stats-panel__note'># {s.note}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tech marquee ───────────────────────────────────────── */}
      <section className='tech-marquee-section' style={{ marginBottom: 40 }}>
        <div className='tech-marquee__header'>
          <span className='tech-marquee__label'>▍ tech_feed.log — real-time</span>
        </div>
        <div className='tech-marquee'>
          <div className='tech-marquee__track'>
            {[...allSkills, ...allSkills].map((skill, i) => (
              <span key={i} className='tech-marquee__item'>{skill}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured projects ───────────────────────────────────── */}
      <section style={{ marginBottom: 40 }}>
        <p className='section-opener'>
          <span className='prompt-symbol'>$</span> ls ~/projects/featured
        </p>
        <div className='projects-grid'>
          {projects
            .filter((p) => p.featured)
            .map((p) => (
              <div key={p.id} className='project-card'>
                <span className='cmd-name'>{p.name}</span>
                <p style={{ color: 'var(--text-body)', marginTop: 6 }}>{p.description}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                  {p.tags.map((tag) => (
                    <span key={tag} className='pill-coral-inline'>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* ── Contact CTA ─────────────────────────────────────────── */}
      <section className='cta-band' style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', letterSpacing: '-1px' }}>
          Let's build something.
        </h2>
        <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {me.links.map((l) => (
            <a
              key={l.label}
              href={l.url}
              target='_blank'
              rel='noreferrer'
              className='btn-outline'
            >
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
