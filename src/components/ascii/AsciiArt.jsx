/**
 * Generic renderer for any piece in components/ascii/art.js
 */
export default function AsciiArt({
  art,
  color = 'var(--cyan)',
  glow,
  fontSize = 'clamp(9px, 1.8vw, 18px)',
  className = '',
  hideOnMobile = true,
}) {
  return (
    <pre
      className={`ascii-art ${hideOnMobile ? 'ascii-hide-mobile' : ''} ${className}`}
      style={{
        color,
        fontSize,
        lineHeight: 1,
        fontFamily: 'var(--font-mono)',
        whiteSpace: 'pre',
        overflowX: 'auto',
        textShadow: glow ? `0 0 18px ${glow}` : 'none',
        margin: 0,
      }}
    >
      {art.trim()}
    </pre>
  )
}
