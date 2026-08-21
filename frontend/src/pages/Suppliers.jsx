import useApiData from '../utils/useApiData';
import PageHeader from '../components/PageHeader';
import Panel from '../components/Panel';
import Badge from '../components/Badge';
import { LoadingState, ErrorState } from '../components/States';
import { levelFromScore, formatNumber } from '../utils/risk';

const STATUS_COLOR = {
  ACTIVE: 'var(--risk-low)',
  REDUCED: 'var(--risk-medium)',
  SUSPENDED: 'var(--risk-critical)',
};

export default function Suppliers() {
  const { data, loading, error, refetch } = useApiData('/suppliers');

  return (
    <div>
      <PageHeader
        title="Supplier Management"
        subtitle="Crude oil suppliers evaluated on capacity, price, risk, and reliability. Reliability discounts feed into the supplier risk component of the risk engine."
      />

      {loading && <LoadingState label="Loading suppliers…" />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {data && (
        <Panel>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                {['Supplier', 'Country', 'Capacity (kbpd)', 'Price ($/bbl)', 'Risk', 'Reliability', 'Status'].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.suppliers.map((s) => (
                <tr key={s._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={tdStyle}><strong>{s.name}</strong></td>
                  <td style={tdStyle}>{s.country}</td>
                  <td style={{ ...tdStyle }} className="mono">{formatNumber(s.supplyCapacityKbpd)}</td>
                  <td style={tdStyle} className="mono">${formatNumber(s.estimatedPriceUsdPerBarrel, 1)}</td>
                  <td style={tdStyle}>
                    <Badge kind="risk" value={levelFromScore(s.riskScore)}>{s.riskScore}</Badge>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 60, height: 6, background: 'var(--border-subtle)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${s.reliabilityScore}%`, height: '100%', background: 'var(--accent-signal)' }} />
                      </div>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{s.reliabilityScore}</span>
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ color: STATUS_COLOR[s.status], fontFamily: 'var(--font-mono)', fontSize: 11.5, textTransform: 'uppercase' }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
}

const thStyle = { padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 500, fontSize: 11.5, letterSpacing: '0.04em', textTransform: 'uppercase' };
const tdStyle = { padding: '12px 12px' };
