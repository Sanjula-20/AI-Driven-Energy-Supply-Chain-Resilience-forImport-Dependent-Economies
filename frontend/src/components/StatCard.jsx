export default function StatCard({ label, value, unit, accent, sublabel }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
        }}
      >
        {label}
      </span>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 700,
            color: accent || 'var(--text-primary)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {unit && <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{unit}</span>}
      </span>
      {sublabel && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{sublabel}</span>}
    </div>
  );
}
