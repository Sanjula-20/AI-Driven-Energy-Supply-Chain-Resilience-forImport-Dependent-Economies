import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Badge from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';

export default function Alerts() {
  const { data, loading, error, refetch } = useApiData('/alerts');

  return (
    <div>
      <PageHeader
        title="Alerts"
        subtitle="Active alerts derived from corridor risk, reserve coverage, and overall risk thresholds. INFO, WARNING, HIGH, and CRITICAL severities."
      />

      {loading && <LoadingState label="Loading alerts…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && data.alerts.length === 0 && (
        <Panel>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 13.5 }}>
            No active alerts. All monitored thresholds are currently within normal range.
          </p>
        </Panel>
      )}

      {data && data.alerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {data.alerts.map((a) => (
            <Panel key={a._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 15.5 }}>{a.title}</h3>
                <Badge kind="severity" value={a.severity}>{a.severity}</Badge>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: 'var(--text-secondary)' }}>{a.message}</p>
              <div style={{ marginTop: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
                Source: <span className="mono">{a.source}</span>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
