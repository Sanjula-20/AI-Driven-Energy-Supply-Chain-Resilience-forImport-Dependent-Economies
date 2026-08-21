import { severityColor, riskColor } from '../utils/risk';

/** kind: "severity" (INFO/WARNING/HIGH/CRITICAL) or "risk" (LOW/MEDIUM/HIGH/CRITICAL) */
export default function Badge({ children, kind = 'severity', value }) {
  const color = kind === 'risk' ? riskColor(value) : severityColor(value);
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color,
        background: `${color}1a`,
        border: `1px solid ${color}55`,
        borderRadius: 999,
        padding: '3px 9px',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: color }} />
      {children}
    </span>
  );
}
