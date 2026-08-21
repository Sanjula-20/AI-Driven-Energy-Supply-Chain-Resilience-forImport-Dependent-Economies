export default function PageHeader({ title, subtitle, showDemoFlag = true, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700 }}>{title}</h1>
          {showDemoFlag && <span className="demo-flag">Demo data</span>}
        </div>
        {subtitle && <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: 14, maxWidth: 640 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
