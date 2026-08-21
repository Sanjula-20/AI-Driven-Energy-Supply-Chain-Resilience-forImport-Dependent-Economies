import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Badge from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';

const CATEGORY_LABEL = {
  PROCUREMENT: 'Procurement',
  RESERVE: 'Reserve',
  ROUTING: 'Routing',
  SUPPLIER: 'Supplier',
};

export default function Recommendations() {
  const { data, loading, error, refetch } = useApiData('/recommendations');

  return (
    <div>
      <PageHeader
        title="Recommendations"
        subtitle="Rule-based procurement, routing, and reserve guidance derived from current corridor, supplier, and reserve thresholds."
      />

      {loading && <LoadingState label="Generating recommendations…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.recommendations.map((r) => (
            <Panel key={r._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--accent-signal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {CATEGORY_LABEL[r.category]}
                  </span>
                  <h3 style={{ margin: '4px 0 0', fontFamily: 'var(--font-display)', fontSize: 16 }}>{r.title}</h3>
                </div>
                <Badge kind="risk" value={r.priority}>{r.priority}</Badge>
              </div>
              <p style={{ margin: '0 0 8px', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{r.description}</p>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>
                Triggered by: <span className="mono">{r.triggeredBy}</span> · <span className="demo-flag" style={{ marginLeft: 4 }}>Rule-based (V1)</span>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
