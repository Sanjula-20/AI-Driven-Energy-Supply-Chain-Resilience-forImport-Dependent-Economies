import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Badge from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';

export default function Events() {
  const { data, loading, error, refetch } = useApiData('/events');

  return (
    <div>
      <PageHeader
        title="Geopolitical Events"
        subtitle="Simulated intelligence feed of events affecting India's crude oil supply chain, feeding the geopolitical risk component."
      />

      {loading && <LoadingState label="Loading events…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {data.events.map((ev) => (
            <Panel key={ev._id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, gap: 12 }}>
                <div>
                  <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 16 }}>{ev.title}</h3>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {ev.region} · {new Date(ev.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <Badge kind="severity" value={ev.severity}>{ev.severity}</Badge>
              </div>
              <p style={{ margin: '0 0 10px', fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{ev.description}</p>
              <div style={{ display: 'flex', gap: 18, fontSize: 12, flexWrap: 'wrap' }}>
                {ev.affectedCorridor && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    Corridor: <span className="mono" style={{ color: 'var(--text-primary)' }}>{ev.affectedCorridor}</span>
                  </span>
                )}
                {ev.affectedSuppliers?.length > 0 && (
                  <span style={{ color: 'var(--text-muted)' }}>
                    Suppliers: <span style={{ color: 'var(--text-primary)' }}>{ev.affectedSuppliers.join(', ')}</span>
                  </span>
                )}
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
