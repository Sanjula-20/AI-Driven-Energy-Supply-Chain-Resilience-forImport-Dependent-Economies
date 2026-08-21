import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import StatCard from '../components/StatCard';
import { LoadingState, ErrorState } from '../components/States';
import { formatNumber } from '../utils/risk';

const STATUS_COLOR = {
  HEALTHY: 'var(--risk-low)',
  CAUTION: 'var(--risk-medium)',
  CRITICAL: 'var(--risk-critical)',
};

export default function Reserves() {
  const { data, loading, error, refetch } = useApiData('/reserves');

  const fillPercent = data ? Math.round((data.currentReserveLevelMbbl / data.totalReserveCapacityMbbl) * 100) : 0;

  return (
    <div>
      <PageHeader
        title="Strategic Reserve Dashboard"
        subtitle="Current strategic petroleum reserve levels, daily consumption, and coverage against India's crude oil demand."
      />

      {loading && <LoadingState label="Loading reserve status…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 18 }}>
            <StatCard label="Total capacity" value={formatNumber(data.totalReserveCapacityMbbl, 1)} unit="M bbl" />
            <StatCard label="Current level" value={formatNumber(data.currentReserveLevelMbbl, 1)} unit="M bbl" accent="var(--accent-oil)" />
            <StatCard label="Daily consumption" value={formatNumber(data.dailyConsumptionMbbl, 2)} unit="M bbl/day" />
            <StatCard
              label="Coverage"
              value={formatNumber(data.estimatedCoverageDays, 1)}
              unit="days"
              accent={STATUS_COLOR[data.status]}
              sublabel={`Threshold: ${data.coverageThresholdDays} days`}
            />
          </div>

          <Panel eyebrow="Reservoir Level" title="Strategic Reserve Fill">
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  width: 90,
                  height: 200,
                  borderRadius: 10,
                  border: '2px solid var(--border-strong)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--bg-panel-raised)',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${fillPercent}%`,
                    background: `linear-gradient(180deg, ${STATUS_COLOR[data.status]}cc, ${STATUS_COLOR[data.status]}55)`,
                    transition: 'height 0.6s ease',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 15,
                    fontWeight: 700,
                  }}
                >
                  {fillPercent}%
                </div>
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', color: STATUS_COLOR[data.status] }}>
                  Status: {data.status}
                </div>
                <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Reserve is currently at {formatNumber(data.currentReserveLevelMbbl, 1)}M barrels of a{' '}
                  {formatNumber(data.totalReserveCapacityMbbl, 1)}M barrel capacity, covering an estimated{' '}
                  {formatNumber(data.estimatedCoverageDays, 1)} days of consumption at current daily usage.
                </p>
                <div
                  style={{
                    marginTop: 6,
                    padding: '12px 14px',
                    background: 'var(--bg-panel-raised)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                  }}
                >
                  <span style={{ fontSize: 11.5, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Recommended drawdown (rule-based, V1)
                  </span>
                  <div className="mono" style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>
                    {formatNumber(data.recommendedDrawdownMbblPerDay, 2)} M bbl / day
                  </div>
                </div>
              </div>
            </div>
          </Panel>
        </>
      )}
    </div>
  );
}
