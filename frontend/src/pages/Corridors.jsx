import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import RiskRing from '../components/RiskRing';
import Badge from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';

export default function Corridors() {
  const { data, loading, error, refetch } = useApiData('/corridors');

  return (
    <div>
      <PageHeader
        title="Shipping Corridor Monitoring"
        subtitle="Risk posture for the four maritime corridors carrying India's crude oil imports, weighted by supply dependency in the risk engine."
      />

      {loading && <LoadingState label="Loading corridors…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
          {data.corridors.map((c) => (
            <Panel key={c._id} eyebrow={c.currentStatus} title={c.name}>
              <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                <RiskRing score={c.riskScore} level={c.riskLevel} size={104} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                  <Row label="Supply dependency" value={`${c.supplyDependencyPercent}%`} />
                  <Row label="Disruption probability" value={`${c.disruptionProbabilityPercent}%`} />
                  <Row
                    label="Alternative route"
                    value={c.alternativeRouteAvailable ? 'Available' : 'Not available'}
                  />
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
      <span style={{ color: 'var(--text-muted)' }}>{label}</span>
      <span className="mono" style={{ color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
