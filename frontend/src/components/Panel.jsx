export default function Panel({ title, eyebrow, action, children, style }) {
  return (
    <div
      style={{
        background: 'var(--bg-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 22px',
        boxShadow: 'var(--shadow-panel)',
        ...style,
      }}
    >
      {(title || action) && (
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            {eyebrow && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 11,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                {eyebrow}
              </div>
            )}
            {title && (
              <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600 }}>
                {title}
              </h3>
            )}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}
