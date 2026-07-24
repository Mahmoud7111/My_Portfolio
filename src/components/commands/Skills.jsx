import { me } from '../../data/me'
import { SkillPill } from '../ui/SkillPill'

const GROUPS = [
  { key: 'webDevelopment', label: 'web development' },
  { key: 'languages',      label: 'languages' },
  { key: 'ai',             label: 'ai & ml' },
  { key: 'aiTools',        label: 'ai tools' },
  { key: 'SoftSkills',     label: 'soft skills' },
  { key: 'additional',     label: 'additional' },
]

export default function Skills() {
  return (
    <div className="cmd-output">
      <div style={{
        marginBottom: 16,
        padding: '6px 12px',
        background: 'rgba(77, 208, 206, 0.08)',
        borderLeft: '2px solid var(--cyan)',
        borderRadius: '0 4px 4px 0',
        display: 'inline-block'
      }}>
        <span style={{ color: 'var(--cyan)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
          // tip: hover over any technical skill to see what it means
        </span>
      </div>

      {GROUPS.map((g) => (
        <div key={g.key} style={{ marginBottom: 10 }}>
          <span style={{ color: 'var(--cyan)' }}>--{g.label}</span>
          <div style={{ marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {(me.skills[g.key] || []).map((skill) => (
              <SkillPill key={skill} skill={skill} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
