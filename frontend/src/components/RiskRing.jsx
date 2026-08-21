import { riskColor } from '../utils/risk';

/**
 * The app's signature visual: a circular risk gauge used consistently
 * across the dashboard, corridors, suppliers, and scenario simulator.
 * A filled arc (0-100) in the tier color, with the score + level in the center.
 */
export default function RiskRing({ score = 0, level = 'LOW', size = 96, label }) {
  const stroke = Math.max(6, Math.round(size * 0.09));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, score));
  const dash = (pct / 100) * circumference;
  const color = riskColor(level);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`${label || 'Risk'} score ${score} out of 100, ${level}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono)"
          fontSize={size * 0.24}
          fontWeight="600"
          fill="var(--text-primary)"
        >
          {score}
        </text>
        <text
          x="50%"
          y="68%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontFamily="var(--font-mono)"
          fontSize={size * 0.11}
          letterSpacing="0.06em"
          fill={color}
        >
          {level}
        </text>
      </svg>
      {label && (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)', textAlign: 'center' }}>{label}</span>
      )}
    </div>
  );
}
