export const RISK_COLORS = {
  LOW: 'var(--risk-low)',
  MEDIUM: 'var(--risk-medium)',
  HIGH: 'var(--risk-high)',
  CRITICAL: 'var(--risk-critical)',
};

export const SEVERITY_COLORS = {
  INFO: 'var(--severity-info)',
  WARNING: 'var(--severity-warning)',
  HIGH: 'var(--severity-high)',
  CRITICAL: 'var(--severity-critical)',
};

export function levelFromScore(score) {
  if (score <= 30) return 'LOW';
  if (score <= 60) return 'MEDIUM';
  if (score <= 80) return 'HIGH';
  return 'CRITICAL';
}

export function riskColor(level) {
  return RISK_COLORS[level] || 'var(--text-muted)';
}

export function severityColor(sev) {
  return SEVERITY_COLORS[sev] || 'var(--text-muted)';
}

export function formatNumber(n, decimals = 0) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—';
  return Number(n).toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
